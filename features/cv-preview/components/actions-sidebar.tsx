"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, Download, Loader2, Sparkles } from "lucide-react"
import { CVData, CVSection } from "@/types/cv"
import { toast } from "sonner"

interface ActionsSidebarProps {
  cvData: CVData
  sections: CVSection[]
  cvId?: string
  onEditCV: () => void
  onHome: () => void
  isDisabled: boolean
  canAnalyze: boolean
  analysisTokens: number
}

export function ActionsSidebar({ 
  cvData, 
  sections, 
  cvId,
  onEditCV, 
  onHome, 
  isDisabled,
  canAnalyze,
  analysisTokens 
}: ActionsSidebarProps) {
  const router = useRouter()
  const [downloading, setDownloading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

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
      toast.error("Error al descargar el PDF")
    } finally {
      setDownloading(false)
    }
  }

  const handleAnalyzeCv = async () => {
    if (!cvId) {
      toast.error("No se encontró el ID del CV")
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || "Error al iniciar el análisis")
        return
      }

      toast.success("¡Análisis iniciado! Redirigiendo...")
      
      // Redirect to the progress/status page for this CV
      router.push(`/cv/${cvId}/analysis`)
    } catch (error) {
      console.error("Error al analizar CV:", error)
      toast.error("Error al iniciar el análisis del CV")
    } finally {
      setAnalyzing(false)
    }
  }

  // Only show analyze button if user has tokens
  const showAnalyzeButton = analysisTokens > 0

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

        {showAnalyzeButton && (
          <Button
            disabled={isDisabled || analyzing || !canAnalyze}
            className="w-full bg-secondary hover:bg-secondary/90"
            onClick={handleAnalyzeCv}
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            {analyzing ? "Analizando..." : "Analizar CV"}
          </Button>
        )}

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
