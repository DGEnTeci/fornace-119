'use client';

import React, { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { MenuItem, MenuCategory } from '@/types/menu';
import menuData from '@/data/menu.json';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { OurDough } from '@/components/sections/OurDough';
import { LocationSection } from '@/components/sections/LocationSection';
import { MenuCategoryTabs } from '@/components/menu/MenuCategoryTabs';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { ReorderBanner } from '@/components/cart/ReorderBanner';
import type { CustomizedItemPayload } from '@/components/menu/ItemCustomizerModal';
import { Check } from 'lucide-react';

const ItemCustomizerModal = dynamic(
  () => import('@/components/menu/ItemCustomizerModal').then((mod) => mod.ItemCustomizerModal),
  { ssr: false }
);
const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((mod) => mod.CartDrawer),
  { ssr: false }
);
const ReservationModal = dynamic(
  () => import('@/components/reservation/ReservationModal').then((mod) => mod.ReservationModal),
  { ssr: false }
);
const DataPrivacyModal = dynamic(
  () => import('@/components/privacy/DataPrivacyModal').then((mod) => mod.DataPrivacyModal),
  { ssr: false }
);

export default function HomePage() {
  const cart = useCart();
  const [activeCategory, setActiveCategory] = useState<string>('tradizionali');
  const [selectedItemForModal, setSelectedItemForModal] = useState<MenuItem | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = menuData.categories as MenuCategory[];
  const allItems = menuData.items as MenuItem[];

  // Filtrar platos por la categoría actualmente seleccionada
  const filteredItems = allItems.filter((item) => item.categoryId === activeCategory);
  const currentCategoryObj = categories.find((c) => c.id === activeCategory);

  const handleSelectItem = (item: MenuItem) => {
    setSelectedItemForModal(item);
    setIsCustomizerOpen(true);
  };

  const handleAddToCart = (payload: CustomizedItemPayload) => {
    cart.addItem(
      payload.item,
      payload.quantity,
      payload.selectedOptions,
      payload.notes
    );

    // Feedback visual y anuncio accesible
    setToastMessage(`¡${payload.quantity}x ${payload.item.name} agregado a tu bolsa!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleReorder = (order: any) => {
    cart.restoreOrder(order);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col selection:bg-terracotta selection:text-white">
      {/* Header con navegación accesible y trigger de carrito */}
      <Header
        onOpenCart={() => setIsCartOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Región de anuncio accesible para lectores de pantalla */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        data-testid="page-live-announcement"
      >
        {toastMessage}
      </div>

      {/* Toast flotante de retroalimentación de agregado */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-charcoal-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-terracotta/40 animate-fade-in text-sm">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
          <span>{toastMessage}</span>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-xs font-bold text-terracotta-light underline ml-2 cursor-pointer"
          >
            Ver bolsa
          </button>
        </div>
      )}

      {/* Contenido Principal con id para el SkipLink y landmarks semánticos */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full space-y-12 outline-none"
      >
        {/* 1. Hero: Historia de la masa madre y el horno (estable para LCP sin saltos) */}
        <Hero onOpenReservation={() => setIsReservationOpen(true)} />

        {/* Banner de Recompra Inteligente (debajo del hero para eliminar CLS) */}
        <ReorderBanner onReorder={handleReorder} />

        {/* 2. Nuestra Masa: Filosofía, reposo y técnica */}
        <OurDough />

        {/* 3. Carta gastronómica interactiva */}
        <section id="carta" aria-labelledby="menu-heading" className="space-y-6 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-charcoal-700/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-terracotta font-bold">
                Selección Gastronómica
              </span>
              <h2
                id="menu-heading"
                className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight"
              >
                Nuestra Carta
              </h2>
              {currentCategoryObj && (
                <p className="text-sm text-charcoal-600 mt-1 max-w-xl">
                  {currentCategoryObj.subtitle}
                </p>
              )}
            </div>

            <span className="text-xs text-charcoal-500 font-medium">
              Mostrando {filteredItems.length} opciones en {currentCategoryObj?.name}
            </span>
          </div>

          {/* Pestañas accesibles por teclado (flechas ← / → / Home / End) */}
          <MenuCategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Cuadrícula de Platos / Tabpanel Accesible */}
          <div
            id={`panel-${activeCategory}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory}`}
            tabIndex={0}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 focus:outline-none"
          >
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelect={handleSelectItem}
              />
            ))}
          </div>
        </section>

        {/* 4. Sede en Usaquén, Cobertura de Entrega y Medios de Pago */}
        <LocationSection />
      </main>

      {/* Footer editorial con contacto, aviso legal de licor y tratamiento de datos */}
      <Footer
        onOpenPrivacyModal={() => setIsPrivacyOpen(true)}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* Modal de Personalización de Ítems */}
      <ItemCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        item={selectedItemForModal}
        onAddToCart={handleAddToCart}
      />

      {/* Drawer del Carrito / Bolsa */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Modal de Reservas de Mesa en Salón */}
      <ReservationModal
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Modal de Tratamiento de Datos (Habeas Data) y Borrado de Pedido */}
      <DataPrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
