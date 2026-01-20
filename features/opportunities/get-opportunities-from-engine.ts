import {axiosClient} from "@/lib/axios-client";
import {OpportunityType} from "@prisma/client";

export type MatchRequest = {
  cv_data: CVAnalysis;
  preferences?: UserPreferences;
  filters?: SearchFilters;
}

export type CVAnalysis = {
  text?: string;
  summary?: string;
  experience_text?: string;
  skills: string[];
  level?: "JUNIOR" | "MID" | "SENIOR" | "LEAD";
  location?: string;
  countries?: string[];
  languages?: string[];
  type?: string;
}

export type UserPreferences = {
  modality?: "REMOTE" | "HYBRID" | "ON_SITE";
  min_salary?: number;
  currency?: string;
  field_of_study?: string;
  top_k?: number;
}

export type SearchFilters = {
  exclude_expired?: boolean;
  only_eligible?: boolean;
}

export type OpportunityResponse = {
  user_id: string;
  cv_id: string;
  matches: MatchAnalysis[];
};

export type MatchAnalysis = {
  opportunity_id: string;
  title: string;
  organization?: string;
  match_score: number;
  breakdown?: {
    semantic?: number;
    skills?: number;
    eligibility?: number;
  };
  details?: {
    modality?: string;
    deadline?: string | Date;
    salary?: {
      min?: number;
      max?: number;
    };
    currency?: string;
    url?: string;
    organization_name?: string;
    organization_logo?: string;
    requirements?: string; // Adding this locally just in case, though not in example
  };
  // Keeping these for backward compatibility if needed, or mapping
  type?: string; 
};

export const getOpportunitiesFromEngine = async (
  userId: string, 
  cvId: string, 
  body: MatchRequest
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