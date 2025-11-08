"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Users, Target } from "lucide-react"

interface ActionButtonsProps {
  show: boolean
}

export function ActionButtons({ show }: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: show ? 1 : 0, y: 0 }}
      transition={{ delay: 0.6, duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
    >
      <Button
        size="lg"
        className="px-8 py-4 text-lg bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
      >
        <Users className="w-5 h-5 mr-2" />
        Potenciarme con un Experto
      </Button>
      <Button size="lg" className=" px-8 py-4 text-lg border-2 bg-transparent">
        <Target className="w-5 h-5 mr-2" />
        Ver más Oportunidades
      </Button>
    </motion.div>
  )
}
