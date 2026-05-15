import React from 'react';
import { cn } from './cn';

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const gradientMap: Record<string, string> = {
  A: 'from-pink-400 to-slate-400',
  B: 'from-slate-400 to-pink-500',
  C: 'from-pink-500 to-slate-400',
  D: 'from-slate-400 to-pink-400',
  E: 'from-pink-400 to-slate-500',
  F: 'from-slate-400 to-pink-400',
  G: 'from-pink-400 to-slate-400',
  H: 'from-slate-400 to-pink-500',
  I: 'from-pink-500 to-slate-400',
  J: 'from-slate-400 to-pink-400',
  K: 'from-pink-400 to-slate-500',
  L: 'from-slate-400 to-pink-400',
  M: 'from-pink-400 to-slate-400',
  N: 'from-slate-400 to-pink-500',
  O: 'from-pink-500 to-slate-400',
  P: 'from-slate-400 to-pink-400',
  Q: 'from-pink-400 to-slate-500',
  R: 'from-slate-400 to-pink-400',
  S: 'from-pink-400 to-slate-400',
  T: 'from-slate-400 to-pink-500',
  U: 'from-pink-500 to-slate-400',
  V: 'from-slate-400 to-pink-400',
  W: 'from-pink-400 to-slate-500',
  X: 'from-slate-400 to-pink-400',
  Y: 'from-pink-400 to-slate-400',
  Z: 'from-slate-400 to-pink-500',
};

function getGradient(name: string): string {
  const firstLetter = name[0]?.toUpperCase() || 'A';
  return gradientMap[firstLetter] || 'from-pink-400 to-slate-400';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className, onClick }) => {
  const [loading, setLoading] = React.useState(false);

  if (src) {
    return (
      <div
        className={cn(
          'relative rounded-full overflow-hidden bg-gray-100',
          sizeStyles[size],
          onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
          className
        )}
        onClick={onClick}
      >
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={src}
          alt={name || 'avatar'}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (!name) {
    return (
      <div
        className={cn(
          'rounded-full bg-gray-200 flex items-center justify-center',
          sizeStyles[size],
          onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
          className
        )}
        onClick={onClick}
      >
        <span className="text-gray-400">?</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white',
        getGradient(name),
        sizeStyles[size],
        onClick && 'cursor-pointer hover:opacity-90 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {getInitials(name)}
    </div>
  );
};

export const AvatarSkeleton: React.FC<{ size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className,
}) => {
  return <div className={cn('rounded-full animate-pulse bg-gray-200', sizeStyles[size], className)} />;
};