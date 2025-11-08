import { format } from "date-fns";

/**
 * Format a given date into a consistent string representation.
 */
export function formatDate(date?: Date | string | null, pattern = "yyyy-MM-dd"): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "";

  try {
    return format(d, pattern);
  } catch (error) {
    console.error("Invalid date passed to formatDate:", date, error);
    return "";
  }
}
