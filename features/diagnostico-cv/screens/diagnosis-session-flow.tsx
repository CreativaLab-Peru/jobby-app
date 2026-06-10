"use client";

import { useState, useEffect } from "react";
import { DiagnosticStatus, ScholarshipType } from "@prisma/client";
import { DiagnosisCvUpload } from "../components/diagnosis-cv-upload";
import { DiagnosticoProcessing } from "../components/diagnostico-loading";
import { updateDiagnosticSession } from "../actions/update-diagnostic-session";
import { triggerDiagnosticProcessing } from "../actions/trigger-diagnostic-processing";
import { saveAndGetUrlOfCvAction } from "@/features/diagnostico-cv/actions/save-and-get-url-of-cv";
import {DiagnosticoOnboarding} from "@/features/diagnostico-cv/components/diagnostico-onboarding";

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

type Step = "onboarding" | "cv-upload" | "loading";

// ─── Storage helpers ──────────────────────────────────────────────────────────

const STORAGE_STEP_KEY    = (token: string) => `diagnostico_step_${token}`;
const STORAGE_ONBOARD_KEY = (token: string) => `diagnostico_onboard_${token}`;

interface PersistedOnboarding {
  countries: string[];
  scholarshipType: string;
  area: string;
}

function resolveInitialStep(stored: string | null, status: DiagnosticStatus): Step {
  const valid: Step[] = ["onboarding", "cv-upload", "loading"];
  if (stored && valid.includes(stored as Step)) return stored as Step;

  switch (status) {
    case "PENDING":    return "onboarding";
    case "CV_UPLOADED":return "cv-upload";
    case "PROCESSING": return "loading";
    // COMPLETED now falls back to loading — results are sent by email
    default:           return "onboarding";
  }
}

function loadOnboarding(token: string): PersistedOnboarding | null {
  try {
    const raw = localStorage.getItem(STORAGE_ONBOARD_KEY(token));
    return raw ? (JSON.parse(raw) as PersistedOnboarding) : null;
  } catch {
    return null;
  }
}

function saveOnboarding(token: string, data: PersistedOnboarding) {
  try {
    localStorage.setItem(STORAGE_ONBOARD_KEY(token), JSON.stringify(data));
  } catch {
    // storage quota exceeded — non-fatal
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DiagnosisSessionFlow({ session, sessionToken }: DiagnosisSessionFlowProps) {
  const [step, setStep]               = useState<Step | null>(null);
  const [onboardingData, setOnboardingData] = useState<PersistedOnboarding | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // ── Hydrate from localStorage on mount ──
  useEffect(() => {
    const storedStep     = localStorage.getItem(STORAGE_STEP_KEY(sessionToken));
    const storedOnboard  = loadOnboarding(sessionToken);

    setStep(resolveInitialStep(storedStep, session.status));

    // Prefer DB values when available; fall back to localStorage
    if (session.countries.length > 0 && session.scholarshipType && session.area) {
      setOnboardingData({
        countries:      session.countries,
        scholarshipType: session.scholarshipType,
        area:            session.area,
      });
    } else if (storedOnboard) {
      setOnboardingData(storedOnboard);
    }
  }, [session, sessionToken]);

  // ── Persist step whenever it changes ──
  useEffect(() => {
    if (step !== null) {
      localStorage.setItem(STORAGE_STEP_KEY(sessionToken), step);
    }
  }, [step, sessionToken]);

  // ── Handlers ──

  const handleOnboardingComplete = async (data: PersistedOnboarding) => {
    await updateDiagnosticSession(sessionToken, {
      countries:      data.countries,
      scholarshipType: data.scholarshipType as ScholarshipType,
      area:            data.area,
    });

    saveOnboarding(sessionToken, data);
    setOnboardingData(data);
    setStep("cv-upload");
  };

  const handleBackToOnboarding = () => {
    setStep("onboarding");
  };

  const handleCvUpload = async (file: File) => {
    setUploadError(null);

    // ── Guard: ensure onboarding data is present ──
    const countries      = onboardingData?.countries      ?? session.countries;
    const scholarshipType= onboardingData?.scholarshipType ?? session.scholarshipType ?? "";
    const area           = onboardingData?.area           ?? session.area           ?? "";

    if (!countries.length || !scholarshipType || !area) {
      setUploadError(
        "Faltan datos del perfil. Por favor regresa y completa todos los pasos anteriores."
      );
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("sessionToken", sessionToken);

      const cvUrl = await saveAndGetUrlOfCvAction(formData);
      if (!cvUrl.success || !cvUrl.cvUrl) {
        setUploadError(cvUrl.error ?? "Algo ha sucedido, contacta con soporte.");
        return;
      }

      await triggerDiagnosticProcessing({
        sessionId: session.id,
        cvUrl:     cvUrl.cvUrl,
        countries,
        scholarshipType,
        area,
      });

      setStep("loading");
    } catch {
      setUploadError("Error inesperado al subir el CV. Intenta de nuevo.");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Render ──

  if (step === null) return null;

  switch (step) {
    case "onboarding":
      return (
        <DiagnosticoOnboarding
          initialData={onboardingData ?? undefined}
          onComplete={handleOnboardingComplete}
          isLoading={false}
        />
      );

    case "cv-upload":
      return (
        <DiagnosisCvUpload
          onUpload={handleCvUpload}
          onBack={handleBackToOnboarding}
          isLoading={isUploading}
          error={uploadError}
        />
      );

    case "loading":
      return <DiagnosticoProcessing />;
  }
}
