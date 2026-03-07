import {HotSaleSection} from "@/components/ui/app/public/cv-builder/hot-sale-section";
import { CreditPackModal } from "@/features/credits/components/credit-pack-modal";
import { getSession } from "@/features/authentication/actions/get-session";

export default async function CVPayPage() {
  const session = await getSession();
  const sessionUser = session.success ? session.user : null;

  return (
    <>
      <HotSaleSection sessionUser={sessionUser} />
      <CreditPackModal />
    </>
  )
}
