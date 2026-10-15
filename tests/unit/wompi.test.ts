import { describe, it, expect } from 'vitest';
import { convertCOPToCents, prepareWompiCheckoutPayload } from '@/lib/payments/wompi';

describe('Integración Wompi (Stubs)', () => {
  it('convierte montos COP a centavos requeridos por Wompi', () => {
    expect(convertCOPToCents(38000)).toBe(3800000);
    expect(convertCOPToCents(50000)).toBe(5000000);
    expect(convertCOPToCents(0)).toBe(0);
  });

  it('genera payload para el checkout de Wompi con moneda COP y referencia única', () => {
    const payload = prepareWompiCheckoutPayload({
      orderId: 'ORD-1234',
      totalCOP: 44000,
      customerEmail: 'cliente@example.com',
    });

    expect(payload.amountInCents).toBe(4400000);
    expect(payload.currency).toBe('COP');
    expect(payload.customerEmail).toBe('cliente@example.com');
    expect(payload.reference).toContain('FORNACE119-ORD-1234');
    expect(payload.publicKey).toBeDefined();
  });
});
