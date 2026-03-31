"use client";

import { FileText, CheckCircle2, Sparkles, Loader2 } from "lucide-react";
import { SimpleUploadZone } from "@/components/upload/simple-upload-zone";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress"; // Asumiendo que usas shadcn/ui progress

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

  return (
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

            {/* CONTENEDOR PRINCIPAL DE ACCIÓN */}
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

                      {/* ESTADO: ANALIZANDO (Como tu imagen) */}
                      {isAnalyzing ? (
                        <div className="w-full space-y-6 text-center">
                          <div className="flex justify-center">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-bold text-lg">Analizando tu CV con IA</h3>
                            <p className="text-xs text-muted-foreground animate-pulse">Generando insights personalizados...</p>
                          </div>
                          <div className="space-y-3">
                            <Progress value={score || 45} className="h-2 w-full bg-secondary" />
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {score || 45}% completado
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* ESTADO: CONFIRMACIÓN (Antes de dar clic en analizar) */
                        <>
                          <div className="p-3 bg-levely-green/10 rounded-full">
                            <CheckCircle2 className="w-8 h-8 text-levely-green" />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-sm truncate max-w-[250px]">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">Listo para el análisis profundo</p>
                          </div>

                          <div className="flex flex-col w-full gap-3">
                            <Button
                              onClick={onStartAnalysis}
                              className="w-full rounded-xl bg-levely-green hover:bg-levely-green/90 text-black font-bold h-12 gap-2"
                            >
                              Analizar ahora <Sparkles className="w-4 h-4" />
                            </Button>
                            <button onClick={reset} className="text-xs text-muted-foreground hover:underline">
                              Subir otro archivo
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
                Más de 500 CVs analizados
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
