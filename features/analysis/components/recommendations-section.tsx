"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Lightbulb, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Recommendation } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map"

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

/**
 * Ingeniería de UI: Mapeo semántico de estilos por severidad.
 * Centralizamos la lógica visual para facilitar el mantenimiento.
 */
const SEVERITY_CONFIG = {
  critical: {
    icon: AlertTriangle,
    color: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-l-destructive",
    label: "Crítico",
    badgeVariant: "destructive" as const,
  },
  important: {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/5",
    border: "border-l-amber-500",
    label: "Importante",
    badgeVariant: "outline" as const,
  },
  suggestion: {
    icon: Sparkles,
    color: "text-primary",
    bg: "bg-primary/5",
    border: "border-l-primary",
    label: "Sugerencia",
    badgeVariant: "secondary" as const,
  }
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <Card className="border-border/60 bg-card/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-xl shadow-primary/5">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/80">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          Insights & Optimizaciones
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8 pt-0 space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => {
            // Fallback dinámico para tipos no definidos
            const config = SEVERITY_CONFIG[rec.type as keyof typeof SEVERITY_CONFIG] || SEVERITY_CONFIG.suggestion;
            const Icon = config.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "relative group p-5 rounded-2xl border border-border/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5",
                  config.bg,
                  config.border,
                  "border-l-[6px]"
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Icono con animación sutil en hover */}
                  <div className={cn("p-2.5 rounded-xl bg-background border border-border/50 transition-transform group-hover:scale-110", config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="font-bold text-sm tracking-tight text-foreground">
                        {categoryMap[rec.title as keyof typeof categoryMap] || rec.title}
                      </h3>
                      <Badge
                        variant={config.badgeVariant}
                        className={cn(
                          "w-fit h-6 px-3 rounded-full text-[9px] font-black uppercase tracking-widest border-none",
                          rec.type === "important" && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                          rec.type === "suggestion" && "bg-primary/10 text-primary"
                        )}
                      >
                        Impacto {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="py-12 text-center border border-dashed border-border rounded-3xl">
            <CheckCircle2 className="w-10 h-10 mx-auto text-primary/40 mb-3" />
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
              Perfil altamente optimizado
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
