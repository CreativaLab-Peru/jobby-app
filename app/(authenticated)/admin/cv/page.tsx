import { redirect } from "next/navigation";

import { AdminCvListScreen } from "@/features/cv/components/admin/admin-cv-list-screen";
import { getAdminCvs } from "@/features/cv/actions/admin/get-admin-cvs";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";

export default async function AdminCvPage() {
  const admin = await requireAdmin();
  if (!admin.success) {
    redirect(routes.app.dashboard);
  }

  const result = await getAdminCvs(0, 10);
  const cvs = result.success ? result.data.cvs : [];
  const hasMore = result.success ? result.data.hasMore : false;
  const totalCount = result.success ? result.data.totalCount : 0;

  return (
    <AdminCvListScreen
      initialCvs={cvs}
      hasMoreProp={hasMore}
      totalCount={totalCount}
    />
  );
}

