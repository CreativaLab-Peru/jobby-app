import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminCompanyForm } from "@/features/company/components/admin/admin-company-form";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Crear empresa | Levely Business",
  description: "Crea una nueva empresa y configura su información.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminCompanyNewPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Crear nueva empresa</CardTitle>
            <CardDescription>
              Ingresa los datos básicos de la empresa que deseas crear
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AdminCompanyForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

