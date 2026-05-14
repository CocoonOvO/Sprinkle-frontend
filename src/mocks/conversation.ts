import type { Conversation, Member } from '../types';
import { userMock } from './auth';

const mockConversations: Conversation[] = [
  {
    id: 'conv_1',
    type: 'direct',
    owner_id: 'user_1',
    metadata: { name: 'Bob Wang' },
    created_at: '2024-06-01T09:00:00Z',
    updated_at: '2024-06-15T14:30:00Z',
    member_count: 2,
  },
  {
    id: 'conv_2',
    type: 'direct',
    owner_id: 'user_1',
    metadata: { name: 'AI Assistant' },
    created_at: '2024-06-02T10:00:00Z',
    updated_at: '2024-06-15T15:00:00Z',
    member_count: 2,
  },
  {
    id: 'conv_3',
    type: 'direct',
    owner_id: 'user_2',
    metadata: { name: 'Carol Zhang' },
    created_at: '2024-06-03T11:00:00Z',
    updated_at: '2024-06-15T16:00:00Z',
    member_count: 2,
  },
  {
    id: 'conv_4',
    type: 'group',
    name: 'Engineering Team',
    owner_id: 'user_1',
    metadata: { description: 'Main engineering team channel' },
    created_at: '2024-05-01T08:00:00Z',
    updated_at: '2024-06-15T17:00:00Z',
    member_count: 5,
  },
  {
    id: 'conv_5',
    type: 'group',
    name: 'Project Alpha',
    owner_id: 'user_2',
    metadata: { description: 'Alpha project discussion' },
    created_at: '2024-05-15T09:00:00Z',
    updated_at: '2024-06-15T18:00:00Z',
    member_count: 4,
  },
  {
    id: 'conv_6',
    type: 'group',
    name: 'AI Agents Testing',
    owner_id: 'user_1',
    metadata: { description: 'Testing channel for AI agents' },
    created_at: '2024-06-10T12:00:00Z',
    updated_at: '2024-06-15T19:00:00Z',
    member_count: 4,
  },
];

const mockMembers: Member[] = [
  { user_id: 'user_1', conversation_id: 'conv_1', role: 'member', joined_at: '2024-06-01T09:00:00Z', is_active: true },
  { user_id: 'user_2', conversation_id: 'conv_1', role: 'member', joined_at: '2024-06-01T09:00:00Z', is_active: true },
  { user_id: 'user_1', conversation_id: 'conv_2', role: 'member', joined_at: '2024-06-02T10:00:00Z', is_active: true },
  { user_id: 'agent_1', conversation_id: 'conv_2', role: 'member', joined_at: '2024-06-02T10:00:00Z', is_active: true },
  { user_id: 'user_2', conversation_id: 'conv_3', role: 'member', joined_at: '2024-06-03T11:00:00Z', is_active: true },
  { user_id: 'user_3', conversation_id: 'conv_3', role: 'member', joined_at: '2024-06-03T11:00:00Z', is_active: true },
  { user_id: 'user_1', conversation_id: 'conv_4', role: 'owner', joined_at: '2024-05-01T08:00:00Z', is_active: true },
  { user_id: 'user_2', conversation_id: 'conv_4', role: 'admin', joined_at: '2024-05-01T08:00:00Z', is_active: true },
  { user_id: 'user_3', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true },
  { user_id: 'agent_1', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true },
  { user_id: 'agent_2', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true },
  { user_id: 'user_2', conversation_id: 'conv_5', role: 'owner', joined_at: '2024-05-15T09:00:00Z', is_active: true },
  { user_id: 'user_3', conversation_id: 'conv_5', role: 'member', joined_at: '2024-05-15T09:00:00Z', is_active: true },
  { user_id: 'agent_1', conversation_id: 'conv_5', role: 'member', joined_at: '2024-05-15T09:00:00Z', is_active: true },
  { user_id: 'user_1', conversation_id: 'conv_6', role: 'owner', joined_at: '2024-06-10T12:00:00Z', is_active: true },
  { user_id: 'user_2', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true },
  { user_id: 'agent_1', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true },
  { user_id: 'agent_2', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true },
];

export const conversationMock = {
  getAll: async (): Promise<Conversation[]> => {
    await delay(200);
    return [...mockConversations];
  },
  getById: async (id: string): Promise<Conversation | null> => {
    await delay(100);
    return mockConversations.find(c => c.id === id) || null;
  },
  create: async (data: { type: 'direct' | 'group'; name?: string; member_ids: string[] }): Promise<Conversation> => {
    await delay(300);
    const newConv: Conversation = {
      id: `conv_${Date.now()}`,
      type: data.type,
      name: data.name,
      owner_id: 'user_1',
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_count: data.member_ids.length + 1,
    };
    mockConversations.push(newConv);
    return newConv;
  },
  getMembers: async (conversationId: string): Promise<Member[]> => {
    await delay(150);
    const members = mockMembers.filter(m => m.conversation_id === conversationId);
    const membersWithUser = await Promise.all(
      members.map(async m => ({
        ...m,
        user: (await userMock.getById(m.user_id)) || undefined,
      }))
    );
    return membersWithUser;
  },
  addMember: async (conversationId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<Member> => {
    await delay(200);
    const newMember: Member = {
      user_id: userId,
      conversation_id: conversationId,
      role,
      joined_at: new Date().toISOString(),
      is_active: true,
      user: (await userMock.getById(userId)) || undefined,
    };
    mockMembers.push(newMember);
    return newMember;
  },
  removeMember: async (conversationId: string, userId: string): Promise<void> => {
    await delay(200);
    const index = mockMembers.findIndex(m => m.conversation_id === conversationId && m.user_id === userId);
    if (index !== -1) mockMembers.splice(index, 1);
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}