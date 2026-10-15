/**
 * Formateador de moneda colombiana (COP) para Fornace 119
 * Garantiza montos en enteros, con punto como separador de miles y prefijo de pesos.
 */
export function formatCOP(value: number): string {
  const rounded = Math.round(value);
  const isNegative = rounded < 0;
  const absValue = Math.abs(rounded);
  const formatted = absValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return isNegative ? `-$ ${formatted}` : `$ ${formatted}`;
}

/**
 * Sanitiza números de teléfono colombianos eliminando espacios, guiones
 * y removiendo prefijo internacional +57 o 57 si fue incluido.
 */
export function sanitizeColombianPhone(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length === 12) {
    return digits.slice(2);
  }
  return digits;
}

/**
 * Valida si una cadena corresponde a un número móvil colombiano válido
 * (10 dígitos numéricos iniciando por 3).
 */
export function isValidColombianPhone(raw: string): boolean {
  const sanitized = sanitizeColombianPhone(raw);
  return /^3\d{9}$/.test(sanitized);
}

