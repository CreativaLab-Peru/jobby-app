import { notFound } from "next/navigation";
import {getOpportunityDetails} from "@/features/opportunities/actions/get-opportunity-details";
import {
  OpportunityDetailsScreen
} from "@/features/opportunities/screens/opportunities-details-screen";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const result = await getOpportunityDetails(id);

  // Si hay error de permisos o no existe, disparamos el notFound de Next.js
  if (result.error) {
    if (result.status === 404 || result.status === 403) {
      notFound();
    }
    // Podrías manejar otros errores aquí (ej. 500)
    throw new Error(result.error);
  }

  return (
    <OpportunityDetailsScreen
      opportunity={result.data}
      matchValue={result.data.matchValue}
      isHighMatch={result.data.isHighMatch}
      requirements={result.data.requirements}
      formattedDeadline={result.data.formattedDeadline}
    />
  );
}
