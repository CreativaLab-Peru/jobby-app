import { ScoresListPage } from "@/features/analysis/components/score-list";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {geEvaluationsForCurrentUser} from "@/features/cv/actions/get-evaluations-for-current-user";

export default async function MyEvaluationsPage() {
  const [cvData, creditLimits] = await Promise.all([
    geEvaluationsForCurrentUser(),
    getCurrentCreditLimits()
  ]);

  // Obtenemos solo los CVs que tienen al menos una evaluación
  const cvsWithEvaluations = (cvData?.cvs || []).filter(
    cv => cv.evaluations && cv.evaluations.length > 0
  );

  const hasCredits = creditLimits.aiActionsLimit > 0;
  console.log("[cvData]:", cvData);

  return (
    <ScoresListPage
      cvs={cvsWithEvaluations}
      disabledButton={!hasCredits}
    />
  );
}
