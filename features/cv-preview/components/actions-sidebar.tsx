"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, Download, Loader2 } from "lucide-react"
import { CVData, CVSection } from "@/types/cv"

interface ActionsSidebarProps {
  cvData: CVData
  sections: CVSection[]
  onEditCV: () => void
  onHome: () => void
  isDisabled: boolean
}

export function ActionsSidebar({ cvData, sections, onEditCV, onHome, isDisabled }: ActionsSidebarProps) {
  const [downloading, setDownloading] = useState(false)

  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      const { pdf } = await import("@react-pdf/renderer")
      const { CvDocument } = await import("@/components/pdf-preview/cv-document")
      
      const blob = await pdf(<CvDocument data={cvData} sections={sections} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${cvData.personal.fullName || "mi-cv"}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al descargar PDF:", error)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4 text-card-foreground">
        <h3 className="text-xl font-semibold mb-2">
          Acciones
        </h3>

        <Button
          disabled={isDisabled || downloading}
          className="w-full bg-primary hover:bg-primary/90"
          onClick={handleDownloadPdf}
        >
          {downloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {downloading ? "Descargando..." : "Descargar PDF"}
        </Button>

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
