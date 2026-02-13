"use client";

import { AlertCircle, FileText, Sparkles, ArrowUpRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";
import { JobStatus } from "@prisma/client";
import { EvaluationWithRelations } from "@/features/cv/actions/get-evaluations-for-current-user";

interface EvaluationCardProps {
  evaluation: EvaluationWithRelations; // Cambiado de 'cv' a 'evaluation' para ser semánticos
  onAction: (id: string) => void;
  onRetry?: (cvId: string) => void;
  isRetrying?: boolean;
}

export function EvaluationCard({ evaluation, onAction, onRetry, isRetrying }: EvaluationCardProps) {
  const status = evaluation.status as JobStatus;
  const score = evaluation.overallScore || 0;
  const cvData = evaluation.cv;

  const isFailed = status === "FAILED";
  const isExcellent = score >= 80;
  const isWarning = score < 60;

  // Extraemos el insight del array de recomendaciones
  const topInsight = evaluation.recommendations?.[0]?.text;

  return (
    <div
      onClick={() => !isFailed && onAction(evaluation.id)}
      className={cn(
        "group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg border transition-all duration-300",
        isFailed
          ? "border-destructive/20 bg-card cursor-default"
          : "border-border/40 bg-card hover:bg-secondary/10 hover:border-primary/20 cursor-pointer"
      )}
    >
      <div className="flex items-center gap-6 flex-1">
        {/* Identificador Visual: Score o Error */}
        <div className="relative shrink-0">
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-[1.25rem] text-2xl font-black shadow-inner transition-transform duration-500",
            isFailed ? "bg-destructive text-white" :
              isExcellent ? "bg-primary/10 text-primary" :
                isWarning ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500",
            !isFailed && "group-hover:scale-110"
          )}>
            {isFailed ? <AlertCircle className="h-8 w-8" /> : Math.round(score)}
          </div>

          {!isFailed && (
            <svg className="absolute -inset-1 h-18 w-18 -rotate-90 opacity-20">
              <circle
                cx="36" cy="36" r="34"
                className={cn("fill-none stroke-current", isExcellent ? "text-primary" : "text-amber-500")}
                strokeWidth="2"
                strokeDasharray="213"
                strokeDashoffset={213 - (score / 100) * 213}
              />
            </svg>
          )}
        </div>

        <div className="space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className={cn("font-bold text-xl tracking-tight leading-none truncate", isFailed && "text-destructive")}>
              {cvData?.title || "CV Sin título"}
            </h3>
            {isExcellent && !isFailed && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-70">
              <FileText className="h-3 w-3" />
              <span>{formatDate(evaluation.createdAt, "d MMM")}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <p className={cn(
              "text-xs font-medium truncate italic max-w-[250px] md:max-w-[400px]",
              isFailed ? "text-destructive/70" : "text-muted-foreground/80"
            )}>
              {isFailed ? "El análisis no pudo completarse. Reintenta ahora." : (topInsight || "Análisis completado con éxito.")}
            </p>
          </div>
        </div>
      </div>

      {/* Bloque de Acciones */}
      <div className="mt-6 md:mt-0 md:ml-6 flex gap-2">
        {isFailed ? (
          <Button
            variant="destructive"
            size="sm"
            disabled={isRetrying}
            onClick={(e) => {
              e.stopPropagation();
              onRetry?.(cvData.id); // Usamos el ID del CV para el re-análisis
            }}
            className="font-black uppercase tracking-widest text-[10px] px-6 rounded-xl"
          >
            {isRetrying ? <RefreshCcw className="h-3 w-3 animate-spin mr-2" /> : <RefreshCcw className="h-3 w-3 mr-2" />}
            Reintentar
          </Button>
        ) : (
          <Button
            variant="accent"
            size="sm"
            className="font-black uppercase tracking-widest text-[10px] rounded-xl"
          >
            Detalles
            <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
