import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { CvOpportunitiesClient } from "./client";

interface CvOpportunitiesPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function CvOpportunitiesPage({ params }: CvOpportunitiesPageProps) {
  const { cvId } = await params;

  if (!cvId) {
    redirect('/cv');
  }

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    redirect('/login');
  }

  const cv = await getCvById(cvId);
  if (!cv) {
    redirect('/cv');
  }

  // Verificar que el CV pertenece al usuario
  if (cv.userId !== currentUser.id) {
    redirect('/opportunities');
  }

  // Obtener oportunidades de este CV
  const opportunities = await prisma.opportunity.findMany({
    where: {
      cvId: cvId
    },
    orderBy: [
      { match: "desc" },
      { createdAt: "desc" }
    ]
  });

  const opportunitiesFormatted = JSON.parse(
    JSON.stringify(
      opportunities.map(opt => ({
        ...opt,
        match: Number(opt.match)
      }))
    )
  );

  return (
    <CvOpportunitiesClient
      cv={{
        id: cv.id,
        title: cv.title,
        userId: cv.userId
      }}
      opportunities={opportunitiesFormatted}
      cvId={cvId}
    />
  );
}
