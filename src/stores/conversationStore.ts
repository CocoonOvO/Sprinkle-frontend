import { create } from 'zustand';
import type { Conversation, Member, User } from '../types';
import { conversationApi, userApi } from '../api';

interface CreateConvData {
  type: 'direct' | 'group';
  name?: string;
  member_ids: string[];
}

interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  members: Member[];
  isLoading: boolean;
  loadingMembers: boolean;
  error: string | null;
  setCurrentConversation: (conv: Conversation | null) => void;
  loadConversations: () => Promise<void>;
  createConversation: (data: CreateConvData) => Promise<Conversation>;
  updateConversation: (conversationId: string, name: string) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  loadMembers: (conversationId: string) => Promise<void>;
  addMember: (conversationId: string, userId: string, role?: 'admin' | 'member') => Promise<void>;
  updateMember: (conversationId: string, userId: string, role: 'admin' | 'member') => Promise<void>;
  removeMember: (conversationId: string, userId: string) => Promise<void>;
  clearError: () => void;
}

const mapConversation = (c: any): Conversation => ({
  id: c.id,
  type: c.type,
  name: c.name,
  owner_id: c.owner_id,
  metadata: c.metadata || {},
  created_at: c.created_at,
  updated_at: c.updated_at,
  member_count: c.member_count || 0,
});

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  currentConversation: null,
  members: [],
  isLoading: false,
  loadingMembers: false,
  error: null,

  setCurrentConversation: (conv: Conversation | null) => {
    set({ currentConversation: conv, members: [] });
    if (conv) {
      get().loadMembers(conv.id);
    }
  },

  loadConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await conversationApi.list({ limit: 100 });
      const conversations = response.items.map(mapConversation);
      set({ conversations, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createConversation: async (data: CreateConvData) => {
    set({ isLoading: true, error: null });
    try {
      const created = await conversationApi.create({
        type: data.type,
        name: data.name,
        target_id: data.type === 'direct' ? data.member_ids?.[0] : undefined,
        member_ids: data.type === 'group' ? data.member_ids : undefined,
      });
      const newConv = mapConversation(created);
      const { conversations } = get();
      set({ conversations: [newConv, ...conversations], isLoading: false });
      return newConv;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateConversation: async (conversationId: string, name: string) => {
    try {
      const updated = await conversationApi.update(conversationId, { name });
      const { conversations, currentConversation } = get();
      const mapped = mapConversation(updated);
      set({
        conversations: conversations.map(c => c.id === conversationId ? mapped : c),
        currentConversation: currentConversation?.id === conversationId ? mapped : currentConversation,
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteConversation: async (conversationId: string) => {
    try {
      await conversationApi.delete(conversationId);
      const { conversations, currentConversation } = get();
      set({
        conversations: conversations.filter(c => c.id !== conversationId),
        currentConversation: currentConversation?.id === conversationId ? null : currentConversation,
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  loadMembers: async (conversationId: string) => {
    set({ loadingMembers: true, error: null });
    const startTime = Date.now();
    try {
      const response = await conversationApi.listMembers(conversationId);
      const membersWithUsers: Member[] = await Promise.all(
        response.items.map(async (m) => {
          const member: Member = {
            user_id: m.user_id,
            conversation_id: m.conversation_id,
            role: m.role,
            nickname: m.nickname,
            joined_at: m.joined_at,
            is_active: m.is_active,
          };
          try {
            const user = await userApi.getUser(m.user_id);
            member.user = user as User;
          } catch (e) {
            console.warn('Failed to fetch user details for', m.user_id);
          }
          return member;
        })
      );
      const elapsed = Date.now() - startTime;
      if (elapsed < 300) {
        await new Promise(resolve => setTimeout(resolve, 300 - elapsed));
      }
      set({ members: membersWithUsers, loadingMembers: false });
    } catch (error) {
      set({ error: (error as Error).message, loadingMembers: false });
    }
  },

  addMember: async (conversationId: string, userId: string, role: 'admin' | 'member' = 'member') => {
    try {
      const added = await conversationApi.addMember(conversationId, { user_id: userId, role });
      let newMember: Member = {
        user_id: added.user_id,
        conversation_id: added.conversation_id,
        role: added.role,
        nickname: added.nickname,
        joined_at: added.joined_at,
        is_active: added.is_active,
      };
      try {
        const user = await userApi.getUser(userId);
        newMember.user = user as User;
      } catch (e) {
        console.warn('Failed to fetch user details for', userId);
      }
      const { members } = get();
      set({ members: [...members, newMember] });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  updateMember: async (conversationId: string, userId: string, role: 'admin' | 'member') => {
    try {
      await conversationApi.updateMember(conversationId, userId, { role });
      const { members } = get();
      set({
        members: members.map(m =>
          m.user_id === userId ? { ...m, role } : m
        ),
      });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  removeMember: async (conversationId: string, userId: string) => {
    try {
      await conversationApi.removeMember(conversationId, userId);
      const { members } = get();
      set({ members: members.filter(m => m.user_id !== userId) });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));