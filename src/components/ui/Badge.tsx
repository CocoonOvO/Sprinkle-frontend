import React from 'react';
import { cn } from './cn';

export interface BadgeProps {
  count?: number;
  max?: number;
  variant?: 'default' | 'primary' | 'danger' | 'warning';
  className?: string;
  children?: React.ReactNode;
}

const variantStyles = {
  default: 'bg-pink-100 text-pink-700',
  primary: 'bg-pink-500 text-white',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
};

export const Badge: React.FC<BadgeProps> = ({ count, max = 99, variant = 'default', className, children }) => {
  const displayCount = count !== undefined ? (count > max ? `${max}+` : count) : undefined;

  if (children) {
    return (
      <span className={cn('inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium', variantStyles[variant], className)}>
        {children}
      </span>
    );
  }

  if (displayCount === undefined || displayCount === 0) {
    return null;
  }

  return (
    <span className={cn('inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold', variantStyles[variant], className)}>
      {displayCount}
    </span>
  );
};