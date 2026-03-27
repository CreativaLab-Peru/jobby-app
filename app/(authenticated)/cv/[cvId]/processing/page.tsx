import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CvProcessingScreen } from "@/features/cv/screens/cv-processing-screen";
import {routes} from "@/lib/routes";

interface ProcessingPageProps {
  params: Promise<{ cvId: string }>;
}

export default async function CvProcessingPage({ params }: ProcessingPageProps) {

  const { cvId } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Verify CV exists and belongs to user
  const cv = await prisma.cv.findUnique({
    where: { id: cvId, userId: user.id },
    select: { userId: true, extractedJson: true, sections: { select: { id: true }, take: 1 } },
  });
  if (!cv) {
    redirect(routes.app.dashboard);
  }

  return <CvProcessingScreen cvId={cvId} />;
}

