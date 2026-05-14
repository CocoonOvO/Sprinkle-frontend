import React from 'react';
import { cn } from '../ui/cn';
import { FileText, FileImage, File, Download } from 'lucide-react';

export interface FileCardProps {
  name: string;
  size: number;
  type?: string;
  onDownload?: () => void;
  onPreview?: () => void;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type?: string) {
  if (!type) return File;
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('text/') || type.includes('document')) return FileText;
  return File;
}

export const FileCard: React.FC<FileCardProps> = ({
  name,
  size,
  type,
  onDownload,
  onPreview,
  className,
}) => {
  const Icon = getFileIcon(type);

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200',
        'hover:bg-gray-100 transition-colors cursor-pointer max-w-xs',
        className
      )}
      onClick={onPreview || onDownload}
    >
      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-400">{formatFileSize(size)}</p>
      </div>
      {onDownload && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4 text-gray-500" />
        </button>
      )}
    </div>
  );
};
