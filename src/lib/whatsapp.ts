import { CartState, CustomerDetails } from '@/types/cart';
import { TableReservation } from '@/types/reservation';
import { formatCOP } from './formatters';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

export const MAX_WHATSAPP_URL_LENGTH = 2000;

const OCCASION_LABELS: Record<string, string> = {
  cita: 'Cita en pareja',
  aniversario: 'Aniversario',
  cumpleanos: 'Cumpleaños',
  'reunion-negocios': 'Reunión de Negocios',
  'cena-amigos': 'Cena con Amigos',
  otro: 'Ocasión Especial',
};

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Detecta si el carrito contiene bebidas alcohólicas
 */
export function hasAlcoholicItems(
  items: { item: { isAlcoholic?: boolean; categoryId?: string; name?: string } }[]
): boolean {
  return items.some(
    (i) =>
      Boolean(i.item.isAlcoholic) ||
      (i.item.categoryId === 'bevande' &&
        /vino|chianti|cerveza|birra|alcohol/i.test(i.item.name || ''))
  );
}

/**
 * Genera el cuerpo de texto estructurado de un pedido
 */
export function formatOrderMessageText(
  cart: CartState,
  customer: CustomerDetails,
  condensed: boolean = false
): string {
  const isDelivery = customer.deliveryType === 'delivery';

  const itemsLines: string[] = [];
  cart.items.forEach((item) => {
    itemsLines.push(`• ${item.quantity}x ${item.item.name} (${formatCOP(item.totalPriceCOP)})`);
    if (!condensed) {
      if (item.selectedOptions && item.selectedOptions.length > 0) {
        item.selectedOptions.forEach((opt) => {
          itemsLines.push(`   + ${opt.name}`);
        });
      }
      if (item.notes) {
        itemsLines.push(`   Nota: ${truncateText(item.notes, 120)}`);
      }
    }
  });

  const deliveryFeeText =
    cart.deliveryFeeCOP === 0
      ? `*Envío:* Gratis (compra desde ${formatCOP(RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP)})`
      : `*Envío:* ${formatCOP(cart.deliveryFeeCOP)}`;

  const customerNotes = customer.notes ? truncateText(customer.notes, 150) : null;
  const customerAddress = customer.address ? truncateText(customer.address, 150) : null;
  const includesAlcohol = hasAlcoholicItems(cart.items);
  const alcoholWarning = includesAlcohol
    ? '🔞 *Aviso Ley 124 de 1994:* Venta de licor exclusiva para mayores de 18 años.'
    : null;

  const sections: (string | null)[] = [
    '*NUEVO PEDIDO — FORNACE 119* 🍕',
    '--------------------------------',
    `*Tipo:* ${isDelivery ? 'Domicilio' : 'Para Llevar (Take-away)'}`,
    `*Cliente:* ${customer.name}`,
    `*Teléfono:* ${customer.phone}`,
    isDelivery && customerAddress ? `*Dirección (Usaquén):* ${customerAddress}` : null,
    isDelivery && customerNotes ? `*Indicaciones:* ${customerNotes}` : null,
    `*Método de Pago Preferido:* ${customer.paymentMethod}`,
    '--------------------------------',
    '*RESUMEN DEL PEDIDO:*',
    itemsLines.join('\n'),
    '--------------------------------',
    `*Subtotal:* ${formatCOP(cart.subtotalCOP)}`,
    isDelivery ? deliveryFeeText : null,
    `*TOTAL A PAGAR:* ${formatCOP(cart.totalCOP)}`,
    alcoholWarning,
    '--------------------------------',
    '_Por favor confírmenme el tiempo estimado de entrega/preparación._',
  ];

  return sections.filter(Boolean).join('\n');
}

/**
 * Genera la URL con mensaje estructurado para confirmar pedidos vía WhatsApp Business
 * Aplica encodeURIComponent y protección contra URLs excesivamente largas (> 2000 chars)
 */
export function generateOrderWhatsAppUrl(
  phone: string,
  cart: CartState,
  customer: CustomerDetails
): string {
  let message = formatOrderMessageText(cart, customer, false);
  let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // Si excede el límite seguro para web y dispositivos móviles (2000 caracteres)
  if (url.length > MAX_WHATSAPP_URL_LENGTH) {
    message = formatOrderMessageText(cart, customer, true);
    url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Si aún condensado excede 2000 caracteres debido a una cantidad anormal de ítems
    if (url.length > MAX_WHATSAPP_URL_LENGTH) {
      const allowedEncodedLength = MAX_WHATSAPP_URL_LENGTH - `https://wa.me/${phone}?text=`.length;
      const truncatedMessage = message.slice(0, Math.floor(allowedEncodedLength / 3)) + '\n...(Resumen recortado por longitud)';
      url = `https://wa.me/${phone}?text=${encodeURIComponent(truncatedMessage)}`;
    }
  }

  return url;
}

/**
 * Genera el cuerpo de texto estructurado de una solicitud de reserva
 */
export function formatReservationMessageText(reservation: TableReservation): string {
  const occasionText = OCCASION_LABELS[reservation.occasion] || reservation.occasion;
  const guestsText = reservation.guestCount === 1 ? '1 persona' : `${reservation.guestCount} personas`;
  const specialRequests = reservation.specialRequests ? truncateText(reservation.specialRequests, 200) : null;

  const sections: (string | null)[] = [
    '*SOLICITUD DE RESERVA — FORNACE 119* 🍷',
    '--------------------------------',
    `*Cliente:* ${reservation.fullName}`,
    `*Teléfono:* ${reservation.phone}`,
    reservation.email ? `*Correo:* ${reservation.email}` : null,
    `*Fecha:* ${reservation.date}`,
    `*Hora:* ${reservation.time}`,
    `*Comensales:* ${guestsText}`,
    `*Ocasión:* ${occasionText}`,
    specialRequests ? `*Peticiones especiales:* ${specialRequests}` : null,
    '--------------------------------',
    '_Solicitud sujeta a confirmación de disponibilidad por Fornace 119._',
  ];

  return sections.filter(Boolean).join('\n');
}

/**
 * Genera la URL con mensaje estructurado para solicitar reservas de mesa en salón
 */
export function generateReservationWhatsAppUrl(
  phone: string,
  reservation: TableReservation
): string {
  const message = formatReservationMessageText(reservation);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
