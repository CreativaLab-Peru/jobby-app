import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getEvaluationsForActiveRoute } from "@/features/routes/actions/get-evaluations-for-active-route";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import MyEvaluationsScreen from "@/features/routes/components/my-evaluations-screen";

export default async function MyEvaluationsPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const [evalResult, creditLimits] = await Promise.all([
    getEvaluationsForActiveRoute({ skip: 0, take: 5, onlySuccessful: true }),
    getCurrentCreditLimits(),
  ]);

  const canAnalyze = (creditLimits?.aiActionsLimit ?? 0) > 0;

  return (
    <MyEvaluationsScreen
      initialEvaluations={evalResult?.evaluations ?? []}
      canAnalyze={canAnalyze}
      hasMoreProp={evalResult?.hasMore ?? false}
      totalCount={evalResult?.totalCount ?? 0}
      hasCv={evalResult?.hasCv ?? false}
      cvId={activeRoute.cvId ?? null}
    />
  );
}

