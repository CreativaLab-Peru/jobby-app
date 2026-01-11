"use client"

import { motion } from "framer-motion"
import { ShieldAlert, RefreshCcw, Home, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
                                      error,
                                      reset,
                                    }: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es" className="dark">
    <body className="bg-background text-foreground antialiased">
    <div className="min-h-screen flex items-center justify-center relative px-4">
      {/* Fondo con efecto de interferencia AI */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,transparent_50%)] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full z-10"
      >
        <div className="text-center space-y-8">
          {/* Icono de Error Estilo Levely */}
          <div className="relative inline-block">
            <motion.div
              animate={{
                rotateY: [0, 180, 360],
                boxShadow: ["0 0 20px rgba(var(--primary), 0.2)", "0 0 40px rgba(var(--primary), 0.5)", "0 0 20px rgba(var(--primary), 0.2)"]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-3xl bg-card border-2 border-border flex items-center justify-center relative z-10"
            >
              <ShieldAlert className="w-12 h-12 text-primary" />
            </motion.div>
            <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
          </div>

          {/* Mensaje de Error */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">
              Sistema <span className="ai-gradient-text text-white">Interrumpido</span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              La IA ha detectado una anomalía crítica en el flujo de datos. No te preocupes, el explorador sigue a salvo.
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={reset}
              size="lg"
              className="h-14 px-8 ai-gradient text-white font-black uppercase tracking-widest border-none shadow-glow hover:scale-105 transition-all"
            >
              <RefreshCcw className="w-5 h-5 mr-2" />
              Reiniciar Núcleo
            </Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "/dashboard")}
              size="lg"
              className="h-14 px-8 border-2 font-black uppercase tracking-widest hover:bg-muted"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al Inicio
            </Button>
          </div>

          {/* Debug Section (Console Style) */}
          {(process.env.NODE_ENV === "development" || true) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 text-left"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl">
                <div className="bg-muted px-4 py-2 flex items-center gap-2 border-b border-border">
                  <Terminal className="w-4 h-4 text-secondary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Log de Error Crítico</span>
                </div>
                <div className="p-6 font-mono text-xs space-y-2 overflow-auto max-h-[200px]">
                  <p className="text-red-400 font-bold tracking-tight">{error.name}: {error.message}</p>
                  {error.digest && (
                    <p className="text-muted-foreground">ID_SESION: <span className="text-secondary">{error.digest}</span></p>
                  )}
                  <p className="text-[10px] text-muted-foreground/50 italic leading-relaxed">
                    Timestamp: {new Date().toISOString()}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
    </body>
    </html>
  )
}
