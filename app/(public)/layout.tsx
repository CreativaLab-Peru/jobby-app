import Footer from "@/components/footer";
import Header from "@/components/header";
import { getSession } from "@/features/authentication/actions/get-session";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  return (
    <div className="min-h-screen flex flex-col">
      <Header authenticated={session?.success} />
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
}

