import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { socialMediaInternship } from "./internship"
import { socialMediaScholarship } from "./scholarship"
import { socialMediaExchangeProgram } from "./exchange-program"
import { socialMediaEmployment } from "./employment"

export const getSocialMediaConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.EXCHANGE_PROGRAM:
      return socialMediaExchangeProgram
    case OpportunityType.INTERNSHIP:
      return socialMediaInternship
    case OpportunityType.SCHOLARSHIP:
      return socialMediaScholarship
    case OpportunityType.EMPLOYMENT:
      return socialMediaEmployment

    // TODO: Crear configs para otros tipos  
    default:
      return socialMediaScholarship
  }
}