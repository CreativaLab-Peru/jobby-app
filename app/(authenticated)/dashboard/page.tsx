import {getStatisticsForUser} from "@/features/dashboard/actions/get-statistics-for-user";
import DashboardScreen from "@/features/dashboard/screens/dashboard-screen";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

export default async function DashboardPage() {
  const stats = await getStatisticsForUser();
  const score = stats?.latestEvaluation?.overallScore || 0;
  const recommendations = stats?.latestEvaluation?.recommendations || [];
  const subscription = stats?.subscription;
  const creditLimits = await getCurrentCreditLimits();
  const sector = stats?.latestEvaluation?.cv?.cvType || null;
  const cvTitle = stats?.latestEvaluation?.cv?.title || null;

  return (
    <DashboardScreen
      score={score}
      stats={stats}
      recommendations={recommendations as any}
      subscription={subscription as any}
      limits={creditLimits}
      sector={sector}
      cvTitle={cvTitle}
    />
  );
}
