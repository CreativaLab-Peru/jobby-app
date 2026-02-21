import {
  QuickMatchLoading
} from "@/features/opportunities/components/quick-match-loading";
import {redirect} from "next/navigation";

interface ProgressPageProps {
  params: Promise<{
    cvId: string;
  }>
}

export default async function ProgressPage({ params }: ProgressPageProps) {
  const {cvId} = await params;
  if (!cvId) {
    return redirect('/opportunities');
  }
  return (
    <QuickMatchLoading cvId={cvId} />
  )
}
