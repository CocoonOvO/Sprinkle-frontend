import { apiClient } from './client';

export interface FileResponse {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  conversation_id?: string;
  uploader_id: string;
  created_at: string;
}

export const filesApi = {
  upload: async (file: File, conversationId?: string): Promise<FileResponse> => {
    return apiClient.uploadFile<FileResponse>('/files/upload', file, conversationId);
  },

  getUrl: (fileId: string): string => {
    const token = apiClient.getToken();
    return `${import.meta.env.VITE_API_BASE || '/api/v1'}/files/${fileId}${token ? `?token=${token}` : ''}`;
  },

  delete: async (fileId: string): Promise<void> => {
    return apiClient.delete(`/files/${fileId}`) as Promise<void>;
  },
};