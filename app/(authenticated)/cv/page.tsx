import {CvListScreen} from "@/features/cv/components/cv-list-screen";
import {getCvForCurrentUser} from "@/features/cv/actions/get-cv-for-current-user";

export default async function CVPage() {
  const cvForCurrentUser = await getCvForCurrentUser();
  return (
    <CvListScreen
      cvs={cvForCurrentUser.manuals.cvs}
      disabledButton={!cvForCurrentUser.manuals.activeSubscription}
    />
  );
}
