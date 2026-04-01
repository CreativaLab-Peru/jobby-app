"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {ArrowLeft, Home, Download, Loader2, Sparkles, Rocket, Edit, Languages, FileText} from "lucide-react"
import { CVData, CVSection } from "@/types/cv"
import { toast } from "sonner"
import { useCreditsStore } from "@/store/use-credits-store"
import {ConfirmModal} from "@/components/shared/confirm-modal";
import {Language} from "@prisma/client";
import {updateCvLanguage} from "@/features/cv/actions/update-cv-language";
import {cn} from "@/lib/utils";

interface ActionsSidebarProps {
  cvData: CVData
  sections: CVSection[]
  cvId?: string
  templateId?: string
  onEditCV: () => void
  onHome: () => void
  isDisabled: boolean
  canAnalyze: boolean
  analysisTokens: number
  opportunitiesActionTokens?: number
  language: Language
}

const SUPPORTED_LANGUAGES = [
  { label: "ES", value: Language.ES },
  { label: "EN", value: Language.EN },
];

export function ActionsSidebar({
  cvData,
  sections,
  cvId,
  templateId = "harvard",
  onEditCV,
  onHome,
  isDisabled,
  canAnalyze,
  analysisTokens,
  opportunitiesActionTokens = 0,
  language = Language.ES
}: ActionsSidebarProps) {
  const isEn = language === Language.EN;
  const [downloading, setDownloading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [matching, setMatching] = useState(false)
  const router = useRouter()
  const { refreshCredits } = useCreditsStore();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [updatingLang, setUpdatingLang] = useState(false);
  const [lang, setLang] = useState<Language>(language);

  const handleLanguageChange = async (newLang: Language) => {
    if (!cvId || newLang === lang) return;

    setUpdatingLang(true);
    const result = await updateCvLanguage(cvId, newLang);

    if (result.success) {
      setLang(newLang);
      toast.success(isEn ? `Language changed to ${newLang}` : `Idioma cambiado a ${newLang}`);
    } else {
      toast.error(isEn ? "Could not change language" : "No se pudo cambiar el idioma");
    }
    setUpdatingLang(false);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true)
    try {
      const { pdf } = await import("@react-pdf/renderer")
      const { CvDocument } = await import("@/components/pdf-preview/cv-document")
      const { CvDocumentEuropass } = await import("@/components/pdf-preview/cv-document-europass")

      // Seleccionar el componente correcto basado en el template
      const DocumentComponent = templateId === "europass"
        ? CvDocumentEuropass
        : CvDocument

      const blob = await pdf(
        <DocumentComponent
          data={cvData}
          sections={sections}
          lang={language}
        />).toBlob()
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

      toast.success(isEn ? "Analysis started! Redirecting..." : "¡Análisis iniciado! Redirigiendo...")

      // Refresh credits after analysis
      await refreshCredits();

      // Redirect to the progress/status page for this CV
      router.push(`/cv/${cvId}/analysis`)
    } catch (error) {
      console.error("Error al analizar CV:", error)
      toast.error(isEn ? "Error starting CV analysis" : "Error al iniciar el análisis del CV")
    } finally {
      setAnalyzing(false)
    }
  }

  const handleQuickMatch = async () => {
    if (!cvId) {
      toast.error(isEn ? "CV ID not found" : "No se encontró el ID del CV")
      return
    }

    // Validar que tenga créditos antes de proceder
    if (opportunitiesActionTokens <= 0) {
      toast.error(isEn ? "You have no credits available to match opportunities" : "No tienes créditos disponibles para hacer match de oportunidades")
      return
    }

    setMatching(true)
    try {
      const response = await fetch("/api/opportunities/quick-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || (isEn ? "Error starting opportunity matching" : "Error al iniciar el match de oportunidades"))
        return
      }

      toast.success(isEn ? "Matching started! Redirecting..." : "¡Match iniciado! Redirigiendo...")

      // Refresh credits after match
      await refreshCredits()

      // Redirect to opportunities page for this CV
      router.push(`/opportunities/cv/${cvId}/analysis`)
    } catch (error) {
      console.error("Error al hacer match:", error)
      toast.error(isEn ? "Error starting opportunity matching" : "Error al iniciar el match de oportunidades")
    } finally {
      setMatching(false)
    }
  }

  // Only show analyze button if user has tokens
  const showAnalyzeButton = analysisTokens > 0
  const showMatchButton = opportunitiesActionTokens > 0;

  const handleConfirm = async () => {
    if (title.includes("Análisis")) {
      await handleAnalyzeCv()
    } else if (title.includes("Match")) {
      await handleQuickMatch()
    }
    setIsOpen(false)
  }

  const handleExecuteAction = (actionType: "analyze" | "match") => {
    if (actionType === "analyze") {
      setTitle(isEn ? "Confirm Analysis" : "Confirmar Análisis")
      setDescription(isEn ? "Are you sure you want to analyze this CV? This will consume 1 analysis credit." : "¿Estás seguro de que quieres analizar este CV? Esto consumirá 1 crédito de análisis.")
      setIsOpen(true)
    } else if (actionType === "match") {
      setTitle(isEn ? "Confirm Match" : "Confirmar Match")
      setDescription(isEn ? "Are you sure you want to match opportunities for this CV? This will consume 1 opportunities credit." : "¿Estás seguro de que quieres hacer match de oportunidades para este CV? Esto consumirá 1 crédito de oportunidades.")
      setIsOpen(true)
    }
  }

  return (
    <>
      <Card className="shadow-card border-0 bg-card/90 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4 text-card-foreground">
          <h3 className="text-xl font-semibold mb-2">
            {isEn ? "Actions" : "Acciones"}
          </h3>


          <Button
            disabled={isDisabled}
            variant={'secondary'}
            className="w-full mb-2"
            onClick={onHome}
          >
            <Home className="w-4 h-4 mr-2" />
            {isEn ? "My progress" : "Mi progreso"}
          </Button>

          {/* <Button
            variant="secondary"
            className="w-full mb-2"
            onClick={() => { window.location.href = '/my-cvs'; }}
          >
            <FileText className="w-4 h-4 mr-2" />
            Ver todos mis CVs
          </Button> */}

          <Button
            disabled={isDisabled}
            variant={'secondary'}
            className="w-full"
            onClick={onEditCV}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEn ? "Edit" : "Editar"}
          </Button>

          <Button
            disabled={isDisabled || downloading}
            className="w-full"
            variant={'secondary'}
            onClick={handleDownloadPdf}
          >
            {downloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {downloading ? (isEn ? "Downloading..." : "Descargando...") : (isEn ? "Download PDF" : "Descargar PDF")}
          </Button>

          {showAnalyzeButton && (
            <Button
              disabled={isDisabled || analyzing || !canAnalyze}
              className="w-full"
              onClick={()=>handleExecuteAction("analyze")}
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {analyzing ? (isEn ? "Analyzing..." : "Analizando...") : (isEn ? "Analyze CV" : "Analizar CV")}
            </Button>
          )}

          {/*{showMatchButton && (*/}
          {/*  <Button*/}
          {/*    disabled={isDisabled || matching}*/}
          {/*    className="w-full"*/}
          {/*    onClick={()=>handleExecuteAction("match")}*/}
          {/*  >*/}
          {/*    {matching ? (*/}
          {/*      <Loader2 className="w-4 h-4 mr-2 animate-spin" />*/}
          {/*    ) : (*/}
          {/*      <Rocket className="w-4 h-4 mr-2" />*/}
          {/*    )}*/}
          {/*    {matching ? "Buscando..." : "Hacer Match"}*/}
          {/*  </Button>*/}
          {/*)}*/}

          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm flex items-center gap-2">
                <Languages className="w-3 h-3" /> {isEn ? "My CV language is" : "El idioma de mi cv esta en"}
              </label>
              {updatingLang && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </div>

            <div className="flex p-1 bg-secondary/50 rounded-lg border border-border">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.value}
                  disabled={isDisabled || updatingLang}
                  onClick={() => handleLanguageChange(item.value)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-bold rounded-md transition-all",
                    lang === item.value
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmModal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        title={title}
        description={description}
        onConfirm={handleConfirm}
        variant={'default'}
      />
    </>
  )
}
