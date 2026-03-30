import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import RouteStepper from "@/features/routes/components/route-stepper";
import { prisma } from "@/lib/prisma";
import { getStatisticsForUser } from "@/features/dashboard/actions/get-statistics-for-user";

export default async function DashboardPage() {
  const [activeRoute, stats] = await Promise.all([
    getActiveRoute(),
    getStatisticsForUser(),
  ]);

  // If the user has no routes, redirect to create one
  if (!activeRoute) {
    return redirect("/routes/new");
  }

  const cv = activeRoute.cv;
  const latestEval = cv?.evaluations?.[0] ?? null;

  // Check if the user has any roadmap for this route's CV
  let hasRoadmap = false;
  let roadmapId = null;
  if (cv?.id) {
    const roadmap = await prisma.roadmap.findFirst({
      where: { cvId: cv.id, userId: activeRoute.userId, status: "SUCCEEDED" },
    });
    hasRoadmap = roadmap !== null;
    roadmapId = roadmap?.id ?? null;
  }

  const planSlug = stats?.subscription?.plan?.slug;
  const planTier = planSlug === "pro" ? "PRO" : planSlug === "starter" ? "STARTER" : "FREE";

  return (
    <RouteStepper
      routeName={activeRoute.name}
      routeStatus={activeRoute.status}
      cvId={cv?.id ?? null}
      cvTitle={cv?.title ?? null}
      evaluationScore={latestEval?.overallScore ?? null}
      opportunitiesCount={cv?._count?.opportunities ?? 0}
      hasRoadmap={hasRoadmap}
      roadmapId={roadmapId}
      planTier={planTier}
    />
  );
}
