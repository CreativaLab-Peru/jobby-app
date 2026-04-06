import {AnalysisLoadingScreen} from "@/features/onboarding/screens/analysis-loading-screen";

interface AnalysisLoadingPageProps {
  params: Promise<{
    temporalUserId: string,
    tempCvEvaluationId: string,
  }>
}

export default async function AnalysisLoadingPage({params}: AnalysisLoadingPageProps) {
  const {tempCvEvaluationId, temporalUserId} = await params;
  return (
    <AnalysisLoadingScreen
      temporalUserId={temporalUserId}
      tempCvEvaluationId={tempCvEvaluationId}
    />
  );
}
