import {CVPayScreen} from "@/components/public/screens/cv-pay-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export default async function CVPayPage() {
  const currentUser = await getCurrentUser();
  return <CVPayScreen user={currentUser}/>
}
