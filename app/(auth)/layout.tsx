import Footer from "@/components/footer";
import { getSession } from "@/features/authentication/actions/get-session";
import {redirect} from "next/navigation";
import {routes} from "@/lib/routes";
import PublicNavbar from "@/components/publicNavbar";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.success) {
    return redirect(routes.app.dashboard);
  }
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar authenticated={session?.success} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
