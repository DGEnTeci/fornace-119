import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataPrivacyModal } from '@/components/privacy/DataPrivacyModal';
import { LAST_ORDER_STORAGE_KEY } from '@/hooks/useLastOrder';
import { CartProvider, useCart } from '@/hooks/useCart';


describe('Task 6a: Modal de Tratamiento de Datos y Privacidad', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('muestra la información de la Ley 1581 de 2012 (Habeas Data) y almacenamiento local', () => {
    render(
      <CartProvider>
        <DataPrivacyModal isOpen={true} onClose={vi.fn()} />
      </CartProvider>
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /tratamiento de datos y privacidad local/i })
    ).toBeTruthy();
    expect(screen.getByText(/ley 1581 de 2012/i)).toBeTruthy();
    expect(screen.getByText(/almacenamiento local \(localstorage\)/i)).toBeTruthy();
  });

  it('permite borrar el último pedido y datos locales con confirmación accesible', () => {
    // Simular una orden previa guardada
    window.localStorage.setItem(
      LAST_ORDER_STORAGE_KEY,
      JSON.stringify({
        id: 'order-test-123',
        customer: { name: 'Juan David', phone: '3001234567', deliveryType: 'delivery' },
        items: [],
      })
    );

    const onDataCleared = vi.fn();
    render(
      <CartProvider>
        <DataPrivacyModal isOpen={true} onClose={vi.fn()} onDataCleared={onDataCleared} />
      </CartProvider>
    );

    const clearBtn = screen.getByRole('button', {
      name: /borrar último pedido y datos guardados/i,
    });
    expect(clearBtn.hasAttribute('disabled')).toBe(false);

    fireEvent.click(clearBtn);

    // Debe llamar al callback y limpiar localStorage
    expect(onDataCleared).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(LAST_ORDER_STORAGE_KEY)).toBeNull();

    // Feedback accesible anunciado
    const feedback = screen.getByTestId('privacy-cleared-feedback');
    expect(feedback).toBeTruthy();
    expect(feedback.textContent).toContain('han sido eliminados de este dispositivo');
  });

  it('vacía el carrito activo en memoria y en localStorage al confirmar el borrado', () => {
    // Configurar ítem previo en localStorage del carrito
    const sampleCartState = {
      items: [
        {
          id: 'margherita-default',
          item: {
            id: 'margherita',
            name: 'Margherita Verace DOP',
            priceCOP: 38000,
            category: 'pizzas',
            description: 'Clásica napolitana',
            isAvailable: true,
            isAlcoholic: false,
          },
          quantity: 2,
          unitPriceCOP: 38000,
          totalPriceCOP: 76000,
        },
      ],
      deliveryType: 'delivery',
    };
    window.localStorage.setItem('fornace119:cart:v1', JSON.stringify(sampleCartState));

    // Componente de prueba para inspeccionar el estado reactivo del carrito
    const TestConsumer = () => {
      const { items } = useCart();
      return (
        <div>
          <span data-testid="cart-count">{items.length}</span>
          <DataPrivacyModal isOpen={true} onClose={vi.fn()} />
        </div>
      );
    };

    render(
      <CartProvider>
        <TestConsumer />
      </CartProvider>
    );

    // Debe haber 1 ítem en el carrito inicialmente
    expect(screen.getByTestId('cart-count').textContent).toBe('1');

    const clearBtn = screen.getByRole('button', {
      name: /borrar último pedido y datos guardados/i,
    });
    fireEvent.click(clearBtn);

    // El carrito en memoria debe quedar en 0 ítems
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    // El localStorage del carrito debe tener su lista de ítems vacía
    const storedCart = JSON.parse(
      window.localStorage.getItem('fornace119:cart:v1') || '{"items":[]}'
    );
    expect(storedCart.items).toHaveLength(0);
    // Y la última orden debe quedar totalmente eliminada
    expect(window.localStorage.getItem(LAST_ORDER_STORAGE_KEY)).toBeNull();
  });
});


