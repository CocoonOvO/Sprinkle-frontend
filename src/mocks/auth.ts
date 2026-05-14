import type { User } from '../types';

const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'alice',
    display_name: 'Alice Chen',
    user_type: 'user',
    avatar: { file_id: 'avatar-1', file_name: 'alice.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: {},
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'user_2',
    username: 'bob',
    display_name: 'Bob Wang',
    user_type: 'user',
    avatar: { file_id: 'avatar-2', file_name: 'bob.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: {},
    created_at: '2025-01-02T00:00:00Z',
  },
  {
    id: 'agent_1',
    username: 'assistant',
    display_name: 'AI Assistant',
    user_type: 'agent',
    avatar: { file_id: 'avatar-3', file_name: 'assistant.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: {},
    created_at: '2025-01-03T00:00:00Z',
  },
];

const mockPasswords: Record<string, string> = {
  alice: 'password123',
  bob: 'password123',
  assistant: 'password123',
};

export const userMock = {
  getById: async (id: string): Promise<User | null> => {
    await delay(100);
    return mockUsers.find(u => u.id === id) || null;
  },
  getByUsername: async (username: string): Promise<User | null> => {
    await delay(100);
    return mockUsers.find(u => u.username === username) || null;
  },
  update: async (id: string, data: Partial<User>): Promise<User | null> => {
    await delay(200);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) return null;
    mockUsers[index] = { ...mockUsers[index], ...data };
    return mockUsers[index];
  },
};

let authUser: User | null = null;
let authToken: string | null = null;

export const authMock = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    await delay(500);
    const user = mockUsers.find(u => u.username === username);
    if (!user) throw new Error('Invalid credentials');
    if (mockPasswords[username] !== password) throw new Error('Invalid credentials');
    authUser = user;
    authToken = `mock-token-${user.id}-${Date.now()}`;
    return { user, token: authToken };
  },
  register: async (data: { username: string; display_name: string; password: string }): Promise<{ user: User; token: string }> => {
    await delay(500);
    const existingUser = mockUsers.find(u => u.username === data.username);
    if (existingUser) throw new Error('Username already exists');
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: data.username,
      display_name: data.display_name,
      user_type: 'user',
      metadata: {},
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    authUser = newUser;
    authToken = `mock-token-${newUser.id}-${Date.now()}`;
    return { user: newUser, token: authToken };
  },
  logout: async (): Promise<void> => {
    await delay(100);
    authUser = null;
    authToken = null;
  },
  getCurrentUser: (): { user: User | null; token: string | null } => {
    return { user: authUser, token: authToken };
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}