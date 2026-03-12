import { CvListScreen } from "@/features/cv/components/cv-list-screen";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { getAllCvForCurrentUser } from "@/features/cv/actions/get-all-cv-for-current-user";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { redirect } from "next/navigation";

export default async function CVPage() {
  const activeRoute = await getActiveRoute();

  // If the active route already has a CV linked, go directly to that CV's detail page
  if (activeRoute?.cvId) {
    return redirect(`/cv/${activeRoute.cvId}`);
  }

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
      routeId={activeRoute?.id ?? null}
    />
  );
}
