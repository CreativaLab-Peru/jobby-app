"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ActionsSidebar } from "@/features/cv-preview/components/actions-sidebar"
import { TipCard } from "@/features/cv-preview/components/tip-card"
import { CVData } from "@/types/cv"
import { PdfPreviewWrapper } from "@/components/pdf-preview/pdf-preview-wrapper"
import { OpportunityType, CvType } from "@prisma/client"
import {getSections} from "@/features/cv/helpers";
import { updateCvTemplate } from "@/features/cv/actions/update-cv-template"
import { toast } from "sonner";

interface PreviewCVComponentProps {
  cv: CVData
  cvId?: string
  opportunityType: OpportunityType
  cvType: CvType
  templateId?: string
  sectionIds: string[]
  canAnalyze: boolean
  analysisTokens: number
  opportunitiesActionTokens?: number
}

export function PreviewCVComponent({
  cv: cvData,
  cvId,
  opportunityType,
  cvType,
  templateId = "harvard",
  sectionIds,
  canAnalyze,
  analysisTokens,
  opportunitiesActionTokens = 0
}: PreviewCVComponentProps) {
  const [isDisabled] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState<string>(templateId)
  const router = useRouter()

  const handleTemplateChange = async (newTemplate: string) => {
    setActiveTemplate(newTemplate)
    if (cvId) {
      try {
        const result = await updateCvTemplate(cvId, newTemplate)
        if (!result.success) {
          toast.error(result.message || "Error actualizando el template")
        }
      } catch (error) {
        toast.error("Error al cambiar el template")
      }
    }
  }

  // Regenerar las secciones en el cliente usando los IDs
  const sections = useMemo(() => {
    const allSections = getSections(opportunityType, cvType);
    const sectionMap = new Map(allSections.map(s => [s.id, s]));
    return sectionIds.map(id => sectionMap.get(id)).filter(Boolean) as typeof allSections;
  }, [opportunityType, cvType, sectionIds]);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Template Selector */}
          {(opportunityType === OpportunityType.INTERNSHIP || opportunityType === OpportunityType.SCHOLARSHIP) && (
            <div className="mb-6 p-4 rounded-lg bg-card border border-border/50 backdrop-blur-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Diseño del CV
              </label>
              <Select value={activeTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-full sm:w-64 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border-border">
                  <SelectItem value="harvard">Harvard (Clásico)</SelectItem>
                  <SelectItem value="europass">Europass Modern</SelectItem>
                  <SelectItem value="stem">Investigador STEM</SelectItem>
                  <SelectItem value="fullbright">Líder Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* CV Preview */}
            <div className="lg:col-span-3">
              <Card className="shadow-card border-0 bg-card">
                <CardContent className="p-0 text-card-foreground">
                  <PdfPreviewWrapper cvData={cvData} sections={sections} templateId={activeTemplate} />
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              <ActionsSidebar
                isDisabled={isDisabled}
                cvData={cvData}
                sections={sections}
                cvId={cvId}
                templateId={activeTemplate}
                canAnalyze={canAnalyze}
                analysisTokens={analysisTokens}
                opportunitiesActionTokens={opportunitiesActionTokens}
                onHome={() => router.push('/cv')}
                onEditCV={() => router.push(`/cv/${cvId}/edit`)}
              />
              <TipCard opportunityType={opportunityType} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
