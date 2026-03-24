import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getOpportunitiesForActiveRoute } from "@/features/routes/actions/get-opportunities-for-active-route";
import { getStatisticsForUser } from "@/features/dashboard/actions/get-statistics-for-user";
import MyOpportunitiesScreen from "@/features/routes/components/my-opportunities-screen";

export default async function MyOpportunitiesPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const data = await getOpportunitiesForActiveRoute({ skip: 0, take: 6 });
  const stats = await getStatisticsForUser();
  const hasSubscription = Boolean(stats?.subscription && ["starter", "pro"].includes(stats.subscription.plan.slug));

  return (
    <MyOpportunitiesScreen
      initialData={data?.opportunities ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      hasCv={data?.hasCv ?? false}
      cvId={activeRoute.cvId ?? null}
      hasSubscription={true}
    />
  );
}

