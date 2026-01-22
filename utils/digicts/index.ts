/**
 * Genera un código numérico aleatorio de 6 dígitos.
 * Ejemplo: "049281"
 */
export const generateNumericCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
