import { create } from 'zustand';
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

interface CreditsStore {
  credits: CreditLimits;
  setCredits: (credits: CreditLimits) => void;
  decrementManageCvs: () => void;
  decrementAiActions: () => void;
  decrementOpportunities: () => void;
  refreshCredits: () => Promise<void>;
}

export const useCreditsStore = create<CreditsStore>((set) => ({
  credits: {
    manageCvsLimit: 0,
    aiActionsLimit: 0,
    opportunitiesActionsLimit: 0,
  },
  setCredits: (credits) => set({ credits }),
  decrementManageCvs: () =>
    set((state) => ({
      credits: {
        ...state.credits,
        manageCvsLimit: Math.max(0, state.credits.manageCvsLimit - 1),
      },
    })),
  decrementAiActions: () =>
    set((state) => ({
      credits: {
        ...state.credits,
        aiActionsLimit: Math.max(0, state.credits.aiActionsLimit - 1),
      },
    })),
  decrementOpportunities: () =>
    set((state) => ({
      credits: {
        ...state.credits,
        opportunitiesActionsLimit: Math.max(0, state.credits.opportunitiesActionsLimit - 1),
      },
    })),
  refreshCredits: async () => {
    try {
      const response = await getCurrentCreditLimits();
      console.log("[REFRESH_CREDITS]:", response);
      set({ credits: response });
    } catch (error) {
      console.error('Error refreshing credits:', error);
    }
  },
}));
