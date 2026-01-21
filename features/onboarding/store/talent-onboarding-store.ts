import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  talentOnboardingBaseSchema,
  TalentOnboardingFormData,
  talentOnboardingSchema
} from "@/features/onboarding/schemas";

// 1. Definimos la estructura del Store usando el tipo inferido de Zod
interface OnboardingStore {
  step: number;
  formData: TalentOnboardingFormData;
  setStep: (step: number) => void;
  updateFormData: (data: Partial<TalentOnboardingFormData>) => void;
  reset: () => void;
  // Agregamos una función de validación interna
  validateCurrentStep: () => { success: boolean; error?: string };
}

const initialFormData: TalentOnboardingFormData = {
  name: "",
  birthDate: "",
  country: "PE",
  targetIndustries: [],
  preferredRoles: [],
  expLevel: "",
  workModality: [],
  relocation: false,
  availability: [],
  skills: [],
  portfolioUrl: "",
  minSalary: 0,
  currency: "USD",
  work: "Remoto",
  email: "",
  password: "",
  confirmPassword: "",
  acceptedTerms: true,
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      step: 1,
      formData: initialFormData,

      setStep: (step) => set({ step }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      reset: () => set({ step: 0, formData: initialFormData }),

      validateCurrentStep: () => {
        const { step, formData } = get();
        console.log(step);

        if (step === 1) {
          return { success: true }; // No hay datos que validar en el paso 0
        }
        const stepSchemas: Record<number, any> = {
          2: talentOnboardingBaseSchema.pick({ name: true, country: true }),
          3: talentOnboardingBaseSchema.pick({ targetIndustries: true, preferredRoles: true }),
          4: talentOnboardingBaseSchema.pick({ expLevel: true }),
          5: talentOnboardingBaseSchema.pick({ workModality: true, relocation: true }),
          6: talentOnboardingBaseSchema.pick({ availability: true }),
          7: talentOnboardingBaseSchema.pick({ skills: true }),
          8: talentOnboardingBaseSchema.pick({ portfolioUrl: true }),
          9: talentOnboardingSchema,
        };
        console.log(stepSchemas);

        const currentSchema = stepSchemas[step];
        if (!currentSchema) return { success: true };

        const result = currentSchema.safeParse(formData);

        if (!result.success) {
          return {
            success: false,
            error: result.error.message || "Error de validación en el formulario",
          };
        }

        return { success: true };
      },
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
      // 3. Opcional: Validar datos al cargar desde el storage
      onRehydrateStorage: () => (state) => {
        console.log('Storage hidratado');
      },
    }
  )
);
