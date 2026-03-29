import { redirect } from "next/navigation";
import { CvType } from "@prisma/client";

import CreateCVPage from "@/features/cv/components/create-cv-page";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import { getAdminCvById } from "@/features/cv/actions/admin/get-admin-cv-by-id";
import { updateAdminCvAndSections } from "@/features/cv/actions/admin/update-admin-cv-and-sections";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { CVData } from "@/types/cv";
import {prisma} from "@/lib/prisma";

interface AdminEditCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function AdminEditCVPage({ params }: AdminEditCVPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { cvId } = await params;
  if (!cvId) {
    redirect("/admin/cv");
  }

  const result = await getAdminCvById(cvId);
  if (!result.success) {
    redirect("/404");
  }

  const config = await prisma.cvSectionConfiguration.findUnique({
    where: {
      cvType_opportunityType: {
        cvType: result.data.cvType,
        opportunityType: result.data.opportunityType,
      },
    },
  });

  const masterSections = (config?.sections as any[]) || [];

  // 2. Filtrar y Normalizar
  const filteredSections = result.data.sections.map((userSection) => {
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

  const cvData: CVData = transformCVToDTO(result.data);

  return (
    <CreateCVPage
      cv={cvData}
      id={result.data.id}
      opportunityType={result.data.opportunityType}
      cvType={result.data.cvType ?? CvType.TECHNOLOGY_ENGINEERING}
      saveCv={updateAdminCvAndSections}
      onCompletePath="/admin/cv"
      initialSections={filteredSections}
      language={result.data.language || "ES"}
    />
  );
}
