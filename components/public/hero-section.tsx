
"use client";

import { FileText } from "lucide-react";
import { SimpleUploadZone } from "@/components/upload/simple-upload-zone";

interface HeroSectionProps {
  onFileSelected: (file: File) => Promise<void>;
}

export function HeroSection({ onFileSelected }: HeroSectionProps) {
  return (
    <section className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
      <div className="container-levely relative z-10">
        <div className="flex justify-center items-center flex-col gap-12">
          {/* Content Wrapper */}
          <div className="flex flex-col items-center max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 w-fit">
              <FileText className="w-4 h-4" />
              Nuevo: CV Builder con IA
            </div>

            <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Optimiza tu perfil para el <span className="text-primary">mercado global</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              Recibe análisis con IA, recomendaciones claras y oportunidades
              alineadas a tu perfil profesional.
            </p>

            {/* CONTENEDOR DE ACCIÓN RÁPIDA */}
            <div className="relative w-full max-w-lg group">
              {/* Decoración de fondo */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative bg-card border border-border/50 shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="p-4">
                  <SimpleUploadZone onFileSelected={onFileSelected} />
                </div>
              </div>

              {/* Micro-copy de confianza */}
              <p className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground font-medium">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                Más de 500 CVs analizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
