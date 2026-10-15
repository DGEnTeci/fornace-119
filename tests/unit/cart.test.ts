import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart, CartProvider } from '@/hooks/useCart';
import { MenuItem } from '@/types/menu';

const renderCart = () => renderHook(() => useCart(), { wrapper: CartProvider });

const mockPizza: MenuItem = {
  id: 'margherita-dop',
  categoryId: 'tradizionali',
  name: 'Margherita D.O.P.',
  italianName: 'Margherita Tradizionale',
  description: 'Tomate San Marzano D.O.P. y mozzarella di bufala campana.',
  priceCOP: 38000,
  imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
  badges: ['masa-madre', 'dop'],
  availableOptions: [
    { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala', priceCOP: 9000 },
  ],
};

const mockAntipasto: MenuItem = {
  id: 'burrata-pugliese-confit',
  categoryId: 'antipasti',
  name: 'Burrata Pugliese con Pomodorini Confit',
  italianName: 'Burrata Intera',
  description: 'Burrata entera con tomates confitados.',
  priceCOP: 36000,
  imageUrl: 'https://images.unsplash.com/photo-1628294895950-9805252327bc',
  badges: ['vegetariana'],
};

describe('useCart Hook', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('inicia con un carrito vacío por defecto y estado hidratado', () => {
    const { result } = renderCart();

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotalCOP).toBe(0);
    expect(result.current.deliveryFeeCOP).toBe(0);
    expect(result.current.totalCOP).toBe(0);
    expect(result.current.deliveryType).toBe('delivery');
    expect(result.current.isHydrated).toBe(true);
  });

  it('agrega un producto simple y calcula subtotales y envío dinámico', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 1);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].item.id).toBe('margherita-dop');
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotalCOP).toBe(38000);
    // Como subtotal (38.000) < 70.000, aplica tarifa fija de 6.000
    expect(result.current.deliveryFeeCOP).toBe(6000);
    expect(result.current.totalCOP).toBe(44000);
    expect(result.current.isEligibleForFreeShipping).toBe(false);
    expect(result.current.amountNeededForFreeShippingCOP).toBe(32000);
  });

  it('calcula envío gratis cuando el subtotal alcanza o supera 70.000 COP', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 2); // 38.000 * 2 = 76.000 COP
    });

    expect(result.current.subtotalCOP).toBe(76000);
    expect(result.current.deliveryFeeCOP).toBe(0);
    expect(result.current.totalCOP).toBe(76000);
    expect(result.current.isEligibleForFreeShipping).toBe(true);
    expect(result.current.amountNeededForFreeShippingCOP).toBe(0);
  });

  it('calcula tarifa de envío 0 si el tipo de pedido cambia a takeaway', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 1); // 38.000 COP
    });

    expect(result.current.deliveryFeeCOP).toBe(6000);

    act(() => {
      result.current.setDeliveryType('takeaway');
    });

    expect(result.current.deliveryType).toBe('takeaway');
    expect(result.current.deliveryFeeCOP).toBe(0);
    expect(result.current.totalCOP).toBe(38000);
  });

  it('agrega ítems con adiciones personalizadas y calcula el precio unitario compuesto', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(
        mockPizza,
        1,
        [{ id: 'extra-bufala', name: 'Extra Mozzarella di Bufala', priceCOP: 9000 }],
        'Sin orégano'
      );
    });

    expect(result.current.items.length).toBe(1);
    // 38.000 + 9.000 = 47.000 COP
    expect(result.current.items[0].unitPriceCOP).toBe(47000);
    expect(result.current.items[0].totalPriceCOP).toBe(47000);
    expect(result.current.items[0].notes).toBe('Sin orégano');
  });

  it('incrementa la cantidad si se agrega exactamente el mismo producto con las mismas adiciones', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 1);
    });
    act(() => {
      result.current.addItem(mockPizza, 2);
    });

    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.items[0].totalPriceCOP).toBe(38000 * 3);
  });

  it('separa en líneas distintas si el mismo plato tiene adiciones diferentes', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 1, []);
    });
    act(() => {
      result.current.addItem(mockPizza, 1, [
        { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala', priceCOP: 9000 },
      ]);
    });

    expect(result.current.items.length).toBe(2);
    expect(result.current.itemCount).toBe(2);
  });

  it('permite actualizar cantidad y remover ítems', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 1);
      result.current.addItem(mockAntipasto, 1);
    });

    const pizzaCartItemId = result.current.items[0].id;
    const antipastoCartItemId = result.current.items[1].id;

    act(() => {
      result.current.updateQuantity(pizzaCartItemId, 3);
    });
    expect(result.current.items[0].quantity).toBe(3);

    act(() => {
      result.current.removeItem(antipastoCartItemId);
    });
    expect(result.current.items.length).toBe(1);
    expect(result.current.items[0].id).toBe(pizzaCartItemId);
  });

  it('persiste el estado del carrito en localStorage y se recupera correctamente', () => {
    const { result, unmount } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 2);
    });

    unmount();

    // Nueva instancia de hook debe hidratarse desde localStorage
    const { result: nextResult } = renderCart();
    expect(nextResult.current.items.length).toBe(1);
    expect(nextResult.current.items[0].quantity).toBe(2);
    expect(nextResult.current.subtotalCOP).toBe(76000);
  });

  it('maneja localStorage corrupto sin romperse, reiniciando a carrito vacío', () => {
    window.localStorage.setItem('fornace119:cart:v1', 'invalid-json{{{');

    const { result } = renderCart();
    expect(result.current.items).toEqual([]);
    expect(result.current.subtotalCOP).toBe(0);
  });

  it('limita la cantidad máxima a 20 unidades por ítem en el carrito', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 25);
    });

    // Debe topar en 20
    expect(result.current.items[0].quantity).toBe(20);
    expect(result.current.items[0].totalPriceCOP).toBe(38000 * 20);

    // Si intenta sumar más, se mantiene en 20
    act(() => {
      result.current.addItem(mockPizza, 5);
    });
    expect(result.current.items[0].quantity).toBe(20);

    // Si intenta actualizar directo por encima de 20, se topa en 20
    const cartItemId = result.current.items[0].id;
    act(() => {
      result.current.updateQuantity(cartItemId, 99);
    });
    expect(result.current.items[0].quantity).toBe(20);
  });

  it('respeta el mínimo de 1 unidad al agregar y elimina el ítem si se reduce a 0', () => {
    const { result } = renderCart();

    act(() => {
      result.current.addItem(mockPizza, 0); // Intentar agregar 0 unidades
    });

    // Se asigna mínimo 1 unidad
    expect(result.current.items[0].quantity).toBe(1);

    const cartItemId = result.current.items[0].id;
    act(() => {
      result.current.updateQuantity(cartItemId, 0); // 0 lo remueve
    });
    expect(result.current.items.length).toBe(0);
  });
});
