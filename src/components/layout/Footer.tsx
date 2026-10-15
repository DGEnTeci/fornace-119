'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { Phone, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export interface FooterProps {
  onOpenPrivacyModal: () => void;
  onOpenReservation: () => void;
}

/**
 * Footer editorial de Fornace 119:
 * Enlaces de navegación, contacto directo, aviso legal de licor (Ley 124 de 1994)
 * y acceso al tratamiento de datos (Ley 1581 de 2012).
 */
export function Footer({ onOpenPrivacyModal, onOpenReservation }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      className="mt-16 bg-charcoal-950 text-charcoal-300 border-t border-charcoal-800 text-sm"
    >
      {/* Aviso Legal de Licores Obligatorio por Ley */}
      <div className="bg-charcoal-900 border-b border-charcoal-800 py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2 text-center text-xs text-amber-200/90 font-medium tracking-wide">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Ley 124 de 1994 y Ley 30 de 1986: «El exceso de alcohol es perjudicial para la salud.
            Prohíbase el expendio de bebidas embriagantes a menores de edad.»
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Columna 1: Marca & Misión */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center font-serif text-xl font-bold">
              F
            </div>
            <span className="font-serif text-xl font-bold text-cream-50 tracking-tight">
              {RESTAURANT_CONFIG.name}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-charcoal-200">
            Pizzería contemporánea con horno a la vista en Usaquén.
            Masa madre con 48h de fermentación, ingredientes italianos D.O.P. y cocción a 450°C.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenPrivacyModal}
              className="inline-flex items-center gap-1.5 text-xs text-amber-200 hover:text-white hover:underline cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Privacidad & Tratamiento de Datos</span>
            </button>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-cream-50 uppercase tracking-wider text-[11px]">
            Explorar
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#hero" className="text-charcoal-200 hover:text-white transition-colors">
                Inicio
              </a>
            </li>
            <li>
              <a href="#nuestra-masa" className="text-charcoal-200 hover:text-white transition-colors">
                Nuestra Masa & Filosofía
              </a>
            </li>
            <li>
              <a href="#carta" className="text-charcoal-200 hover:text-white transition-colors">
                Nuestra Carta
              </a>
            </li>
            <li>
              <button
                onClick={onOpenReservation}
                className="text-charcoal-200 hover:text-white transition-colors text-left cursor-pointer"
              >
                Reservar Mesa en Salón
              </button>
            </li>
            <li>
              <a href="#ubicacion" className="text-charcoal-200 hover:text-white transition-colors">
                Sede & Domicilios
              </a>
            </li>
            <li>
              <Link href="/design" className="text-amber-200 hover:text-white transition-colors">
                Sistema de Diseño →
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Ubicación y Horarios */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-cream-50 uppercase tracking-wider text-[11px]">
            Ubicación en Usaquén
          </h4>
          <p className="flex items-start gap-1.5 text-charcoal-200">
            <MapPin className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
            <span>
              {RESTAURANT_CONFIG.location.address}
              <br />
              {RESTAURANT_CONFIG.location.neighborhood}, {RESTAURANT_CONFIG.location.city}
            </span>
          </p>

          <p className="flex items-start gap-1.5 pt-1 text-charcoal-200">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {RESTAURANT_CONFIG.schedule.days}: {RESTAURANT_CONFIG.schedule.hours}
              <br />
              <span className="text-[11px] text-charcoal-300">Lunes cerrado por reposo de masa</span>
            </span>
          </p>
        </div>

        {/* Columna 4: Pedidos & WhatsApp */}
        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-cream-50 uppercase tracking-wider text-[11px]">
            Contacto & Pedidos
          </h4>
          <p className="text-charcoal-200">
            Pedidos a domicilio y reservas coordinadas directamente con nuestro equipo:
          </p>

          <a
            href={`https://wa.me/${RESTAURANT_CONFIG.whatsapp.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-terracotta text-white font-semibold hover:bg-terracotta-dark transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span>+{RESTAURANT_CONFIG.whatsapp.phone}</span>
          </a>

          <div className="pt-2 text-[11px] text-charcoal-300">
            Pagos habilitados: Nequi, Daviplata, Llave Bre-B, Datáfono inalámbrico y Efectivo.
          </div>
        </div>
      </div>

      {/* Franja de Derechos de Autor y Privacidad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-300">
        <div className="space-y-1 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} {RESTAURANT_CONFIG.name}. Todos los derechos reservados.
            Usaquén, Bogotá D.C., Colombia.
          </p>
          <p className="text-[11px] text-amber-300 font-semibold">
            Marca ficticia con fines de demostración
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenPrivacyModal}
            className="text-charcoal-200 hover:text-white underline cursor-pointer"
          >
            Gestión de Datos Locales
          </button>
          <span>•</span>
          <span>Hecho con devoción napolitana</span>
        </div>
      </div>
    </footer>
  );
}
