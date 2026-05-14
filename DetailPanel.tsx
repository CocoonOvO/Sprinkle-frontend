import React from 'react';
import { cn } from '../ui/cn';
import { useUIStore } from '../../stores';
import { Info, Users, FolderOpen, Settings, X } from 'lucide-react';
import { UserInfo } from './UserInfo';
import { GroupInfo } from './GroupInfo';
import { MemberList } from './MemberList';
import { FileGallery } from './FileGallery';
import { SettingsPanel } from './SettingsPanel';
import { useConversationStore } from '../../stores';

interface DetailPanelProps {
  className?: string;
}

const groupTabs = [
  { key: 'info', icon: Info, title: '详情' },
  { key: 'members', icon: Users, title: '成员' },
  { key: 'files', icon: FolderOpen, title: '文件' },
  { key: 'settings', icon: Settings, title: '设置' },
] as const;

const directTabs = [
  { key: 'info', icon: Info, title: '详情' },
] as const;

export const DetailPanel: React.FC<DetailPanelProps> = ({ className }) => {
  const detailPanelCollapsed = useUIStore(state => state.detailPanelCollapsed);
  const toggleDetailPanel = useUIStore(state => state.toggleDetailPanel);
  const setActiveTab = useUIStore(state => state.setActiveTab);
  const activeTab = useUIStore(state => state.activeTab);
  const { currentConversation } = useConversationStore();

  const isDirect = currentConversation?.type === 'direct';
  const tabs = isDirect ? directTabs : groupTabs;

  return (
    <div
      className={cn(
        'h-full flex flex-col bg-white border-l border-gray-100 transition-all duration-300 ease-out',
        detailPanelCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-80 opacity-100',
        className
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
        <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
          {tabs.map(({ key, icon: Icon, title }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                'relative p-2 rounded-lg transition-all duration-150 group',
                activeTab === key
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              )}
              title={title}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
        <button
          onClick={toggleDetailPanel}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'info' && (
          <div>
            {isDirect ? <UserInfo /> : <GroupInfo />}
          </div>
        )}

        {!isDirect && activeTab === 'members' && (
          <MemberList />
        )}

        {!isDirect && activeTab === 'files' && (
          <FileGallery />
        )}

        {!isDirect && activeTab === 'settings' && (
          <SettingsPanel />
        )}
      </div>
    </div>
  );
};