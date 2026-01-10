import OpportunitiesScreen from "@/features/opportunities/screens/opportunites-screen";
import {getOpportunities} from "@/features/opportunities/get-opportunities";

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities();

  return <OpportunitiesScreen initialData={opportunities} />;
}
