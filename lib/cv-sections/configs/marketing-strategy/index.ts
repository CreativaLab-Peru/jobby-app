import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { marketingStrategyInternship } from "./internship"
import { marketingStrategyScholarship } from "./scholarship"
import { marketingStrategyExchangeProgram } from "./exchange-program"

export const getMarketingStrategyConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.EXCHANGE_PROGRAM:
      return marketingStrategyExchangeProgram
    case OpportunityType.INTERNSHIP:
      return marketingStrategyInternship
    case OpportunityType.SCHOLARSHIP:
      return marketingStrategyScholarship
    
    default:
      return marketingStrategyScholarship
  }
}