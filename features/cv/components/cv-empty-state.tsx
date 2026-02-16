"use client"

import { motion } from "framer-motion"
import { Sparkles, PlusCircle } from "lucide-react"

export function CVEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-card border-2 border-primary/20 shadow-xl">
          <Sparkles className="h-12 w-12 text-primary animate-pulse" />
        </div>
      </div>

      <h3 className="text-3xl font-black tracking-tight text-foreground mb-3">
        Tu futuro empieza aquí 🚀
      </h3>

      <p className="text-muted-foreground max-w-xs font-medium leading-relaxed">
        Aún no tienes currículums. ¡Crea el primero y deja que la IA haga su magia!
      </p>
    </motion.div>
  )
}
