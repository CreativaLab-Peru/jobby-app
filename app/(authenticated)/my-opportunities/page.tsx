import { redirect } from "next/navigation";
import { getActiveRoute } from "@/features/routes/actions/get-active-route";
import MyOpportunitiesScreen from "@/features/routes/components/my-opportunities-screen";
import { getCvHasEvaluations } from "@/features/cv/actions/get-cv-has-evaluations";
import { Briefcase } from "lucide-react";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { PageHeader } from "@/components/shared/page-header";
import { getOpportunitiesForActiveRoute } from "@/features/routes/actions/get-opportunities-for-active-route";
import { getFirstUserPayment } from "@/features/billing/actions/get-first-user-payment";
import { getPlanNames } from "@/features/billing/actions/get-plan-names";
import { MatchProcessingScreen } from "@/features/opportunities/screens/match-processing-screen";

export default async function MyOpportunitiesPage() {
  const activeRoute = await getActiveRoute();
  if (!activeRoute) return redirect("/routes/new");

  if (!activeRoute.cv) {
    return (
      <main className="min-h-[90vh] p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Oportunidades de mi Ruta"
            description="Vacantes recomendadas por IA para el CV de tu ruta activa."
            actions={null}
          />
          <EmptyPlaceholder
            icon={Briefcase}
            title="Tu ruta activa no tiene un CV asociado"
            description="Para ver oportunidades recomendadas, primero debes asociar un CV a tu ruta activa."
          />
        </div>
      </main>
    );
  }

  const cvHasEvaluations = await getCvHasEvaluations(activeRoute.cv.id);
  if (!cvHasEvaluations) {
    return (
      <main className="min-h-[90vh] p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <PageHeader
            title="Oportunidades de mi Ruta"
            description="Vacantes recomendadas por IA para el CV de tu ruta activa."
            actions={null}
          />
          <EmptyPlaceholder
            icon={Briefcase}
            title="Tu ruta aún no tiene una evaluación de CV"
            description="Para ver oportunidades recomendadas, primero debes evaluar el CV asociado a tu ruta activa."
          />
        </div>
      </main>
    );
  }

  const data = await getOpportunitiesForActiveRoute({ skip: 0, take: 6 });

  if (data?.isMatchingInProgress) {
    return <MatchProcessingScreen cvId={activeRoute.cvId} />;
  }

  const userPayment = await getFirstUserPayment();
  const hasSubscription = Boolean(
    userPayment?.subscription && ["starter", "pro"].includes(userPayment.subscription.plan.slug),
  );

  // Fetch dynamic plan names for the UI messages via Server Action
  const planNames = await getPlanNames();

  return (
    <MyOpportunitiesScreen
      initialData={data?.opportunities ?? []}
      hasMoreProp={data?.hasMore ?? false}
      totalCount={data?.totalCount ?? 0}
      hasCv={data?.hasCv ?? false}
      cvId={activeRoute.cvId ?? null}
      hasSubscription={hasSubscription}
      planNames={planNames}
      hasMatchedOnce={data?.hasMatchedOnce ?? false}
      isMatchingInProgress={data?.isMatchingInProgress ?? false}
    />
  );
}
