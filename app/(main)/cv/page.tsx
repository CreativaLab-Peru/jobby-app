import { CVListPage } from "@/features/cv/components/cv-list-page";
import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { ScoresListPage } from "@/features/analysis/components/score-list";

export default async function CVPage() {
  const cvForCurrentUser = await getCvForCurrentUser();
  return (
    <>
      <CVListPage
        cvs={cvForCurrentUser.manuals.cvs}
        disabledButton={!cvForCurrentUser.manuals.activeSubscription}
      />
      <ScoresListPage
        cvs={cvForCurrentUser.uploads.cvs}
        disabledButton={!cvForCurrentUser.uploads.activeSubscription}
      />
    </>
  );
}
