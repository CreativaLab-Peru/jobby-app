import Footer from "@/components/footer";
import Header from "@/components/header";
import { getSession } from "@/features/authentication/actions/get-session";
import {redirect} from "next/navigation";
import {routes} from "@/lib/routes";

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
      <Header authenticated={session?.success} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
