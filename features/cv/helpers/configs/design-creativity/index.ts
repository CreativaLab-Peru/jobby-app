import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { designCreativityExchangeProgram } from "./exchange-program"
import { designCreativityScholarship } from "./scholarship"
import { designCreativityInternship } from "./internship"
import { designCreativityEmployment } from "./employment"

export const getDesignCreativityConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return designCreativityInternship

    case OpportunityType.SCHOLARSHIP:
      return designCreativityScholarship

    case OpportunityType.EXCHANGE_PROGRAM:
      return designCreativityExchangeProgram
    
    case OpportunityType.EMPLOYMENT:
      return designCreativityEmployment
    // TODO: Añadir las otras casos cuando se implementen
    // Casos no implementados aún, por defecto
    default:
      return designCreativityExchangeProgram
  }
}