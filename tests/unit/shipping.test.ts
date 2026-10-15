import { describe, it, expect } from 'vitest';
import {
  calculateDeliveryFee,
  isEligibleForFreeShipping,
  amountNeededForFreeShipping,
} from '@/lib/shipping';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

describe('Cálculo de Tarifas de Envío (Shipping)', () => {
  const { fixedFeeCOP, freeShippingThresholdCOP } = RESTAURANT_CONFIG.delivery;

  describe('calculateDeliveryFee', () => {
    it('retorna 0 para pedidos de tipo takeaway (para llevar)', () => {
      expect(calculateDeliveryFee(30000, 'takeaway')).toBe(0);
      expect(calculateDeliveryFee(100000, 'takeaway')).toBe(0);
    });

    it('aplica tarifa fija si el subtotal es menor al umbral de envío gratis', () => {
      expect(calculateDeliveryFee(38000, 'delivery')).toBe(fixedFeeCOP);
      expect(calculateDeliveryFee(69900, 'delivery')).toBe(fixedFeeCOP);
    });

    it('aplica envío gratis (0 COP) si el subtotal iguala o supera el umbral (70.000 COP)', () => {
      expect(calculateDeliveryFee(freeShippingThresholdCOP, 'delivery')).toBe(0);
      expect(calculateDeliveryFee(85000, 'delivery')).toBe(0);
    });
  });

  describe('isEligibleForFreeShipping', () => {
    it('determina si un monto califica para envío gratis', () => {
      expect(isEligibleForFreeShipping(50000)).toBe(false);
      expect(isEligibleForFreeShipping(69999)).toBe(false);
      expect(isEligibleForFreeShipping(70000)).toBe(true);
      expect(isEligibleForFreeShipping(120000)).toBe(true);
    });
  });

  describe('amountNeededForFreeShipping', () => {
    it('calcula cuánto le falta al cliente para alcanzar el beneficio de envío gratis', () => {
      expect(amountNeededForFreeShipping(50000)).toBe(20000);
      expect(amountNeededForFreeShipping(38000)).toBe(32000);
      expect(amountNeededForFreeShipping(70000)).toBe(0);
      expect(amountNeededForFreeShipping(85000)).toBe(0);
    });
  });
});
