import Footer from "@/components/footer";
import PublicNavbar from "@/components/publicNavbar";
import { getSession } from "@/features/authentication/actions/get-session";
import { PaddleProvider } from "@/features/billing/components/paddle-provider";
import CookieBanner from "@/components/cookie-banner";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar authenticated={session?.success} />
      <PaddleProvider>
        <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      </PaddleProvider>
      <Footer />

      {/* El banner se renderiza al final para que el z-index sea efectivo */}
      <CookieBanner />
    </div>
  );
}
