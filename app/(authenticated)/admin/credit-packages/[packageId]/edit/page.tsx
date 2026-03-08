import { redirect, notFound } from "next/navigation";

import { AdminCreditPackageEditForm } from "@/features/credits/components/admin/admin-credit-package-edit-form";
import { getAdminCreditPackageById } from "@/features/credits/actions/admin/get-admin-credit-package-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCreditPackageEditPageProps {
  params: Promise<{ packageId: string }>;
}

export default async function AdminCreditPackageEditPage({ params }: AdminCreditPackageEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { packageId } = await params;
  const result = await getAdminCreditPackageById(packageId);

  if (!result.success) {
    notFound();
  }

  return <AdminCreditPackageEditForm pkg={result.data} />;
}

