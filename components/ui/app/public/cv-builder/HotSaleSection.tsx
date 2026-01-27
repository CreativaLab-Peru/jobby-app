import { Button } from "@/components/ui/button";
import { Check, Zap, ArrowRight, Sparkles } from "lucide-react";

const features = [
  "Análisis personalizado de tu perfil profesional",
  "Score de empleabilidad con IA",
  "Feedback detallado para mejorar tu CV",
  "Recomendaciones de prácticas, trabajos y becas por área y nivel",
  "Hasta 3 versiones optimizadas de CV",
  "Descarga de CV en PDF y Word",
  "8 créditos IA",
  "Resultados enviados a tu email",
];

export function HotSaleSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-lime-300/20 via-lime-500/10 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-lime/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-48 h-48 bg-lime/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime text-lime-foreground text-sm font-bold mb-6 animate-pulse">
              <Zap className="w-4 h-4" />
              OFERTA ESPECIAL
              <Zap className="w-4 h-4" />
            </div>
            <h2 className="text-6xl headline-lg mb-4">¿Qué es CV Builder?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Levely CV Builder es una herramienta que analiza tu perfil profesional, optimiza tu CV
              y te recomienda oportunidades alineadas a tu experiencia, habilidades y metas de
              carrera.
            </p>
          </div>

          {/* Main pricing card */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-lime via-lime/50 to-lime rounded-3xl blur-lg opacity-50 animate-pulse" />

            <div className="relative bg-card border-2 border-lime-300 rounded-3xl p-8 md:p-12 shadow-2xl shadow-lime-300/50">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-lime text-lime-foreground text-sm font-bold flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                Test incluye
                <Sparkles className="w-4 h-4" />
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center mt-4">
                {/* Features list */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl bg-lime-200/5 hover:bg-lime-300/10 transition-colors duration-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-lime-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-lime-foreground" />
                      </div>
                      <span className="text-black dark:text-white font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Price and CTA */}
                <div className="text-center md:text-left space-y-6">
                  <div>
                    <div className="py-2 text-muted-foreground text-sm mb-1">Precio único</div>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span className="text-6xl md:text-7xl font-black text-black dark:text-white">
                        S/ 9.90
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">
                      Pago único • Sin suscripciones • Sin cargos ocultos
                    </p>
                  </div>

                  <Button
                    size="xl"
                    className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    Analizar mi CV
                    <ArrowRight className="w-5 h-5 ml-2" />
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
  );
}
