"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Star, Calculator } from "lucide-react"

interface CVScoreCardProps {
  score: number
  onShowBreakdown: () => void
}

export function CVScoreCard({ score, onShowBreakdown }: CVScoreCardProps) {
  const getScoreLabel = (score: number) => {
    if (score >= 80) return "🎉 Excelente"
    if (score >= 60) return "👍 Bueno"
    return "📈 Necesita mejoras"
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 rounded-full translate-y-12 -translate-x-12"></div>

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-3xl text-gray-800">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatDelay: 5,
              }}
            >
              <Star className="w-10 h-10 mr-4 text-yellow-500" />
            </motion.div>
            Tu CV Score
          </CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onShowBreakdown}
              variant="outline"
              className="bg-white/80 backdrop-blur-sm border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 font-semibold"
            >
              <Calculator className="w-4 h-4 mr-2" />
              Ver Desglose
            </Button>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3"
            >
              {score}/100
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl font-semibold text-gray-700"
            >
              {getScoreLabel(score)}
            </motion.p>
          </div>

          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 100 }}
              className="w-40 h-40"
            >
              <svg className="transform -rotate-90 w-40 h-40">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-gray-200"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 70 * (1 - score / 100)}` }}
                  transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="text-2xl font-bold text-indigo-600"
                >
                  {score}%
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          className=" origin-left"
        >
          <Progress value={score} className="h-4 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:via-purple-500 [&>div]:to-pink-500" />
        </motion.div>
      </CardContent>
    </Card>
  )
}
