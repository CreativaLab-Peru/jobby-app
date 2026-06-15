"use client";

import { useDiagnosticoFlow } from "../hooks/use-diagnostico-flow";
import { DiagnosticoLandingScreen } from "../components/diagnostico-landing-screen";
import { DiagnosticoPaymentForm } from "../components/diagnostico-payment-form";
import { createDiagnosticoPreference } from "../actions/create-diagnostico-preference";
import {JSX} from "react";

interface DiagnosisFlowProps {
  paymentStatus?: "success" | "failure" | "pending";
}

export function DiagnosisFlow({ paymentStatus }: DiagnosisFlowProps) {
  const {
    step,
    setStep,
    setUserInfo,

  } = useDiagnosticoFlow();

  const handleStart = () => {
    setStep("payment");
  };

  const handlePaymentSubmit = async (email: string, name: string) => {
    setUserInfo(email, name);
    const result = await createDiagnosticoPreference(email, name);

    if (result.success && result.redirect) {
      window.location.href = result.redirect;
    } else {
      setStep("payment");
    }
  };

  switch (step) {
    case "landing":
      return <DiagnosticoLandingScreen onStart={handleStart} paymentStatus={paymentStatus} />;

    case "payment":
      return (
        <DiagnosticoPaymentForm
          onSubmit={handlePaymentSubmit}
          isLoading={false}
        />
      );
    default:
      return <DiagnosticoLandingScreen onStart={handleStart} />;
  }
}
