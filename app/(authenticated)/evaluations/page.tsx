import {ScoresListPage} from "@/features/analysis/components/score-list";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";
import {geEvaluationsForCurrentUser} from "@/features/cv/actions/get-evaluations-for-current-user";

export default async function MyEvaluationsPage() {
  const [cvData, creditLimits] = await Promise.all([
    geEvaluationsForCurrentUser(0, 5),
    getCurrentCreditLimits()
  ]);

  // Obtenemos solo los CVs que tienen al menos una evaluación
  const cvsWithEvaluations = (cvData?.cvs || []).filter(
    cv => cv.evaluations && cv.evaluations.length > 0
  );

  const canAnalyze = creditLimits.aiActionsLimit > 0;
  const hasMore = cvData ? cvData.hasMore : false;

  return (
    <ScoresListPage
      initialCvs={cvsWithEvaluations}
      canAnalyze={!canAnalyze}
      hasMoreProp={hasMore}
      totalCount={cvData.cvs ? cvData.totalCount : 0}
    />
  );
}
