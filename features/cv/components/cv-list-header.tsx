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
    <div className="flex items-center justify-between mb-10">
      {/* Title */}
      <div>
        <h1 className="text-4xl font-bold">
          <span className="text-gradient">Mis CVs</span> ✨
        </h1>
        <p className="text-muted-foreground mt-2">
          Gestiona y visualiza todos tus currículums
        </p>
      </div>

      {/* Action */}
      <CreateCVModal isOpen={isModalOpen} onOpenChange={openModal}>
        <Button
          type="button"
          disabled={disabledButton}
          onClick={() => setIsModalOpen(true)}
          className="
            relative
            shadow-glow
            transition-all duration-300
            hover:-translate-y-0.5
            hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Plus className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Crear nuevo CV</span>
        </Button>
      </CreateCVModal>
    </div>
  )
}
