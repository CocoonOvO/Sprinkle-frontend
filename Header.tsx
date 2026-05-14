import React, { useState } from 'react';
import { Search, ChevronDown, Settings, LogOut } from 'lucide-react';
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
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        <span className="font-semibold text-gray-900">Sprinkle</span>
      </div>

      <div className={cn('flex-1 flex justify-center', searchCollapsed ? 'max-w-[200px]' : 'max-w-md')}>
        <div className={cn('w-full transition-all duration-300', searchCollapsed ? 'opacity-0 w-0' : 'opacity-100')}>
          <Input
            placeholder="Search..."
            inputPrefix={<Search className="w-4 h-4" />}
            size="sm"
          />
        </div>
        <button
          onClick={() => setSearchCollapsed(!searchCollapsed)}
          className={cn(
            'p-1.5 rounded-lg hover:bg-amber-50 text-orange-600 transition-all',
            searchCollapsed && 'mx-auto'
          )}
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Avatar name={user?.display_name} size="sm" />
          <ChevronDown className={cn('w-4 h-4 text-gray-400 transition-transform', userMenuOpen && 'rotate-180')} />
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-900">{user?.display_name}</p>
                <p className="text-xs text-gray-500">@{user?.username}</p>
              </div>
              <button
                onClick={() => console.log('Settings')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};