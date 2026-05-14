import React, { useEffect, useRef } from 'react';
import { cn } from '../ui/cn';
import { MessageBubble } from './MessageBubble';
import { DateDivider } from './DateDivider';
import { TypingIndicator } from './TypingIndicator';
import { Skeleton } from '../ui/Skeleton';

export interface Message {
  id: string;
  content: string;
  content_type: 'text' | 'markdown' | 'image' | 'file';
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'read' | 'failed';
  is_edited?: boolean;
  attachments?: Array<{
    url: string;
    name: string;
    size: number;
    type: string;
  }>;
}

export interface MessageGroup {
  date: string;
  messages: Message[];
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  loading?: boolean;
  typingUser?: string;
  onMessageAction?: (action: string, messageId: string) => void;
  className?: string;
}

function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: Map<string, Message[]> = new Map();

  messages.forEach((msg) => {
    const date = new Date(msg.created_at).toDateString();
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(msg);
  });

  return Array.from(groups.entries()).map(([date, msgs]) => ({
    date,
    messages: msgs.sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  }));
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  loading,
  typingUser,
  onMessageAction,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && bottomRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, typingUser]);

  if (loading) {
    return (
      <div className={cn('flex flex-col gap-4 p-4 overflow-y-auto', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex-1 space-y-2">
              <Skeleton width="30%" height={16} />
              <Skeleton width="60%" height={48} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const dateGroups = groupMessagesByDate(messages);

  return (
    <div ref={containerRef} className={cn('flex flex-col overflow-y-auto', className)}>
      {dateGroups.map((group) => (
        <div key={group.date}>
          <DateDivider date={new Date(group.date)} />
          {group.messages.map((message, index) => {
            const isOwn = message.sender_id === currentUserId;
            const prevMessage = group.messages[index - 1];
            const showAvatar = !prevMessage || prevMessage.sender_id !== message.sender_id;

            return (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={isOwn}
                showAvatar={showAvatar}
                onAction={onMessageAction}
              />
            );
          })}
        </div>
      ))}

      {typingUser && <TypingIndicator username={typingUser} className="px-4" />}

      <div ref={bottomRef} />
    </div>
  );
};