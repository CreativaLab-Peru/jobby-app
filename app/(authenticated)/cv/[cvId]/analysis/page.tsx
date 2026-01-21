import { redirect } from "next/navigation";
import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import ProgressTimeline from "@/features/analysis/components/progress-timeline";

interface AnalysisCVPageProps {
  params: Promise<{
    cvId: string;
  }>;
}

export default async function AnalysisCVPage({ params }: AnalysisCVPageProps) {
  const { cvId } = await params;
  
  if (!cvId) {
    return redirect('/cv');
  }
  
  const cv = await getCvById(cvId);
  if (!cv) {
    return redirect('/cv');
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressTimeline cvId={cvId} />
      </div>
    </div>
  );
}
