"use client";

import { Rocket, GraduationCap, Flame, MailSearch, FlagIcon } from "lucide-react";
import Link from "next/link";
import ConvertKitForm from "@/components/convert-kit-form";

// Mover la data estática fuera del componente es una buena práctica
// para evitar que el arreglo se vuelva a crear en cada renderizado.
const cards = [
  {
    icon: <Rocket className="text-primary" size={28} />,
    tag: "STARTUP & FONDOS",
    title: "Capital y Grants desde cero",
    desc: "Estrategias reales para fondear tu startup o fundación. Cómo aplicar a grants internacionales y aceleradoras desde Latinoamérica.",
    highlight: "+$70K conseguidos",
  },
  {
    icon: <GraduationCap className="text-primary" size={28} />,
    tag: "BECAS DE ÉLITE",
    title: "Postgrados 100% financiados",
    desc: "Guía específica para ganar becas totales en UK, Europa y USA. Olvida las deudas y enfócate en las mejores universidades del mundo.",
    highlight: "UK / Europa / USA",
  },
  {
    icon: <Flame className="text-primary" size={28} />,
    tag: "BITÁCORA DE CONSTRUCCIÓN",
    title: "El 'detrás de cámaras' real",
    desc: "Lo que no cabe en un post de LinkedIn: el paso a paso técnico, los errores estratégicos y las reflexiones crudas de construir una startup y una fundación desde cero.",
    highlight: "100% transparente",
  },
  {
    icon: <MailSearch className="text-primary" size={28} />,
    tag: "CONVOCATORIAS",
    title: "Oportunidades de la semana",
    desc: "Cada semana, becas y fondos que acaban de abrir. Ahorra horas de búsqueda con acceso directo.",
    highlight: "Semanal",
  },
];

export const Newsletter = () => {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Hero Section */}
      <section className="section-padding bg-background">
        <div className="container-levely">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <FlagIcon className="w-4 h-4" />
              Carrera Global
            </div>

            <h1 className="headline-xl mb-6 text-foreground max-w-3xl mx-auto">
              La ruta al <span className="text-primary">top 3%</span> del talento global
            </h1>

            <div className="flex items-center justify-center gap-3 mb-8 text-muted-foreground">
              <div className="h-[1px] w-12"></div>
              <p className="text-base md:text-lg font-medium">
                Carrera Global{" "}
                <span className="text-muted-foreground font-light">— by Dara Mariluz</span>
              </p>
              <div className="h-[1px] w-12"></div>
            </div>

            <h2 className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              Un boletín semanal donde te compartimos la ruta para entrar al top 3% del talento
              global que gana becas, fellowships, startups y oportunidades internacionales para que
              empieces a calificar.
            </h2>

            <div className="w-full max-w-md mx-auto flex flex-col items-center">
              <ConvertKitForm uid={"bfc8a3a54f"} />
              <p className="text-xs text-muted-foreground opacity-60 italic mt-3 text-center">
                Únete a +2,000 profesionales. Sin spam, solo valor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="px-6 md:px-12 py-24 bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Qué encontrarás?</h2>
            <p className="text-lg text-muted-foreground">
              Estrategia, vulnerabilidad y recursos accionables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className="group rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full bg-card text-card-foreground border border-border/50 shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="bg-primary/10 p-4 rounded-2xl shrink-0 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase bg-secondary px-3 py-1 rounded-full opacity-80">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>

                  <p className="text-muted-foreground text-base leading-relaxed mb-8">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-auto">
                  <span className="inline-block text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm bg-primary text-primary-foreground">
                    {card.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="px-6 py-20 text-center border-t border-border">
        <p className="text-xl font-medium mb-8 text-muted-foreground">
          ¿Listo para construir una carrera sin fronteras? 🌍
        </p>
        <Link href="/" className="text-lg font-bold text-primary hover:underline transition-all">
          Conoce más sobre Levely →
        </Link>
      </footer>
    </div>
  );
};
