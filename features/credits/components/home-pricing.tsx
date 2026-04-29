import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";
import { getUserCurrentPlan } from "@/features/billing/actions/get-user-current-plan";
import { getSession } from "@/features/authentication/actions/get-session";
import { PricingSection } from "./pricing-section";

export async function HomePricing() {
  const [packs, currentPlanId, session] = await Promise.all([
    getCreditPackOffers(),
    getUserCurrentPlan(),
    getSession(),
  ]);

  return (
    <section className="container mx-auto px-4">
      <PricingSection
        packs={packs}
        currentPlanId={currentPlanId}
        isAuthenticated={session.success}
        title="Planes y Créditos"
        description="Elige el plan que mejor se adapte a tus necesidades y potencia tu carrera."
      />
    </section>
  );
}
