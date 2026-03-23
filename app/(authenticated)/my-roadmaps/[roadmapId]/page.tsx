import { notFound } from "next/navigation";
import { getRoadmapById } from "@/features/roadmap/actions/get-roadmap-by-id";
import { canViewFullRoadmap } from "@/features/roadmap/actions/can-view-full-roadmap";
import { RoadmapDetailScreen } from "@/features/roadmap/components/roadmap-detail-screen";

interface PageProps {
  params: Promise<{ roadmapId: string }>;
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { roadmapId } = await params;

  const [roadmap, canViewFull] = await Promise.all([
    getRoadmapById(roadmapId),
    canViewFullRoadmap(),
  ]);

  if (!roadmap) {
    notFound();
  }

  return (
    <RoadmapDetailScreen roadmap={roadmap} canViewFull={true} />
  );
}

