// recommendations-section.tsx
import { CheckCircle2, Lightbulb, AlertTriangle, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/types/analysis"
import { StickyActionButtons } from "@/features/analysis/components/sticky-action-buttons"
import { SECTION_LABELS } from "@/const"

const SEVERITY = {
  critical: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5", label: "Crítico" },
  important: { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/5", label: "Importante" },
  suggestion: { icon: Sparkles, color: "text-primary", bg: "bg-primary/5", label: "Sugerencia" }
}

export function RecommendationsSection({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-primary" />
        <h2 className="text-base font-bold">Mejoras Sugeridas</h2>
        <span className="text-xs text-muted-foreground">({recommendations.length})</span>
      </div>

      {recommendations.length > 0 ? (
        <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
          {recommendations.map((rec, i) => {
            const config = SEVERITY[rec.type as keyof typeof SEVERITY] || SEVERITY.suggestion;
            const titleMapped = SECTION_LABELS[rec.title] || rec.title;
            return (
              <div key={i} className={cn("flex items-start gap-3 p-4", config.bg)}>
                <config.icon className={cn("w-4 h-4 mt-0.5 shrink-0", config.color)} />
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold truncate">{titleMapped}</h3>
                    <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border bg-background", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border py-8 text-center">
          <CheckCircle2 className="w-6 h-6 mx-auto text-primary/40 mb-2" />
          <p className="text-sm text-muted-foreground">¡Todo se ve excelente!</p>
        </div>
      )}

      <div className="mt-8">
        <StickyActionButtons />
      </div>
    </div>
  )
}
