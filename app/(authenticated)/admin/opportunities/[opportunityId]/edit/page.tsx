import { redirect, notFound } from "next/navigation";

import { AdminOpportunityEditForm } from "@/features/opportunities/components/admin/admin-opportunity-edit-form";
import { getAdminOpportunityById } from "@/features/opportunities/actions/admin/get-admin-opportunity-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

interface AdminOpportunityEditPageProps {
  params: Promise<{ opportunityId: string }>;
  searchParams: Promise<{ cvId?: string }>;
}

export default async function AdminOpportunityEditPage({
  params,
  searchParams,
}: AdminOpportunityEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { opportunityId } = await params;
  const { cvId } = await searchParams;

  if (!cvId) {
    redirect(routes.app.admin.opportunities.root);
  }

  const result = await getAdminOpportunityById(opportunityId, cvId);

  if (!result.success) {
    notFound();
  }

  return <AdminOpportunityEditForm opportunity={result.data} />;
}

