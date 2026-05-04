import { redirect } from "next/navigation";
import { getConfigs } from "@/features/admin-configs/actions/get-configs";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { AdminConfigScreen } from "@/features/admin-configs/screens/admin-config-screen";
import { routes } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function AdminConfigurationsPage() {
  // Verificar permisos admin antes de procesar
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  // Obtener las configuraciones
  const result = await getConfigs();
  const configs = result.success ? result.data : [];

  return <AdminConfigScreen initialConfigs={configs} />;
}
