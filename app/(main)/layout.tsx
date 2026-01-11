import {getUser} from "@/lib/shared/get-user";
import {TermsModal} from "@/components/terms-modal";
import "../globals.css";
import {NavbarWrapper} from "@/components/navbar-wrapper";
import {getAvailableTokens} from "@/lib/shared/get-available-tokens";
import {SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import {redirect} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                           children,
                                         }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }

  const limitPlanOfCurrentUser = await getAvailableTokens();
  const isTermsAccepted =
    (user?.acceptedTermsAndConditions && user?.acceptedPrivacyPolicy) || false;

  return (
    <SidebarProvider>
      {/* Sidebar lateral */}
      <AppSidebar/>

      {/* Contenido Principal */}
      <main className="flex flex-1 flex-col">
        {/* Header/Navbar */}
        <NavbarWrapper creditsOfPlan={limitPlanOfCurrentUser} user={user}/>
        <div className="md:pl-64">
          <div className="mx-auto w-full max-w-8xl pl-0">
            {children}
          </div>
        </div>
      </main>
      <TermsModal isOpen={!isTermsAccepted} userId={user?.id}/>
    </SidebarProvider>
  );
}
