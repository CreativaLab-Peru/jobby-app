import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getOpportunitiesForActiveRoute } from "@/features/routes/actions/get-opportunities-for-active-route";
import MyOpportunitiesScreen from "@/features/routes/components/my-opportunities-screen";

export default async function MyOpportunitiesPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const data = await getOpportunitiesForActiveRoute({ skip: 0, take: 6 });

  return (
    <MyOpportunitiesScreen
      initialData={data?.opportunities ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      hasCv={data?.hasCv ?? false}
      cvId={activeRoute.cvId ?? null}
    />
  );
}

