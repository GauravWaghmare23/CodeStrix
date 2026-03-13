import { AlertTriangle, XCircle, Info, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Issue {
  line: number;
  type: string;
  severity: string;
  description: string;
  fix: string | null;
}

interface IssuePanelProps {
  issues: Issue[];
  qualityScore: number | null;
  onApplyFix: (issue: Issue) => void;
  loading: boolean;
}

const severityIcon = (severity: string) => {
  switch (severity) {
    case 'error': return <XCircle className="h-4 w-4 text-destructive shrink-0" />;
    case 'warning': return <AlertTriangle className="h-4 w-4 text-warning shrink-0" />;
    default: return <Info className="h-4 w-4 text-success shrink-0" />;
  }
};

const severityBorder = (severity: string) => {
  switch (severity) {
    case 'error': return 'border-l-destructive';
    case 'warning': return 'border-l-warning';
    default: return 'border-l-success';
  }
};

export default function IssuePanel({ issues, qualityScore, onApplyFix, loading }: IssuePanelProps) {
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const suggestions = issues.filter(i => i.severity === 'suggestion').length;

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Issues</h2>
        {qualityScore !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Score</span>
            <span className={`text-sm font-bold ${qualityScore >= 70 ? 'text-success' : qualityScore >= 40 ? 'text-warning' : 'text-destructive'}`}>
              {qualityScore}/100
            </span>
          </div>
        )}
      </div>

      {/* Summary */}
      {issues.length > 0 && (
        <div className="flex gap-4 border-b border-border px-4 py-2">
          {errors > 0 && <span className="flex items-center gap-1 text-xs text-destructive"><XCircle className="h-3 w-3" />{errors}</span>}
          {warnings > 0 && <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3 w-3" />{warnings}</span>}
          {suggestions > 0 && <span className="flex items-center gap-1 text-xs text-success"><Info className="h-3 w-3" />{suggestions}</span>}
        </div>
      )}

      {/* Issues list */}
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="ml-2 text-sm text-muted-foreground">Analyzing...</span>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <Info className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No issues found. Click "Analyze" to scan your code.</p>
          </div>
        ) : (
          <div className="space-y-2 p-3">
            {issues.map((issue, i) => (
              <div key={i} className={`rounded-md border border-border bg-background p-3 border-l-2 ${severityBorder(issue.severity)}`}>
                <div className="flex items-start gap-2">
                  {severityIcon(issue.severity)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">Line {issue.line}</span>
                      <span className="text-xs text-muted-foreground capitalize">• {issue.type}</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{issue.description}</p>
                    {issue.fix && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-7 gap-1 text-xs"
                        onClick={() => onApplyFix(issue)}
                      >
                        <Wrench className="h-3 w-3" /> Apply Fix
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
