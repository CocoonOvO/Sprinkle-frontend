// User
export interface AvatarInfo {
  file_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  url: string;
}

export interface User {
  id: string;
  username: string;
  display_name: string;
  user_type: 'user' | 'agent';
  avatar?: AvatarInfo;
  metadata: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

// Conversation
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  owner_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  member_count: number;
}

// Member
export interface Member {
  user_id: string;
  conversation_id: string;
  role: 'admin' | 'owner' | 'member';
  nickname?: string;
  joined_at: string;
  is_active: boolean;
  user?: User;
}

// Message
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'markdown' | 'image' | 'file';
  attachments: AttachmentInfo[];
  mentions: string[];
  reply_to?: string;
  is_deleted: boolean;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  deleted_by?: string;
  sender?: User;
}

// Attachment
export interface AttachmentInfo {
  file_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
}

// File
export interface File {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  conversation_id?: string;
  uploader_id: string;
  created_at: string;
  url?: string;
}

// AgentKey
export interface AgentKey {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  last_used_at?: string;
  is_active: boolean;
}

// API Request/Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface CreateConversationRequest {
  type: 'direct' | 'group';
  name?: string;
  member_ids: string[];
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  content_type: 'text' | 'markdown' | 'image' | 'file';
  attachments?: AttachmentInfo[];
  mentions?: string[];
  reply_to?: string;
}

export interface UpdateUserRequest {
  display_name?: string;
  avatar_id?: string;
  metadata?: Record<string, any>;
}
