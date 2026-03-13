import { useState, useRef, useEffect } from 'react';
import { Send, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatConsoleProps {
  code: string;
  language: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function ChatConsole({ code, language }: ChatConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    let assistantSoFar = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          code,
          language,
        }),
      });

      if (!resp.ok || !resp.body) {
        if (resp.status === 429) {
          throw new Error('Rate limited. Please wait and try again.');
        }
        if (resp.status === 402) {
          throw new Error('Usage limit reached. Please add credits.');
        }
        throw new Error('Failed to get response');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: 'assistant', content: assistantSoFar }];
              });
            }
          } catch { /* partial JSON */ }
        }
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-card border-t border-border">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">AI Assistant</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-2" ref={scrollRef}>
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground py-4 text-center">
            Ask me about your code, bugs, or optimizations...
          </p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {msg.role === 'user' ? 'You' : 'AI'}
            </span>
            <div className={`mt-0.5 text-sm leading-relaxed ${msg.role === 'user' ? 'text-foreground' : 'text-muted-foreground'}`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_pre]:bg-background [&_pre]:p-2 [&_pre]:rounded [&_code]:text-primary [&_code]:font-mono [&_code]:text-xs">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <span className="font-mono text-xs">{msg.content}</span>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex items-center gap-2 py-2">
            <div className="h-3 w-3 animate-spin rounded-full border border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        )}
      </ScrollArea>

      <div className="flex gap-2 border-t border-border p-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about your code..."
          className="h-8 bg-background border-border text-sm font-mono"
          disabled={isLoading}
        />
        <Button size="sm" onClick={sendMessage} disabled={isLoading || !input.trim()} className="h-8 w-8 p-0">
          <Send className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
