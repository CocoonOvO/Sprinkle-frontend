import React, { useState } from 'react';
import { Search, ChevronDown, LogOut } from 'lucide-react';
import { cn } from '../ui';
import { Avatar } from '../ui/Avatar';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../stores';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [searchCollapsed, setSearchCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="h-14 bg-white/80 backdrop-blur-md border-b border-pink-100/50 flex items-center px-4 gap-4 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-md hover-lift" style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)' }}>
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-bold text-slate-600">Sprinkle</span>
      </div>

      <div className={cn('flex-1 flex justify-center', searchCollapsed ? 'max-w-[200px]' : 'max-w-md')}>
        <div className={cn('w-full transition-all duration-300', searchCollapsed ? 'opacity-0 w-0' : 'opacity-100')}>
          <Input
            placeholder="搜索..."
            inputPrefix={<Search className="w-4 h-4" />}
            size="sm"
            className="input-sprinkle"
          />
        </div>
        <button
          onClick={() => setSearchCollapsed(!searchCollapsed)}
          className={cn(
            'p-1.5 rounded-lg hover:bg-pink-50 text-slate-400 hover:text-pink-500 transition-all',
            searchCollapsed && 'mx-auto'
          )}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-pink-50 transition-colors"
        >
          <Avatar name={user?.display_name} size="sm" />
          <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', userMenuOpen && 'rotate-180')} />
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100/50 py-1 z-50 animate-slide-in">
              <div className="px-4 py-2 border-b border-pink-50">
                <p className="font-medium text-slate-600">{user?.display_name}</p>
                <p className="text-xs text-slate-400">@{user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
