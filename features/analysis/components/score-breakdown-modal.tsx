// score-breakdown-modal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Calculator, X, CheckCircle2, AlertCircle, Info, Award } from "lucide-react"
import type { ScoreCategory } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map"
import { cn } from "@/lib/utils"

interface ScoreBreakdownModalProps {
  show: boolean
  onClose: () => void
  scoreBreakdown: Array<ScoreCategory & { Icon?: React.FC<React.SVGProps<SVGSVGElement>> }>
  totalScore: number
}

export function ScoreBreakdownModal({ show, onClose, scoreBreakdown, totalScore }: ScoreBreakdownModalProps) {
  if (!show) return null;

  // Manejador para cerrar al hacer click fuera
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card border border-border rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header - Simple & Directo */}
        <div className="p-6 border-b flex items-center justify-between bg-secondary/10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calculator className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Desglose Técnico</h2>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                Total Acumulado: {totalScore} pts
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content - Lista scrolleable */}
        <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
          {scoreBreakdown.map((category, index) => {
            const IconComponent = category.Icon || Award;
            const percentage = Math.round((category.score / category.maxScore) * 100);

            return (
              <section key={index} className="space-y-4">
                {/* Categoría Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-sm">
                      {categoryMap[category.category as keyof typeof categoryMap] || category.category}
                    </h3>
                  </div>
                  <span className="text-xs font-black px-2 py-0.5 bg-primary/10 text-primary rounded-md">
                    {percentage}%
                  </span>
                </div>

                {/* Items de la categoría */}
                <div className="grid gap-2">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/40 text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "complete" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        {item.status === "partial" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                        {item.status === "missing" && <X className="w-4 h-4 text-muted-foreground/50" />}
                        <span className={cn(
                          "font-medium",
                          item.status === "missing" ? "text-muted-foreground" : "text-foreground"
                        )}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold opacity-70">
                        +{item.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Tips simplificados */}
          <div className="mt-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
            <Info className="w-5 h-5 text-primary shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary">Tip Pro</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Para aumentar tu score en un <span className="font-bold">15-20%</span>, enfócate en añadir resultados cuantificables (ej: "Ahorro del 20% en costos") en lugar de solo listar tareas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
