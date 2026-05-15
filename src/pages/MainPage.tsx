import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, useConversationStore, useUIStore } from '../stores';
import { Sidebar } from '../components/features/Sidebar';
import { ChatArea } from '../components/features/ChatArea';
import { DetailPanel } from '../components/features/DetailPanel';
import { ProfileModal } from '../components/features/ProfileModal';
import { NewConversationModal } from '../components/features/NewConversationModal';

const SprinkleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-pink-50 to-blue-50" />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '10%', animationDelay: '0s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '20%', animationDelay: '1.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '35%', animationDelay: '0.8s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '50%', animationDelay: '2.2s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '65%', animationDelay: '1s' }} />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '75%', animationDelay: '3s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '85%', animationDelay: '0.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '92%', animationDelay: '2.8s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '5%', animationDelay: '4s' }} />
      <div className="sprinkle-particle sprinkle-particle-5" style={{ left: '28%', animationDelay: '3.5s' }} />
      <div className="sprinkle-particle sprinkle-particle-1" style={{ left: '45%', animationDelay: '1.2s' }} />
      <div className="sprinkle-particle sprinkle-particle-3" style={{ left: '58%', animationDelay: '0.3s' }} />
      <div className="sprinkle-particle sprinkle-particle-2" style={{ left: '72%', animationDelay: '2s' }} />
      <div className="sprinkle-particle sprinkle-particle-4" style={{ left: '88%', animationDelay: '4.5s' }} />
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-blue-400/10 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export const MainPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const { currentConversation } = useConversationStore();
  const { profileModalOpen, newConvModalOpen } = useUIStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex relative overflow-hidden">
      <SprinkleBackground />
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <div className="flex-1 flex overflow-hidden">
          <ChatArea />
          {currentConversation && <DetailPanel />}
        </div>
      </div>
      {profileModalOpen && <ProfileModal />}
      {newConvModalOpen && <NewConversationModal onClose={() => useUIStore.getState().setNewConvModalOpen(false)} />}
    </div>
  );
};
