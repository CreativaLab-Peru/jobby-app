import { redirect } from "next/navigation";

import { AdminCreditPackageListScreen } from "@/features/credits/components/admin/admin-credit-package-list-screen";
import { getAdminCreditPackages } from "@/features/credits/actions/admin/get-admin-credit-packages";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCreditPackagesPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    active?: string;
    type?: string;
    view?: string;
  }>;
}

export default async function AdminCreditPackagesPage({ searchParams }: AdminCreditPackagesPageProps) {
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
  const type = params.type || undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminCreditPackages(skip, pageSize, {
    query: query || undefined,
    active: active || null,
    type: type || null,
  });

  const packages = result.success ? result.data.packages : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminCreditPackageListScreen
      initialPackages={packages}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialActive={active || ""}
      initialType={type || ""}
      initialView={view}
      initialError={error}
    />
  );
}

