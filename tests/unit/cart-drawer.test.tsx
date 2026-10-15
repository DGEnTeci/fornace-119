import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CartDrawer, validateCustomerDetails } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/hooks/useCart';
import { CartItem } from '@/types/cart';
import { MenuItem } from '@/types/menu';

const mockMenuItem: MenuItem = {
  id: 'margherita-dop',
  categoryId: 'tradizionali',
  name: 'Margherita D.O.P.',
  italianName: 'Margherita Tradizionale',
  description: 'Tomate San Marzano D.O.P. y mozzarella di bufala campana.',
  priceCOP: 38000,
  imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
  badges: ['masa-madre', 'dop'],
};

const mockCartItem: CartItem = {
  id: 'margherita-dop-default',
  item: mockMenuItem,
  quantity: 2,
  selectedOptions: [
    { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala', priceCOP: 9000 },
  ],
  unitPriceCOP: 47000,
  totalPriceCOP: 94000,
};

describe('CartDrawer Component (Task 4b - TDD)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Validación de Formulario de Cliente (validateCustomerDetails)', () => {
    it('valida que el teléfono colombiano tenga exactamente 10 dígitos e inicie por 3', () => {
      expect(
        validateCustomerDetails({
          name: 'Carlos Ruiz',
          phone: '3001234567',
          deliveryType: 'takeaway',
          paymentMethod: 'Efectivo',
        }).isValid
      ).toBe(true);

      // No empieza por 3
      expect(
        validateCustomerDetails({
          name: 'Carlos Ruiz',
          phone: '2001234567',
          deliveryType: 'takeaway',
          paymentMethod: 'Efectivo',
        }).errors.phone
      ).toMatch(/debe iniciar por 3 y tener 10 dígitos/i);

      // Menos de 10 dígitos
      expect(
        validateCustomerDetails({
          name: 'Carlos Ruiz',
          phone: '3001234',
          deliveryType: 'takeaway',
          paymentMethod: 'Efectivo',
        }).errors.phone
      ).toBeDefined();

      // Más de 10 dígitos
      expect(
        validateCustomerDetails({
          name: 'Carlos Ruiz',
          phone: '300123456789',
          deliveryType: 'takeaway',
          paymentMethod: 'Efectivo',
        }).errors.phone
      ).toBeDefined();
    });

    it('exige dirección obligatoria solo cuando es pedido a domicilio (delivery)', () => {
      // Domicilio sin dirección -> Inválido
      const deliveryWithoutAddress = validateCustomerDetails({
        name: 'Carlos Ruiz',
        phone: '3151234567',
        deliveryType: 'delivery',
        address: '',
        paymentMethod: 'Nequi',
      });
      expect(deliveryWithoutAddress.isValid).toBe(false);
      expect(deliveryWithoutAddress.errors.address).toBeDefined();

      // Takeaway sin dirección -> Válido
      const takeawayWithoutAddress = validateCustomerDetails({
        name: 'Carlos Ruiz',
        phone: '3151234567',
        deliveryType: 'takeaway',
        paymentMethod: 'Nequi',
      });
      expect(takeawayWithoutAddress.isValid).toBe(true);
      expect(takeawayWithoutAddress.errors.address).toBeUndefined();
    });
  });

  describe('Renderizado e Interacción en CartDrawer', () => {
    it('muestra el estado vacío cuando no hay ítems en el carrito y deshabilita el botón de checkout', () => {
      render(
        <CartProvider>
          <CartDrawer isOpen={true} onClose={vi.fn()} />
        </CartProvider>
      );

      expect(screen.getByText(/tu bolsa está vacía/i)).toBeDefined();
      const checkoutBtn = screen.getByRole('button', { name: /completar pedido por whatsapp/i });
      expect(checkoutBtn.hasAttribute('disabled')).toBe(true);
    });

    it('contiene región aria-live="polite" para anunciar actualizaciones de totales y productos', () => {
      render(
        <CartProvider>
          <CartDrawer isOpen={true} onClose={vi.fn()} />
        </CartProvider>
      );

      const liveRegion = screen.getByTestId('cart-live-region');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    });

    it('muestra los productos agregados en el carrito correctamente', () => {
      // Mock cart con ítems
      const mockCartState: any = {
        items: [mockCartItem],
        subtotalCOP: 94000,
        deliveryFeeCOP: 0,
        totalCOP: 94000,
        itemCount: 2,
        isEligibleForFreeShipping: true,
        amountNeededForFreeShippingCOP: 0,
        deliveryType: 'delivery',
        isHydrated: true,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        setDeliveryType: vi.fn(),
        clearCart: vi.fn(),
        restoreOrder: vi.fn(),
      };

      render(
        <CartProvider>
          <CartDrawer isOpen={true} onClose={vi.fn()} cart={mockCartState} />
        </CartProvider>
      );

      expect(screen.getByText('Margherita D.O.P.')).toBeDefined();
      expect(screen.getByText('+ Extra Mozzarella di Bufala ($ 9.000)')).toBeDefined();
      expect(screen.getAllByText('$ 94.000').length).toBeGreaterThanOrEqual(1);
    });

    it('muestra el aviso de venta de licor a mayores de 18 años solo cuando el carrito incluye bebidas alcohólicas', () => {
      const wineItem: MenuItem = {
        id: 'chianti-classico',
        categoryId: 'bevande',
        name: 'Chianti Classico DOCG (Botella 750ml)',
        description: 'Vino tinto italiano.',
        priceCOP: 115000,
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3',
        badges: ['dop'],
        isAlcoholic: true,
      };

      const alcoholCartItem: CartItem = {
        id: 'chianti-default',
        item: wineItem,
        quantity: 1,
        selectedOptions: [],
        unitPriceCOP: 115000,
        totalPriceCOP: 115000,
      };

      const alcoholCartState: any = {
        items: [alcoholCartItem],
        subtotalCOP: 115000,
        deliveryFeeCOP: 0,
        totalCOP: 115000,
        itemCount: 1,
        isEligibleForFreeShipping: true,
        amountNeededForFreeShippingCOP: 0,
        deliveryType: 'delivery',
        isHydrated: true,
        addItem: vi.fn(),
        removeItem: vi.fn(),
        updateQuantity: vi.fn(),
        setDeliveryType: vi.fn(),
        clearCart: vi.fn(),
        restoreOrder: vi.fn(),
      };

      render(
        <CartProvider>
          <CartDrawer isOpen={true} onClose={vi.fn()} cart={alcoholCartState} />
        </CartProvider>
      );

      const notice = screen.getByTestId('liquor-age-notice');
      expect(notice).toBeDefined();
      expect(notice.textContent).toMatch(/mayor.*18.*año/i);
    });
  });
});
