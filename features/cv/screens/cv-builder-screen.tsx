"use client";

import {useState, useTransition} from "react";
import { TestimonialsSection } from "@/components/ui/app/public/cv-builder/testimonials-section";
import { HowItWorksSection } from "@/components/ui/app/public/cv-builder/how-it-works-section";
import AutoPlayVideo from "@/components/auto-play-video";
import { FAQSection } from "@/components/ui/app/public/cv-builder/faq-section";
import { HeroCards } from "@/components/ui/app/public/cv-builder/hero-cards";
import { FileText } from "lucide-react";
import { SimpleUploadZone } from "@/components/upload/simple-upload-zone"; // El que creamos antes
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { useRouter } from "next/navigation";
import {AuthInterceptionModal} from "@/components/auth-interception-modal";
import {CREDIT_PACKS} from "@/features/credits/consts";
import {CreditPackCard} from "@/features/credits/components/credit-pack-card";
import {User} from "@prisma/client";
import {
  createPreferenceForAuthenticatedUser
} from "@/features/billing/actions/create-preference-for-authenticated-user";

interface CVBuilderScreenProps {
  user: User | null; // Recibimos el usuario desde el servidor
}

export default function CVBuilderScreen({ user }: CVBuilderScreenProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { setFileData } = useAnalysisStore();

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

  const handlePurchase = (packId: string) => {
    if (isPending) return;
    const userId = user?.id;
    if (!userId) {
      setShowAuthModal(true);
      return;
    }
    startTransition(async () => {
      const result = await createPreferenceForAuthenticatedUser(packId);
      if (result.success) {
        window.location.href = result.redirect;
      } else {
        console.error("Error al crear la preferencia de pago:", result.error);
      }
    });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="container-levely relative z-10">
          <div className="flex justify-center lg:justify-center items-center flex-col lg:flex-row gap-12">
            {/* Centered */}
            <div className="flex flex-col items-center max-w-4xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 w-fit">
                <FileText className="w-4 h-4"/>
                Nuevo: CV Builder con IA
              </div>

              <h1 className="mb-6 text-center text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Optimiza tu perfil para el <span className="text-primary">mercado global</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Recibe análisis con IA, recomendaciones claras y oportunidades
                alineadas a tu perfil profesional.
              </p>

              {/* CONTENEDOR DE ACCIÓN RÁPIDA */}
              <div className="relative w-full max-w-lg group">
                {/* Decoración de fondo para dar profundidad */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <div className="relative bg-card border border-border/50 shadow-2xl rounded-[2rem] overflow-hidden">
                  <div className="p-4">
                    <SimpleUploadZone onFileSelected={handleFileSelection} />
                  </div>
                </div>

                {/* Micro-copy de confianza justo debajo */}
                <p className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Más de 500 CVs analizados
                </p>
              </div>
            </div>

            {/* Interactive Hero Cards (Visible solo en desktop para no distraer en móvil) */}
            {/*<div className="relative lg:pl-8 hidden lg:block">*/}
            {/*  <HeroCards/>*/}
            {/*</div>*/}
          </div>
        </div>
      </section>

      <HowItWorksSection/>

      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Potencia tu perfil con créditos adicionales
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground">
              Adquiere paquetes de créditos para desbloquear funciones avanzadas de análisis y gestión de CVs.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {CREDIT_PACKS.map((pack) => (
            <CreditPackCard
              key={pack.id}
              pack={pack}
              onPurchase={handlePurchase}
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
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-levely-green/20 border border-shadow-2xl">
              <AutoPlayVideo src="/videos/videoejemplo-cv.mp4"/>
            </div>
          </div>
        </div>
      </section>
      <TestimonialsSection/>
      <FAQSection/>
    </>
  );
}
