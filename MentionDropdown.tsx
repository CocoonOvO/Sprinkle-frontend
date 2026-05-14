import React, { useEffect, useRef } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';

export interface MentionDropdownProps {
  users: Array<{ id: string; name: string; avatar?: string }>;
  query: string;
  selectedIndex: number;
  onSelect: (user: { id: string; name: string }) => void;
  onClose: () => void;
  className?: string;
}

export const MentionDropdown: React.FC<MentionDropdownProps> = ({
  users,
  query,
  selectedIndex,
  onSelect,
  onClose,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    if (containerRef.current) {
      const selectedItem = containerRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      ) as HTMLElement;
      selectedItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  if (filteredUsers.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute bottom-full left-0 mb-1 w-64 bg-white rounded-xl shadow-lg border border-gray-200',
        'max-h-48 overflow-y-auto z-50',
        className
      )}
    >
      {filteredUsers.map((user, index) => (
        <div
          key={user.id}
          data-index={index}
          onClick={() => onSelect(user)}
          className={cn(
            'flex items-center gap-3 px-3 py-2 cursor-pointer transition-colors',
            index === selectedIndex ? 'bg-amber-50' : 'hover:bg-gray-50'
          )}
        >
          <Avatar name={user.name} src={user.avatar} size="xs" />
          <span className="text-sm text-gray-900">{user.name}</span>
        </div>
      ))}
    </div>
  );
};
