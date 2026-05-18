import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Target,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import { ScoreMockup } from "@/components/ui/app/public/herramientas/score-mockup";

export default function ScoreCV() {
  const features = [
    {
      icon: Target,
      title: "Específico por beca",
      description: "Chevening y Fulbright tienen criterios distintos. Tu score es diferente para cada una.",
    },
    {
      icon: Zap,
      title: "Listo en 2 minutos",
      description: "Sube tu CV y en 2 minutos tienes tu score, barras por categoría y las 3 mejoras exactas.",
    },
    {
      icon: TrendingUp,
      title: "Se actualiza contigo",
      description: "Cada vez que mejoras tu CV, el score se recalcula. Ves tu progreso en tiempo real.",
    },
  ];

  return (
    <PublicPageTransition>
      <>
        {/* Hero & Interactive Preview */}
        <section className="section-padding bg-background relative overflow-hidden">
          {/* Luces decorativas */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

          <div className="container-levely relative">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Agente Score
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] max-w-2xl mx-auto">
                Tu score real
                <br />
                para <span className="text-primary font-italic italic">oportunidades internacionales</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                No un score genérico. <strong className="text-foreground font-semibold">Un score 0–100 específico para la beca que eliges</strong> — con las mejoras exactas que necesitas para subirlo.
              </p>

              <div className="pt-2">
                <Link href="/onboarding/talents">
                  <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 group font-bold gap-2">
                    Ver mi score ahora
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Modularized Mockup Card */}
            <div className="mt-16 max-w-2xl mx-auto w-full">
              <ScoreMockup />
            </div>
          </div>
        </section>

        {/* Features Card Grid */}
        <section className="section-padding bg-secondary/5 border-t border-border/40">
          <div className="container-levely">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-8 rounded-[2rem] bg-card border border-border/40 space-y-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{feat.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feat.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Action CTA */}
        <section className="section-padding bg-primary/10 border-t border-primary/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--accent-rgb),0.05),transparent)] pointer-events-none" />
          <div className="container-levely relative space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Sube tu CV y conoce tu potencial</h2>
            <p className="text-muted-foreground text-base leading-relaxed">Score instantáneo adaptado a tu beca objetivo + recomendaciones específicas de mejora.</p>
            <div className="pt-2">
              <Link href="/onboarding/talents">
                <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 font-bold gap-2">
                  Evaluar ahora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </>
    </PublicPageTransition>
  );
}
