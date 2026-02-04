import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getStatisticsForUser } from "@/features/dashboard/actions/get-statistics-for-user";
import DashboardScreen from "@/features/dashboard/screens/dashboard-screen";
import { getCurrentCreditLimits } from "@/features/credits/actions/get-current-credits-limits";

export default async function DashboardPage() {
  const stats = await getStatisticsForUser();
  const score = stats?.latestEvaluation?.overallScore || 0;
  const recommendations = stats?.latestEvaluation?.recommendations || [];
  const subscription = stats?.subscription;
  const creditLimits = await getCurrentCreditLimits();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 p-6 overflow-auto">
          <DashboardScreen
            score={score}
            stats={stats}
            recommendations={recommendations as any}
            subscription={subscription as any}
            limits={creditLimits}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}
