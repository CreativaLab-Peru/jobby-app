import {CvListScreen} from "@/features/cv/components/cv-list-screen";
import {getCvForCurrentUser} from "@/features/cv/actions/get-cv-for-current-user";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

export default async function CVPage() {
  const cvForCurrentUser = await getCvForCurrentUser();

  const creditLimits = await getCurrentCreditLimits();
  const hasCredits = creditLimits.manageCvsLimit > 0;

  return (
    <CvListScreen
      cvs={cvForCurrentUser?.manuals?.cvs ?? []}
      disabledButton={!hasCredits}
    />
  );
}
