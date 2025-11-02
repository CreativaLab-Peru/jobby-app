// design-creativity/index.ts
import { OpportunityType } from "@prisma/client"
import type { ConfigGetter } from "../../types"
import { financeProjectsExchangeProgram } from "./exchange-program"
// ... importar otros

export const getFinanceProjectsConfig: ConfigGetter = (opportunityType) => {
  switch (opportunityType) {
    case OpportunityType.EXCHANGE_PROGRAM:
      return financeProjectsExchangeProgram
    
      // Casos no implementados aún, por defecto
    default:
      return financeProjectsExchangeProgram
  }
}