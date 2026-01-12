import {getStatisticsForUser} from "@/features/dashboard/actions/get-statistics-for-user";
import DashboardScreen from "@/features/dashboard/screens/dashboard-screen";

export default async function DashboardPage() {
  const stats = await getStatisticsForUser();

  // Valores por defecto en caso de que no haya data aún
  const score = stats?.latestEvaluation?.overallScore || 0;
  const recommendations = stats?.latestEvaluation?.recommendations || [];
  const subscription = stats?.subscription;
  return (
    <DashboardScreen
      score={score}
      stats={stats} // Pasamos el objeto completo para tener acceso a topOpportunities y totalCvs
      recommendations={recommendations as any} // Casting temporal si los enums de Prisma dan guerra
      subscription={subscription as any}
    />
  );
}
