import {TermsModal} from "@/components/terms-modal";
import "../globals.css";
import {NavbarWrapper} from "@/components/navbar-wrapper";
import {SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import {redirect} from "next/navigation";
import {getAvailableTokens} from "@/features/billing/actions/get-available-tokens";
import {getUser} from "@/features/authentication/actions/get-user";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                           children,
                                         }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }

  // Todo: deprecated
  // const limitPlanOfCurrentUser = await getAvailableTokens();
  // const isTermsAccepted =
  //   (user?.acceptedTermsAndConditions && user?.acceptedPrivacyPolicy) || false;

  const creditsLimits = await getCurrentCreditLimits();

  return (
    <SidebarProvider>
      {/* Sidebar lateral */}
      <AppSidebar/>

      {/* Contenido Principal */}
      <main className="flex flex-1 flex-col">
        {/* Header/Navbar */}
        <NavbarWrapper
          creditLimits={creditsLimits}
          user={user}
        />
        <div className="md:pl-64">
          <div className="mx-auto w-full max-w-8xl pl-0">
            {children}
          </div>
        </div>
      </main>
      {/*<TermsModal isOpen={!isTermsAccepted} userId={user?.id}/>*/}
    </SidebarProvider>
  );
}
