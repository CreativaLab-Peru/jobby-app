import { redirect } from "next/navigation";

import { AdminUserListScreen } from "@/features/user/components/admin/admin-user-list-screen";
import { getAdminUsers } from "@/features/user/actions/admin/get-admin-users";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    role?: string;
    status?: string;
    emailVerified?: string;
    view?: string;
  }>;
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10) || 1);
  const pageSize = 3;
  const skip = (page - 1) * pageSize;
  const query = params.q || "";
  const role = params.role as "USER" | "ADMIN" | undefined;
  const status = params.status as "active" | "blocked" | undefined;
  const emailVerified = params.emailVerified as "verified" | "unverified" | undefined;
  const view = (params.view === "card" ? "card" : "list") as "card" | "list";

  const result = await getAdminUsers(skip, pageSize, {
    query: query || undefined,
    role: role || null,
    status: status || null,
    emailVerified: emailVerified || null,
  });

  const users = result.success ? result.data.users : [];
  const totalCount = result.success ? result.data.totalCount : 0;
  const error = result.success ? null : (result as { error: string }).error;

  return (
    <AdminUserListScreen
      initialUsers={users}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      initialQuery={query}
      initialRole={role || ""}
      initialStatus={status || ""}
      initialEmailVerified={emailVerified || ""}
      initialView={view}
      initialError={error}
    />
  );
}

