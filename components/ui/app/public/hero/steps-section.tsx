import { Check, Lock, Sparkles, FileText, Search, Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container-levely">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left Side: Content */}
          <div className="lg:w-5/12 sticky lg:top-32 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Cómo funciona
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
                4 pasos. Sin adivinar <br />
                <span className="text-primary">qué mejorar.</span>
              </h2>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Nuestra plataforma automatiza el análisis de tu perfil para que solo te enfoques en
              aplicar a las mejores oportunidades globales.
            </p>
          </div>

          {/* Right Side: Steps List */}
          <div className="lg:w-7/12 w-full">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const isActive = step.status === "active";
                const isCompleted = step.status === "completed";
                const isLocked = step.status === "locked";

                return (
                  <div
                    key={step.id}
                    className={cn(
                      "group relative flex gap-6 p-8 rounded-3xl border transition-all duration-500",
                      isActive
                        ? "bg-card border-primary/20 shadow-[0_20px_50px_rgba(0,0,0,0.05)] ring-1 ring-primary/5"
                        : "bg-transparent border-border/40 hover:border-border/80",
                      isLocked && "opacity-60"
                    )}
                  >
                    {/* Step number / icon */}
                    <div className="flex flex-col items-center gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300",
                          isCompleted && "bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20",
                          isActive && "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
                          isLocked && "bg-muted text-muted-foreground border border-border"
                        )}
                      >
                        {isCompleted ? <Check className="w-6 h-6 stroke-[3]" /> : step.id}
                      </div>
                      {/* Vertical line connector */}
                      {index !== steps.length - 1 && (
                        <div className="w-px h-full bg-border/40 group-hover:bg-border transition-colors" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <h3
                          className={cn(
                            "text-xl font-bold tracking-tight transition-colors",
                            isLocked ? "text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {step.title}
                        </h3>
                        {isLocked && <Lock className="w-4 h-4 text-muted-foreground/40" />}
                        {isActive && (
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                            En curso
                          </span>
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-base leading-relaxed max-w-md",
                          isLocked ? "text-muted-foreground/60" : "text-muted-foreground"
                        )}
                      >
                        {step.desc}
                      </p>

                      {step.unlock && (
                        <div className="flex items-center gap-2 pt-3">
                          <div className="h-px w-4 bg-primary/30" />
                          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest italic">
                            {step.unlock}
                          </p>
                        </div>
                      )}
                    </div>
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
