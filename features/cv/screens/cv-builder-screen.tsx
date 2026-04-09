"use client";

import {useEffect, useState, useTransition} from "react";
import {useAnalysisStore} from "@/hooks/use-analysis-store";
import {useRouter} from "next/navigation";

// Componentes UI
import {HeroSection} from "@/components/public/hero-section";
import {TestimonialsSection} from "@/components/ui/app/public/cv-builder/testimonials-section";
import {HowItWorksSection} from "@/components/ui/app/public/cv-builder/how-it-works-section";
import AutoPlayVideo from "@/components/auto-play-video";
import {FAQSection} from "@/components/ui/app/public/cv-builder/faq-section";
import {AuthInterceptionModal} from "@/components/auth-interception-modal";
import {CreditPackCard} from "@/features/credits/components/credit-pack-card";
import {usePaddle} from "@/features/billing/components/paddle-provider";
import {Switch} from "@/components/ui/switch";

// Actions/Consts
import {
  createPreferenceForAuthenticatedUser
} from "@/features/billing/actions/create-preference-for-authenticated-user";
import {
  createCheckoutForAuthenticatedUserPaddle
} from "@/features/billing/actions/create-checkout-for-authenticated-user-paddle";
import {CreditPackOffer} from "@/features/credits/consts";
import {PaymentMethod} from "@/features/credits/components/payment-method-modal";
import {User} from "@prisma/client";

interface CVBuilderScreenProps {
  user: User | null;
  packs: CreditPackOffer[];
}

export default function CVBuilderScreen({user, packs}: CVBuilderScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const {
    startAnalysis,
    status,
    score,
    reset: resetStore,
    analysisId,
    checkStatus
  } = useAnalysisStore();
  const {openCheckout} = usePaddle();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [displayCurrency, setDisplayCurrency] = useState<"PEN" | "USD">("PEN");

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
  };

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

  const handlePurchase = (packId: string, method: PaymentMethod) => {
    if (isPending) return;
    if (!user?.id) {
      setShowAuthModal(true);
      return;
    }
    startTransition(async () => {
      if (method === PaymentMethod.PADDLE) {
        const result = await createCheckoutForAuthenticatedUserPaddle(packId);
        if (result.success) openCheckout(result.transactionId);
      } else {
        const result = await createPreferenceForAuthenticatedUser(packId);
        if (result.success) window.location.href = result.redirect;
      }
    });
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

      {/* Video Demo */}
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

      <HowItWorksSection/>

      {/* Créditos */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Header */}
          <div className="mb-10 space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Potencia tu perfil
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Adquiere créditos para funciones avanzadas.
            </p>

            <div className="flex flex-col items-center gap-2 pt-2">
              <span className="font-bold text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Moneda
              </span>

              <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
                <span
                  className={`transition-colors ${
                  displayCurrency === "PEN"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
                  }`}
                >
                  S/ PEN
                </span>

                <Switch
                  id="currency-switch"
                  checked={displayCurrency === "USD"}
                  onCheckedChange={(checked) =>
                  setDisplayCurrency(checked ? "USD" : "PEN")
                }
                  aria-label="Cambiar moneda entre soles y dólares"
                />

                <span
                  className={`transition-colors ${
                  displayCurrency === "USD"
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground"
                }`}
                >
            $ USD
          </span>
        </div>
      </div>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
      {packs.map((pack) => (
        <CreditPackCard
          key={pack.id}
          pack={pack}
          onPurchase={handlePurchase}
          isAuthenticated={!!user}
          displayCurrency={displayCurrency}
        />
      ))}
    </div>

  </div>
</section>

      <AuthInterceptionModal open={showAuthModal} onOpenChange={setShowAuthModal}/>
      <TestimonialsSection/>
      <FAQSection/>
    </>
  );
}
