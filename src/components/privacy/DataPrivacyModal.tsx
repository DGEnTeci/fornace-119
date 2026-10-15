'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useLastOrder } from '@/hooks/useLastOrder';
import { useCart } from '@/hooks/useCart';
import { ShieldCheck, Trash2, CheckCircle2, Lock, Smartphone } from 'lucide-react';

export interface DataPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared?: () => void;
}

/**
 * Modal de Aviso de Tratamiento de Datos (Ley 1581 de 2012 / Habeas Data)
 * Informa sobre la política de privacidad y permite borrar en 1 clic
 * el último pedido y los datos de cliente almacenados localmente.
 */
export function DataPrivacyModal({
  isOpen,
  onClose,
  onDataCleared,
}: DataPrivacyModalProps) {
  const { hasLastOrder, clearLastOrder } = useLastOrder();
  const cart = useCart();
  const [clearedNotice, setClearedNotice] = useState<string | null>(null);

  const handleClearData = () => {
    // 1. Borrar último pedido
    clearLastOrder();

    // 2. Vaciar carrito en memoria y almacenamiento local
    cart.clearCart();

    // 3. Limpiar llaves locales de cliente si existen
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('fornace119:cart:v1');
        window.localStorage.removeItem('fornace119:last-order:v1');
      } catch (e) {
        console.error('Error al borrar almacenamiento local:', e);
      }
    }

    setClearedNotice(
      'Tus datos y último pedido guardado han sido eliminados de este dispositivo.'
    );

    if (onDataCleared) {
      onDataCleared();
    }
  };

  const handleClose = () => {
    setClearedNotice(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tratamiento de Datos y Privacidad Local"
      description="Conoce cómo protegemos tus datos y gestiona la información guardada en tu navegador."
      maxWidth="lg"
    >
      <div className="space-y-6 pt-2 text-sm text-charcoal-700">
        {/* Banner de Compromiso Habeas Data */}
        <div className="p-4 rounded-2xl bg-cream-200/80 border border-charcoal-700/10 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-charcoal-900 text-xs uppercase tracking-wider">
              Ley 1581 de 2012 (Habeas Data Colombia)
            </h4>
            <p className="text-xs text-charcoal-600 leading-relaxed">
              En Fornace 119 respetamos tu privacidad. No almacenamos tus datos personales en
              servidores externos, no usamos cookies de seguimiento publicitario ni vendemos tu información.
            </p>
          </div>
        </div>

        {/* Explicación de almacenamiento en el navegador */}
        <div className="space-y-3">
          <h5 className="font-serif font-bold text-base text-charcoal-900">
            ¿Cómo funciona el almacenamiento de tus pedidos?
          </h5>
          <ul className="space-y-2.5 text-xs text-charcoal-600">
            <li className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-olive-dark shrink-0 mt-0.5" />
              <span>
                <strong>Almacenamiento Local (LocalStorage):</strong> Tu nombre, teléfono móvil y los ítems
                de tu último pedido confirmado se guardan exclusivamente en la memoria de tu dispositivo.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <span>
                <strong>Propósito Único:</strong> Se utilizan únicamente para ofrecerte la repetición
                de pedido en 1 toque y autocompletar tus datos para agilizar el envío a WhatsApp.
              </span>
            </li>
          </ul>
        </div>

        {/* Región de anuncio accesible */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {clearedNotice}
        </div>

        {/* Notificación de borrado exitoso */}
        {clearedNotice && (
          <div
            data-testid="privacy-cleared-feedback"
            className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center gap-2.5 text-xs font-medium animate-fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{clearedNotice}</span>
          </div>
        )}

        {/* Sección de Acción: Borrar datos */}
        <div className="pt-2 border-t border-charcoal-700/10 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-charcoal-900">
                Memoria de pedidos y carrito en este dispositivo
              </p>
              <p className="text-[11px] text-charcoal-500">
                {hasLastOrder || cart.items.length > 0
                  ? 'Hay datos de pedidos o carrito activo guardados en este dispositivo.'
                  : 'No hay pedidos ni carrito activos en este navegador.'}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClearData}
              disabled={!hasLastOrder && cart.items.length === 0 && !clearedNotice}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 gap-1.5 shrink-0 text-xs"
              aria-label="Borrar último pedido y datos guardados de este dispositivo"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Borrar datos guardados</span>
            </Button>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            Entendido y cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
