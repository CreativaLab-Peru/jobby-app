export const dynamic = "force-dynamic";
import { PublicityAdminView } from "@/features/routes/components/publicity-admin-view";
import { getAllPublicitySuggestions } from "@/features/routes/actions/publicity-actions";

export default async function RoutesPublicityPage() {
  const res = await getAllPublicitySuggestions();
  const initialSuggestions = res.success ? res.suggestions : [];
  
  return (
    <div className="p-6">
      <PublicityAdminView initialSuggestions={initialSuggestions as any} />
    </div>
  );
}
