"use client"

import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, CheckCircle, Target, Sparkles, TrendingUp } from "lucide-react"

export function Analyzing() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      text: "Analizando tu CV...",
      icon: FileText,
      description: "Revisamos la estructura, formato y contenido general.",
    },
    {
      text: "Evaluando tu perfil profesional...",
      icon: Target,
      description: "Identificamos tus competencias clave y oportunidades de mejora.",
    },
    {
      text: "Optimizando tus experiencias...",
      icon: Sparkles,
      description: "Redactamos descripciones más claras, impactantes y orientadas a resultados.",
    },
    {
      text: "Estructurando la información...",
      icon: TrendingUp,
      description: "Priorizamos lo más relevante para maximizar tu impacto.",
    },
    {
      text: "Finalizando análisis...",
      icon: CheckCircle,
      description: "Preparando tu CV completo",
    },
  ]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 1000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(stepInterval)
          return 100
        }
        return prev + 2
      })
    }, 300)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [steps.length])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Main Loading Animation */}
          <div className="relative mb-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="w-32 h-32 border-4 border-accent/20 border-t-accent rounded-full mx-auto mb-8"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                key={currentStep}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg"
              >
                {React.createElement(steps[currentStep].icon, {
                  className: "w-8 h-8 text-accent-foreground",
                })}
              </motion.div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-secondary rounded-full h-3 mb-4">
              <motion.div
                className="bg-accent h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">{progress}% completado</p>
          </div>

          {/* Current Step */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">{steps[currentStep].text}</h2>
            <p className="text-lg text-muted-foreground mb-8">{steps[currentStep].description}</p>
          </motion.div>

          {/* Animated Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                className="w-3 h-3 bg-accent/40 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
