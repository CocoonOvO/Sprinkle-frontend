import React, { useEffect, useRef } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';
import { X } from 'lucide-react';

interface StreamingMessageProps {
  messageId: string;
  content: string;
  isStreaming: boolean;
  senderName: string;
  senderAvatar?: string;
  isOwn: boolean;
  onCancel?: () => void;
  className?: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  messageId: _messageId,
  content,
  isStreaming,
  senderName,
  senderAvatar,
  isOwn,
  onCancel,
  className,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const prevContentLength = useRef(0);

  useEffect(() => {
    if (contentRef.current && content.length > prevContentLength.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
    prevContentLength.current = content.length;
  }, [content]);

  return (
    <div className={cn('flex gap-2 px-4 py-1 animate-slide-in', className)}>
      {!isOwn && (
        <Avatar name={senderName} src={senderAvatar} size="sm" />
      )}

      <div className={cn('flex flex-col gap-1 max-w-[70%]', isOwn && 'items-end')}>
        {!isOwn && (
          <span className="text-xs text-slate-400 ml-1 font-medium">
            {senderName}
          </span>
        )}

        <div
          className={cn(
            'relative px-4 py-2.5 rounded-2xl',
            isOwn
              ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-md'
              : 'bg-white text-slate-600 shadow-md'
          )}
        >
          <div
            ref={contentRef}
            className="whitespace-pre-wrap break-words leading-relaxed"
          >
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-pink-300 animate-pulse rounded-sm" />
            )}
          </div>

          {isStreaming && onCancel && (
            <button
              onClick={onCancel}
              className={cn(
                'absolute -top-2 flex items-center justify-center w-6 h-6 rounded-full',
                'bg-red-500 text-white shadow-md transition-all',
                'hover:bg-red-600 hover:scale-110 active:scale-95'
              )}
              title="取消"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {isStreaming && (
          <span className="text-[10px] text-slate-300 animate-pulse px-1">
            AI 正在输入...
          </span>
        )}
      </div>

      {isOwn && <div className="w-8" />}
    </div>
  );
};
