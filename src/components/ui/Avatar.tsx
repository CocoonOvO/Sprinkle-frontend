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
  A: 'from-strawberry-400 to-stone-400',
  B: 'from-stone-400 to-strawberry-500',
  C: 'from-strawberry-500 to-stone-400',
  D: 'from-stone-400 to-strawberry-400',
  E: 'from-strawberry-400 to-stone-500',
  F: 'from-stone-400 to-strawberry-400',
  G: 'from-strawberry-400 to-stone-400',
  H: 'from-stone-400 to-strawberry-500',
  I: 'from-strawberry-500 to-stone-400',
  J: 'from-stone-400 to-strawberry-400',
  K: 'from-strawberry-400 to-stone-500',
  L: 'from-stone-400 to-strawberry-400',
  M: 'from-strawberry-400 to-stone-400',
  N: 'from-stone-400 to-strawberry-500',
  O: 'from-strawberry-500 to-stone-400',
  P: 'from-stone-400 to-strawberry-400',
  Q: 'from-strawberry-400 to-stone-500',
  R: 'from-stone-400 to-strawberry-400',
  S: 'from-strawberry-400 to-stone-400',
  T: 'from-stone-400 to-strawberry-500',
  U: 'from-strawberry-500 to-stone-400',
  V: 'from-stone-400 to-strawberry-400',
  W: 'from-strawberry-400 to-stone-500',
  X: 'from-stone-400 to-strawberry-400',
  Y: 'from-strawberry-400 to-stone-400',
  Z: 'from-stone-400 to-strawberry-500',
};

function getGradient(name: string): string {
  const firstLetter = name[0]?.toUpperCase() || 'A';
  return gradientMap[firstLetter] || 'from-strawberry-400 to-stone-400';
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