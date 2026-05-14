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
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left',
        'hover:bg-amber-50',
        isActive && 'bg-amber-100 border-l-2 border-orange-500'
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          isGroup ? 'bg-amber-100 text-amber-600' : 'bg-amber-100 text-orange-600'
        )}
      >
        {isGroup ? <Users className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </div>

      <div className="flex-1 min-w-0">
<div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={cn('font-medium text-sm truncate', isActive ? 'text-orange-700' : 'text-gray-900')}>
                {displayName}
              </span>
              {isAgent && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded text-xs text-orange-600">
                  <Sparkles className="w-3 h-3" />
                  AI
                </div>
              )}
            </div>
            {lastMessageTime && (
              <span className="flex-shrink-0 text-xs text-gray-400">{formatTime(lastMessageTime)}</span>
            )}
          </div>

        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-xs text-gray-500 truncate">{lastMessage || '暂无消息'}</p>
          {unreadCount > 0 && <Badge count={unreadCount} variant="primary" />}
        </div>
      </div>
    </button>
  );
};