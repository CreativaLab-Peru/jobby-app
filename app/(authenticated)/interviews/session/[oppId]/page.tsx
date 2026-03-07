import InterviewSessionScreen from "@/features/interview/screens/interview-session-screen";

interface InterviewSessionScreenProps {
  params: Promise<{
    oppId: string
  }>;
  searchParams?: Promise<{
    cvId?: string;
  }>
}

export default async function InterviewSessionPage({
  params,
  searchParams,
                                                     }: InterviewSessionScreenProps) {
  const { oppId } = await params;
  const { cvId } = searchParams ? await searchParams : {};
  return (
    <InterviewSessionScreen
      cvId={cvId}
      oppId={oppId}
    />
  )
}
