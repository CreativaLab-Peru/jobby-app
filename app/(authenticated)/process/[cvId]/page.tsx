import ProgressTimeline from "@/features/analysis/components/progress-timeline";

interface ProgressPageProps {
  params: Promise<{
    cvId: string
  }>
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const { cvId } = await params

  // Todo: validation if the CV can be accessed by the user (process status is activated?)

  return (
    <div className="w-full h-screen bg-transparent flex items-center justify-center px-4">
      <ProgressTimeline cvId={cvId} />
    </div>
  )
}
