import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { technologyEngineeringInternship } from "./internship"
import { technologyEngineeringScholarship } from "./scholarship"
import { technologyEngineeringExchangeProgram } from "./exchange-program"
import { technologyEngineeringFullTime } from "./full-time"
import { technologyEngineeringPartTime } from "./part-time"
import { technologyEngineeringFreelance } from "./freelance"

export const getTechnologyEngineeringConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.INTERNSHIP:
      return technologyEngineeringInternship
    
    case OpportunityType.SCHOLARSHIP:
      return technologyEngineeringScholarship
    
    case OpportunityType.EXCHANGE_PROGRAM:
      return technologyEngineeringExchangeProgram
    
    case OpportunityType.FULL_TIME:
      return technologyEngineeringFullTime
    
    case OpportunityType.PART_TIME:
      return technologyEngineeringPartTime
    
    case OpportunityType.FREELANCE:
      return technologyEngineeringFreelance
    
    // Para tipos que aún no configuramos, usar default
    case OpportunityType.RESEARCH_FELLOWSHIP:
    case OpportunityType.GRADUATE_PROGRAM:
    default:
      // Fallback: usar config de SCHOLARSHIP como base para académicos
      return technologyEngineeringScholarship
  }
}
