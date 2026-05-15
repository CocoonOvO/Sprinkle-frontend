import React, { useState } from 'react';
import { Switch } from '../ui/Switch';
import { Bell, Lock, Info, Sparkles } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState({
    enabled: true,
    sound: true,
    mentions: true,
  });
  const [privacy, setPrivacy] = useState({
    readReceipt: true,
    typingIndicator: true,
  });

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Bell className="w-4 h-4 text-slate-500" />
          通知设置
        </div>
        <div className="space-y-3 pl-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">接收通知</span>
            <Switch
              checked={notifications.enabled}
              onChange={(checked) => setNotifications(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">消息提示音</span>
            <Switch
              checked={notifications.sound}
              onChange={(checked) => setNotifications(prev => ({ ...prev, sound: checked }))}
              disabled={!notifications.enabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">提及提醒</span>
            <Switch
              checked={notifications.mentions}
              onChange={(checked) => setNotifications(prev => ({ ...prev, mentions: checked }))}
              disabled={!notifications.enabled}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Lock className="w-4 h-4 text-slate-500" />
          隐私设置
        </div>
        <div className="space-y-3 pl-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">已读回执</span>
            <Switch
              checked={privacy.readReceipt}
              onChange={(checked) => setPrivacy(prev => ({ ...prev, readReceipt: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">正在输入提示</span>
            <Switch
              checked={privacy.typingIndicator}
              onChange={(checked) => setPrivacy(prev => ({ ...prev, typingIndicator: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Info className="w-4 h-4 text-pink-500" />
          关于我们
        </div>
        <div className="p-4 bg-gradient-to-r from-stone-50 via-slate-50 to-stone-50 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-stone-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Sprinkle</h4>
              <p className="text-xs text-gray-500">版本 1.0.0</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            甜点系即时通讯应用，为您带来温馨愉悦的聊天体验
          </p>
        </div>
      </div>
    </div>
  );
};