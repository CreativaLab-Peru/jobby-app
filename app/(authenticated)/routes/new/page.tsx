export const dynamic = "force-dynamic";
import CreateRouteForm from "@/features/routes/components/create-route-form";
import { getPublicitySuggestions } from "@/features/routes/actions/publicity-actions";

export default async function NewRoutePage() {
  const res = await getPublicitySuggestions();
  const initialSuggestions = res.success ? res.suggestions : [];
  
  return <CreateRouteForm initialSuggestions={initialSuggestions as any} />;
}
