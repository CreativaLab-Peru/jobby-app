"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home } from "lucide-react"
import { CVData } from "@/types/cv"

interface ActionsSidebarProps {
  cvData: CVData
  onEditCV: () => void
  onHome: () => void
  isDisabled: boolean
}

export function ActionsSidebar({ onEditCV, onHome, isDisabled }: ActionsSidebarProps) {
  return (
    <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4 text-card-foreground">
        <h3 className="text-xl font-semibold mb-2">
          Acciones
        </h3>

        <Button
          disabled={isDisabled}
          variant="outline"
          className="w-full bg-transparent border-border text-foreground hover:bg-muted"
          onClick={onHome}
        >
          <Home className="w-4 h-4 mr-2" />
          Home
        </Button>

        <Button
          disabled={isDisabled}
          variant="outline"
          className="w-full bg-transparent border-border text-foreground hover:bg-muted"
          onClick={onEditCV}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Editar CV
        </Button>
      </CardContent>
    </Card>
  )
}
