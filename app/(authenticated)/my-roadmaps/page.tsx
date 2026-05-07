import { redirect } from "next/navigation";
import {getRoadmapsForUser} from "@/features/roadmap/actions/get-roadmaps-for-user";
import MyRoadmapsScreen from "@/features/roadmap/components/my-roadmaps-screen";
import {
  getOpportunitiesForActiveRoute
} from "@/features/routes/actions/get-opportunities-for-active-route";
import {getStatisticsForUser} from "@/features/dashboard/actions/get-statistics-for-user";
import { getActiveRoadmap } from "@/features/roadmap/actions/get-active-roadmap";

interface MyRoadmapsPageProps {
  searchParams?: Promise<{
    openedModal?: boolean;
  }>
}

export default async function MyRoadmapsPage({searchParams}: MyRoadmapsPageProps) {
  const {openedModal = false} = searchParams ? await searchParams : {};

  const activeRoadmap = await getActiveRoadmap();
  if (activeRoadmap) {
    return redirect(`/my-roadmaps/${activeRoadmap.id}`);
  }

  const [data, opportunitiesData, stats] = await Promise.all([
    getRoadmapsForUser({skip: 0, take: 10}),
    getOpportunitiesForActiveRoute({skip: 0, take: 10}),
    getStatisticsForUser(),
  ]);

  const planSlug = stats?.subscription?.plan?.slug;
  const planTier = planSlug === "pro" ? "PRO" : planSlug === "starter" ? "STARTER" : "FREE";
  const openedModalMapped = Boolean(openedModal) ?? false;

  return (
    <MyRoadmapsScreen
      initialData={data?.roadmaps ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      initialOpportunities={opportunitiesData?.opportunities ?? []}
      hasCv={opportunitiesData?.hasCv ?? false}
      planTier={planTier}
      openedModal={openedModalMapped}
    />
  );
}

