import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {CvSectionType, LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {
  CvAnalysisBody,
  getOpportunitiesFromEngine
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
