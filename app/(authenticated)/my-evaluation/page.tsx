import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getEvaluationsForActiveRoute } from "@/features/routes/actions/get-evaluations-for-active-route";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { getCvForActiveRoute } from "@/features/routes/actions/get-cv-for-active-route";
import { getInProgressEvaluation } from "@/features/routes/actions/get-in-progress-evaluation";
import MyEvaluationScreen from "@/features/routes/components/my-evaluation-screen";

export default async function MyEvaluationPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  if (activeRoute.cvId) {
    const activeEval = await getInProgressEvaluation(activeRoute.cvId);
    if (activeEval) {
      return redirect(`/process/${activeRoute.cvId}`);
    }
  }

  const [evalResult, creditLimits, cvResult] = await Promise.all([
    getEvaluationsForActiveRoute({ skip: 0, take: 5, onlySuccessful: true }),
    getCurrentCreditLimits(),
    getCvForActiveRoute(),
  ]);

  const canAnalyze = (creditLimits?.aiActionsLimit ?? 0) > 0;

  return (
    <MyEvaluationScreen
      initialEvaluations={evalResult?.evaluations ?? []}
      canAnalyze={canAnalyze}
      hasMoreProp={evalResult?.hasMore ?? false}
      totalCount={evalResult?.totalCount ?? 0}
      hasCv={evalResult?.hasCv ?? false}
      cv={cvResult?.cv ?? null}
    />
  );
}

