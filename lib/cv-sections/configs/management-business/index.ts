import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { managementBusinessExchangeProgram } from "./exchange-program"
import { managementBusinessScholarship } from "./scholarship"
import { managementBusinessInternship } from "./internship"

export const getManagementBusinessConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return managementBusinessInternship

    case OpportunityType.SCHOLARSHIP:
      return managementBusinessScholarship

    case OpportunityType.EXCHANGE_PROGRAM:
      return managementBusinessExchangeProgram
    
      // Casos no implementados aún, por defecto
    default:
      return managementBusinessExchangeProgram
  }
}