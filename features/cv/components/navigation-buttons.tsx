"use client"

import { Button } from "@/components/ui/button"

interface NavigationButtonsProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
}

export function NavigationButtons({ currentStep, totalSteps, onPrevious, onNext }: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === totalSteps - 1

  return (
    <div className="flex justify-between">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="border-border bg-transparent text-foreground px-8 cursor-pointer"
      >
        <span>← </span>
        <span className="hidden md:inline-block"></span>
      </Button>

      {/* Botón Siguiente */}
      <Button
        onClick={onNext}
        className="px-8 bg-gradient-primary hover:opacity-90 cursor-pointer text-primary-foreground"
      >
        <span className="hidden md:inline-block">
          {isLastStep ? "Finalizar" : ""}
        </span>
        <span> →</span>
      </Button>
    </div>
  )
}
