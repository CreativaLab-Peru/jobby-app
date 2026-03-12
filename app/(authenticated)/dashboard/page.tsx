import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import RouteStepper from "@/features/routes/components/route-stepper";

export default async function DashboardPage() {
  const activeRoute = await getActiveRoute();

  // If the user has no routes, redirect to create one
  if (!activeRoute) {
    return redirect("/routes/new");
  }

  const cv = activeRoute.cv;
  const latestEval = cv?.evaluations?.[0] ?? null;

  return (
    <RouteStepper
      routeName={activeRoute.name}
      routeStatus={activeRoute.status}
      cvId={cv?.id ?? null}
      cvTitle={cv?.title ?? null}
      evaluationScore={latestEval?.overallScore ?? null}
      opportunitiesCount={cv?._count?.opportunities ?? 0}
    />
  );
}
