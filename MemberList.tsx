import React, { useState } from 'react';
import { cn } from '../ui/cn';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useConversationStore, useAuthStore } from '../../stores';
import { ChevronDown, ChevronRight, Sparkles, UserPlus, UserMinus, Crown } from 'lucide-react';
import { PromptEditor } from './PromptEditor';

export const MemberList: React.FC = () => {
  const { currentConversation, members, removeMember } = useConversationStore();
  const { user: currentUser } = useAuthStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const currentMember = members.find(m => m.user_id === currentUser?.id);
  const isAdmin = currentMember?.role === 'admin' || currentMember?.role === 'owner';

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge variant="warning"><Crown className="w-3 h-3 mr-1" />群主</Badge>;
      case 'admin':
        return <Badge variant="primary">管理员</Badge>;
      default:
        return <Badge variant="default">成员</Badge>;
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentConversation) return;
    await removeMember(currentConversation.id, userId);
  };

  return (
    <div className="p-4 space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <Button size="sm" variant="secondary">
            <UserPlus className="w-3.5 h-3.5" />
            添加成员
          </Button>
        </div>
      )}

      <div className="space-y-2">
        {members.map(member => {
          const isExpanded = expandedId === `${member.user_id}-${member.conversation_id}`;
          const isAgent = member.user?.user_type === 'agent';
          const displayName = member.nickname || member.user?.display_name || '未知用户';

          return (
            <div key={`${member.user_id}-${member.conversation_id}`}>
              <div
                className={cn(
                  'flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer',
                  'hover:bg-gray-50'
                )}
              >
                <Avatar
                  name={member.user?.display_name}
                  src={member.user?.avatar_id}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 truncate">{displayName}</span>
                    {getRoleBadge(member.role)}
                    {isAgent && (
                      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 rounded text-xs text-orange-600">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">@{member.user?.username}</p>
                </div>
                <div className="flex items-center gap-1">
                  {isAgent && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : `${member.user_id}-${member.conversation_id}`)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  )}
                  {isAdmin && member.user_id !== currentUser?.id && (
                    <button
                      onClick={() => handleRemoveMember(member.user_id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {isExpanded && isAgent && (
                <div className="ml-10 mr-2 mb-2 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-2">个人提示词</p>
                  <PromptEditor
                    mode="member"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {members.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">暂无成员</p>
        </div>
      )}
    </div>
  );
};