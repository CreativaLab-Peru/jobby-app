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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 bg-clip-text text-transparent">
          Mis CVs ✨
        </h1>
        <p className="text-gray-600 mt-2">Gestiona y visualiza todos tus currículums</p>
      </div>
      <CreateCVModal
        isOpen={isModalOpen}
        onOpenChange={openModal}>
        <Button
          onChange={() => setIsModalOpen(true)}
          disabled={disabledButton}
          className="
                bg-gradient-to-r from-emerald-400 to-blue-500
                hover:from-emerald-500 hover:to-blue-600
                shadow-lg hover:shadow-xl
                transition-all duration-300
                transform hover:scale-105
                cursor-pointer
              "
        >
          <Plus className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Crear Nuevo CV</span>
        </Button>
        {/*<Tooltip delayDuration={80}>*/}
        {/*  <TooltipTrigger asChild>*/}
        {/*    */}
        {/*  </TooltipTrigger>*/}

        {/*  <TooltipContent*/}
        {/*    side="top"*/}
        {/*    className="text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-md shadow-xl border border-white/10"*/}
        {/*  >*/}
        {/*    Requiere <span className="font-semibold text-emerald-300">1 Token</span>*/}
        {/*  </TooltipContent>*/}
        {/*</Tooltip>*/}

      </CreateCVModal>
    </div>
  )
}
