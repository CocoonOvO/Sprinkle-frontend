import { useCallback, useRef, useState } from 'react';

export interface StreamingMessage {
  id: string;
  content: string;
  isStreaming: boolean;
  conversationId: string;
  senderId: string;
  senderName: string;
}

interface StreamMessageOptions {
  conversationId: string;
  content: string;
  senderId: string;
  senderName: string;
  contentType?: 'text' | 'markdown';
  onChunk?: (chunk: string, fullContent: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

export function useStreamMessage() {
  const [streamingMessages, setStreamingMessages] = useState<Map<string, StreamingMessage>>(new Map());
  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const sendStreamMessage = useCallback(async (options: StreamMessageOptions): Promise<string> => {
    const {
      conversationId,
      content,
      senderId,
      senderName,
      contentType = 'text',
      onChunk,
      onComplete,
      onError,
    } = options;

    const messageId = `stream_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    setStreamingMessages(prev => {
      const next = new Map(prev);
      next.set(messageId, {
        id: messageId,
        content: '',
        isStreaming: true,
        conversationId,
        senderId,
        senderName,
      });
      return next;
    });

    const controller = new AbortController();
    abortControllers.current.set(messageId, controller);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${API_BASE}/conversations/${conversationId}/messages/stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ content, content_type: contentType, stream: true }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      if (!reader) {
        throw new Error('No reader available');
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.event === 'chunk') {
                setStreamingMessages(prev => {
                  const next = new Map(prev);
                  const msg = next.get(messageId);
                  if (msg) {
                    const newContent = msg.content + data.chunk;
                    msg.content = newContent;
                    onChunk?.(data.chunk, newContent);
                  }
                  return next;
                });
              } else if (data.event === 'stream_end') {
                setStreamingMessages(prev => {
                  const next = new Map(prev);
                  const msg = next.get(messageId);
                  if (msg) {
                    msg.content = data.full_content || msg.content;
                    msg.isStreaming = false;
                    onComplete?.(msg.content);
                  }
                  return next;
                });
              } else if (data.event === 'error') {
                throw new Error(data.message || 'Stream error');
              }
            } catch (parseError) {
              if ((parseError as Error).name !== 'SyntaxError') {
                throw parseError;
              }
            }
          }
        }
      }

      setStreamingMessages(prev => {
        const next = new Map(prev);
        const msg = next.get(messageId);
        if (msg) {
          msg.isStreaming = false;
        }
        return next;
      });
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setStreamingMessages(prev => {
          const next = new Map(prev);
          next.delete(messageId);
          return next;
        });
      } else {
        onError?.(error as Error);
        setStreamingMessages(prev => {
          const next = new Map(prev);
          const msg = next.get(messageId);
          if (msg) {
            msg.isStreaming = false;
          }
          return next;
        });
      }
    } finally {
      abortControllers.current.delete(messageId);
    }

    return messageId;
  }, []);

  const cancelStream = useCallback((messageId: string) => {
    const controller = abortControllers.current.get(messageId);
    if (controller) {
      controller.abort();
      abortControllers.current.delete(messageId);
    }
    setStreamingMessages(prev => {
      const next = new Map(prev);
      next.delete(messageId);
      return next;
    });
  }, []);

  const getStreamingMessage = useCallback((messageId: string) => {
    return streamingMessages.get(messageId);
  }, [streamingMessages]);

  const clearAllStreaming = useCallback(() => {
    abortControllers.current.forEach(controller => controller.abort());
    abortControllers.current.clear();
    setStreamingMessages(new Map());
  }, []);

  return {
    streamingMessages,
    sendStreamMessage,
    cancelStream,
    getStreamingMessage,
    clearAllStreaming,
  };
}
