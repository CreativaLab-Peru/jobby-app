import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normaliza un valor de LinkedIn (puede venir como URL completa, con o sin https://)
 * y devuelve la URL completa para usar en href.
 * Ejemplos de entrada válidos:
 *   "linkedin.com/in/john-doe"
 *   "https://www.linkedin.com/in/john-doe"
 *   "www.linkedin.com/in/john-doe"
 */
export function linkedinHref(value: string): string {
  if (!value) return ""
  const clean = value.trim()
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean
  return "https://" + clean
}

/**
 * Devuelve el texto a mostrar del LinkedIn sin el protocolo (https://).
 * Ejemplo: "linkedin.com/in/john-doe"
 */
export function linkedinDisplay(value: string): string {
  if (!value) return ""
  return value.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "")
}

