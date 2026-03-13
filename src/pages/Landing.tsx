import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bug, ArrowRight, Shield, Zap, Sparkles, Terminal } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border/40 px-6 py-4 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-1.5 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
            <Bug className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase whitespace-nowrap">CodeStrix</span>
        </div>
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate('/docs')} className="text-sm font-medium hover:text-primary transition-colors">
            Documentation
          </Button>
          {user ? (
            <Button onClick={() => navigate('/ide')} className="shadow-lg shadow-primary/20">Go to IDE</Button>
          ) : (
            <Button onClick={() => navigate('/auth')} className="shadow-lg shadow-primary/20">Sign In</Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-32 sm:py-48">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-destructive/10 rounded-full mix-blend-multiply filter blur-[128px] animate-pulse delay-700" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-background via-background/50 to-background" />
          </div>
          
          <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary mb-10 border border-primary/20 animate-in fade-in slide-in-from-top-4 duration-1000">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Next Gen Analysis is Here</span>
            </div>
            
            <h1 className="text-5xl font-black tracking-tighter sm:text-8xl mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground via-foreground to-foreground/40 animate-in fade-in zoom-in-95 duration-1000 fill-mode-both">
              Clean Code, <br />
              Powered by <span className="text-primary">Intelligence</span>.
            </h1>
            
            <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
              CodeStrix is the professional IDE for modern developers. Detect vulnerabilities, refactor architecture, and chat with your codebase in real-time.
            </p>
            
            <div className="mt-12 flex items-center justify-center gap-x-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500 fill-mode-both">
              <Button size="lg" onClick={() => navigate(user ? '/ide' : '/auth')} className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/30 rounded-2xl transition-transform hover:scale-105 active:scale-95">
                Launch Workspace <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/docs')} className="h-14 px-10 text-lg font-bold bg-background/40 backdrop-blur-md border-border/60 rounded-2xl hover:bg-muted/50 transition-all">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-32 relative">
          <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-destructive" />}
                title="AI Neural Analysis"
                description="Go beyond basic linting. Our LLM-powered engine detects non-obvious logic flaws and race conditions with lethal accuracy."
                delay={200}
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-warning" />}
                title="Instant Refactor"
                description="One-click fixes that don't just patch bugs, but improve the overall design pattern of your entire file."
                delay={400}
              />
              <FeatureCard 
                icon={<Terminal className="h-8 w-8 text-primary" />}
                title="Interactive Runtime"
                description="Execute JavaScript directly in the browser with captured console output. Debugging has never been this fluid."
                delay={600}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default">
          <Bug className="h-5 w-5 text-primary/70" />
          <span className="font-bold tracking-tight uppercase">CodeStrix</span>
        </div>
        <p className="text-muted-foreground text-sm font-medium">Built for the future of software engineering. &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <div 
      className="group relative rounded-[2rem] border border-border/50 bg-card/10 p-10 transition-all hover:bg-card hover:border-primary/30 hover:shadow-2xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-12 duration-1000 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border/50 shadow-inner group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tight">{title}</h3>
      <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
      
      <div className="absolute bottom-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
        <Sparkles className="h-12 w-12 text-primary" />
      </div>
    </div>
  );
}
