import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import {CvSectionType, LogAction, LogLevel, OpportunityType} from "@prisma/client";
import {axiosClient} from "@/lib/axios-client";
import {logsService} from "@/features/share/services/logs-service";

type CvAnalysisBody = {
  user_id: string;
  skills: string[];
  summary?: string;
  experience_text?: string;
  languages?: string[];
  countries?: string[];
}

export type OpportunityResponse = {
  user_id: string;
  cv_id: string;
  matches: MatchAnalysis[];
};

export type MatchAnalysis = {
  opportunity_id: string;
  title: string;
  type: OpportunityType;
  requirements: string;
  linkUrl: string;
  deadline: Date;
  match_score: number;
  components: Record<string, any>;
};

export const getAndSaveOpportunities = inngest.createFunction(
  {
    id: "get-and-save-opportunities",
    name: "get-and-save-opportunities",
    retries: 3,
  },
  { event: "get.and.save.opportunities" },
  async ({ event }) => {
    const { cvId, userId } = event.data;

    await logsService.createLog({
      userId,
      action: LogAction.OPPORTUNITY,
      level: LogLevel.INFO,
      entity: "CV_OPPORTUNITY",
      entityId: cvId,
      message: "Started getting and saving opportunities CV",
      metadata: { cvId, userId },
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
        .find(section => section.sectionType==CvSectionType.SKILLS)
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
        .find(section => section.sectionType==CvSectionType.SUMMARY)
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

      const response = await axiosClient.post('/', buildBody);
      const opportunities = response.data as OpportunityResponse;

      for (const opp of opportunities.matches) {
        await prisma.opportunity.upsert({
          where: {
            id: opp.opportunity_id,
          },
          create: {
            type: opp.type,
            title: opp.title,
            deadline: opp.deadline,
            requirements: opp.requirements,
            linkUrl: opp.linkUrl,
            match: opp.match_score,
            cv: { connect: { id: cv.id } },
          },
          update: {
            cvId: cv.id,
            type: opp.type,
            title: opp.title,
            deadline: opp.deadline,
            requirements: opp.requirements,
            linkUrl: opp.linkUrl,
            match: opp.match_score,
          }
        });
      }
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
