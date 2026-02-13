"use client"

import React, { useEffect, useMemo } from "react"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileCheck,
  UploadCloud, Sparkles,
} from "lucide-react"

type CvStatus =
  | { status: "CV_IN_PROGRESS" }
  | { status: "CV_FAILED" }
  | { status: "CV_SUCCEEDED" }
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

// Timeline steps for uploaded CVs
const UPLOAD_STEPS = [
  {
    key: "upload",
    title: "Subido",
    desc: "Hemos recibido tu CV.",
    icon: UploadCloud,
  },
  {
    key: "processing",
    title: "Procesando",
    desc: "Analizando tu archivo — extrayendo habilidades y experiencia.",
    icon: Loader2,
  },
  {
    key: "queued",
    title: "En cola de evaluación",
    desc: "En espera para ser analizado por un procesador.",
    icon: Clock,
  },
  {
    key: "inProgress",
    title: "Evaluación en progreso",
    desc: "Ejecutando el análisis — detectando fortalezas y sugerencias.",
    icon: Loader2,
  },
  {
    key: "finished",
    title: "Finalizado",
    desc: "Listo — haz clic para ver los resultados.",
    icon: FileCheck,
  },
]

// Timeline steps for manual CVs (simpler flow)
const MANUAL_STEPS = [
  {
    key: "ready",
    title: "CV Listo",
    desc: "Tu CV está listo para ser analizado.",
    icon: FileCheck,
  },
  {
    key: "inProgress",
    title: "Evaluación en progreso",
    desc: "Ejecutando el análisis — detectando fortalezas y sugerencias.",
    icon: Loader2,
  },
  {
    key: "finished",
    title: "Finalizado",
    desc: "Listo — haz clic para ver los resultados.",
    icon: FileCheck,
  },
]

// Map backend statuses to timeline indices for uploaded CVs
const UPLOAD_STATUS_TO_INDEX: Record<string, number> = {
  CV_SUCCEEDED: 0, // upload completed
  CV_IN_PROGRESS: 1, // processing
  CV_EVALUATION_PENDING_EVALUATION: 2,
  CV_EVALUATION_IN_PROGRESS: 3,
  CV_EVALUATION_SUCCEEDED: 4,
  CV_EVALUATION_FINISHED: 4,
  CV_FAILED: 0, // treat as upload step but with error marker
  CV_EVALUATION_FAILED: 3,
}

// Map backend statuses to timeline indices for manual CVs
const MANUAL_STATUS_TO_INDEX: Record<string, number> = {
  CV_READY_FOR_ANALYSIS: 0,
  CV_EVALUATION_PENDING_EVALUATION: 0,
  CV_EVALUATION_IN_PROGRESS: 1,
  CV_EVALUATION_SUCCEEDED: 2,
  CV_EVALUATION_FINISHED: 2,
  CV_EVALUATION_FAILED: 1,
}

const variants = {
  step: {
    pending: { scale: 1, opacity: 0.7 },
    active: { scale: 1.03, opacity: 1 },
    completed: { scale: 1, opacity: 1 },
  },
  icon: {
    pending: { scale: 1, rotate: 0 },
    active: { scale: 1.15, rotate: [0, 6, -6, 0] },
    completed: { scale: [0, 1.15, 1] },
  },
}


