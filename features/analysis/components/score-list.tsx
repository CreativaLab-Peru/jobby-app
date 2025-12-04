"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/format-date"
import { CvWithRelations } from "@/features/cv/actions/get-cv-for-current-user"
import {categoryMap} from "@/features/analysis/data/category-map";

interface ScoresListPageProps {
  cvs: CvWithRelations[]
  disabledButton?: boolean;
}

export function ScoresListPage({ cvs, disabledButton }: ScoresListPageProps) {
  const [scores] = useState(cvs)
  const router = useRouter()
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const handleUploadCV = () => {
    if (disabledButton) return
    router.push("/cv/upload")
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800"
    if (score >= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 h-full">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Scores de CVs
              </h1>
              <p className="text-gray-600 mt-2">
                Analiza el rendimiento y mejora tus currículums 🚀
              </p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              disabled={disabledButton}
              onClick={handleUploadCV}>
              <Plus className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">✨ Subir CV</span>
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
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <CardTitle className="text-xl text-gray-800 flex items-center gap-3">
                            {score.title || "CV Analizado"}
                            {score.title === "up" ? (
                              <TrendingUp className="w-5 h-5 text-green-500" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-500" />
                            )}
                          </CardTitle>
                          <CardDescription>
                            {score.evaluations[0]?.createdAt
                              ? `Analizado el ${formatDate(score.evaluations[0].createdAt, "dd/MM/yyyy")}`
                              : "Sin análisis todavía"}
                          </CardDescription>
                        </div>
                        <div className="">
                          <Button variant="ghost" size="sm" className="ml-2 cursor-pointer text-purple-600 hover:text-purple-800 border-2 border-purple-300 hover:border-purple-500 transition-colors duration-200"
                            onClick={() => router.push(`/evaluations/${score.evaluations[0]?.id}`)}>
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(score.evaluations[0]?.overallScore || 0)}`}>
                          {score.evaluations[0]?.overallScore || 0}
                        </div>
                        <Badge className={getScoreBadgeColor(score.evaluations[0]?.overallScore || 0)}>
                          {score.evaluations[0]?.overallScore >= 80
                            ? "Excelente"
                            : score.evaluations[0]?.overallScore >= 60
                              ? "Bueno"
                              : "Necesita Mejora"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Categories Scores */}
                        <div>
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-purple-500" />
                          Puntuación por Categorías
                        </h4>
                        <div className="space-y-3">
                          {score.evaluations[0]?.scores.map((section) => (
                          <div key={section.id} className="group">
                            <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-700 font-medium group-hover:text-purple-600 transition-colors">
                              {categoryMap[section.sectionType as keyof typeof categoryMap] || section.sectionType}
                            </span>
                            <span className={`font-semibold ${getScoreColor(section.score)} text-base`}>
                              {section.score}%
                            </span>
                            </div>
                            <Progress
                            value={section.score}
                            className="h-2.5 bg-gray-200 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:via-purple-500 [&>div]:to-pink-500 [&>div]:rounded-full [&>div]:transition-all [&>div]:duration-500"
                            />
                          </div>
                          ))}
                        </div>
                        </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-4">
                          Recomendaciones de Mejora
                        </h4>
                        <ul className="space-y-2">
                          {score.evaluations[0]?.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                              {rec.text}
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
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay scores disponibles</h3>
              <p className="text-gray-500">Crea y analiza tus CVs para ver los scores aquí</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
