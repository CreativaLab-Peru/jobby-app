import { redirect } from "next/navigation";
import { getUserPreference } from "@/features/settings/actions/get-user-preference";
import { MyPreferencesScreen } from "@/features/settings/screens/my-preferences-screen";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export default async function PreferencesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const result = await getUserPreference();
  if (!result.success) {
    redirect("/dashboard");
  }

  return <MyPreferencesScreen preference={result.data} />;
}

