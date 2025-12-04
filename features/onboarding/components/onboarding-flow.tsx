"use client";

import React, { useState } from "react";
import {StepCredentials} from "@/features/onboarding/components/step-credentials";
import {StepProfile} from "@/features/onboarding/components/step-profile";
import {StepWelcome} from "@/features/onboarding/components/step-welcome";
import {User} from "@prisma/client";

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
    setCurrentStep((prev) => Math.min(3, (prev + 1)) as Step);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, (prev - 1)) as Step);
  };

  const renderStep = () => {
    const commonProps: StepProps = {
      data: formData,
      setData: handleSetData,
      onNext: handleNext,
      onPrev: handlePrev,
    };

    switch (currentStep) {
      case 1:
        return <StepCredentials {...commonProps} />;
      case 2:
        return <StepProfile {...commonProps} />;
      case 3:
        return <StepWelcome {...commonProps} />;
      default:
        return <div>Error de paso en el flujo.</div>;
    }
  };

  const StepIndicator: React.FC<{ step: number; title: string }> = ({ step, title }) => (
    <div
      className={`flex flex-col items-center p-3 transition-all duration-500 cursor-pointer z-1 ${
        currentStep >= step ? "text-blue-600" : "text-gray-400"
      }`}
      onClick={() => {
        // Solo permitir retroceder a pasos ya completados o el actual
        if (currentStep >= step) {
          setCurrentStep(step as Step);
        }
      }}
    >
      <div
        className={`w-8 h-8 flex items-center justify-center rounded-full font-bold transition-all duration-500 border-2 ${
          currentStep === step
            ? "bg-blue-500 text-white border-blue-500 shadow-md"
            : currentStep > step
              ? "bg-blue-100 text-blue-600 border-blue-600"
              : "bg-gray-100 text-gray-400 border-gray-400"
        }`}
      >
        {step}
      </div>
      <span className="text-xs mt-1 hidden sm:block">{title}</span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        {/* Cabecera y Barra de Progreso */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
            Configura tu Cuenta
          </h1>
          <div className="relative flex justify-between items-center w-full">
            {/* 1. Contenedor de las líneas de progreso para limitar su ancho */}
            <div className="absolute inset-x-0 mx-10 top-1/2 -translate-y-1/2 h-1 z-0">
              {/* 2. Línea de progreso (Track - Fondo) */}
              <div className="bg-gray-200 w-full h-full"></div>
              {/* 3. Línea de progreso (Progress - Relleno) */}
              <div
                className="absolute top-0 h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              ></div>
            </div>

            <StepIndicator step={1} title="Credenciales" />
            <StepIndicator step={2} title="Perfil" />
            <StepIndicator step={3} title="Bienvenida" />
          </div>
        </div>

        {/* Contenido del Paso */}
        <div className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 p-8 rounded-xl border-gray-100 min-h-[400px]">
          {renderStep()}
        </div>

        <p className="mt-4 text-xs text-center text-gray-400">
          Token de acceso: <span className="font-mono text-gray-500">{"raaa"}</span>
        </p>
      </div>
    </div>
  );
};
