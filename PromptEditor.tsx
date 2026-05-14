import React, { useState, useEffect } from 'react';
import { cn } from '../ui/cn';
import { Button } from '../ui/Button';
import { Save, X } from 'lucide-react';

interface PromptEditorProps {
  mode?: 'agent' | 'member' | 'group';
  initialValue?: string;
  onSave?: (value: string) => Promise<void>;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  mode = 'group',
  initialValue = '',
  onSave,
}) => {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    setHasChanges(false);
  }, [initialValue]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (onSave) {
        await onSave(value);
      } else {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setHasChanges(false);
  };

  const getPlaceholder = () => {
    switch (mode) {
      case 'agent':
        return '设置 AI Agent 的系统提示词，决定其对话风格和行�?..';
      case 'member':
        return '设置该成员在群内的个人提示词...';
      case 'group':
        return '设置群聊的默认提示词...';
      default:
        return '输入提示�?..';
    }
  };

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setHasChanges(e.target.value !== initialValue);
        }}
        placeholder={getPlaceholder()}
        className={cn(
          'w-full h-28 px-3 py-2 text-sm rounded-xl border border-gray-200',
          'focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500',
          'resize-none placeholder:text-gray-400'
        )}
      />
      <div className="flex items-center justify-between">
        <span className={cn(
          'text-xs',
          value.length > 2000 ? 'text-red-500' : 'text-gray-400'
        )}>
          {value.length} / 2000 �?        </span>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              <X className="w-3.5 h-3.5" />
              取消
            </Button>
            <Button size="sm" variant="primary" loading={saving} onClick={handleSave}>
              <Save className="w-3.5 h-3.5" />
              保存
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};