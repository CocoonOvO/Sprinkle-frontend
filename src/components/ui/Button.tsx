import React from 'react';
import { cn } from './cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variantStyles = {
  primary: [
    'bg-gradient-to-br from-pink-400 to-pink-500 text-white',
    'shadow-md hover:shadow-lg',
    'hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm',
    'transition-all duration-200',
  ].join(' '),
  secondary: [
    'bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600',
    'shadow-sm hover:shadow-md',
    'hover:-translate-y-0.5 active:translate-y-0',
    'transition-all duration-200',
  ].join(' '),
  ghost: [
    'bg-transparent text-slate-400',
    'hover:bg-pink-50 hover:text-pink-500',
    'active:bg-pink-100',
    'transition-all duration-200',
  ].join(' '),
  danger: [
    'bg-gradient-to-br from-red-400 to-red-500 text-white',
    'shadow-md hover:shadow-lg',
    'hover:-translate-y-0.5 active:translate-y-0',
    'transition-all duration-200',
  ].join(' '),
};

const sizeStyles = {
  sm: 'h-8 px-3 text-xs rounded-lg',
  md: 'h-9 px-4 text-sm rounded-xl',
  lg: 'h-11 px-6 text-base rounded-xl',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold',
          'disabled:opacity-50 disabled:pointer-events-none disabled:transform-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
