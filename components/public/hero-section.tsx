"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { SimpleUploadZone } from "@/components/upload/simple-upload-zone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface HeroSectionProps {
  selectedFile: File | null;
  onFileSelected: (file: File) => void;
  onStartAnalysis: () => void;
  status: string;
  score: number | null;
  reset: () => void;
}

export function HeroSection({
                              onFileSelected,
                              selectedFile,
                              onStartAnalysis,
                              status,
                              score,
                              reset
                            }: HeroSectionProps) {
  const isAnalyzing = status === "UPLOADING" || status === "ANALYZING";

  // 1. Estado para el progreso suavizado
  const [displayProgress, setDisplayProgress] = useState(0);

  // 2. Interpolación de la barra de progreso
  useEffect(() => {
    if (!isAnalyzing) {
      setDisplayProgress(0);
      return;
    }

    const target = score || 15; // Empezamos en 15% por el upload

    // Si el progreso mostrado es menor al real, subimos suavemente
    if (displayProgress < target) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, target));
      }, 30); // 30ms para un movimiento fluido de 60fps aprox
      return () => clearTimeout(timer);
    }
      // "Fake progress" mientras esperamos el polling: si el backend está lento,
    // seguimos subiendo muy lento hasta el 98% para que no parezca trabado
    else if (displayProgress < 98 && status === "ANALYZING") {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => prev + 0.1);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [displayProgress, score, isAnalyzing, status]);

  // 3. Selector de mensajes dinámicos
  const getStatusMessage = () => {
    if (displayProgress < 30) return "Leyendo estructura del PDF...";
    if (displayProgress < 60) return "Extrayendo experiencia y habilidades...";
    if (displayProgress < 85) return "Consultando con el motor de IA...";
    return "Finalizando reporte de empleabilidad...";
  };

  return (
    <>
      <section className="relative section-padding overflow-hidden bg-gradient-to-br from-secondary/50 via-background to-purple-50/30 dark:from-background dark:via-slate-900 dark:to-slate-800">
        <div className="container-levely relative z-10">
          <div className="flex justify-center items-center flex-col gap-12">
            <div className="flex flex-col items-center max-w-4xl text-center">
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 w-fit">
                <FileText className="w-4 h-4" />
                Nuevo: CV Builder con IA
              </div>

              <h1 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Optimiza tu perfil para el <span className="text-primary">mercado global</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                Análisis con IA, recomendaciones y oportunidades alineadas a tu perfil.
              </p>

              <div className="relative w-full max-w-lg group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                <div className={cn(
                  "relative bg-card border border-border/50 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-500",
                  selectedFile && "border-levely-green/50 ring-2 ring-levely-green/10"
                )}>
                  <div className="p-6">
                    {!selectedFile ? (
                      <SimpleUploadZone onFileSelected={onFileSelected} />
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center gap-6 animate-in fade-in zoom-in duration-300">

                        {isAnalyzing ? (
                          <div className="w-full space-y-6 text-center">
                            {/* Spinner con glow */}
                            <div className="relative flex justify-center">
                              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-50" />
                              <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                            </div>

                            <div className="space-y-2">
                              <h3 className="font-black text-xl tracking-tight">Analizando tu CV con IA</h3>
                              <p className="text-sm font-medium text-primary animate-pulse italic">
                                {getStatusMessage()}
                              </p>
                            </div>

                            <div className="space-y-3 px-4">
                              {/* Barra de progreso con color dinámico */}
                              <Progress
                                value={displayProgress}
                                className="h-3 bg-secondary"
                              />
                              <div className="flex justify-between items-center px-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                  Progreso
                                </p>
                                <p className="text-xs font-black text-primary">
                                  {Math.floor(displayProgress)}%
                                </p>
                              </div>
                            </div>

                            {/* Visual del archivo siendo procesado */}
                            <div className="bg-secondary/40 px-4 py-2 rounded-xl flex items-center gap-2 mx-auto w-fit">
                              <FileText className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[120px]">
                                {selectedFile.name}
                            </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="p-4 bg-primary/10 rounded-3xl">
                              <CheckCircle2 className="w-10 h-10 text-primary" />
                            </div>
                            <div className="text-center space-y-1">
                              <p className="font-black text-lg truncate max-w-[280px]">{selectedFile.name}</p>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Archivo listo</p>
                            </div>

                            <div className="flex flex-col w-full gap-3 pt-4">
                              <Button
                                onClick={onStartAnalysis}
                                className="w-full rounded-2xl bg-primary text-primary-foreground hover:opacity-90 font-black h-14 text-lg gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95"
                              >
                                Analizar ahora <Sparkles className="w-5 h-5" />
                              </Button>
                              <button
                                onClick={reset}
                                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-2"
                              >
                                Subir otro diferente
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <p className="flex items-center justify-center gap-2 mt-8 text-sm text-muted-foreground font-medium">
                  <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  IA de Levely lista para procesar
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
