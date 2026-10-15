'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap y manejo de Esc
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;

        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      // Guardar elemento enfocado antes de abrir el modal para devolver el foco al cerrar
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Bloquear scroll de la página de fondo
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      // Enfocar primer elemento focusable dentro del modal
      const timer = setTimeout(() => {
        const dialog = dialogRef.current;
        if (dialog) {
          const firstFocusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            dialog.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);

        // Devolver el foco al elemento de origen
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="presentation"
    >
      {/* Backdrop con desenfoque suave */}
      <div
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none"
        onClick={onClose}
        aria-hidden="true"
        data-testid="modal-backdrop"
      />

      {/* Contenedor del Diálogo */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-cream-50 rounded-2xl shadow-2xl border border-charcoal-700/10 p-6 z-10 transform transition-all duration-200 motion-reduce:transition-none focus:outline-none ${className}`}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-charcoal-700/10">
          <div>
            {title && (
              <h2
                id="modal-title"
                className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight"
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                id="modal-description"
                className="text-sm text-charcoal-600 mt-1"
              >
                {description}
              </p>
            )}
          </div>

          {/* Botón de Cierre accesible con 44px de touch target y foco terracota */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-charcoal-600 hover:text-terracotta hover:bg-cream-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
