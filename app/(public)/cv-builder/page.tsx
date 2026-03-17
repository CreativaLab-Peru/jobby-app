import CVBuilderScreen from "@/features/cv/screens/cv-builder-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import { getCreditPackOffers } from "@/features/credits/actions/get-credit-pack-offers";

export default async function CVBuilderPage() {
  const [currentUser, packs] = await Promise.all([
    getCurrentUser(),
    getCreditPackOffers(),
  ]);

  return (
    <CVBuilderScreen
      user={currentUser}
      packs={packs}
    />
  )
}
