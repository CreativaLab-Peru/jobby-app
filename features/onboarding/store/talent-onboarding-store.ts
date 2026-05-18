import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";
import {
  talentOnboardingBaseSchema,
  TalentOnboardingFormData,
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
  isStepValid: () => boolean; // Nueva función de validación ligera
  errors: Record<string, string>; // Guardaremos los errores aquí
  setErrors: (errors: Record<string, string>) => void;
  isOAuth: boolean; // Nuevo flag
  setIsOAuth: (value: boolean) => void;
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
  opportunityTypes: [],
  beca: "",
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      step: 1,
      isOAuth: false,
      setIsOAuth: (value) => set({ isOAuth: value }),
      formData: initialFormData,

      setStep: (step) => set({ step }),

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      reset: () => set({ step: 1, isOAuth: false, formData: initialFormData }),

      validateCurrentStep: () => {
        const { step, formData, isOAuth } = get();

        if (!formData.acceptedTerms) {
          get().updateFormData({ acceptedTerms: true });
        }

        // 1. Definimos los esquemas base
        const stepSchemas: Record<number, any> = {
          2: talentOnboardingBaseSchema.pick({ name: true }),
          //3: talentOnboardingBaseSchema.pick({ targetIndustries: true }),
          3: talentOnboardingBaseSchema.pick({ opportunityTypes: true }),
          // 5: talentOnboardingBaseSchema.pick({ workModality: true, relocation: true }),
          // 6: talentOnboardingBaseSchema.pick({ availability: true }),
          4: talentOnboardingBaseSchema.pick({ expLevel: true }),
        };

        // 2. Lógica especial para el Paso 5 (Cuenta)
        if (step === 5) {
          if (isOAuth) {
            // SI ESTÁ LOGUEADO: Solo validamos términos
            stepSchemas[5] = talentOnboardingBaseSchema.pick({ acceptedTerms: true });
          } else {
            // SI NO ESTÁ LOGUEADO: Validamos credenciales completas
            stepSchemas[5] = talentOnboardingBaseSchema
              .pick({ email: true, password: true, confirmPassword: true, acceptedTerms: true })
              .extend({
                password: z
                  .string()
                  .min(6, "La contraseña debe tener al menos 6 caracteres")
                  .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
                  .regex(/[0-9]/, "Debe contener al menos un número")
                  .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),
              })
              .superRefine((data, ctx) => {
                if (
                  data.password &&
                  data.password.length > 0 &&
                  data.password !== data.confirmPassword
                ) {
                  ctx.addIssue({
                    path: ["confirmPassword"],
                    message: "Las contraseñas no coinciden",
                    code: "custom",
                  });
                }
              });
          }
        }

        const currentSchema = stepSchemas[step];
        if (!currentSchema) return { success: true };

        const result = currentSchema.safeParse(formData);

        if (!result.success) {
          const formattedErrors = result.error.flatten().fieldErrors;
          const errorMessages = Object.fromEntries(
            Object.entries(formattedErrors).map(([key, val]) => [key, val?.[0]]),
          );

          set({ errors: errorMessages }); // Guardamos en el store
          return { success: false };
        }

        return { success: true };
      },

      isStepValid: () => {
        const { step, formData, isOAuth } = get();

        const stepSchemas: Record<number, any> = {
          2: talentOnboardingBaseSchema.pick({ name: true }),
          3: talentOnboardingBaseSchema.pick({ opportunityTypes: true }),
          4: talentOnboardingBaseSchema.pick({ expLevel: true }),
        };

        if (step === 5) {
          if (isOAuth) {
            stepSchemas[5] = talentOnboardingBaseSchema.pick({ acceptedTerms: true });
          } else {
            stepSchemas[5] = talentOnboardingBaseSchema
              .pick({ email: true, password: true, confirmPassword: true, acceptedTerms: true })
              .extend({
                password: z.string().min(6).regex(/[A-Z]/).regex(/[0-9]/).regex(/[^a-zA-Z0-9]/),
              })
              .superRefine((data, ctx) => {
                if (data.password !== data.confirmPassword) {
                  ctx.addIssue({ path: ["confirmPassword"], message: "err", code: "custom" });
                }
              });
          }
        }

        const currentSchema = stepSchemas[step];
        if (!currentSchema) return true;

        return currentSchema.safeParse(formData).success;
      },

      errors: {},
      setErrors: (errors) => set({ errors }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => localStorage),
      // 3. Opcional: Validar datos al cargar desde el storage
      onRehydrateStorage: () => (state) => {
        console.log("Storage hidratado");
      },
    },
  ),
);
