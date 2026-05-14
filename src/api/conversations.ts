import { apiClient } from './client';

export interface ConversationResponse {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  owner_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  member_count: number;
}

export interface ConversationListResponse {
  items: ConversationResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateConversationRequest {
  type: 'direct' | 'group';
  name?: string;
  target_id?: string;
  member_ids?: string[];
  metadata?: Record<string, unknown>;
}

export interface UpdateConversationRequest {
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface MemberResponse {
  user_id: string;
  conversation_id: string;
  role: 'admin' | 'member';
  nickname?: string;
  joined_at: string;
  is_active: boolean;
}

export interface MemberListResponse {
  items: MemberResponse[];
  total: number;
}

export interface AddMemberRequest {
  user_id: string;
  role?: 'admin' | 'member';
  nickname?: string;
}

export const conversationApi = {
  list: async (params?: { limit?: number; offset?: number }): Promise<ConversationListResponse> => {
    return apiClient.get<ConversationListResponse>('/conversations', params);
  },

  get: async (conversationId: string): Promise<ConversationResponse> => {
    return apiClient.get<ConversationResponse>(`/conversations/${conversationId}`);
  },

  create: async (data: CreateConversationRequest): Promise<ConversationResponse> => {
    return apiClient.post<ConversationResponse>('/conversations', data);
  },

  update: async (conversationId: string, data: UpdateConversationRequest): Promise<ConversationResponse> => {
    return apiClient.put<ConversationResponse>(`/conversations/${conversationId}`, data);
  },

  delete: async (conversationId: string): Promise<void> => {
    return apiClient.delete(`/conversations/${conversationId}`) as Promise<void>;
  },

  listMembers: async (conversationId: string): Promise<MemberListResponse> => {
    return apiClient.get<MemberListResponse>(`/conversations/${conversationId}/members`);
  },

  addMember: async (conversationId: string, data: AddMemberRequest): Promise<MemberResponse> => {
    return apiClient.post<MemberResponse>(`/conversations/${conversationId}/members`, data);
  },

  updateMember: async (conversationId: string, userId: string, data: { role: 'admin' | 'member' }): Promise<MemberResponse> => {
    return apiClient.put<MemberResponse>(`/conversations/${conversationId}/members/${userId}`, data);
  },

  removeMember: async (conversationId: string, userId: string): Promise<void> => {
    return apiClient.delete(`/conversations/${conversationId}/members/${userId}`) as Promise<void>;
  },
};