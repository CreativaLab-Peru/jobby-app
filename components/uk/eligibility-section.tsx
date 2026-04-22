"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Zap,
  ShieldCheck,
  Lock,
  CheckCircle2,
  XCircle,
  Star
} from 'lucide-react';

const EligibilitySection: React.FC = () => {
  return (
    <section className="py-20 px-4 text-center bg-background">
      {/* Botón de Llamado a la Acción Principal */}
      <div className="relative max-w-lg mx-auto mb-6 group">
        {/* Glow effect para el botón principal */}
        <div className="absolute -inset-1 bg-primary/20 rounded-xl blur-lg group-hover:bg-primary/30 transition duration-1000" />
        <Button
          size="lg"
          className="relative w-full text-lg font-bold shadow-xl transition-transform hover:scale-[1.02] py-7"
        >
          QUIERO MI ACCESO AHORA →
        </Button>
      </div>

      {/* Prueba Social (Reseñas) */}
      <div className="flex flex-col items-center gap-3 mb-16">
        <div className="flex -space-x-3">
          {['A', 'L', 'M', 'S'].map(initial => (
            <div
              key={initial}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-sm font-bold border-2 border-background shadow-sm"
            >
              {initial}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-0.5 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <div className="text-sm font-medium text-muted-foreground">
          +500 candidatos LATAM ya la usan
        </div>
      </div>

      {/* Badges de confianza con Lucide */}
      <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-20">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-primary" />
          Acceso inmediato
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary" />
          Garantía 7 días
        </div>
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-primary" />
          Pago seguro Hotmart
        </div>
      </div>

      {/* Listas de Elegibilidad */}
      <h2 className="text-4xl font-extrabold mb-4 text-foreground tracking-tight">
        Esta guía es para ti si:
      </h2>
      <p className="text-muted-foreground mb-12 text-lg">
        Hecha para candidatos LATAM que buscan UK.
      </p>

      <div className="max-w-3xl mx-auto bg-card p-8 md:p-12 rounded-[2.5rem] text-left border border-border shadow-sm relative overflow-hidden">
        {/* Sutil gradiente de fondo en la tarjeta */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10" />

        <ul className="space-y-6 text-card-foreground">
          {[
            'Quieres hacer un postgrado en UK en negocios, innovación o emprendimiento.',
            'No sabes a qué universidades aplicar ni qué becas existen para tu perfil.',
            'Eres de LATAM y quieres saber qué piden para candidatos de la región.',
            'No quieres perder meses buscando información dispersa en inglés.',
            'Quieres ver cartas de motivación reales que funcionaron — no plantillas.',
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-4 group">
              <CheckCircle2 size={22} className="text-primary flex-shrink-0 mt-0.5 transition-transform group-hover:scale-110" />
              <span className="leading-tight text-[15px] md:text-base font-medium">{item}</span>
            </li>
          ))}
        </ul>

        <div className="border-t border-border/50 my-12" />

        <h3 className="text-sm font-black text-destructive uppercase tracking-[0.2em] mb-8">
          Esta guía NO es para ti si:
        </h3>
        <ul className="space-y-6 text-muted-foreground/80">
          {[
            'Buscas que alguien llene tu aplicación por ti.',
            'Tu objetivo es estudiar en otro país que no sea UK.',
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <XCircle size={20} className="text-destructive/50 flex-shrink-0 mt-0.5" />
              <span className="leading-tight text-sm md:text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default EligibilitySection;
