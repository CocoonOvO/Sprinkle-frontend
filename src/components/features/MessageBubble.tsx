import React, { useState } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';
import { FileCard } from './FileCard';
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Reply,
  Edit2,
  Trash2,
} from 'lucide-react';

export interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    content_type: 'text' | 'markdown' | 'image' | 'file';
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
  };
  isOwn: boolean;
  showAvatar?: boolean;
  onAction?: (action: string, messageId: string) => void;
  className?: string;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusIcon({ status }: { status?: string }) {
  switch (status) {
    case 'sending':
      return <Clock className="w-3 h-3 text-chocolate-300 animate-pulse" />;
    case 'sent':
      return <Check className="w-3 h-3 text-chocolate-300" />;
    case 'read':
      return <CheckCheck className="w-3 h-3 text-mint-500" />;
    case 'failed':
      return <AlertCircle className="w-3 h-3 text-red-500" />;
    default:
      return null;
  }
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  onAction,
  className,
}) => {
  const [showActions, setShowActions] = useState(false);

  const renderContent = () => {
    switch (message.content_type) {
      case 'image':
        return (
          <div className="grid grid-cols-2 gap-1">
            {message.attachments?.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.name}
                className="max-w-[200px] max-h-[200px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
              />
            ))}
          </div>
        );
      case 'file':
        return (
          <div className="flex flex-col gap-1">
            {message.attachments?.map((file, i) => (
              <FileCard
                key={i}
                name={file.name}
                size={file.size}
                type={file.type}
                onDownload={() => window.open(file.url, '_blank')}
              />
            ))}
          </div>
        );
      case 'markdown':
      case 'text':
      default:
        return <p className="whitespace-pre-wrap break-words">{message.content}</p>;
    }
  };

  return (
    <div
      className={cn(
        'group flex gap-2 px-2 py-1',
        isOwn ? 'flex-row-reverse' : 'flex-row',
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {showAvatar && !isOwn ? (
        <Avatar name={message.sender_name} src={message.sender_avatar} size="sm" />
      ) : (
        <div className="w-8" />
      )}

      <div className={cn('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        {!isOwn && showAvatar && (
          <span className="text-xs text-chocolate-400 ml-1 font-medium">{message.sender_name}</span>
        )}

        <div
          className={cn(
            'relative px-4 py-2.5 rounded-2xl message-bubble',
            isOwn
              ? 'message-bubble-own text-white rounded-tr-sm'
              : 'message-bubble-other text-chocolate-600 rounded-tl-sm'
          )}
        >
          {renderContent()}
        </div>

        <div
          className={cn(
            'flex items-center gap-1 px-1',
            isOwn ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <span className="text-[10px] text-chocolate-300">{formatTime(message.created_at)}</span>
          {isOwn && <StatusIcon status={message.status} />}
          {message.is_edited && (
            <span className="text-[10px] text-chocolate-300">(已编辑)</span>
          )}
        </div>

        <div
          className={cn(
            'absolute top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-strawberry-100 p-1 transition-all duration-200',
            isOwn ? 'right-0 mr-2' : 'left-0 ml-2',
            showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
          )}
        >
          <button
            onClick={() => onAction?.('reply', message.id)}
            className="p-1.5 hover:bg-strawberry-50 rounded-full transition-colors text-chocolate-400 hover:text-strawberry-500"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>
          {isOwn && (
            <>
              <button
                onClick={() => onAction?.('edit', message.id)}
                className="p-1.5 hover:bg-strawberry-50 rounded-full transition-colors text-chocolate-400 hover:text-strawberry-500"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onAction?.('delete', message.id)}
                className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-chocolate-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
