import { CVListPage } from "@/features/cv/components/cv-list-page";
import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { ScoresListPage } from "@/features/analysis/components/score-list";

export default async function CVPage() {
  let cvForCurrentUser = await getCvForCurrentUser();
  return (
    <>
      <CVListPage
        cvs={cvForCurrentUser.manuals.cvs}
        disabledButton={!cvForCurrentUser.uploads.activeSubscription}
      />
      <ScoresListPage
        cvs={cvForCurrentUser.uploads.cvs}
        disabledButton={!cvForCurrentUser.uploads.activeSubscription}
      />
    </>
  );
}
