import {notFound} from "next/navigation";
import {getRoadmapById} from "@/features/roadmap/actions/get-roadmap-by-id";
import {canViewFullRoadmap} from "@/features/roadmap/actions/can-view-full-roadmap";
import {RoadmapDetailScreen} from "@/features/roadmap/components/roadmap-detail-screen";
import {RoadmapProcessingScreen} from "@/features/roadmap/screens/roadmap-processing-screen";
import {getRouteDossier} from "@/features/booking/actions/get-route-dossier";
import {getActiveRoute} from "@/features/routes/actions/get-active-route";
import { JobStatus } from "@/enums";

interface PageProps {
  params: Promise<{ roadmapId: string }>;
}

export default async function RoadmapDetailPage({params}: PageProps) {
  const {roadmapId} = await params;

  const [roadmap, canViewFull, dossier, activeRoute] = await Promise.all([
    getRoadmapById(roadmapId),
    canViewFullRoadmap(),
    getRouteDossier(),
    getActiveRoute(),
  ]);

  if (!roadmap) {
    notFound();
  }

  if (!dossier.success) {
    notFound();
  }

  if (roadmap.status === JobStatus.PENDING || roadmap.status === JobStatus.IN_PROGRESS) {
    return (
      <RoadmapProcessingScreen
        roadmapId={roadmap.id}
        opportunityId={roadmap.opportunity.id}
        cvId={roadmap.opportunity.cvId}
        routeId={roadmap.opportunity.routeId || activeRoute?.id || ""}
      />
    );
  }

  return (
    <RoadmapDetailScreen
      roadmap={roadmap}
      canViewFull={canViewFull}
      dossier={dossier.data}
    />
  );
}

