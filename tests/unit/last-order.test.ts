import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLastOrder } from '@/hooks/useLastOrder';
import { StoredOrder } from '@/types/cart';
import { MenuData } from '@/types/menu';
import rawMenuData from '@/data/menu.json';

const menuData = rawMenuData as unknown as MenuData;

const sampleOrder: StoredOrder = {
  id: 'ORD-9876',
  createdAt: '2026-10-10T19:30:00.000Z',
  customer: {
    name: 'Carolina Ruiz',
    phone: '3114567890',
    deliveryType: 'delivery',
    address: 'Calle 118 # 4-15',
    paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
  },
  items: [
    {
      id: 'margherita-dop',
      item: menuData.items[0], // Margherita D.O.P. ($38.000)
      quantity: 1,
      selectedOptions: [],
      unitPriceCOP: 38000,
      totalPriceCOP: 38000,
    },
  ],
  subtotalCOP: 38000,
  deliveryFeeCOP: 6000,
  totalCOP: 44000,
};

describe('useLastOrder Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('retorna null cuando localStorage está vacío', () => {
    const { result } = renderHook(() => useLastOrder());

    expect(result.current.hasLastOrder).toBe(false);
    expect(result.current.lastOrder).toBeNull();
    expect(result.current.revalidation).toBeNull();
  });

  it('maneja localStorage corrupto sin romperse y retorna estado vacío', () => {
    window.localStorage.setItem('fornace119:last-order:v1', 'CORRUPT_JSON_DATA<<<>>>');

    const { result } = renderHook(() => useLastOrder());

    expect(result.current.hasLastOrder).toBe(false);
    expect(result.current.lastOrder).toBeNull();
  });

  it('guarda un nuevo pedido exitosamente en localStorage', () => {
    const { result } = renderHook(() => useLastOrder());

    act(() => {
      result.current.saveLastOrder(sampleOrder);
    });

    expect(result.current.hasLastOrder).toBe(true);
    expect(result.current.lastOrder?.id).toBe('ORD-9876');
  });

  it('revalida el pedido contra menu.json cuando todos los platos existen con precios vigentes', () => {
    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(sampleOrder));

    const { result } = renderHook(() => useLastOrder());

    expect(result.current.hasLastOrder).toBe(true);
    expect(result.current.revalidation).not.toBeNull();
    expect(result.current.revalidation?.isValid).toBe(true);
    expect(result.current.revalidation?.unavailableItems).toEqual([]);
    expect(result.current.revalidation?.hasPriceChanges).toBe(false);
  });

  it('detecta y avisa si un plato del pedido anterior ya no existe en menu.json', () => {
    const orderWithDeletedDish: StoredOrder = {
      ...sampleOrder,
      items: [
        {
          id: 'pizza-descontinuada',
          item: {
            ...menuData.items[0],
            id: 'pizza-descontinuada-antigua',
            name: 'Pizza Descontinuada de Temporada',
          },
          quantity: 1,
          selectedOptions: [],
          unitPriceCOP: 40000,
          totalPriceCOP: 40000,
        },
      ],
    };

    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(orderWithDeletedDish));

    const { result } = renderHook(() => useLastOrder());

    expect(result.current.hasLastOrder).toBe(true);
    expect(result.current.revalidation?.isValid).toBe(false);
    expect(result.current.revalidation?.unavailableItems).toContain('Pizza Descontinuada de Temporada');
    expect(result.current.revalidation?.warningMessage).toMatch(/ya no se encuentra disponible/i);
  });

  it('revalida y actualiza precios si los precios en menu.json cambiaron desde el último pedido', () => {
    const orderWithOldPrice: StoredOrder = {
      ...sampleOrder,
      items: [
        {
          id: 'margherita-dop',
          item: {
            ...menuData.items[0], // Margherita D.O.P. actualmente cuesta 38.000
            priceCOP: 30000, // Precio antiguo guardado
          },
          quantity: 2,
          selectedOptions: [],
          unitPriceCOP: 30000,
          totalPriceCOP: 60000,
        },
      ],
      subtotalCOP: 60000,
      deliveryFeeCOP: 6000,
      totalCOP: 66000,
    };

    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(orderWithOldPrice));

    const { result } = renderHook(() => useLastOrder());

    expect(result.current.revalidation?.hasPriceChanges).toBe(true);
    // Debe recalcular con el precio vigente en menu.json (38.000 * 2 = 76.000)
    expect(result.current.revalidation?.updatedOrder?.subtotalCOP).toBe(76000);
    // Y al ser 76.000 >= 70.000, el envío ahora es gratis (0 COP)
    expect(result.current.revalidation?.updatedOrder?.deliveryFeeCOP).toBe(0);
    expect(result.current.revalidation?.updatedOrder?.totalCOP).toBe(76000);
  });

  it('permite limpiar el último pedido de localStorage', () => {
    window.localStorage.setItem('fornace119:last-order:v1', JSON.stringify(sampleOrder));

    const { result } = renderHook(() => useLastOrder());
    expect(result.current.hasLastOrder).toBe(true);

    act(() => {
      result.current.clearLastOrder();
    });

    expect(result.current.hasLastOrder).toBe(false);
    expect(result.current.lastOrder).toBeNull();
    expect(window.localStorage.getItem('fornace119:last-order:v1')).toBeNull();
  });
});
