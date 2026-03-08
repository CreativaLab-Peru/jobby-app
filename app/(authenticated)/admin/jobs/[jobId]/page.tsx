import { redirect, notFound } from "next/navigation";

import { AdminJobDetailScreen } from "@/features/jobs/components/admin/admin-job-detail-screen";
import { getAdminJobById } from "@/features/jobs/actions/admin/get-admin-job-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminJobDetailPageProps {
  params: Promise<{ jobId: string }>;
}

export default async function AdminJobDetailPage({ params }: AdminJobDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { jobId } = await params;
  const result = await getAdminJobById(jobId);

  if (!result.success) {
    notFound();
  }

  return <AdminJobDetailScreen job={result.data} />;
}

