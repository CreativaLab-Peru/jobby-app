import { redirect } from "next/navigation";

import { AdminBalanceListScreen } from "@/features/credits/components/admin/admin-balance-list-screen";
import { getAdminBalances } from "@/features/credits/actions/admin/get-admin-balances";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { CreditBalanceType } from "@prisma/client";

interface AdminBalancesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    type?: string;
    balanceStatus?: string;
    hasTransactions?: string;
    dateFrom?: string;
    dateTo?: string;
    view?: string;
  }>;
}

export default async function AdminBalancesPage({ searchParams }: AdminBalancesPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 10;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const type = params.type as CreditBalanceType | undefined;
  const balanceStatus = params.balanceStatus as "zero" | "positive" | undefined;
  const hasTransactions = params.hasTransactions as "yes" | "no" | undefined;
  const dateFrom = params.dateFrom || undefined;
  const dateTo = params.dateTo || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminBalances(skip, pageSize, {
    query: query || undefined,
    type: type || null,
    balanceStatus: balanceStatus || null,
    hasTransactions: hasTransactions || null,
    dateFrom: dateFrom || null,
    dateTo: dateTo || null,
  });

  const balances = result.success ? result.data.balances : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const stats = result.success
    ? result.data.stats
    : { total: 0, aiActions: 0, uploads: 0, manageCvs: 0, searchOpportunities: 0, zeroBalance: 0, totalCredits: 0 };
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminBalanceListScreen
      initialBalances={balances}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      stats={stats}
      initialQuery={query}
      initialType={type || ""}
      initialBalanceStatus={balanceStatus || ""}
      initialHasTransactions={hasTransactions || ""}
      initialDateFrom={dateFrom || ""}
      initialDateTo={dateTo || ""}
      initialView={view}
      initialError={error}
    />
  );
}
