"use client";

import { useState, useEffect } from "react";
import { DiagnosticStatus, ScholarshipType } from "@prisma/client";
import { DiagnosisCvUpload } from "../components/diagnosis-cv-upload";
import { DiagnosticoOnboarding } from "../components/diagnostico-onboarding";
import { DiagnosticoLoading } from "../components/diagnostico-loading";
import { DiagnosticoResults } from "../components/diagnostico-results";
import { updateDiagnosticSession } from "../actions/update-diagnostic-session";
import { triggerDiagnosticProcessing } from "../actions/trigger-diagnostic-processing";
import { uploadCvAction } from "../actions/upload-cv-action";
import {saveAndGetUrlOfCvAction} from "@/features/diagnostico-cv/actions/save-and-get-url-of-cv";

interface DiagnosisSessionFlowProps {
  session: {
    id: string;
    email: string;
    name: string | null;
    status: DiagnosticStatus;
    countries: string[];
    scholarshipType: ScholarshipType | null;
    area: string | null;
    cvUrl: string | null;
  };
  sessionToken: string;
}

type Step = "onboarding" | "cv-upload" | "loading" | "results";

const STORAGE_KEY_PREFIX = "diagnostico_step_";

function resolveInitialStep(
  stored: string | null,
  status: DiagnosticStatus
): Step {
  // If we have a valid stored step, use it (lets users resume mid-flow)
  if (stored && ["onboarding", "cv-upload", "loading", "results"].includes(stored)) {
    return stored as Step;
  }
  // Otherwise derive from server status
  switch (status) {
    case "PENDING":
      return "onboarding";
    case "CV_UPLOADED":
      return "cv-upload";
    case "PROCESSING":
      return "loading";
    case "COMPLETED":
      return "results";
    default:
      return "onboarding";
  }
}

export function DiagnosisSessionFlow({ session, sessionToken }: DiagnosisSessionFlowProps) {
  const [step, setStep] = useState<Step | null>(null); // null until hydrated
  const [onboardingData, setOnboardingData] = useState<{
    countries: string[];
    scholarshipType: string;
    area: string;
  } | null>(null);
  const [error, setError] = useState("")

  const [results, setResults] = useState<{
    overallScore: number;
    profileType: string;
    profileDescription: string;
    recommendations: Array<{ area: string; suggestion: string; priority: string }>;
    opportunities: Array<{
      id: string;
      name: string;
      country: string;
      flag: string;
      type: string;
      url: string;
      matchPercentage: number;
    }>;
  } | null>(null);

  // Hydrate step from localStorage on mount (avoids SSR mismatch)
  useEffect(() => {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionToken}`);
    setStep(resolveInitialStep(stored, session.status));
  }, [session.status, sessionToken]);

  // Persist step to localStorage on every change
  useEffect(() => {
    if (step !== null) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionToken}`, step);
    }
  }, [step, sessionToken]);

  // Step 1: Onboarding complete — save preferences, advance to CV upload
  const handleOnboardingComplete = async (data: {
    countries: string[];
    scholarshipType: string;
    area: string;
  }) => {
    await updateDiagnosticSession(sessionToken, {
      countries: data.countries,
      scholarshipType: data.scholarshipType as ScholarshipType,
      area: data.area,
    });
    setOnboardingData(data);
    setStep("cv-upload");
  };

  // Step 2: CV uploaded — persist CV, then trigger async processing
  const handleCvUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("sessionToken", sessionToken);

    // Upload the CV and get its URL back
    const cvUrl = await saveAndGetUrlOfCvAction(formData);
    console.log("[CV_URL]", cvUrl);
    if (!cvUrl.success || !cvUrl.cvUrl) {
      setError(cvUrl.error || "Algo ha sucedido, contacta con soporte.");
      return;
    }
    const pdfUrl = cvUrl.cvUrl;
    // Trigger Inngest processing via Server Action (not directly from client)
    await triggerDiagnosticProcessing({
      sessionId: session.id,
      cvUrl: pdfUrl,
      countries: onboardingData?.countries ?? session.countries,
      scholarshipType: onboardingData?.scholarshipType ?? session.scholarshipType ?? "",
      area: onboardingData?.area ?? session.area ?? "",
    });

    setStep("loading");
  };

  // Prevent rendering until step is hydrated (avoids layout flash)
  if (step === null) return null;

  switch (step) {
    case "onboarding":
      return (
        <DiagnosticoOnboarding
          onComplete={handleOnboardingComplete}
          isLoading={false}
        />
      );

    case "cv-upload":
      return (
        <DiagnosisCvUpload
          onUpload={handleCvUpload}
          isLoading={false}
        />
      );

    case "loading":
      return <DiagnosticoLoading />;

    case "results":
      return results ? (
        <DiagnosticoResults
          overallScore={results.overallScore}
          profileType={results.profileType}
          profileDescription={results.profileDescription}
          recommendations={results.recommendations}
          opportunities={results.opportunities}
        />
      ) : (
        <DiagnosticoLoading />
      );
  }
}
