import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../ui/cn';
import { Image, Paperclip, Send, X } from 'lucide-react';

export interface MessageInputProps {
  onSend?: (content: string, attachments?: File[]) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  placeholder = '输入消息...',
  className,
}) => {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    onTyping?.(e.target.value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue && files.length === 0) return;

    onSend?.(trimmedValue, files);
    setValue('');
    setFiles([]);
    onTyping?.(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const imageFiles = files.filter((f) => f.type.startsWith('image/'));
  const otherFiles = files.filter((f) => !f.type.startsWith('image/'));

  const canSend = value.trim() || files.length > 0;

  return (
    <div
      className={cn(
        'border-t bg-white/80 backdrop-blur-md px-4 py-3 flex flex-col',
        isDragging && 'bg-pink-50/50 border-pink-200',
        className
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 animate-slide-in">
          {imageFiles.map((file, i) => (
            <div key={`img-${i}`} className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-50 shadow-sm">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(files.indexOf(file))}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {otherFiles.map((file, i) => (
            <div key={`file-${i}`} className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg text-xs shadow-sm">
              <Paperclip className="w-3 h-3 text-pink-400" />
              <span className="text-slate-600 max-w-[80px] truncate">{file.name}</span>
              <button onClick={() => removeFile(files.indexOf(file))} className="text-slate-300 hover:text-red-500 transition-colors ml-1">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-2xl border-2 px-4 py-2.5 bg-white/90',
            'focus:outline-none text-sm min-h-[44px] max-h-[120px]',
            'placeholder:text-slate-300 text-slate-600',
            'transition-all duration-200 input-sprinkle'
          )}
        />

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="flex items-center gap-1">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="p-2.5 hover:bg-pink-50 rounded-xl transition-colors text-slate-400 hover:text-pink-500"
            title="添加图片"
          >
            <Image className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 hover:bg-pink-50 rounded-xl transition-colors text-slate-400 hover:text-pink-500"
            title="添加文件"
          >
            <Paperclip className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'p-2.5 rounded-2xl transition-all duration-200 shadow-md',
            canSend
              ? 'bg-gradient-to-br from-pink-400 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md btn-sprinkle'
              : 'bg-stone-100 text-stone-300 cursor-not-allowed'
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
