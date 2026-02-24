// cv-score-card.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, ShieldCheck, Zap, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CVScoreCardProps {
  score: number
  onShowBreakdown: () => void
}

export function CVScoreCard({ score, onShowBreakdown }: CVScoreCardProps) {
  // Lógica de estado simplificada
  const config =
    score >= 80 ? { label: "Excelente", color: "text-primary", icon: ShieldCheck } :
      score >= 60 ? { label: "Buen Potencial", color: "text-amber-500", icon: Zap } :
        { label: "Mejoras Necesarias", color: "text-destructive", icon: AlertCircle };

  const StatusIcon = config.icon;

  return (
    <Card className="overflow-hidden border-border/50 bg-card shadow-sm rounded-3xl">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Información del Score */}
          <div className="text-center md:text-left space-y-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">
                Puntaje Global
              </p>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-7xl font-black tracking-tighter">
                  {Math.round(score)}
                </span>
                <span className="text-xl font-bold text-muted-foreground/40">/100</span>
              </div>
            </div>

            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-xs font-bold uppercase tracking-tight", config.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </div>
          </div>

          {/* Acción y Progreso */}
          <div className="flex flex-col items-center gap-4">
            {/* Círculo de progreso simplificado (CSS puro o SVG básico) */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-secondary" />
                <circle
                  cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent"
                  strokeDasharray="282.7"
                  strokeDashoffset={282.7 - (282.7 * score) / 100}
                  strokeLinecap="round"
                  className={cn("transition-all duration-1000", config.color)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-xl">
                {score}%
              </div>
            </div>

            <Button
              onClick={onShowBreakdown}
              variant="outline"
              size="sm"
              className="rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              <Calculator className="w-3.5 h-3.5 mr-2" />
              Ver Desglose
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
