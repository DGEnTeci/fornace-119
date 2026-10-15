'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Drawer } from '@/components/ui/Drawer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ReorderBanner } from '@/components/cart/ReorderBanner';
import { useCart } from '@/hooks/useCart';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import menuData from '@/data/menu.json';
import { MenuItem, MenuData } from '@/types/menu';
import { Flame, ShoppingBag, MapPin, Clock, Phone, Plus } from 'lucide-react';
import Link from 'next/link';
import { formatCOP } from '@/lib/formatters';

const typedMenu = menuData as unknown as MenuData;

export default function DesignSystemPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cart = useCart();

  const handleAddSampleItem = (item: MenuItem) => {
    cart.addItem(item, 1);
    setIsCartOpen(true);
  };

  const handleReorder = (order: any) => {
    cart.restoreOrder(order);
    setIsCartOpen(true);
  };

  return (
    <main className="min-h-screen bg-cream-100 text-charcoal-900 pb-20">
      {/* Header Editorial de Previsualización */}
      <header className="border-b border-charcoal-700/10 bg-cream-50 sticky top-0 z-30 backdrop-blur-md bg-cream-50/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-terracotta text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm group-hover:bg-terracotta-hover transition-colors">
                F
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-charcoal-900 block leading-none">
                  {RESTAURANT_CONFIG.name}
                </span>
                <span className="text-xs uppercase tracking-widest text-terracotta font-medium mt-1 block">
                  Design System Showcase (/design)
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Ir a Home
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="gap-2 relative"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Mi Carrito</span>
              {cart.itemCount > 0 && (
                <span className="ml-1 bg-white text-terracotta text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Banner de Recompra interactivo */}
        <ReorderBanner onReorder={handleReorder} />

        {/* Hero Showcase */}
        <div className="bg-cream-50 rounded-3xl p-8 sm:p-12 border border-charcoal-700/10 shadow-sm relative overflow-hidden">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-terracotta bg-terracotta/10 px-3 py-1 rounded-full">
                <Flame className="w-3.5 h-3.5" />
                Task 4b Completada: Carrito, Validación & Recompra
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-charcoal-900 leading-[1.15] mb-4">
              Módulos de Carrito & Recompra Rápida
            </h1>
            <p className="text-charcoal-600 text-lg leading-relaxed mb-6">
              Prueba el flujo completo: agrega platos de la carta, prueba la validación del teléfono colombiano (10 dígitos empezando en 3), el selector delivery/takeaway, el envío a WhatsApp y la pantalla de confirmación &quot;Disfruta&quot;.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsCartOpen(true)}
                className="gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Abrir CartDrawer ({cart.itemCount} ítems)</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => setIsModalOpen(true)}
              >
                Probar Modal Genérico
              </Button>
            </div>
          </div>
        </div>

        {/* Muestra rápida de platos para agregar al carrito */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-2xl font-bold text-charcoal-900">
              Agregar Platos al Carrito de Prueba
            </h2>
            <span className="text-sm text-charcoal-500">
              Haz clic en &quot;+ Agregar&quot; para probar el flujo de compra
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {typedMenu.items.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-cream-50 p-5 rounded-2xl border border-charcoal-700/10 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                      {item.categoryId}
                    </span>
                    <Badge type={item.badges[0] || 'default'} />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-charcoal-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-charcoal-600 line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-charcoal-700/10">
                  <span className="font-bold text-base text-terracotta">
                    {formatCOP(item.priceCOP)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSampleItem(item)}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Badges de Contraste */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-4">
            Badges y Distintivos Gastronómicos (Contraste WCAG AA ≥ 4.5:1)
          </h2>
          <div className="flex flex-wrap gap-3 p-6 bg-cream-50 rounded-2xl border border-charcoal-700/10">
            <Badge type="masa-madre" />
            <Badge type="dop" />
            <Badge type="vegetariana" />
            <Badge type="de-autor" />
            <Badge type="picante" />
            <Badge type="default" label="Edición Limitada" />
          </div>
        </section>

        {/* Sección: Botones */}
        <section>
          <h2 className="font-serif text-2xl font-bold text-charcoal-900 mb-4">
            Botones Accesibles (Touch Target ≥ 44px & Foco Terracota)
          </h2>
          <div className="p-6 bg-cream-50 rounded-2xl border border-charcoal-700/10 space-y-6">
            <div>
              <span className="text-xs font-semibold text-charcoal-600 uppercase tracking-wider block mb-3">
                Variantes Semánticas:
              </span>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="primary">Primary (Terracota)</Button>
                <Button variant="secondary">Secondary (Carbón)</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="primary" isLoading>
                  Cargando
                </Button>
                <Button variant="primary" disabled>
                  Deshabilitado
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CartDrawer Activo Conectado */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} />

      {/* Modal Genérico para pruebas de accesibilidad */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal de Demostración"
        description="Verificación de focus trap, tecla Escape y devolución de foco al trigger."
      >
        <div className="space-y-4">
          <p className="text-sm text-charcoal-700">
            Presiona la tecla <kbd className="px-2 py-0.5 bg-cream-200 rounded font-mono text-xs">Tab</kbd> para comprobar que el foco cicla dentro del diálogo, o <kbd className="px-2 py-0.5 bg-cream-200 rounded font-mono text-xs">Esc</kbd> para cerrarlo y devolver el foco al botón que lo abrió.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cerrar
            </Button>
            <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
              Aceptar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Drawer Genérico */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Panel Lateral Genérico"
      >
        <p className="text-sm text-charcoal-700">
          Slide-over lateral con atributos accesibles y bloqueo de scroll.
        </p>
      </Drawer>
    </main>
  );
}
