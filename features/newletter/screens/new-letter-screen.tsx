"use client";

import React from "react";
import { Rocket, GraduationCap, Flame, MailSearch } from "lucide-react";
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
      <main className="px-6 md:px-12 pt-12 pb-24 max-w-6xl mx-auto">
        {/* 1. Agregamos mx-auto para centrar el bloque, flex flex-col e items-center para centrar los elementos, y text-center para el texto */}
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <span className="inline-block text-[10px] font-black uppercase border border-primary/30 bg-primary/10 text-primary px-4 py-1.5 mb-10 rounded-full">
            CARRERA GLOBAL
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.95] mb-8">
            La ruta al <span className="text-primary">top 3%</span> del talento global
          </h1>

          {/* 2. Agregamos justify-center para que el texto y la línea queden en el medio */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-[1px] w-12 bg-border"></div>
            <p className="text-lg md:text-xl font-medium">
              Carrera Global{" "}
              <span className="text-muted-foreground font-light">— by Dara Mariluz</span>
            </p>
            {/* Opcional: agregué una segunda línea aquí para que haya simetría al estar centrado, 
          puedes quitar este div si prefieres la línea solo a la izquierda */}
            <div className="h-[1px] w-12 bg-border"></div>
          </div>

          {/* 3. Como este h2 tiene un ancho máximo (max-w-2xl), en algunos casos necesita mx-auto para no irse a la izquierda, 
        aunque el flex-col items-center del padre ya debería bastar. */}
          <h2 className="text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto text-muted-foreground font-medium">
            Un boletín semanal donde te compartimos la ruta para entrar al top 3% del talento global
            que gana becas, fellowships, startups y oportunidades internacionales para que empieces
            a calificar.
          </h2>

          {/* KitForm */}
          <div className="w-full flex flex-col items-center">
            <ConvertKitForm uid={"bfc8a3a54f"} />
            <p className="text-xs text-muted-foreground opacity-60 italic mt-3 text-center">
              Únete a +2,000 profesionales. Sin spam, solo valor.
            </p>
          </div>
        </div>
      </main>

      {/* Grid Section */}
      <section className="px-6 md:px-12 py-24 border-t border-border bg-secondary/5">
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
