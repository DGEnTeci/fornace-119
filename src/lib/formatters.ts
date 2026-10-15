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

/**
 * Formatea un número telefónico para visualización amigable en la interfaz
 * Ej: '573000000000' -> '+57 300 000 0000'
 */
export function formatPhoneDisplay(raw: string): string {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('57') && digits.length === 12) {
    const area = digits.slice(2, 5);
    const mid = digits.slice(5, 8);
    const end = digits.slice(8);
    return `+57 ${area} ${mid} ${end}`;
  }
  if (digits.length === 10 && digits.startsWith('3')) {
    const area = digits.slice(0, 3);
    const mid = digits.slice(3, 6);
    const end = digits.slice(6);
    return `+57 ${area} ${mid} ${end}`;
  }
  return raw.startsWith('+') ? raw : `+${raw}`;
}


