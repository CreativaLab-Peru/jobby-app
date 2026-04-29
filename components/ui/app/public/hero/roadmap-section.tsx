"use client";

import { ArrowRight, CheckCircle2, Circle, Lock, Map, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthCtaRedirect } from "@/hooks/use-auth-cta-redirect";

const steps = [
  {
    step_nro: "PASO 1 - COMPLETADO",
    title: "Descubre tu perfil profesional",
    description: "CV subido y analizado con IA",
    status: "done",
    type: "normal",
  },
  {
    step_nro: "PASO 2 - EN CURSO",
    title: "Optimiza tu perfil con IA",
    description: "Score - textos mejorados - brechas",
    status: "current",
    type: "normal",
  },
  {
    step_nro: "PASO 3 - PRÓXIMO",
    title: "Encuentra oportunidades con match",
    description: "Becas alineadas a tu perfil real",
    status: "upcoming",
    type: "normal",
  },
  {
    step_nro: "PASO 4 - BLOQUEADO",
    title: "Conoce tu ruta personalizada",
    description: "Roadmap paso a paso para tu beca",
    status: "locked",
    type: "normal",
  },
  {
    step_nro: "PASO 5 - BUILDER",
    title: "Lleva tu perfil al siguiente nivel",
    description: "Agenda una asesoría 1:1 y acelera tu crecimiento profesional",
    status: "final",
    type: "end", // Tipo especial para estilo diferenciado
  },
];

export function RoadmapPreview() {
  const { isLoading, goToCtaDestination } = useAuthCtaRedirect({
    authenticatedHref: "/my-roadmaps",
  });

  const totalSteps = steps.length;
  const completedSteps = steps.filter((step) => step.status === "done").length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 p-6 sm:p-10 lg:p-16 border border-white/10 shadow-2xl">
          {/* Luces de fondo (Blobs) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-levely-green/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium mb-6">
                <Map className="w-4 h-4 text-levely-green" />
                Tu ruta personalizada
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Tu Roadmap para ganar tu beca
              </h2>

              <p className="text-lg text-white/70 mb-8">
                Levely genera el camino exacto hacia tu beca, paso a paso, con tareas concretas y
                fechas límite.
              </p>

              {/* Barra de progreso */}
              <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/80">Tu progreso</span>
                  <span className="text-sm font-bold text-levely-green">
                    {completedSteps} de {totalSteps} pasos
                  </span>
                </div>
                <div className="h-2.5 bg-black/50 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-levely-green/70 to-levely-green rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <Button
                size="lg"
                onClick={goToCtaDestination}
                disabled={isLoading}
                className="bg-levely-green text-black hover:bg-levely-green/90 font-semibold cursor-pointer"
              >
                {isLoading ? "Cargando..." : "Probar a generar mi roadmap"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* RIGHT TIMELINE */}
            <div className="relative pl-2 sm:pl-0">
              <div className="absolute -top-11 -right-2 sm:-right-6 z-20 px-4 py-2 rounded-full bg-levely-green text-black text-sm font-bold shadow-lg animate-bounce hidden sm:flex items-center gap-1.5">
                <Zap className="w-4 h-4 fill-current" />
                Ruta activa
              </div>

              {/* Línea vertical */}
              <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-levely-green via-white/10 to-transparent" />

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isDone = step.status === "done";
                  const isCurrent = step.status === "current";
                  const isUpcoming = step.status === "upcoming";
                  const isLocked = step.status === "locked";
                  const isFinal = step.status === "final";
                  const isEndType = step.type === "end";

                  return (
                    <div key={index} className="relative flex items-start gap-4 sm:gap-6 group">
                      {/* Icono de la línea de tiempo */}
                      <div
                        className={`relative z-10 bg-[#1E293B] rounded-full p-1 mt-1 border-[3px] border-[#1E293B] transition-transform ${isEndType ? "scale-125" : "group-hover:scale-110"}`}
                      >
                        {isDone && (
                          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-levely-green" />
                        )}
                        {isCurrent && (
                          <div className="relative">
                            <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white" />
                            <div className="absolute inset-0 bg-white blur-sm rounded-full opacity-50 animate-pulse" />
                          </div>
                        )}
                        {isUpcoming && (
                          <Circle className="w-6 h-6 sm:w-7 sm:h-7 text-white/20 fill-white/5" />
                        )}
                        {isLocked && (
                          <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/5 border border-white/10">
                            <Lock className="w-3.5 h-3.5 text-white/30" />
                          </div>
                        )}
                        {isFinal && (
                          <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-600 text-white shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                            <Zap className="w-4 h-4 fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Tarjeta de contenido diferenciada por TYPE */}
                      <div
                        className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all duration-500 ${
                          isEndType
                            ? "bg-blue-600/10 shadow-[0_0_30px_rgba(52,211,153,0.1)] ring-1 ring-white/10"
                            : isCurrent
                              ? "bg-white/10 border-levely-green/30 shadow-lg"
                              : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <h2
                            className={`text-xs sm:text-sm font-bold uppercase tracking-widest mb-1 ${
                              isEndType ? "text-blue-400 animate-pulse" : "text-levely-green"
                            }`}
                          >
                            {step.step_nro}
                          </h2>
                        </div>

                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`font-bold text-base sm:text-lg ${
                              isDone || isCurrent || isEndType ? "text-white" : "text-white/50"
                            }`}
                          >
                            {step.title}
                          </p>
                        </div>

                        <p
                          className={`text-sm leading-relaxed ${
                            isEndType
                              ? "text-white/90 font-medium"
                              : isDone || isCurrent
                                ? "text-white/70"
                                : "text-white/40"
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
