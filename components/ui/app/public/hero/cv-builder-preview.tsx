import { ArrowRight, CheckCircle2, FileText, Sparkles, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  "Análisis completo de tu CV actual",
  "Sugerencias de mejora por sección",
  "Detección de keywords para ATS",
  "Recomendaciones de formato",
];

export function CVBuilderPreview() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        {/* Card wrapper similar to Career Accelerator */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-levely-blue via-levely-blue/70 to-levely-blue/90 p-6 sm:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-lime/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
                <FileText className="w-4 h-4" />
                Producto principal
              </div>

              <h2 className="headline-lg text-white mb-6">CV Builder con IA</h2>

              <p className="text-lg text-white/80 mb-8">
                Analiza y optimiza tu currículum con inteligencia artificial. Recibe feedback
                instantáneo y recomendaciones personalizadas para destacar ante reclutadores.
              </p>

              <ul className="space-y-4 mb-8">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-levely-green mt-0.5 flex-shrink-0" />
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/cv-builder">
                <Button
                  size="lg"
                  className="bg-levely-green text-black hover:bg-levely-green/90 font-semibold cursor-pointer"
                >
                  Probar CV Builder
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Visual - Improved mock UI */}
            <div className="relative">
              {/* Main analysis card */}
              <div className="bg-[#19282D] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/10">
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-levely-green/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-levely-green" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">mi-curriculum.pdf</p>
                      <p className="text-sm text-white/60">Análisis completado</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-levely-green/20">
                    <Sparkles className="w-4 h-4 text-levely-green" />
                    <span className="text-xs font-medium text-levely-green">IA Activa</span>
                  </div>
                </div>

                {/* Score section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-white/80">Puntuación general</span>
                    <span className="text-2xl font-bold text-levely-green">85/100</span>
                  </div>
                  <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-levely-green to-levely-green/70 rounded-full" />
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-levely-green" />
                      <p className="text-xs text-white/60">Experiencia</p>
                    </div>
                    <p className="text-lg font-bold text-white">Excelente</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-4 h-4 text-levely-green" />
                      <p className="text-xs text-white/60">Keywords ATS</p>
                    </div>
                    <p className="text-lg font-bold text-white">12 detectadas</p>
                  </div>
                </div>

                {/* Recommendations preview */}
                <div className="p-4 rounded-xl bg-levely-green/10 border border-levely-green">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-levely-green/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-levely-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white mb-1">Recomendación IA</p>
                      <p className="text-xs text-white/70">
                        Agrega métricas cuantificables a tu sección de logros para aumentar tu
                        puntuación.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-levely-green text-black text-sm font-bold shadow-lg animate-float">
                ✨ +15% empleabilidad
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
