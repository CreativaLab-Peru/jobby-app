import { create } from 'zustand';

interface EvaluationModalStore {
  isOpen: boolean;
  selectedCvId: string | null;
  isAnalyzing: boolean;
  onOpen: () => void;
  onClose: () => void;
  setSelectedCvId: (id: string | null) => void;
  setIsAnalyzing: (loading: boolean) => void;
}

export const useEvaluationModalStore = create<EvaluationModalStore>((set) => ({
  isOpen: false,
  selectedCvId: null,
  isAnalyzing: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false, selectedCvId: null }),
  setSelectedCvId: (id) => set({ selectedCvId: id }),
  setIsAnalyzing: (loading) => set({ isAnalyzing: loading }),
}));
