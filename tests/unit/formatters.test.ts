import { describe, it, expect } from 'vitest';
import {
  formatCOP,
  sanitizeColombianPhone,
  isValidColombianPhone,
} from '@/lib/formatters';

describe('formatCOP', () => {
  it('formatea números a formato de pesos colombianos con separador de miles y sin decimales', () => {
    expect(formatCOP(38000)).toBe('$ 38.000');
    expect(formatCOP(58000)).toBe('$ 58.000');
    expect(formatCOP(1250000)).toBe('$ 1.250.000');
  });

  it('formatea 0 correctamente', () => {
    expect(formatCOP(0)).toBe('$ 0');
  });

  it('redondea valores con decimales a enteros antes de formatear', () => {
    expect(formatCOP(38000.4)).toBe('$ 38.000');
    expect(formatCOP(38000.8)).toBe('$ 38.001');
  });

  it('maneja valores negativos ante posibles descuentos o ajustes', () => {
    expect(formatCOP(-6000)).toBe('-$ 6.000');
  });
});

describe('sanitizeColombianPhone', () => {
  it('elimina espacios en blanco y guiones', () => {
    expect(sanitizeColombianPhone('315 123 4567')).toBe('3151234567');
    expect(sanitizeColombianPhone('315-123-4567')).toBe('3151234567');
    expect(sanitizeColombianPhone('(315) 123-4567')).toBe('3151234567');
  });

  it('remueve el prefijo de país +57 o 57 cuando contiene 12 dígitos en total', () => {
    expect(sanitizeColombianPhone('+573151234567')).toBe('3151234567');
    expect(sanitizeColombianPhone('+57 315 123 4567')).toBe('3151234567');
    expect(sanitizeColombianPhone('573151234567')).toBe('3151234567');
  });

  it('retorna cadena vacía para entradas nulas o vacías', () => {
    expect(sanitizeColombianPhone('')).toBe('');
  });
});

describe('isValidColombianPhone', () => {
  it('valida números móviles colombianos estándar de 10 dígitos que inician con 3', () => {
    expect(isValidColombianPhone('3001234567')).toBe(true);
    expect(isValidColombianPhone('3159876543')).toBe(true);
    expect(isValidColombianPhone('3204567890')).toBe(true);
  });

  it('acepta números con formato internacional (+57, 57, espacios, guiones)', () => {
    expect(isValidColombianPhone('+573001234567')).toBe(true);
    expect(isValidColombianPhone('+57 315-123-4567')).toBe(true);
    expect(isValidColombianPhone('573204567890')).toBe(true);
    expect(isValidColombianPhone(' 315 123 4567 ')).toBe(true);
  });

  it('rechaza líneas fijas colombianas (inician por 60...) o prefijos distintos a 3', () => {
    expect(isValidColombianPhone('6011234567')).toBe(false);
    expect(isValidColombianPhone('2151234567')).toBe(false);
    expect(isValidColombianPhone('4151234567')).toBe(false);
  });

  it('rechaza cadenas con longitud incorrecta o caracteres alfanuméricos', () => {
    expect(isValidColombianPhone('30012345')).toBe(false); // muy corto
    expect(isValidColombianPhone('300123456789')).toBe(false); // muy largo
    expect(isValidColombianPhone('300abc4567')).toBe(false); // caracteres no numéricos
    expect(isValidColombianPhone('')).toBe(false);
  });
});

