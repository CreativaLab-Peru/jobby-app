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
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminBalances(skip, pageSize, {
    query: query || undefined,
    type: type || null,
  });

  const balances = result.success ? result.data.balances : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminBalanceListScreen
      initialBalances={balances}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialType={type || ""}
      initialView={view}
      initialError={error}
    />
  );
}

