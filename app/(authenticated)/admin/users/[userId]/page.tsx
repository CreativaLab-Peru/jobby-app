import { redirect, notFound } from "next/navigation";

import { AdminUserDetailScreen } from "@/features/user/components/admin/admin-user-detail-screen";
import { getAdminUserById } from "@/features/user/actions/admin/get-admin-user-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminUserDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserDetailPage({ params }: AdminUserDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { userId } = await params;
  const result = await getAdminUserById(userId);

  if (!result.success) {
    notFound();
  }

  return <AdminUserDetailScreen user={result.data} />;
}

