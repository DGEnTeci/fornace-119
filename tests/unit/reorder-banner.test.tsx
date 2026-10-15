import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReorderBanner } from '@/components/cart/ReorderBanner';
import { StoredOrder } from '@/types/cart';
import { MenuData } from '@/types/menu';
import rawMenuData from '@/data/menu.json';

const menuData = rawMenuData as unknown as MenuData;

const sampleLastOrder: StoredOrder = {
  id: 'ORD-5544',
  createdAt: '2026-10-12T20:00:00.000Z',
  customer: {
    name: 'Paula Andrade',
    phone: '3109876543',
    deliveryType: 'delivery',
    address: 'Carrera 6 # 119-40',
    paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
  },
  items: [
    {
      id: 'margherita-dop',
      item: menuData.items[0],
      quantity: 2,
      selectedOptions: [],
      unitPriceCOP: 38000,
      totalPriceCOP: 76000,
    },
  ],
  subtotalCOP: 76000,
  deliveryFeeCOP: 0,
  totalCOP: 76000,
};

describe('ReorderBanner Component (Task 4b - TDD)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('no renderiza nada si no hay un pedido previo en localStorage', () => {
    const { container } = render(<ReorderBanner onReorder={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('muestra el banner con el total actualizado antes de agregar cuando existe un pedido previo', () => {
    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(sampleLastOrder));

    render(<ReorderBanner onReorder={vi.fn()} />);

    expect(screen.getByText(/repetir mi último pedido/i)).toBeDefined();
    // Debe mostrar el total actualizado ($ 76.000)
    expect(screen.getByText(/\$ 76\.000/i)).toBeDefined();
  });

  it('muestra advertencia destacada si un plato del pedido anterior fue descontinuado de la carta', () => {
    const orderWithDiscontinuedDish: StoredOrder = {
      ...sampleLastOrder,
      items: [
        {
          id: 'pizza-descontinuada',
          item: {
            ...menuData.items[0],
            id: 'pizza-inexistente-123',
            name: 'Pizza Trufada Antigua Descontinuada',
          },
          quantity: 1,
          selectedOptions: [],
          unitPriceCOP: 50000,
          totalPriceCOP: 50000,
        },
      ],
    };

    window.localStorage.setItem(
      'fornace119:last-order:v1',
      JSON.stringify(orderWithDiscontinuedDish)
    );

    render(<ReorderBanner onReorder={vi.fn()} />);

    expect(screen.getByText(/ya no se encuentra disponible/i)).toBeDefined();
    expect(screen.getByText(/Pizza Trufada Antigua Descontinuada/i)).toBeDefined();
  });

  it('llama al callback onReorder con los ítems revalidados al hacer clic', () => {
    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(sampleLastOrder));
    const handleReorder = vi.fn();

    render(<ReorderBanner onReorder={handleReorder} />);

    const button = screen.getByRole('button', { name: /repetir pedido/i });
    fireEvent.click(button);

    expect(handleReorder).toHaveBeenCalledTimes(1);
  });
});
