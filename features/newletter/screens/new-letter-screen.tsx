"use client";

import React from "react";
import {
  ArrowLeft,
  Rocket,
  GraduationCap,
  Flame,
  MailSearch
} from "lucide-react";
import Link from "next/link";
import ConvertKitForm from "@/components/convert-kit-form";

export const Newsletter = () => {
  const cards = [
    {
      icon: <Rocket className="text-primary" size={28}/>,
      tag: "STARTUP & FONDOS",
      title: "Capital y Grants desde cero",
      desc: "Estrategias reales para fondear tu startup o fundación. Cómo aplicar a grants internacionales y aceleradoras desde Latinoamérica.",
      highlight: "+$70K conseguidos",
    },
    {
      icon: <GraduationCap className="text-primary" size={28}/>,
      tag: "BECAS DE ÉLITE",
      title: "Postgrados 100% financiados",
      desc: "Guía específica para ganar becas totales en UK, Europa y USA. Olvida las deudas y enfócate en las mejores universidades del mundo.",
      highlight: "UK / Europa / USA",
    },
    {
      icon: <Flame className="text-primary" size={28}/>,
      tag: "BITÁCORA DE CONSTRUCCIÓN",
      title: "El 'detrás de cámaras' real",
      desc: "Lo que no cabe en un post de LinkedIn: el paso a paso técnico, los errores estratégicos y las reflexiones crudas de construir una startup y una fundación desde cero.",
      highlight: "100% transparente",
    },
    {
      icon: <MailSearch className="text-primary" size={28}/>,
      tag: "CONVOCATORIAS",
      title: "Oportunidades de la semana",
      desc: "Cada semana, becas y fondos que acaban de abrir. Ahorra horas de búsqueda con acceso directo.",
      highlight: "Semanal",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      {/* Header */}
      <header className="px-6 md:px-12 py-8 flex justify-start items-center max-w-6xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={16}/> Volver
        </Link>
      </header>

      {/* Hero Section */}
      <main className="px-6 md:px-12 pt-12 pb-24 max-w-6xl mx-auto">
        <div className="max-w-4xl">
          <span
            className="inline-block text-[10px] font-black tracking-[0.3em] uppercase border border-primary/30 bg-primary/10 text-primary px-4 py-1.5 mb-10 rounded-full">
            CARRERA GLOBAL
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8 italic">
            La ruta al <span className="text-primary">top 3%</span> del talento global
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-[1px] w-12 bg-border"></div>
            <p className="text-lg md:text-xl font-medium">
              Carrera Global <span
              className="text-muted-foreground font-light">— by Dara Mariluz</span>
            </p>
          </div>

          <h2
            className="text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl text-muted-foreground font-medium">
            Un boletín semanal donde compartimos la ruta estratégica para ganar becas, startups y
            oportunidades internacionales.
          </h2>

          {/*  KitForm */}
          <ConvertKitForm uid={"bfc8a3a54f"}/>
          <p className="text-xs text-muted-foreground opacity-60 italic">
            Únete a +2,000 profesionales. Sin spam, solo valor.
          </p>
        </div>
      </main>

      {/* Grid Section */}
      <section className="px-6 md:px-12 py-24 border-t border-border bg-secondary/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">¿Qué encontrarás?</h2>
            <p className="text-lg text-muted-foreground">
              Estrategia, vulnerabilidad y recursos accionables.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className="group rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between h-full bg-secondary text-secondary-foreground border border-border/50"
              >
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className="bg-background/40 p-4 rounded-2xl shrink-0 flex items-center justify-center">
                      {card.icon}
                    </div>
                    <span
                      className="text-[10px] font-black tracking-widest uppercase bg-background/20 px-3 py-1 rounded-full opacity-80">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-4">
                    {card.title}
                  </h3>

                  <p className="opacity-80 text-base leading-relaxed mb-8">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-auto">
                  <span
                    className="inline-block text-[11px] font-black px-4 py-1.5 rounded-full shadow-sm bg-primary text-primary-foreground">
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
        <Link
          href="/"
          className="text-lg font-bold text-primary hover:underline transition-all"
        >
          Conoce más sobre Levely →
        </Link>
      </footer>
    </div>
  );
};
