import { notFound, redirect } from "next/navigation";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { getAdminCompanyInvitations } from "@/features/company/actions/admin/get-admin-company-invitations";
import { CompanyInvitationScreen } from "@/features/company/screens/company-invitation-screen";

interface AdminCompanyInvitationsPageProps {
  params: Promise<{
    companyId: string;
  }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminCompanyInvitationsPage({
                                                            params,
                                                            searchParams
                                                          }: AdminCompanyInvitationsPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { companyId } = await params;
  const sParams = await searchParams;

  const page = parseInt(sParams.page || "1");
  const skip = (page - 1) * PAGE_SIZE;

  const result = await getAdminCompanyInvitations(companyId, skip, PAGE_SIZE);

  if (result.success === false) {
    if (result.error === "Empresa no encontrada") notFound();

    // Si es otro error (ej. permisos), mostramos la pantalla vacía con el error
    return (
      <CompanyInvitationScreen
        companyId={companyId}
        companyName="Error"
        invitations={[]}
        totalCount={0}
        currentPage={page}
        initialError={result.error}
      />
    );
  }

  return (
    <CompanyInvitationScreen
      companyId={companyId}
      companyName={result.data.companyName}
      totalCount={result.data.totalCount}
      currentPage={page}
      invitations={result.data.invitations.map((inv) => ({
        ...inv,
        expiresAt: inv.expiresAt.toISOString(), // Serialización para Client Component
      }))}
    />
  );
}
