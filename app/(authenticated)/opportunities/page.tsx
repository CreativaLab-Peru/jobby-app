import OpportunitiesScreen from "@/features/opportunities/screens/opportunites-screen";
import {getOpportunities, paginationParams} from "@/features/opportunities/get-opportunities";
import {getAllCvForCurrentUser} from "@/features/cv/actions/get-all-cv-for-current-user";
import {getActiveRoute} from "@/features/routes/actions/get-active-route";
import { getStatisticsForUser } from "@/features/dashboard/actions/get-statistics-for-user";

type OpportunitiesPageProps = {
  searchParams?: Promise<{
    cvId?: string;
  }>
}

export default async function OpportunitiesPage({
                                                   searchParams
                                                 }: OpportunitiesPageProps) {
  const { cvId: paramCvId } = searchParams ? await searchParams : {};
  const activeRoute = await getActiveRoute();

  // Use the route's cvId as default if no explicit filter is provided
  const cvId = paramCvId || activeRoute?.cvId || undefined;

  const params: paginationParams = {
    skip: 0,
    take: 6,
    cvId
  }

  const [data, cvData] = await Promise.all([
    getOpportunities(params),
    getAllCvForCurrentUser(0, 50),
  ]);

  const stats = await getStatisticsForUser();
  const hasSubscription = Boolean(stats?.subscription && ["starter", "pro"].includes(stats.subscription.plan.slug));

  const hasMore = data ? data.hasMore : false;
  const initialCvs = cvData.cvs;

  return (
    <OpportunitiesScreen
      initialCvs={initialCvs}
      initialData={data?.opportunities || []}
      hasMoreProp={hasMore}
      totalCount={data?.totalCount || 0}
      currentFilterCvId={cvId || null}
      hasSubscription={true}
    />
  );
}
