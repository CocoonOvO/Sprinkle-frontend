import { apiClient } from './client';

export interface MessageResponse {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'markdown' | 'image' | 'file';
  attachments: AttachmentInfo[];
  metadata: Record<string, unknown>;
  mentions: string[];
  reply_to?: string;
  is_deleted: boolean;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface AttachmentInfo {
  file_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
}

export interface MessageListResponse {
  items: MessageResponse[];
  next_cursor?: string;
  has_more: boolean;
}

export interface SendMessageRequest {
  content: string;
  content_type?: 'text' | 'markdown' | 'image' | 'file';
  file_ids?: string[];
  mentions?: string[];
  reply_to?: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export const messageApi = {
  list: async (
    conversationId: string,
    params?: { limit?: number; before?: string; after?: string }
  ): Promise<MessageListResponse> => {
    return apiClient.get<MessageListResponse>(
      `/conversations/${conversationId}/messages`,
      params
    );
  },

  send: async (conversationId: string, data: SendMessageRequest): Promise<MessageResponse> => {
    return apiClient.post<MessageResponse>(
      `/conversations/${conversationId}/messages`,
      data
    );
  },

  update: async (messageId: string, data: UpdateMessageRequest): Promise<MessageResponse> => {
    return apiClient.put<MessageResponse>(`/messages/${messageId}`, data);
  },

  delete: async (messageId: string): Promise<void> => {
    return apiClient.delete(`/messages/${messageId}`) as Promise<void>;
  },
};