import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { financeProjectsExchangeProgram } from "./exchange-program"
import { financeProjectsInternship } from "./internship"
import { financeProjectsScholarship } from "./scholarship"
import { financeProjectsEmployment } from "./employment"

export const getFinanceProjectsConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.EXCHANGE_PROGRAM:
      return financeProjectsExchangeProgram
    case OpportunityType.INTERNSHIP:
      return financeProjectsInternship
    case OpportunityType.SCHOLARSHIP:
      return financeProjectsScholarship 
    case OpportunityType.EMPLOYMENT:
      return financeProjectsEmployment  

    //TODO: Crear configs para otros tipos 
    default:
      return financeProjectsExchangeProgram
  }
}