import React, { useState, useRef } from 'react';
import { X, Camera, User, Mail, Shield, Calendar } from 'lucide-react';
import { cn } from '../ui';
import { Avatar } from '../ui/Avatar';
import { useAuthStore, useUIStore } from '../../stores';
import { filesApi } from '../../api/files';

export const ProfileModal: React.FC = () => {
  const { user, updateUser, setAvatar, removeAvatar } = useAuthStore();
  const { setProfileModalOpen } = useUIStore();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [metadata] = useState<Record<string, string>>(
    user?.metadata as Record<string, string> || {}
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => setProfileModalOpen(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileResponse = await filesApi.upload(file);
      await setAvatar(fileResponse.id);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
    } catch (err) {
      console.error('Remove avatar failed:', err);
    }
  };

  const handleSave = async () => {
    const hasNameChange = displayName.trim() !== user?.display_name;
    const hasMetadataChange = JSON.stringify(metadata) !== JSON.stringify(user?.metadata as Record<string, string> || {});

    if (!hasNameChange && !hasMetadataChange) {
      handleClose();
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        display_name: displayName.trim(),
        metadata,
      });
      handleClose();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-100 via-pink-50/30 to-slate-100">
      <div className="absolute inset-0 backdrop-blur-sm" onClick={handleClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl flex flex-col animate-scale-in w-[480px] max-h-[calc(100vh-80px)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-lg text-slate-700">编辑个人资料</h3>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div
                className="cursor-pointer group"
                onClick={handleAvatarClick}
              >
                <div className="relative">
                  <Avatar name={user?.display_name} size="xl" />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {isUploading ? (
                      <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex gap-2 mt-3">
              {user?.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                >
                  移除头像
                </button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  显示名称
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="输入显示名称"
                  className={cn(
                    'w-full h-11 px-4 rounded-xl border border-slate-200',
                    'text-slate-700 placeholder:text-slate-300',
                    'focus:outline-none focus:border-pink-300 focus:shadow-[0_0_0_3px_rgba(236,72,153,0.1)]',
                    'hover:border-slate-300 transition-all'
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  用户名
                </label>
                <div className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center">
                  <span className="text-slate-400">@{user?.username}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                用户类型
              </label>
              <div className="w-full h-11 px-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center">
                <span className="text-slate-400 capitalize">{user?.user_type || 'user'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                附加信息
              </label>
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-16">ID:</span>
                  <span className="text-sm text-slate-600 font-mono">{user?.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-16">创建:</span>
                  <span className="text-sm text-slate-600">
                    {user?.created_at ? new Date(user.created_at).toLocaleString('zh-CN') : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-100">
          <button
            onClick={handleClose}
            className="flex-1 h-12 rounded-xl border border-slate-200 text-slate-500 font-medium hover:bg-white transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 text-white font-medium hover:from-pink-500 hover:to-pink-600 transition-all disabled:opacity-50 shadow-md hover-lift"
          >
            {isSaving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
    </div>
  );
};