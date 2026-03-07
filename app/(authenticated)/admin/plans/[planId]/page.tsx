import { redirect, notFound } from "next/navigation";

import { AdminPlanDetailScreen } from "@/features/billing/components/admin/admin-plan-detail-screen";
import { getAdminPlanById } from "@/features/billing/actions/admin/get-admin-plan-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPlanDetailPageProps {
  params: Promise<{ planId: string }>;
}

export default async function AdminPlanDetailPage({ params }: AdminPlanDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { planId } = await params;
  const result = await getAdminPlanById(planId);

  if (!result.success) {
    notFound();
  }

  return <AdminPlanDetailScreen plan={result.data} />;
}

