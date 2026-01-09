import { getUser } from "@/lib/shared/get-user";
import { TermsModal } from "@/components/terms-modal";
import "../globals.css";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import { getAvailableTokens } from "@/lib/shared/get-available-tokens";

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                           children,
                                         }: Readonly<{
  children: React.ReactNode;
}>) {
  const limitPlanOfCurrentUser = await getAvailableTokens();
  const user = await getUser();
  const isTermsAccepted =
    (user?.acceptedTermsAndConditions && user?.acceptedPrivacyPolicy) || false;

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <NavbarWrapper
          creditsOfPlan={limitPlanOfCurrentUser}
          user={user}
        />

        <main className="flex-1 transition-colors duration-300">
          {children}
        </main>

        <TermsModal isOpen={!isTermsAccepted} userId={user?.id} />
      </div>
    </div>
  );
}
