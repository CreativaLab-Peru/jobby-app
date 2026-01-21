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
    <Card className="shadow-card border-border bg-card/50 backdrop-blur-md overflow-hidden relative">
      {/* Decoración de fondo usando colores de marca sutiles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>

      <CardHeader className="relative p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <CardTitle className="flex items-center text-2xl sm:text-3xl text-foreground">
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
              <Star className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-secondary fill-secondary/20" />
            </motion.div>
            Tu CV Score
          </CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
            <Button
              onClick={onShowBreakdown}
              variant="outline"
              className="w-full sm:w-auto bg-background/50 border-border hover:border-primary hover:bg-primary/5 text-foreground font-semibold"
            >
              <Calculator className="w-4 h-4 mr-2 text-primary" />
              Ver Desglose
            </Button>
          </motion.div>
        </div>
      </CardHeader>

      <CardContent className="relative p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          <div className="text-center md:text-left">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-5xl sm:text-7xl font-bold ai-gradient-text mb-3"
            >
              {score}/100
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg sm:text-xl font-semibold text-muted-foreground"
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
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="transparent"
                  className="text-muted/30"
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
                />
                <defs>
                  <linearGradient id="ai-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                  className="text-xl sm:text-2xl font-bold text-primary"
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
          className="origin-left"
        >
          <Progress
            value={score}
            className="h-4 bg-muted [&>div]:ai-gradient"
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}
