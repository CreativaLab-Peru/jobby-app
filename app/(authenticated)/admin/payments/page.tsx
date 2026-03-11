import { redirect } from "next/navigation";

import { AdminPaymentListScreen } from "@/features/billing/components/admin/admin-payment-list-screen";
import { getAdminPayments } from "@/features/billing/actions/admin/get-admin-payments";
import { getAdminPlans } from "@/features/billing/actions/admin/get-admin-plans";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminPaymentsPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    active?: string;
    planId?: string;
    view?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
}

export default async function AdminPaymentsPage({ searchParams }: AdminPaymentsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const active = params.active as "active" | "inactive" | undefined;
  const planId = params.planId || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;

  const [result, plans] = await Promise.all([
    getAdminPayments(skip, pageSize, {
      query: query || undefined,
      active: active || null,
      planId: planId || null,
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
    }),
    getAdminPlans(),
  ]);

  const payments = result.success ? result.data.payments : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminPaymentListScreen
      initialPayments={payments}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialActive={active || ""}
      initialPlanId={planId || ""}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialView={view}
      initialError={error}
      plans={plans}
    />
  );
}

