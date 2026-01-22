import Footer from "@/components/footer";
import NavbarPublic from "@/components/navbar-public";
import { getSession } from "@/features/authentication/actions/get-session";;

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarPublic authenticated={session?.success} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
