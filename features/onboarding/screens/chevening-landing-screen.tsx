"use client"

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Check, Upload, ArrowRight, Sparkles} from "lucide-react";
import {CheveningFAQ} from "../components/chevening-faq";
import {
  PaymentMethod,
  PaymentMethodModal
} from "@/features/credits/components/payment-method-modal";
import {useState, useTransition} from "react";

import {
  createCheckoutForNewUserPaddle
} from "@/features/billing/actions/create-checkout-for-new-user-paddle";
import {
  createPreferenceForNewUser
} from "@/features/billing/actions/create-preference-for-new-user";
import {EmailModal} from "@/components/email-modal";
import {usePaddle} from "@/features/billing/components/paddle-provider";

export default function CheveningLandingScreen() {
  const PRICE_DISCOUNT = "19.90";
  const PRICE_ORIGINAL = "49.90"; //

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [temporalUserId, setTemporalUserId] = useState<string | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState<string | null>(null);
  const { openCheckout } = usePaddle();

  const handleToggle = () => {
    setIsEmailModalOpen(!isEmailModalOpen);
  };

  const handleMethodSelected = (method: PaymentMethod) => {
    setIsPaymentModalOpen(false);
    if (isPending) {
      return;
    }
    startTransition(async () => {
      if (!temporalUserId) return;
      if (method === PaymentMethod.PADDLE) {
        const result = await createCheckoutForNewUserPaddle(temporalUserId, "STARTER");
        if (result.success) {
          sessionStorage.setItem("paddle_new_user_checkout", "1");
          openCheckout(result.transactionId, checkoutEmail ?? undefined);
        }
      } else {
        const result = await createPreferenceForNewUser(temporalUserId, "STARTER");
        if (result.success) window.location.href = result.redirect;
      }

      // if (isAuthenticated) {
      //   // Usuario con sesión activa — usar flujo autenticado
      //   if (method === PaymentMethod.PADDLE) {
      //     const result = await createCheckoutForAuthenticatedUserPaddle("STARTER");
      //     if (result.success) openCheckout(result.transactionId, sessionEmail ?? undefined);
      //   } else {
      //     const result = await createPreferenceForAuthenticatedUser("STARTER");
      //     if (result.success) window.location.href = result.redirect;
      //   }
      // } else {
      //   // Usuario nuevo — usar flujo con temporalUserId
      //   if (!temporalUserId) return;
      //   if (method === PaymentMethod.PADDLE) {
      //     const result = await createCheckoutForNewUserPaddle(temporalUserId, "STARTER");
      //     if (result.success) {
      //       sessionStorage.setItem("paddle_new_user_checkout", "1");
      //       openCheckout(result.transactionId, checkoutEmail ?? undefined);
      //     }
      //   } else {
      //     const result = await createPreferenceForNewUser(temporalUserId, "STARTER");
      //     if (result.success) window.location.href = result.redirect;
      //   }
      // }
    });
  };

  const handleEmailSuccess = (id: string, email: string) => {
    setTemporalUserId(id);
    setCheckoutEmail(email);
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <div
        className="min-h-screen bg-background flex flex-col items-center p-4 md:p-8 gap-4 max-w-2xl mx-auto">

        {/* HERO SECTION - Visualmente más limpio y enfocado */}
        <section
          className="w-full bg-secondary/40 rounded-[2rem] p-6 md:p-10 flex flex-col gap-6 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl tracking-tighter text-primary">levely</span>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
              Chevening 2025–26
            </Badge>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
              ¿Tu CV está listo para <span className="text-[#1D9E75]">Chevening</span>?
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Analiza tu perfil con IA en 2 minutos, descarga tu CV en formato Harvard y recibe un
              roadmap con los pasos exactos para aplicar.
            </p>
          </div>

          {/* Stats con mejor contraste */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {label: "Analizados", val: "+500"},
              {label: "Tiempo", val: "2 min"},
              {label: "Formato", val: "Harvard"},
            ].map((stat) => (
              <div key={stat.label}
                   className="bg-background/60 backdrop-blur-sm border border-border/40 rounded-2xl p-4 text-center">
                <div className="text-lg md:text-xl font-bold text-primary">{stat.val}</div>
                <div
                  className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleToggle}
              className="w-full bg-[#1D9E75] hover:bg-[#1D9E75]/90 py-7 text-white text-lg font-bold rounded-2xl shadow-lg shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-95 gap-3">
              <Upload className="w-5 h-5"/> Analiza tu CV ahora · S/ {PRICE_DISCOUNT}
              </Button>
              <p className="text-xs text-center text-muted-foreground font-medium">Pago único · Sin
              suscripciones · Acceso inmediato</p>
              </section>

            {/* Grid de información: Dos columnas en escritorio, una en móvil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

            {/* CÓMO FUNCIONA */}
            <Card className="p-6 bg-background border-border/50 rounded-[2rem] space-y-6 shadow-sm">
              <h3
                className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                <Sparkles className="w-3 h-3"/> Cómo funciona
              </h3>
              <div className="space-y-5">
                <Step num={1} title="Sube tu CV" desc="PDF en cualquier formato. < 30 seg."/>
                <Step num={2} title="Recibe tu score"
                      desc="Análisis bajo criterios reales de Chevening."/>
                <Step num={3} title="Formato Harvard"
                      desc="Versión en inglés con textos optimizados."/>
                <Step num={4} title="Roadmap" desc="Pasos para motivación y referencias."/>
              </div>
            </Card>

            {/* PLAN BUILDER */}
            <Card
              className="p-6 bg-background border-border/50 rounded-[2rem] flex flex-col justify-between shadow-sm">
              <div className="space-y-4 text-left">
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Incluido
                  en Builder</h3>
                <div className="space-y-3">
                  <FeatureItem text="Análisis contra criterios Chevening"/>
                  <FeatureItem text="Textos mejorados por IA"/>
                  <FeatureItem text="CV Harvard PDF inmediato"/>
                  <FeatureItem text="Roadmap paso a paso"/>
                  <FeatureItem text="3 créditos de análisis"/>
                </div>
              </div>

              <div
                className="mt-8 bg-secondary/50 p-4 rounded-2xl flex justify-between items-center border border-border/40">
                <div>
                  <div className="text-xl font-bold text-primary">S/ {PRICE_DISCOUNT}</div>
                  <div className="text-[10px] text-muted-foreground font-medium uppercase">Builder
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xs text-muted-foreground line-through font-bold">S/ {PRICE_ORIGINAL}</div>
                  <Badge
                    className="bg-[#1D9E75] text-white hover:bg-[#1D9E75] border-none text-[10px] font-bold">LANZAMIENTO</Badge>
                </div>
              </div>
            </Card>
          </div>

          <div className="w-full">
            <CheveningFAQ/>
          </div>

            {/* CTA FINAL - Sticky-ready o destacado */}
          <div
            className="w-full bg-[#085041] rounded-[2rem] p-8 text-center space-y-4 shadow-xl shadow-green-900/20">
            <h3 className="text-xl font-bold text-white">Empieza tu camino a UK hoy</h3>
            <p className="text-sm text-green-100/80 max-w-xs mx-auto leading-relaxed">
              Sube tu CV ahora y descubre si tienes el perfil de un becario Chevening.
            </p>
            <Button
              className="w-full bg-white text-[#085041] hover:bg-green-50 py-7 text-lg font-bold rounded-2xl gap-2 transition-all"
              onClick={handleToggle}>
              Empieza ahora a solo S/{PRICE_DISCOUNT} <ArrowRight className="w-5 h-5"/>
            </Button>
          </div>

          <footer className="py-6 opacity-40 hover:opacity-100 transition-opacity">
            <p className="text-[10px] font-bold uppercase tracking-widest text-center">
              Levely © 2026 · AI Career
            </p>
          </footer>
      </div>

      {/* Email modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        closeModal={()=>setIsEmailModalOpen(false)}
        onSuccess={handleEmailSuccess}
      />

      {/* Payment modal */}
      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        price={parseFloat(PRICE_DISCOUNT)}
        packName="Builder"
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectMethod={handleMethodSelected}
      />
    </>
  );
}

function Step({num, title, desc}: { num: number; title: string; desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div
        className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary shrink-0 group-hover:bg-[#E1F5EE] group-hover:text-[#085041] transition-colors">
        {num}
      </div>
      <div>
        <h4 className="text-sm font-bold tracking-tight">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FeatureItem({text}: { text: string }) {
  return (
    <div className="flex gap-3 items-center">
      <div className="w-5 h-5 rounded-full bg-[#E1F5EE] flex items-center justify-center shrink-0">
        <Check className="w-3 h-3 text-[#1D9E75]" strokeWidth={4}/>
      </div>
      <span className="text-[13px] font-medium text-primary/80">{text}</span>
    </div>
  );
}
