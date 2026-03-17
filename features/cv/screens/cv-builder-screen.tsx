"use client";

import {useState, useTransition} from "react";
import {TestimonialsSection} from "@/components/ui/app/public/cv-builder/testimonials-section";
import {HowItWorksSection} from "@/components/ui/app/public/cv-builder/how-it-works-section";
import AutoPlayVideo from "@/components/auto-play-video";
import {FAQSection} from "@/components/ui/app/public/cv-builder/faq-section";
import {useAnalysisStore} from "@/hooks/use-analysis-store";
import {useRouter} from "next/navigation";
import {AuthInterceptionModal} from "@/components/auth-interception-modal";
import {CreditPackOffer} from "@/features/credits/consts";
import {CreditPackCard} from "@/features/credits/components/credit-pack-card";
import {User} from "@prisma/client";
import {
  createPreferenceForAuthenticatedUser
} from "@/features/billing/actions/create-preference-for-authenticated-user";
import {
  createCheckoutForAuthenticatedUserPaddle
} from "@/features/billing/actions/create-checkout-for-authenticated-user-paddle";
import {PaymentMethod} from "@/features/credits/components/payment-method-modal";
import {usePaddle} from "@/features/billing/components/paddle-provider";
import {HeroSection} from "@/components/public/hero-section";

interface CVBuilderScreenProps {
  user: User | null;
  packs: CreditPackOffer[];
}

export default function CVBuilderScreen({user, packs}: CVBuilderScreenProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const {setFileData} = useAnalysisStore();

  const {openCheckout} = usePaddle();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFileSelection = async (file: File) => {
    if (!user) {
      // Guardamos aunque no haya usuario (usamos un placeholder o null)
      // Esto asegura que si abre otra pestaña tras loguearse, el archivo ESTÉ ahí.
      await setFileData(file, "anonymous");
      setShowAuthModal(true);
      return;
    }

    await setFileData(file, user.id);
    router.push("/cv?afterOnboarding=true");
  };

  const handlePurchase = (packId: string, method: PaymentMethod) => {
    if (isPending) return;
    const userId = user?.id;
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    startTransition(async () => {
      if (method === "paddle") {
        const result = await createCheckoutForAuthenticatedUserPaddle(packId);
        if (result.success) {
          openCheckout(result.transactionId);
        } else {
          console.error("Error al crear checkout de Paddle:", result.error);
        }
      } else {
        const result = await createPreferenceForAuthenticatedUser(packId);
        if (result.success) {
          window.location.href = result.redirect;
        } else {
          console.error("Error al crear la preferencia de pago:", result.error);
        }
      }
    });
  }

  return (
    <>
      {/* Hero */}
      <HeroSection
        onFileSelected={handleFileSelection}
      />

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

      <HowItWorksSection/>

      <section
        className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Potencia tu perfil con créditos adicionales
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Adquiere paquetes de créditos para desbloquear funciones avanzadas de análisis y
              gestión de CVs.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {packs.map((pack) => (
            <CreditPackCard
              key={pack.id}
              pack={pack}
              onPurchase={handlePurchase}
              isAuthenticated={!!user}
            />
          ))}
        </div>
      </section>

      {/* Modal de Intercepción para Auth con Magic Link */}
      <AuthInterceptionModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />

      {/*<HotSaleSection/>*/}


      <TestimonialsSection/>
      <FAQSection/>
    </>
  );
}
