import { create } from 'zustand';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  sidebarCollapsed: boolean;
  detailPanelCollapsed: boolean;
  activeTab: 'info' | 'members' | 'files' | 'settings';
  profileModalOpen: boolean;
  newConvModalOpen: boolean;
  toasts: Toast[];
  toggleSidebar: () => void;
  toggleDetailPanel: () => void;
  setActiveTab: (tab: 'info' | 'members' | 'files' | 'settings') => void;
  setProfileModalOpen: (open: boolean) => void;
  setNewConvModalOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

let toastId = 0;

export const useUIStore = create<UIState>((set, get) => ({
  sidebarCollapsed: false,
  detailPanelCollapsed: false,
  activeTab: 'info',
  profileModalOpen: false,
  newConvModalOpen: false,
  toasts: [],

  toggleSidebar: () => set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  toggleDetailPanel: () => set(state => ({ detailPanelCollapsed: !state.detailPanelCollapsed })),

  setActiveTab: (tab: 'info' | 'members' | 'files' | 'settings') => set({ activeTab: tab }),

  setProfileModalOpen: (open: boolean) => set({ profileModalOpen: open }),

  setNewConvModalOpen: (open: boolean) => set({ newConvModalOpen: open }),

  addToast: (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastId}`;
    const newToast: Toast = { ...toast, id };
    set(state => ({ toasts: [...state.toasts, newToast] }));

    const duration = toast.duration || 3000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },

  removeToast: (id: string) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
  },
}));