import {redirect} from "next/navigation";
import {getTempCvAnalysis} from "@/features/temp-evaluation/actions/get-temp-cv-analysis";
import AnalysisResultsScreen from "@/features/temp-evaluation/screens/analysis-results-screen";
import {getCreditPackOffers} from "@/features/credits/actions/get-credit-pack-offers";

interface CVReviewPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function CVReviewPage({params}: CVReviewPageProps) {
  const {id} = await params;
  const [result, packs] = await Promise.all([
    getTempCvAnalysis(id),
    getCreditPackOffers(),
  ]);

  if (result.error) redirect("/cv-builder");

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <AnalysisResultsScreen
          initialData={result.data}
          score={result.score}
          id={id}
          packs={packs}
        />
      </div>
    </main>
  );
}
