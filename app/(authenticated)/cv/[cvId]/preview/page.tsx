import { CVData } from "@/types/cv";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import { PreviewCVComponent } from "@/features/cv-preview/components/cv-review-page";
import { getSections } from "@/features/cv/helpers";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

interface PreviewCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function PreviewCVPage({ params }: PreviewCVPageProps) {
  const { cvId } = await params;
  if (!cvId) {
    return redirect('/my-cv')
  }
  const cv = await getCvById(cvId);
  if (!cv) {
    return redirect('/my-cv')
  }

  const cvData: CVData = transformCVToDTO(cv);
  const sections = getSections(cv.opportunityType, cv.cvType, cv.templateId);
  // Extraer solo los IDs de las secciones (sin los iconos/funciones)
  const sectionIds = sections.map(s => s.id);

  // Get credit limits
  const creditLimits = await getCurrentCreditLimits();
  const hasCredits = creditLimits.aiActionsLimit > 0;

  return (
    <PreviewCVComponent
      cv={cvData}
      language={cv.language || "ES"}
      opportunityType={cv.opportunityType}
      cvId={cv.id}
      cvType={cv.cvType}
      templateId={cv.templateId}
      sectionIds={sectionIds}
      canAnalyze={hasCredits}
      analysisTokens={creditLimits.aiActionsLimit}
      opportunitiesActionTokens={creditLimits.opportunitiesActionsLimit}
    />
  )
}
