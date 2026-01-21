import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { ScoresListPage } from "@/features/analysis/components/score-list";

export default async function MyEvaluationsPage() {
  const cvForCurrentUser = await getCvForCurrentUser();
  
  // Combine manual and uploaded CVs, filter only those with evaluations
  const allCvs = [
    ...(cvForCurrentUser?.manuals?.cvs || []),
  ];
  
  // Remove duplicates (manuals already includes uploads in current implementation)
  const uniqueCvs = allCvs.filter((cv, index, self) => 
    index === self.findIndex(c => c.id === cv.id)
  );
  
  // Only show CVs that have at least one evaluation
  const cvsWithEvaluations = uniqueCvs.filter(cv => cv.evaluations && cv.evaluations.length > 0);
  
  return (
    <>
      <ScoresListPage
        cvs={cvsWithEvaluations}
        disabledButton={!cvForCurrentUser?.uploads?.activeSubscription}
      />
    </>
  );
}
