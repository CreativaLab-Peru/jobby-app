import { cn } from "@/lib/utils";
import { RouteWithCvSummary } from "@/store/use-route-store";
import { getProgressFraction, getProgressLabel } from "@/features/routes/utils/route-progress";
import { useTaskStore } from "@/store/use-task-store";

export function MiniProgress({ route }: { route: RouteWithCvSummary }) {
  const tasks = useTaskStore((state) => state.tasks);
  
  // Buscamos tareas activas vinculadas a esta ruta
  // 1. Tarea de procesamiento de CV (scopeId = cvId)
  // 2. Tarea de Roadmap (buscamos en metadatos o por scopeId si es oportId)
  const activeTask = Object.values(tasks).find(t => 
    t.status === "IN_PROGRESS" && (
      t.scopeId === route.cv?.id || 
      t.metadata?.routeId === route.id ||
      t.scopeId === route.id
    )
  );

  const isProcessing = !!activeTask;
  
  // Si hay una tarea activa, usamos su progreso
  const fraction = isProcessing ? activeTask.progress / 100 : getProgressFraction(route);
  const pct = Math.round(fraction * 100);
  const isComplete = !isProcessing && route.status === "PROGRAM_DONE";

  // Determinamos el label
  const { completedActions, totalActions } = route.roadmapProgress || {};
  const hasRoadmap = totalActions && totalActions > 0;

  let label = isProcessing ? activeTask.description : getProgressLabel(route.status);
  
  if (isComplete) label = "¡Objetivo alcanzado!";
  else if (!isProcessing && hasRoadmap) {
    label = completedActions === totalActions
      ? "Pasos completados ✓"
      : `Pasos: ${completedActions}/${totalActions}`;
  }

  return (
    <div className="w-full space-y-1" role="progressbar" aria-valuenow={pct}>
      <div className="flex items-center gap-2">
        {/* Barra de progreso */}
        <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500",
              isProcessing ? "bg-primary animate-pulse" : (isComplete ? "bg-green-500" : "bg-primary")
            )}
            style={{ width: `${Math.max(pct, 2)}%` }}
          />
        </div>

        {/* Porcentaje */}
        <span className={cn(
          "text-[10px] font-bold tabular-nums w-8 text-right",
          isProcessing ? "text-primary animate-pulse" : (isComplete ? "text-green-600" : "text-muted-foreground")
        )}>
          {pct}%
        </span>
      </div>

      {/* Label descriptivo */}
      <p className={cn(
        "text-[9px] font-semibold uppercase tracking-tight truncate",
        isProcessing ? "text-primary italic" : (isComplete ? "text-green-600" : "text-muted-foreground/70")
      )}>
        {isProcessing && "IA: "}{label}
      </p>
    </div>
  );
}
