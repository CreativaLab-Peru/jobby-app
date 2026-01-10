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

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-3xl text-foreground">
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
              {/* Star usa un tono ambar de los globales o primary si prefieres */}
              <Star className="w-10 h-10 mr-4 text-secondary fill-secondary/20" />
            </motion.div>
            Tu CV Score
          </CardTitle>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onShowBreakdown}
              variant="outline"
              className="bg-background/50 border-border hover:border-primary hover:bg-primary/5 text-foreground font-semibold"
            >
              <Calculator className="w-4 h-4 mr-2 text-primary" />
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
              className="text-7xl font-bold ai-gradient-text mb-3"
            >
              {score}/100
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-xl font-semibold text-muted-foreground"
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
                    {/* Usamos los colores HSL definidos en tu globals.css */}
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
                  className="text-2xl font-bold text-primary"
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
          {/* Progress bar ahora usa ai-gradient a través de utility o inline gradient */}
          <Progress
            value={score}
            className="h-4 bg-muted [&>div]:ai-gradient"
          />
        </motion.div>
      </CardContent>
    </Card>
  )
}
