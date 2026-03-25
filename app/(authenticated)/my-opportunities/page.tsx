import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import { getOpportunitiesForActiveRoute } from "@/features/routes/actions/get-opportunities-for-active-route";
import MyOpportunitiesScreen from "@/features/routes/components/my-opportunities-screen";
import {getFirstUserPayment} from "@/features/billing/actions/get-first-user-payment";

export default async function MyOpportunitiesPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  const data = await getOpportunitiesForActiveRoute({ skip: 0, take: 6 });
  const userPayment = await getFirstUserPayment();
  const hasSubscription = Boolean(userPayment?.subscription && ["starter", "pro"].includes(userPayment.subscription.plan.slug));

  return (
    <MyOpportunitiesScreen
      initialData={data?.opportunities ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      hasCv={data?.hasCv ?? false}
      cvId={activeRoute.cvId ?? null}
      hasSubscription={false}
    />
  );
}

