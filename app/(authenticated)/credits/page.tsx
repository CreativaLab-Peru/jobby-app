import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import { MyCreditsScreen } from "@/features/credits/screens/my-credits-screen";
import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";
import { getUserCurrentPlan } from "@/features/billing/actions/get-user-current-plan";
import { getSession } from "@/features/authentication/actions/get-session";

export default async function CreditosPage() {
  const [currentCredit, packs, currentPlanId, session] = await Promise.all([
    getCurrentCreditLimits(),
    getCreditPackOffers(),
    getUserCurrentPlan(),
    getSession(),
  ]);

  return (
    <MyCreditsScreen
      currentCredit={currentCredit}
      packs={packs}
      currentPlanId={currentPlanId}
      isAuthenticated={session.success}
    />
  );
}
