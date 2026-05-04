import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminCompanyForm } from "@/features/company/components/admin/admin-company-form";
import { getAdminCompanyById } from "@/features/company/actions/admin/get-admin-company-by-id";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminCompanyEditPageProps {
  params: Promise<{
    companyId: string;
  }>;
}

export const metadata: Metadata = {
  title: "Editar empresa | Levely Business",
  description: "Edita la información de la empresa",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanyEditPage({ params }: AdminCompanyEditPageProps) {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const { companyId } = await params;
  const result = await getAdminCompanyById(companyId);

  if (!result.success) {
    redirect(routes.app.admin.companies.root);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Editar empresa</CardTitle>
            <CardDescription>
              Actualiza los datos de "{result.data.name}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminCompanyForm company={result.data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

