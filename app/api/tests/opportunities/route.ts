import {prisma} from "@/lib/prisma";
import {CvSectionType} from "@prisma/client";
import {
  getOpportunitiesFromEngine,
  MatchRequest
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
    let skills: string[] = []
    const skillsSection = cv.sections
      .find(section => section.sectionType == CvSectionType.SKILLS)
    if (skillsSection && skillsSection.contentJson && Array.isArray(skillsSection.contentJson)) {
        const json: any = skillsSection.contentJson;
        if (json['soft']) {
           skills = [...skills, ...json['soft']]
        }
        if (json['technical']) {
           skills = [...skills, ...json['technical']]
        }
        if (Array.isArray(json)) {
             skills = [...skills, ...json.map((s: any) => typeof s === 'string' ? s : s.name)]
        }
    }

    // Summary section
    let summary = ''
    const summarySection = cv.sections
      .find(section => section.sectionType == CvSectionType.SUMMARY)
    if (summarySection && summarySection.contentJson) {
      const json: any = summarySection.contentJson;
        if (json['text']) {
          summary = json['text']
        }
    }

    // Experience section
    let experience_text = ''
    const experienceSection = cv.sections.find(s => s.sectionType === CvSectionType.EXPERIENCE)
    if (experienceSection && experienceSection.contentJson && Array.isArray(experienceSection.contentJson)) {
        const items = experienceSection.contentJson as any[];
        experience_text = items.map(item => {
            return `${item.title || ''} at ${item.company || ''}. ${item.description || ''} ${item.summary || ''}`
        }).join('. ');
    }

    // Languages section
    let languages: string[] = []
    const languagesSection = cv.sections.find(s => s.sectionType === CvSectionType.LANGUAGES)
    if (languagesSection && languagesSection.contentJson && Array.isArray(languagesSection.contentJson)) {
        const items = languagesSection.contentJson as any[];
        languages = items.map(item => item.language || item.name || '').filter(Boolean);
    }

    const cvAnalysis: any = {
      skills,
      summary,
      experience_text,
      languages,
      type: cv.opportunityType,
      location: "PE", // Default
    }

    const matchRequest: MatchRequest = {
      cv_data: cvAnalysis,
      preferences: {
        top_k: 5
      }
    };

    const opportunities = await getOpportunitiesFromEngine(userId, cvId, matchRequest);
    if (!opportunities) {
      return;
    }

    await saveOpportunities(cv, opportunities.matches)

    return new Response("Processed", { status: 200 });
  } catch (error) {
    console.error("[ERROR_TEST_ON_PROD]", error);
    return new Response("Error", { status: 500 });
  }
}
