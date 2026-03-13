import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Bug, ArrowLeft, Activity, Target, AlertTriangle, TrendingUp, Code2, Calendar, ClipboardCopy, ExternalLink, Terminal } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from 'sonner';

interface AnalysisRow {
  id: string;
  quality_score: number | null;
  created_at: string;
  language: string;
  code: string;
}

interface IssueRow {
  severity: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisRow[]>([]);
  const [issues, setIssues] = useState<IssueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisRow | null>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: a }, { data: i }] = await Promise.all([
        supabase.from('analyses').select('id, quality_score, created_at, language, code').order('created_at', { ascending: false }),
        supabase.from('issues').select('severity'),
      ]);
      setAnalyses(a || []);
      setIssues(i || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const totalScans = analyses.length;
  const totalBugs = issues.length;
  const avgScore = totalScans > 0 ? Math.round(analyses.reduce((s, a) => s + (a.quality_score || 0), 0) / totalScans) : 0;

  const severityData = [
    { name: 'Errors', count: issues.filter(i => i.severity === 'error').length, color: 'hsl(var(--destructive))' },
    { name: 'Warnings', count: issues.filter(i => i.severity === 'warning').length, color: 'hsl(var(--warning))' },
    { name: 'Suggestions', count: issues.filter(i => i.severity === 'suggestion').length, color: 'hsl(var(--success))' },
  ];

  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const count = analyses.filter(a => a.created_at.startsWith(dateStr)).length;
    return { day: label, scans: count };
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-4 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Bug className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold">CodeStrix Analytics</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate('/ide')} className="h-8 gap-2 bg-background/50 backdrop-blur-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Workspace
        </Button>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Activity className="h-5 w-5 text-primary" />} label="Total Scans" value={totalScans} delay={100} />
          <StatCard icon={<AlertTriangle className="h-5 w-5 text-destructive" />} label="Total Bugs" value={totalBugs} delay={200} />
          <StatCard icon={<Target className="h-5 w-5 text-success" />} label="Avg Score" value={`${avgScore}/100`} delay={300} />
          <StatCard icon={<TrendingUp className="h-5 w-5 text-warning" />} label="Languages" value={new Set(analyses.map(a => a.language)).size} delay={400} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bug Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                  {severityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl border border-border/50 bg-card/30 p-6 backdrop-blur-sm">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Daily Scan Activity</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 4, strokeWidth: 2, stroke: 'hsl(var(--background))' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Scan History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold tracking-tight">Recent Scan History</h3>
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Showing last 10 scans</span>
          </div>

          {analyses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Code2 className="mx-auto h-10 w-10 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No analysis history found. Start by scanning some code in the IDE.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyses.slice(0, 10).map((a) => (
                <HistoryCard key={a.id} analysis={a} onClick={() => setSelectedAnalysis(a)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedAnalysis} onOpenChange={(open) => !open && setSelectedAnalysis(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden border-border bg-card shadow-2xl">
          {selectedAnalysis && (
            <>
              <DialogHeader className="p-6 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                      <Code2 className="h-6 w-6 text-primary" />
                      Analysis Details
                    </DialogTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-mono capitalize">
                        <Terminal className="h-3.5 w-3.5" />
                        {selectedAnalysis.language}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(selectedAnalysis.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className={`text-3xl font-black ${(selectedAnalysis.quality_score ?? 0) >= 70 ? 'text-success' : (selectedAnalysis.quality_score ?? 0) >= 40 ? 'text-warning' : 'text-destructive'}`}>
                    {selectedAnalysis.quality_score ?? '—'}<span className="text-sm font-medium opacity-50 ml-1">/100</span>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col p-6 bg-background space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    Source Code
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => copyCode(selectedAnalysis.code)} className="h-8 gap-2 text-xs">
                    <ClipboardCopy className="h-3.5 w-3.5" /> Copy Code
                  </Button>
                </div>
                
                <div className="flex-1 rounded-xl border border-border bg-muted/10 overflow-hidden flex flex-col shadow-inner">
                  <ScrollArea className="flex-1">
                    <pre className="p-5 font-mono text-sm leading-relaxed overflow-x-auto whitespace-pre">
                      <code>{selectedAnalysis.code}</code>
                    </pre>
                  </ScrollArea>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="outline" onClick={() => {
                    // Logic to load into IDE could go here
                    navigate('/ide');
                    toast.info('Feature coming soon: Reloading specific snapshot into IDE');
                  }} className="gap-2">
                    <ExternalLink className="h-4 w-4" /> Load in Workspace
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HistoryCard({ analysis, onClick }: { analysis: AnalysisRow; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between rounded-2xl border border-border/50 bg-card/20 p-5 text-left transition-all hover:bg-card hover:border-primary/50 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background border border-border/50 group-hover:bg-primary/5 transition-colors">
          <Code2 className="h-6 w-6 text-primary/70 group-hover:text-primary transition-colors" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">
              {analysis.language}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="text-xs text-muted-foreground">
              {new Date(analysis.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="text-sm font-semibold truncate max-w-[180px] text-foreground">
            {analysis.code ? analysis.code.split('\n')[0].substring(0, 30) || 'Untitled Scan' : 'Empty Scan'}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`text-lg font-black ${(analysis.quality_score ?? 0) >= 70 ? 'text-success' : (analysis.quality_score ?? 0) >= 40 ? 'text-warning' : 'text-destructive'}`}>
          {analysis.quality_score ?? '—'}
        </div>
        <div className="text-[10px] uppercase font-bold text-muted-foreground opacity-50 tracking-tighter">Score</div>
      </div>
    </button>
  );
}

function StatCard({ icon, label, value, delay = 0 }: { icon: React.ReactNode; label: string; value: string | number; delay?: number }) {
  return (
    <div 
      className="rounded-2xl border border-border/30 bg-card/20 p-6 backdrop-blur-sm shadow-sm transition-all hover:shadow-xl hover:border-primary/20 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-background rounded-xl border border-border/50 shadow-sm">
          {icon}
        </div>
        <span className="text-sm font-semibold text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-black tracking-tight text-foreground">{value}</div>
    </div>
  );
}

import { ScrollArea } from '@/components/ui/scroll-area';

