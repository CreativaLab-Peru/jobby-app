import { getRoadmapsForUser } from "@/features/roadmap/actions/get-roadmaps-for-user";
import MyRoadmapsScreen from "@/features/roadmap/components/my-roadmaps-screen";
import { getOpportunitiesForActiveRoute } from "@/features/routes/actions/get-opportunities-for-active-route";
import { getStatisticsForUser } from "@/features/dashboard/actions/get-statistics-for-user";

export default async function MyRoadmapsPage() {
  const [data, opportunitiesData, stats] = await Promise.all([
    getRoadmapsForUser({ skip: 0, take: 10 }),
    getOpportunitiesForActiveRoute({ skip: 0, take: 10 }),
    getStatisticsForUser(),
  ]);

  const planSlug = stats?.subscription?.plan?.slug;
  const planTier = planSlug === "pro" ? "PRO" : planSlug === "starter" ? "STARTER" : "FREE";

  return (
    <MyRoadmapsScreen
      initialData={data?.roadmaps ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      initialOpportunities={opportunitiesData?.opportunities ?? []}
      hasCv={opportunitiesData?.hasCv ?? false}
      planTier={planTier}
    />
  );
}

