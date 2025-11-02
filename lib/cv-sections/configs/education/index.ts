import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { educationExchangeProgram } from "./exchange-program"
import { educationScholarship } from "./scholarship"
import { educationInternship } from "./internship"

export const getEducationConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return educationInternship

    case OpportunityType.SCHOLARSHIP:
      return educationScholarship

    case OpportunityType.EXCHANGE_PROGRAM:
      return educationExchangeProgram
    
      // Casos no implementados aún, por defecto
    default:
      return educationExchangeProgram
  }
}