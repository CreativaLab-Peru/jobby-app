import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { educationExchangeProgram } from "./exchange-program"
import { educationScholarship } from "./scholarship"
import { educationInternship } from "./internship"
import { educationEmployment } from "./employment"

export const getEducationConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return educationInternship

    case OpportunityType.SCHOLARSHIP:
      return educationScholarship

    case OpportunityType.EXCHANGE_PROGRAM:
      return educationExchangeProgram
     
    case OpportunityType.EMPLOYMENT:  
      return educationEmployment
      // Casos no implementados aún, por defecto
    
    // TODO: Crear configs para otros tipos  
    default:
      return educationExchangeProgram
  }
}