"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Target, Zap, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface QuickMatchLoadingModalProps {
  isOpen: boolean;
}

export function QuickMatchLoadingModal({ isOpen }: QuickMatchLoadingModalProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analizando perfil del CV...",
    "Buscando oportunidades compatibles...",
    "Calculando porcentaje de match...",
    "Sincronizando con vacantes recientes...",
    "Preparando tus recomendaciones personalizadas..."
  ];

  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      setCurrentStep(0);

      const duration = 10000; // 10 seconds
      const interval = 50;
      const stepIncrement = (interval / duration) * 100;

      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            return 100;
          }
          return prev + stepIncrement;
        });
      }, interval);

      const stepTimer = setInterval(() => {
        setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      }, duration / steps.length);

      return () => {
        clearInterval(progressTimer);
        clearInterval(stepTimer);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
        >
          <div className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-8">
            {/* Animated Icon Container */}
            <div className="relative w-24 h-24">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-full h-full bg-primary/20 rounded-3xl flex items-center justify-center"
              >
                <Rocket className="w-12 h-12 text-primary" />
              </motion.div>

              {/* Spinning Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-muted-foreground/20"
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

            <div className="space-y-8 w-full">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">
                Haciendo Match...
              </h2>

              <AnimatePresence mode="wait">
                <motion.p
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-muted-foreground font-medium h-6"
                >
                  {steps[currentStep]}
                </motion.p>
              </AnimatePresence>

              {/* Progress Bar Container */}
              <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden border border-border/50">
                <motion.div
                  className="bg-primary h-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <span>Iniciando IA</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Feature Icons Grid - visual noise */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/30 w-full opacity-40">
              <div className="flex flex-col items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="text-[8px] font-bold">Precisión</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Search className="w-4 h-4" />
                <span className="text-[8px] font-bold">Búsqueda</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Zap className="w-4 h-4" />
                <span className="text-[8px] font-bold">Veloz</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

