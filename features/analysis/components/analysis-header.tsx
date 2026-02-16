"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function AnalysisHeader() {
  return (
    <div className="text-center mb-12">
      {/* Icono con contenedor estilizado Squircle */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-primary/10 border border-primary/20 shadow-lg shadow-primary/5 transition-colors"
      >
        <TrendingUp className="w-8 h-8 text-primary" />
      </motion.div>

      {/* Título con tipografía de alto impacto (Dashboard Style) */}
      <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground mb-4 px-2">
        Análisis de Potencial <span className="text-primary">IA</span>
      </h1>

      {/* Descripción refinada con tokens de texto secundario */}
      <div className="flex flex-col items-center gap-2">
        <p className="max-w-2xl text-sm sm:text-base font-medium text-muted-foreground px-4 leading-relaxed">
          Hemos procesado tu perfil utilizando modelos avanzados de reclutamiento técnico.
          Aquí tienes tus métricas de mercado y optimización.
        </p>

        {/* Badge decorativo de estado técnico */}
        <div className="mt-2 flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
            Reporte Generado con Éxito
          </span>
        </div>
      </div>
    </div>
  )
}
