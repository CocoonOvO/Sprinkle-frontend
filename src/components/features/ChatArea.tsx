import React, { useEffect, useRef } from 'react';
import { Settings, Users as UsersIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useConversationStore, useMessageStore, useAuthStore, useUIStore } from '../../stores';

const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center max-w-sm animate-float">
        <div className="w-32 h-32 mx-auto mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-strawberry-200 to-strawberry-100 rounded-full opacity-50 blur-xl" />
          <div className="relative w-full h-full flex items-center justify-center">
            <svg className="w-20 h-20 text-strawberry-300" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
              <path d="M30 50 Q40 35 50 50 Q60 65 70 50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <circle cx="35" cy="40" r="3" fill="currentColor" opacity="0.4" />
              <circle cx="65" cy="40" r="3" fill="currentColor" opacity="0.4" />
              <circle cx="50" cy="65" r="2" fill="currentColor" opacity="0.3" />
              <circle cx="40" cy="55" r="1.5" fill="currentColor" opacity="0.2" />
              <circle cx="60" cy="55" r="1.5" fill="currentColor" opacity="0.2" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-chocolate-500 mb-2">开始聊天吧</h3>
        <p className="text-sm text-chocolate-300">从侧边栏选择一个会话，开启甜蜜的对话之旅</p>
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-2 h-2 rounded-full bg-strawberry-300 animate-pulse-soft" />
          <div className="w-2 h-2 rounded-full bg-strawberry-400 animate-pulse-soft stagger-1" />
          <div className="w-2 h-2 rounded-full bg-strawberry-500 animate-pulse-soft stagger-2" />
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50/50 to-cream-100/30" />
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-strawberry-50/20 via-transparent to-cream-50/30" />

      <div className="relative z-10 h-14 bg-white/80 backdrop-blur-md border-b border-strawberry-100/50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-strawberry-100 to-strawberry-50 flex items-center justify-center">
            {isGroup ? (
              <UsersIcon className="w-4 h-4 text-strawberry-500" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-strawberry-300 to-strawberry-400" />
            )}
          </div>
          <h2 className="font-semibold text-chocolate-600">
            {currentConversation.metadata?.name || currentConversation.name || '私聊'}
          </h2>
          {isGroup && (
            <span className="flex items-center gap-1 text-xs text-chocolate-400 bg-strawberry-50 px-2 py-0.5 rounded-full">
              <UsersIcon className="w-3 h-3" />
              {currentConversation.member_count}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={toggleDetailPanel} className="hover:bg-strawberry-50 hover:text-strawberry-500 transition-colors">
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {conversationMessages.map((m, i) => (
            <div
              key={m.id}
              className="animate-slide-in"
              style={{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }}
            >
              <MessageList
                messages={[{
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
                }]}
                currentUserId={user?.id || 'user_1'}
              />
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="relative z-10">
        <MessageInput
          onSend={handleSend}
          placeholder="输入消息..."
        />
      </div>
    </div>
  );
};
