import { Check, ArrowRight, Target, BarChart3, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Resumen prof.", value: 91, color: "bg-levely-green" },
  { label: "Educación", value: 85, color: "bg-levely-green" },
  { label: "Exp. laboral", value: 78, color: "bg-levely-green" },
  { label: "Contacto", value: 40, color: "bg-orange-500" },
];

export function AnalysisResultSection() {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="container-levely">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Lado Izquierdo: Score Visualizer */}
          <div className="relative order-2 lg:order-1">
            <div className="relative z-10 flex flex-col items-center justify-center p-12 lg:p-16 rounded-[3rem] bg-card border border-border shadow-2xl">
              <div className="relative group mb-8">
                <div className="w-56 h-56 rounded-full border-[10px] border-muted flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:border-primary/20">
                  <div className="text-center">
                    <span className="text-7xl font-bold text-primary block leading-none">
                      71
                    </span>
                    <span className="text-muted-foreground text-xl font-medium">/100</span>
                  </div>
                </div>
                {/* SVG Progress Circle for better visual impact */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="112"
                    cy="112"
                    r="101"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray="634.6"
                    strokeDashoffset="184"
                    className="text-primary transition-all duration-1000 ease-out"
                  />
                </svg>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-primary/10 blur-[50px] rounded-full -z-10 animate-pulse" />
              </div>

              <div className="w-full space-y-6">
                <div className="flex items-center justify-between px-2">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                    Análisis Detallado
                  </p>
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>

                <div className="grid gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold text-foreground/80">
                          {stat.label}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-bold",
                            stat.value < 50 ? "text-orange-500" : "text-primary"
                          )}
                        >
                          {stat.value}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            stat.value < 50 ? "bg-orange-500" : "bg-primary"
                          )}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: Textos y CTA */}
          <div className="space-y-8 order-1 lg:order-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                  Sugerencia de Mejora
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
                Tu CV tiene potencial, <br />
                <span className="text-primary">pero necesita ajustes.</span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Los comités de <span className="text-foreground font-semibold">Chevening, Fulbright y DAAD</span> revisan cientos de perfiles. Con los ajustes específicos de nuestra IA, el tuyo destacará sobre la competencia de inmediato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
