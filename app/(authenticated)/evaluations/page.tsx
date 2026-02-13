import { ScoresListPage } from "@/features/analysis/components/score-list";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { geEvaluationsForCurrentUser } from "@/features/cv/actions/get-evaluations-for-current-user";

export default async function MyEvaluationsPage() {
  const [cvData, creditLimits] = await Promise.all([
    geEvaluationsForCurrentUser(0, 5),
    getCurrentCreditLimits()
  ]);

  const cvs = cvData?.evaluations ?? [];

  const canAnalyze = (creditLimits?.aiActionsLimit ?? 0) > 0;

  const hasMore = cvData?.hasMore ?? false;
  const totalCount = cvData?.totalCount ?? 0;

  return (
    <ScoresListPage
      initialCvs={cvs}
      canAnalyze={canAnalyze}
      hasMoreProp={hasMore}
      totalCount={totalCount}
    />
  );
}
