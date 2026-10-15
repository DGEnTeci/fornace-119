/**
 * Stubs y tipos para la futura integración de la pasarela de pagos Wompi (Colombia)
 * Esta capa desacopla la pasarela de pagos para ser activada mediante Next.js API Routes.
 */

export type WompiCurrency = 'COP';

export type WompiPaymentMethodType = 'CARD' | 'NEQUI' | 'BANCOLOMBIA_TRANSFER' | 'PSE';

export interface WompiTransactionParams {
  amountInCents: number; // Monto en centavos (ej: $50.000 COP = 5000000)
  currency: WompiCurrency;
  customerEmail: string;
  reference: string; // ID único del pedido
  publicKey: string;
  signature?: string;
  redirectUrl?: string;
}

export interface WompiTransactionResponse {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  reference: string;
  amountInCents: number;
  currency: WompiCurrency;
  paymentMethodType?: WompiPaymentMethodType;
  createdAt: string;
}

/**
 * Convierte un monto en pesos colombianos (COP) a centavos exigidos por la API de Wompi
 */
export function convertCOPToCents(amountCOP: number): number {
  return Math.round(amountCOP) * 100;
}

/**
 * Stub para generar el payload de inicialización de Wompi Widget / Web Checkout
 */
export function prepareWompiCheckoutPayload(params: {
  orderId: string;
  totalCOP: number;
  customerEmail: string;
  redirectUrl?: string;
}): WompiTransactionParams {
  const publicKey = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_wompi_placeholder';
  return {
    amountInCents: convertCOPToCents(params.totalCOP),
    currency: 'COP',
    customerEmail: params.customerEmail,
    reference: `FORNACE119-${params.orderId}-${Date.now()}`,
    publicKey,
    redirectUrl: params.redirectUrl,
  };
}
