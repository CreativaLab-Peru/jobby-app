import { create } from 'zustand';

interface SidebarState {
  isOpen: boolean;      // Estado en Mobile (Modal)
  isCollapsed: boolean; // Estado en Desktop (Ancho)
  toggleMobile: () => void;
  closeMobile: () => void;
  toggleCollapse: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isCollapsed: false,
  toggleMobile: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMobile: () => set({ isOpen: false }),
  toggleCollapse: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
