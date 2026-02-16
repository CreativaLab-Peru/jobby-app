import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {CreditBalanceType, CvSectionType, LogAction, LogLevel, OpportunityType} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {
  getOpportunitiesFromEngine
} from "@/features/opportunities/get-opportunities-from-engine";
import {saveOpportunities} from "@/features/opportunities/save-opportunities";
import { consumeCredits } from "@/features/credits/actions/consume-credits";

// Map internal OpportunityType to external API types
/**
 * Converts internal OpportunityType to values expected by the external API.
 * Explicitly mapped types are converted, others pass through unchanged.
 * Types that pass unchanged: INTERNSHIP, SCHOLARSHIP, EXCHANGE_PROGRAM, etc.
 */
function mapOpportunityType(type: OpportunityType): string {
  const mapping: Partial<Record<OpportunityType, string>> = {
    FULL_TIME: 'EMPLOYMENT',
    PART_TIME: 'EMPLOYMENT',
    FREELANCE: 'EMPLOYMENT',
    RESEARCH_FELLOWSHIP: 'SCHOLARSHIP',
    GRADUATE_PROGRAM: 'SCHOLARSHIP',
  };

  if (type in mapping) {
    // Explicitly mapped types
    return mapping[type] as string;
  }

  // Types that pass unchanged: INTERNSHIP, SCHOLARSHIP, EXCHANGE_PROGRAM, etc.
  return type;
}

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
          sections: true,
          opportunities: true // Include existing opportunities
        }
      })
      if (!cv) {
        return;
      }

      const existingOpportunitiesCount = cv.opportunities?.length || 0;

      if (existingOpportunitiesCount > 0) {
        console.log(`[GET_AND_SAVE_OPPORTUNITIES] CV already has ${existingOpportunitiesCount} opportunities. Will update/replace them.`);

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.INFO,
          entity: "CV_OPPORTUNITY",
          entityId: cvId,
          message: `CV already has ${existingOpportunitiesCount} opportunities, searching for new matches`,
          metadata: {cvId, userId, existingOpportunitiesCount},
        });
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
        type: mapOpportunityType(cv.opportunityType), // Map internal types to API types
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


      console.log(`[GET_AND_SAVE_OPPORTUNITIES] Requesting opportunities for CV: ${cvId}`);

      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.INFO,
        entity: "CV_OPPORTUNITY",
        entityId: cvId,
        message: "Requesting opportunities from engine",
        metadata: { cvId, userId, cvData: cvAnalysis },
      });

      const opportunities = await getOpportunitiesFromEngine(userId, cvId, matchRequest);

      console.log(`[GET_AND_SAVE_OPPORTUNITIES] Response received:`, opportunities ? 'success' : 'null');

      if (!opportunities) {
        console.log(`[GET_AND_SAVE_OPPORTUNITIES] ❌ No opportunities response from engine`);

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.WARNING,
          entity: "CV_OPPORTUNITY",
          entityId: cvId,
          message: "No opportunities response from engine - credit was consumed",
          metadata: {cvId, userId},
        });
        return;
      }

      const matchCount = opportunities.matches?.length || 0;

      console.log(`[GET_AND_SAVE_OPPORTUNITIES] Match count: ${matchCount}`);

      // Consume credit if:
      // 1. Found new opportunities (user gets value) OR
      // 2. CV had previous opportunities (user is refreshing/updating)
      // Don't consume if: CV is new AND no opportunities found
      const shouldConsumeCredit = matchCount > 0 || existingOpportunitiesCount > 0;

      if (shouldConsumeCredit) {
        try {
          await consumeCredits({
            userId,
            type: CreditBalanceType.SEARCH_OPPORTUNITIES,
            amount: 1,
            description: `Búsqueda de oportunidades para CV ${cvId}`,
          });

          console.log(`[GET_AND_SAVE_OPPORTUNITIES] ✅ Credit consumed`);

          await logsService.createLog({
            userId,
            action: LogAction.OPPORTUNITY,
            level: LogLevel.INFO,
            entity: "CV_OPPORTUNITY",
            entityId: cvId,
            message: "Credit consumed for opportunity search",
            metadata: {cvId, userId, matchCount, existingOpportunitiesCount},
          });
        } catch (error) {
          console.error(`[GET_AND_SAVE_OPPORTUNITIES] ❌ Failed to consume credit:`, error);

          await logsService.createLog({
            userId,
            action: LogAction.OPPORTUNITY,
            level: LogLevel.ERROR,
            entity: "CV_OPPORTUNITY",
            entityId: cvId,
            message: `Failed to consume credit: ${error.message}`,
            metadata: {cvId, userId, matchCount, error: error.message},
          });

          // Don't throw here - the search was already done
          // Just log the error and continue
        }
      } else {
        console.log(`[GET_AND_SAVE_OPPORTUNITIES] ℹ️ No credit consumed (new CV with no results)`);

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.INFO,
          entity: "CV_OPPORTUNITY",
          entityId: cvId,
          message: "No credit consumed - new CV without matches",
          metadata: {cvId, userId, matchCount: 0, existingOpportunitiesCount: 0},
        });
      }

      if (matchCount > 0) {
        // Delete old opportunities before saving new ones
        console.log(`[GET_AND_SAVE_OPPORTUNITIES] Deleting ${existingOpportunitiesCount} old opportunities`);

        await prisma.opportunity.deleteMany({
          where: { cvId: cv.id }
        });

        // Save new opportunities
        await saveOpportunities(cv.id, opportunities.matches);

        const message = existingOpportunitiesCount > 0
          ? `${matchCount} new opportunities found and saved (replaced ${existingOpportunitiesCount} previous)`
          : `${matchCount} new opportunities found and saved`;

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.INFO,
          entity: "CV_OPPORTUNITY",
          entityId: cvId,
          message,
          metadata: {cvId, userId, opportunitiesCount: matchCount, previousCount: existingOpportunitiesCount},
        });
      } else {
        // No matches found - keep old opportunities if any exist
        let message: string;
        if (existingOpportunitiesCount > 0) {
          message = `No new matches found - keeping ${existingOpportunitiesCount} existing opportunities (credit consumed)`;
        } else {
          message = "No matches found for new CV (no credit consumed)";
        }

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.INFO,
          entity: "CV_OPPORTUNITY",
          entityId: cvId,
          message,
          metadata: {cvId, userId, opportunitiesCount: 0, previousCount: existingOpportunitiesCount, creditConsumed: shouldConsumeCredit},
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
