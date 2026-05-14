import type { User, Conversation, Message, Member, File, ApiResponse, PaginatedResponse, CreateConversationRequest, SendMessageRequest, UpdateUserRequest } from '../types';
import * as data from './data';

const delay = () => new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

class MockStore {
  private users: User[] = [...data.users];
  private conversations: Conversation[] = [...data.conversations];
  private messages: Message[] = [...data.messages];
  private members: Member[] = [...data.members];
  private files: File[] = [...data.files];

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay();
    return { success: true, data: this.users[0] };
  }

  async getUser(id: string): Promise<ApiResponse<User>> {
    await delay();
    const user = this.users.find(u => u.id === id);
    if (!user) return { success: false, error: 'User not found' };
    return { success: true, data: user };
  }

  async updateUser(id: string, updates: UpdateUserRequest): Promise<ApiResponse<User>> {
    await delay();
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return { success: false, error: 'User not found' };
    this.users[index] = { ...this.users[index], ...updates };
    return { success: true, data: this.users[index] };
  }

  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    await delay();
    return { success: true, data: this.conversations };
  }

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    await delay();
    const conv = this.conversations.find(c => c.id === id);
    if (!conv) return { success: false, error: 'Conversation not found' };
    return { success: true, data: conv };
  }

  async createConversation(request: CreateConversationRequest): Promise<ApiResponse<Conversation>> {
    await delay();
    const newConv: Conversation = {
      id: this.generateId('conv'),
      type: request.type,
      name: request.name,
      owner_id: this.users[0].id,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_count: request.member_ids.length + 1,
    };
    this.conversations.push(newConv);

    const allMemberIds = [this.users[0].id, ...request.member_ids];
    allMemberIds.forEach(userId => {
      this.members.push({
        user_id: userId,
        conversation_id: newConv.id,
        role: userId === this.users[0].id ? 'owner' : 'member',
        joined_at: new Date().toISOString(),
        is_active: true,
      });
    });

    return { success: true, data: newConv };
  }

  async getConversationMessages(conversationId: string, page = 1, pageSize = 50): Promise<ApiResponse<PaginatedResponse<Message>>> {
    await delay();
    const allMessages = this.messages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const start = (page - 1) * pageSize;
    const items = allMessages.slice(start, start + pageSize).map(msg => ({
      ...msg,
      sender: this.users.find(u => u.id === msg.sender_id),
    }));

    return {
      success: true,
      data: {
        items,
        total: allMessages.length,
        page,
        page_size: pageSize,
        has_more: start + pageSize < allMessages.length,
      },
    };
  }

  async sendMessage(request: SendMessageRequest): Promise<ApiResponse<Message>> {
    await delay();
    const newMessage: Message = {
      id: this.generateId('msg'),
      conversation_id: request.conversation_id,
      sender_id: this.users[0].id,
      content: request.content,
      content_type: request.content_type,
      attachments: request.attachments || [],
      mentions: request.mentions || [],
      reply_to: request.reply_to,
      is_deleted: false,
      created_at: new Date().toISOString(),
      sender: this.users[0],
    };
    this.messages.push(newMessage);

    const convIndex = this.conversations.findIndex(c => c.id === request.conversation_id);
    if (convIndex !== -1) {
      this.conversations[convIndex].updated_at = new Date().toISOString();
    }

    return { success: true, data: newMessage };
  }

  async deleteMessage(messageId: string): Promise<ApiResponse<Message>> {
    await delay();
    const index = this.messages.findIndex(m => m.id === messageId);
    if (index === -1) return { success: false, error: 'Message not found' };

    this.messages[index] = {
      ...this.messages[index],
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    };
    return { success: true, data: this.messages[index] };
  }

  async getConversationMembers(conversationId: string): Promise<ApiResponse<Member[]>> {
    await delay();
    const convMembers = this.members
      .filter(m => m.conversation_id === conversationId)
      .map(m => ({
        ...m,
        user: this.users.find(u => u.id === m.user_id),
      }));
    return { success: true, data: convMembers };
  }

  async getFiles(conversationId?: string): Promise<ApiResponse<File[]>> {
    await delay();
    let result = this.files;
    if (conversationId) {
      result = result.filter(f => f.conversation_id === conversationId);
    }
    return { success: true, data: result };
  }

  async uploadFile(file: Omit<File, 'id' | 'created_at'>): Promise<ApiResponse<File>> {
    await delay();
    const newFile: File = {
      ...file,
      id: this.generateId('file'),
      created_at: new Date().toISOString(),
    };
    this.files.push(newFile);
    return { success: true, data: newFile };
  }
}

export const store = new MockStore();
