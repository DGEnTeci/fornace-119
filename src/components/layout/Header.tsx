'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { formatCOP } from '@/lib/formatters';
import { ShoppingBag, Calendar, ArrowRight } from 'lucide-react';

export interface HeaderProps {
  onOpenCart: () => void;
  onOpenReservation: () => void;
}

/**
 * Header de Navegación Editorial:
 * Marca, navegación por anclas, llamada a reservas y trigger interactivo de carrito.
 */
export function Header({ onOpenCart, onOpenReservation }: HeaderProps) {
  const cart = useCart();

  return (
    <header
      role="banner"
      className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-charcoal-700/10 transition-shadow"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Identidad de Marca */}
        <a href="#hero" className="flex items-center gap-3 no-underline group">
          <div className="w-11 h-11 rounded-2xl bg-terracotta text-white flex items-center justify-center font-serif text-2xl font-bold shadow-sm group-hover:bg-terracotta-dark transition-colors">
            F
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900 block leading-none">
              {RESTAURANT_CONFIG.name}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-terracotta font-semibold mt-1 block">
              {RESTAURANT_CONFIG.tagline}
            </span>
          </div>
        </a>

        {/* Navegación para pantallas medianas/grandes */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-xs font-semibold text-charcoal-700"
        >
          <a href="#nuestra-masa" className="hover:text-terracotta transition-colors">
            Nuestra Masa
          </a>
          <a href="#carta" className="hover:text-terracotta transition-colors">
            Carta
          </a>
          <a href="#ubicacion" className="hover:text-terracotta transition-colors">
            Ubicación & Envíos
          </a>
        </nav>

        {/* Acciones: Reservar y Bolsa */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/design" className="hidden lg:inline-block">
            <Button variant="ghost" size="sm" className="text-xs text-charcoal-600 gap-1.5">
              <span>Diseño</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenReservation}
            className="text-xs text-charcoal-800 gap-1.5 border-charcoal-700/20 hover:border-terracotta hover:text-terracotta"
            aria-label="Abrir formulario para reservar una mesa en nuestro salón de Usaquén"
          >
            <Calendar className="w-3.5 h-3.5 text-terracotta" />
            <span className="hidden sm:inline">Reservar Mesa</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenCart}
            className="gap-2 relative shadow-sm"
            aria-label={`Ver bolsa de pedido con ${cart.itemCount} productos. Total acumulado: ${formatCOP(cart.totalCOP)}`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="font-medium hidden sm:inline">Tu Bolsa</span>
            {cart.itemCount > 0 && (
              <span
                data-testid="header-cart-badge"
                className="bg-charcoal-900 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center"
              >
                {cart.itemCount}
              </span>
            )}
            {cart.totalCOP > 0 && (
              <span className="text-white/90 text-xs font-semibold pl-1 border-l border-white/20 hidden md:inline">
                {formatCOP(cart.totalCOP)}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
