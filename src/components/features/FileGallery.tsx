import React, { useState } from 'react';
import { cn } from '../ui/cn';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useConversationStore } from '../../stores';
import { Trash2, CheckSquare } from 'lucide-react';
import type { File } from '../../types';

export const FileGallery: React.FC = () => {
  const { currentConversation } = useConversationStore();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const imageFiles: File[] = (currentConversation ? [
    { id: 'file_2', file_name: 'design_mockup.png', file_size: 2048000, mime_type: 'image/png', conversation_id: currentConversation.id, uploader_id: 'user_2', created_at: '2024-06-02T11:00:00Z', url: 'https://picsum.photos/400/300' },
    { id: 'file_6', file_name: 'architecture.png', file_size: 1536000, mime_type: 'image/png', conversation_id: currentConversation.id, uploader_id: 'user_1', created_at: '2024-06-10T13:00:00Z', url: 'https://picsum.photos/400/301' },
  ] : []).filter(f => f.mime_type.startsWith('image/'));

  const toggleSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    setSelectedFiles(new Set());
  };

  return (
    <div className="p-4 space-y-4">
      {selectedFiles.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
          <span className="text-sm text-slate-700">
            已选择 {selectedFiles.size} �?          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setSelectedFiles(new Set())}>
              取消
            </Button>
            <Button size="sm" variant="danger" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="w-3.5 h-3.5" />
              删除
            </Button>
          </div>
        </div>
      )}

      {imageFiles.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {imageFiles.map(file => (
            <div
              key={file.id}
              className={cn(
                'relative group aspect-square rounded-xl overflow-hidden cursor-pointer',
                'ring-2 ring-transparent',
                selectedFiles.has(file.id) && 'ring-pink-500'
              )}
              onClick={() => setPreviewFile(file)}
            >
              <img
                src={file.url}
                alt={file.file_name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSelect(file.id);
                }}
                className={cn(
                  'absolute top-2 left-2 w-5 h-5 rounded-md border-2 transition-all',
                  selectedFiles.has(file.id)
                    ? 'bg-pink-500 border-pink-500'
                    : 'bg-white/50 border-white opacity-0 group-hover:opacity-100'
                )}
              >
                {selectedFiles.has(file.id) && <CheckSquare className="w-full h-full text-white" />}
              </button>
              <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{file.file_name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4">
            <img src="/illustrations/waiting-donut.svg" alt="" className="w-full h-full opacity-50" />
          </div>
          <p className="text-stone-500 text-sm">暂无图片</p>
          <p className="text-stone-400 text-xs mt-1">群内分享的图片将在此展示</p>
        </div>
      )}

      <Modal open={!!previewFile} onClose={() => setPreviewFile(null)} className="max-w-3xl">
        {previewFile && (
          <div className="relative">
            <img
              src={previewFile.url}
              alt={previewFile.file_name}
              className="max-h-[70vh] w-auto mx-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="font-medium text-gray-900">{previewFile.file_name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {(previewFile.file_size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">确认删除</h3>
          <p className="text-sm text-gray-500 mb-6">
            确定要删除选中�?{selectedFiles.size} 张图片吗？此操作无法撤销�?          </p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};