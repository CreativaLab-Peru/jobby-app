import { create } from "zustand";
import { Route } from "@prisma/client";

export type RouteWithCvSummary = Route & {
  cv: {
    id: string;
    title: string | null;
    cvType: string | null;
    opportunityType: string | null;
    evaluations: { id: string; status: string; overallScore: number | null }[];
    _count: { opportunities: number };
  } | null;
  roadmapProgress?: {
    totalSteps: number;
    completedSteps: number;
    totalActions: number;
    completedActions: number;
  };
};

interface RouteState {
  activeRoute: RouteWithCvSummary | null;
  routes: RouteWithCvSummary[];
  setActiveRoute: (route: RouteWithCvSummary | null) => void;
  setRoutes: (routes: RouteWithCvSummary[]) => void;
  hydrate: (routes: RouteWithCvSummary[]) => void;
}

export const useRouteStore = create<RouteState>((set) => ({
  activeRoute: null,
  routes: [],
  setActiveRoute: (route) => set({ activeRoute: route }),
  setRoutes: (routes) => set({ routes }),
  hydrate: (routes) =>
    set({
      routes,
      activeRoute: routes.find((r) => r.isActive) ?? routes[0] ?? null,
    }),
}));

