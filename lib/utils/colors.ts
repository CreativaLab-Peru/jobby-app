// lib/utils/colors.ts
export function hexToHslComponents(hex: string | null | undefined): string | null {
  // 1. Validar que sea un string y tenga contenido
  if (!hex || typeof hex !== "string") return null;

  // Eliminar el # si existe
  const cleanHex = hex.replace(/^#/, "");

  // 2. Validar que sea un hex válido (3 o 6 caracteres)
  if (!/^[0-9A-F]{3}$|^[0-9A-F]{6}$/i.test(cleanHex)) return null;

  // Convertir hex corto (F00) a largo (FF0000)
  let fullHex = cleanHex;
  if (cleanHex.length === 3) {
    fullHex = cleanHex.split('').map(char => char + char).join('');
  }

  const r = parseInt(fullHex.substring(0, 2), 16) / 255;
  const g = parseInt(fullHex.substring(2, 4), 16) / 255;
  const b = parseInt(fullHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
