import { apiClient } from './client';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  display_name?: string;
  is_agent?: boolean;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user_id: string;
}

export interface AvatarInfo {
  file_id: string;
  file_name: string;
  mime_type: string;
  file_size: number;
  url: string;
}

export interface UserResponse {
  id: string;
  username: string;
  display_name: string;
  user_type: 'user' | 'agent';
  avatar?: AvatarInfo;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  display_name: string;
  user_type: 'user' | 'agent';
  created_at: string;
}

export interface RefreshRequest {
  refresh_token: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    return apiClient.post<TokenResponse>('/auth/login', data);
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    return apiClient.post<RegisterResponse>('/auth/register', data);
  },

  refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
    return apiClient.post<TokenResponse>('/auth/refresh', data);
  },
};

export interface UserListResponse {
  items: UserResponse[];
  total: number;
  limit: number;
  offset: number;
}

export const userApi = {
  getMe: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>('/users/me');
  },

  getUser: async (userId: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/users/${userId}`);
  },

  listUsers: async (params?: { search?: string; user_type?: string; limit?: number; offset?: number }): Promise<UserListResponse> => {
    return apiClient.get<UserListResponse>('/users', params);
  },

  updateMe: async (data: { display_name?: string; metadata?: Record<string, unknown> }): Promise<UserResponse> => {
    return apiClient.put<UserResponse>('/users/me', data);
  },

  setAvatar: async (data: { file_id: string }): Promise<UserResponse> => {
    return apiClient.post<UserResponse>('/users/me/avatar', data);
  },

  removeAvatar: async (): Promise<{ message: string }> => {
    return apiClient.delete('/users/me/avatar') as Promise<{ message: string }>;
  },
};