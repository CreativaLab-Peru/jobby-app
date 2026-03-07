import { getInterviews } from "@/features/interview/actions/get-interviews";
import { getOpportunities } from "@/features/opportunities/get-opportunities";
import InterviewsScreen from "@/features/interview/screens/interviews-screen";

export default async function InterviewsPage() {
  const [data, oppsData] = await Promise.all([
    getInterviews({ skip: 0, take: 6 }),
    getOpportunities({ skip: 0, take: 50 }) // Para el filtro de oportunidades
  ]);

  return (
    <InterviewsScreen
      initialData={data?.interviews || []}
      initialTotal={data?.totalCount || 0}
      initialHasMore={data?.hasMore || false}
      opportunities={oppsData?.opportunities || []}
    />
  );
}
