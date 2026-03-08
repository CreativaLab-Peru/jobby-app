import { redirect, notFound } from "next/navigation";

import { AdminInterviewDetailScreen } from "@/features/interview/components/admin/admin-interview-detail-screen";
import { getAdminInterviewById } from "@/features/interview/actions/admin/get-admin-interview-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminInterviewDetailPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function AdminInterviewDetailPage({ params }: AdminInterviewDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { sessionId } = await params;
  const result = await getAdminInterviewById(sessionId);

  if (!result.success) {
    notFound();
  }

  return <AdminInterviewDetailScreen interview={result.data} />;
}

