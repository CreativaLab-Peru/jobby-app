// cv-score-card.tsx
"use client"

import { ShieldCheck, Zap, AlertCircle, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ScoreCategory } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map"

interface CVScoreCardProps {
  score: number
  scoreBreakdown?: Array<ScoreCategory & { Icon?: React.FC<React.SVGProps<SVGSVGElement>> }>
}

export function CVScoreCard({ score, scoreBreakdown = [] }: CVScoreCardProps) {
  const config =
    score >= 80 ? { label: "Excelente", color: "text-primary", ring: "stroke-primary", bg: "bg-primary/10" } :
      score >= 60 ? { label: "Buen Potencial", color: "text-amber-500", ring: "stroke-amber-500", bg: "bg-amber-500/10" } :
        { label: "Mejoras Necesarias", color: "text-destructive", ring: "stroke-destructive", bg: "bg-destructive/10" };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-6">
      {/* Score principal */}
      <div className="flex items-center gap-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" strokeWidth="8" fill="transparent" className="stroke-secondary" />
            <circle
              cx="50" cy="50" r="42" strokeWidth="8" fill="transparent"
              strokeDasharray="263.9"
              strokeDashoffset={263.9 - (263.9 * score) / 100}
              strokeLinecap="round"
              className={cn("transition-all duration-700", config.ring)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-black">{Math.round(score)}</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Puntaje Global</p>
          <div className={cn("inline-flex items-center gap-1.5 text-sm font-bold", config.color)}>
            {score >= 80 ? <ShieldCheck className="w-4 h-4" /> :
              score >= 60 ? <Zap className="w-4 h-4" /> :
                <AlertCircle className="w-4 h-4" />}
            {config.label}
          </div>
        </div>
      </div>

      {/* Desglose inline */}
      {scoreBreakdown.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Desglose por categoría</p>
          <div className="grid gap-2">
            {scoreBreakdown.map((cat, i) => {
              const pct = Math.round((cat.score / cat.maxScore) * 100);
              const IconComp = cat.Icon || Award;
              return (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <IconComp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-medium w-32 truncate">
                    {categoryMap[cat.category as keyof typeof categoryMap] || cat.category}
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        pct >= 80 ? "bg-primary" : pct >= 50 ? "bg-amber-500" : "bg-destructive"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground w-8 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
