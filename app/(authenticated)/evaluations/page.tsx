import { ScoresListPage } from "@/features/analysis/components/score-list";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { geEvaluationsForCurrentUser } from "@/features/cv/actions/get-evaluations-for-current-user";
import {getAllCvForCurrentUser} from "@/features/cv/actions/get-all-cv-for-current-user";

export default async function MyEvaluationsPage() {
  const [cvEvaluations, creditLimits, cvData] = await Promise.all([
    geEvaluationsForCurrentUser(0, 5),
    getCurrentCreditLimits(),
    getAllCvForCurrentUser(0, 50),
  ]);
  console.log("cvEvaluations", cvEvaluations.evaluations.length);
  console.log("creditLimits", creditLimits);
  console.log("cvData", cvData.cvs.length);

  const initialCvs = cvData.cvs;

  const evaluations = cvEvaluations?.evaluations ?? [];

  const canAnalyze = (creditLimits?.aiActionsLimit ?? 0) > 0;

  const hasMore = cvEvaluations?.hasMore ?? false;
  const totalCount = cvEvaluations?.totalCount ?? 0;

  return (
    <ScoresListPage
      initialEvaluations={evaluations}
      initialCvs={initialCvs}
      canAnalyze={canAnalyze}
      hasMoreProp={hasMore}
      totalCount={totalCount}
    />
  );
}
