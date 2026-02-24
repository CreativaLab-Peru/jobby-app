"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, Rocket, Sparkles } from "lucide-react"

export function StickyActionButtons() {

  const handleGoCreativaAcademy = () => {
    window.open("https://academy.joinlevely.com/auth/login", "_blank");
  };

  // /career-accelerator
  const handleGoCareerAccelerator = () => {
    window.open("https://joinlevely.com/career-accelerator", "_blank");
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.9 }}
        className="flex px-4 flex justify-center"
      >
        {/* Contenedor con resplandor externo */}
        <motion.div
          className="relative group w-full max-w-md"
          animate={{
            boxShadow: ["0px 0px 0px rgba(var(--primary), 0)", "0px 0px 25px rgba(var(--primary), 0.4)", "0px 0px 0px rgba(var(--primary), 0)"]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Capa de brillo decorativa detrás del botón */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-blue-400 to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

          <Button
            size="lg"
            onClick={handleGoCreativaAcademy}
            className="relative w-full h-16 text-lg font-bold bg-primary text-primary-foreground rounded-2xl border border-primary/20 shadow-2xl overflow-hidden transition-all duration-300"
          >
            {/* Reflejo de luz que pasa sobre el botón (Efecto Shine) */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
              className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />

            <div className="flex items-center justify-center gap-3">
              <div className="p-2 bg-primary-foreground/10 rounded-lg">
                <Users className="w-6 h-6" />
              </div>

              <span className="tracking-tight">Potenciarme con un Experto</span>

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 15, -15, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              </motion.div>
            </div>
          </Button>
            <Button
              size="lg"
              onClick={handleGoCareerAccelerator}
              className="relative w-full mt-4 h-16 text-lg font-bold bg-secondary text-secondary-foreground rounded-2xl border border-secondary/20 shadow-2xl overflow-hidden transition-all duration-300 hover:bg-secondary/90 hover:shadow-2xl hover:border-primary/40"
            >
              {/* Reflejo de luz que pasa sobre el botón (Efecto Shine) */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: "linear" }}
                className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
              />

              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-secondary-foreground/10 rounded-lg">
                  <Rocket className="w-6 h-6" />
                </div>

                <span className="tracking-tight">Impulsar mi Carrera</span>

                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </motion.div>
              </div>
            </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
