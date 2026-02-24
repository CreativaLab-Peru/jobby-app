// page.tsx
import { getEvaluationById } from "@/features/analysis/actions/get-score-by-id";
import AnalysisScore from "@/features/analysis/components/score-analysis";
import { mapEvaluationToAnalysis } from "@/features/analysis/dto/map-evaluation-to-analysis";

interface ScoreAnalysisPageProps {
  params: Promise<{ evaluationId: string }>;
}

export default async function EvaluationPageId({ params }: ScoreAnalysisPageProps) {
  const { evaluationId } = await params;
  // KISS: Solo traemos lo que vamos a renderizar
  const { evaluation } = await getEvaluationById(evaluationId);

  if (!evaluation) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground font-medium">
        No se encontró el análisis de puntaje.
      </div>
    );
  }

  const { recommendations, scoreAnalysis, scoreBreakdown } = mapEvaluationToAnalysis(evaluation);

  return (
    <AnalysisScore
      scoreBreakdown={scoreBreakdown}
      cvScore={scoreAnalysis?.overallScore ?? 0}
      recommendations={recommendations}
    />
  );
}
