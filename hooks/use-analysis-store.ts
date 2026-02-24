import { create } from 'zustand';

interface AnalysisState {
  userId: string | null;
  fileUrl: string | null;
  fileName: string | null;
  isAnalyzing: boolean;
  setFileData: (url: string, name: string, userId: string) => void;
  startAnalysis: () => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
  userId: null,
  fileUrl: null,
  fileName: null,
  isAnalyzing: false,
  setFileData: (url, name, userId) => set({
    fileUrl: url,
    fileName: name,
    userId,
  }),
  startAnalysis: () => set({ isAnalyzing: true }),
  reset: () => set({ userId: null, fileUrl: null, fileName: null, isAnalyzing: false }),
}));
