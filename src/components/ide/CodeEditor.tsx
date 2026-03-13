import Editor, { OnMount } from '@monaco-editor/react';
import { useRef, useEffect } from 'react';
import type * as Monaco from 'monaco-editor';
import { useTheme } from '@/components/ThemeProvider';

interface Issue {
  line: number;
  type: string;
  severity: string;
  description: string;
  fix: string | null;
}

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string) => void;
  issues: Issue[];
}

const severityToSeverity = (severity: string): Monaco.MarkerSeverity => {
  switch (severity) {
    case 'error': return 8;
    case 'warning': return 4;
    default: return 2;
  }
};

export default function CodeEditor({ code, language, onChange, issues }: CodeEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof Monaco | null>(null);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('bugdetector-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'FF7B72' },
        { token: 'string', foreground: 'A5D6FF' },
        { token: 'number', foreground: '79C0FF' },
        { token: 'type', foreground: 'FFA657' },
      ],
      colors: {
        'editor.background': '#0E1117',
        'editor.foreground': '#E6EDF3',
        'editor.lineHighlightBackground': '#161B2240',
        'editorLineNumber.foreground': '#484F58',
        'editorLineNumber.activeForeground': '#E6EDF3',
        'editor.selectionBackground': '#3B82F640',
        'editorCursor.foreground': '#3B82F6',
      },
    });

    monaco.editor.defineTheme('bugdetector-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6E7781', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'CF222E' },
        { token: 'string', foreground: '0A3069' },
        { token: 'number', foreground: '0550AE' },
        { token: 'type', foreground: '953800' },
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#24292F',
        'editor.lineHighlightBackground': '#F6F8FA40',
        'editorLineNumber.foreground': '#8C959F',
        'editorLineNumber.activeForeground': '#24292F',
        'editor.selectionBackground': '#BBDFFF40',
        'editorCursor.foreground': '#0969DA',
      },
    });
    
    // Initial theme set handled by useEffect
  };

  useEffect(() => {
    if (monacoRef.current) {
      const activeTheme = theme === 'dark' ? 'bugdetector-dark' : 'bugdetector-light';
      monacoRef.current.editor.setTheme(activeTheme);
    }
  }, [theme]);

  useEffect(() => {
    if (!monacoRef.current || !editorRef.current) return;
    const monaco = monacoRef.current;
    const model = editorRef.current.getModel();
    if (!model) return;

    const markers: Monaco.editor.IMarkerData[] = issues.map((issue) => ({
      severity: severityToSeverity(issue.severity),
      message: issue.description,
      startLineNumber: issue.line,
      startColumn: 1,
      endLineNumber: issue.line,
      endColumn: model.getLineMaxColumn(issue.line) || 1,
    }));

    monaco.editor.setModelMarkers(model, theme === 'dark' ? 'bugdetector-dark' : 'bugdetector-light', markers);
  }, [issues, theme]);

  useEffect(() => {
    const handleFormat = () => {
      editorRef.current?.getAction('editor.action.formatDocument')?.run();
    };
    window.addEventListener('formatActiveCode', handleFormat);
    return () => window.removeEventListener('formatActiveCode', handleFormat);
  }, []);

  const monacoLang = language === 'c++' ? 'cpp' : language;

  return (
    <Editor
      height="100%"
      language={monacoLang}
      value={code}
      onChange={(val) => onChange(val || '')}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 16 },
        lineNumbers: 'on',
        renderLineHighlight: 'line',
        bracketPairColorization: { enabled: true },
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        tabSize: 2,
      }}
      loading={
        <div className="flex h-full items-center justify-center bg-background">
          <span className="text-muted-foreground text-sm">Loading editor...</span>
        </div>
      }
    />
  );
}
