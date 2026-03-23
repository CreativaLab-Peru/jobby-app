import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {MyCreditsScreen} from "@/features/credits/screens/my-credits-screen";
import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";

export default async function CreditosPage() {
  const [currentCredit, packs] = await Promise.all([
    getCurrentCreditLimits(),
    getCreditPackOffers(),
  ]);

  return <MyCreditsScreen currentCredit={currentCredit} packs={packs} />;
}
