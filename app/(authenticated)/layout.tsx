import {NavbarWrapper} from "@/components/navbar-wrapper";
import {redirect} from "next/navigation";
import {getUser} from "@/features/authentication/actions/get-user";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";
import {SidebarProvider} from "@/components/ui/sidebar";
import AppSidebar, {NavbarUser} from "@/components/app-sidebar";
import {ThemeSync} from "@/components/theme-sync";
import {PaddleProvider} from "@/features/billing/components/paddle-provider";
import {getRoutesForUser} from "@/features/routes/actions/get-routes-for-user";
import {RouteProvider} from "@/features/routes/components/route-provider";
import {getPendingRoadmapStep} from "@/features/roadmap/actions/get-pending-roadmap-step";
import {CreditsProvider} from "@/providers/credits-provider";

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                           children,
                                         }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  if (!user) {
    return redirect("/logout");
  }

  const [creditsLimits, routesResult] = await Promise.all([
    getCurrentCreditLimits(),
    getRoutesForUser(),
  ]);

  const routes = routesResult?.routes ?? [];

  const userNavbar: NavbarUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  }

  return (
    <SidebarProvider>
      <ThemeSync/>
      <CreditsProvider/>
      <PaddleProvider>
        <RouteProvider routes={routes}>
          {/* Sidebar lateral */}
          <AppSidebar
            initialUser={userNavbar}
            creditLimits={creditsLimits}
            userRole={user.role}
          />

          {/* Contenido Principal */}
          <main className="flex flex-1 flex-col">
            {/* Header/Navbar */}
            <div className="block sm:hidden ">
              <NavbarWrapper/>
            </div>
            <div className="md:pl-64">
              <div className="mx-auto w-full max-w-8xl pl-0 pr-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </div>
          </main>
        </RouteProvider>
      </PaddleProvider>
      {/*<TermsModal isOpen={!isTermsAccepted} userId={user?.id}/>*/}
    </SidebarProvider>
  );
}
