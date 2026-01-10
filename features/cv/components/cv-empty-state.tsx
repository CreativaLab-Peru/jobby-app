"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"

export function CVEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileText className="h-8 w-8 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No tienes CVs creados
      </h3>

      <p className="text-muted-foreground max-w-sm mx-auto">
        Comienza creando tu primer currículum y deja que la IA optimice tu perfil
        profesional.
      </p>
    </motion.div>
  )
}
