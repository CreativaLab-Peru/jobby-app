import { redirect, notFound } from "next/navigation";

import { AdminComplaintDetailScreen } from "@/features/complaints/components/admin/admin-complaint-detail-screen";
import { getAdminComplaintById } from "@/features/complaints/actions/admin/get-admin-complaint-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminComplaintDetailPageProps {
  params: Promise<{ complaintId: string }>;
}

export default async function AdminComplaintDetailPage({ params }: AdminComplaintDetailPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { complaintId } = await params;
  const result = await getAdminComplaintById(complaintId);

  if (!result.success) {
    notFound();
  }

  return <AdminComplaintDetailScreen complaint={result.data} />;
}

