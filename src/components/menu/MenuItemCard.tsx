import React from 'react';
import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCOP } from '@/lib/formatters';
import { Plus, SlidersHorizontal } from 'lucide-react';

export interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  className?: string;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onSelect,
  className = '',
}) => {
  const hasOptions = item.availableOptions && item.availableOptions.length > 0;

  return (
    <article
      className={`bg-cream-50 rounded-2xl border border-charcoal-700/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group ${className}`}
    >
      <div>
        {/* Imagen con next/image */}
        <div className="relative w-full h-48 sm:h-52 bg-cream-200 overflow-hidden">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent opacity-60" />

          {/* Badges superiores */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            {item.badges.map((badge) => (
              <Badge
                key={badge}
                type={badge}
                label={badge === 'dop' ? 'D.O.P.' : undefined}
                className="shadow-sm backdrop-blur-xs"
              />
            ))}
          </div>
        </div>

        {/* Información del plato */}
        <div className="p-5 space-y-2">
          {item.italianName && (
            <p className="text-xs italic text-charcoal-500 font-serif tracking-wide">
              {item.italianName}
            </p>
          )}
          <h3 className="font-serif text-xl font-bold text-charcoal-900 leading-snug">
            {item.name}
          </h3>
          <p className="text-sm text-charcoal-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer con precio y acción */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-charcoal-700/5 mt-2">
        <div>
          <span className="text-xs text-charcoal-500 block">Precio</span>
          <span className="font-bold text-lg text-terracotta">
            {formatCOP(item.priceCOP)}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onSelect(item)}
          className="gap-1.5 hover:bg-terracotta hover:text-white hover:border-terracotta transition-colors"
          aria-label={hasOptions ? `Personalizar ${item.name}` : `Agregar ${item.name}`}
        >
          {hasOptions ? (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Personalizar</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Agregar</span>
            </>
          )}
        </Button>
      </div>
    </article>
  );
};
