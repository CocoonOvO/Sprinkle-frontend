import { create } from 'zustand';
import type { User } from '../types';
import { apiClient, authApi, userApi } from '../api';

interface RegisterData {
  username: string;
  display_name?: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
  setAvatar: (fileId: string) => Promise<void>;
  removeAvatar: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (username: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const tokenResponse = await authApi.login({ username, password });
      apiClient.setToken(tokenResponse.access_token);
      localStorage.setItem('token', tokenResponse.access_token);
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);

      const user = await userApi.getMe();
      set({ user, token: tokenResponse.access_token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register({
        username: data.username,
        password: data.password,
        display_name: data.display_name,
      });

      const tokenResponse = await authApi.login({
        username: data.username,
        password: data.password,
      });

      apiClient.setToken(tokenResponse.access_token);
      localStorage.setItem('token', tokenResponse.access_token);
      localStorage.setItem('refresh_token', tokenResponse.refresh_token);

      const user = await userApi.getMe();
      set({ user, token: tokenResponse.access_token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    apiClient.setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: async (data: Partial<User>) => {
    try {
      const updated = await userApi.updateMe({
        display_name: data.display_name,
        metadata: data.metadata,
      });
      set({ user: { ...updated } as User });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  setAvatar: async (fileId: string) => {
    try {
      const updated = await userApi.setAvatar({ file_id: fileId });
      set({ user: { ...updated } as User });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  removeAvatar: async () => {
    try {
      await userApi.removeAvatar();
      const { user } = useAuthStore.getState();
      if (user) {
        set({ user: { ...user, avatar: undefined } });
      }
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));