import { cn } from "@/lib/utils";
import { RouteWithCvSummary } from "@/store/use-route-store";
import { getProgressFraction, getProgressLabel } from "@/features/routes/utils/route-progress";

export function MiniProgress({ route }: { route: RouteWithCvSummary }) {
  const fraction = getProgressFraction(route);
  const pct = Math.round(fraction * 100);
  const isComplete = route.status === "PROGRAM_DONE";

  // Determinamos el label de forma plana
  const { completedActions, totalActions } = route.roadmapProgress || {};
  const hasRoadmap = totalActions && totalActions > 0;

  let label = getProgressLabel(route.status);
  if (isComplete) label = "¡Objetivo alcanzado!";
  else if (hasRoadmap) {
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
              isComplete ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${Math.max(pct, 0)}%` }}
          />
        </div>

        {/* Porcentaje */}
        <span className={cn(
          "text-[10px] font-bold tabular-nums w-8 text-right",
          isComplete ? "text-green-600" : "text-muted-foreground"
        )}>
          {pct}%
        </span>
      </div>

      {/* Label descriptivo */}
      <p className={cn(
        "text-[9px] font-semibold uppercase tracking-tight truncate",
        isComplete ? "text-green-600" : "text-muted-foreground/70"
      )}>
        {label}
      </p>
    </div>
  );
}
