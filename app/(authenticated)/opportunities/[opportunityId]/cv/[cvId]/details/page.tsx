import { notFound } from "next/navigation";
import {getOpportunityDetails} from "@/features/opportunities/actions/get-opportunity-details";
import {
  OpportunityDetailsScreen
} from "@/features/opportunities/screens/opportunities-details-screen";
import { getRoadmapForOpportunity } from "@/features/roadmap/actions/get-roadmap-for-opportunity";
import { canViewFullRoadmap } from "@/features/roadmap/actions/can-view-full-roadmap";
import { getRoadmapGenerationPermission } from "@/features/roadmap/actions/get-roadmap-generation-permission";

interface PageProps {
  params: Promise<{
    opportunityId: string
    cvId: string
  }>;
}

export default async function OpportunityDetailsPage({ params }: PageProps) {
  const { opportunityId, cvId } = await params;

  const [opportunity, roadmap, canViewFull, generationPermission] = await Promise.all([
    getOpportunityDetails(opportunityId, cvId),
    getRoadmapForOpportunity(opportunityId, cvId),
    canViewFullRoadmap(),
    getRoadmapGenerationPermission(opportunityId, cvId),
  ]);

  if (!opportunity){
    notFound();
  }

  return (
    <OpportunityDetailsScreen
      opportunity={opportunity}
      matchValue={opportunity.matchValue}
      isHighMatch={opportunity.isHighMatch}
      requirements={{
        required: opportunity.requiredRequirements,
        optional: opportunity.optionalRequirements
      }}
      formattedDeadline={opportunity.formattedDeadline}
      roadmap={roadmap}
      canViewFullRoadmap={canViewFull}
      canGenerateRoadmap={generationPermission.canGenerate}
      roadmapBlockedMessage={generationPermission.message}
    />
  );
}
