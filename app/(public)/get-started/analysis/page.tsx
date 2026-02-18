"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Briefcase, Zap, TrendingUp, Search } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { Badge } from "@/components/ui/badge";
import {useCreditModal} from "@/features/credits/hooks/use-credit-modal";
import {CreditPackModal} from "@/features/credits/components/credit-pack-modal";

export default function AnalysisPage() {
  const { fileName, userId } = useAnalysisStore();
  const [stage, setStage] = useState<"loading" | "results">("loading");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Extrayendo texto del PDF...");

  const creditModal = useCreditModal()

  useEffect(() => {
    if (stage === "loading") {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setTimeout(() => setStage("results"), 500);
            return 100;
          }
          const next = prev + 1;
          if (next === 25) setMessage("IA analizando semántica de tu experiencia...");
          if (next === 50) setMessage("Cruzando habilidades con +10,000 vacantes...");
          if (next === 75) setMessage("Calculando compatibilidad de mercado...");
          if (next === 90) setMessage("Finalizando reporte personalizado...");
          return next;
        });
      }, 40); // Ajusta la velocidad aquí
      return () => clearInterval(timer);
    }
  }, [stage]);

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background p-6">
        <AnimatePresence mode="wait">
          {stage === "loading" ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center h-[85vh] max-w-md mx-auto text-center"
            >
              <div className="relative mb-8">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <Search className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Analizando Perfil</h2>
              <p className="text-muted-foreground mb-8 text-sm font-mono bg-muted/50 py-1 px-3 rounded-full">
                {fileName || "curriculum_vitae.pdf"}
              </p>
              <div className="w-full space-y-2">
                <Progress value={progress} className="w-full h-3 shadow-inner" />
                <div className="flex justify-between text-xs font-medium text-muted-foreground">
                  <span>{progress}%</span>
                  <span className="uppercase tracking-widest">Procesando</span>
                </div>
              </div>
              <p className="mt-8 text-primary font-medium animate-pulse">{message}</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto space-y-8 pb-20"
            >
              {/* Header / Score */}
              <header className="flex flex-col md:flex-row gap-8 items-center bg-card/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary/10" />
                    <motion.circle
                      cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                      strokeDasharray={440}
                      initial={{ strokeDashoffset: 440 }}
                      animate={{ strokeDashoffset: 440 * (1 - 0.82) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="text-primary"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center blur">
                    <span className="text-4xl font-black italic">82</span>
                    <span className="text-[10px] uppercase tracking-tighter font-bold opacity-60">Score ATS</span>
                  </div>
                </div>
                <div className="text-center md:text-left space-y-2">
                  <Badge variant="outline" className="mb-2 border-primary/30 text-primary">Análisis Exitoso</Badge>
                  <h1 className="text-4xl font-black tracking-tight text-foreground">Tu potencial de mercado es <span className="text-primary">Alto</span></h1>
                  <p className="text-muted-foreground max-w-md">
                    Hemos procesado tu perfil bajo el ID <span className="font-mono text-primary">{userId?.slice(0,8)}</span>.
                    Detectamos oportunidades inmediatas de mejora.
                  </p>
                </div>
              </header>

              {/* Main Content Area */}
              <div className="relative">
                {/* Contenido Borroso Realista */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 blur-[8px] select-none pointer-events-none opacity-50">

                  {/* Recomendaciones (Col 1 y 2) */}
                  <div className="md:col-span-2 space-y-6">
                    <section className="p-6 border rounded-3xl bg-card space-y-4">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Zap className="text-yellow-500"/> Puntos de Mejora Críticos</h3>
                      <div className="space-y-3">
                        <div className="h-12 bg-muted rounded-xl w-full" />
                        <div className="h-12 bg-muted rounded-xl w-[90%]" />
                        <div className="h-12 bg-muted rounded-xl w-[95%]" />
                      </div>
                    </section>

                    <section className="p-6 border rounded-3xl bg-card space-y-4">
                      <h3 className="font-bold text-xl flex items-center gap-2"><TrendingUp className="text-green-500"/> Habilidades más demandadas</h3>
                      <div className="flex wrap gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="h-8 w-24 bg-muted rounded-full" />)}
                      </div>
                    </section>
                  </div>

                  {/* Oportunidades (Col 3) */}
                  <div className="md:col-span-1 p-6 border rounded-3xl bg-card space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2"><Briefcase className="text-blue-500"/> Matches de Empleo</h3>
                    {[1,2,3,4].map(i => (
                      <div key={i} className="flex gap-3 items-center p-3 border rounded-2xl">
                        <div className="w-10 h-10 bg-muted rounded-lg shrink-0" />
                        <div className="space-y-2 w-full">
                          <div className="h-3 bg-muted rounded w-3/4" />
                          <div className="h-2 bg-muted rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Paywall Overlay */}
                <div className="absolute inset-0 z-10 flex items-start justify-center pt-12 md:pt-20 px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-md w-full"
                  >
                    <Card className="p-8 text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border-primary/30 bg-card/95 backdrop-blur-md relative overflow-hidden">
                      {/* Glow effect detrás del candado */}
                      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />

                      <div className="relative z-20">
                        <div className="mx-auto w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-glow rotate-3">
                          <Lock className="w-10 h-10 text-white" />
                        </div>

                        <h3 className="text-3xl font-black mb-4 tracking-tight">Reporte Bloqueado</h3>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                          Para ver tus <span className="text-foreground font-bold italic">2 recomendaciones personalizadas</span> y las vacantes con <span className="text-foreground font-bold italic">+80% de match</span>, completa tu registro profesional.
                        </p>

                        <div className="space-y-3">
                          <Button
                            onClick={creditModal.onOpen}
                            className="w-full h-14 ai-gradient text-white font-bold text-lg rounded-2xl shadow-lg hover:scale-[1.02] transition-transform">
                            Desbloquear Análisis Completo
                          </Button>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
                            Análisis procesado por IA v4.2
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <CreditPackModal />
    </>
  );
}

// Componente Card local simplificado pero con estilo refinado
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border rounded-[2.5rem] shadow-sm ${className}`}>
      {children}
    </div>
  );
}
