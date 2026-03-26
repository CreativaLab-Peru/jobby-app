"use client";

import { useEffect, useRef } from "react";
import { useRouteStore } from "@/store/use-route-store";
import {RouteWithCvSummary} from "@/features/routes/actions/get-routes-for-user";

interface RouteProviderProps {
  routes: RouteWithCvSummary[];
  children: React.ReactNode;
}

/**
 * Hydrates the Zustand route store on mount with server-fetched data.
 * Must be placed inside the layout so all children can read store state.
 */
export function RouteProvider({ routes, children }: RouteProviderProps) {
  const hydrated = useRef(false);
  const hydrate = useRouteStore((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated.current) {
      hydrate(routes);
      hydrated.current = true;
    }
  }, [routes, hydrate]);

  return <>{children}</>;
}

