import {prisma} from "@/lib/prisma";
import {CvSectionType} from "@prisma/client";
import {
  CvAnalysisBody,
  getOpportunitiesFromEngine
} from "@/features/opportunities/get-opportunities-from-engine";
import {saveOpportunities} from "@/features/opportunities/save-opportunities";
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).searchParams;
    const cvId = query.get("cvId");
    const userId = query.get("userId");

    if (!cvId) {
      return NextResponse.json({
        error: "No CV ID found",
      })
    }

    if (!userId) {
      return NextResponse.json({
        error: "No user ID found",
      })
    }

    const cv = await prisma.cv.findUnique({
      where: {
        id: cvId,
      },
      include: {
        sections: true
      }
    })
    if (!cv) {
      return;
    }

    // Skills section
    let skills = []
    const skillsSection = cv.sections
      .find(section => section.sectionType == CvSectionType.SKILLS)
    if (skillsSection && skillsSection.contentJson) {
      if (skillsSection.contentJson['soft']) {
        skills = [...skills, ...skillsSection.contentJson['soft']]
      }
      if (skillsSection.contentJson['technical']) {
        skills = [...skills, ...skillsSection.contentJson['technical']]
      }
    }

    // Summary section
    let summary = ''
    const summarySection = cv.sections
      .find(section => section.sectionType == CvSectionType.SUMMARY)
    if (summarySection && summarySection.contentJson) {
      if (summarySection.contentJson['text']) {
        summary = summarySection.contentJson['text']
      }
    }

    const buildBody: CvAnalysisBody = {
      user_id: userId,
      skills,
      summary,
    }

    const opportunities = await getOpportunitiesFromEngine(userId, cvId, buildBody);
    if (!opportunities) {
      return;
    }

    await saveOpportunities(cv.id, opportunities.matches)

    return new Response("Processed", { status: 200 });
  } catch (error) {
    console.error("[ERROR_TEST_ON_PROD]", error);
    return new Response("Error", { status: 500 });
  }
}
