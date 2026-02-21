"use client";

import {motion, AnimatePresence} from "framer-motion";
import {Rocket, Target, Zap, Search} from "lucide-react";
import {useEffect, useState, useTransition} from "react";
import {useRouter} from "next/navigation";

interface QuickMatchLoadingModalProps {
  cvId: string;
}

export function QuickMatchLoading({cvId}: QuickMatchLoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition(); // Para una navegación suave
  const router = useRouter();

  const steps = [
    "Analizando perfil del CV...",
    "Buscando oportunidades compatibles...",
    "Calculando porcentaje de match...",
    "Sincronizando con vacantes recientes...",
    "Preparando tus recomendaciones personalizadas..."
  ];

  useEffect(() => {
    // Evitamos que empiece si no hay cvId
    if (!cvId) return;

    const duration = 10000; // 10 segundos
    const interval = 50;
    const stepIncrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const nextValue = prev + stepIncrement;

        if (nextValue >= 100) {
          clearInterval(progressTimer);

          // --- NAVEGACIÓN ATÓMICA ---
          // Usamos startTransition para que Next.js priorice
          // la renderización de la nueva página
          router.push(`/opportunities?cvId=${cvId}`);
          router.refresh(); // Forzamos al SSR a buscar nuevos datos
          return 100;
        }
        return nextValue;
      });
    }, interval);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, duration / steps.length);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, [cvId, router]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-8">

        {/* Ícono de Cohete con efecto de "Shake" */}
        <div className="relative w-24 h-24">
          <motion.div
            animate={{
              y: [0, -10, 0],
              transition: { duration: 1.5, repeat: Infinity }
            }}
            className="w-full h-full bg-primary/10 rounded-3xl flex items-center justify-center"
          >
            <Rocket className="w-12 h-12 text-primary" />
          </motion.div>

          {/* Círculo de progreso SVG */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              className="text-muted-foreground/10"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="45"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
              strokeDasharray="283"
              animate={{ strokeDashoffset: 283 - (283 * progress) / 100 }}
              transition={{ ease: "linear" }}
              className="text-primary"
            />
          </svg>
        </div>

        <div className="space-y-6 w-full">
          <div className="space-y-2">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
              {progress < 100 ? "Sincronizando Perfil" : "¡Todo listo!"}
            </h2>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStep}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-muted-foreground text-sm font-medium h-5"
              >
                {steps[currentStep]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Barra de progreso lineal */}
          <div className="relative w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-primary"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="flex justify-between items-center">
             <span className="text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">
                {isPending ? "Cargando Resultados..." : "Procesando"}
             </span>
            <span className="text-[10px] font-black text-foreground">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50 w-full">
          <div className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg ${progress > 20 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'} transition-colors`}>
              <Target className="w-4 h-4"/>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tight">Análisis</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg ${progress > 50 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'} transition-colors`}>
              <Search className="w-4 h-4"/>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tight">Matching</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`p-2 rounded-lg ${progress > 85 ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'} transition-colors`}>
              <Zap className="w-4 h-4"/>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-tight">Finalizado</span>
          </div>
        </div>
      </div>
    </div>
  );
}
