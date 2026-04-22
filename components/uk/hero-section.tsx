"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { Sparkles } from "lucide-react";

const HeroSection: React.FC = () => {
  // Fecha objetivo: 20 de Mayo, 2026 (un mes después del 20 de Abril)
  const targetDate = new Date("2026-04-30T00:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <section className="text-center bg-background">
      {/* Banner de Urgencia Dinámico */}
      <div className="bg-destructive text-destructive-foreground text-sm py-2 px-4 animate-pulse flex justify-center items-center gap-2">
        <span className="font-medium">
          Tu bono "Ensayos ganadores LSE + Leeds + Edimburgo" termina en
        </span>
        <span className="font-mono text-lg font-bold bg-black/20 px-2 rounded">
          {timeLeft.days}d {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
        </span>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-4">
        <div className="flex justify-center w-full">
          <div className="flex items-center gap-2 text-xs font-bold bg-secondary text-secondary-foreground px-4 py-2 rounded-full border border-border mb-8 uppercase tracking-widest">
            <Sparkles size={14} className="text-primary"/>
            Para perfiles de Business · Management · Finance · Economics
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-8 text-foreground tracking-tight">
          Aplica a tu <span className="text-primary">postgrado en UK</span> en 30 días con la guía que armé en +4 meses
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-16 leading-relaxed">
          +10 universidades UK con programas ya investigados:
          <span className="text-foreground font-semibold underline underline-offset-4"> requisitos, fechas, y enlaces directos</span>.
          Yo tardé +4 meses armándolo desde cero — tú lo tienes en un solo lugar.
        </p>

        {/* Mockup del producto */}
        <div className="bg-card p-2 md:p-4 rounded-[2rem] shadow-2xl shadow-primary/10 relative border border-border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none z-10"/>

          <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
            <Image
              src="/uk/uk-1.jpg"
              alt="Dashboard de Notion Levely"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1200px) 100vw, 896px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
