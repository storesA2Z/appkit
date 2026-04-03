import React, { useState, useRef, useEffect } from 'react';

export interface AiChatPanelProps {
  apiKey: string;
  onSend: (message: string) => void;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  isLoading: boolean;
  onApiKeyChange: (key: string) => void;
}

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
      <div className="p-4 space-y-3">
        <div className="text-sm font-medium text-gray-700">Claude API Key</div>
        <p className="text-xs text-gray-500">Enter your Anthropic API key to enable AI assistance.</p>
        <input
          type="password"
          placeholder="sk-ant-..."
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-md"
        />
        <p className="text-xs text-gray-400">Your key stays in your browser. Never sent to any server except Anthropic.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <h3 className="font-semibold text-sm text-gray-700">AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-xs text-gray-400 space-y-2">
            <p>Try asking:</p>
            <button onClick={() => onSend('Build me a fashion store home page')} className="block w-full text-left px-2 py-1.5 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              "Build me a fashion store home page"
            </button>
            <button onClick={() => onSend('Add a hero section with a summer sale')} className="block w-full text-left px-2 py-1.5 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              "Add a hero section with a summer sale"
            </button>
            <button onClick={() => onSend('Analyze my layout for conversion')} className="block w-full text-left px-2 py-1.5 rounded bg-gray-50 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              "Analyze my layout for conversion"
            </button>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm rounded-lg px-3 py-2 ${
              msg.role === 'user'
                ? 'bg-blue-100 text-blue-900 ml-4'
                : 'bg-gray-100 text-gray-800 mr-4'
            }`}
          >
            <div className="text-xs font-medium mb-1 opacity-60">
              {msg.role === 'user' ? 'You' : 'AI'}
            </div>
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="animate-spin w-3 h-3 border-2 border-gray-300 border-t-blue-500 rounded-full" />
            Thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm border rounded-md disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800 disabled:opacity-30"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
