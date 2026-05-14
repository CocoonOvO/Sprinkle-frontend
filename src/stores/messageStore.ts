import { create } from 'zustand';
import type { Message } from '../types';
import { messageApi, MessageResponse } from '../api';

interface MessageState {
  messages: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, content: string, contentType?: 'text' | 'markdown') => Promise<Message>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  clearError: () => void;
}

const mapMessage = (m: MessageResponse): Message => ({
  id: m.id,
  conversation_id: m.conversation_id,
  sender_id: m.sender_id,
  content: m.content,
  content_type: m.content_type,
  attachments: m.attachments || [],
  mentions: m.mentions || [],
  reply_to: m.reply_to,
  is_deleted: m.is_deleted,
  created_at: m.created_at,
  edited_at: m.edited_at,
  deleted_at: m.deleted_at,
  deleted_by: m.deleted_by,
});

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: {},
  isLoading: false,
  error: null,

  loadMessages: async (conversationId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await messageApi.list(conversationId, { limit: 50 });
      const msgs = response.items.map(mapMessage);
      const { messages } = get();
      set({ messages: { ...messages, [conversationId]: msgs }, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  sendMessage: async (conversationId: string, content: string, contentType: 'text' | 'markdown' = 'text') => {
    set({ error: null });
    try {
      const response = await messageApi.send(conversationId, {
        content,
        content_type: contentType,
      });
      const newMessage = mapMessage(response);
      const { messages } = get();
      const convMessages = messages[conversationId] || [];
      set({ messages: { ...messages, [conversationId]: [...convMessages, newMessage] } });
      return newMessage;
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  editMessage: async (messageId: string, content: string) => {
    set({ error: null });
    try {
      const updated = await messageApi.update(messageId, { content });
      const mapped = mapMessage(updated);
      const { messages } = get();
      const updatedMessages: Record<string, Message[]> = {};
      for (const [convId, convMessages] of Object.entries(messages)) {
        updatedMessages[convId] = convMessages.map(m => (m.id === messageId ? mapped : m));
      }
      set({ messages: updatedMessages });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    set({ error: null });
    try {
      await messageApi.delete(messageId);
      const { messages } = get();
      const updatedMessages: Record<string, Message[]> = {};
      for (const [convId, convMessages] of Object.entries(messages)) {
        updatedMessages[convId] = convMessages.map(m =>
          m.id === messageId ? { ...m, is_deleted: true } : m
        );
      }
      set({ messages: updatedMessages });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));