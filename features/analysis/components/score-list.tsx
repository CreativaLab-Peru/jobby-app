"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { formatDate } from "@/utils/format-date"
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user"
import { categoryMap } from "@/features/analysis/data/category-map"

interface ScoresListPageProps {
  cvs: CvWithRelations[]
  disabledButton?: boolean
}

// Helper para colores según score usando tema
const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-primary"
  if (score >= 60) return "text-secondary"
  return "text-accent"
}

const getScoreBadgeColor = (score: number) => {
  if (score >= 80) return "bg-primary/20 text-primary"
  if (score >= 60) return "bg-secondary/20 text-secondary"
  return "bg-accent/20 text-accent"
}

const getTrendIconColor = (trend: "up" | "down") => {
  return trend === "up" ? "text-primary" : "text-accent"
}

export function ScoresListPage({ cvs, disabledButton }: ScoresListPageProps) {
  const [scores] = useState(cvs)
  const router = useRouter()

  const handleUploadCV = () => {
    if (disabledButton) return;
    router.push("/cv/upload");
  }

  return (
    <div className="p-6 h-full">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Scores de CVs
              </h1>
              <p className="text-muted-foreground mt-2">
                Analiza el rendimiento y mejora tus currículums 🚀
              </p>
            </div>

            <Button
              className="w-full sm:w-auto"
              disabled={disabledButton}
              onClick={handleUploadCV}
            >
              <Plus className="w-4 h-4 mr-2" />
              <span>Subir CV</span>
            </Button>
          </div>

          {/* Scores List */}
          <div className="space-y-6">
            {scores.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="bg-background/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl sm:text-2xl text-foreground flex items-center gap-3">
                            {score.title || "CV Analizado"}
                            {/* trend logic could be added here if needed, keeping it simple as per original */}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {score.evaluations[0]?.createdAt
                              ? `Analizado el ${formatDate(score.evaluations[0].createdAt, "dd/MM/yyyy")}`
                              : "Sin análisis todavía"}
                          </CardDescription>
                        </div>

                        <div className="pt-2 sm:pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit cursor-pointer text-primary hover:text-secondary border-2 border-primary/40 hover:border-secondary transition-colors duration-200 font-semibold"
                            onClick={() => router.push(`/evaluations/${score.evaluations[0]?.id}`)}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                        <div className={`text-4xl sm:text-3xl font-bold ${getScoreTextColor(score.evaluations[0]?.overallScore || 0)}`}>
                          {score.evaluations[0]?.overallScore || 0}
                        </div>
                        <Badge className={`${getScoreBadgeColor(score.evaluations[0]?.overallScore || 0)} font-bold`}>
                          {score.evaluations[0]?.overallScore >= 80
                            ? "Excelente"
                            : score.evaluations[0]?.overallScore >= 60
                              ? "Bueno"
                              : "Necesita Mejora"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-2 sm:pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Categories Scores */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-primary" />
                          Puntuación por Categorías
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                          {score.evaluations[0]?.scores.map((section) => (
                            <div key={section.id} className="group">
                              <div className="flex justify-between text-sm mb-1.5">
                                <span className="text-foreground/80 font-medium group-hover:text-primary transition-colors">
                                  {categoryMap[section.sectionType as keyof typeof categoryMap] || section.sectionType}
                                </span>
                                <span className={`font-semibold ${getScoreTextColor(section.score)}`}>
                                  {section.score}%
                                </span>
                              </div>

                              <Progress
                                value={section.score}
                                className="h-2 bg-muted rounded-full [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:via-secondary [&>div]:to-accent [&>div]:rounded-full"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
                        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-secondary" />
                          Recomendaciones de Mejora
                        </h4>
                        <ul className="space-y-3">
                          {score.evaluations[0]?.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-balance">
                              <div className="w-1.5 h-1.5 bg-primary/80 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground leading-relaxed">{rec.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {scores.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted mb-2">No hay scores disponibles</h3>
              <p className="text-muted/80">Crea y analiza tus CVs para ver los scores aquí</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
