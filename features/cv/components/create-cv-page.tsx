"use client"

import { useState, useCallback, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { getSections } from "@/lib/cv-sections"
import { NavigationButtons } from "@/features/cv/components/navigation-buttons"
import { CVSectionForm } from "@/features/cv/components/cv-section-form"
import { CVPreview } from "@/features/cv/components/cv-preview"
import { CVData } from "@/types/cv";
import { updateCvAndSections } from "@/features/cv/actions/update-cv-and-sections";
import { OpportunityType, CvType } from "@prisma/client"

interface CreateCVPageProps {
  cv: CVData
  id: string
  opportunityType: OpportunityType
  cvType: CvType
}

export default function CreateCVPage({ cv, id, opportunityType, cvType }: CreateCVPageProps) {
  const [cvData, setCvData] = useState<CVData>(cv)
  const [activeSection, setActiveSection] = useState(0)
  const [showPreview, setShowPreview] = useState(true)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const sections = getSections(opportunityType, cvType)
  const submit = () => {
    if (isPending) return
    startTransition(() => {
      updateCvAndSections(id, cvData).then((result) => {
        if (result?.success) {
          console.log("CV saved successfully")
        } else {
          console.error("Failed to save CV:", result?.message)
        }
      })
    })
  }

  const handleNext = () => {
    submit()
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
    } else {
      router.push(`/cv/${id}/preview`)
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
    <div className="h-full bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className={`grid gap-4 ${showPreview ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
            {/* Form Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                {/* <ProgressBar currentStep={activeSection} totalSteps={sections.length} />   */}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                    <CardHeader>
                      {/* Render the icon as a JSX component instead of invoking it like a function */}
                      <CardTitle className="flex items-center text-2xl text-gray-800">
                        <div className="flex items-center flex-1">
                          {/**
                         * Guardamos el componente en una variable para usarlo en JSX.
                         * Esto evita el error “icon is not a function”.
                         */}
                          {(() => {
                            const Icon = currentSection.icon
                            return <Icon className="w-8 h-8 mr-3 text-blue-500" />
                          })()}
                          {currentSection.title}
                        </div>
                        <NavigationButtons
                          currentStep={activeSection}
                          totalSteps={sections.length}
                          onPrevious={handlePrevious}
                          onNext={handleNext}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CVSectionForm
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
                  <Card className="shadow-xl border-0 bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl text-gray-800">
                        <Eye className="w-6 h-6 mr-2 text-green-500" />
                        Vista Previa del CV
                        <div className="ml-auto flex items-center">
                          {isPending ? (
                            <span className="ml-2 text-sm text-yellow-500 animate-pulse border-yellow-500">
                              Guardando...
                            </span>
                          ) : (
                            <span className="ml-2 text-sm text-green-500">
                              Guardado
                            </span>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[85vh] overflow-y-auto">
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
