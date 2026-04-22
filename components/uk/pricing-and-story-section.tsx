"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Image from "next/image";
import { Sparkles, Lock, ShieldCheck, Zap } from "lucide-react";

const PricingAndStorySection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-background">
      {/* Tarjeta de Precio (Cierre de Venta) */}
      <div className="bg-card border border-border max-w-xl mx-auto p-12 rounded-[40px] text-center mb-32 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />

        <div className="text-sm text-muted-foreground mb-4 uppercase tracking-widest font-semibold">
          UK Master Roadmap • 2025-26
        </div>
        <div className="text-sm text-muted-foreground/60 line-through mb-4">
          Precio normal $29
        </div>
        <div className="text-7xl font-extrabold text-primary mb-6 tracking-tighter">
          $19
        </div>
        <div className="text-card-foreground mb-12 font-medium">
          + Bono ensayos ganadores <span className="text-primary">incluido hoy</span>
        </div>

        <Button
          size="lg"
          className="mb-8 w-full max-w-sm mx-auto block text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
        >
          QUIERO MI ACCESO AHORA →
        </Button>

        {/* Badges de confianza con Lucide */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-primary" />
            Pago seguro Hotmart
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-primary" />
            Garantía 7 días
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" />
            Acceso inmediato
          </div>
        </div>
      </div>

      {/* Historia de la creadora */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Contenedor de la foto con Aspect Ratio fijo */}
        <div className="relative group w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-transparent rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] border border-border shadow-2xl">
            <Image
              src="/uk/uk-2.jpeg"
              alt="Sara en UK"
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 400px"
            />
          </div>

          {/* Insignia de Aceptación */}
          <div className="absolute -bottom-4 -right-4 md:bottom-6 md:right-6 bg-background/95 backdrop-blur-md text-foreground px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-3 border border-border shadow-2xl z-10">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none mb-1 uppercase">Aceptada en</p>
              <p className="font-bold tracking-tight">LSE • Leeds • Edimburgo</p>
            </div>
          </div>
        </div>

        {/* Texto de la historia */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-2 bg-primary/20 text-foreground px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/10 mb-8">
            <Sparkles size={14} className="text-primary" />
            <span>Conoce a Dara</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-8 text-foreground tracking-tight">
            "Cuando empecé mi proceso para UK, perdí más que tiempo."
          </h2>

          <div className="space-y-6 text-muted-foreground leading-relaxed text-lg max-w-2xl">
            <p>
              Perdí meses navegando en un laberinto de información dispersa. Entendí que la diferencia entre quedarse en el intento y lograrlo no es el talento, sino la <span className="text-foreground font-bold underline decoration-primary/50 text-white">data técnica</span>.
            </p>
            <p>
              Así que construí el sistema que yo misma necesitaba para entrar a universidades de élite. Hoy, más de <span className="text-foreground font-bold text-white">100 profesionales en LATAM</span> usan estas herramientas.
            </p>
            <p className="italic border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
              "Mi misión es que dejes de adivinar y empieces a ejecutar con el mapa que a mí me tomó 4 meses construir."
            </p>
          </div>

          <Button
            size="lg"
            className="mt-12 w-full max-w-md block text-lg font-bold shadow-lg shadow-primary/10 hover:scale-[1.02] transition-transform"
          >
            QUIERO MI ACCESO AHORA →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingAndStorySection;
