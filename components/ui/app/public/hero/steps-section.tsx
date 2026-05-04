import { Check, Lock, Sparkles, FileText, Search, Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Sube tu CV",
    desc: "Solo tu archivo. Tarda menos de 2 minutos. Levely lo analiza automáticamente.",
    status: "completed",
  },
  {
    id: 2,
    title: "Optimiza tu perfil con IA",
    desc: "Score real + recomendaciones específicas para la beca que elegiste. Texto mejorado listo para copiar.",
    status: "active",
  },
  {
    id: 3,
    title: "Encuentra oportunidades con match",
    desc: "Becas reales alineadas a tu perfil, con % de compatibilidad calculado por IA.",
    status: "locked",
    unlock: "Se desbloquea al optimizar tu perfil",
  },
  {
    id: 4,
    title: "Conoce tu ruta personalizada",
    desc: "Un roadmap fase por fase para aplicar a tu beca meta. Exactamente qué hacer, en qué orden.",
    status: "locked",
  },
];

export function StepBuilderHero() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        {/* Card Principal */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary dark:bg-levely-dark p-8 sm:p-14 lg:p-20 shadow-2xl border border-white/5">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col space-y-8">
              <div className="space-y-4">
                <p className="text-white/50 uppercase tracking-[0.2em] text-xs font-semibold">
                  Cómo funciona
                </p>
                <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
                  4 pasos. Sin adivinar <br />
                  <span className="text-white/60 font-medium">qué mejorar.</span>
                </h2>
              </div>

              <p className="text-xl text-white/50 max-w-md leading-relaxed">
                Nuestra plataforma automatiza el análisis de tu perfil para que solo te enfoques en
                aplicar.
              </p>
            </div>

            {/* Lado Derecho: La secuencia de pasos fiel a la imagen */}
            <div className="flex flex-col gap-4">
              {steps.map((step) => {
                const isActive = step.status === "active";
                const isCompleted = step.status === "completed";
                const isLocked = step.status === "locked";

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "group relative flex gap-5 p-6 rounded-[1.5rem] border transition-all duration-500",
                      // Estilos basados en estado
                      isActive
                        ? "bg-[#162125] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
                        : "bg-white/[0.03] border-white/[0.05]",
                      isLocked && "opacity-70",
                    )}
                  >
                    {/* Círculo del Número/Estado */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                        isCompleted &&
                          "bg-secondary text-secondary-foreground shadow-[0_0_15px_rgba(163,230,53,0.3)]",
                        isActive && "bg-secondary text-secondary-foreground",
                        isLocked && "bg-white/10 text-white/40 border border-white/10",
                      )}
                    >
                      {isCompleted ? <Check className="w-5 h-5 stroke-[3.5]" /> : step.id}
                    </div>

                    {/* Contenido */}
                    <div className="space-y-1.5 pt-1">
                      <h3
                        className={cn(
                          "text-lg font-bold tracking-tight transition-colors",
                          isLocked ? "text-white/40" : "text-white",
                        )}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          isLocked ? "text-white/20" : "text-white/50",
                        )}
                      >
                        {step.desc}
                      </p>

                      {step.unlock && (
                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest pt-2 italic">
                          {step.unlock}
                        </p>
                      )}
                    </div>

                    {/* Icono de Candado para los bloqueados */}
                    {isLocked && (
                      <div className="absolute top-6 right-6">
                        <Lock className="w-4 h-4 text-white/10" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
