"use client"

import {useState, useMemo} from "react"
import {motion} from "framer-motion"
import {useRouter} from "next/navigation"
import {Card, CardContent} from "@/components/ui/card"
import {ActionsSidebar} from "@/features/cv-preview/components/actions-sidebar"
import {TipCard} from "@/features/cv-preview/components/tip-card"
import {CVData} from "@/types/cv"
import {PdfPreviewWrapper} from "@/components/pdf-preview/pdf-preview-wrapper"
import {OpportunityType, CvType} from "@prisma/client"
import {OPPORTUNITY_MAP} from "@/const";

interface PreviewCVComponentProps {
  cv: CVData
  cvId?: string
  opportunityType: OpportunityType
  cvType: CvType
  templateId?: string
  canAnalyze: boolean
  analysisTokens: number
  opportunitiesActionTokens?: number
  language?: 'ES' | 'EN'
  masterSections: any[]
}

const SECTION_ID_TO_CV_KEY: Record<string, keyof CVData> = {
  CONTACT: "personal",
  EXPERIENCE: "experience",
  EDUCATION: "education",
  PROJECTS: "projects",
  ACHIEVEMENTS: "achievements",
  SKILLS: "skills",
  CERTIFICATIONS: "certifications",
  VOLUNTEERING: "volunteering",
}

function getCvDataKey(sectionId: string): keyof CVData {
  const normalizedId = String(sectionId || "").toUpperCase()
  return SECTION_ID_TO_CV_KEY[normalizedId] ?? (String(sectionId || "").toLowerCase() as keyof CVData)
}

export function PreviewCVComponent({
                                     cv: cvData,
                                     cvId,
                                     opportunityType,
                                     cvType,
                                     templateId = "harvard",
                                     canAnalyze,
                                     analysisTokens,
                                     opportunitiesActionTokens = 0,
                                     language = 'ES',
                                     masterSections
                                   }: PreviewCVComponentProps) {
  const [isDisabled] = useState(false)
  const router = useRouter()

  // Regenerar las secciones en el cliente usando los IDs
  const sections = useMemo(() => {
    // 1. Usar siempre masterSections porque tiene los IDs de la DB (CONTACT, etc.)
    if (!masterSections || masterSections.length === 0) return [];

    return masterSections.map((sectionConfig) => {
      // 2. Traducir ID de DB (ej: CONTACT) a key de DTO (ej: personal)
      // console.log("[sectionConfig]", sectionConfig);
      const dataKey = getCvDataKey(sectionConfig.id);
      // console.log("[dataKey]", dataKey);
      const sectionData = cvData[dataKey];

      // Log para verificar qué está pasando con cada sección (puedes quitarlo luego)
      // console.log(`Mapping ${sectionConfig.id} to cvData[${dataKey}]`, sectionData);

      return {
        ...sectionConfig,
        data: sectionData || {},
        id: dataKey,
      };
    }).filter(s => {
      // 3. Lógica de visibilidad (No mostrar secciones vacías)
      if (s.id === "CONTACT") return true;

      const data = s.data;
      if (!data) return false;

      // Si es una sección con items (Education, Experience, etc.)
      if (data.items && Array.isArray(data.items)) {
        return data.items.length > 0;
      }

      // Si es Skills
      if (s.id === "SKILLS") {
        return (data.technical?.length > 0 || data.soft?.length > 0);
      }

      // Si es un campo directo (como el summary que a veces viene en personal)
      return Object.keys(data).length > 0;
    });
  }, [masterSections, cvData]);

  const opportunityMapped = OPPORTUNITY_MAP[opportunityType] || "No especificado";

  const activeTips = useMemo(() => {
    const tips = [
      {
        id: "opt",
        description: "Tu CV está optimizado para",
        highlight: opportunityMapped,
        footer: ". El análisis te mostrará cómo mejorarlo aún más."
      }
    ];

    if (language === 'EN') {
      tips.push({
        id: "lang",
        description: "Hemos detectado que tu CV está en",
        highlight: "Inglés",
        footer: ". Esto aumenta tus posibilidades en vacantes internacionales."
      });
    }

    return tips;
  }, [language, opportunityMapped]);

  console.log("[FINAL_SECTIONS_READY]", sections);
  console.log("[CVDATA_STRUCTURE]", cvData);

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          className="max-w-6xl mx-auto"
        >
          <div className="grid lg:grid-cols-4 gap-8">
            {/* CV Preview */}
            <div className="lg:col-span-3">
              <Card className="shadow-card border-0 bg-card">
                <CardContent className="p-0 text-card-foreground">
                  <PdfPreviewWrapper
                    cvData={cvData}
                    sections={sections}
                    templateId={templateId}
                    language={language}
                  />
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
                language={language}
              />
              <div className="space-y-4">
                {activeTips.map((tip) => (
                  <TipCard
                    key={tip.id}
                    description={tip.description}
                    highlightedText={tip.highlight}
                    footer={tip.footer}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
