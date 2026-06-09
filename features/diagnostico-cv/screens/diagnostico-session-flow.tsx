"use client";

import { useState, useEffect } from "react";
import { DiagnosticStatus, ScholarshipType } from "@prisma/client";
import { DiagnosticoCvUpload } from "../components/diagnostico-cv-upload";
import { DiagnosticoOnboarding } from "../components/diagnostico-onboarding";
import { DiagnosticoLoading } from "../components/diagnostico-loading";
import { DiagnosticoResults } from "../components/diagnostico-results";
import { updateDiagnosticSession } from "../actions/update-diagnostic-session";
import { inngest } from "@/inngest/functions/client";
import { createCvFromPdfAction } from "@/features/cv/actions/create-cv-from-pdf";

interface DiagnosticoSessionFlowProps {
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

const STORAGE_KEY_PREFIX = "diagnostico_step_";

export function DiagnosticoSessionFlow({ session, sessionToken }: DiagnosticoSessionFlowProps) {
  const [step, setStep] = useState<"cv-upload" | "onboarding" | "loading" | "results">("cv-upload");
  const [isInitialized, setIsInitialized] = useState(false);

  const [results, setResults] = useState<{
    overallScore: number;
    profileType: string;
    profileDescription: string;
    recommendations: Array<{ area: string; suggestion: string; priority: string }>;
    opportunities: Array<{ id: string; name: string; country: string; flag: string; type: string; url: string; matchPercentage: number }>;
  } | null>(null);

  // Restore step from localStorage on mount
  useEffect(() => {
    const storedStep = localStorage.getItem(`${STORAGE_KEY_PREFIX}${sessionToken}`);
    if (storedStep && ["cv-upload", "onboarding", "loading", "results"].includes(storedStep)) {
      setStep(storedStep as "cv-upload" | "onboarding" | "loading" | "results");
    } else if (session.status === "PENDING" || session.status === "CV_UPLOADED") {
      setStep("cv-upload");
    } else if (session.status === "PROCESSING") {
      setStep("loading");
    } else if (session.status === "COMPLETED" && session.cvUrl) {
      setStep("onboarding");
    } else {
      setStep("cv-upload");
    }
    setIsInitialized(true);
  }, [session, sessionToken]);

  // Persist step to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${sessionToken}`, step);
    }
  }, [step, sessionToken, isInitialized]);

  const handleCvUpload = async (file: File) => {
    try {
      // Build FormData for createCvFromPdfAction
      const formData = new FormData();
      formData.append("pdf", file);

      setStep("onboarding");

    } catch (error) {
      console.error("[ERROR_CV_UPLOAD]", error);
      throw error;
    }
  };

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

    setStep("loading");

    // Trigger Inngest function to process CV
    await inngest.send({
      name: "diagnostico/cv-ready",
      data: {
        sessionId: session.id,
        cvUrl: session.cvUrl,
        countries: data.countries,
        scholarshipType: data.scholarshipType,
        area: data.area,
      },
    });

    // For demo purposes, simulate results after delay
    setTimeout(() => {
      setResults({
        overallScore: 72,
        profileType: "El Lider de Impacto",
        profileDescription:
          "Tu perfil combina liderazgo demostrado con una fuerte orientacion social. Tienes experiencia en gestion de equipos y proyectos de impacto que te hacen un candidato competitivo para becas como Chevening y Fulbright.",
        recommendations: [
          {
            area: "Experiencia profesional",
            suggestion:
              "Destaca logros cuantificables en tu CV. Agrega metricas especificas de impacto.",
            priority: "HIGH",
          },
          {
            area: "Idiomas",
            suggestion:
              "Considera obtener una certificacion oficial de ingles (IELTS 7.0+) para fortalecer tu aplicacion.",
            priority: "MEDIUM",
          },
          {
            area: "Carta de motivacion",
            suggestion:
              "Enfoca tu carta en como tu experiencia se alinea con los valores del programa escolhido.",
            priority: "MEDIUM",
          },
        ],
        opportunities: [
          {
            id: "1",
            name: "Chevening",
            country: "Reino Unido",
            flag: "🇬🇧",
            type: "FELLOWSHIP",
            url: "https://www.chevening.org/",
            matchPercentage: 85,
          },
          {
            id: "2",
            name: "Fulbright",
            country: "Estados Unidos",
            flag: "🇺🇸",
            type: "MASTER",
            url: "https://fulbrightprogram.org/",
            matchPercentage: 78,
          },
          {
            id: "3",
            name: "DAAD",
            country: "Alemania",
            flag: "🇩🇪",
            type: "MASTER",
            url: "https://www.daad.de/en/",
            matchPercentage: 72,
          },
        ],
      });
      setStep("results");
    }, 5000);
  };

  if (!isInitialized) {
    return <DiagnosticoLoading />;
  }

  switch (step) {
    case "cv-upload":
      return <DiagnosticoCvUpload onUpload={handleCvUpload} isLoading={false} />;

    case "onboarding":
      return (
        <DiagnosticoOnboarding onComplete={handleOnboardingComplete} isLoading={false} />
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

    default:
      return <DiagnosticoCvUpload onUpload={handleCvUpload} isLoading={false} />;
  }
}
