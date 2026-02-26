// recommendations-section.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, AlertTriangle, Sparkles, Zap, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/types/analysis"
import {StickyActionButtons} from "@/features/analysis/components/sticky-action-buttons";
import {SECTION_LABELS} from "@/const";

const SEVERITY = {
  critical: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/5", label: "Crítico" },
  important: { icon: Zap, color: "text-amber-500", bg: "bg-amber-500/5", label: "Importante" },
  suggestion: { icon: Sparkles, color: "text-primary", bg: "bg-primary/5", label: "Sugerencia" }
}

export function RecommendationsSection({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Lightbulb className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight">Mejoras Sugeridas</h2>
      </div>

      <div className="grid gap-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, i) => {
            const config = SEVERITY[rec.type as keyof typeof SEVERITY] || SEVERITY.suggestion;
            const titleMapped = SECTION_LABELS[rec.title] || rec.title;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-2xl border border-border/50 transition-colors",
                  config.bg
                )}
              >
                <config.icon className={cn("w-5 h-5 mt-1 shrink-0", config.color)} />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-sm">{titleMapped}</h3>
                    <span className={cn("text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md bg-background border", config.color)}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              </div>
            )
          })
        ) : (
          <Card className="border-dashed py-12 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-primary/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">¡Todo se ve excelente!</p>
          </Card>
        )}
      </div>
      <div className="mt-10">
        <StickyActionButtons />
      </div>
    </div>
  )
}
