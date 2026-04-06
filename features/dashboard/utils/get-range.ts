export const ADMIN_DASHBOARD_RANGES = ["3d", "7d", "1m", "3m", "6m"] as const;
export type AdminDashboardRange = (typeof ADMIN_DASHBOARD_RANGES)[number];

export const getAdminDashboardRange = (value?: string | null): AdminDashboardRange => {
  if (!value) return "7d";
  if (ADMIN_DASHBOARD_RANGES.includes(value as AdminDashboardRange)) {
    return value as AdminDashboardRange;
  }
  return "7d";
};
