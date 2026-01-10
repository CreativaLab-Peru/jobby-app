import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { ScoresListPage } from "@/features/analysis/components/score-list";

export default async function MyEvaluationsPage() {
  const cvForCurrentUser = await getCvForCurrentUser();
  return (
    <>
      <ScoresListPage
        cvs={cvForCurrentUser.uploads.cvs}
        disabledButton={!cvForCurrentUser.uploads.activeSubscription}
      />
    </>
  );
}
