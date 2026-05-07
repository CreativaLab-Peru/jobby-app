import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { getAdminCompanies } from "@/features/company/actions/admin/get-admin-companies";
import { AdminCompanyListScreen } from "@/features/company/components/admin/admin-company-list-screen";
import { routes } from "@/lib/routes";
import {CompanyInvitationModal} from "@/features/company/components/company-invitation-modal";

interface AdminCompaniesPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
}

const PAGE_SIZE = 10;

export default async function AdminCompaniesPage({ searchParams }: AdminCompaniesPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const skip = (page - 1) * PAGE_SIZE;

  const result = await getAdminCompanies(skip, PAGE_SIZE);

  if (!result.success) {
    return (
      <>
        <AdminCompanyListScreen
          initialCompanies={[]}
          totalCount={0}
          currentPage={page}
          pageSize={PAGE_SIZE}
          initialQuery={query}
          initialError={"Algo ha pasado"}
        />
        <CompanyInvitationModal />
      </>
    );
  }

  return (
    <>
      <AdminCompanyListScreen
        initialCompanies={result.data.companies}
        totalCount={result.data.totalCount}
        currentPage={page}
        pageSize={PAGE_SIZE}
        initialQuery={query}
      />
      <CompanyInvitationModal />
    </>
  );
}

