import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { ScoresListPage } from "@/features/analysis/components/score-list";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

export default async function MyEvaluationsPage() {
  const cvForCurrentUser = await getCvForCurrentUser();

  // Combine manual and uploaded CVs
  const allCvs = [
    ...(cvForCurrentUser?.manuals?.cvs || []),
  ];

  // Remove duplicates (manuals already includes uploads in current implementation)
  const uniqueCvs = allCvs.filter((cv, index, self) =>
    index === self.findIndex(c => c.id === cv.id)
  );

  const creditLimits = await getCurrentCreditLimits();
  const hasCredits = creditLimits.aiActionsLimit > 0;

  return (
    <>
      <ScoresListPage
        cvs={uniqueCvs}
        disabledButton={!hasCredits}
      />
    </>
  );
}
