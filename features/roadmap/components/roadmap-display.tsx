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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

      <div className="relative">
        {steps.map((step, idx) => {
          const isLocked = !canViewFull && !step.isFree;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold shrink-0 border-2",
                  isLocked ? "bg-muted border-border text-muted-foreground" : "bg-primary/10 border-primary/30 text-primary"
                )}>
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : step.order}
                </div>
                {!isLast && <div className={cn("w-0.5 flex-1 min-h-[24px]", isLocked ? "bg-border" : "bg-primary/20")} />}
              </div>

              <div className={cn("flex-1 pb-6 min-w-0", isLocked && "select-none")}>
                <div className={cn(
                  "rounded-xl border p-4 space-y-3 transition-all",
                  isLocked ? "border-border bg-muted/30 blur-[3px] pointer-events-none" : "border-border bg-card"
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    {step.estimatedDays && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium shrink-0">
                        <Clock className="w-3 h-3" /> ~{step.estimatedDays}d
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

                  {step.actionItems.length > 0 && (
                    <ul className="space-y-2">
                      {step.actionItems.map((item, i) => {
                        const itemKey = `${step.id}-${i}`;
                        const isLoading = loadingItem === itemKey;

                        return (
                          <li
                            key={i}
                            onClick={() => !isLocked && !isLoading && handleToggle(step.id, i, item.done)}
                            className={cn(
                              "flex items-start gap-2 text-xs transition-all group p-2 rounded-lg border",
                              isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                              item.done
                                ? "text-muted-foreground/70 bg-transparent border-transparent"
                                : "text-foreground font-medium bg-secondary/40 border-border/50 hover:bg-secondary/60" // Estilo distinto para lo que falta
                            )}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-primary shrink-0" />
                            ) : item.done ? (
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-orange-500/70 group-hover:text-orange-500 shrink-0" />
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
                    <div className="flex flex-wrap gap-2 pt-1">
                      {step.resources.map((res, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary/50 border border-border text-muted-foreground">
                          {res.url ? (
                            <a href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
                              <ExternalLink className="w-2.5 h-2.5" /> {res.title}
                            </a>
                          ) : res.title}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {isLocked && idx === steps.findIndex((s) => !s.isFree) && (
                  <div className="mt-3 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-bold">Desbloquea el roadmap completo</span>
                    </div>
                    <Button size="sm" className="text-xs font-bold rounded-lg" asChild>
                      <Link href="/credits">Ver planes</Link>
                    </Button>
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
