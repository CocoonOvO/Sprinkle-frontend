import React from 'react';
import { cn } from '../ui/cn';
import { X } from 'lucide-react';

export interface ImagePreviewProps {
  urls: string[];
  onRemove?: (index: number) => void;
  onClick?: (index: number) => void;
  className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ urls, onRemove, onClick, className }) => {
  if (urls.length === 0) return null;

  return (
    <div className={cn('grid grid-cols-4 gap-2 p-2', className)}>
      {urls.map((url, index) => (
        <div key={index} className="relative group">
          <img
            src={url}
            alt={`preview-${index}`}
            className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => onClick?.(index)}
          />
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(index);
              }}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
