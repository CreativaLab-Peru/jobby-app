'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook para Next.js que extrae el query param 'lvlydebug'.
 */
export const useDebug = () => {
  const searchParams = useSearchParams();

  const debugValue = useMemo(() => {
    // Retorna el valor (string) o null si no existe
    return searchParams.get('lvlydebug');
  }, [searchParams]);

  return debugValue;
};
