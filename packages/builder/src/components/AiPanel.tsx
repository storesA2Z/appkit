import React, { useState, useCallback } from 'react';
import { AiChatPanel, streamClaude, executeToolCall, type Message, type AiContext } from '@appkit/ai';
import { useAppkitStore } from '../store/appkit-store';

export function AiPanel() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('appkit:apiKey') || '');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const project = useAppkitStore((s) => s.project);
  const currentPage = useAppkitStore((s) => s.currentPage);
  const selectedSectionId = useAppkitStore((s) => s.selectedSectionId);
  const addSection = useAppkitStore((s) => s.addSection);
  const updateSection = useAppkitStore((s) => s.updateSection);
  const removeSection = useAppkitStore((s) => s.removeSection);
  const reorderSections = useAppkitStore((s) => s.reorderSections);
  const setTheme = useAppkitStore((s) => s.setTheme);
  const setMetadata = useAppkitStore((s) => s.setMetadata);
  const setPage = useAppkitStore((s) => s.setPage);

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem('appkit:apiKey', key);
  };

  const handleSend = useCallback(async (userMessage: string) => {
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    const context: AiContext = {
      storeType: null,
      brandGuidelines: null,
      currentLayout: project,
      currentPage,
      selectedSectionId,
    };

    const apiMessages: Message[] = newMessages.map((m) => ({ role: m.role, content: m.content }));

    let responseText = '';
    try {
      for await (const event of streamClaude(apiKey, apiMessages, context)) {
        if (event.type === 'text' && event.text) {
          responseText += event.text;
        }
        if (event.type === 'tool_use' && event.toolCall) {
          const storeActions = {
            addSection,
            updateSection,
            removeSection,
            reorderSections,
            setTheme,
            setMetadata,
            setPage,
            getState: () => ({ project: useAppkitStore.getState().project, currentPage: useAppkitStore.getState().currentPage }),
          };
          const result = executeToolCall(event.toolCall, storeActions);
          responseText += `\n[Used tool: ${event.toolCall.name}] ${result.result}\n`;
        }
        if (event.type === 'error') {
          responseText += `Error: ${event.error}`;
        }
      }
    } catch (err) {
      responseText = `Error: ${err}`;
    }

    setMessages([...newMessages, { role: 'assistant', content: responseText || 'Done!' }]);
    setIsLoading(false);
  }, [apiKey, messages, project, currentPage, selectedSectionId, addSection, updateSection, removeSection, reorderSections, setTheme, setMetadata, setPage]);

  return (
    <AiChatPanel
      apiKey={apiKey}
      onSend={handleSend}
      messages={messages}
      isLoading={isLoading}
      onApiKeyChange={handleApiKeyChange}
    />
  );
}
