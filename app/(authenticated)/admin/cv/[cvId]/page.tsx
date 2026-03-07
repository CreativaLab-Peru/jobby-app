import { redirect, notFound } from "next/navigation";

import { AdminCvDetailScreen } from "@/features/cv/components/admin/admin-cv-detail-screen";
import { getAdminCvById } from "@/features/cv/actions/admin/get-admin-cv-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminCvDetailPageProps {
  params: Promise<{ cvId: string }>;
}

export default async function AdminCvDetailPage({ params }: AdminCvDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { cvId } = await params;
  const result = await getAdminCvById(cvId);

  if (!result.success) {
    notFound();
  }

  return <AdminCvDetailScreen cv={result.data} />;
}

