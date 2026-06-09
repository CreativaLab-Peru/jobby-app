"use client";

import { create } from "zustand";

export type DiagnosticoStep =
  | "landing"
  | "payment"
  | "processing"
  | "cv-upload"
  | "onboarding"
  | "loading"
  | "results";

interface DiagnosticoFlowState {
  step: DiagnosticoStep;
  sessionToken: string | null;
  email: string | null;
  name: string | null;
  cvUrl: string | null;
  countries: string[];
  scholarshipType: string | null;
  area: string | null;
  overallScore: number | null;
  profileType: string | null;
  profileDescription: string | null;
  recommendations: object[];
  opportunities: object[];

  setStep: (step: DiagnosticoStep) => void;
  setSessionToken: (token: string) => void;
  setUserInfo: (email: string, name: string) => void;
  setCvUrl: (url: string) => void;
  setOnboardingData: (data: {
    countries: string[];
    scholarshipType: string;
    area: string;
  }) => void;
  setResults: (data: {
    overallScore: number;
    profileType: string;
    profileDescription: string;
    recommendations: object[];
    opportunities: object[];
  }) => void;
  reset: () => void;
}

const initialState = {
  step: "landing" as DiagnosticoStep,
  sessionToken: null,
  email: null,
  name: null,
  cvUrl: null,
  countries: [],
  scholarshipType: null,
  area: null,
  overallScore: null,
  profileType: null,
  profileDescription: null,
  recommendations: [],
  opportunities: [],
};

export const useDiagnosticoFlow = create<DiagnosticoFlowState>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setSessionToken: (sessionToken) => set({ sessionToken }),

  setUserInfo: (email, name) => set({ email, name }),

  setCvUrl: (cvUrl) => set({ cvUrl }),

  setOnboardingData: (data) =>
    set({
      countries: data.countries,
      scholarshipType: data.scholarshipType,
      area: data.area,
    }),

  setResults: (data) =>
    set({
      overallScore: data.overallScore,
      profileType: data.profileType,
      profileDescription: data.profileDescription,
      recommendations: data.recommendations,
      opportunities: data.opportunities,
    }),

  reset: () => set(initialState),
}));
