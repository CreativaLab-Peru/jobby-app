import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getCvForActiveRoute } from "@/features/routes/actions/get-cv-for-active-route";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import MyCvScreen from "@/features/routes/components/my-cv-screen";

export default async function MyCvPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const [cvResult, creditLimits] = await Promise.all([
    getCvForActiveRoute(),
    getCurrentCreditLimits(),
  ]);

  const canCreate = creditLimits.manageCvsLimit > 0;

  return (
    <MyCvScreen
      cv={cvResult?.cv ?? null}
      canCreate={canCreate}
      routeHasCv={cvResult?.routeHasCv ?? false}
    />
  );
}

