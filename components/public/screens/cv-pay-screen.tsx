"use client";

import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { AuthInterceptionModal } from "@/components/auth-interception-modal";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { User } from "@prisma/client";
import {HeroSection} from "@/components/public/hero-section";
import {CreditPackModal} from "@/features/credits/components/credit-pack-modal";
import {HotSaleSection} from "@/components/ui/app/public/cv-builder/hot-sale-section";
import AutoPlayVideo from "@/components/auto-play-video";
import { CreditPackOffer } from "@/features/credits/consts";

interface CVPayClientContentProps {
  user: User | null;
  packs: CreditPackOffer[];
}

export function CVPayScreen({ user, packs }: CVPayClientContentProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileSelection = async (file: File) => {
    setSelectedFile(file);
    if (!user) {
      // Guardamos temporalmente y pedimos login
      // Todo:cv-pay
      // await setFileData(file, "anonymous");
      // setShowAuthModal(true);
      return;
    }
  };

  const {
    startAnalysis,
    status,
    score,
    reset: resetStore,
    analysisId,
    checkStatus
  } = useAnalysisStore();

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    try {
      await startAnalysis(selectedFile);
    } catch (error) {
      console.error(error);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    resetStore();
  };

  // 1. Efecto de Polling: Si tenemos un ID y estamos analizando, preguntamos al servidor
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (analysisId && status === "ANALYZING") {
      interval = setInterval(() => {
        checkStatus(analysisId);
      }, 2000); // Poll cada 2 segundos
    }

    return () => clearInterval(interval);
  }, [analysisId, status, checkStatus]);

  // 2. Efecto de Redirección: Cuando el status cambia a COMPLETED, nos movemos
  useEffect(() => {
    if (status === "COMPLETED" && analysisId) {
      // Redigimos a la ruta de revisión con el ID del TempCV
      router.push(`/cv-builder/${analysisId}/review`);

      // Opcional: Limpiar el store después de la redirección si no quieres
      // que persista al volver atrás
      // resetStore();
    }
  }, [status, analysisId, router]);

  return (
    <>
      <HeroSection
        onFileSelected={handleFileSelection}
        selectedFile={selectedFile}
        onStartAnalysis={handleStartAnalysis}
        status={status}
        score={score}
        reset={resetAll}
      />
      <HotSaleSection user={user} />
      <CreditPackModal packs={packs} />
      {/* ... Resto de tus secciones (Video, HowItWorks, etc.) */}
      <section className="container-levely section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Ve cómo funciona en acción
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Descubre lo fácil que es crear tu perfil profesional con nuestra plataforma.
            </p>
          </div>

          <div id="video-demo" className="max-w-4xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-levely-green/20 border border-shadow-2xl">
              <AutoPlayVideo src="/videos/videoejemplo-cv.mp4"/>
            </div>
          </div>
        </div>
      </section>
      <AuthInterceptionModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </>
  );
}
