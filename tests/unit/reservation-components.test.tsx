import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReservationModal } from '@/components/reservation/ReservationModal';
import { ReservationConfirmationModal } from '@/components/reservation/ReservationConfirmationModal';
import { TableReservation } from '@/types/reservation';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

const mockReservation: TableReservation = {
  fullName: 'Mateo Botero',
  phone: '3151234567',
  date: '2026-10-22',
  time: '20:00',
  guestCount: 8,
  occasion: 'cumpleanos',
  specialRequests: 'Una persona es celíaca y otra alérgica a los frutos secos',
};

describe('Componentes de Reserva (Task 5b - TDD)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ReservationConfirmationModal', () => {
    it('muestra "listo para enviar", el aviso de sujeción a confirmación y NO dice reserva confirmada', () => {
      render(
        <ReservationConfirmationModal
          isOpen={true}
          onClose={vi.fn()}
          reservation={mockReservation}
        />
      );

      expect(
        screen.getByText(/listo para enviar: pulsa Enviar en WhatsApp; el restaurante te confirmará la mesa/i)
      ).toBeDefined();

      expect(screen.queryByText(/reserva confirmada/i)).toBeNull();
      expect(screen.getByText(/sujeta a confirmación/i)).toBeDefined();
    });

    it('incluye botones para "Abrir WhatsApp de nuevo" y "Copiar mensaje"', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined);
      Object.assign(navigator, {
        clipboard: {
          writeText: writeTextMock,
        },
      });

      render(
        <ReservationConfirmationModal
          isOpen={true}
          onClose={vi.fn()}
          reservation={mockReservation}
        />
      );

      const openBtn = screen.getByRole('button', { name: /abrir whatsapp de nuevo/i });
      expect(openBtn).toBeDefined();

      const copyBtn = screen.getByRole('button', { name: /copiar mensaje/i });
      fireEvent.click(copyBtn);

      expect(writeTextMock).toHaveBeenCalledTimes(1);
      const text = writeTextMock.mock.calls[0][0];
      expect(text).toContain('Mateo Botero');
      expect(text).toContain('8 personas');

      await waitFor(() => {
        expect(screen.getByText(/¡mensaje copiado!/i)).toBeDefined();
      });
    });
  });

  describe('ReservationModal', () => {
    it('muestra aviso especial para grupos grandes cuando los comensales son 8 o más', () => {
      render(
        <ReservationModal
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      // Aumentar comensales a 8
      const guestInput = screen.getByLabelText(/número de comensales/i);
      fireEvent.change(guestInput, { target: { value: '8' } });

      expect(screen.getByText(RESTAURANT_CONFIG.reservations.largePartyNotice)).toBeDefined();
    });

    it('valida el teléfono móvil colombiano y deshabilita el envío si es inválido', () => {
      render(
        <ReservationModal
          isOpen={true}
          onClose={vi.fn()}
        />
      );

      const nameInput = screen.getByLabelText(/nombre completo/i);
      const phoneInput = screen.getByLabelText(/teléfono móvil/i);

      fireEvent.change(nameInput, { target: { value: 'Mateo Botero' } });
      fireEvent.change(phoneInput, { target: { value: '2001234567' } }); // Inválido: no empieza por 3

      const submitBtn = screen.getByRole('button', { name: /solicitar reserva por whatsapp/i });
      fireEvent.click(submitBtn);

      expect(screen.getByText(/debe iniciar por 3 y tener 10 dígitos/i)).toBeDefined();
    });
  });
});
