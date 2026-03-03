import { CvListScreen } from "@/features/cv/components/cv-list-screen";
import { getCvForCurrentUser } from "@/features/cv/actions/get-cv-for-current-user";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {getAllCvForCurrentUser} from "@/features/cv/actions/get-all-cv-for-current-user";

export default async function CVPage() {
  const [cvData, creditLimits] = await Promise.all([
    getAllCvForCurrentUser(0, 6),
    getCurrentCreditLimits()
  ]);

  // Si el límite es mayor a 0, puede crear.
  const canCreate = creditLimits.manageCvsLimit > 0;
  const hasMore = cvData ? cvData.hasMore : false;
  return (
    <CvListScreen
      initialCvs={cvData.cvs ?? []}
      canCreate={canCreate}
      hasMoreProp={hasMore}
      totalCount={cvData.totalCount}
    />
  );
}
