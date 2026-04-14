"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoveRight, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateRouteForm() {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Contexto inmediato: Icono + Título que explica el BENEFICIO */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Diseña tu futuro</h1>
          <p className="text-muted-foreground">Escribe tu meta. Nuestra IA trazará el camino.</p>
        </div>

        <div className="space-y-6">
          {/* El Input ahora se siente como una pregunta real */}
          <div className="relative">
            <Input
              className="h-16 text-xl pl-6 pr-12 rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
              placeholder="Ej: Trabajar como dev en Alemania"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30">
              <Lightbulb className="h-6 w-6" />
            </div>
          </div>

          {/* Sugerencias que parecen "atajos", no solo texto */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["Master en UK", "Startup en USA", "Trabajar en Japón"].map((s) => (
              <button
                key={s}
                onClick={() => setName(s)}
                className="text-xs font-medium px-4 py-2 rounded-xl bg-secondary hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20"
              >
                {s}
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
            disabled={!name.trim() || isPending}
          >
            {isPending ? "Trazando ruta..." : "Empezar ahora"}
            <MoveRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Un solo recordatorio sutil de seguridad/valor al pie */}
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
          Impulsado por Auditoría de IA en tiempo real
        </p>
      </div>
    </main>
  );
}
