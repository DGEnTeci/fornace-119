import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MenuItem, MenuOption } from '@/types/menu';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCOP } from '@/lib/formatters';
import { Plus, Minus, Check, ShoppingBag, Utensils } from 'lucide-react';

export interface CustomizedItemPayload {
  item: MenuItem;
  selectedOptions: MenuOption[];
  notes?: string;
  quantity: number;
  unitPriceCOP: number;
  totalPriceCOP: number;
}

export interface ItemCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onAddToCart: (payload: CustomizedItemPayload) => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  isOpen,
  onClose,
  item,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedOptions, setSelectedOptions] = useState<MenuOption[]>([]);
  const [notes, setNotes] = useState<string>('');

  // Reset state when opening a new item
  useEffect(() => {
    if (isOpen && item) {
      setQuantity(1);
      setSelectedOptions([]);
      setNotes('');
    }
  }, [isOpen, item]);

  if (!item) return null;

  const handleToggleOption = (option: MenuOption) => {
    setSelectedOptions((prev) => {
      const exists = prev.some((o) => o.id === option.id);
      if (exists) {
        return prev.filter((o) => o.id !== option.id);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleDecreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncreaseQty = () => {
    setQuantity((prev) => Math.min(20, prev + 1));
  };

  const optionsTotalCOP = selectedOptions.reduce(
    (sum, opt) => sum + opt.priceCOP,
    0
  );
  const unitPriceCOP = item.priceCOP + optionsTotalCOP;
  const totalPriceCOP = unitPriceCOP * quantity;

  const handleAdd = () => {
    onAddToCart({
      item,
      selectedOptions,
      notes: notes.trim() ? notes.trim() : undefined,
      quantity,
      unitPriceCOP,
      totalPriceCOP,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item.name}
      description={item.italianName || 'Fornace 119 — Horno a 450°C'}
      maxWidth="lg"
    >
      <div className="space-y-6 pt-1">
        {/* Encabezado visual del plato */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-cream-200 border border-charcoal-700/10">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-charcoal-950/20 to-transparent" />

          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {item.badges.map((badge) => (
                  <Badge
                    key={badge}
                    type={badge}
                    label={badge === 'dop' ? 'D.O.P.' : undefined}
                    className="shadow-sm"
                  />
                ))}
              </div>
              <p className="text-white text-xs sm:text-sm line-clamp-2 max-w-md drop-shadow-sm">
                {item.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs text-white/80 block">Base</span>
              <span className="text-lg font-bold text-white drop-shadow-sm">
                {formatCOP(item.priceCOP)}
              </span>
            </div>
          </div>
        </div>

        {/* Adiciones Disponibles */}
        {item.availableOptions && item.availableOptions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-terracotta" />
              <span>Personaliza tu plato (Adiciones & Borde)</span>
            </h4>
            <div className="space-y-2">
              {item.availableOptions.map((opt) => {
                const isSelected = selectedOptions.some((o) => o.id === opt.id);
                return (
                  <label
                    key={opt.id}
                    htmlFor={`opt-${opt.id}`}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer min-h-[48px] ${
                      isSelected
                        ? 'border-terracotta bg-terracotta/5 text-charcoal-900 font-medium'
                        : 'border-charcoal-700/15 bg-white text-charcoal-700 hover:border-charcoal-700/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        id={`opt-${opt.id}`}
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleOption(opt)}
                        className="w-4 h-4 text-terracotta rounded border-charcoal-400 focus:ring-terracotta accent-terracotta cursor-pointer"
                      />
                      <span className="text-sm font-medium">{opt.name}</span>
                    </div>
                    <span className="text-sm font-bold text-terracotta">
                      +{formatCOP(opt.priceCOP)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* Notas para el horno o cocina */}
        <div className="space-y-2">
          <label
            htmlFor="item-notes"
            className="text-xs font-bold text-charcoal-700 uppercase tracking-wider block"
          >
            Indicaciones especiales para la cocina
          </label>
          <input
            id="item-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej: Sin albahaca, masa bien tostada, etc."
            maxLength={120}
            className="w-full px-3.5 py-2.5 bg-white border border-charcoal-700/20 rounded-xl text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-terracotta placeholder:text-charcoal-400"
          />
        </div>

        {/* Selector de cantidad y Total */}
        <div className="bg-cream-100 rounded-2xl p-4 border border-charcoal-700/10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-charcoal-500 block uppercase font-medium">
              Cantidad
            </span>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                disabled={quantity <= 1}
                onClick={handleDecreaseQty}
                className="w-9 h-9 rounded-full bg-white border border-charcoal-700/20 text-charcoal-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta cursor-pointer transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <span
                data-testid="customizer-qty-display"
                className="w-8 text-center font-bold text-charcoal-900 text-base"
              >
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Aumentar cantidad"
                disabled={quantity >= 20}
                onClick={handleIncreaseQty}
                className="w-9 h-9 rounded-full bg-white border border-charcoal-700/20 text-charcoal-700 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-charcoal-500 block uppercase font-medium">
              Total a pagar
            </span>
            <span
              data-testid="customizer-total-price"
              className="text-2xl font-serif font-bold text-terracotta block"
            >
              {formatCOP(totalPriceCOP)}
            </span>
          </div>
        </div>

        {/* Botón de Confirmación / Agregar */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2 shadow-md text-base"
            onClick={handleAdd}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>
              Agregar al pedido — {formatCOP(totalPriceCOP)}
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
