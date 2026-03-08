import { redirect, notFound } from "next/navigation";

import { AdminPlanEditForm } from "@/features/billing/components/admin/admin-plan-edit-form";
import { getAdminPlanById } from "@/features/billing/actions/admin/get-admin-plan-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPlanEditPageProps {
  params: Promise<{ planId: string }>;
}

export default async function AdminPlanEditPage({ params }: AdminPlanEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { planId } = await params;
  const result = await getAdminPlanById(planId);

  if (!result.success) {
    notFound();
  }

  return <AdminPlanEditForm plan={result.data} />;
}

