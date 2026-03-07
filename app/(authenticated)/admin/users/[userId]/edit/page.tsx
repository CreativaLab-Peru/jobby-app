import { redirect, notFound } from "next/navigation";

import { AdminUserForm } from "@/features/user/components/admin/admin-user-form";
import { getAdminUserById } from "@/features/user/actions/admin/get-admin-user-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminUserEditPageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminUserEditPage({ params }: AdminUserEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { userId } = await params;
  const result = await getAdminUserById(userId);

  if (!result.success) {
    notFound();
  }

  return <AdminUserForm user={result.data} />;
}

