import {axiosClient} from "@/lib/axios-client";
import {OpportunityType} from "@prisma/client";

export type CvAnalysisBody = {
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

export type CvContent = {
  summary?: string;
  experience_text?: string;
  skills: string[];
  countries?: string[];
  languages?: string[];
};

export const getOpportunitiesFromEngine = async (
  userId: string, 
  cvId: string, 
  body: { cv: CvContent, top_k?: number }
): Promise<OpportunityResponse | null> => {
  try {
    const route = `/api/match/users/${userId}/cvs/${cvId}`;
    const response = await axiosClient.post(route, body);
    return response.data as OpportunityResponse;
  } catch (e: any) {
    console.error("[ERROR_GET_OPPORTUNITIES_FROM_ENGINE]:", e);
    console.error("Error details:", {
      message: e.message,
      status: e.response?.status,
      statusText: e.response?.statusText,
      data: e.response?.data,
      url: e.config?.url,
      method: e.config?.method,
    });
    return null;
  }
};