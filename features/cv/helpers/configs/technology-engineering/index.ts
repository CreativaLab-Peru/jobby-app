import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { technologyEngineeringInternship } from "./internship"
import { technologyEngineeringScholarship } from "./scholarship"
import { technologyEngineeringExchangeProgram } from "./exchange-program"
import { technologyEngineeringEmployment } from "./employment"

export const getTechnologyEngineeringConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.EXCHANGE_PROGRAM:
      return technologyEngineeringExchangeProgram
    case OpportunityType.INTERNSHIP:
      return technologyEngineeringInternship
    case OpportunityType.SCHOLARSHIP:
      return technologyEngineeringScholarship
    case OpportunityType.EMPLOYMENT:
      return technologyEngineeringEmployment
    
    // TODO: Crear configs para otros tipos
    default:
      return technologyEngineeringEmployment
  }
}
