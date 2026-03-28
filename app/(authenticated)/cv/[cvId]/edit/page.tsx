import { CVData } from "@/types/cv";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import CreateCVPage from "@/features/cv/components/create-cv-page";
import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";

interface EditCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

import { prisma } from "@/lib/prisma";

export default async function EditCVPage({ params }: EditCVPageProps) {
  const { cvId } = await params;
  const cv = await getCvById(cvId);
  if (!cv) return redirect('/404');

  for (const section of cv.sections){
    console.log("[CV_SECTION]", section.sectionType);
  }

  const config = await prisma.cvSectionConfiguration.findUnique({
    where: {
      cvType_opportunityType: {
        cvType: cv.cvType,
        opportunityType: cv.opportunityType,
      },
    },
  });

  const masterSections = (config?.sections as any[]) || [];

  // 2. Filtrar y Normalizar
  const filteredSections = cv.sections.map((userSection) => {
    // Normalizamos ambos a Mayúsculas para evitar errores de matching
    const sectionConfig = masterSections.find(
      s => s.id?.toUpperCase() === userSection.sectionType?.toUpperCase()
    );

    if (!sectionConfig) {
      console.warn(`[MISSING_CONFIG] No config found for section: ${userSection.sectionType}`);
      return null;
    }

    return {
      ...sectionConfig,
      // // Usamos el helper para convertir el string del icono en Componente
      // icon: getIconComponent(sectionConfig.icon),
    };
  }).filter(Boolean);

  const cvData: CVData = transformCVToDTO(cv);

  // DEBUG: Para verificar en la consola de Ubuntu/WebStorm que el join funcionó
  console.log(`[JOIN_SUCCESS] Renderizando ${filteredSections.length} secciones para el CV: ${cv.id}`);

  for (const section of cv.sections) {
    console.log("[CONF_SECTION]", section.sectionType);
  }

  return (
    <CreateCVPage
      cv={cvData}
      id={cv.id}
      opportunityType={cv.opportunityType}
      cvType={cv.cvType}
      templateId={cv.templateId}
      initialSections={filteredSections}
      language={cv.language || "ES"}
    />
  );
}
