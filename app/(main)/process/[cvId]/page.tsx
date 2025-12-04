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
    <div className="h-full bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4">
      <ProgressTimeline cvId={cvId} />
    </div>
  )
}
