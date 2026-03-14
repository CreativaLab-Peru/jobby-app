"use client"

import React, {useEffect, useMemo, useState} from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  CheckCircle,
  XCircle,
  FileCheck,
  UploadCloud,
  Sparkles,
} from "lucide-react"

type CvStatus =
  | { status: "CV_IN_PROGRESS" }
  | { status: "CV_FAILED" }
  | { status: "CV_SUCCEEDED" }
  | { status: "CV_READY_FOR_ANALYSIS" }
  | { status: "CV_EVALUATION_PENDING_EVALUATION" }
  | { status: "CV_EVALUATION_IN_PROGRESS" }
  | { status: "CV_EVALUATION_FAILED" }
  | { status: "CV_EVALUATION_SUCCEEDED" }
  | { status: "CV_EVALUATION_FINISHED" }
  | Record<string, string>

interface ProgressStatusProps {
  cvId: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const STEPS = [
  { key: "preparing", title: "Preparando CV", desc: "Subiendo o preparando tu CV para evaluación.", icon: UploadCloud },
  { key: "evaluation", title: "Evaluando", desc: "Analizando fortalezas y mejoras con IA.", icon: Loader2 },
  { key: "finished", title: "Finalizado", desc: "Listo — redirigiendo a resultados.", icon: FileCheck },
]

const STATUS_TO_INDEX: Record<string, number> = {
  CV_IN_PROGRESS: 0,
  CV_SUCCEEDED: 0,
  CV_READY_FOR_ANALYSIS: 0,
  CV_EVALUATION_PENDING_EVALUATION: 0,
  CV_EVALUATION_IN_PROGRESS: 1,
  CV_EVALUATION_SUCCEEDED: 2,
  CV_EVALUATION_FINISHED: 2,
  CV_FAILED: 0,
  CV_EVALUATION_FAILED: 1,
}

const variants = {
  step: {
    pending: { scale: 1, opacity: 0.5 },
    active: { scale: 1.05, opacity: 1 },
    completed: { scale: 1, opacity: 1 },
  },
}

export default function ProgressTimeline({ cvId }: ProgressStatusProps) {
  const router = useRouter()
  const [isRendering, setIsRendering] = useState(false)
  const { data: status } = useSWR<CvStatus | null>(`/api/cv/${cvId}/status`, fetcher, {
    refreshInterval: 3000,
  })

  const activeIndex = useMemo(() => {
    if (!status?.status) return -1
    return STATUS_TO_INDEX[status.status] ?? -1
  }, [status])

  const failureIndex = useMemo(() => {
    if (status?.status === "CV_FAILED") return 0
    if (status?.status === "CV_EVALUATION_FAILED") return 1
    return -1
  }, [status])

  useEffect(() => {
    setIsRendering(true)
  }, []);

  useEffect(() => {
    if (status?.status === "CV_EVALUATION_FINISHED" || status?.status === "CV_EVALUATION_SUCCEEDED") {
      const evaluateId = (status as any).evaluateId
      setTimeout(() => {
        if (evaluateId) router.push(`/evaluations/${evaluateId}`)
      }, 800)
    }
  }, [status, router])

  if (!isRendering) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto px-4 py-8 md:px-8 bg-background">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header con gradiente del sistema */}
        <div className="text-center mb-16 mt-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground mb-3">
            Analizando tu potencial
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>Levely AI está procesando tu perfil</span>
          </div>
        </div>

        <div className="flex gap-10 justify-center items-start w-full">
          {/* Columna Izquierda: Línea y Checkpoints */}
          <div className="w-12 flex flex-col items-center relative">
            {/* Línea Base (Muted) */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bottom-6 w-[2px] bg-border opacity-50" />

            {/* Línea de Progreso (Primary) */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 top-6 w-[2px] bg-primary origin-top max-w-2xl"
              initial={{ height: 0 }}
              animate={{
                height: activeIndex <= 0 ? 0 : `${(activeIndex / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 40, damping: 20 }}
            />

            <ol className="flex flex-col gap-y-24 w-full relative z-10 max-w-5xl">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon
                const state = activeIndex === -1 ? "pending" : idx < activeIndex ? "completed" : idx === activeIndex ? "active" : "pending"
                const isFailure = failureIndex === idx

                return (
                  <li key={step.key} className="flex justify-center">
                    <motion.div
                      variants={variants.step}
                      animate={state}
                      className={`flex items-center justify-center h-10 w-10 rounded-xl border-2 transition-all duration-500
                        ${state === "completed" ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10" :
                        state === "active" ? "bg-background border-primary shadow-xl shadow-primary/20" :
                          "bg-secondary border-border text-muted-foreground"}`}
                    >
                      <AnimatePresence mode="wait">
                        {isFailure ? (
                          <XCircle className="w-5 h-5 text-destructive" />
                        ) : state === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        ) : state === "active" ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                            <Loader2 className="w-5 h-5 text-primary" />
                          </motion.div>
                        ) : (
                          <StepIcon className="w-4 h-4 opacity-40" />
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Columna Derecha: Contenido (Entity Style) */}
          <div className="flex-1 space-y-24 py-1">
            {STEPS.map((step, idx) => {
              const state = activeIndex === -1 ? "pending" : idx < activeIndex ? "completed" : idx === activeIndex ? "active" : "pending"
              const isActive = state === "active"
              const isCompleted = state === "completed"
              const isFailure = failureIndex === idx

              return (
                <motion.div
                  key={step.key}
                  animate={{ opacity: isActive || isCompleted ? 1 : 0.4, x: isActive ? 10 : 0 }}
                  className={`transition-all duration-500`}
                >
                  <div className={`p-4 rounded-2xl border transition-all duration-500
                    ${isActive ? "bg-secondary border-primary/20 shadow-sm" : "bg-transparent border-transparent"}`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-black uppercase tracking-widest ${isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.title}
                        </h3>
                        {isCompleted && (
                          <StatusBadge variant="outline" className="text-[9px] py-0 h-4 border-primary/30 text-primary">
                            Completado
                          </StatusBadge>
                        )}
                        {isFailure && (
                          <StatusBadge variant="destructive" className="text-[9px] py-0 h-4">
                            Error
                          </StatusBadge>
                        )}
                      </div>
                      <p className={`text-xs font-medium leading-relaxed ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-componente Badge para mantener consistencia
function StatusBadge({ children, variant = "outline", className }: any) {
  const variants: any = {
    outline: "border-border text-muted-foreground",
    destructive: "bg-destructive/10 border-destructive/20 text-destructive",
  }
  return (
    <span className={`px-2 rounded-full border font-black uppercase tracking-tighter ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
