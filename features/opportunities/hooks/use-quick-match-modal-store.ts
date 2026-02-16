import { create } from 'zustand';

interface QuickMatchModalStore {
  isOpen: boolean;
  selectedCvId: string | null;
  isMatching: boolean;
  onOpen: () => void;
  onClose: () => void;
  setSelectedCvId: (id: string | null) => void;
  setIsMatching: (loading: boolean) => void;
}

export const useQuickMatchModalStore = create<QuickMatchModalStore>((set) => ({
  isOpen: false,
  selectedCvId: null,
  isMatching: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, selectedCvId: null }),
  setSelectedCvId: (id) => set({ selectedCvId: id }),
  setIsMatching: (loading) => set({ isMatching: loading }),
}));

