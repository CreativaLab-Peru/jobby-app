import { notFound } from "next/navigation";
import {getOpportunityDetails} from "@/features/opportunities/actions/get-opportunity-details";
import {
  OpportunityDetailsScreen
} from "@/features/opportunities/screens/opportunities-details-screen";

interface PageProps {
  params: Promise<{
    opportunityId: string
    cvId: string
  }>;
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { opportunityId, cvId } = await params;

  const opportunity = await getOpportunityDetails(opportunityId, cvId);
  if (!opportunity){
    notFound();
  }

  return (
    <OpportunityDetailsScreen
      opportunity={opportunity}
      matchValue={opportunity.matchValue}
      isHighMatch={opportunity.isHighMatch}
      requirements={opportunity.requirements}
      formattedDeadline={opportunity.formattedDeadline}
    />
  );
}
