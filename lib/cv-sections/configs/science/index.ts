import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { scienceExchangeProgram } from "./exchange-program"
import { scienceScholarship } from "./scholarship"
import { scienceInternship } from "./internship"

export const getScienceConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return scienceInternship

    case OpportunityType.SCHOLARSHIP:
      return scienceScholarship

    case OpportunityType.EXCHANGE_PROGRAM:
      return scienceExchangeProgram
    
      // Casos no implementados aún, por defecto
    default:
      return scienceExchangeProgram
  }
}