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
  UploadCloud,
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

// Timeline steps single source of truth
const STEPS = [
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

// Map backend statuses to timeline indices
const STATUS_TO_INDEX: Record<string, number> = {
  CV_SUCCEEDED: 0, // upload completed
  CV_IN_PROGRESS: 1, // processing
  CV_EVALUATION_PENDING_EVALUATION: 2,
  CV_EVALUATION_IN_PROGRESS: 3,
  CV_EVALUATION_SUCCEEDED: 4,
  CV_EVALUATION_FINISHED: 4,
  CV_FAILED: 0, // treat as upload step but with error marker
  CV_EVALUATION_FAILED: 3, // mark evaluation step as failed
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
    refreshWhenHidden: false,
  })

  const activeIndex = useMemo(() => {
    if (!status?.status) return -1
    return STATUS_TO_INDEX[status.status] ?? -1
  }, [status])

  useEffect(() => {
    // If finished, wait a short animation and then navigate
    if (
      status?.status === "CV_EVALUATION_FINISHED" ||
      status?.status === "CV_EVALUATION_SUCCEEDED"
    ) {
      const evaluateId = (status as any).evaluateId
      // small timeout to let the last animation play
      setTimeout(() => {
        if (evaluateId) router.push(`/evaluations/${evaluateId}`)
      }, 600)
    }
  }, [status, router])

  return (
      <div>
        <h1 className="text-2xl font-semibold mb-8 text-center text-gray-500 animate-pulse">
          Tu CV esta en progreso
        </h1>
        <div className="flex gap-6 justify-start">
          {/* Left column: vertical line + icons */}
          <div className="w-12 flex flex-col items-center relative">
            {/* vertical base line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 top-6 bottom-6 w-0.5 bg-gray-200" />

            {/* animated fill line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 top-6 w-0.5 bg-gradient-to-b from-blue-500 to-green-400 origin-top"
              initial={{ height: 0 }}
              animate={{
                height:
                  activeIndex <= 0
                    ? 0
                    : `${(activeIndex / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />

            <ol className="flex flex-col gap-y-20 w-full">
              {STEPS.map((step, idx) => {
                const StepIcon = step.icon
                const state =
                  activeIndex === -1
                    ? "pending"
                    : idx < activeIndex
                      ? "completed"
                      : idx === activeIndex
                        ? "active"
                        : "pending"

                // detect failures
                const isFailure =
                  (status?.status === "CV_FAILED" && idx === 0) ||
                  (status?.status === "CV_EVALUATION_FAILED" && idx === 3)

                return (
                  <li key={step.key} className="relative">
                    <motion.div
                      variants={variants.step}
                      animate={state}
                      className="flex items-center justify-center h-10 w-10 rounded-full"
                    >
                      <div
                        aria-hidden
                        className={`flex items-center justify-center h-10 w-10 rounded-full shadow-sm
                          ${state === "completed" ? "bg-white" : "bg-white"}`}
                      >
                        <AnimatePresence mode="wait">
                          {state === "completed" ? (
                            <motion.span
                              key="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ opacity: 0 }}
                            >
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            </motion.span>
                          ) : isFailure ? (
                            <motion.span
                              key="fail"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <XCircle className="w-6 h-6 text-red-500" />
                            </motion.span>
                          ) : state === "active" ? (
                            <motion.span
                              key="loader"
                              initial={{ rotate: 0 }}
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1 }}
                            >
                              <Loader2 className="w-6 h-6 text-blue-500" />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="icon"
                              initial={{ opacity: 0.6 }}
                              animate={{ opacity: 0.9 }}
                            >
                              <StepIcon className="w-5 h-5 text-gray-400" />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* Right column: titles and descriptions */}
          <div className="flex-1 max-w-[400px]">
            <ol className="space-y-8">
              {STEPS.map((step, idx) => {
                const state =
                  activeIndex === -1
                    ? "pending"
                    : idx < activeIndex
                      ? "completed"
                      : idx === activeIndex
                        ? "active"
                        : "pending"

                const isActive = state === "active"
                const isCompleted = state === "completed"
                const isFailure =
                  (status?.status === "CV_FAILED" && idx === 0) ||
                  (status?.status === "CV_EVALUATION_FAILED" && idx === 3)

                return (
                  <li key={step.key} className="group">
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`p-4 rounded-md transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-2 group-hover:shadow-lg
                        ${isActive ? "bg-blue-50" : "bg-transparent"}`}
                      role="listitem"
                      aria-current={isActive ? "step" : undefined}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className={`font-medium text-sm ${isActive ? "text-blue-800" : "text-gray-800"}`}>
                              {step.title}
                            </h3>
                            {isCompleted && (
                              <span className="text-xs text-green-600">Completed</span>
                            )}
                            {isFailure && (
                              <span className="text-xs text-red-600">Failed</span>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500">{step.desc}</p>
                        </div>

                        {/* small status badge */}
                        <div className="shrink-0">
                          <AnimatePresence>
                            {isActive ? (
                              <motion.div
                                key="active-badge"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 6 }}
                                className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 shadow-sm"
                              >
                                <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                <span className="text-xs text-blue-700">In progress</span>
                              </motion.div>
                            ) : isCompleted ? (
                              <motion.div
                                key="done-badge"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 6 }}
                                className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 shadow-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-700">Done</span>
                              </motion.div>
                            ) : isFailure ? (
                              <motion.div
                                key="fail-badge"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 6 }}
                                className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 shadow-sm"
                              >
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span className="text-xs text-red-700">Failed</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="pending-badge"
                                initial={{ opacity: 0, x: 6 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 6 }}
                                className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 shadow-sm"
                              >
                                <Clock className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs text-yellow-700">Pending</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>

        {/* Small footer message when no status */}
        {!status && (
          <div className="mt-6 text-center text-sm text-gray-500">
            <XCircle className="w-5 h-5 mx-auto text-red-400" />
            <p className="mt-2">Error con el CV</p>
          </div>
        )}
      </div>
  )
}
