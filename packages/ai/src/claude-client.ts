import { appkitTools } from './tools';
import { buildSystemPrompt, type AiContext } from './prompt-engine';

export interface Message {
  role: 'user' | 'assistant';
  content: string | any[];
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface StreamEvent {
  type: 'text' | 'tool_use' | 'done' | 'error';
  text?: string;
  toolCall?: ToolCall;
  error?: string;
}

export async function* streamClaude(
  apiKey: string,
  messages: Message[],
  context: AiContext,
  model: string = 'claude-sonnet-4-6',
): AsyncGenerator<StreamEvent> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: buildSystemPrompt(context),
      tools: appkitTools,
      messages,
      stream: true,
    }),
  });

  if (!response.ok) {
    yield { type: 'error', error: `API error: ${response.status} ${response.statusText}` };
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield { type: 'error', error: 'No response body' };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') {
        yield { type: 'done' };
        return;
      }
      try {
        const event = JSON.parse(data);
        if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
          yield { type: 'text', text: event.delta.text };
        }
        if (event.type === 'content_block_start' && event.content_block?.type === 'tool_use') {
          yield {
            type: 'tool_use',
            toolCall: {
              id: event.content_block.id,
              name: event.content_block.name,
              input: {},
            },
          };
        }
        if (event.type === 'message_stop') {
          yield { type: 'done' };
        }
      } catch {
        // Skip malformed JSON
      }
    }
  }
  yield { type: 'done' };
}
