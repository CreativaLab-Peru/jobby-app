import { Lock, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const scholarships = [
  {
    title: "France Excellence Eiffel",
    institution: "Ministerio Europa y Asuntos Exteriores",
    country: "Francia",
    description: "Para los mejores perfiles de máster y doctorado.",
    match: 59,
    status: "available",
  },
  {
    title: "MAECI",
    institution: "Gobierno de Italia",
    country: "Italia",
    description: "Fomenta cooperación internacional y cultura italiana.",
    match: 54,
    status: "available",
  },
  {
    title: "DAAD",
    institution: "Fundación Carolina",
    country: "Alemania / España",
    description: "Programas de investigación y postgrado de alto nivel.",
    match: 0,
    status: "locked",
    lockedText: "Desbloquea las 4 oportunidades restantes con Builder · S/19.90",
  },
  {
    title: "Chevening",
    institution: "Gobierno del Reino Unido",
    country: "Reino Unido",
    description: "Líderes con potencial para influir en el futuro.",
    match: 0,
    status: "locked",
    lockedText: "DAAD · Fundación Carolina · Ministerul y más",
  },
];

export function ScholarshipGrid() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0B1215] border border-white/[0.08] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-gradient-to-bl from-secondary/10 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative p-8 sm:p-14 lg:p-20">
            {/* Header del Card */}
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-secondary dark:text-primary uppercase tracking-[0.3em] text-[15px] font-bold">
                  Oportunidades
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-xl">
                Hay becas reales <br />
                <span className="text-white/40">esperando tu perfil.</span>
              </h2>
            </div>

            {/* Grid de items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {scholarships.map((beca, index) => {
                const isLocked = beca.status === "locked";

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative min-h-[180px] rounded-3xl p-7 border transition-all duration-300",
                      isLocked
                        ? "bg-white/[0.02] border-white/[0.04]"
                        : "bg-[#141C1F] border-white/10 hover:border-secondary/40 shadow-lg",
                    )}
                  >
                    {!isLocked ? (
                      <div className="h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <span className="px-2.5 py-1 rounded-md bg-[#1E293B] border border-white/10 text-[9px] font-bold text-blue-400 uppercase tracking-widest">
                            Beca
                          </span>
                          <span className="text-secondary dark:text-primary font-bold text-xl tracking-tighter">
                            {beca.match}%
                          </span>
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{beca.title}</h3>
                          <p className="text-[14px] text-white/40 font-medium leading-relaxed">
                            {beca.institution} · {beca.country}
                          </p>
                        </div>

                        <p className="text-xs text-white/50 line-clamp-1 mt-4">
                          {beca.description}
                        </p>
                      </div>
                    ) : (
                      /* Bloqueado con efecto Ghost */
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <Lock className="w-5 h-5 text-white/30 mb-3" />
                        <p className="text-[11px] font-medium text-white/30 max-w-[180px] uppercase tracking-wider leading-relaxed">
                          {beca.lockedText}
                        </p>
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
