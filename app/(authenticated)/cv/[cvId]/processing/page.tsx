import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CvProcessingScreen } from "@/features/cv/screens/cv-processing-screen";

interface ProcessingPageProps {
  params: Promise<{ cvId: string }>;
}

export default async function CvProcessingPage({ params }: ProcessingPageProps) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { cvId } = await params;

  // Verify CV exists and belongs to user
  const cv = await prisma.cv.findUnique({
    where: { id: cvId },
    select: { userId: true, extractedJson: true, sections: { select: { id: true }, take: 1 } },
  });

  if (!cv || cv.userId !== user.id) {
    redirect("/cv");
  }

  // If already processed, redirect directly to edit
  if (cv.extractedJson || cv.sections.length > 0) {
    redirect(`/cv/${cvId}/edit`);
  }

  return <CvProcessingScreen cvId={cvId} />;
}

