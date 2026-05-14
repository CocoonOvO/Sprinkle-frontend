import React from 'react';
import { cn } from '../ui/cn';

export interface DateDividerProps {
  date: Date;
  className?: string;
}

function formatDate(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (targetDate.getTime() === today.getTime()) {
    return '浠婂ぉ';
  }
  if (targetDate.getTime() === yesterday.getTime()) {
    return '鏄ㄥぉ';
  }
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export const DateDivider: React.FC<DateDividerProps> = ({ date, className }) => {
  return (
    <div className={cn('flex items-center gap-4 py-4', className)}>
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400 font-medium">{formatDate(date)}</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
};
