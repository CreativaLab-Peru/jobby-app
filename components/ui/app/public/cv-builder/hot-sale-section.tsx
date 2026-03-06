"use client";

import {Button} from "@/components/ui/button";
import {Check, ArrowRight, Sparkles} from "lucide-react";
import {useState} from "react";
import {EmailModal} from "@/components/email-modal";

const features = [
  "Análisis personalizado de tu perfil profesional",
  "Score de empleabilidad con IA",
  "Feedback detallado para mejorar tu CV",
  "Recomendaciones de prácticas, trabajos y becas por área y nivel",
  "Hasta 3 versiones optimizadas de CV",
  "Descarga de CV en PDF",
  "3 créditos IA",
];

export function HotSaleSection() {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <section
        className="section-padding bg-gradient-to-br from-levely-green/20 via-levely-from-levely-green/10 to-background relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-10 left-10 w-32 h-32 bg-levely-green/20 rounded-full blur-3xl animate-pulse"/>
          <div
            className="absolute bottom-10 right-10 w-48 h-48 bg-levely-green/15 rounded-full blur-3xl animate-pulse"
            style={{animationDelay: "1s"}}/>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"/>
        </div>

        <div className="container-levely relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="mb-4 text-xl sm:text-2xl lg:text-5xl font-bold tracking-tight">
                ¿Qué es CV Builder?
              </h2>
              <p className="text-md text-muted-foreground max-w-2xl mx-auto">
                Levely CV Builder es una herramienta que analiza tu perfil profesional,
                optimiza tu CV y te recomienda oportunidades alineadas a tu experiencia.
              </p>
            </div>

            {/* Main pricing card */}
            <div className="relative">
              {/* Glow effect */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-levely-green via-levely-green/50 to-levely-green rounded-3xl blur-lg opacity-50 animate-pulse"/>

              <div
                className="relative bg-card border-2 border-levely-green rounded-3xl p-8 md:p-12 shadow-2xl">
                {/* Badge */}
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-levely-green text-lime-foreground text-levely-dark font-bold flex items-center gap-2 shadow-lg">
                  <Sparkles className="w-4 h-4 text-levely-dark"/>
                  Test incluye
                  <Sparkles className="w-4 h-4"/>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center mt-4">
                  {/* Features list */}
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-xl bg-levely-green/5 hover:bg-levely-green/10 transition-colors duration-200"
                      >
                        <div
                          className="w-6 h-6 rounded-full bg-levely-green flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-levely-dark"/>
                        </div>
                        <span className="text-foreground font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="text-center md:text-left space-y-6">
                    <div>
                      <div className="text-muted-foreground text-sm mb-3">Precio único</div>
                      <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span
                        className="text-6xl md:text-7xl font-black text-foreground">S/ 9.90</span>
                      </div>
                      <p className="text-muted-foreground text-sm mt-2">
                        Pago único • Sin suscripciones • Sin cargos ocultos
                      </p>
                    </div>

                    <Button variant="lime"
                            size="xl"
                            className="cursor-pointer w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                            onClick={() => setOpenModal(true)}
                    >
                      Analizar mi CV
                      <ArrowRight className="w-5 h-5 ml-2"/>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      ⚡ Resultados en menos de 60 segundos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EmailModal
        isOpen={openModal}
        closeModal={()=>setOpenModal(false)}
      />
    </>
  );
}
