import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getCvForActiveRoute } from "@/features/routes/actions/get-cv-for-active-route";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import MyCvsScreen from "@/features/routes/components/my-cvs-screen";

export default async function MyCvsPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const [cvResult, creditLimits] = await Promise.all([
    getCvForActiveRoute(),
    getCurrentCreditLimits(),
  ]);

  const canCreate = creditLimits.manageCvsLimit > 0;

  return (
    <MyCvsScreen
      cv={cvResult?.cv ?? null}
      canCreate={canCreate}
      routeHasCv={cvResult?.routeHasCv ?? false}
    />
  );
}

