import { notFound } from "next/navigation";
import {getOpportunityDetails} from "@/features/opportunities/actions/get-opportunity-details";
import {
  OpportunityDetailsScreen
} from "@/features/opportunities/screens/opportunities-details-screen";
import { getRoadmapForOpportunity } from "@/features/roadmap/actions/get-roadmap-for-opportunity";
import { canViewFullRoadmap } from "@/features/roadmap/actions/can-view-full-roadmap";

interface PageProps {
  params: Promise<{
    opportunityId: string
    cvId: string
  }>;
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { opportunityId, cvId } = await params;

  const [opportunity, roadmap, canViewFull] = await Promise.all([
    getOpportunityDetails(opportunityId, cvId),
    getRoadmapForOpportunity(opportunityId, cvId),
    canViewFullRoadmap(),
  ]);

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
      roadmap={roadmap}
      canViewFullRoadmap={canViewFull}
    />
  );
}