export default function ProgressTimeline({ cvId }: ProgressStatusProps) {
  const router = useRouter()
  const { data: status } = useSWR<CvStatus | null>(`/api/cv/${cvId}/status`, fetcher, {
    refreshInterval: 3000,
  })

  // Determine which steps and status map to use
  const isManual = useMemo(() => {
    if (!status?.status) return false;
    // If status starts with CV_READY or we don't have upload-specific statuses
    return status.status === "CV_READY_FOR_ANALYSIS" ||
           !["CV_IN_PROGRESS", "CV_SUCCEEDED", "CV_FAILED"].includes(status.status);
  }, [status]);

  const STEPS = isManual ? MANUAL_STEPS : UPLOAD_STEPS;
  const STATUS_TO_INDEX = isManual ? MANUAL_STATUS_TO_INDEX : UPLOAD_STATUS_TO_INDEX;

  const activeIndex = useMemo(() => {
    if (!status?.status) return -1
    return STATUS_TO_INDEX[status.status] ?? -1
  }, [status, STATUS_TO_INDEX])

  useEffect(() => {
    if (status?.status === "CV_EVALUATION_FINISHED" || status?.status === "CV_EVALUATION_SUCCEEDED") {
      const evaluateId = (status as any).evaluateId
      setTimeout(() => {
        if (evaluateId) router.push(`/evaluations/${evaluateId}`)
      }, 600)
    }
  }, [status, router])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-400 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
            Analizando tu potencial
          </h1>
          <p className="text-slate-600 dark:text-slate-300 animate-pulse flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            La IA de Levely está procesando tu perfil...
          </p>
        </div>

        <div className="flex gap-8 justify-center items-start w-full">
          {/* Left column: vertical line + icons */}
          <div className="w-12 flex flex-col items-center relative">
          {/* vertical base line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-200 via-cyan-200 to-blue-200 dark:from-emerald-500 dark:via-cyan-500 dark:to-emerald-500 rounded-full opacity-30 dark:opacity-40" />

          {/* animated fill line */}
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 top-6 w-1 rounded-full origin-top"
            style={{
              background: "linear-gradient(180deg, #0891b2 0%, #3b82f6 50%, #0891b2 100%)",
            }}
            initial={{ height: 0 }}
            animate={{
              height: activeIndex <= 0 ? 0 : `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
          />

          <ol className="flex flex-col gap-y-16 w-full relative z-10">
            {STEPS.map((step, idx) => {
              const StepIcon = step.icon
              const state = activeIndex === -1 ? "pending" : idx < activeIndex ? "completed" : idx === activeIndex ? "active" : "pending"
              // For manual CVs, failure is at index 1; for uploads, failure can be at 0 or 3
              const isFailure = isManual
                ? (status?.status === "CV_EVALUATION_FAILED" && idx === 1)
                : ((status?.status === "CV_FAILED" && idx === 0) || (status?.status === "CV_EVALUATION_FAILED" && idx === 3))

              return (
                <li key={step.key}>
                  <motion.div
                    variants={variants.step}
                    animate={state}
                    className={`flex items-center justify-center h-12 w-12 rounded-full border-4 transition-all duration-500
                      ${state === "completed" ? "bg-cyan-100/50 border-cyan-500 shadow-lg shadow-cyan-500/20 dark:bg-emerald-100/30 dark:border-emerald-500 dark:shadow-lg dark:shadow-emerald-500/30" :
                      state === "active" ? "bg-blue-100/50 border-blue-500 shadow-xl shadow-blue-500/30 dark:bg-transparent dark:border-indigo-500 dark:shadow-xl dark:shadow-indigo-500/40" :
                        "bg-slate-200/30 border-slate-400 dark:bg-slate-700/30 dark:border-slate-600"}`}
                  >
                    <AnimatePresence mode="wait">
                      {isFailure ? (
                        <motion.div key="fail" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <XCircle className="w-6 h-6 text-red-500" />
                        </motion.div>
                      ) : state === "completed" ? (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle className="w-6 h-6 text-cyan-600 dark:text-emerald-400" />
                        </motion.div>
                      ) : state === "active" ? (
                        <motion.div key="loader" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                          <Loader2 className="w-6 h-6 text-blue-600 dark:text-indigo-400" />
                        </motion.div>
                      ) : (
                        <StepIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </AnimatePresence>
                  </motion.div>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Right column: titles and descriptions */}
        <div className="flex-1 space-y-16 py-1">
          {STEPS.map((step, idx) => {
            const state = activeIndex === -1 ? "pending" : idx < activeIndex ? "completed" : idx === activeIndex ? "active" : "pending"
            const isActive = state === "active"
            const isCompleted = state === "completed"
            // For manual CVs, failure is at index 1; for uploads, failure can be at 0 or 3
            const isFailure = isManual
              ? (status?.status === "CV_EVALUATION_FAILED" && idx === 1)
              : ((status?.status === "CV_FAILED" && idx === 0) || (status?.status === "CV_EVALUATION_FAILED" && idx === 3))

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`transition-all duration-500 ${isActive ? "scale-105" : "scale-100 opacity-70"}`}
              >
                <div className={`p-4 rounded-xl border transition-all
                  ${isActive ? "bg-blue-100/30 border-blue-300 shadow-lg shadow-blue-500/20 dark:bg-indigo-100/20 dark:border-indigo-600/50 dark:shadow-lg dark:shadow-indigo-500/20" : "bg-transparent border-transparent"}`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-base ${isActive ? "text-blue-700 dark:text-indigo-300" : isCompleted ? "text-cyan-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"}`}>
                        {step.title}
                      </h3>
                      {isCompleted && <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-600 dark:text-emerald-400">Listo</span>}
                      {isFailure && <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400">Error</span>}
                    </div>
                    <p className={`text-sm mt-1 leading-relaxed ${isActive ? "text-blue-700/70 dark:text-indigo-300/70" : isCompleted ? "text-cyan-600/70 dark:text-emerald-400/70" : "text-slate-500 dark:text-slate-400"}`}>
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
