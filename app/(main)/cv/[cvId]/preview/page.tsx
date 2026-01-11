import { CVData } from "@/types/cv";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import { PreviewCVComponent } from "@/features/cv-preview/components/cv-review-page";
import {getSections} from "@/features/cv/helpers";

interface PreviewCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function PreviewCVPage({ params }: PreviewCVPageProps) {
  const { cvId } = await params;
  if (!cvId) {
    return redirect('/cv')
  }
  const cv = await getCvById(cvId);
  if (!cv) {
    return redirect('/cv')
  }

  const cvData: CVData = transformCVToDTO(cv);
  const sections = getSections(cv.opportunityType, cv.cvType);
  // Extraer solo los IDs de las secciones (sin los iconos/funciones)
  const sectionIds = sections.map(s => s.id);

  return (
    <PreviewCVComponent
      cv={cvData}
      opportunityType={cv.opportunityType}
      cvId={cv.id}
      cvType={cv.cvType}
      sectionIds={sectionIds}
    />
  )
}
