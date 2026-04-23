export const dynamic = "force-dynamic";
import CreateRouteForm from "@/features/routes/components/create-route-form";
import { getPublicitySuggestions } from "@/features/routes/actions/publicity-actions";
import { RoutePublicitySuggestion } from "@prisma/client";

export default async function NewRoutePage() {
  const res = await getPublicitySuggestions();
  const initialSuggestions: RoutePublicitySuggestion[] = res.success ? res.suggestions : [];
  
  return <CreateRouteForm initialSuggestions={initialSuggestions} />;
}
