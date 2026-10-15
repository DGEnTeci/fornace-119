import { DeliveryType } from '@/types/cart';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

/**
 * Determina el cobro de envío según el subtotal y el tipo de entrega:
 * - Takeaway: 0 COP
 * - Delivery >= umbral ($70.000 COP): 0 COP
 * - Delivery < umbral: $6.000 COP
 */
export function calculateDeliveryFee(subtotalCOP: number, deliveryType: DeliveryType): number {
  if (deliveryType === 'takeaway') {
    return 0;
  }
  const { fixedFeeCOP, freeShippingThresholdCOP } = RESTAURANT_CONFIG.delivery;
  return subtotalCOP >= freeShippingThresholdCOP ? 0 : fixedFeeCOP;
}

/**
 * Valida si un subtotal califica para el beneficio de envío gratis
 */
export function isEligibleForFreeShipping(subtotalCOP: number): boolean {
  return subtotalCOP >= RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP;
}

/**
 * Retorna el monto faltante para acceder al envío gratis
 */
export function amountNeededForFreeShipping(subtotalCOP: number): number {
  const diff = RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP - subtotalCOP;
  return diff > 0 ? diff : 0;
}
