import React, { useState, useRef, useEffect } from 'react';

export interface AiChatPanelProps {
  apiKey: string;
  onSend: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isLoading: boolean;
  onApiKeyChange: (key: string) => void;
}

const suggestions = [
  'Build me a fashion store home page',
  'Add a hero section with a summer sale',
  'Analyze my layout for conversion',
];

export function AiChatPanel({ apiKey, onSend, messages, isLoading, onApiKeyChange }: AiChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  if (!apiKey) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-blue-100 flex items-center justify-center mb-4">
          <span className="text-lg">&#10024;</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">AI Assistant</p>
        <p className="text-xs text-gray-500 mb-4 max-w-[220px]">
          Enter your Anthropic API key to build layouts with natural language.
        </p>
        <input
          type="password"
          placeholder="sk-ant-..."
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="w-full max-w-[240px] px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 transition-shadow"
        />
        <p className="text-[10px] text-gray-400 mt-2.5 max-w-[220px]">
          Key stays in your browser. Only sent directly to Anthropic.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <h3 className="text-sm font-semibold text-gray-900">AI Assistant</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2 animate-fade-in">
            <p className="text-xs text-gray-400 mb-3">Try one of these:</p>
            {suggestions.map((text) => (
              <button
                key={text}
                onClick={() => onSend(text)}
                className="block w-full text-left text-xs px-3 py-2.5 rounded-lg bg-gray-50 hover:bg-brand-50 hover:text-brand-700 text-gray-600 transition-colors border border-transparent hover:border-brand-200"
              >
                {text}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-[13px] leading-relaxed rounded-xl px-3.5 py-2.5 animate-slide-up ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white ml-8'
                : 'bg-gray-100 text-gray-800 mr-6'
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
            </div>
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want..."
            disabled={isLoading}
            className="flex-1 px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 disabled:opacity-50 transition-shadow"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 disabled:opacity-30 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
