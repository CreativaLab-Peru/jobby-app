import { redirect } from "next/navigation";

interface CvOpportunitiesPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function CvOpportunitiesPage({ params }: CvOpportunitiesPageProps) {
  const { cvId } = await params;

  if (!cvId) {
    redirect('/opportunities');
  }

  // Redirigir a la vista de oportunidades con filtro de cvId
  redirect(`/opportunities?cvId=${cvId}`);
}
