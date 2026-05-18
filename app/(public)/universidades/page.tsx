import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  ArrowRight,
  Link as LinkIcon,
  BarChart3,
  FileText,
  Target,
  Check,
} from "lucide-react";
import Link from "next/link";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import { UniDashboardMockup } from "@/components/ui/app/public/herramientas/uni-dashboard-mockup";

export default function ParaUniversidades() {
  const features = [
    {
      icon: LinkIcon,
      title: "Link exclusivo de acceso",
      description: "joinlevely.com/join/tu-universidad — tus estudiantes acceden en un clic. Sin integración técnica. Activo en 48h.",
    },
    {
      icon: BarChart3,
      title: "Dashboard en tiempo real",
      description: "Score promedio, progreso por etapa, aplicaciones iniciadas. Semáforo verde/naranja para saber a quién apoyar.",
    },
    {
      icon: FileText,
      title: "Reporte PDF para acreditación",
      description: "PDF mensual listo para tu rectorado, SUNEDU o donantes. Datos de impacto medible sin trabajo extra.",
    },
    {
      icon: Target,
      title: "Workshop de activación",
      description: "Levely hace un taller online de 45 min con tus estudiantes. Resultado: 80%+ de activación. Tú solo convocas.",
    },
  ];

  const plans = [
    {
      name: "Piloto gratuito",
      price: "S/0",
      per: "1 mes · sin compromiso",
      users: "Hasta 50 miembros",
      feats: ["Link exclusivo", "Dashboard básico", "Workshop activación"],
      cta: "El primer mes es gratis",
      featured: false,
    },
    {
      name: "Comunidad Pro",
      price: "S/599",
      per: "/mes · mín. 6 meses",
      users: "Hasta 150 miembros",
      feats: ["Dashboard completo", "Reporte PDF mensual", "Perfil de Potencial", "Soporte directo"],
      cta: "Activar ahora",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "A conversar",
      per: "150+ miembros",
      users: "Ilimitado",
      feats: ["White-label", "Simulador entrevistas", "Capacitación equipo", "SLA garantizado"],
      cta: "Hablar con Levely",
      featured: false,
    },
  ];

  const badges = [
    "Mujeres Digitales",
    "AIESEC Perú",
    "Embajada Británica",
    "Paqarina Wasi — UNSAAC",
    "Data Science Perú",
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
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  Levely para instituciones
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] max-w-3xl mx-auto">
                Centraliza la movilidad <br />
                internacional de tus <br />
                <span className="text-primary font-italic italic">estudiantes.</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Levely da a tu oficina de becas datos en tiempo real de cuántos estudiantes están listos, cuáles necesitan apoyo y cuántas postulaciones van en curso — <strong className="text-foreground font-semibold">sin trabajo adicional de tu equipo.</strong>
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-2">
                <Link href="https://calendly.com/joinlevely/30min" target="_blank" rel="noopener noreferrer">
                  <Button size="xl" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/95 group font-bold gap-2">
                    El primer mes es gratis
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Centered bottom dashboard mockup card */}
            <div className="mt-16 max-w-3xl mx-auto w-full">
              <UniDashboardMockup />
            </div>
          </div>
        </section>

        {/* Features Card Grid */}
        <section className="section-padding bg-secondary/5 border-t border-border/40">
          <div className="container-levely">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* B2B Plans Grid */}
        <section className="section-padding bg-background border-t border-border/40">
          <div className="container-levely space-y-12">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Planes para organizaciones</span>
              <h2 className="text-3xl font-extrabold text-foreground">Elige la escala para tu comunidad</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
              {plans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-[2.5rem] bg-card border flex flex-col justify-between transition-all duration-300 relative ${
                    plan.featured
                      ? "border-primary shadow-xl scale-105"
                      : "border-border shadow-md hover:border-primary/40"
                  }`}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-widest">
                      ⭐ Más popular
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{plan.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className={`text-4xl font-extrabold ${plan.featured ? "text-primary" : "text-foreground"}`}>
                          {plan.price}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{plan.per}</p>
                      <p className="text-xs font-semibold text-foreground/80 mt-2">{plan.users}</p>
                    </div>

                    <div className="h-px bg-border/60" />

                    <ul className="space-y-3">
                      {plan.feats.map((feat, fidx) => (
                        <li key={fidx} className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link href="https://calendly.com/joinlevely/30min" target="_blank" rel="noopener noreferrer" className="w-full block">
                      <Button
                        size="lg"
                        className={`w-full font-bold ${
                          plan.featured
                            ? "bg-primary text-primary-foreground hover:bg-primary/95"
                            : "bg-secondary/40 text-foreground hover:bg-secondary/80 border border-border"
                        }`}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4 text-xs text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
              Coach externo: $500–$2,000/alumno · 150 alumnos = $300K USD · Levely Pro = $1,950/año · <strong className="text-foreground font-semibold">75x más barato</strong>
            </div>
          </div>
        </section>

        {/* Footer badges */}
        <section className="section-padding bg-secondary/5 border-t border-border/40 text-center">
          <div className="container-levely space-y-6">
            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Instituciones que confían en Levely</span>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-full bg-card border border-border text-xs sm:text-sm font-bold text-muted-foreground/80 shadow-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </section>
      </>
    </PublicPageTransition>
  );
}
