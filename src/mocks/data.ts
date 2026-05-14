import type { User, Conversation, Member, File, AttachmentInfo } from '../types';

export const users: User[] = [
  {
    id: 'user_1',
    username: 'alice',
    display_name: 'Alice Chen',
    user_type: 'user',
    avatar: { file_id: 'avatar_alice', file_name: 'alice.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: { email: 'alice@example.com', status: 'online' },
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'user_2',
    username: 'bob',
    display_name: 'Bob Wang',
    user_type: 'user',
    avatar: { file_id: 'avatar_bob', file_name: 'bob.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: { email: 'bob@example.com', status: 'away' },
    created_at: '2024-02-20T10:30:00Z',
  },
  {
    id: 'user_3',
    username: 'carol',
    display_name: 'Carol Zhang',
    user_type: 'user',
    avatar: { file_id: 'avatar_carol', file_name: 'carol.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: { email: 'carol@example.com', status: 'offline' },
    created_at: '2024-03-10T14:15:00Z',
  },
  {
    id: 'agent_1',
    username: 'assistant',
    display_name: 'AI Assistant',
    user_type: 'agent',
    avatar: { file_id: 'avatar_ai_assistant', file_name: 'assistant.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: {
      description: 'Your personal AI assistant',
      prompt: 'You are a helpful AI assistant specializing in answering questions.',
    },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'agent_2',
    username: 'code_helper',
    display_name: 'Code Helper',
    user_type: 'agent',
    avatar: { file_id: 'avatar_code_helper', file_name: 'code_helper.png', mime_type: 'image/png', file_size: 1024, url: '' },
    metadata: {
      description: 'Programming expert',
      prompt: 'You are a coding assistant that helps with programming questions.',
    },
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const conversations: Conversation[] = [
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

export const members: Member[] = [
  { user_id: 'user_1', conversation_id: 'conv_1', role: 'member', joined_at: '2024-06-01T09:00:00Z', is_active: true, user: users[0] },
  { user_id: 'user_2', conversation_id: 'conv_1', role: 'member', joined_at: '2024-06-01T09:00:00Z', is_active: true, user: users[1] },
  { user_id: 'user_1', conversation_id: 'conv_2', role: 'member', joined_at: '2024-06-02T10:00:00Z', is_active: true, user: users[0] },
  { user_id: 'agent_1', conversation_id: 'conv_2', role: 'member', joined_at: '2024-06-02T10:00:00Z', is_active: true, user: users[3] },
  { user_id: 'user_2', conversation_id: 'conv_3', role: 'member', joined_at: '2024-06-03T11:00:00Z', is_active: true, user: users[1] },
  { user_id: 'user_3', conversation_id: 'conv_3', role: 'member', joined_at: '2024-06-03T11:00:00Z', is_active: true, user: users[2] },
  { user_id: 'user_1', conversation_id: 'conv_4', role: 'owner', joined_at: '2024-05-01T08:00:00Z', is_active: true, user: users[0] },
  { user_id: 'user_2', conversation_id: 'conv_4', role: 'admin', joined_at: '2024-05-01T08:00:00Z', is_active: true, user: users[1] },
  { user_id: 'user_3', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true, user: users[2] },
  { user_id: 'agent_1', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true, user: users[3] },
  { user_id: 'agent_2', conversation_id: 'conv_4', role: 'member', joined_at: '2024-05-01T08:00:00Z', is_active: true, user: users[4] },
  { user_id: 'user_2', conversation_id: 'conv_5', role: 'owner', joined_at: '2024-05-15T09:00:00Z', is_active: true, user: users[1] },
  { user_id: 'user_3', conversation_id: 'conv_5', role: 'member', joined_at: '2024-05-15T09:00:00Z', is_active: true, user: users[2] },
  { user_id: 'agent_1', conversation_id: 'conv_5', role: 'member', joined_at: '2024-05-15T09:00:00Z', is_active: true, user: users[3] },
  { user_id: 'user_1', conversation_id: 'conv_6', role: 'owner', joined_at: '2024-06-10T12:00:00Z', is_active: true, user: users[0] },
  { user_id: 'user_2', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true, user: users[1] },
  { user_id: 'agent_1', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true, user: users[3] },
  { user_id: 'agent_2', conversation_id: 'conv_6', role: 'member', joined_at: '2024-06-10T12:00:00Z', is_active: true, user: users[4] },
];

export const files: File[] = [
  { id: 'file_1', file_name: 'project_spec.pdf', file_size: 1024000, mime_type: 'application/pdf', conversation_id: 'conv_4', uploader_id: 'user_1', created_at: '2024-06-01T10:00:00Z', url: '/files/project_spec.pdf' },
  { id: 'file_2', file_name: 'design_mockup.png', file_size: 2048000, mime_type: 'image/png', conversation_id: 'conv_4', uploader_id: 'user_2', created_at: '2024-06-02T11:00:00Z', url: '/files/design_mockup.png' },
  { id: 'file_3', file_name: 'meeting_notes.docx', file_size: 512000, mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', conversation_id: 'conv_4', uploader_id: 'user_3', created_at: '2024-06-03T14:00:00Z', url: '/files/meeting_notes.docx' },
  { id: 'file_6', file_name: 'architecture.png', file_size: 1536000, mime_type: 'image/png', conversation_id: 'conv_6', uploader_id: 'user_1', created_at: '2024-06-10T13:00:00Z', url: '/files/architecture.png' },
];

const attachment1: AttachmentInfo = { file_id: 'file_1', file_name: 'project_spec.pdf', mime_type: 'application/pdf', file_size: 1024000 };
const attachment2: AttachmentInfo = { file_id: 'file_2', file_name: 'design_mockup.png', mime_type: 'image/png', file_size: 2048000 };
const attachment6: AttachmentInfo = { file_id: 'file_6', file_name: 'architecture.png', mime_type: 'image/png', file_size: 1536000 };

export const messages: Message[] = [
  { id: 'msg_1', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Hey Bob, how is the project going?', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T09:00:00Z', is_deleted: false },
  { id: 'msg_2', conversation_id: 'conv_1', sender_id: 'user_2', content: 'Going well! Just finished the API integration.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T09:05:00Z', is_deleted: false },
  { id: 'msg_3', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Great! Can you share the spec doc?', content_type: 'text', attachments: [], mentions: [], reply_to: 'msg_2', created_at: '2024-06-15T09:10:00Z', is_deleted: false },
  { id: 'msg_4', conversation_id: 'conv_1', sender_id: 'user_2', content: 'project_spec.pdf', content_type: 'file', attachments: [attachment1], mentions: [], reply_to: 'msg_3', created_at: '2024-06-15T09:15:00Z', is_deleted: false },
  { id: 'msg_5', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Perfect! Let me review this.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T09:20:00Z', is_deleted: false },
  { id: 'msg_6', conversation_id: 'conv_2', sender_id: 'user_1', content: 'Hello! Can you help me with a question?', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T10:00:00Z', is_deleted: false },
  { id: 'msg_7', conversation_id: 'conv_2', sender_id: 'agent_1', content: 'Of course! I am here to help. What would you like to know?', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T10:02:00Z', is_deleted: false },
  { id: 'msg_8', conversation_id: 'conv_2', sender_id: 'user_1', content: 'I need help with React hooks.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T10:05:00Z', is_deleted: false },
  { id: 'msg_9', conversation_id: 'conv_2', sender_id: 'agent_1', content: 'Sure! React hooks allow you to use state and other React features in functional components. The most common ones are useState and useEffect.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-15T10:06:00Z', is_deleted: false },
  { id: 'msg_10', conversation_id: 'conv_3', sender_id: 'user_2', content: 'Carol, did you see the new design mockup?', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-14T14:00:00Z', is_deleted: false },
  { id: 'msg_11', conversation_id: 'conv_3', sender_id: 'user_3', content: 'Yes! It looks amazing.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-14T14:05:00Z', is_deleted: false },
  { id: 'msg_12', conversation_id: 'conv_3', sender_id: 'user_3', content: 'design_mockup.png', content_type: 'image', attachments: [attachment2], mentions: [], created_at: '2024-06-14T14:06:00Z', is_deleted: false },
  { id: 'msg_13', conversation_id: 'conv_4', sender_id: 'user_1', content: 'Team, let us discuss the new project spec.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-12T10:00:00Z', is_deleted: false },
  { id: 'msg_14', conversation_id: 'conv_4', sender_id: 'agent_2', content: 'I have reviewed the API design. Consider adding rate limiting and proper error handling.', content_type: 'markdown', attachments: [], mentions: [], created_at: '2024-06-12T11:05:00Z', is_deleted: false },
  { id: 'msg_15', conversation_id: 'conv_4', sender_id: 'user_3', content: '@agent_2 Very helpful, thank you!', content_type: 'text', attachments: [], mentions: ['agent_2'], created_at: '2024-06-12T11:10:00Z', is_deleted: false },
  { id: 'msg_16', conversation_id: 'conv_6', sender_id: 'user_1', content: 'Let us test the AI agents.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-10T13:00:00Z', is_deleted: false },
  { id: 'msg_17', conversation_id: 'conv_6', sender_id: 'agent_1', content: 'Hello! I am ready to assist.', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-10T13:01:00Z', is_deleted: false },
  { id: 'msg_18', conversation_id: 'conv_6', sender_id: 'agent_2', content: 'And I am here for coding help!', content_type: 'text', attachments: [], mentions: [], created_at: '2024-06-10T13:02:00Z', is_deleted: false },
  { id: 'msg_19', conversation_id: 'conv_6', sender_id: 'user_2', content: 'architecture.png', content_type: 'image', attachments: [attachment6], mentions: [], created_at: '2024-06-10T13:05:00Z', is_deleted: false },
  { id: 'msg_20', conversation_id: 'conv_6', sender_id: 'agent_2', content: 'I see opportunities for optimization in the data flow.', content_type: 'text', attachments: [], mentions: [], reply_to: 'msg_19', created_at: '2024-06-10T13:07:00Z', is_deleted: false },
];

export function getUserById(id: string): User | undefined {
  return users.find(u => u.id === id);
}

export function getConversationById(id: string): Conversation | undefined {
  return conversations.find(c => c.id === id);
}

export function getMessagesByConversationId(conversationId: string): Message[] {
  return messages.filter(m => m.conversation_id === conversationId).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

export function getMembersByConversationId(conversationId: string): Member[] {
  return members.filter(m => m.conversation_id === conversationId);
}

export function getFilesByConversationId(conversationId: string): File[] {
  return files.filter(f => f.conversation_id === conversationId);
}

interface Message {
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
}