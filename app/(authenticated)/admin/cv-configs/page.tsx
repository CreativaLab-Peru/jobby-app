import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import { getAdminCvConfigs } from "@/features/cv-config/actions/admin/cv-config-actions";
import {AdminCvConfigScreen} from "@/features/cv-config/screens/admin-cv-config-screen";

export default async function AdminCvConfigsPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  // Obtenemos todas las combinaciones (Tech/Employment, etc.)
  const configs = await getAdminCvConfigs();

  // Serializamos para evitar errores de objetos complejos en el paso a Client Components
  const serializedConfigs = JSON.parse(JSON.stringify(configs));

  return (
    <AdminCvConfigScreen
      initialConfigs={serializedConfigs}
    />
  );
}
