import { Button } from "@/components/ui/button";
import {
  FileText,
  Globe,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import { CVMockup } from "@/components/ui/app/public/herramientas/cv-mockup";

export default function CVInternacional() {
  const features = [
    {
      icon: Globe,
      title: "EN / ES en un clic",
      description: "Cambia el idioma de tu CV en segundos. Nunca más pierdas una oportunidad por el idioma.",
    },
    {
      icon: Target,
      title: "Adaptado a cada beca",
      description: "El CV se adapta según los criterios de la oportunidad. Destaca lo que más pesa para cada convocatoria.",
    },
    {
      icon: Clock,
      title: "De horas a segundos",
      description: "Lo que antes tomaba 2–3 horas ahora toma 30 segundos. Descárgalo en PDF listo para postular.",
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
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  CV Internacional
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] max-w-2xl mx-auto">
                Tu CV en formato <br />
                <span className="text-primary font-italic italic">Harvard o Europass</span> <br />
                en segundos.
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Olvida las horas editando formatos. <strong className="text-foreground font-semibold">Levely convierte tu CV al estándar internacional</strong> que pide cada oportunidad — en inglés o español.
              </p>

              <div className="pt-2">
                <Link href="/onboarding/talents">
                  <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 group font-bold gap-2">
                    Crear mi CV internacional
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Modularized Mockup Cards */}
            <div className="mt-16 max-w-3xl mx-auto w-full">
              <CVMockup />
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
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Optimiza tu CV para el estándar global</h2>
            <p className="text-muted-foreground text-base leading-relaxed">Tu CV estructurado profesionalmente y adaptado a las exigencias de los comités evaluadores.</p>
            <div className="pt-2">
              <Link href="/onboarding/talents">
                <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 font-bold gap-2">
                  Empezar ahora
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
