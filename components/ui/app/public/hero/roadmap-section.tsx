"use client";

import { ArrowRight, CheckCircle2, Circle, Lock, Map, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthCtaRedirect } from "@/hooks/use-auth-cta-redirect";

const steps = [
  {
    title: "Auditoría de Perfil",
    description: "Análisis de fortalezas y áreas de mejora",
    status: "done",
  },
  {
    title: "Desarrollo de Habilidades",
    description: "Ruta de aprendizaje personalizada",
    status: "current",
  },
  {
    title: "Simulación de Entrevistas",
    description: "Prácticas y feedback en tiempo real",
    status: "upcoming",
  },
  {
    title: "Posicionamiento",
    description: "Estrategias de negociación y crecimiento",
    status: "locked",
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
        {/* Contenedor principal estilo Dark/Glassmorphism */}
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
                Plan Personalizado
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Tu Roadmap Inteligente
              </h2>

              <p className="text-lg text-white/70 mb-8">
                Descubre el camino exacto hacia tu próximo salto profesional. Generamos un plan de
                acción paso a paso adaptado a tus objetivos y mercado.
              </p>

              {/* Barra de progreso adaptada al tema oscuro */}
              <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-white/80">Progreso del plan</span>
                  <span className="text-sm font-bold text-levely-green">
                    {completedSteps} de {totalSteps} pasos
                  </span>
                </div>
                <div className="h-2.5 bg-black/50 rounded-full overflow-hidden inset-shadow">
                  <div
                    className="h-full bg-gradient-to-r from-levely-green/70 to-levely-green rounded-full transition-all duration-700 ease-out relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {/* Brillo interno de la barra */}
                    <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 blur-[2px]" />
                  </div>
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
              {/* Badge flotante animado */}
              <div className="absolute -top-6 -right-2 sm:-right-6 z-20 px-4 py-2 rounded-full bg-levely-green text-black text-sm font-bold shadow-[0_0_20px_rgba(var(--levely-green-rgb),0.3)] animate-float hidden sm:flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Ruta Optimizada
              </div>

              {/* Línea vertical (sutil para modo oscuro) */}
              <div className="absolute left-[19px] sm:left-[23px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-levely-green via-white/10 to-transparent" />

              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isDone = step.status === "done";
                  const isCurrent = step.status === "current";
                  const isUpcoming = step.status === "upcoming";
                  const isLocked = step.status === "locked";

                  return (
                    <div key={index} className="relative flex items-start gap-4 sm:gap-6 group">
                      {/* Icono de la línea de tiempo */}
                      <div className="relative z-10 bg-[#1E293B] rounded-full p-1 mt-1 border-[3px] border-[#1E293B] transition-transform group-hover:scale-110">
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
                      </div>

                      {/* Tarjeta de contenido */}
                      <div
                        className={`flex-1 rounded-2xl p-4 sm:p-5 border transition-all duration-300 ${
                          isCurrent
                            ? "bg-white/10 border-levely-green/30 shadow-[0_0_15px_rgba(var(--levely-green-rgb),0.05)]"
                            : "bg-white/5 border-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`font-semibold text-base sm:text-lg ${
                              isDone || isCurrent ? "text-white" : "text-white/50"
                            }`}
                          >
                            {step.title}
                          </p>
                          {isCurrent && (
                            <span className="shrink-0 text-[10px] sm:text-xs px-2.5 py-1 bg-levely-green/20 text-levely-green rounded-full font-medium border border-levely-green/20">
                              En curso
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isDone || isCurrent ? "text-white/70" : "text-white/40"
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
