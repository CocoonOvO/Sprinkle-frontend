import React, { useState } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useConversationStore } from '../../stores';
import { Camera, Edit3, Check, X, Loader2 } from 'lucide-react';

export const GroupInfo: React.FC = () => {
  const { currentConversation, loadingMembers } = useConversationStore();
  const [editingName, setEditingName] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(false);
  const [nameValue, setNameValue] = useState(currentConversation?.name || '');
  const [descValue, setDescValue] = useState(currentConversation?.metadata?.description || '');
  const [promptValue, setPromptValue] = useState(currentConversation?.metadata?.prompt || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    setEditingName(false);
    setEditingDesc(false);
    setEditingPrompt(false);
  };

  if (loadingMembers || !currentConversation) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center gap-4 py-8">
          {loadingMembers ? (
            <>
              <Loader2 className="w-12 h-12 text-pink-400 animate-spin" />
              <p className="text-slate-400 text-sm">加载中...</p>
            </>
          ) : (
            <>
              <Avatar size="xl" />
              <p className="text-slate-500 text-sm">暂无群信息</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar
            name={currentConversation.name || '群组'}
            size="xl"
          />
          <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="text-center space-y-1">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                className={cn(
                  'px-2 py-1 text-center font-semibold rounded-lg border border-pink-200',
                  'focus:outline-none focus:ring-2 focus:ring-pink-500/30'
                )}
                autoFocus
              />
              <button onClick={handleSave} disabled={saving} className="p-1 text-pink-600">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setEditingName(false)} className="p-1 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <h3 className="font-semibold text-slate-800">{currentConversation.name || '未命名群组'}</h3>
              <button
                onClick={() => {
                  setNameValue(currentConversation.name || '');
                  setEditingName(true);
                }}
                className="p-1 text-slate-400 hover:text-pink-600 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
          )}
          <p className="text-sm text-slate-500">{currentConversation.member_count} 位成员</p>
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">群介绍</label>
        {editingDesc ? (
          <div className="space-y-2">
            <textarea
              value={descValue}
              onChange={(e) => setDescValue(e.target.value)}
              placeholder="添加群介绍..."
              className={cn(
                'w-full h-24 px-3 py-2 text-sm rounded-xl border border-slate-200',
                'focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400',
                'resize-none placeholder:text-slate-400'
              )}
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setEditingDesc(false)}>
                取消
              </Button>
              <Button size="sm" variant="primary" loading={saving} onClick={handleSave}>
                保存
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setDescValue(currentConversation.metadata?.description || '');
              setEditingDesc(true);
            }}
            className={cn(
              'p-3 bg-slate-50 rounded-xl text-sm cursor-pointer',
              'hover:bg-slate-100 transition-colors',
              !currentConversation.metadata?.description && 'text-slate-400'
            )}
          >
            {currentConversation.metadata?.description || '点击添加群介绍'}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700">群聊提示词</label>
          {!editingPrompt ? (
            <button
              onClick={() => {
                setPromptValue(currentConversation?.metadata?.prompt || '');
                setEditingPrompt(true);
              }}
              className="flex items-center gap-1 text-xs text-slate-600 hover:text-pink-600"
            >
              <Edit3 className="w-3 h-3" />
              编辑
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="p-1 text-pink-600 hover:text-pink-700"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditingPrompt(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400">设置群聊的默认提示词</p>
        {editingPrompt ? (
          <div className="space-y-2">
            <textarea
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="设置群聊的默认提示词..."
              className={cn(
                'w-full h-24 px-3 py-2 text-sm rounded-xl border border-slate-200',
                'focus:outline-none focus:ring-2 focus:ring-pink-500/30 focus:border-pink-400',
                'resize-none placeholder:text-slate-400'
              )}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{promptValue.length} / 2000 字</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditingPrompt(false)}>
                  取消
                </Button>
                <Button size="sm" variant="primary" loading={saving} onClick={handleSave}>
                  保存
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'p-3 bg-slate-50 rounded-xl text-sm',
              !currentConversation?.metadata?.prompt && 'text-slate-400'
            )}
          >
            {currentConversation?.metadata?.prompt || '暂无群聊提示词'}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-slate-700">群头像</label>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Avatar name={currentConversation.name || '群组'} size="lg" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-500">点击头像更换</p>
            <p className="text-xs text-slate-400">支持 JPG、PNG，建议 200x200</p>
          </div>
        </div>
      </div>
    </div>
  );
};