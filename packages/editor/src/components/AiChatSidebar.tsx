import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { streamClaude, type Message, type StreamEvent } from '@appkit/ai';
import { useEditorStore } from '../store/editor-store';

export function AiChatSidebar() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('appkit-api-key') ?? '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toggleAiSidebar = useEditorStore((s) => s.toggleAiSidebar);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('appkit-api-key', key);
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming || !apiKey) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsStreaming(true);

    let assistantText = '';
    setMessages([...updatedMessages, { role: 'assistant', content: '' }]);

    try {
      const aiContext = {
          storeType: null,
          brandGuidelines: null,
          currentLayout: { pages: {}, theme: {} } as any,
          currentPage: '',
          selectedSectionId: null,
        };
      for await (const event of streamClaude(apiKey, updatedMessages, aiContext)) {
        if (event.type === 'text' && event.text) {
          assistantText += event.text;
          setMessages([...updatedMessages, { role: 'assistant', content: assistantText }]);
        }
        if (event.type === 'done') break;
        if (event.type === 'error') {
          assistantText = `Error: ${event.error}`;
          setMessages([...updatedMessages, { role: 'assistant', content: assistantText }]);
          break;
        }
      }
    } catch (err: any) {
      setMessages([...updatedMessages, { role: 'assistant', content: `Error: ${err.message}` }]);
    }

    setIsStreaming(false);
  };

  if (!apiKey) {
    return (
      <div className="h-full flex flex-col bg-ide-panel">
        <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
          <span className="text-[11px] font-semibold text-ide-text-bright">AI Assistant</span>
          <button onClick={toggleAiSidebar} className="p-1 text-ide-text-dim hover:text-ide-text-bright rounded">
            <X size={12} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-xs text-ide-text-muted mb-3">Enter your API key to chat with Claude</p>
          <input
            type="password"
            placeholder="sk-ant-..."
            onChange={(e) => handleApiKeyChange(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-ide-bg border border-ide-border rounded-lg text-ide-text-bright focus:border-ide-accent focus:outline-none"
          />
          <p className="text-[9px] text-ide-text-dim mt-2">Stored locally. Sent directly to Anthropic.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-ide-panel">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold text-ide-text-bright">AI Assistant</span>
        </div>
        <button onClick={toggleAiSidebar} className="p-1 text-ide-text-dim hover:text-ide-text-bright rounded">
          <X size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-ide px-3 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[12px] leading-relaxed rounded-lg px-3 py-2 ${
              msg.role === 'user'
                ? 'bg-ide-accent text-white ml-6'
                : 'bg-ide-surface text-ide-text-bright mr-4'
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content as string}</div>
          </div>
        ))}
        {isStreaming && messages.length > 0 && messages[messages.length - 1].content === '' && (
          <div className="flex items-center gap-1.5 text-[10px] text-ide-text-dim px-3">
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" />
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 rounded-full bg-ide-accent animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-2 border-t border-ide-border"
      >
        <div className="flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything..."
            disabled={isStreaming}
            className="flex-1 px-3 py-2 text-xs bg-ide-bg border border-ide-border rounded-lg text-ide-text-bright placeholder:text-ide-text-dim focus:border-ide-accent focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="p-2 bg-ide-accent text-white rounded-lg hover:opacity-90 disabled:opacity-30 transition-opacity"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}
