"use client";

import { motion } from "framer-motion";
import { ChevronRight, CheckCircle2, AlertCircle, FileText, Sparkles, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format-date";

interface EvaluationCardProps {
  cv: any;
  onAction: (id: string) => void;
}

export function EvaluationCard({ cv, onAction }: EvaluationCardProps) {
  const latestEval = cv.evaluations[0];
  const score = latestEval?.overallScore || 0;

  const isExcellent = score >= 80;
  const isWarning = score < 60;

  // Extraemos la recomendación más relevante para mostrar valor inmediato
  const topInsight = latestEval.recommendations?.[0]?.text;

  return (
    <div
      onClick={() => onAction(latestEval.id)}
      className="group relative flex flex-col md:flex-row md:items-center justify-between p-6 rounded-lg border border-border/40 bg-card hover:bg-secondary/10 hover:border-primary/20 transition-all duration-300 cursor-pointer"
    >
      {/* 1. Identificador Visual + Título */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative shrink-0">
          <div className={cn(
            "flex h-16 w-16 items-center justify-center rounded-[1.25rem] text-2xl font-black shadow-inner transition-transform group-hover:scale-110 duration-500",
            isExcellent ? "bg-primary/10 text-primary" :
              isWarning ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"
          )}>
            {score}
          </div>
          {/* Micro-progreso circular decorativo */}
          <svg className="absolute -inset-1 h-18 w-18 -rotate-90 opacity-20">
            <circle
              cx="36" cy="36" r="34"
              className={cn("fill-none stroke-current", isExcellent ? "text-primary" : "text-amber-500")}
              strokeWidth="2"
              strokeDasharray="213"
              strokeDashoffset={213 - (score / 100) * 213}
            />
          </svg>
        </div>

        <div className="space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-xl tracking-tight leading-none truncate">
              {cv.title || "Untitled CV"}
            </h3>
            {isExcellent && <Sparkles className="h-4 w-4 text-primary animate-pulse" />}
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-70">
              <FileText className="h-3 w-3" />
              <span>{formatDate(latestEval.createdAt, "d MMM")}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-border" />
            <p className="text-xs font-medium text-muted-foreground/80 truncate italic max-w-[250px] md:max-w-[400px]">
              {topInsight || "Análisis completado con éxito."}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Insights Visuales Rápidos (Desktop) */}
      <div className="mt-4 md:mt-0 flex items-center gap-6 md:px-8 md:border-x border-border/40">
        <div className="flex flex-col items-center gap-1">
          <CheckCircle2 className={cn("h-5 w-5", isExcellent ? "text-primary" : "text-muted-foreground/40")} />
          <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">Impacto</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Sparkles className={cn("h-5 w-5", score > 70 ? "text-primary" : "text-muted-foreground/40")} />
          <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">Keywords</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          {isWarning ? <AlertCircle className="h-5 w-5 text-destructive" /> : <CheckCircle2 className="h-5 w-5 text-primary" />}
          <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">ATS</span>
        </div>
      </div>

      {/* 3. Acción Call-to-action */}
      <div className="mt-6 md:mt-0 md:ml-6">
        <Button
          variant="accent"
          size={'sm'}
        >
          Detalles
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </div>
  );
}
