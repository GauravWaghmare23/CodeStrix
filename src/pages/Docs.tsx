import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, Bug, Play, Wand2, Terminal, Shield } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Docs() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-card/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">CodeStrix Docs</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/')} className="h-9 gap-2 bg-background/50 hover:bg-muted active:scale-95 transition-all">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </header>

      {/* Main Content */}
      <ScrollArea className="flex-1">
        <main className="mx-auto max-w-4xl px-6 py-20 space-y-16">
          
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 className="text-4xl font-black tracking-tighter sm:text-6xl">Welcome to <span className="text-primary underline decoration-primary/20 underline-offset-8">CodeStrix</span>.</h1>
            <p className="text-muted-foreground leading-relaxed text-xl font-medium max-w-3xl">
              CodeStrix is an enterprise-grade utility designed to surface runtime anomalies, architectural debt, and security vulnerabilities using deep neural static analysis.
            </p>
          </section>

          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black tracking-tight whitespace-nowrap">Core Toolset</h2>
              <div className="h-px bg-border w-full" />
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <DocCard 
                icon={<Play className="h-6 w-6 text-primary" />}
                title="Neural Scan"
                description="Initiate a deep scan of your active buffer. Our engine maps control flow paths to identify non-obvious execution errors before you even hit save."
                delay={100}
              />
              <DocCard 
                icon={<Wand2 className="h-6 w-6 text-warning" />}
                title="Quantum Fix"
                description="Leverage automated refactoring. The AI doesn't just silence warnings—it reconstructs your code following industry-standard SOLID principles."
                delay={200}
              />
              <DocCard 
                icon={<Terminal className="h-6 w-6 text-success" />}
                title="Universal Context"
                description="Converse with your code via the AI Console. Ask for complex algorithm implementations or performance optimization strategies instantly."
                delay={300}
              />
              <DocCard 
                icon={<Bug className="h-6 w-6 text-destructive" />}
                title="Polyglot Support"
                description="Fully optimized for JavaScript, Python, Java, and C++. Full syntax-aware analysis for all major modern programming paradigms."
                delay={400}
              />
            </div>
          </section>

          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black tracking-tight whitespace-nowrap">Infrastructure Resilience</h2>
              <div className="h-px bg-border w-full" />
            </div>
            <div className="bg-muted/20 rounded-3xl p-10 border border-border/50 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="h-32 w-32" />
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground font-medium relative z-10">
                <strong className="text-foreground">Adaptive Fallback Integration:</strong> This workspace is architected for zero-downtime availability. If the Supabase Edge compute layer encounters rate-limiting or latency spikes, the IDE activates high-fidelity local simulation handlers. 
                <br /><br />
                These handlers ensure that your UX flow—animations, transitions, and layout feedback—remains consistent even in isolated environments.
              </p>
            </div>
          </section>
        </main>
      </ScrollArea>
    </div>
  );
}

function DocCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <div 
      className="rounded-3xl border border-border/50 bg-card/20 p-8 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="p-3 bg-background rounded-2xl border border-border/50 group-hover:scale-110 transition-transform shadow-inner">
          {icon}
        </div>
        <h3 className="text-xl font-black tracking-tight text-foreground">{title}</h3>
      </div>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
    </div>
  );
}
