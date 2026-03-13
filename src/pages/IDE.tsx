import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bug, Play, Wand2, LogOut, BarChart3, ChevronDown, ChevronUp, Sun, Moon, AlignLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useTheme } from "@/components/ThemeProvider";
import CodeEditor from '@/components/ide/CodeEditor';
import IssuePanel from '@/components/ide/IssuePanel';
import ChatConsole from '@/components/ide/ChatConsole';
import Sidebar from '@/components/ide/Sidebar';

interface Issue {
  line: number;
  type: string;
  severity: string;
  description: string;
  fix: string | null;
}

const DEFAULT_CODE: Record<string, string> = {
  javascript: `// Welcome to AI Bug Detector IDE
function fibonacci(n) {
  if (n <= 0) return 0;
  if (n == 1) return 1;
  
  let result = fibonacci(n - 1) + fibonacci(n - 2);
  return result;
}

// Try analyzing this code for performance issues
console.log(fibonacci(40));
`,
  python: `# Welcome to AI Bug Detector IDE
def fibonacci(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    
    result = fibonacci(n - 1) + fibonacci(n - 2)
    return result

# Try analyzing this code for performance issues
print(fibonacci(40))
`,
  java: `// Welcome to AI Bug Detector IDE
public class Main {
    public static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        int result = fibonacci(n - 1) + fibonacci(n - 2);
        return result;
    }
    
    public static void main(String[] args) {
        System.out.println(fibonacci(40));
    }
}
`,
  'c++': `// Welcome to AI Bug Detector IDE
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    int result = fibonacci(n - 1) + fibonacci(n - 2);
    return result;
}

int main() {
    cout << fibonacci(40) << endl;
    return 0;
}
`,
};

export default function IDE() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(DEFAULT_CODE['javascript']);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [qualityScore, setQualityScore] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(true);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || '');
    setIssues([]);
    setQualityScore(null);
  };

  const analyzeCode = useCallback(async () => {
    if (!code.trim()) {
      toast.error('Write some code first');
      return;
    }
    setAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-code', {
        body: { code, language },
      });

      if (error) {
        console.warn('Supabase edge function failed, using mock data.', error);
        const mockResult = {
          issues: [
            { line: 1, type: 'Info', severity: 'suggestion', description: 'Mock suggestion: This is a fallback response as AI functions are unavailable offline.', fix: null },
            { line: 2, type: 'Performance', severity: 'warning', description: 'Mock warning: Evaluate algorithm complexity.', fix: null }
          ],
          qualityScore: 85
        };
        setIssues(mockResult.issues);
        setQualityScore(mockResult.qualityScore);
        toast.success(`Mock Analysis complete — Score: ${mockResult.qualityScore}/100`);
        setAnalyzing(false);
        return;
      }

      const result = data;
      setIssues(result.issues || []);
      setQualityScore(result.qualityScore ?? null);

      // Save to database
      if (user) {
        const { data: analysis, error: saveErr } = await supabase
          .from('analyses')
          .insert({ user_id: user.id, code, language, quality_score: result.qualityScore })
          .select()
          .single();

        if (!saveErr && analysis && result.issues?.length > 0) {
          await supabase.from('issues').insert(
            result.issues.map((issue: Issue) => ({
              analysis_id: analysis.id,
              line: issue.line,
              type: issue.type,
              severity: issue.severity,
              description: issue.description,
              fix: issue.fix,
            }))
          );
        }
      }

      toast.success(`Analysis complete — Score: ${result.qualityScore}/100`);
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [code, language, user]);

  const autoFix = useCallback(async () => {
    if (!code.trim()) return;
    setFixing(true);
    try {
      const { data, error } = await supabase.functions.invoke('auto-fix', {
        body: { code, language },
      });
      if (error) {
        console.warn('Supabase auto-fix failed, applying mock fix', error);
        const mockFixed = code + '\n// Mock Auto-Fix Applied: Code optimized fallback';
        setCode(mockFixed);
        setIssues([]);
        setQualityScore(null);
        toast.success('Mock Code fixed and optimized!');
        setFixing(false);
        return;
      }
      if (data?.fixedCode) {
        setCode(data.fixedCode);
        setIssues([]);
        setQualityScore(null);
        toast.success('Code fixed and optimized!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Auto-fix failed');
    } finally {
      setFixing(false);
    }
  }, [code, language]);

  const applyFix = (issue: Issue) => {
    if (!issue.fix) return;
    const lines = code.split('\n');
    if (issue.line >= 1 && issue.line <= lines.length) {
      lines[issue.line - 1] = issue.fix;
      setCode(lines.join('\n'));
      setIssues(prev => prev.filter(i => i !== issue));
      toast.success(`Fix applied at line ${issue.line}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-3">
          <Bug className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-foreground">AI Bug Detector</span>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="h-7 w-32 bg-card border-border text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c++">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={analyzeCode} disabled={analyzing} className="h-7 gap-1 text-xs">
            <Play className="h-3.5 w-3.5" />
            {analyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.dispatchEvent(new Event('formatActiveCode'))} className="h-7 gap-1 text-xs">
            <AlignLeft className="h-3.5 w-3.5" />
            Format
          </Button>
          <Button size="sm" variant="outline" onClick={autoFix} disabled={fixing} className="h-7 gap-1 text-xs">
            <Wand2 className="h-3.5 w-3.5" />
            {fixing ? 'Fixing...' : 'Auto-Fix'}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => navigate('/dashboard')} className="h-7 gap-1 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground">
            {theme === 'dark' ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleSignOut} className="h-7 gap-1 text-xs text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar Panel */}
          <Panel defaultSize={15} minSize={10} maxSize={30}>
            <Sidebar currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Editor */}
          <Panel defaultSize={55} minSize={30}>
            <div className="flex flex-1 flex-col h-full bg-background">
              <CodeEditor code={code} language={language} onChange={setCode} issues={issues} />
            </div>
          </Panel>
          <PanelResizeHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

          {/* Right Panel */}
          <Panel defaultSize={30} minSize={20}>
            <div className="flex flex-col h-full bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-card/50">
                <span className="text-xs font-semibold text-muted-foreground">AI Toolchain</span>
                <button
                  onClick={() => setConsoleOpen(!consoleOpen)}
                  className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {consoleOpen ? 'Hide Console' : 'Show Console'}
                  {consoleOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />}
                </button>
              </div>
              <PanelGroup direction="vertical">
                <Panel defaultSize={consoleOpen ? 50 : 100} minSize={30}>
                  <div className="h-full overflow-hidden">
                    <IssuePanel issues={issues} qualityScore={qualityScore} onApplyFix={applyFix} loading={analyzing} />
                  </div>
                </Panel>
                
                {consoleOpen && (
                  <>
                    <PanelResizeHandle className="h-1 bg-border hover:bg-primary/50 transition-colors" />
                    <Panel defaultSize={50} minSize={30}>
                      <div className="h-full overflow-hidden">
                        <ChatConsole code={code} language={language} />
                      </div>
                    </Panel>
                  </>
                )}
              </PanelGroup>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
