import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingState {
  step: number;
  formData: {
    // Datos Básicos
    name?: string;
    birthDate?: string;
    country: string;
    // Interés
    mainArea?: string;
    primaryRole?: string;
    // Nivel y Modalidad
    expLevel?: string;
    workModality: string[];
    cities: string[];
    availability: string;
    // Skills
    skills: { name: string; level: 'Intermedio' | 'Avanzado' }[];
    // Portafolio
    portfolioUrl?: string;
    email: string,
    password: string,
    confirmPassword: string,
    acceptedTerms: boolean,
  };
  setStep: (step: number) => void;
  updateFormData: (data: Partial<OnboardingState['formData']>) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      step: 0,
      formData: {
        country: "PE",
        workModality: [],
        cities: [],
        availability: "Tiempo completo",
        skills: [],
        email: "",
        password: "",
        confirmPassword: "",
        acceptedTerms: false,
      },
      setStep: (step) => set({ step }),
      updateFormData: (data) =>
        set((state) => ({ formData: { ...state.formData, ...data } })),
      reset: () => set({
        step: 1,
        formData: {
          country: "Peru",
          workModality: [],
          cities: [],
          availability: "Tiempo completo",
          skills: [],
          email: "",
          password: "",
          confirmPassword: "",
          acceptedTerms: false,
        }
      }),
    }),
    {
      name: 'onboarding-storage', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
