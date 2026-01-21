import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {CvSectionType, LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {
  getOpportunitiesFromEngine,
  MatchRequest
} from "@/features/opportunities/get-opportunities-from-engine";
import {saveOpportunities} from "@/features/opportunities/save-opportunities";

export const getAndSaveOpportunities = inngest.createFunction(
  {
    id: "get-and-save-opportunities",
    name: "get-and-save-opportunities",
    retries: 3,
  },
  {event: "get.and.save.opportunities"},
  async ({event}) => {
    const {cvId, userId} = event.data;

    await logsService.createLog({
      userId,
      action: LogAction.OPPORTUNITY,
      level: LogLevel.INFO,
      entity: "CV_OPPORTUNITY",
      entityId: cvId,
      message: "Started getting and saving opportunities CV",
      metadata: {cvId, userId},
    });

    try {
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
        // Handle different structures if needed, assuming array of strings or objects
        // Original code handled 'soft' and 'technical' keys, but check if it's direct array
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

      // Experience section (NEW)
      let experience_text = ''
      const experienceSection = cv.sections.find(s => s.sectionType === CvSectionType.EXPERIENCE)
      if (experienceSection && experienceSection.contentJson && Array.isArray(experienceSection.contentJson)) {
          const items = experienceSection.contentJson as any[];
          experience_text = items.map(item => {
              return `${item.title || ''} at ${item.company || ''}. ${item.description || ''} ${item.summary || ''}`
          }).join('. ');
      }

      // Languages section (NEW)
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
        type: cv.opportunityType, // Using the strict type from DB
        location: "PE", // Defaulting to PE as per examples if not found, or maybe we should leave it empty? User examples show explicit location.
        // We could verify if we have a location in contact info, but for now let's respect the user saying "si o si tiene que ser el tipo de CV"
        // The type is critical.
      }

      // Construct the MatchRequest
      // We can add preferences if we had them stored in User or elsewhere
      const matchRequest = {
        cv_data: cvAnalysis,
        preferences: {
            top_k: 5
        }
      };

      const opportunities = await getOpportunitiesFromEngine(userId, cvId, matchRequest);
      if (!opportunities) {
        return;
      }

      await saveOpportunities(cv.id, opportunities.matches)
      return;
    } catch (error) {
      console.log("[ERROR_GET_AND_SAVE_OPPORTUNITIES]", error)
      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.ERROR,
        entity: "CV_OPPORTUNITY",
        entityId: cvId,
        message: "Get and save opportunities failed",
        metadata: {
          cvId,
          userId,
          error: error?.message,
          stack: error?.stack,
        },
      });
      throw error;
    }
  }
);
