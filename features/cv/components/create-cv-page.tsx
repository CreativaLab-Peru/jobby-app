"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, CloudCheck, CloudUpload } from "lucide-react"
import {getSections} from "@/features/cv/helpers";
import { NavigationButtons } from "@/features/cv/components/navigation-buttons"
import { CVSectionForm, CVSectionFormRef } from "@/features/cv/components/cv-section-form"
import { CVPreview } from "@/features/cv/components/cv-preview"
import { CVData } from "@/types/cv";
import { updateCvAndSections } from "@/features/cv/actions/update-cv-and-sections";
import { OpportunityType, CvType } from "@prisma/client"
import {routes} from "@/lib/routes";
import { toast } from "sonner";

interface CreateCVPageProps {
  cv: CVData
  id: string
  opportunityType: OpportunityType
  cvType: CvType
  saveCv?: (id: string, cvData: CVData) => Promise<{ success: boolean; message?: string; error?: string } | null>
  onCompletePath?: string
}

export default function CreateCVPage({ cv, id, opportunityType, cvType, saveCv, onCompletePath }: CreateCVPageProps) {
  const [cvData, setCvData] = useState<CVData>(cv)
  const [activeSection, setActiveSection] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const formRef = useRef<CVSectionFormRef>(null)

  const sections = getSections(opportunityType, cvType)

  const submit = async () => {
    if (isSaving) return false

    setIsSaving(true)
    try {
      const saveAction = saveCv ?? updateCvAndSections
      const result = await saveAction(id, cvData)

      if (result?.success) {
        return true
      } else {
        const errorMsg = result?.message || "Error desconocido al guardar"
        console.error("Failed to save CV:", errorMsg)
        toast.error(errorMsg)
        return false
      }
    } catch (error) {
      const errorMsg = error?.message || "Error al guardar el CV"
      console.error("Error saving CV:", error)
      toast.error(errorMsg)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleNext = async () => {
    // Validar campos obligatorios antes de avanzar
    const isValid = formRef.current?.validate()

    if (!isValid) {
      // Si hay campos requeridos incompletos, NO avanzar
      // El validador ya mostró el toast.error
      return
    }

    // Guardado en background - no bloquea navegación
    submit()

    // Navegar a la siguiente sección
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
    } else {
      // En la última sección, esperar guardado antes de ir a preview
      const saved = await submit()
      if (saved) {
        if (onCompletePath) {
          router.push(onCompletePath)
        } else {
          router.push(routes.app.cv.preview(id))
        }
      }
    }
  }

  const handlePrevious = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1)
    }
  }

  const updateCVData = useCallback((sectionId: string, data: Record<string, unknown>) => {
    setCvData((prev) => ({
      ...prev,
      [sectionId]: data,
    }))
  }, [])

  const currentSection = sections[activeSection]

  return (
    // CAMBIO: Fondo usando la variable de background y un toque sutil de tu gradiente IA
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decoración de fondo sutil para dar profundidad */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none ai-gradient" />

      <div className="container py-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">

          <div className={`grid gap-6 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>

            {/* Form Section */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* CAMBIO: Card con shadow-card y border-border */}
                  <Card className="shadow-card border-border bg-card/50 backdrop-blur-md">
                    <CardHeader className="border-b border-border/50">
                      <CardTitle className="flex items-center text-2xl text-foreground">
                        <div className="flex items-center flex-1">
                          {(() => {
                            const Icon = currentSection.icon
                            return <Icon className="w-8 h-8 mr-3 text-primary" />
                          })()}
                          <span className="font-bold text-primary">{currentSection.title}</span>
                        </div>
                        <NavigationButtons
                          currentStep={activeSection}
                          totalSteps={sections.length}
                          onPrevious={handlePrevious}
                          onNext={handleNext}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <CVSectionForm
                        ref={formRef}
                        section={currentSection}
                        data={cvData[currentSection.id] || {}}
                        onChange={(data) => updateCVData(currentSection.id, data)}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Section */}
            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="sticky top-8"
                >
                  {/* CAMBIO: Card de Preview más limpia con el sistema de marca */}
                  <Card className="shadow-card border-border bg-card overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-border">
                      <CardTitle className="flex items-center text-lg text-primary">
                        <Eye className="w-5 h-5 mr-2 text-primary" />
                        Vista Previa

                        <div className="ml-auto">
                          {isSaving ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-primary animate-pulse">
                              <CloudUpload className="w-4 h-4" />
                              Sincronizando...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-xs font-medium text-primary">
                              <CloudCheck className="w-4 h-4" />
                              Cambios guardados
                            </div>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 bg-white">
                      {/* Nota: CVPreview suele requerir fondo blanco para simular papel A4,
                          pero el contenedor es el que respeta el modo oscuro */}
                      <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
                        <CVPreview data={cvData} sections={sections} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
