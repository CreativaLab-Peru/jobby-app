"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CreateCVModal } from "./create-cv-modal"
import { useState } from "react"

interface CVListHeaderProps {
  disabledButton?: boolean
}

export function CVListHeader({ disabledButton }: CVListHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (value: boolean) => {
    if (disabledButton) return
    setIsModalOpen(value)
  }

  return (
    <div className="flex items-center justify-between mb-10 px-8 py-8 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624]/80 dark:via-[#181b2a]/80 dark:to-blue-950/90 shadow-2xl border border-gray-100 dark:border-blue-900 backdrop-blur-md">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-black tracking-tight text-gray-800 dark:text-blue-100 animate-fade-in">
          <span className="ai-gradient-text">Mis CVs</span>
          <span className="ml-2 text-yellow-400 dark:text-yellow-300 animate-bounce-slow">✨</span>
        </h1>
        <p className="text-base text-gray-500 dark:text-blue-300 mt-2 font-medium animate-fade-in">
          Gestiona y visualiza todos tus currículums
        </p>
      </div>

      {/* Action */}
      <CreateCVModal isOpen={isModalOpen} onOpenChange={openModal}>
        <Button
          type="button"
          disabled={disabledButton}
          onClick={() => setIsModalOpen(true)}
          className="relative px-7 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-blue-500 via-blue-400 to-accent shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-glow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:via-blue-500 hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5 md:mr-2 text-white drop-shadow animate-fade-in" />
          <span className="hidden md:inline">Crear nuevo CV</span>
        </Button>
      </CreateCVModal>
    </div>
  )
}
