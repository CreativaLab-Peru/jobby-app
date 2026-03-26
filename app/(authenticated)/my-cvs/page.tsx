import { CvListScreen } from "@/features/cv/components/cv-list-screen";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { getAllCvForCurrentUser } from "@/features/cv/actions/get-all-cv-for-current-user";

export default async function MyCvsPage() {
  const [cvData, creditLimits] = await Promise.all([
    getAllCvForCurrentUser(0, 6),
    getCurrentCreditLimits()
  ]);

  const canCreate = creditLimits.manageCvsLimit > 0;
  const hasMore = cvData ? cvData.hasMore : false;
  return (
    <CvListScreen
      initialCvs={cvData.cvs ?? []}
      canCreate={canCreate}
      hasMoreProp={hasMore}
      totalCount={cvData.totalCount}
      routeId={null}
    />
  );
}
