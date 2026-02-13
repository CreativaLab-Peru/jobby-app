"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Calculator, Zap, ShieldCheck, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CVScoreCardProps {
  score: number
  onShowBreakdown: () => void
}

export function CVScoreCard({ score, onShowBreakdown }: CVScoreCardProps) {
  const isExcellent = score >= 80
  const isWarning = score < 60

  const getScoreInfo = (score: number) => {
    if (score >= 80) return { label: "Excelente", icon: ShieldCheck, color: "text-primary" }
    if (score >= 60) return { label: "Buen Potencial", icon: Zap, color: "text-amber-500" }
    return { label: "Mejoras Necesarias", icon: AlertCircle, color: "text-destructive" }
  }

  const { label, icon: StatusIcon, color } = getScoreInfo(score)

  return (
    <Card className="relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5">
      {/* Elementos decorativos de ingeniería */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-32 translate-x-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full translate-y-24 -translate-x-24 blur-3xl" />

      <CardHeader className="relative p-8 pb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <CardTitle className="flex items-center gap-4 text-md font-black">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Star className="w-5 h-5 text-primary fill-primary/20" />
            </div>
            Global Performance Index
          </CardTitle>

          <Button
            onClick={onShowBreakdown}
            variant="secondary"
            size="sm"
            className="rounded-xl font-black uppercase text-xs h-10 px-6 border-border/40 hover:border-primary/30 transition-all"
          >
            <Calculator className="w-3.5 h-3.5 mr-2 text-primary" />
            Desglose Técnico
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative p-8 pt-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Lado Izquierdo: El Número */}
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-baseline justify-center md:justify-start">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-8xl sm:text-9xl font-black tracking-tighter text-foreground"
              >
                {Math.round(score)}
              </motion.span>
              <span className="text-2xl font-black text-muted-foreground/40 ml-2">/100</span>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("flex items-center gap-2 justify-center md:justify-start font-bold text-sm uppercase tracking-widest", color)}
            >
              <StatusIcon className="w-4 h-4" />
              {label}
            </motion.div>
          </div>

          {/* Lado Derecho: Indicador Circular */}
          <div className="relative group">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 1 }}
              className="w-40 h-40 sm:w-48 sm:h-48"
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50" cy="50" r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-secondary"
                />
                {/* Progress Bar */}
                <motion.circle
                  cx="50" cy="50" r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="263.89"
                  initial={{ strokeDashoffset: 263.89 }}
                  animate={{ strokeDashoffset: 263.89 - (263.89 * score) / 100 }}
                  transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                  strokeLinecap="round"
                  className={cn(
                    "transition-colors duration-500",
                    isExcellent ? "text-primary" : isWarning ? "text-destructive" : "text-amber-500"
                  )}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-sm rounded-full m-4 border border-border/20 shadow-inner">
                <span className="text-xs font-black text-muted-foreground/60 uppercase">Match</span>
                <span className="text-2xl font-black text-foreground">{Math.round(score)}%</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Barra de progreso inferior tipo "Console" */}
        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-xs font-black uppercase">
            <span>Nivel de Optimización</span>
            <span>{score}% Eficiencia</span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className={cn(
                "h-full rounded-full",
                isExcellent ? "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" :
                  isWarning ? "bg-destructive" : "bg-amber-500"
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
