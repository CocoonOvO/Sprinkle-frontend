import React, { useState } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';
import { useConversationStore, useAuthStore } from '../../stores';
import { Sparkles, Edit3, Check, X, Mail, MessageCircle, Clock } from 'lucide-react';

export const UserInfo: React.FC = () => {
  const { members } = useConversationStore();
  const { user: currentUser } = useAuthStore();
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const [saving, setSaving] = useState(false);

  const otherUser = members.find(m => m.user_id !== currentUser?.id)?.user;
  const isAgent = otherUser?.user_type === 'agent';

  const handleSavePrompt = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setIsEditingPrompt(false);
  };

  if (!otherUser) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center gap-4 py-8">
          <Avatar size="xl" />
          <div className="text-center">
            <p className="text-stone-500 text-sm">暂无用户信息</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-5">
      <div className="flex flex-col items-center gap-3">
        <Avatar name={otherUser.display_name} src={otherUser.avatar_id} size="xl" />
        <div className="text-center space-y-1">
          <h3 className="font-semibold text-gray-900">{otherUser.display_name}</h3>
          <p className="text-sm text-gray-500">@{otherUser.username}</p>
        </div>
        {isAgent && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-stone-100 rounded text-xs text-slate-600">
            <Sparkles className="w-3 h-3" />
            AI
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail className="w-4 h-4 text-gray-400" />
          <span>{otherUser.metadata?.email || '鏆傛棤閭'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>创建于 {new Date(otherUser.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {isAgent && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-stone-700">会话提示词</label>
            {!isEditingPrompt ? (
              <button
                onClick={() => {
                  setPromptValue(otherUser.metadata?.prompt || '');
                  setIsEditingPrompt(true);
                }}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-700"
              >
                <Edit3 className="w-3 h-3" />
                编辑
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSavePrompt}
                  disabled={saving}
                  className="p-1 text-stone-600 hover:text-stone-700"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditingPrompt(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2">璁剧疆 AI 鐨勫璇濅笂涓嬫枃鍜岃鑹插畾涔?/p>
          {isEditingPrompt ? (
            <div className="space-y-2">
              <textarea
                value={promptValue}
                onChange={(e) => setPromptValue(e.target.value)}
                placeholder="为 AI Agent 设置对话上下文?.."
                className={cn(
                  'w-full h-24 px-3 py-2 text-sm rounded-xl border border-gray-200',
                  'focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500',
                  'resize-none placeholder:text-gray-400'
                )}
              />
              <div className="flex items-center justify-end">
                <button
                  onClick={handleSavePrompt}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-500 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div className={cn(
              'p-3 rounded-xl text-sm',
              otherUser.metadata?.prompt ? 'bg-gray-50 text-gray-600' : 'bg-gray-50 text-gray-400'
            )}>
              {otherUser.metadata?.prompt || '暂无提示词?}
            </div>
          )}
        </div>
      )}

      {!isAgent && (
        <div className="pt-3 border-t border-gray-100">
          <div className="bg-stone-50 rounded-xl p-4 text-center">
            <MessageCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-600">涓?{otherUser.display_name} 鐨勭浜哄璇?/p>
          </div>
        </div>
      )}
    </div>
  );
};