import React, { useEffect, useRef } from 'react';
import { Settings, Users as UsersIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore, useMessageStore, useAuthStore, useUIStore } from '../../stores';

export const ChatArea: React.FC = () => {
  const { currentConversation } = useConversationStore();
  const { messages, loadMessages, sendMessage } = useMessageStore();
  const { user } = useAuthStore();
  const { toggleDetailPanel } = useUIStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationMessages = currentConversation ? messages[currentConversation.id] || [] : [];
  const isGroup = currentConversation?.type === 'group';

  useEffect(() => {
    if (currentConversation) {
      loadMessages(currentConversation.id);
    }
  }, [currentConversation, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSend = (content: string, files?: File[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || !currentConversation) return;
    sendMessage(currentConversation.id, content.trim());
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
<div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
          <p className="text-gray-500 mt-1">Choose a conversation from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-gray-900">
            {currentConversation.metadata?.name || currentConversation.name || '私聊'}
          </h2>
          {isGroup && (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <UsersIcon className="w-4 h-4" />
              {currentConversation.member_count}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleDetailPanel}>
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <MessageList
          messages={conversationMessages.map(m => ({
            id: m.id,
            content: m.content,
            content_type: m.content_type,
            sender_id: m.sender_id,
            sender_name: m.sender_id === user?.id ? (user?.display_name || 'Me') : 'User',
            created_at: m.created_at,
            status: 'sent' as const,
            attachments: m.attachments?.map(a => ({
              url: a.file_id,
              name: a.file_name,
              size: a.file_size,
              type: a.mime_type,
            })),
          }))}
          currentUserId={user?.id || 'user_1'}
        />
        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        placeholder="输入消息..."
      />
    </div>
  );
};