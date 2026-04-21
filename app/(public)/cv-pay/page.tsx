import {CVPayScreen} from "@/components/public/screens/cv-pay-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";
import { PublicPageTransition } from "@/components/shared/public-page-transition";

export default async function CVPayPage() {
  const [currentUser, packs] = await Promise.all([
    getCurrentUser(),
    getCreditPackOffers(),
  ]);
  return (
    <PublicPageTransition>
      <CVPayScreen user={currentUser} packs={packs}/>
    </PublicPageTransition>
  );
}
