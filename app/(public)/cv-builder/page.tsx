import CVBuilderScreen from "@/features/cv/screens/cv-builder-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export default async function CVBuilderPage() {
  const currentUser = await getCurrentUser();

  return (
    <CVBuilderScreen
      user={currentUser}
    />
  )
}
