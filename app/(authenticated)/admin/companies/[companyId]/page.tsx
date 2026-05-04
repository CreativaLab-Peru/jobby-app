import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminCompanyDetailScreen } from "@/features/company/components/admin/admin-company-detail-screen";
import { getAdminCompanyById } from "@/features/company/actions/admin/get-admin-company-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCompanyDetailPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Detalle empresa | Levely Business",
  description: "Ver detalles de la empresa",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanyDetailPage({ params }: AdminCompanyDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { companyId } = await params;
  const result = await getAdminCompanyById(companyId);

  if (!result.success) {
    redirect(routes.app.admin.companies.root);
  }

  return <AdminCompanyDetailScreen company={result.data} />;
}

