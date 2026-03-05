import SettingsScreen from "@/features/settings/settings-screen";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { getSession } from "@/features/authentication/actions/get-session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const [user, session] = await Promise.all([
    getCurrentUser(),
    getSession(),
  ]);

  if (!user || !session.success || !session.user) {
    return redirect("/");
  }

  const oauthAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      NOT: { providerId: "credential" },
    },
    select: { id: true },
  });

  return <SettingsScreen user={user} isOAuth={!!oauthAccount} />;
}
