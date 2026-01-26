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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#20232a] dark:via-[#181b1f] dark:to-blue-950 backdrop-blur-md overflow-hidden relative">
      {/* Fondo decorativo degradado */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 via-coral-200 to-transparent opacity-20 dark:from-blue-900 dark:via-coral-950 dark:to-transparent z-0 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-gradient-to-br from-coral-100 via-blue-100 to-transparent opacity-20 dark:from-coral-950 dark:via-blue-900 dark:to-transparent z-0 blur-2xl" />

      <CardHeader className="relative p-6 z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center text-2xl sm:text-3xl text-blue-500 dark:text-blue-300 font-black">
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
              <Star className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-yellow-400 dark:text-yellow-300 fill-yellow-400/20" />
            </motion.div>
            Tu CV Score
          </CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              onClick={onShowBreakdown}
              variant="outline"
              className="w-full sm:w-auto bg-white/80 dark:bg-[#23272f] border-2 border-blue-400 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-200 font-bold shadow-sm"
            >
              <Calculator className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-300" />
              Ver Desglose
            </Button>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="relative p-6 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-5xl sm:text-7xl font-black text-blue-500 dark:text-blue-300 mb-3 drop-shadow"
            >
              {score}/100
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg sm:text-xl font-bold text-blue-400 dark:text-blue-300"
            >
              {getScoreLabel(score)}
            </motion.p>
          </div>

          <div className="relative">
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1, type: "spring", stiffness: 100 }}
              className="w-32 h-32 sm:w-40 sm:h-40"
            >
              <svg className="transform -rotate-90 w-32 h-32 sm:w-40 sm:h-40" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="transparent"
                  className="dark:stroke-[#23272f]"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#ai-score-gradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  initial={{ strokeDashoffset: `${2 * Math.PI * 70}` }}
                  animate={{ strokeDashoffset: `${2 * Math.PI * 70 * (1 - score / 100)}` }}
                  transition={{ delay: 0.8, duration: 2, ease: "easeOut" }}
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 2px 8px rgba(59,130,246,0.15)) drop-shadow(0 0 8px rgba(59,130,246,0.10))' }}
                />
                <defs>
                  <linearGradient id="ai-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#fb7185" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="text-xl sm:text-2xl font-black text-blue-500 dark:text-blue-300 drop-shadow"
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
          className="origin-left mt-2"
        >
          <Progress
            value={score}
            className="h-4 bg-blue-100 dark:bg-blue-900 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:via-coral-400 [&>div]:to-blue-200 dark:[&>div]:from-blue-500 dark:[&>div]:via-coral-600 dark:[&>div]:to-blue-900"
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}
