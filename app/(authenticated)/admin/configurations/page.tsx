import { getConfigs } from "@/features/admin-configs/actions/config-actions";
import { AdminConfigScreen } from "@/features/admin-configs/screens/admin-config-screen";

export const dynamic = "force-dynamic";

export default async function AdminConfigurationsPage() {
  const configs = await getConfigs();

  return <AdminConfigScreen initialConfigs={configs} />;
}
