import React, { useRef } from 'react';
import { MenuCategory } from '@/types/menu';
import { Flame, Sparkles, UtensilsCrossed, Cake, Wine, Utensils } from 'lucide-react';

export interface MenuCategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelectCategory: (categoryId: any) => void;
  className?: string;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Flame,
  Sparkles,
  UtensilsCrossed,
  Cake,
  Wine,
};

export const MenuCategoryTabs: React.FC<MenuCategoryTabsProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  className = '',
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = -1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % categories.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + categories.length) % categories.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = categories.length - 1;
        break;
      default:
        return;
    }

    if (nextIndex >= 0 && nextIndex < categories.length) {
      onSelectCategory(categories[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Categorías del Menú"
      className={`flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap ${className}`}
    >
      {categories.map((category, index) => {
        const isActive = activeCategory === category.id;
        const IconComponent = ICON_MAP[category.iconName] || Utensils;

        return (
          <button
            key={category.id}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            role="tab"
            id={`tab-${category.id}`}
            aria-controls={`panel-${category.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelectCategory(category.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 ${
              isActive
                ? 'bg-terracotta text-white shadow-sm font-semibold'
                : 'bg-cream-100 text-charcoal-700 hover:bg-cream-200 hover:text-charcoal-900 border border-charcoal-700/10'
            }`}
          >
            <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-terracotta'}`} />
            <span>{category.name}</span>
          </button>
        );
      })}
    </div>
  );
};
