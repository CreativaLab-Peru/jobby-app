import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import RouteStepper from "@/features/routes/components/route-stepper";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const activeRoute = await getActiveRoute();

  // If the user has no routes, redirect to create one
  if (!activeRoute) {
    return redirect("/routes/new");
  }

  const cv = activeRoute.cv;
  const latestEval = cv?.evaluations?.[0] ?? null;

  // Check if the user has any roadmap for this route's CV
  let hasRoadmap = false;
  if (cv?.id) {
    const roadmapCount = await prisma.roadmap.count({
      where: { cvId: cv.id, userId: activeRoute.userId, status: "SUCCEEDED" },
    });
    hasRoadmap = roadmapCount > 0;
  }

  return (
    <RouteStepper
      routeName={activeRoute.name}
      routeStatus={activeRoute.status}
      cvId={cv?.id ?? null}
      cvTitle={cv?.title ?? null}
      evaluationScore={latestEval?.overallScore ?? null}
      opportunitiesCount={cv?._count?.opportunities ?? 0}
      hasRoadmap={hasRoadmap}
    />
  );
}
