import SettingsScreen from "@/features/settings/settings-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {redirect} from "next/navigation";

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return redirect('/');
  }
  return (
    <SettingsScreen user={currentUser} />
  );
}
