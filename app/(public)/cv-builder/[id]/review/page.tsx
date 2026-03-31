import {redirect} from "next/navigation";
import {getTempCvAnalysis} from "@/features/temp-evaluation/actions/get-temp-cv-analysis";
import AnalysisResultsScreen from "@/features/temp-evaluation/screens/analysis-results-screen";

interface CVReviewPageProps {
  params: Promise<{
    id: string;
  }>
}

export default async function CVReviewPage({params}: CVReviewPageProps) {
  const {id} = await params;
  const result = await getTempCvAnalysis(id);

  if (result.error) redirect("/cv-builder");

  return (
    <main className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <AnalysisResultsScreen
          initialData={result.data}
          score={result.score}
          id={id}
        />
      </div>
    </main>
  );
}
