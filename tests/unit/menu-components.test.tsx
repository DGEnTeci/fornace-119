import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MenuCategoryTabs } from '@/components/menu/MenuCategoryTabs';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { ItemCustomizerModal } from '@/components/menu/ItemCustomizerModal';
import { CartProvider } from '@/hooks/useCart';
import { MenuItem, MenuCategory } from '@/types/menu';

const mockCategories: MenuCategory[] = [
  {
    id: 'tradizionali',
    name: 'Pizze Tradizionali',
    subtitle: 'La esencia clásica de Nápoles con D.O.P.',
    iconName: 'Flame',
  },
  {
    id: 'autore',
    name: 'Pizze d\'Autore',
    subtitle: 'Creaciones contemporáneas.',
    iconName: 'Sparkles',
  },
  {
    id: 'antipasti',
    name: 'Antipasti & Entradas',
    subtitle: 'Platos para compartir.',
    iconName: 'UtensilsCrossed',
  },
];

const mockItemWithOptions: MenuItem = {
  id: 'margherita-dop',
  categoryId: 'tradizionali',
  name: 'Margherita D.O.P.',
  italianName: 'Margherita Tradizionale Napoletana',
  description: 'Tomate San Marzano D.O.P., mozzarella di bufala campana y albahaca fresca.',
  priceCOP: 38000,
  imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000&auto=format&fit=crop',
  badges: ['masa-madre', 'dop', 'vegetariana'],
  availableOptions: [
    { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala (+60g)', priceCOP: 9000 },
    { id: 'borde-ricotta', name: 'Borde relleno de Ricotta', priceCOP: 8000 },
  ],
};

const mockItemWithoutOptions: MenuItem = {
  id: 'cannoli-siciliani',
  categoryId: 'dolci',
  name: 'Cannoli Siciliani Artigianali',
  description: 'Masa crujiente aromatizada con vino Marsala y rellena de ricotta fresca.',
  priceCOP: 22000,
  imageUrl: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1000&auto=format&fit=crop',
  badges: ['vegetariana'],
};

describe('Task 5a: Menu Components (TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('MenuCategoryTabs', () => {
    it('renderiza la lista accesible de categorías con rol tablist y tabs', () => {
      const onSelect = vi.fn();
      render(
        <MenuCategoryTabs
          categories={mockCategories}
          activeCategory="tradizionali"
          onSelectCategory={onSelect}
        />
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeDefined();

      const selectedTab = screen.getByRole('tab', { name: /pizze tradizionali/i });
      expect(selectedTab.getAttribute('aria-selected')).toBe('true');

      const otherTab = screen.getByRole('tab', { name: /pizze d'autore/i });
      expect(otherTab.getAttribute('aria-selected')).toBe('false');

      fireEvent.click(otherTab);
      expect(onSelect).toHaveBeenCalledWith('autore');
    });

    it('permite navegar y cambiar entre pestañas usando las flechas del teclado (ArrowRight, ArrowLeft, Home, End)', () => {
      const onSelect = vi.fn();
      render(
        <MenuCategoryTabs
          categories={mockCategories}
          activeCategory="tradizionali"
          onSelectCategory={onSelect}
        />
      );

      const firstTab = screen.getByRole('tab', { name: /pizze tradizionali/i });

      // Flecha derecha: avanza a la siguiente categoría (autore)
      fireEvent.keyDown(firstTab, { key: 'ArrowRight' });
      expect(onSelect).toHaveBeenCalledWith('autore');

      // Flecha izquierda: retrocede con ciclo a la última (antipasti)
      fireEvent.keyDown(firstTab, { key: 'ArrowLeft' });
      expect(onSelect).toHaveBeenCalledWith('antipasti');

      // Tecla End: va a la última categoría (antipasti)
      fireEvent.keyDown(firstTab, { key: 'End' });
      expect(onSelect).toHaveBeenCalledWith('antipasti');

      // Tecla Home: va a la primera categoría (tradizionali)
      fireEvent.keyDown(firstTab, { key: 'Home' });
      expect(onSelect).toHaveBeenCalledWith('tradizionali');
    });
  });

  describe('MenuItemCard', () => {
    it('muestra la imagen con next/image, título italiano, nombre, badges y precio COP formateado', () => {
      render(
        <MenuItemCard
          item={mockItemWithOptions}
          onSelect={vi.fn()}
        />
      );

      // Imagen con alt accesible
      const img = screen.getByAltText('Margherita D.O.P.');
      expect(img).toBeDefined();

      // Nombres
      expect(screen.getByText('Margherita D.O.P.')).toBeDefined();
      expect(screen.getByText('Margherita Tradizionale Napoletana')).toBeDefined();

      // Badges
      expect(screen.getByText('Masa Madre 48h')).toBeDefined();
      expect(screen.getByText('D.O.P.')).toBeDefined();

      // Precio COP formateado
      expect(screen.getByText('$ 38.000')).toBeDefined();
    });

    it('ejecuta el callback onSelect al pulsar el botón de personalizar/agregar', () => {
      const handleSelect = vi.fn();
      render(
        <MenuItemCard
          item={mockItemWithOptions}
          onSelect={handleSelect}
        />
      );

      const actionBtn = screen.getByRole('button', { name: /personalizar/i });
      fireEvent.click(actionBtn);

      expect(handleSelect).toHaveBeenCalledWith(mockItemWithOptions);
    });
  });

  describe('ItemCustomizerModal', () => {
    it('recalcula el precio total dinámicamente con adiciones seleccionadas y selector de cantidad', () => {
      const handleAddToCart = vi.fn();
      render(
        <ItemCustomizerModal
          isOpen={true}
          onClose={vi.fn()}
          item={mockItemWithOptions}
          onAddToCart={handleAddToCart}
        />
      );

      // Base price initially: $ 38.000 (qty 1)
      expect(screen.getByTestId('customizer-total-price').textContent).toBe('$ 38.000');

      // Seleccionar primera adición: + $ 9.000 -> $ 47.000
      const extraBufalaCheckbox = screen.getByLabelText(/Extra Mozzarella di Bufala/i);
      fireEvent.click(extraBufalaCheckbox);

      expect(screen.getByTestId('customizer-total-price').textContent).toBe('$ 47.000');

      // Incrementar cantidad a 2 -> $ 47.000 * 2 = $ 94.000
      const incrementBtn = screen.getByRole('button', { name: /aumentar cantidad/i });
      fireEvent.click(incrementBtn);

      expect(screen.getByTestId('customizer-total-price').textContent).toBe('$ 94.000');

      // Ingresar notas para la cocina
      const notesInput = screen.getByPlaceholderText(/sin albahaca/i);
      fireEvent.change(notesInput, { target: { value: 'Bien tostada por favor' } });

      // Click botón "Agregar al pedido"
      const addBtn = screen.getByRole('button', { name: /agregar al pedido/i });
      fireEvent.click(addBtn);

      expect(handleAddToCart).toHaveBeenCalledTimes(1);
      const callArg = handleAddToCart.mock.calls[0][0];
      expect(callArg.quantity).toBe(2);
      expect(callArg.notes).toBe('Bien tostada por favor');
      expect(callArg.selectedOptions).toHaveLength(1);
      expect(callArg.selectedOptions[0].id).toBe('extra-bufala');
      expect(callArg.unitPriceCOP).toBe(47000);
      expect(callArg.totalPriceCOP).toBe(94000);
    });

    it('respeta los límites de cantidad entre 1 y 20', () => {
      render(
        <ItemCustomizerModal
          isOpen={true}
          onClose={vi.fn()}
          item={mockItemWithoutOptions}
          onAddToCart={vi.fn()}
        />
      );

      const decrementBtn = screen.getByRole('button', { name: /disminuir cantidad/i });
      // Deshabilitado o sin efecto cuando qty es 1
      expect(decrementBtn.hasAttribute('disabled')).toBe(true);

      const qtyDisplay = screen.getByTestId('customizer-qty-display');
      expect(qtyDisplay.textContent).toBe('1');
    });
  });
});
