import React from 'react';

/**
 * Enlace accesible "Saltar al contenido principal" (Skip link)
 * Permite a los usuarios que navegan mediante teclado o lectores de pantalla
 * omitir la barra de navegación y saltar directamente al contenido.
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-terracotta focus:text-white focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-terracotta/40 transition-all text-sm tracking-wide"
    >
      Saltar al contenido principal
    </a>
  );
}
