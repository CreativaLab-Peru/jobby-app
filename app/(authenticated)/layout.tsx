import {NavbarWrapper} from "@/components/navbar-wrapper";
import {redirect} from "next/navigation";
import {getUser} from "@/features/authentication/actions/get-user";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";
import {CustomSidebar} from "@/components/sidebar/custom-sidebar";
import {MainContentWrapper} from "@/components/sidebar/main-content-wrapper";

export const dynamic = "force-dynamic";

export default async function RootLayout({
                                           children,
                                         }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  if (!user) {
    return redirect("/login");
  }

  const creditsLimits = await getCurrentCreditLimits();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Fijo */}
      <CustomSidebar />

      {/* Contenido que se desplaza */}
      <MainContentWrapper>
        <NavbarWrapper creditLimits={creditsLimits} user={user} />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </MainContentWrapper>
    </div>
  );
}
