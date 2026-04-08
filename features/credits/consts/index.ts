export type CreditPackOffer = {
  id: string;
  name: string;
  price: number;
  priceUSD?: number;
  limits: { manageCvsLimit: number; aiActionsLimit: number; opportunitiesActionsLimit: number };
  features: { text: string; included: boolean }[];
  highlight: boolean;
  variant: "outline" | "default";
};

export const CREDIT_PACKS: CreditPackOffer[] = [
  {
    id: "STARTER",
    name: "Starter",
    price: 19.90,
    limits: { manageCvsLimit: 3, aiActionsLimit: 1, opportunitiesActionsLimit: 5 },
    features: [
      { text: "Hasta 3 CVs guardados", included: true },
      { text: "Análisis y feedback de CV", included: true },
      { text: "Máximo 5 oportunidades", included: true },
      { text: "Score de empleabilidad", included: true },
      { text: "Radar Pro de oportunidades", included: false },
    ],
    highlight: false,
    variant: "outline" as const,
  },
  {
    id: "PRO",
    name: "Pro",
    price: 29.90,
    limits: { manageCvsLimit: 5, aiActionsLimit: 3, opportunitiesActionsLimit: 10 },
    features: [
      { text: "Hasta 10 CVs guardados", included: true },
      { text: "Análisis, feedback y re-análisis", included: true },
      { text: "Hasta 10 oportunidades", included: true },
      { text: "Radar Pro de oportunidades", included: true },
      { text: "Comunidad activa", included: true },
    ],
    highlight: true,
    variant: "default" as const,
  },
];
