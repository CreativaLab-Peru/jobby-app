import { redirect } from "next/navigation";

import { AdminPlanListScreen } from "@/features/billing/components/admin/admin-plan-list-screen";
import { getAdminPlansList } from "@/features/billing/actions/admin/get-admin-plans-list";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPlansPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    paymentType?: string;
    view?: string;
  }>;
}

export default async function AdminPlansPage({ searchParams }: AdminPlansPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const paymentType = params.paymentType || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminPlansList(skip, pageSize, {
    query: query || undefined,
    paymentType: paymentType || null,
  });

  const plans = result.success ? result.data.plans : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  console.log("[ADMIN_PLANS_PAGE]", { plans });

  return (
    <AdminPlanListScreen
      initialPlans={plans}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialPaymentType={paymentType || ""}
      initialView={view}
      initialError={error}
    />
  );
}

