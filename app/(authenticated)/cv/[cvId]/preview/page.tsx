import { CVData } from "@/types/cv";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import { PreviewCVComponent } from "@/features/cv-preview/components/cv-review-page";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { prisma } from "@/lib/prisma";

interface PreviewCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function PreviewCVPage({ params }: PreviewCVPageProps) {
  const { cvId } = await params;
  const cv = await getCvById(cvId);

  if (!cv) return redirect('/my-cv');

  // 1. Traer la configuración maestra (la que define títulos, iconos y campos)
  const config = await prisma.cvSectionConfiguration.findUnique({
    where: {
      cvType_opportunityType: {
        cvType: cv.cvType,
        opportunityType: cv.opportunityType,
      },
    },
  });

  const masterSections = (config?.sections as any[]) || [];

  // 2. JOIN: La fuente de verdad son las secciones del CV (cv.sections)
  // Mapeamos cada sección del usuario con su configuración visual correspondiente
  const filteredSections = cv.sections
    .map((userSection) => {
      const sectionConfig = masterSections.find(
        (s) => s.id?.toUpperCase() === userSection.sectionType?.toUpperCase()
      );

      if (!sectionConfig) {
        console.warn(`[PREVIEW_MISSING_CONFIG] No config for: ${userSection.sectionType}`);
        return null;
      }

      return {
        ...sectionConfig,
        // Aquí podrías inyectar overrides específicos si la tabla CvSection tuviera títulos personalizados
      };
    })
    .filter(Boolean);

  const cvData: CVData = transformCVToDTO(cv);
  const creditLimits = await getCurrentCreditLimits();


  return (
    <PreviewCVComponent
      cv={cvData}
      cvId={cv.id}
      language={cv.language || "ES"}
      opportunityType={cv.opportunityType}
      cvType={cv.cvType}
      templateId={cv.templateId}
      // Enviamos las secciones ya procesadas y ordenadas según la DB
      masterSections={filteredSections as any[]}
      canAnalyze={creditLimits.aiActionsLimit > 0}
      analysisTokens={creditLimits.aiActionsLimit}
      opportunitiesActionTokens={creditLimits.opportunitiesActionsLimit}
    />
  );
}
