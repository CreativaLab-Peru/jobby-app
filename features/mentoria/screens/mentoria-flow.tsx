"use client";

import { useState } from "react";
import { MentoriaLandingScreen } from "../components/mentoria-landing-screen";
import { MentoriaRequestForm } from "../components/mentoria-request-form";
import { submitMentoriaRequest } from "../actions/submit-mentoria-request";
import { MentoriaRequestData, MentoriaStep } from "../types/mentoria";

interface MentoriaFlowProps {
  requestStatus?: "sent" | "error";
}

export function MentoriaFlow({ requestStatus }: MentoriaFlowProps) {
  const [step, setStep] = useState<MentoriaStep>("landing");
  const [userData, setUserData] = useState<Partial<MentoriaRequestData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => setStep("form");

  const handleFormSubmit = async (data: MentoriaRequestData) => {
    setIsLoading(true);
    setUserData(data);
    const result = await submitMentoriaRequest(data);
    setIsLoading(false);
    if (result.success) {
      setStep("sent");
    }
  };

  switch (step) {
    case "landing":
      return (
        <MentoriaLandingScreen
          onStart={handleStart}
          requestStatus={requestStatus}
        />
      );
    case "form":
      return (
        <MentoriaRequestForm
          onBack={() => setStep("landing")}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      );
    case "sent":
      return (
        <MentoriaLandingScreen
          onStart={handleStart}
          requestStatus="sent"
        />
      );
    default:
      return <MentoriaLandingScreen onStart={handleStart} />;
  }
}
