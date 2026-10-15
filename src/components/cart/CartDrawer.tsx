'use client';

import React, { useState, useMemo } from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useLastOrder } from '@/hooks/useLastOrder';
import { CustomerDetails, DeliveryType, StoredOrder } from '@/types/cart';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { formatCOP, isValidColombianPhone, sanitizeColombianPhone } from '@/lib/formatters';
import { generateOrderWhatsAppUrl, hasAlcoholicItems } from '@/lib/whatsapp';
import { OrderConfirmationModal } from './OrderConfirmationModal';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Bike,
  Store,
  Send,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

import { UseCartReturn } from '@/hooks/useCart';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart?: UseCartReturn;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof CustomerDetails, string>>;
}

/**
 * Validador estricto para los datos del cliente
 * Teléfono: móvil colombiano de 10 dígitos iniciando por 3 (ej. 3001234567)
 * Dirección: obligatoria únicamente si deliveryType es 'delivery'
 */
export function validateCustomerDetails(
  details: CustomerDetails
): ValidationResult {
  const errors: Partial<Record<keyof CustomerDetails, string>> = {};

  if (!details.name || details.name.trim().length < 2) {
    errors.name = 'Ingresa tu nombre (mínimo 2 caracteres).';
  }

  if (!isValidColombianPhone(details.phone || '')) {
    errors.phone = 'El teléfono debe iniciar por 3 y tener 10 dígitos (ej. 3001234567).';
  }

  if (details.deliveryType === 'delivery') {
    if (!details.address || details.address.trim().length < 5) {
      errors.address = 'Ingresa tu dirección completa de entrega en Usaquén.';
    }
  }

  if (!details.paymentMethod || details.paymentMethod.trim().length === 0) {
    errors.paymentMethod = 'Selecciona un método de pago.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart: customCart,
}) => {
  const contextCart = useCart();
  const cart = customCart || contextCart;
  const lastOrderHook = useLastOrder();

  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    deliveryType: cart.deliveryType,
    address: '',
    notes: '',
    paymentMethod: RESTAURANT_CONFIG.paymentMethods[0] || 'Transferencia digital (Nequi / Daviplata)',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<StoredOrder | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Sincronizar el tipo de entrega del formulario con el estado del carrito
  const handleDeliveryTypeChange = (type: DeliveryType) => {
    cart.setDeliveryType(type);
    setCustomer((prev) => ({ ...prev, deliveryType: type }));
    setLiveAnnouncement(`Tipo de entrega cambiado a ${type === 'delivery' ? 'Domicilio' : 'Para llevar'}.`);
  };

  const validation = useMemo(() => {
    return validateCustomerDetails({
      ...customer,
      deliveryType: cart.deliveryType,
    });
  }, [customer, cart.deliveryType]);

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleUpdateQty = (itemId: string, newQty: number) => {
    cart.updateQuantity(itemId, newQty);
    setLiveAnnouncement(`Cantidad actualizada a ${newQty}.`);
  };

  const handleRemove = (itemId: string, name: string) => {
    cart.removeItem(itemId);
    setLiveAnnouncement(`${name} eliminado del carrito.`);
  };

  const isCheckoutDisabled = cart.items.length === 0 || !validation.isValid;

  const handleSubmitOrder = () => {
    if (isCheckoutDisabled) return;

    const orderId = `ORD-${Date.now().toString().slice(-4)}`;
    const newOrder: StoredOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        ...customer,
        deliveryType: cart.deliveryType,
      },
      items: cart.items,
      subtotalCOP: cart.subtotalCOP,
      deliveryFeeCOP: cart.deliveryFeeCOP,
      totalCOP: cart.totalCOP,
    };

    // 1. Guardar como último pedido para recompra rápida
    lastOrderHook.saveLastOrder(newOrder);

    // 2. Generar URL estructurada para WhatsApp
    const whatsappUrl = generateOrderWhatsAppUrl(
      RESTAURANT_CONFIG.whatsapp.phone,
      cart,
      newOrder.customer
    );

    // 3. Abrir WhatsApp en nueva pestaña
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    // 4. Cerrar drawer y mostrar pantalla de preparación / confirmación
    // El carrito se mantiene intacto hasta que el usuario cierre el modal de confirmación
    onClose();
    setConfirmedOrder(newOrder);
    setIsConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    cart.clearCart();
    setIsConfirmationOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        title="Tu Bolsa de Pedido"
        description="Fornace 119 — Horno de leña en Usaquén"
        width="lg"
      >
        {/* Región accesible aria-live para anunciar cambios reactivos */}
        <div
          data-testid="cart-live-region"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {liveAnnouncement}
          {` Carrito actual con ${cart.itemCount} platos. Total: ${formatCOP(cart.totalCOP)}.`}
        </div>

        <div className="flex flex-col h-full justify-between space-y-6">
          {/* Selector Delivery / Takeaway */}
          <div className="bg-cream-100 p-1.5 rounded-2xl flex items-center border border-charcoal-700/10">
            <button
              type="button"
              onClick={() => handleDeliveryTypeChange('delivery')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                cart.deliveryType === 'delivery'
                  ? 'bg-white text-charcoal-900 shadow-sm font-semibold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Bike className="w-4 h-4 text-terracotta" />
              <span>Domicilio (Usaquén)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDeliveryTypeChange('takeaway')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium text-sm transition-all min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                cart.deliveryType === 'takeaway'
                  ? 'bg-white text-charcoal-900 shadow-sm font-semibold'
                  : 'text-charcoal-600 hover:text-charcoal-900'
              }`}
            >
              <Store className="w-4 h-4 text-terracotta" />
              <span>Para Llevar (Take-away)</span>
            </button>
          </div>

          {/* Lista de productos en el carrito */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {cart.items.length === 0 ? (
              <div className="py-12 text-center text-charcoal-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto text-charcoal-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-lg text-charcoal-900">
                  Tu bolsa está vacía
                </h4>
                <p className="text-sm text-charcoal-600 max-w-xs mx-auto">
                  Agrega tus pizzas tradicionales o creaciones d&apos;autore para armar tu pedido.
                </p>
              </div>
            ) : (
              cart.items.map((cartItem) => (
                <div
                  key={cartItem.id}
                  className="p-4 bg-white rounded-2xl border border-charcoal-700/10 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-charcoal-900">
                        {cartItem.item.name}
                      </h4>
                      {cartItem.selectedOptions?.length > 0 && (
                        <div className="text-xs text-charcoal-600 space-y-0.5 mt-1">
                          {cartItem.selectedOptions.map((opt) => (
                            <span key={opt.id} className="block">
                              + {opt.name} ({formatCOP(opt.priceCOP)})
                            </span>
                          ))}
                        </div>
                      )}
                      {cartItem.notes && (
                        <p className="text-xs text-charcoal-500 italic mt-1">
                          Nota: {cartItem.notes}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label={`Eliminar ${cartItem.item.name} del carrito`}
                      onClick={() => handleRemove(cartItem.id, cartItem.item.name)}
                      className="text-charcoal-400 hover:text-red-700 p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-charcoal-700/5">
                    {/* Controles de cantidad (+ / -) */}
                    <div className="flex items-center gap-2 bg-cream-100 rounded-full p-1 border border-charcoal-700/10">
                      <button
                        type="button"
                        aria-label={`Disminuir cantidad de ${cartItem.item.name}`}
                        disabled={cartItem.quantity <= 1}
                        onClick={() => handleUpdateQty(cartItem.id, cartItem.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-charcoal-700 hover:bg-cream-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-xs min-h-[32px] min-w-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-sm font-bold text-charcoal-900">
                        {cartItem.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Aumentar cantidad de ${cartItem.item.name}`}
                        disabled={cartItem.quantity >= 20}
                        onClick={() => handleUpdateQty(cartItem.id, cartItem.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-charcoal-700 hover:bg-cream-200 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shadow-xs min-h-[32px] min-w-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="font-semibold text-charcoal-900 text-sm">
                      {formatCOP(cartItem.totalPriceCOP)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Formulario de Datos del Cliente */}
          {cart.items.length > 0 && (
            <div className="bg-cream-50 p-4 rounded-2xl border border-charcoal-700/10 space-y-3">
              <span className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block">
                Datos de Entrega & Contacto
              </span>

              <div>
                <label
                  htmlFor="cust-name"
                  className="text-xs text-charcoal-600 block mb-1"
                >
                  Tu Nombre Completo *
                </label>
                <input
                  id="cust-name"
                  type="text"
                  required
                  placeholder="Ej: Sofia Gómez"
                  value={customer.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    touched.name && validation.errors.name
                      ? 'border-red-500'
                      : 'border-charcoal-700/20'
                  }`}
                />
                {touched.name && validation.errors.name && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validation.errors.name}</span>
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="cust-phone"
                  className="text-xs text-charcoal-600 block mb-1"
                >
                  Teléfono Móvil (WhatsApp) *
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Ej: 3001234567"
                  value={customer.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                    touched.phone && validation.errors.phone
                      ? 'border-red-500'
                      : 'border-charcoal-700/20'
                  }`}
                />
                {touched.phone && validation.errors.phone && (
                  <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{validation.errors.phone}</span>
                  </p>
                )}
              </div>

              {cart.deliveryType === 'delivery' && (
                <div>
                  <label
                    htmlFor="cust-address"
                    className="text-xs text-charcoal-600 block mb-1"
                  >
                    Dirección de Entrega (Usaquén) *
                  </label>
                  <input
                    id="cust-address"
                    type="text"
                    required
                    placeholder="Ej: Carrera 7 # 119-20 Apto 302"
                    value={customer.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onBlur={() => handleBlur('address')}
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta ${
                      touched.address && validation.errors.address
                        ? 'border-red-500'
                        : 'border-charcoal-700/20'
                    }`}
                  />
                  {touched.address && validation.errors.address && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{validation.errors.address}</span>
                    </p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="cust-payment"
                  className="text-xs text-charcoal-600 block mb-1"
                >
                  Método de Pago Preferido *
                </label>
                <select
                  id="cust-payment"
                  value={customer.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-charcoal-700/20 rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta"
                >
                  {RESTAURANT_CONFIG.paymentMethods.map((pm) => (
                    <option key={pm} value={pm}>
                      {pm}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Aviso Legal de Venta de Licor (Ley 124 de 1994) */}
          {hasAlcoholicItems(cart.items) && (
            <div
              data-testid="liquor-age-notice"
              className="p-3 bg-amber-50 border border-amber-300/80 rounded-xl text-xs text-amber-950 flex items-start gap-2.5"
            >
              <span className="text-base shrink-0 leading-none" role="img" aria-label="Aviso mayores de 18 años">🔞</span>
              <div className="space-y-0.5">
                <span className="font-bold block text-amber-950">Venta de licor solo a mayores de 18 años</span>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Ley 124 de 1994. Se podrá solicitar documento de identidad al momento de la entrega.
                </p>
              </div>
            </div>
          )}

          {/* Desglose de Totales & Checkout */}
          <div className="space-y-4 pt-4 border-t border-charcoal-700/10">
            <div className="p-4 bg-cream-100 rounded-2xl border border-charcoal-700/10 space-y-1.5 text-sm">
              <div className="flex justify-between text-charcoal-600">
                <span>Subtotal:</span>
                <span className="font-medium text-charcoal-900">
                  {formatCOP(cart.subtotalCOP)}
                </span>
              </div>

              {cart.deliveryType === 'delivery' && (
                <div className="flex justify-between text-charcoal-600">
                  <span>Envío a Usaquén:</span>
                  <span
                    className={`font-medium ${
                      cart.isEligibleForFreeShipping ? 'text-emerald-800' : 'text-charcoal-900'
                    }`}
                  >
                    {cart.isEligibleForFreeShipping
                      ? `Gratis (compra desde ${formatCOP(RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP)})`
                      : formatCOP(cart.deliveryFeeCOP)}
                  </span>
                </div>
              )}

              {cart.deliveryType === 'delivery' && !cart.isEligibleForFreeShipping && cart.items.length > 0 && (
                <p className="text-xs text-amber-800 bg-amber-50 rounded-lg p-2 mt-1">
                  💡 Agrega {formatCOP(cart.amountNeededForFreeShippingCOP)} más para envío gratis.
                </p>
              )}

              <div className="flex justify-between pt-2 border-t border-charcoal-700/10 text-base font-bold text-charcoal-900">
                <span>Total a Pagar:</span>
                <span className="text-terracotta">{formatCOP(cart.totalCOP)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isCheckoutDisabled}
              onClick={handleSubmitOrder}
              className="w-full gap-2 shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Completar Pedido por WhatsApp</span>
            </Button>
          </div>
        </div>
      </Drawer>

      {/* Pantalla / Modal de Confirmación (Etapa Disfruta) */}
      <OrderConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        order={confirmedOrder}
      />
    </>
  );
};
