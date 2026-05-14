import React, { useState } from 'react';
import { cn } from './cn';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  inputPrefix?: React.ReactNode;
  inputSuffix?: React.ReactNode;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputPrefix, inputSuffix, error, disabled, size = 'md', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="relative w-full">
        {inputPrefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-strawberry-400">{inputPrefix}</span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          type={inputType}
          className={cn(
            'w-full rounded-xl border-2 border-strawberry-100 bg-white text-chocolate-600',
            'placeholder:text-chocolate-300',
            'transition-all duration-200',
            'hover:border-strawberry-200',
            'focus:outline-none focus:border-strawberry-400 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]',
            'disabled:bg-strawberry-50 disabled:cursor-not-allowed disabled:opacity-60',
            error && 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]',
            inputPrefix && 'pl-10',
            (inputSuffix || isPassword) && 'pr-10',
            sizeStyles[size],
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-chocolate-300 hover:text-strawberry-400 transition-colors duration-150"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        {inputSuffix && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-strawberry-300">{inputSuffix}</span>
        )}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
