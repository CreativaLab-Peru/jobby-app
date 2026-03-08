import { redirect, notFound } from "next/navigation";

import { AdminBalanceEditForm } from "@/features/credits/components/admin/admin-balance-edit-form";
import { getAdminBalanceById } from "@/features/credits/actions/admin/get-admin-balance-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminBalanceEditPageProps {
  params: Promise<{ balanceId: string }>;
}

export default async function AdminBalanceEditPage({ params }: AdminBalanceEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { balanceId } = await params;
  const result = await getAdminBalanceById(balanceId);

  if (!result.success) {
    notFound();
  }

  return <AdminBalanceEditForm balance={result.data} />;
}

