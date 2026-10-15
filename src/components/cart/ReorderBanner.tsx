'use client';

import React from 'react';
import { useLastOrder } from '@/hooks/useLastOrder';
import { StoredOrder } from '@/types/cart';
import { Button } from '@/components/ui/Button';
import { formatCOP } from '@/lib/formatters';
import { RotateCcw, AlertTriangle, Sparkles } from 'lucide-react';

export interface ReorderBannerProps {
  onReorder: (order: StoredOrder) => void;
  className?: string;
}

export const ReorderBanner: React.FC<ReorderBannerProps> = ({
  onReorder,
  className = '',
}) => {
  const { hasLastOrder, lastOrder, revalidation } = useLastOrder();

  if (!hasLastOrder || !lastOrder) {
    return null;
  }

  // Usar la orden revalidada (con precios y disponibilidad actuales) o la original
  const currentOrder = revalidation?.updatedOrder || lastOrder;
  const isAvailable = revalidation?.isValid ?? true;
  const hasPriceChanges = revalidation?.hasPriceChanges ?? false;
  const unavailableList = revalidation?.unavailableItems || [];

  const handleRepeatClick = () => {
    onReorder(currentOrder);
  };

  return (
    <div
      className={`bg-cream-50 rounded-2xl p-5 border border-charcoal-700/10 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Repetir mi último pedido
              </h3>
              {hasPriceChanges && (
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-medium">
                  Precios actualizados
                </span>
              )}
            </div>

            <p className="text-sm text-charcoal-600 mt-0.5">
              {currentOrder.items.map((i) => `${i.quantity}x ${i.item.name}`).join(', ')}
            </p>
          </div>
        </div>

        {/* Total actualizado mostrado ANTES de agregar */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-charcoal-700/10">
          <div className="text-right">
            <span className="text-xs text-charcoal-500 block">Total actual:</span>
            <span className="font-bold text-lg text-terracotta">
              {formatCOP(currentOrder.totalCOP)}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRepeatClick}
            className="gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Repetir Pedido</span>
          </Button>
        </div>
      </div>

      {/* Alerta si algún plato ya no está en la carta actual */}
      {!isAvailable && unavailableList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">
              Atención: Uno o más platos de tu pedido anterior ya no se encuentra disponible:
            </span>
            <p className="mt-0.5 text-red-800">
              {unavailableList.join(', ')}. Puedes continuar con los platos disponibles o explorar nuestra carta actualizada.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
