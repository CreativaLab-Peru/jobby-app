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
import { getSections } from "@/lib/cv-sections"

interface PreviewCVComponentProps {
  cv: CVData
  cvId?: string
  opportunityType: OpportunityType
  cvType: CvType
  sectionIds: string[]
}

export function PreviewCVComponent({ cv: cvData, cvId, opportunityType, cvType, sectionIds }: PreviewCVComponentProps) {
  const [isDisabled] = useState(false)
  const router = useRouter()

  // Regenerar las secciones en el cliente usando los IDs
  const sections = useMemo(() => {
    const allSections = getSections(opportunityType, cvType);
    return allSections.filter(s => sectionIds.includes(s.id));
  }, [opportunityType, cvType, sectionIds]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* CV Preview */}
            <div className="lg:col-span-3">
              <Card className="shadow-xl border-0 bg-white">
                <CardContent className="p-0">
                  <PdfPreviewWrapper cvData={cvData} sections={sections} />
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              <ActionsSidebar
                isDisabled={isDisabled}
                cvData={cvData}
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
