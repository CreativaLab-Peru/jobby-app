"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calculator, X, CheckCircle, AlertTriangle, Info, Award } from "lucide-react"
import type { ScoreCategory } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map";

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
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card border border-border rounded-2xl shadow-card max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: REFACTOR a ai-gradient */}
            <div className="p-6 ai-gradient text-primary-foreground relative overflow-hidden">
              {/* Decoración sutil */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Calculator className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Desglose del Score</h2>
                    <p className="text-white/80 font-medium">Análisis detallado: {totalScore}/100 puntos</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 rounded-full">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] custom-scrollbar">
              <div className="space-y-6">
                {scoreBreakdown.map((category, index) => {
                  const IconComponent = category.Icon || Award;
                  // REFACTOR: Usar primary para el color de categoría por defecto
                  const categoryColor = category.color || 'var(--primary)';

                  return (
                    <motion.div
                      key={`${category.category}-${index}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border border-border rounded-xl p-6 bg-card hover:border-primary/30 transition-all shadow-sm"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-muted">
                            <IconComponent className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground">
                              {categoryMap[category.category as keyof typeof categoryMap] || category.category}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-bold text-foreground">{category.score}</span> de {category.maxScore} pts
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-primary">
                            {Math.round((category.score / category.maxScore) * 100)}%
                          </div>
                          <Progress
                            value={(category.score / category.maxScore) * 100}
                            className="bg-muted w-28 h-2 mt-2 [&>div]:ai-gradient"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between py-3 px-4 bg-muted/30 hover:bg-muted/60 rounded-lg transition-colors border border-transparent hover:border-border"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {item.status === "complete" && <CheckCircle className="w-4 h-4 text-secondary" />}
                              {item.status === "partial" && <AlertTriangle className="w-4 h-4 text-orange-400" />}
                              {item.status === "missing" && <X className="w-4 h-4 text-destructive" />}

                              <span className="text-sm text-foreground font-medium">
                                {item.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded">
                                {item.points} pts
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Tips Section REFACTOR */}
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Info className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">¿Cómo mejorar tu score con Levely?</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">• Completa campos obligatorios</li>
                      <li className="flex items-center gap-2">• Agrega resultados medibles</li>
                      <li className="flex items-center gap-2">• Incluye certificaciones</li>
                      <li className="flex items-center gap-2">• Refina tus descripciones</li>
                    </ul>
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

// Icono extra para el diseño
function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  )
}
