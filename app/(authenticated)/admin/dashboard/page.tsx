import {redirect} from "next/navigation";

import {requireAdmin} from "@/features/share/actions/require-admin";
import {routes} from "@/lib/routes";
import {
  getAdminDashboardStats,
} from "@/features/dashboard/actions/admin/get-admin-dashboard-stats";
import {AdminDashboardScreen} from "@/features/dashboard/screens/admin-dashboard-screen";
import {getAdminDashboardRange} from "@/features/dashboard/utils/get-range";

interface AdminDashboardPageProps {
  searchParams: Promise<{
    range?: string;
  }>;
}

export default async function AdminDashboardPage({searchParams}: AdminDashboardPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const range = getAdminDashboardRange(params.range);
  const result = await getAdminDashboardStats(range);

  const stats = result.success ? result.data : null;
  const error = result.success ? null : result.error;

  return (
    <AdminDashboardScreen
      stats={stats}
      activeRange={range}
      error={error}
    />
  );
}
