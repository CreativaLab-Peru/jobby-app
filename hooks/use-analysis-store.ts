import { create } from 'zustand';
import { JobStatus } from "@prisma/client";
import {evaluateCvAction} from "@/features/temp-evaluation/actions/evaluate-cv-action";
import {
  getEvaluationStatusAction
} from "@/features/temp-evaluation/actions/get-evaluation-status-action";

interface AnalysisState {
  analysisId: string | null;
  status: 'IDLE' | 'UPLOADING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  score: number | null;
  result: any | null;
  error: string | null;

  startAnalysis: (file: File) => Promise<void>;
  checkStatus: (id: string) => Promise<void>;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set, get) => ({
  analysisId: null,
  status: 'IDLE',
  score: null,
  result: null,
  error: null,

  startAnalysis: async (file: File) => {
    set({ status: 'UPLOADING', error: null });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await evaluateCvAction(formData);

      if (result.error) {
        set({
          status: 'FAILED',
          error: result.error,
          score: result.score ? result.score * 100 : null
        });
        return;
      }

      set({
        analysisId: result.id,
        status: 'ANALYZING',
        score: result.initialScore,
        error: null
      });
    } catch (err) {
      set({ status: 'FAILED', error: "Error en la subida." });
    }
  },

  checkStatus: async (id: string) => {
    const currentStatus = get().status;
    if (currentStatus === 'COMPLETED' || currentStatus === 'FAILED') return;

    try {
      const data = await getEvaluationStatusAction(id);

      if (data.error) throw new Error(data.error);

      // Mapeo según tus JobStatus reales
      switch (data.status) {
        case JobStatus.SUCCEEDED:
          set({
            status: 'COMPLETED',
            score: data.overallScore,
            result: data.extractorOutput
          });
          break;
        case JobStatus.FAILED:
        case JobStatus.CANCELLED:
          set({ status: 'FAILED', error: "El proceso no pudo completarse." });
          break;
        case JobStatus.IN_PROGRESS:
        case JobStatus.PENDING:
          // Mantenemos el estado 'ANALYZING' en la UI
          set({ status: 'ANALYZING' });
          break;
      }
    } catch (err: any) {
      console.error("Polling Error:", err);
      set({ status: 'FAILED', error: err.message });
    }
  },

  reset: () => {
    set({
      analysisId: null,
      status: 'IDLE',
      score: null,
      result: null,
      error: null
    });
  }
}));
