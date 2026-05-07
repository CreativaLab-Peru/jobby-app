import { Lock, ArrowRight, GraduationCap, Sparkles, Globe, Award, TrendingUp } from "lucide-react";
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
    type: "Excelencia",
  },
  {
    title: "MAECI",
    institution: "Gobierno de Italia",
    country: "Italia",
    description: "Fomenta cooperación internacional y cultura italiana.",
    match: 54,
    status: "available",
    type: "Gubernamental",
  },
  {
    title: "DAAD",
    institution: "Fundación Carolina",
    country: "Alemania / España",
    description: "Programas de investigación y postgrado de alto nivel.",
    match: 0,
    status: "locked",
    lockedText: "Desbloquea las 4 oportunidades restantes con Builder",
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
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container-levely">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Header Section */}
          <div className="lg:w-1/3 space-y-8 sticky lg:top-32">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                <Globe className="w-3.5 h-3.5 text-secondary-foreground dark:text-primary" />
                <span className="text-[10px] font-bold text-secondary-foreground dark:text-primary uppercase tracking-wider">
                  Mercado Global
                </span>
              </div>

              <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1]">
                Hay becas reales <br />
                <span className="text-muted-foreground font-medium">esperando tu perfil.</span>
              </h2>

              <p className="text-xl text-muted-foreground leading-relaxed">
                Analizamos miles de convocatorias globales para presentarte solo las que tienen mayor compatibilidad con tu experiencia y objetivos.
              </p>
            </div>

            {/* Micro-stats */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">150+</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Países</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-foreground">2.5k</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Becas</p>
              </div>
            </div>
          </div>

          {/* Grid Section */}
          <div className="lg:w-2/3 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarships.map((beca, index) => {
                const isLocked = beca.status === "locked";

                return (
                  <div
                    key={index}
                    className={cn(
                      "group relative flex flex-col justify-between min-h-[280px] rounded-[2.5rem] p-8 border transition-all duration-500",
                      isLocked
                        ? "bg-transparent border-border/40 opacity-60 grayscale-[0.5]"
                        : "bg-card border-border hover:border-primary/30 shadow-xl shadow-black/5 hover:shadow-primary/5 hover:-translate-y-1"
                    )}
                  >
                    {!isLocked ? (
                      <>
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <div className="p-3 rounded-2xl bg-primary/5 text-primary">
                              <Award className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-1 text-primary font-bold text-2xl tracking-tighter">
                                <TrendingUp className="w-4 h-4" />
                                {beca.match}%
                              </div>
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {beca.type}
                            </span>
                            <h3 className="text-xl font-bold text-foreground leading-tight">{beca.title}</h3>
                            <p className="text-sm text-muted-foreground font-medium">
                              {beca.institution} · {beca.country}
                            </p>
                          </div>
                        </div>

                        <div className="pt-6 mt-auto border-t border-border/50">
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 italic">
                            "{beca.description}"
                          </p>
                        </div>
                      </>
                    ) : (
                      /* Locked State */
                      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Lock className="w-5 h-5 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm font-bold text-foreground/80 uppercase tracking-widest">Contenido Bloqueado</p>
                          <p className="text-[11px] text-muted-foreground leading-relaxed max-w-[180px] mx-auto">
                            {beca.lockedText}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-primary text-[10px] font-bold uppercase tracking-widest">
                          Mejorar Plan
                        </Button>
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
