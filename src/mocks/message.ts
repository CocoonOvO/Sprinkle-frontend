import type { Message } from '../types';

const mockMessages: Record<string, Message[]> = {
  'conv_1': [
    { id: 'msg_1', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Hey Bob, how is the project going?', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T09:00:00Z' },
    { id: 'msg_2', conversation_id: 'conv_1', sender_id: 'user_2', content: 'Going well! Just finished the API integration.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T09:05:00Z' },
    { id: 'msg_3', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Great! Can you share the spec doc?', content_type: 'text', attachments: [], mentions: [], reply_to: 'msg_2', is_deleted: false, created_at: '2024-06-15T09:10:00Z' },
    { id: 'msg_4', conversation_id: 'conv_1', sender_id: 'user_2', content: 'Here is the spec file', content_type: 'file', attachments: [{ file_id: 'file_1', file_name: 'project_spec.pdf', mime_type: 'application/pdf', file_size: 1024000 }], mentions: [], reply_to: 'msg_3', is_deleted: false, created_at: '2024-06-15T09:15:00Z' },
    { id: 'msg_5', conversation_id: 'conv_1', sender_id: 'user_1', content: 'Perfect! Let me review this.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T09:20:00Z' },
  ],
  'conv_2': [
    { id: 'msg_6', conversation_id: 'conv_2', sender_id: 'user_1', content: 'Hello! Can you help me with a question?', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T10:00:00Z' },
    { id: 'msg_7', conversation_id: 'conv_2', sender_id: 'agent_1', content: 'Of course! I am here to help. What would you like to know?', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T10:02:00Z' },
    { id: 'msg_8', conversation_id: 'conv_2', sender_id: 'user_1', content: 'I need help with React hooks.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T10:05:00Z' },
    { id: 'msg_9', conversation_id: 'conv_2', sender_id: 'agent_1', content: 'Sure! React hooks allow you to use state and other React features in functional components. The most common ones are useState and useEffect.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-15T10:06:00Z' },
  ],
  'conv_3': [
    { id: 'msg_10', conversation_id: 'conv_3', sender_id: 'user_2', content: 'Carol, did you see the new design mockup?', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-14T14:00:00Z' },
    { id: 'msg_11', conversation_id: 'conv_3', sender_id: 'user_3', content: 'Yes! It looks amazing.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-14T14:05:00Z' },
    { id: 'msg_12', conversation_id: 'conv_3', sender_id: 'user_3', content: 'Check out this design', content_type: 'image', attachments: [{ file_id: 'file_2', file_name: 'design_mockup.png', mime_type: 'image/png', file_size: 2048000 }], mentions: [], is_deleted: false, created_at: '2024-06-14T14:06:00Z' },
  ],
  'conv_4': [
    { id: 'msg_13', conversation_id: 'conv_4', sender_id: 'user_1', content: 'Team, let us discuss the new project spec.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-12T10:00:00Z' },
    { id: 'msg_14', conversation_id: 'conv_4', sender_id: 'agent_2', content: 'I have reviewed the API design. Consider adding rate limiting and proper error handling.', content_type: 'markdown', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-12T11:05:00Z' },
    { id: 'msg_15', conversation_id: 'conv_4', sender_id: 'user_3', content: '@agent_2 Very helpful, thank you!', content_type: 'text', attachments: [], mentions: ['agent_2'], is_deleted: false, created_at: '2024-06-12T11:10:00Z' },
  ],
  'conv_5': [
    { id: 'msg_16', conversation_id: 'conv_5', sender_id: 'user_2', content: 'Sprint planning session tomorrow.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-11T09:00:00Z' },
  ],
  'conv_6': [
    { id: 'msg_17', conversation_id: 'conv_6', sender_id: 'user_1', content: 'Let us test the AI agents.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-10T13:00:00Z' },
    { id: 'msg_18', conversation_id: 'conv_6', sender_id: 'agent_1', content: 'Hello! I am ready to assist.', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-10T13:01:00Z' },
    { id: 'msg_19', conversation_id: 'conv_6', sender_id: 'agent_2', content: 'And I am here for coding help!', content_type: 'text', attachments: [], mentions: [], is_deleted: false, created_at: '2024-06-10T13:02:00Z' },
  ],
};

export const messageMock = {
  getByConversation: async (conversationId: string): Promise<Message[]> => {
    await delay(200);
    return mockMessages[conversationId] ? [...mockMessages[conversationId]] : [];
  },
  send: async (conversationId: string, content: string, contentType: 'text' | 'markdown' = 'text', senderId: string = 'user_1'): Promise<Message> => {
    await delay(300);
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      content_type: contentType,
      attachments: [],
      mentions: [],
      is_deleted: false,
      created_at: new Date().toISOString(),
    };
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);
    return newMessage;
  },
  edit: async (messageId: string, content: string): Promise<Message | null> => {
    await delay(200);
    for (const messages of Object.values(mockMessages)) {
      const index = messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages[index] = {
          ...messages[index],
          content,
          edited_at: new Date().toISOString(),
        };
        return messages[index];
      }
    }
    return null;
  },
  delete: async (messageId: string): Promise<void> => {
    await delay(200);
    for (const messages of Object.values(mockMessages)) {
      const index = messages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        messages[index].is_deleted = true;
        messages[index].deleted_at = new Date().toISOString();
        break;
      }
    }
  },
};

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}