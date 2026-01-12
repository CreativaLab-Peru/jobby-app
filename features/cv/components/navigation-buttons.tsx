"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  isLoading?: boolean // Agregamos estado de carga por buenas prácticas
}

export function NavigationButtons({
                                    currentStep,
                                    totalSteps,
                                    onPrevious,
                                    onNext,
                                    isLoading = false
                                  }: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex items-center justify-between gap-4 mt-8">
      {/* Botón Anterior: Estilo minimalista pero profesional */}
      <Button
        variant="ghost"
        onClick={onPrevious}
        disabled={isFirstStep || isLoading}
        className={cn(
          "font-bold uppercase tracking-widest text-xs transition-all",
          "hover:bg-muted border-none",
          isFirstStep && "opacity-0 pointer-events-none" // Desaparece en el primer paso para limpiar la UI
        )}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
      </Button>

      {/* Botón Siguiente / Finalizar: El Call to Action principal */}
      <Button
        onClick={onNext}
        size={"icon"}
        disabled={isLoading}
        className={cn(
          "h-12 px-8 font-black uppercase tracking-widest text-xs rounded-xl transition-all duration-300",
          "border-none text-white shadow-glow",
          isLastStep
            ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20" // Color verde lima para finalizar
            : "ai-gradient hover:scale-[1.02] active:scale-95" // Gradiente de marca para avanzar
        )}
      >
        <span className="flex items-center gap-2">
          {isLastStep ? (
            <>
              <CheckCircle2 className="w-4 h-4 fill-current" />
            </>
          ) : (
            <>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </span>
      </Button>
    </div>
  )
}
