import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Bug, ArrowLeft, Activity, Target, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AnalysisRow {
  id: string;
  quality_score: number | null;
  created_at: string;
  language: string;
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

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [{ data: a }, { data: i }] = await Promise.all([
        supabase.from('analyses').select('id, quality_score, created_at, language').order('created_at', { ascending: false }),
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

  // Daily activity (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { weekday: 'short' });
    const count = analyses.filter(a => a.created_at.startsWith(dateStr)).length;
    return { day: label, scans: count };
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <div className="flex items-center gap-3">
          <Bug className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">Dashboard</span>
        </div>
        <Button size="sm" variant="outline" onClick={() => navigate('/ide')} className="h-7 gap-1 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to IDE
        </Button>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={<Activity className="h-4 w-4 text-primary" />} label="Total Scans" value={totalScans} />
          <StatCard icon={<AlertTriangle className="h-4 w-4 text-destructive" />} label="Total Bugs" value={totalBugs} />
          <StatCard icon={<Target className="h-4 w-4 text-success" />} label="Avg Score" value={`${avgScore}/100`} />
          <StatCard icon={<TrendingUp className="h-4 w-4 text-warning" />} label="Languages" value={new Set(analyses.map(a => a.language)).size} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-4">
          {/* Severity distribution */}
          <div className="rounded-md border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Bug Severity Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily activity */}
          <div className="rounded-md border border-border bg-card p-4">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Daily Scan Activity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', color: 'hsl(var(--foreground))' }} />
                <Line type="monotone" dataKey="scans" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent analyses */}
        <div className="rounded-md border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Recent Analyses</h3>
          {analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No analyses yet. Go analyze some code!</p>
          ) : (
            <div className="space-y-2">
              {analyses.slice(0, 10).map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded border border-border bg-background px-3 py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground capitalize">{a.language}</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-sm font-bold ${(a.quality_score ?? 0) >= 70 ? 'text-success' : (a.quality_score ?? 0) >= 40 ? 'text-warning' : 'text-destructive'}`}>
                    {a.quality_score ?? '—'}/100
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-md border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
}
