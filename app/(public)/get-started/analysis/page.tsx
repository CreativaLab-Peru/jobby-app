"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Loader2, Lock, Briefcase, Search, Lightbulb, TrendingUp, Zap} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAnalysisStore } from "@/hooks/use-analysis-store";
import { Badge } from "@/components/ui/badge";
import { useCreditModal } from "@/features/credits/hooks/use-credit-modal";

export default function AnalysisPage() {
  const { fileName, userId } = useAnalysisStore();
  const [stage, setStage] = useState<"loading" | "results">("loading");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Extrayendo texto del PDF...");

  const creditModal = useCreditModal();

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
      }, 30);
      return () => clearInterval(timer);
    }
  }, [stage]);

  return (
    <>
      <div className="min-h-screen p-6 bg-[#f8f9fa]">
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
              {/* Score Header - Basado en la imagen 1 */}
              <header className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium uppercase tracking-wider">Score de Empleabilidad</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-black tracking-tighter">85</span>
                      <span className="text-2xl text-muted-foreground font-medium">/100</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="bg-gray-50 text-gray-600 border-none px-4 py-2 rounded-full flex gap-2 items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    ✨ Análisis IA completado
                  </Badge>
                </div>

                {/* Progress Bar - Estilo imagen 1 */}
                <div className="mt-8 space-y-2">
                  <div className="relative h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-slate-800 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    <span>Bajo</span>
                    <span>Promedio</span>
                    <span>Excelente</span>
                  </div>
                </div>
              </header>

              {/* Insights & Improvements - Basado en la imagen 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-8 bg-white border-none shadow-sm group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:scale-110 transition-transform">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg">Insight de tu perfil</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Tu perfil muestra una sólida trayectoria en desarrollo de software con énfasis en tecnologías modernas.
                  </p>
                </Card>

                <Card className="p-8 bg-white border-none shadow-sm group hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-50 rounded-lg text-red-500 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-5 h-5 rotate-45" />
                    </div>
                    <h3 className="font-bold text-lg">Área de mejora</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Fortalecer las habilidades de liderazgo y gestión de equipos para roles senior.
                  </p>
                </Card>
              </div>

              {/* Jobs Section con "Candado" - Basado en la imagen 2 */}
              <Card className="p-8 bg-white border-none shadow-sm transition-shadow overflow-hidden">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      Oportunidades sugeridas
                    </h3>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest opacity-70">
                      Contenido bloqueado
                    </Badge>
                  </div>

                  {[1, 2, 3].map((i) => (
                    <div key={i} className="group relative">
                      {/* Item de Oportunidad (Borroso) */}
                      <div className="bg-white p-6 rounded-2xl flex items-center justify-between border border-gray-100 filter blur-[3px] opacity-40 select-none pointer-events-none transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                          <div>
                            <div className="h-5 bg-gray-200 w-48 rounded mb-2" />
                            <div className="h-4 bg-gray-100 w-32 rounded" />
                          </div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-400 border-none">
                          {85 + i}% match
                        </Badge>
                      </div>

                      {/* Overlay de Bloqueo Individual (El "Candado") */}
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-1"
                        >
                          {/* Si quieres que diga "Candado" como en tu imagen de referencia, puedes usar el texto o el icono */}
                          <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-slate-800" />
                            <span className="text-sm font-bold tracking-tight text-slate-800 uppercase">Bloqueado</span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  ))}

                  {/* Botón de Acción Principal al final de la lista */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 pt-4 border-t border-dashed border-gray-200 flex flex-col items-center"
                  >
                    <Button
                      onClick={creditModal.onOpen}
                      className="w-full max-w-xs h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      Desbloquear Matches
                    </Button>
                    <p className="mt-3 text-[11px] text-muted-foreground font-medium uppercase tracking-tighter">
                      Requiere el paquete STARTER de créditos
                    </p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border rounded-[2rem] ${className}`}>
      {children}
    </div>
  );
}
