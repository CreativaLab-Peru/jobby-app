import { redirect, notFound } from "next/navigation";

import { AdminCreditPackageDetailScreen } from "@/features/credits/components/admin/admin-credit-package-detail-screen";
import { getAdminCreditPackageById } from "@/features/credits/actions/admin/get-admin-credit-package-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCreditPackageDetailPageProps {
  params: Promise<{ packageId: string }>;
}

export default async function AdminCreditPackageDetailPage({ params }: AdminCreditPackageDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { packageId } = await params;
  const result = await getAdminCreditPackageById(packageId);

  if (!result.success) {
    notFound();
  }

  return <AdminCreditPackageDetailScreen pkg={result.data} />;
}

