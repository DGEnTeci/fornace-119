'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StoredOrder } from '@/types/cart';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { formatCOP } from '@/lib/formatters';
import { formatOrderMessageText, generateOrderWhatsAppUrl } from '@/lib/whatsapp';
import { Clock, MapPin, Sparkles, Copy, Check, MessageSquare, Send } from 'lucide-react';

export interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: StoredOrder | null;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const isDelivery = order.customer.deliveryType === 'delivery';

  // Generar el mensaje estructurado de WhatsApp
  const rawCartState = {
    items: order.items,
    subtotalCOP: order.subtotalCOP,
    deliveryFeeCOP: order.deliveryFeeCOP,
    totalCOP: order.totalCOP,
    itemCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
    isEligibleForFreeShipping: order.deliveryFeeCOP === 0 && isDelivery,
    amountNeededForFreeShippingCOP: 0,
  };

  const messageText = formatOrderMessageText(rawCartState, order.customer);
  const whatsappUrl = generateOrderWhatsAppUrl(
    RESTAURANT_CONFIG.whatsapp.phone,
    rawCartState,
    order.customer
  );

  const handleOpenWhatsAppAgain = () => {
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCopyMessage = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(messageText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error('Error al copiar al portapapeles:', e);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Listo para enviar: pulsa Enviar en WhatsApp; el restaurante te confirmará el tiempo"
      description="Fornace 119 — Paso final de tu orden"
      maxWidth="md"
    >
      <div className="space-y-5 pt-2">
        {/* Aviso de acción requerida en WhatsApp */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-amber-950">
              WhatsApp está abierto con tu mensaje estructurado
            </p>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              Recuerda pulsar el botón verde de <strong>Enviar</strong> dentro de WhatsApp. Nuestro equipo en Usaquén confirmará el tiempo de horneado y recepción.
            </p>
          </div>
        </div>

        {/* Acciones de recuperación: Reabrir o Copiar */}
        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenWhatsAppAgain}
            className="flex-1 gap-2 text-xs"
          >
            <Send className="w-4 h-4 text-emerald-700" />
            <span>Abrir WhatsApp de nuevo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyMessage}
            className="flex-1 gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-700" />
                <span className="text-emerald-800 font-semibold">¡Mensaje copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-charcoal-700" />
                <span>Copiar mensaje</span>
              </>
            )}
          </Button>
        </div>

        {/* Detalles resumidos del pedido */}
        <div className="bg-cream-100 rounded-2xl p-4 border border-charcoal-700/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-charcoal-500 uppercase tracking-wider font-semibold border-b border-charcoal-700/10 pb-2">
            <span>Orden #{order.id}</span>
            <span>{isDelivery ? 'Domicilio (Usaquén)' : 'Para Llevar (Take-away)'}</span>
          </div>

          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {order.items.map((cartItem) => (
              <div
                key={cartItem.id}
                className="flex items-start justify-between text-sm py-1 border-b border-charcoal-700/5 last:border-none"
              >
                <div>
                  <span className="font-medium text-charcoal-900">
                    {cartItem.quantity}x {cartItem.item.name}
                  </span>
                  {cartItem.selectedOptions?.length > 0 && (
                    <p className="text-xs text-charcoal-500">
                      {cartItem.selectedOptions.map((o) => `+ ${o.name}`).join(', ')}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-charcoal-900 shrink-0 ml-2">
                  {formatCOP(cartItem.totalPriceCOP)}
                </span>
              </div>
            ))}
          </div>

          {/* Desglose de totales */}
          <div className="pt-2 border-t border-charcoal-700/10 text-sm space-y-1">
            <div className="flex justify-between text-charcoal-600">
              <span>Subtotal:</span>
              <span>{formatCOP(order.subtotalCOP)}</span>
            </div>
            {isDelivery && (
              <div className="flex justify-between text-charcoal-600">
                <span>Tarifa de envío:</span>
                <span>
                  {order.deliveryFeeCOP === 0 ? 'Gratis' : formatCOP(order.deliveryFeeCOP)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-charcoal-900 pt-1 border-t border-charcoal-700/10">
              <span>Total:</span>
              <span className="text-terracotta">{formatCOP(order.totalCOP)}</span>
            </div>
          </div>
        </div>

        {/* Tiempo estimado e información del restaurante */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-cream-50 rounded-xl border border-charcoal-700/10 flex items-center gap-2">
            <Clock className="w-4 h-4 text-terracotta shrink-0" />
            <div>
              <span className="text-charcoal-500 block">Tiempo de Entrega</span>
              <span className="font-semibold text-charcoal-900">
                {RESTAURANT_CONFIG.delivery.estimatedTimeApproximate}
              </span>
            </div>
          </div>

          <div className="p-3 bg-cream-50 rounded-xl border border-charcoal-700/10 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta shrink-0" />
            <div>
              <span className="text-charcoal-500 block">Horno Principal</span>
              <span className="font-semibold text-charcoal-900 truncate block">
                {RESTAURANT_CONFIG.location.neighborhood}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de cierre y confirmación de vaciado */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full gap-2"
            onClick={onClose}
          >
            <Sparkles className="w-4 h-4" />
            <span>Entendido, volver a la carta</span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
