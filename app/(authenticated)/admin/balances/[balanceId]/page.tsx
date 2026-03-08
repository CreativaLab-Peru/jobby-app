import { redirect, notFound } from "next/navigation";

import { AdminBalanceDetailScreen } from "@/features/credits/components/admin/admin-balance-detail-screen";
import { getAdminBalanceById } from "@/features/credits/actions/admin/get-admin-balance-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminBalanceDetailPageProps {
  params: Promise<{ balanceId: string }>;
}

export default async function AdminBalanceDetailPage({ params }: AdminBalanceDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { balanceId } = await params;
  const result = await getAdminBalanceById(balanceId);

  if (!result.success) {
    notFound();
  }

  return <AdminBalanceDetailScreen balance={result.data} />;
}

