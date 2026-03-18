import {CVPayScreen} from "@/components/public/screens/cv-pay-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";

export default async function CVPayPage() {
  const [currentUser, packs] = await Promise.all([
    getCurrentUser(),
    getCreditPackOffers(),
  ]);
  return <CVPayScreen user={currentUser} packs={packs}/>
}
