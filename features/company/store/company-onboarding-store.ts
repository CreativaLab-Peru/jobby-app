import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  companyOnboardingSchema,
  CompanyOnboardingFormData,
  companyIdentitySchema,
  companyPurposeSchema,
  companyTeamSchema,
} from "../schemas/company-onboarding.schema";

interface CompanyOnboardingStore {
  step: number;
  formData: CompanyOnboardingFormData;
  errors: Record<string, string>;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<CompanyOnboardingFormData>) => void;
  setErrors: (errors: Record<string, string>) => void;
  validateCurrentStep: () => { success: boolean; error?: string };
  isStepValid: () => boolean;
  reset: () => void;
}

const initialFormData: CompanyOnboardingFormData = {
  name: "",
  logoUrl: "",
  ruc: "",
  website: "",
  primaryColor: "#000000",
  seekingTypes: [],
  students: [],
  generalMembers: [],
};

export const useCompanyOnboardingStore = create<CompanyOnboardingStore>()(
  persist(
    (set, get) => ({
      step: 1,
      formData: initialFormData,
      errors: {},

      setStep: (step) => set({ step }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      setErrors: (errors) => set({ errors }),

      validateCurrentStep: () => {
        const { step, formData } = get();
        let currentSchema;

        switch (step) {
          case 1:
            currentSchema = companyIdentitySchema;
            break;
          case 2:
            currentSchema = companyPurposeSchema;
            break;
          case 3:
            currentSchema = companyTeamSchema;
            break;
          default:
            return { success: true };
        }

        const result = currentSchema.safeParse(formData);

        if (!result.success) {
          const formattedErrors = result.error.flatten().fieldErrors;
          const errorMessages = Object.fromEntries(
            Object.entries(formattedErrors).map(([key, val]) => [key, val?.[0]]),
          );
          set({ errors: errorMessages });
          return {
            success: false,
            error: "Por favor, completa los campos requeridos correctamente.",
          };
        }

        set({ errors: {} });
        return { success: true };
      },

      isStepValid: () => {
        const { step, formData } = get();
        let currentSchema;

        switch (step) {
          case 1:
            currentSchema = companyIdentitySchema;
            break;
          case 2:
            currentSchema = companyPurposeSchema;
            break;
          case 3:
            currentSchema = companyTeamSchema;
            break;
          default:
            return true;
        }

        return currentSchema.safeParse(formData).success;
      },

      reset: () => set({ step: 1, formData: initialFormData, errors: {} }),
    }),
    {
      name: "company-onboarding-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
