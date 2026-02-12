import OpportunitiesScreen from "@/features/opportunities/screens/opportunites-screen";
import {getOpportunities, paginationParams} from "@/features/opportunities/get-opportunities";

export default async function OpportunitiesPage() {
  const params: paginationParams = {
    skip: 0,
    take: 6,
  }
  const data = await getOpportunities(params);
  const hasMore = data ? data.hasMore : false;
  return (
    <OpportunitiesScreen
      initialData={data.opportunities}
      hasMoreProp={hasMore}
      totalCount={data.totalCount}
    />
  );
}
