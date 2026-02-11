"use client";

import useSWR from "swr";

export interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Hook para manejar créditos con SWR.
 * Se revalida automáticamente cuando:
 * - La ventana recupera el foco
 * - Se reconecta a internet
 * - Se llama a mutate() después de consumir créditos
 */
export function useCredits(initialData?: CreditLimits) {
  const { data, error, isLoading, mutate } = useSWR<CreditLimits>(
    "/api/credits/current",
    fetcher,
    {
      fallbackData: initialData,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 5000, // Evita múltiples peticiones en 5 segundos
    }
  );

  const credits = data ?? {
    manageCvsLimit: 0,
    aiActionsLimit: 0,
    opportunitiesActionsLimit: 0,
  };

  // Función para refrescar créditos manualmente (después de consumir)
  const refreshCredits = () => mutate();

  // Funciones optimistas para decrementar créditos localmente
  const decrementManageCvs = () => {
    mutate(
      (current) =>
        current
          ? { ...current, manageCvsLimit: Math.max(0, current.manageCvsLimit - 1) }
          : current,
      { revalidate: true }
    );
  };

  const decrementAiActions = () => {
    mutate(
      (current) =>
        current
          ? { ...current, aiActionsLimit: Math.max(0, current.aiActionsLimit - 1) }
          : current,
      { revalidate: true }
    );
  };

  const decrementOpportunities = () => {
    mutate(
      (current) =>
        current
          ? { ...current, opportunitiesActionsLimit: Math.max(0, current.opportunitiesActionsLimit - 1) }
          : current,
      { revalidate: true }
    );
  };

  return {
    credits,
    isLoading,
    error,
    refreshCredits,
    decrementManageCvs,
    decrementAiActions,
    decrementOpportunities,
  };
}
