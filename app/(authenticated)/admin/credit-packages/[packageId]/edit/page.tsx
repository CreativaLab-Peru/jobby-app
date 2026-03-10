import { redirect, notFound } from "next/navigation";

import { AdminCreditPackageEditForm } from "@/features/credits/components/admin/admin-credit-package-edit-form";
import { getAdminCreditPackageById } from "@/features/credits/actions/admin/get-admin-credit-package-by-id";
import { getAdminPlansList } from "@/features/billing/actions/admin/get-admin-plans-list";
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
  const [result, plansResult] = await Promise.all([
    getAdminCreditPackageById(packageId),
    getAdminPlansList(0, 100),
  ]);

  if (!result.success) {
    notFound();
  }

  const plans = plansResult.success ? plansResult.data.plans.map((p) => ({ id: p.id, name: p.name })) : [];

  return <AdminCreditPackageEditForm pkg={result.data} plans={plans} />;
}

