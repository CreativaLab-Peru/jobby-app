"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CompanyRole } from "@prisma/client";

import { requireAdmin } from "@/features/share/actions/require-admin";
import { routes } from "@/lib/routes";
import {
  companyInvitationCreateSchema,
} from "@/features/company/schemas/company-invitation.schema";
import {
  createInvitationCandidate,
  persistInvitationCandidate,
  sendCompanyInvitationEmail,
} from "@/features/company/services/company-invitation.service";

type CompanyInvitationCreateInput = z.infer<typeof companyInvitationCreateSchema>;

export type CreateCompanyInvitationState =
  | {
      success: true;
      message: string;
      invitation: {
        id: string;
        token: string;
        email: string;
        role: CompanyRole;
        expiresAt: string;
      };
      fieldErrors?: Partial<Record<keyof CompanyInvitationCreateInput, string>>;
    }
  | {
      success: false;
      error: string;
      fieldErrors?: Partial<Record<keyof CompanyInvitationCreateInput, string>>;
    };

const parseFieldErrors = (issues: z.ZodIssue[]) => {
  const fieldErrors: Partial<Record<keyof CompanyInvitationCreateInput, string>> = {};

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key as keyof CompanyInvitationCreateInput]) {
      fieldErrors[key as keyof CompanyInvitationCreateInput] = issue.message;
    }
  }

  return fieldErrors;
};
