import React, { useState, useRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';

describe('Componentes Base UI (Task 4a)', () => {
  describe('Button', () => {
    it('renderiza con objetivo táctil de al menos 44px', () => {
      render(<Button>Ordenar Ahora</Button>);
      const button = screen.getByRole('button', { name: /ordenar ahora/i });
      expect(button.className).toContain('min-h-[44px]');
      expect(button.className).toContain('min-w-[44px]');
    });

    it('aplica las clases de foco visible en color terracota', () => {
      render(<Button variant="primary">Continuar</Button>);
      const button = screen.getByRole('button', { name: /continuar/i });
      expect(button.className).toContain('focus-visible:ring-terracotta');
    });

    it('ejecuta el evento onClick al hacer clic', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clic</Button>);
      fireEvent.click(screen.getByRole('button', { name: /clic/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('no ejecuta onClick si está deshabilitado o cargando', () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <Button disabled onClick={handleClick}>
          Inactivo
        </Button>
      );
      fireEvent.click(screen.getByRole('button', { name: /inactivo/i }));
      expect(handleClick).not.toHaveBeenCalled();

      rerender(
        <Button isLoading onClick={handleClick}>
          Inactivo
        </Button>
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Badge', () => {
    it('renderiza correctamente el badge de masa-madre y dop', () => {
      const { rerender } = render(<Badge type="masa-madre" />);
      expect(screen.getByText('Masa Madre 48h')).toBeDefined();

      rerender(<Badge type="dop" />);
      expect(screen.getByText('D.O.P. Certificado')).toBeDefined();
    });

    it('permite sobrescribir la etiqueta por defecto', () => {
      render(<Badge type="vegetariana" label="100% Vegana" />);
      expect(screen.getByText('100% Vegana')).toBeDefined();
    });
  });

  describe('Modal', () => {
    const ModalTestComponent = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <button id="trigger-btn" onClick={() => setIsOpen(true)}>
            Abrir Modal
          </button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Personalizar Pizza"
            description="Elige tus adiciones"
          >
            <input type="text" placeholder="Nota especial" />
            <button id="save-btn" onClick={() => setIsOpen(false)}>
              Guardar
            </button>
          </Modal>
        </div>
      );
    };

    it('no renderiza nada cuando isOpen es false', () => {
      render(<Modal isOpen={false} onClose={vi.fn()}>Contenido</Modal>);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('renderiza con atributos accesibles y títulos correctos al abrir', () => {
      render(<ModalTestComponent />);
      fireEvent.click(screen.getByText('Abrir Modal'));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeDefined();
      expect(dialog.getAttribute('aria-modal')).toBe('true');
      expect(screen.getByText('Personalizar Pizza')).toBeDefined();
    });

    it('cierra el modal al presionar la tecla Escape', () => {
      render(<ModalTestComponent />);
      fireEvent.click(screen.getByText('Abrir Modal'));
      expect(screen.getByRole('dialog')).toBeDefined();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('cierra el modal al hacer clic en el backdrop', () => {
      render(<ModalTestComponent />);
      fireEvent.click(screen.getByText('Abrir Modal'));

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    it('devuelve el foco al elemento trigger al cerrarse', async () => {
      render(<ModalTestComponent />);
      const trigger = screen.getByRole('button', { name: /abrir modal/i });
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toBeDefined();

      // Cerrar por Escape
      fireEvent.keyDown(window, { key: 'Escape' });

      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    it('atrapa el foco (focus trap) dentro del modal en navegación con Tab', () => {
      render(<ModalTestComponent />);
      fireEvent.click(screen.getByText('Abrir Modal'));

      const closeBtn = screen.getByRole('button', { name: /cerrar modal/i });
      const input = screen.getByPlaceholderText('Nota especial');
      const saveBtn = screen.getByRole('button', { name: /guardar/i });

      // Si estamos en el último elemento (saveBtn) y presionamos Tab -> va al primer elemento (closeBtn)
      saveBtn.focus();
      expect(document.activeElement).toBe(saveBtn);

      fireEvent.keyDown(window, { key: 'Tab', shiftKey: false });
      expect(document.activeElement).toBe(closeBtn);

      // Si estamos en el primer elemento (closeBtn) y presionamos Shift+Tab -> va al último (saveBtn)
      fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
      expect(document.activeElement).toBe(saveBtn);
    });
  });

  describe('Drawer', () => {
    const DrawerTestComponent = () => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <div>
          <button id="drawer-trigger-btn" onClick={() => setIsOpen(true)}>
            Abrir Carrito
          </button>
          <Drawer
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title="Tu Pedido"
          >
            <button id="checkout-btn" onClick={() => setIsOpen(false)}>
              Ir a Pagar
            </button>
          </Drawer>
        </div>
      );
    };

    it('abre y cierra el drawer con tecla Esc y devuelve el foco al trigger', () => {
      render(<DrawerTestComponent />);
      const trigger = screen.getByRole('button', { name: /abrir carrito/i });
      trigger.focus();

      fireEvent.click(trigger);
      expect(screen.getByRole('dialog')).toBeDefined();
      expect(screen.getByText('Tu Pedido')).toBeDefined();

      fireEvent.keyDown(window, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });

    it('cierra el drawer al hacer clic en el backdrop', () => {
      render(<DrawerTestComponent />);
      fireEvent.click(screen.getByRole('button', { name: /abrir carrito/i }));
      expect(screen.getByRole('dialog')).toBeDefined();

      const backdrop = screen.getByTestId('drawer-backdrop');
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).toBeNull();
    });
  });
});
