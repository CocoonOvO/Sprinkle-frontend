import React, { useEffect, useState } from 'react';
import { Search, Plus, MessageCircle, Users, PanelLeft, ChevronDown, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '../ui';
import { Avatar } from '../ui/Avatar';
import { ConversationItem } from './ConversationItem';
import { useConversationStore, useUIStore, useAuthStore } from '../../stores';

export const Sidebar: React.FC = () => {
  const { conversations, currentConversation, loadConversations, setCurrentConversation } = useConversationStore();
const { sidebarCollapsed, toggleSidebar, setProfileModalOpen, setNewConvModalOpen } = useUIStore();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [directExpanded, setDirectExpanded] = useState(true);
  const [groupExpanded, setGroupExpanded] = useState(true);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleNewConversation = () => {
    setNewConvModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const directConvs = conversations.filter(c => c.type === 'direct');
  const groupConvs = conversations.filter(c => c.type === 'group');

  const filteredDirect = directConvs.filter(conv =>
    (conv.metadata?.name || conv.name)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroup = groupConvs.filter(conv =>
    (conv.metadata?.name || conv.name)?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sidebarCollapsed) {
    return (
      <div className="h-full w-16 bg-white/80 backdrop-blur-md border-r border-pink-100/50 flex flex-col shadow-lg">
        <button
          onClick={toggleSidebar}
          className="p-3 flex justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200 hover-lift rounded-none"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <button
          onClick={handleNewConversation}
          className="p-3 flex justify-center text-slate-400 hover:text-pink-500 hover:bg-pink-50/50 transition-all duration-200 hover-lift rounded-none"
        >
          <Plus className="w-5 h-5" />
        </button>

        <div className="flex-1 flex flex-col items-center gap-1 mt-2 overflow-y-auto">
          {conversations.slice(0, 8).map((conv, i) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversation(conv)}
              className={cn(
                'p-2.5 rounded-xl transition-all duration-200 animate-slide-in',
                currentConversation?.id === conv.id
                  ? 'bg-gradient-to-br from-pink-100 to-pink-50 text-pink-600 shadow-md'
                  : 'text-slate-400 hover:text-pink-500 hover:bg-pink-50/50 hover-lift'
              )}
              style={{ animationDelay: `${i * 0.05}s` }}
              title={conv.name || '私聊'}
            >
              {conv.type === 'group' ? (
                <Users className="w-5 h-5" />
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="p-3 flex justify-center hover:bg-pink-50/50 transition-colors mb-2 rounded-none"
        >
          <Avatar name={user?.display_name} size="sm" />
        </button>

        {userMenuOpen && (
          <div className="absolute left-16 bottom-16 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100/50 py-1 z-50 min-w-[140px] animate-slide-in">
            <div className="px-3 py-2 border-b border-pink-50">
              <p className="font-medium text-slate-600 text-sm">{user?.display_name}</p>
              <p className="text-xs text-slate-400">@{user?.username}</p>
            </div>
            <button
              onClick={() => { setProfileModalOpen(true); setUserMenuOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:bg-pink-50 hover:text-pink-500 transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              编辑资料
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full w-60 bg-white/80 backdrop-blur-md border-r border-pink-100/50 flex flex-col shadow-lg">
      <div className="p-4 border-b border-pink-50/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg hover-lift" style={{ boxShadow: '0 4px 12px rgba(236, 72, 153, 0.35)' }}>
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-lg text-slate-600">Sprinkle</span>
          <button
            onClick={handleNewConversation}
            className="ml-auto p-1.5 rounded-lg hover:bg-pink-50 text-slate-400 hover:text-pink-500 transition-colors"
            title="新建会话"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="搜索会话..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={cn(
              'w-full h-9 pl-9 pr-3 rounded-xl border border-pink-100 bg-pink-50/50',
              'text-sm placeholder:text-slate-300 text-slate-600',
              'focus:outline-none focus:border-pink-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]',
              'hover:border-pink-200 transition-all duration-200 input-sprinkle'
            )}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 mb-2">
          <button
            onClick={() => setDirectExpanded(!directExpanded)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-pink-500 transition-colors duration-150"
          >
            <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', !directExpanded && '-rotate-90')} />
            <MessageCircle className="w-3.5 h-3.5" />
            <span>私聊</span>
            <span className="ml-auto text-slate-300">{filteredDirect.length}</span>
          </button>
        </div>

        {directExpanded && (
          <div className="px-2 mb-3 space-y-1">
            {filteredDirect.length === 0 ? (
              <p className="text-xs text-slate-300 px-2 py-2 text-center">暂无私聊</p>
            ) : (
              filteredDirect.map((conv, i) => (
                <div key={conv.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ConversationItem
                    conversation={conv}
                    isActive={currentConversation?.id === conv.id}
                    onClick={() => setCurrentConversation(conv)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        <div className="px-2 mb-2">
          <button
            onClick={() => setGroupExpanded(!groupExpanded)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-semibold text-slate-400 hover:text-pink-500 transition-colors duration-150"
          >
            <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', !groupExpanded && '-rotate-90')} />
            <Users className="w-3.5 h-3.5" />
            <span>群聊</span>
            <span className="ml-auto text-slate-300">{filteredGroup.length}</span>
          </button>
        </div>

        {groupExpanded && (
          <div className="px-2 space-y-1">
            {filteredGroup.length === 0 ? (
              <p className="text-xs text-slate-300 px-2 py-2 text-center">暂无群聊</p>
            ) : (
              filteredGroup.map((conv, i) => (
                <div key={conv.id} className="animate-slide-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ConversationItem
                    conversation={conv}
                    isActive={currentConversation?.id === conv.id}
                    onClick={() => setCurrentConversation(conv)}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-pink-50/50">
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-pink-50/50 transition-all duration-150 group hover-lift"
          >
            <Avatar name={user?.display_name} size="sm" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-slate-600 truncate group-hover:text-slate-700">{user?.display_name}</p>
              <p className="text-xs text-slate-400 truncate">@{user?.username}</p>
            </div>
          </button>

          {userMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-pink-100/50 py-1 z-50 animate-slide-in">
                <button
                  onClick={() => { setProfileModalOpen(true); setUserMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:bg-pink-50 hover:text-pink-500 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  编辑资料
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
