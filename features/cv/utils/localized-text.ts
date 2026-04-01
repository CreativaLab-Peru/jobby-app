import type { LocalizedText } from "@/types/cv";

export type UiLanguage = "ES" | "EN";

export function resolveLocalizedText(value: string | LocalizedText, language: UiLanguage): string {
  if (typeof value === "string") return value;
  const langKey = language === "EN" ? "en" : "es";
  return value[langKey] || "";
}
