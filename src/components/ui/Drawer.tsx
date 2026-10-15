'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
  className = '',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus trap y cierre con tecla Esc
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const drawer = drawerRef.current;
        if (!drawer) return;

        const focusableElements = Array.from(
          drawer.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
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
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        const drawer = drawerRef.current;
        if (drawer) {
          const firstFocusable = drawer.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            drawer.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);

        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-950/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none"
        onClick={onClose}
        aria-hidden="true"
        data-testid="drawer-backdrop"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        {/* Panel lateral deslizante */}
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'drawer-title' : undefined}
          aria-describedby={description ? 'drawer-description' : undefined}
          tabIndex={-1}
          className={`w-screen ${widthClasses[width]} bg-cream-50 shadow-2xl border-l border-charcoal-700/10 flex flex-col focus:outline-none transition-transform duration-300 motion-reduce:transition-none ${className}`}
        >
          {/* Cabecera */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal-700/10">
            <div>
              {title && (
                <h2
                  id="drawer-title"
                  className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="drawer-description"
                  className="text-sm text-charcoal-600 mt-1"
                >
                  {description}
                </p>
              )}
            </div>

            {/* Botón de cierre accesible de 44px */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar panel lateral"
              className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full text-charcoal-600 hover:text-terracotta hover:bg-cream-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contenido con scroll independiente */}
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};
