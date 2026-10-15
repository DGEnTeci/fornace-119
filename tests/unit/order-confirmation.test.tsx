import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OrderConfirmationModal } from '@/components/cart/OrderConfirmationModal';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/hooks/useCart';
import { StoredOrder } from '@/types/cart';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

const mockOrder: StoredOrder = {
  id: 'ORD-1234',
  createdAt: new Date().toISOString(),
  customer: {
    name: 'Valentina Rossi',
    phone: '3109876543',
    address: 'Calle 119 # 6-25, Usaquén',
    deliveryType: 'delivery',
    paymentMethod: 'Transferencia digital (Nequi / Daviplata)',
    notes: 'Timbre 201',
  },
  items: [
    {
      id: 'margherita-dop-default',
      item: {
        id: 'margherita-dop',
        categoryId: 'tradizionali',
        name: 'Margherita D.O.P.',
        italianName: 'Margherita Tradizionale',
        description: 'Tomate San Marzano D.O.P. y mozzarella di bufala campana.',
        priceCOP: 38000,
        imageUrl: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143',
        badges: ['masa-madre', 'dop'],
      },
      quantity: 1,
      selectedOptions: [
        { id: 'extra-bufala', name: 'Extra Mozzarella di Bufala', priceCOP: 9000 },
      ],
      unitPriceCOP: 47000,
      totalPriceCOP: 47000,
    },
  ],
  subtotalCOP: 47000,
  deliveryFeeCOP: 6000,
  totalCOP: 53000,
};

describe('OrderConfirmationModal (Task 4b pre-Task 5 requirements)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('no indica que el pedido está confirmado sino "Listo para enviar: pulsa Enviar en WhatsApp; el restaurante te confirmará el tiempo"', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        order={mockOrder}
      />
    );

    expect(
      screen.getByText(/Listo para enviar: pulsa Enviar en WhatsApp; el restaurante te confirmará el tiempo/i)
    ).toBeDefined();
    // Confirma que no diga que está confirmado
    expect(screen.queryByText(/tu orden está en marcha/i)).toBeNull();
  });

  it('muestra los botones de "Abrir WhatsApp de nuevo" y "Copiar mensaje"', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        order={mockOrder}
      />
    );

    const reOpenBtn = screen.getByRole('button', { name: /abrir whatsapp de nuevo/i });
    expect(reOpenBtn).toBeDefined();

    const copyBtn = screen.getByRole('button', { name: /copiar mensaje/i });
    expect(copyBtn).toBeDefined();
  });

  it('permite copiar el mensaje estructurado al portapapeles y da feedback visual', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    });

    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        order={mockOrder}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /copiar mensaje/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledTimes(1);
    const clipboardContent = writeTextMock.mock.calls[0][0];
    expect(clipboardContent).toMatch(/FORNACE 119/i);
    expect(clipboardContent).toContain('Margherita D.O.P.');

    await waitFor(() => {
      expect(screen.getByText(/¡mensaje copiado!/i)).toBeDefined();
    });
  });

  it('muestra el tiempo estimado como aproximado desde RESTAURANT_CONFIG', () => {
    render(
      <OrderConfirmationModal
        isOpen={true}
        onClose={vi.fn()}
        order={mockOrder}
      />
    );

    expect(
      screen.getByText(RESTAURANT_CONFIG.delivery.estimatedTimeApproximate)
    ).toBeDefined();
  });

  it('vacía el carrito únicamente al cerrar el modal de confirmación, NO al pulsar Enviar en el checkout', () => {
    const clearCartMock = vi.fn();
    const openMock = vi.fn();
    window.open = openMock;

    const mockCartState: any = {
      items: mockOrder.items,
      subtotalCOP: mockOrder.subtotalCOP,
      deliveryFeeCOP: mockOrder.deliveryFeeCOP,
      totalCOP: mockOrder.totalCOP,
      itemCount: 1,
      isEligibleForFreeShipping: false,
      amountNeededForFreeShippingCOP: 23000,
      deliveryType: 'delivery',
      isHydrated: true,
      addItem: vi.fn(),
      removeItem: vi.fn(),
      updateQuantity: vi.fn(),
      setDeliveryType: vi.fn(),
      clearCart: clearCartMock,
      restoreOrder: vi.fn(),
    };

    render(
      <CartProvider>
        <CartDrawer isOpen={true} onClose={vi.fn()} cart={mockCartState} />
      </CartProvider>
    );

    // Llenar formulario con datos válidos
    const nameInput = screen.getByLabelText(/nombre completo/i);
    const phoneInput = screen.getByLabelText(/teléfono móvil/i);
    const addressInput = screen.getByLabelText(/dirección de entrega/i);

    fireEvent.change(nameInput, { target: { value: 'Valentina Rossi' } });
    fireEvent.change(phoneInput, { target: { value: '3109876543' } });
    fireEvent.change(addressInput, { target: { value: 'Calle 119 # 6-25' } });

    const submitBtn = screen.getByRole('button', { name: /completar pedido por whatsapp/i });
    expect(submitBtn.hasAttribute('disabled')).toBe(false);

    // Click checkout
    fireEvent.click(submitBtn);

    // 1. WhatsApp se intentó abrir
    expect(openMock).toHaveBeenCalled();

    // 2. clearCart aún NO debe haber sido llamado
    expect(clearCartMock).not.toHaveBeenCalled();

    // 3. Modal de confirmación está abierto
    const closeModalBtn = screen.getByRole('button', { name: /entendido, volver a la carta/i });
    expect(closeModalBtn).toBeDefined();

    // 4. Cerrar el modal -> AHORA sí debe llamarse clearCart
    fireEvent.click(closeModalBtn);
    expect(clearCartMock).toHaveBeenCalledTimes(1);
  });
});
