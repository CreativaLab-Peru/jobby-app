"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {AlertTriangle, CheckCircle, Lightbulb} from "lucide-react"
import type { Recommendation } from "@/types/analysis"
import {categoryMap} from "@/features/analysis/data/category-map";

interface RecommendationsSectionProps {
  recommendations: Recommendation[]
}

const iconMap = {
  high: <AlertTriangle className="w-6 h-6 text-red-500" />,
  medium: <Lightbulb className="w-6 h-6 text-yellow-500" />,
  low: <CheckCircle className="w-6 h-6 text-green-500" />,
}

const impactMap = {
  critical: "Alto",
  important: "Medio",
  suggestion: "Bajo",
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {

  return (
    <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl text-gray-800">
          <Lightbulb className="w-8 h-8 mr-3 text-orange-500" />
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
            className={`p-4 rounded-lg border-l-4 ${
              rec.type === "critical"
                ? "bg-red-50 border-red-500"
                : rec.type === "important"
                  ? "bg-yellow-50 border-yellow-500"
                  : "bg-green-50 border-green-500"
            }`}
          >
            <div className="flex items-start gap-3">
              {iconMap[rec.icon] || <Lightbulb className="w-6 h-6 text-gray-500" />}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {categoryMap[rec.title as keyof typeof categoryMap] || rec.title}
                  </h3>
                  <Badge variant={rec.type === "critical" ? "destructive" : "secondary"}>
                    Impacto {impactMap[rec.type]}
                  </Badge>
                </div>
                <p className="text-gray-600">{rec.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
