"use client";

import React, { useState } from "react";
import {StepCredentials} from "@/features/onboarding/components/step-credentials";
import {StepProfile} from "@/features/onboarding/components/step-profile";
import {StepWelcome} from "@/features/onboarding/components/step-welcome";
import {User} from "@prisma/client";
import {Check} from "lucide-react";
import { motion } from "framer-motion";

export type OnboardingData = {
  email: string;
  tempPassword?: string;
  name: string;
  acceptedTerms: boolean;
  token: string
};

type Step = 1 | 2 | 3;

export interface StepProps {
  data: OnboardingData;
  setData: (key: keyof OnboardingData, value: any) => void;
  onNext: () => void;
  onPrev?: () => void;
}

export interface OnboardingFlowProps {
  user: User,
  token: string,
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ user, token }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<OnboardingData>({
    email: user?.email || "unknown@example.com",
    tempPassword: "passwordTmp",
    name: "",
    acceptedTerms: false,
    token,
  });

  const handleSetData = (key: keyof OnboardingData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(3, prev + 1) as Step);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1) as Step);
  };

  const StepIndicator: React.FC<{ step: number; title: string }> = ({ step, title }) => {
    const isCompleted = currentStep > step;
    const isActive = currentStep === step;

    return (
      <div
        className={`flex flex-col items-center p-3 transition-all duration-500 relative z-10
          ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}
      >
        <button
          onClick={() => currentStep >= step && setCurrentStep(step as Step)}
          disabled={currentStep < step}
          className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-500 border-2
            ${isActive
            ? "bg-primary text-primary-foreground border-primary shadow-glow scale-110"
            : isCompleted
              ? "bg-secondary text-secondary-foreground border-secondary"
              : "bg-muted text-muted-foreground border-border cursor-not-allowed"
          }`}
        >
          {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : step}
        </button>
        <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 hidden sm:block
          ${isActive ? "text-primary" : "text-muted-foreground"}`}>
          {title}
        </span>
      </div>
    );
  };

  const renderStep = () => {
    const commonProps: StepProps = {
      data: formData,
      setData: handleSetData,
      onNext: handleNext,
      onPrev: handlePrev,
    };

    switch (currentStep) {
      case 1: return <StepCredentials {...commonProps} />;
      case 2: return <StepProfile {...commonProps} />;
      case 3: return <StepWelcome {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">

        {/* Cabecera y Barra de Progreso */}
        <div className="mb-8 p-6 bg-card rounded-2xl shadow-card border border-border overflow-hidden relative">
          {/* Decoración de fondo sutil */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

          <h1 className="text-2xl font-black text-center text-foreground mb-8 tracking-tight uppercase">
            Comienza con <span className="ai-gradient-text">Levely</span>
          </h1>

          <div className="relative flex justify-between items-center w-full px-4 sm:px-10">
            {/* Track Line */}
            <div className="absolute inset-x-0 mx-14 sm:mx-20 top-[32%] -translate-y-1/2 h-1 z-0">
              <div className="bg-muted w-full h-full rounded-full" />
              {/* Progress Line con ai-gradient */}
              <motion.div
                className="absolute top-0 h-full ai-gradient rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            </div>

            <StepIndicator step={1} title="Credenciales" />
            <StepIndicator step={2} title="Perfil" />
            <StepIndicator step={3} title="Bienvenida" />
          </div>
        </div>

        {/* Contenedor del Paso */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="bg-card border border-border shadow-card p-8 rounded-2xl min-h-[420px] relative overflow-hidden"
        >
          {renderStep()}
        </motion.div>

        {/* Footer info */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-[10px] font-bold tracking-widest text-muted-foreground/40 uppercase">
            Sistema de Evaluación Inteligente v1.0
          </p>
          <div className="px-3 py-1 bg-muted/50 rounded-full border border-border">
            <p className="text-[9px] font-mono text-muted-foreground">
              Secure Node: <span className="text-primary">{token.substring(0, 8)}...</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
