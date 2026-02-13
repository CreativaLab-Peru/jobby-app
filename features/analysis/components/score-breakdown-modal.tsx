"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calculator, X, CheckCircle2, AlertCircle, Info, Award, Sparkles } from "lucide-react"
import type { ScoreCategory } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map";
import { cn } from "@/lib/utils"

interface ScoreBreakdownModalProps {
  show: boolean
  onClose: () => void
  scoreBreakdown: Array<ScoreCategory & { Icon?: React.FC<React.SVGProps<SVGSVGElement>> }>
  totalScore: number
}

export function ScoreBreakdownModal({ show, onClose, scoreBreakdown, totalScore }: ScoreBreakdownModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-card border border-border rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Uso de Secondary para profundidad */}
            <div className="border-b border-border p-8 flex items-center justify-between bg-secondary/30">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Desglose de Puntuación</h2>
                  <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                    Análisis completo: {totalScore}/100 pts
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-secondary w-10 h-10">
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(85vh-120px)] custom-scrollbar space-y-10">
              {/* Categorías con barras de progreso minimalistas */}
              <div className="grid gap-8">
                {scoreBreakdown.map((category, index) => {
                  const IconComponent = category.Icon || Award;
                  const percentage = Math.round((category.score / category.maxScore) * 100);

                  return (
                    <div key={index} className="space-y-5">
                      <div className="flex items-end justify-between px-1">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-secondary rounded-lg">
                            <IconComponent className="w-4 h-4 text-primary" />
                          </div>
                          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/80">
                            {categoryMap[category.category as keyof typeof categoryMap] || category.category}
                          </h3>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-primary">{percentage}%</span>
                        </div>
                      </div>

                      {/* Progress Line sutil */}
                      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>

                      <div className="grid gap-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-transparent hover:border-border/40 hover:bg-secondary/40 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="transition-transform group-hover:scale-110">
                                {item.status === "complete" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                {item.status === "partial" && <AlertCircle className="w-4 h-4 text-amber-500" />}
                                {item.status === "missing" && <X className="w-4 h-4 text-destructive" />}
                              </div>
                              <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                              +{item.points} PTS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tips Section: Más vida con Sparkles */}
              <div className="p-6 bg-secondary/40 rounded-[2rem] border border-border/50 relative overflow-hidden group">
                <Sparkles className="absolute -right-2 -top-2 w-12 h-12 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors" />

                <div className="flex items-start gap-4">
                  <div className="p-2.5 bg-background rounded-xl shadow-sm">
                    <Info className="w-5 h-5 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm tracking-tight">Estrategias de Optimización</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {["Resultados medibles", "Certificaciones", "Keywords", "Estructura limpia"].map((tip) => (
                        <div key={tip} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
