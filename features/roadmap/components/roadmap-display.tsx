"use client";

import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Lock,
  Map,
  Sparkles,
  Circle,
  Loader2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import type { RoadmapStepData } from "@/features/roadmap/actions/get-roadmap-for-opportunity";
import { toggleActionItem } from "@/features/roadmap/actions/update-action-item";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getRoutesForUser } from "@/features/routes/actions/get-routes-for-user";
import { useRouteStore } from "@/store/use-route-store";

interface RoadmapDisplayProps {
  title: string | null;
  summary: string | null;
  steps: RoadmapStepData[];
  canViewFull: boolean;
}

export function RoadmapDisplay({
  title,
  summary,
  steps,
  canViewFull,
}: RoadmapDisplayProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingItem, setLoadingItem] = useState<string | null>(null); // Estado para la tarea específica

  const { hydrate } = useRouteStore();

  // Estado para secciones colapsadas (por defecto la primera abierta)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    [steps[0]?.id || ""]: true
  });

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleToggle = (stepId: string, index: number, currentDone: boolean) => {
    if (isPending) return;

    const itemKey = `${stepId}-${index}`;
    setLoadingItem(itemKey);

    startTransition(async () => {
      await toggleActionItem(stepId, index, !currentDone);

      const routesResult = await getRoutesForUser();
      if (!routesResult.success) {
        toast.error(routesResult.message || "Acción actualizada, pero no se pudieron cargar las rutas.");
        setLoadingItem(null);
        return;
      }

      hydrate(routesResult.routes);
      toast.success(currentDone ? "Acción desmarcada" : "¡Acción completada!");
      setLoadingItem(null);
      router.refresh();
    });
  };

  // Calcular progreso total
  const totalItems = steps.reduce((acc, step) => acc + step.actionItems.length, 0);
  const doneItems = steps.reduce(
    (acc, step) => acc + step.actionItems.filter((item) => item.done).length,
    0
  );
  const progressPercentage = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          <Map className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{title || "Tu Roadmap"}</h2>
          {summary && <p className="text-xs text-muted-foreground">{summary}</p>}
        </div>
      </div>

      {/* Barra de progreso interactiva */}
      <div className="bg-card border border-border/50 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-black uppercase tracking-tighter text-primary">Progreso total</span>
            <p className="text-xs text-muted-foreground font-medium">
              Has completado {doneItems} de {totalItems} tareas recomendadas
            </p>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-primary leading-none">
              {progressPercentage}%
            </span>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-secondary" />
      </div>

      <div className="relative space-y-4">
        {steps.map((step, idx) => {
          // Bloqueo por Plan (Paywall Global)
          const isPaywallLocked = !canViewFull && !step.isFree;
          
          // Si es el primer paso bloqueado por paywall, mostramos el banner global y paramos el render individual
          if (isPaywallLocked && idx === steps.findIndex(s => !canViewFull && !s.isFree)) {
            const premiumSteps = steps.slice(idx);
            return (
              <div key="premium-section" className="relative mt-12 p-1">
                {/* Banner Global de Upgrade con Efecto Glass - Corregido para evitar "cuadrado blanco" */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white/5 dark:bg-black/5 backdrop-blur-[4px] rounded-3xl border border-primary/20 shadow-sm transition-all duration-500">
                  <div className="bg-primary text-primary-foreground p-5 rounded-full mb-5 shadow-xl animate-bounce border-2 border-white/20">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-primary mb-3">Contenido Premium</h3>
                  <p className="text-sm text-muted-foreground max-w-[320px] mb-8 font-bold leading-relaxed">
                    Desbloquea los {premiumSteps.length} pasos restantes de tu ruta y accede a recursos de nivel experto.
                  </p>
                  <Button size="lg" className="font-black rounded-2xl px-12 h-14 text-base shadow-xl shadow-primary/20 hover:scale-105 transition-all" asChild>
                    <Link href="/credits">Ver Planes y Precios</Link>
                  </Button>
                </div>

                {/* Vista previa borrosa global de los pasos premium - Mostramos la estructura REAL */}
                <div className="space-y-4 blur-[5px] opacity-30 select-none pointer-events-none grayscale transition-all duration-1000 p-2">
                  {premiumSteps.map((pStep, pIdx) => (
                    <div key={pStep.id} className="relative flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 border-2 bg-muted border-border">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        {pIdx < premiumSteps.length - 1 && <div className="w-0.5 flex-1 min-h-[24px] bg-border/50" />}
                      </div>
                      <div className="flex-1 pb-8 min-w-0">
                        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-bold opacity-80">{pStep.title}</h3>
                            <div className="h-2 w-full bg-muted rounded-full" />
                            <div className="h-2 w-2/3 bg-muted rounded-full" />
                          </div>
                          <div className="flex gap-2">
                            <div className="h-8 w-24 bg-muted/40 rounded-xl" />
                            <div className="h-8 w-32 bg-muted/40 rounded-xl" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          // Si ya estamos en la zona premium, el map ya retornó el bloque global arriba.
          if (isPaywallLocked) return null;

          // Bloqueo por Progreso (Secuencial para pasos accesibles)
          const isPreviousIncomplete = idx > 0 && steps[idx - 1].actionItems.some(item => !item.done);
          const isProgressLocked = isPreviousIncomplete;
          const isExpanded = expandedSteps[step.id];
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 border-2 transition-all duration-300",
                  isProgressLocked ? "bg-muted border-border text-muted-foreground" : "bg-primary/10 border-primary/30 text-primary shadow-sm"
                )}>
                  {isProgressLocked ? <Clock className="w-3.5 h-3.5" /> : step.order}
                </div>
                {!isLast && (
                  <div className={cn(
                    "w-0.5 flex-1 min-h-[24px] transition-colors duration-500", 
                    isProgressLocked ? "bg-border/50" : "bg-primary/20"
                  )} />
                )}
              </div>

              <div className={cn("flex-1 pb-8 min-w-0")}>
                <div className={cn(
                  "rounded-2xl border transition-all duration-300 overflow-hidden",
                  isProgressLocked ? "border-border bg-muted/20" : "border-border bg-card shadow-sm hover:border-primary/20"
                )}>
                  {/* Header Colapsable */}
                  <div 
                    onClick={() => !isProgressLocked && toggleStep(step.id)}
                    className={cn(
                      "p-4 flex items-start justify-between gap-3 select-none transition-colors",
                      isProgressLocked ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-muted/30"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className={cn("text-sm font-bold", isProgressLocked && "text-muted-foreground")}>
                          {step.title}
                        </h3>
                        {isProgressLocked && (
                          <span className="text-[10px] font-bold text-orange-600 bg-orange-500/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Bloqueado
                          </span>
                        )}
                      </div>
                      {step.estimatedDays && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                          <Clock className="w-3 h-3" /> ~{step.estimatedDays}d
                        </span>
                      )}
                    </div>
                    {!isProgressLocked && (
                      <div className="p-1 rounded-md hover:bg-muted transition-colors">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    )}
                  </div>

                  {/* Contenido (Solo si no está bloqueado por progreso) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && !isProgressLocked && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="relative"
                      >
                        <div className="p-4 pt-0 space-y-4">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>

                          {step.actionItems.length > 0 && (
                            <ul className="space-y-2">
                              {step.actionItems.map((item, i) => {
                                const itemKey = `${step.id}-${i}`;
                                const isLoading = loadingItem === itemKey;

                                return (
                                  <li
                                    key={i}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (!isLoading) handleToggle(step.id, i, item.done);
                                    }}
                                    className={cn(
                                      "flex items-start gap-2 text-xs transition-all group p-3 rounded-xl border",
                                      isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                                      item.done
                                        ? "text-muted-foreground/70 bg-muted/30 border-transparent"
                                        : "text-foreground font-semibold bg-primary/5 border-primary/20 hover:bg-primary/10"
                                    )}
                                  >
                                    {isLoading ? (
                                      <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                                    ) : item.done ? (
                                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-primary/40 group-hover:text-primary shrink-0" />
                                    )}
                                    <span className={cn("mt-0.5", item.done && "line-through")}>
                                      {item.action}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}

                          {step.resources.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {step.resources.map((res, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                                  {res.url ? (
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                      <ExternalLink className="w-2.5 h-2.5" /> {res.title}
                                    </a>
                                  ) : res.title}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {isProgressLocked && (
                  <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600/80">
                      Completa el paso anterior para desbloquear
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
