import SettingsScreen from "@/features/settings/settings-screen";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SettingsPage() {
  const [currentUser, session] = await Promise.all([
    getCurrentUser(),
    auth.api.getSession({ headers: await headers() }),
  ]);

  if (!currentUser || !session?.user) {
    return redirect("/");
  }

  const oauthAccount = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      NOT: { providerId: "credential" },
    },
    select: { id: true },
  });

  return <SettingsScreen user={currentUser} isOAuth={!!oauthAccount} />;
}
