"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { ActionsSidebar } from "@/features/cv-preview/components/actions-sidebar"
import { TipCard } from "@/features/cv-preview/components/tip-card"
import { CVData } from "@/types/cv"
import { PdfPreviewWrapper } from "@/components/pdf-preview/pdf-preview-wrapper"
import { OpportunityType, CvType } from "@prisma/client"
import {getSections} from "@/features/cv/helpers";

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
  const router = useRouter()
  const safeSectionIds = Array.isArray(sectionIds) ? sectionIds : []

  // Regenerar las secciones en el cliente usando los IDs
  const sections = useMemo(() => {
    const allSections = getSections(opportunityType, cvType, templateId)
    if (!allSections.length) return []

    // Fallback: if section IDs are not present, render the default section order.
    if (!safeSectionIds.length) return allSections

    const sectionMap = new Map(allSections.map((section) => [section.id, section]))
    const mappedSections = safeSectionIds
      .map((id) => sectionMap.get(id))
      .filter(Boolean) as typeof allSections

    return mappedSections.length ? mappedSections : allSections
  }, [opportunityType, cvType, safeSectionIds, templateId])

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-4 gap-8">
            {/* CV Preview */}
            <div className="lg:col-span-3">
              <Card className="shadow-card border-0 bg-card">
                <CardContent className="p-0 text-card-foreground">
                  <PdfPreviewWrapper cvData={cvData} sections={sections} templateId={templateId} />
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
                templateId={templateId}
                canAnalyze={canAnalyze}
                analysisTokens={analysisTokens}
                opportunitiesActionTokens={opportunitiesActionTokens}
                onHome={() => router.push('/dashboard')}
                onEditCV={() => router.push(cvId ? `/cv/${cvId}/edit` : '/my-cv')}
              />
              <TipCard opportunityType={opportunityType} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
