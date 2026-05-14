export type SSEEventType =
  | 'message_sent'
  | 'message_edited'
  | 'message_deleted'
  | 'member_joined'
  | 'member_left'
  | 'member_updated'
  | 'conversation_updated'
  | 'typing_start'
  | 'typing_stop';

interface SSEEventHandlers {
  [key: string]: Set<(...args: unknown[]) => void>;
}

const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1';

class SSEManager {
  private es: EventSource | null = null;
  private handlers: SSEEventHandlers = {};
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private currentToken: string | null = null;
  private isConnecting = false;

  connect(token: string) {
    if (this.isConnecting || (this.es && this.es.readyState === EventSource.OPEN)) {
      return;
    }

    if (this.es) {
      this.es.close();
      this.es = null;
    }

    this.isConnecting = true;
    this.currentToken = token;

    try {
      this.es = new EventSource(
        `${API_BASE}/events?token=${encodeURIComponent(token)}`
      );

      this.es.onopen = () => {
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const eventType = data.type as SSEEventType;
          const payload = data.payload || data;

          if (this.handlers[eventType]) {
            this.handlers[eventType].forEach(handler => {
              try {
                handler(payload);
              } catch (error) {
                console.error(`Error in SSE handler for ${eventType}:`, error);
              }
            });
          }
        } catch (error) {
          if ((error as Error).name !== 'SyntaxError') {
            console.error('Failed to parse SSE message:', error);
          }
        }
      };

      this.es.onerror = () => {
        this.isConnecting = false;
        this.disconnect();

        if (this.reconnectAttempts < this.maxReconnectAttempts && this.currentToken) {
          setTimeout(() => {
            this.reconnectAttempts++;
            if (this.currentToken) {
              this.connect(this.currentToken);
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      this.isConnecting = false;
      console.error('Failed to connect SSE:', error);
    }
  }

  disconnect() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
    this.currentToken = null;
    this.isConnecting = false;
  }

  isConnected(): boolean {
    return this.es !== null && this.es.readyState === EventSource.OPEN;
  }

  on(type: SSEEventType, handler: (...args: unknown[]) => void) {
    if (!this.handlers[type]) {
      this.handlers[type] = new Set();
    }
    this.handlers[type].add(handler);
  }

  off(type: SSEEventType, handler: (...args: unknown[]) => void) {
    if (this.handlers[type]) {
      this.handlers[type].delete(handler);
    }
  }

  once(type: SSEEventType, handler: (...args: unknown[]) => void) {
    const wrappedHandler = (...args: unknown[]) => {
      handler(...args);
      this.off(type, wrappedHandler);
    };
    this.on(type, wrappedHandler);
  }

  removeAllHandlers(type?: SSEEventType) {
    if (type) {
      if (this.handlers[type]) {
        this.handlers[type].clear();
      }
    } else {
      Object.keys(this.handlers).forEach(key => {
        this.handlers[key].clear();
      });
    }
  }
}

export const sseManager = new SSEManager();
