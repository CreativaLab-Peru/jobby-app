import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";
import {MyCreditsScreen} from "@/features/credits/screens/my-credits-screen";

export default async function CreditosPage() {
  const currentCredit = await getCurrentCreditLimits();

  return <MyCreditsScreen currentCredit={currentCredit} />;
}
