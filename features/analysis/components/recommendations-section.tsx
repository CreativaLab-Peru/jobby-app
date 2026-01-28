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
    <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-levely-blue dark:text-levely-green font-bold">
          <Lightbulb className="w-8 h-8 mr-3 text-levely-blue dark:text-levely-green" />
          Recomendaciones Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border-l-4 ${typeStyles[rec.type]}`}
          >
            <div className="flex items-start gap-3">
              {iconMap[rec.icon] || <Lightbulb className="w-6 h-6 text-levely-blue dark:text-levely-green" />}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-levely-blue dark:text-levely-green">
                    {categoryMap[rec.title as keyof typeof categoryMap] || rec.title}
                  </h3>
                  <Badge
                    variant={rec.type === "critical" ? "destructive" : "secondary"}
                    className="w-fit text-levely-blue dark:text-levely-green bg-levely-blue/10 dark:bg-levely-green/10"
                  >
                    Impacto {impactMap[rec.type]}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}