import { Button } from "@/components/ui/button";
import {
  Map,
  Calendar,
  Unlock,
  Trophy,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import { RoadmapMockup } from "@/components/ui/app/public/herramientas/roadmap-mockup";

export default function RoadmapPersonalizado() {
  const features = [
    {
      icon: Calendar,
      title: "Con fechas reales",
      description: "Cada paso tiene una fecha basada en la convocatoria real de tu beca objetivo. Sin improvisar.",
    },
    {
      icon: Unlock,
      title: "Se desbloquea solo",
      description: "Al completar un paso, el siguiente se activa con una notificación. Siempre sabes qué hacer después.",
    },
    {
      icon: Trophy,
      title: "Hasta ganar",
      description: "No termina cuando postulas. Incluye preparación de entrevista y seguimiento hasta el resultado.",
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
                <Map className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Roadmap personalizado
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] max-w-2xl mx-auto">
                Tu plan exacto <br />
                <span className="text-primary font-italic italic">hasta ganar.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                No tips genéricos. <strong className="text-foreground font-semibold">Un plan con fechas reales, pasos en orden y recordatorios</strong> — desde hoy hasta el día que envías tu postulación.
              </p>

              <div className="pt-2">
                <Link href="/onboarding/talents">
                  <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 group font-bold gap-2">
                    Activar mi roadmap
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Modularized Mockup Timeline Card */}
            <div className="mt-16 max-w-2xl mx-auto w-full">
              <RoadmapMockup />
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Planifica tu postulación perfecta</h2>
            <p className="text-muted-foreground text-base leading-relaxed">Genera tu plan personalizado en segundos y mantente en ruta paso a paso hasta el éxito.</p>
            <div className="pt-2">
              <Link href="/onboarding/talents">
                <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 font-bold gap-2">
                  Activar mi plan ahora
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
