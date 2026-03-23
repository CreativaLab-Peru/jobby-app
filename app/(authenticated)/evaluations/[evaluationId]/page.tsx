import { getEvaluationById } from "@/features/analysis/actions/get-score-by-id";
import AnalysisScore from "@/features/analysis/components/score-analysis";
import { mapEvaluationToAnalysis } from "@/features/analysis/dto/map-evaluation-to-analysis";

interface ScoreAnalysisPageProps {
  params: Promise<{ evaluationId: string }>;
}

export default async function EvaluationPageId({ params }: ScoreAnalysisPageProps) {
  const { evaluationId } = await params;
  // KISS: Solo traemos lo que vamos a renderizar
  const data = await getEvaluationById(evaluationId);

  if (!data?.evaluation) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground font-medium">
        No se encontró el análisis de puntaje.
      </div>
    );
  }

  const { recommendations, scoreAnalysis, scoreBreakdown } = mapEvaluationToAnalysis(data.evaluation);

  // Extract improvements from the evaluation
  const improvements = data.improvementsJson as {
    improvedTexts?: any[];
    suggestedAdditions?: any[];
  } | null;

  return (
    <AnalysisScore
      scoreBreakdown={scoreBreakdown}
      cvScore={scoreAnalysis?.overallScore ?? 0}
      recommendations={recommendations}
      cvId={data.cvId}
      improvedTexts={improvements?.improvedTexts ?? []}
      suggestedAdditions={improvements?.suggestedAdditions ?? []}
    />
  );
}
