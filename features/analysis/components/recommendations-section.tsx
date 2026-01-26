"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"
import type { Recommendation } from "@/types/analysis"
import { categoryMap } from "@/features/analysis/data/category-map"

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

// Iconos con colores usando variables CSS
const iconMap = {
  high: <AlertTriangle className="w-6 h-6 text-destructive" />,
  medium: <Lightbulb className="w-6 h-6 text-accent" />,
  low: <CheckCircle className="w-6 h-6 text-secondary" />,
}

const impactMap = {
  critical: "Alto",
  important: "Medio",
  suggestion: "Bajo",
}

// Mapeo de background y border usando clases con variables
const typeStyles = {
  critical: "bg-destructive/20 border-destructive",
  important: "bg-accent/20 border-accent",
  suggestion: "bg-secondary/20 border-secondary",
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 backdrop-blur-md overflow-hidden relative">
      {/* Fondo decorativo degradado */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200 via-coral-200 to-transparent opacity-20 dark:from-blue-900 dark:via-coral-950 dark:to-transparent z-0 blur-2xl" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center text-2xl font-black text-blue-500 dark:text-blue-300">
          <Lightbulb className="w-8 h-8 mr-3 text-yellow-400 dark:text-yellow-300" />
          Recomendaciones Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border-l-4 shadow-sm ${
              rec.type === "critical"
                ? "bg-red-100 border-red-400 dark:bg-red-800/80 dark:border-red-500"
                : rec.type === "important"
                ? "bg-blue-100 border-blue-400 dark:bg-blue-800/80 dark:border-blue-500"
                : "bg-green-100 border-green-400 dark:bg-green-800/80 dark:border-green-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {iconMap[rec.icon] || <Lightbulb className="w-6 h-6 text-blue-400 dark:text-blue-300" />}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-black text-lg text-blue-500 dark:text-white">
                    {categoryMap[rec.title as keyof typeof categoryMap] || rec.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`w-fit font-bold px-2 py-1 rounded-full text-xs border-2 ${
                      rec.type === "critical"
                        ? "border-red-400 text-red-700 dark:border-red-500 dark:text-red-200"
                        : rec.type === "important"
                        ? "border-blue-400 text-blue-700 dark:border-blue-500 dark:text-blue-200"
                        : "border-green-400 text-green-700 dark:border-green-500 dark:text-green-200"
                    }`}
                  >
                    Impacto {impactMap[rec.type]}
                  </Badge>
                </div>
                <p className="text-blue-700 dark:text-white font-medium">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
