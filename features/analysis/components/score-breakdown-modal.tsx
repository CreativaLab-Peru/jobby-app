"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calculator, X, CheckCircle, AlertTriangle, Info, Award } from "lucide-react"
import type { ScoreCategory } from "@/types/analysis"

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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calculator className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Desglose del Score</h2>
                    <p className="text-indigo-100">Cómo se calculó tu puntuación de {totalScore}/100</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-6">
                {scoreBreakdown.map((category, index) => {
                  const IconComponent = category.Icon || Award;
                  return (
                    <motion.div
                      key={`${category.category}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl`} style={{ backgroundColor: category.bgColor || '#f3f4f6' }}>
                            <IconComponent className="w-7 h-7" style={{ color: category.color || '#6b7280' }} />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{category.category}</h3>
                            <p className="text-sm text-gray-600">
                              {category.score}/{category.maxScore} puntos obtenidos
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold" style={{ color: category.color || '#6b7280' }}>
                            {Math.round((category.score / category.maxScore) * 100)}%
                          </div>
                          <Progress
                            value={(category.score / category.maxScore) * 100}
                            className="bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:via-purple-500 [&>div]:to-pink-500 w-28 h-2.5 mt-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between py-3 px-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div
                                className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.status === "complete"
                                    ? "bg-green-500"
                                    : item.status === "partial"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                                  }`}
                              />
                              <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-semibold text-gray-600 min-w-[45px] text-right">
                                {item.points} pts
                              </span>
                              {item.status === "complete" && (
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              )}
                              {item.status === "partial" && (
                                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                              )}
                              {item.status === "missing" && (
                                <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="flex items-start gap-3">
                  <Info className="w-6 h-6 text-indigo-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-indigo-800 mb-2">¿Cómo mejorar tu score?</h4>
                    <ul className="text-sm text-indigo-700 space-y-1">
                      <li>• Completa todos los campos obligatorios</li>
                      <li>• Agrega más proyectos con resultados medibles</li>
                      <li>• Incluye certificaciones relevantes</li>
                      <li>• Mejora la descripción de tus logros</li>
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
