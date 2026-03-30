"use client";

import { useEffect, useRef } from "react";
import { useCreditsStore } from "@/store/use-credits-store";

/**
 * Garantiza que los créditos se carguen exactamente una vez al iniciar la app.
 */
export function CreditsProvider() {
  const isLoaded = useRef(false);
  const refreshCredits = useCreditsStore((s) => s.refreshCredits);

  useEffect(() => {
    // Evitamos doble ejecución en Strict Mode de React
    if (!isLoaded.current) {
      refreshCredits();
      isLoaded.current = true;
    }
  }, [refreshCredits]);

  return null;
}
