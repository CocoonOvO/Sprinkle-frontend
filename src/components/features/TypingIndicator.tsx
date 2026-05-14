import React from 'react';
import { cn } from '../ui/cn';

export interface TypingIndicatorProps {
  username?: string;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username, className }) => {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-2', className)}>
      <div className="flex items-center gap-1">
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
      <span className="text-xs text-gray-400">
        {username ? `${username} 姝ｅ湪杈撳叆...` : '姝ｅ湪杈撳叆...'}
      </span>
    </div>
  );
};
