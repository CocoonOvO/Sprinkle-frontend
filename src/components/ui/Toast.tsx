import React, { useEffect, useState } from 'react';
import { cn } from './cn';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-500',
    iconColor: 'text-green-500',
    textColor: 'text-green-800',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    border: 'border-red-500',
    iconColor: 'text-red-500',
    textColor: 'text-red-800',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    iconColor: 'text-yellow-500',
    textColor: 'text-yellow-800',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    iconColor: 'text-blue-500',
    textColor: 'text-blue-800',
  },
};

export const Toast: React.FC<ToastProps> = ({ type, message, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const config = typeConfig[type];
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={cn(
        'fixed right-4 top-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 shadow-lg',
        'transition-all duration-300',
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        config.bg,
        config.border
      )}
    >
      <Icon className={cn('w-5 h-5', config.iconColor)} />
      <span className={cn('text-sm font-medium', config.textColor)}>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300); }} className="ml-2 hover:opacity-70">
        <X className={cn('w-4 h-4', config.iconColor)} />
      </button>
    </div>
  );
};