import {notFound} from "next/navigation";
import {getRoadmapById} from "@/features/roadmap/actions/get-roadmap-by-id";
import {canViewFullRoadmap} from "@/features/roadmap/actions/can-view-full-roadmap";
import {RoadmapDetailScreen} from "@/features/roadmap/components/roadmap-detail-screen";
import {getRouteDossier} from "@/features/booking/actions/get-route-dossier";

interface PageProps {
  params: Promise<{ roadmapId: string }>;
}

export default async function RoadmapDetailPage({params}: PageProps) {
  const {roadmapId} = await params;

  const [roadmap, canViewFull, dossier] = await Promise.all([
    getRoadmapById(roadmapId),
    canViewFullRoadmap(),
    getRouteDossier(),
  ]);

  if (!roadmap) {
    notFound();
  }

  if (!dossier.success) {
    notFound();
  }

  return (
    <RoadmapDetailScreen
      roadmap={roadmap}
      canViewFull={canViewFull}
      dossier={dossier.data}
    />
  );
}

