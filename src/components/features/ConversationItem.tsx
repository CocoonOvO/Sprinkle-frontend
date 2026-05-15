import React from 'react';
import { MessageCircle, Users, Sparkles } from 'lucide-react';
import { cn } from '../ui';
import { Badge } from '../ui/Badge';
import type { Conversation } from '../../types';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  onClick?: () => void;
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  if (diff < oneDay) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  } else if (diff < 7 * oneDay) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive = false,
  unreadCount = 0,
  lastMessage,
  lastMessageTime,
  onClick,
}) => {
  const isGroup = conversation.type === 'group';
  const displayName = conversation.metadata?.name || conversation.name || (isGroup ? '群聊' : '私聊');
  const isAgent = !isGroup && conversation.metadata?.user_type === 'agent';

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left',
        'hover:bg-pink-50/70 hover:shadow-md hover:-translate-y-0.5',
        isActive && 'bg-gradient-to-r from-pink-50 to-white shadow-md border-l-2 border-pink-400'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          'transition-all duration-200',
          isGroup ? 'bg-gradient-to-br from-blue-200 to-blue-100 text-blue-600' : 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-500',
          isActive ? 'shadow-md' : ''
        )}
      >
        {isGroup ? <Users className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('font-medium text-sm truncate transition-colors duration-150', isActive ? 'text-pink-600' : 'text-slate-600')}>
              {displayName}
            </span>
            {isAgent && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-mint-50 to-mint-100 rounded-full text-xs text-mint-600">
                <Sparkles className="w-3 h-3" />
                AI
              </div>
            )}
          </div>
          {lastMessageTime && (
            <span className="flex-shrink-0 text-xs text-slate-300">{formatTime(lastMessageTime)}</span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-slate-400 truncate">{lastMessage || '暂无消息'}</p>
          {unreadCount > 0 && <Badge count={unreadCount} variant="primary" />}
        </div>
      </div>
    </button>
  );
};
