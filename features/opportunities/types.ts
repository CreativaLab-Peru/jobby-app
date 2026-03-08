
import { Prisma } from "@prisma/client";

export type AdminOpportunityWithRelations = Prisma.OpportunityGetPayload<{
  include: {
    cv: true,
  };
}>;

