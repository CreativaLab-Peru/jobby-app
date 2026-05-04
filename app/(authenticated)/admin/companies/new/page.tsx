import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CompanyCreateScreen } from "@/features/company/screens/company-create-screen";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Crear empresa | Levely Business",
  description: "Crea una empresa, configura sus datos básicos y comparte el enlace de acceso.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanyNewPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  return <CompanyCreateScreen />;
}

