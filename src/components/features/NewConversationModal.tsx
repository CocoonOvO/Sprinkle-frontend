import React, { useState } from 'react';
import { X, Users, User, Check } from 'lucide-react';
import { cn } from '../ui';
import { Avatar } from '../ui/Avatar';
import { useConversationStore, useAuthStore } from '../../stores';

const TEST_USERS = [
  { id: '5de1ebb6-3a52-4a03-b8f5-6c031763b595', username: 'user3', display_name: '用户三' },
  { id: '7b103ea0-b79e-4663-b17e-44d5d5a9878c', username: 'user1', display_name: '用户一' },
  { id: 'cc0be9f3-4809-46ca-8c8e-51a2ef18ba00', username: 'user2', display_name: '用户二' },
];

interface NewConversationModalProps {
  onClose: () => void;
}

export const NewConversationModal: React.FC<NewConversationModalProps> = ({ onClose }) => {
  const { createConversation } = useConversationStore();
  const { user: currentUser } = useAuthStore();
  const [conversationType, setConversationType] = useState<'direct' | 'group'>('group');
  const [name, setName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleCreate = async () => {
    if (conversationType === 'group' && !name.trim()) return;
    if (conversationType === 'direct' && !selectedUser) return;

    setIsCreating(true);
    try {
      await createConversation({
        type: conversationType,
        name: conversationType === 'group' ? name.trim() : undefined,
        member_ids: conversationType === 'direct' ? [selectedUser.id] : [],
      });
      onClose();
    } catch (err) {
      console.error('Failed to create conversation:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const otherUsers = TEST_USERS.filter(u => u.id !== currentUser?.id);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-stone-100 via-strawberry-50/30 to-stone-100 p-4">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl w-[400px] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-semibold text-lg text-chocolate-700">新建会话</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-100 text-chocolate-400 hover:text-chocolate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex gap-2">
            <button
              onClick={() => setConversationType('group')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all',
                conversationType === 'group'
                  ? 'border-strawberry-400 bg-strawberry-50 text-strawberry-600'
                  : 'border-stone-200 text-chocolate-500 hover:border-stone-300'
              )}
            >
              <Users className="w-5 h-5" />
              群聊
            </button>
            <button
              onClick={() => setConversationType('direct')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all',
                conversationType === 'direct'
                  ? 'border-strawberry-400 bg-strawberry-50 text-strawberry-600'
                  : 'border-stone-200 text-chocolate-500 hover:border-stone-300'
              )}
            >
              <User className="w-5 h-5" />
              私聊
            </button>
          </div>

          {conversationType === 'group' ? (
            <div className="space-y-3">
              <label className="text-sm font-medium text-chocolate-600">群聊名称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入群聊名称"
                className={cn(
                  'w-full h-11 px-4 rounded-xl border border-stone-200',
                  'text-chocolate-700 placeholder:text-chocolate-300',
                  'focus:outline-none focus:border-strawberry-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]',
                  'hover:border-stone-300 transition-all'
                )}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium text-chocolate-600">选择用户</label>
              <div className="max-h-48 overflow-y-auto border border-stone-200 rounded-xl">
                {otherUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 hover:bg-strawberry-50 transition-colors',
                      selectedUser?.id === user.id && 'bg-strawberry-50'
                    )}
                  >
                    <Avatar name={user.display_name} size="sm" />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-chocolate-700">{user.display_name}</p>
                      <p className="text-xs text-chocolate-400">@{user.username}</p>
                    </div>
                    {selectedUser?.id === user.id && (
                      <Check className="w-4 h-4 text-strawberry-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 border-t border-stone-100 bg-stone-50">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-stone-200 text-chocolate-500 font-medium hover:bg-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleCreate}
            disabled={isCreating || (conversationType === 'group' && !name.trim()) || (conversationType === 'direct' && !selectedUser)}
            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-strawberry-400 to-strawberry-500 text-white font-medium hover:from-strawberry-500 hover:to-strawberry-600 transition-all disabled:opacity-50 shadow-md hover-lift"
          >
            {isCreating ? '创建中...' : '创建'}
          </button>
        </div>
      </div>
    </div>
  );
};