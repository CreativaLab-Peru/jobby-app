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


export const getOpportunitiesFromEngine = async (userId: string, cvId: string, body: CvAnalysisBody): Promise<OpportunityResponse | null> => {
  try {
    const response = await axiosClient.post(`/api/v1/users/${userId}/cv/${cvId}/match`, body);
    return response.data as OpportunityResponse;
  } catch (e) {
    console.error("[ERROR_GET_OPPORTUNITIES_FROM_ENGINE]:", e)
    return;
  }
}
