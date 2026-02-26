import SettingsScreen from "@/features/settings/settings-screen";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {redirect} from "next/navigation";
import {detectOAuthUser} from "@/utils/oauth-utils";

export default async function SettingsPage() {
  const [currentUser, { isOAuth }] = await Promise.all([
    getCurrentUser(),
    detectOAuthUser(),
  ]);

  if (!currentUser) {
    return redirect('/');
  }

  return (
    <SettingsScreen user={currentUser} isOAuth={isOAuth} />
  );
}
