import { getEvaluationById } from "@/features/analysis/actions/get-score-by-id";
import AnalysisScore from "@/features/analysis/components/score-analysis";
import { mapEvaluationToAnalysis } from "@/features/analysis/dto/map-evaluation-to-analysis";

interface ScoreAnalysisPageProps {
  params: Promise<{
    evaluationId: string;
  }>
}

export default async function EvaluationPageId({ params }: ScoreAnalysisPageProps) {
  const { evaluationId } = await params;
  const {evaluation, opportunities} = await getEvaluationById(evaluationId);

  if (!evaluation) {
    return <div className="text-center text-gray-500">No score analysis available.</div>;
  }

  const { recommendations, scoreAnalysis, scoreBreakdown } = mapEvaluationToAnalysis(evaluation);


  return (
    <AnalysisScore
      scoreBreakdown={scoreBreakdown}
      opportunities={opportunities}
      cvScore={scoreAnalysis?.overallScore ?? 0}
      recommendations={recommendations}
    />
  )
}
