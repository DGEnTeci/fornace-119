'use client';

import React from 'react';
import Link from 'next/link';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { formatPhoneDisplay } from '@/lib/formatters';
import { Phone, MapPin, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

export interface FooterProps {
  onOpenPrivacyModal: () => void;
  onOpenReservation: () => void;
}

/**
 * Footer editorial de Fornace 119:
 * Enlaces de navegación, contacto directo, aviso legal de licor (Ley 124 de 1994)
 * y acceso al tratamiento de datos (Ley 1581 de 2012).
 * Diseñado con alto contraste (AAA) sobre fondo carbón profundo.
 */
export function Footer({ onOpenPrivacyModal, onOpenReservation }: FooterProps) {
  const paymentMethods = ['Nequi', 'Daviplata', 'Bre-B', 'Datáfono', 'Efectivo'];

  return (
    <footer
      role="contentinfo"
      className="mt-16 bg-charcoal-950 text-charcoal-200 border-t border-charcoal-800 text-sm"
    >
      {/* Aviso Legal de Licores Obligatorio por Ley */}
      <div className="bg-charcoal-900 border-b border-charcoal-800 py-3.5 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2.5 text-center text-xs text-amber-300 font-medium tracking-wide">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Ley 124 de 1994 y Ley 30 de 1986:</strong> «El exceso de alcohol es perjudicial para la salud.
            Prohíbase el expendio de bebidas embriagantes a menores de edad.»
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
        {/* Columna 1: Marca & Misión */}
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-terracotta text-white flex items-center justify-center font-serif text-xl font-bold shadow-sm">
                F
              </div>
              <span className="font-serif text-2xl font-bold text-cream-50 tracking-tight">
                {RESTAURANT_CONFIG.name}
              </span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-200/90 pl-0.5">
              Pizzería Napoletana Contemporánea
            </p>
          </div>

          <p className="text-sm leading-relaxed text-charcoal-200">
            Masa madre con 48h de fermentación lenta, horno artesanal a 450°C e ingredientes
            italianos con certificación D.O.P. en Usaquén, Bogotá.
          </p>

          <div className="pt-1">
            <button
              onClick={onOpenPrivacyModal}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-charcoal-900 border border-charcoal-800 text-xs font-medium text-amber-200 hover:text-white hover:border-amber-400/50 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tratamiento de Datos & Privacidad</span>
            </button>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div className="space-y-3">
          <h4 className="font-bold text-cream-50 uppercase tracking-widest text-xs border-b border-charcoal-800 pb-2">
            Explorar
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="#hero" className="text-charcoal-200 hover:text-white transition-colors block">
                Inicio
              </a>
            </li>
            <li>
              <a href="#nuestra-masa" className="text-charcoal-200 hover:text-white transition-colors block">
                Nuestra Masa & Filosofía
              </a>
            </li>
            <li>
              <a href="#carta" className="text-charcoal-200 hover:text-white transition-colors block">
                Nuestra Carta & Especialidades
              </a>
            </li>
            <li>
              <button
                onClick={onOpenReservation}
                className="text-charcoal-200 hover:text-white transition-colors text-left cursor-pointer block"
              >
                Reservar Mesa en Salón
              </button>
            </li>
            <li>
              <a href="#ubicacion" className="text-charcoal-200 hover:text-white transition-colors block">
                Sede Usaquén & Domicilios
              </a>
            </li>
            <li className="pt-1">
              <Link
                href="/design"
                className="inline-flex items-center text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors"
              >
                Sistema de Diseño Editorial →
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3: Ubicación y Horarios */}
        <div className="space-y-4">
          <h4 className="font-bold text-cream-50 uppercase tracking-widest text-xs border-b border-charcoal-800 pb-2">
            Ubicación & Horarios
          </h4>

          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2 text-charcoal-200">
              <MapPin className="w-4 h-4 text-terracotta shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-cream-100">
                  {RESTAURANT_CONFIG.location.address}
                </p>
                <p className="text-xs text-charcoal-300">
                  {RESTAURANT_CONFIG.location.neighborhood}, {RESTAURANT_CONFIG.location.city}
                </p>
                <p className="text-[11px] text-terracotta font-medium mt-0.5">
                  Zona de entrega: Usaquén y alrededores
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 text-sm pt-1">
            <div className="flex items-start gap-2 text-charcoal-200">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-cream-100">
                  {RESTAURANT_CONFIG.schedule.days}
                </p>
                <p className="text-xs text-charcoal-300">
                  {RESTAURANT_CONFIG.schedule.hours}
                </p>
                <p className="text-xs text-amber-200/90 bg-charcoal-900 border border-charcoal-800 px-2.5 py-1.5 rounded-lg mt-1.5 inline-block">
                  Lunes cerrado por reposo de masa
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna 4: Pedidos & WhatsApp */}
        <div className="space-y-4">
          <h4 className="font-bold text-cream-50 uppercase tracking-widest text-xs border-b border-charcoal-800 pb-2">
            Contacto & Pedidos
          </h4>

          <p className="text-sm text-charcoal-200 leading-snug">
            Pedidos a domicilio y reservas coordinadas directamente con nuestro equipo:
          </p>

          <div>
            <a
              href={`https://wa.me/${RESTAURANT_CONFIG.whatsapp.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 w-full px-4 py-2.5 rounded-xl bg-terracotta text-white font-semibold hover:bg-terracotta-dark transition-all shadow-md text-sm"
              aria-label={`Pedir por WhatsApp al ${formatPhoneDisplay(RESTAURANT_CONFIG.whatsapp.phone)}`}
            >
              <Phone className="w-4 h-4 shrink-0" />
              <span>{formatPhoneDisplay(RESTAURANT_CONFIG.whatsapp.phone)}</span>
            </a>
          </div>

          <div className="pt-2 border-t border-charcoal-800 space-y-2">
            <p className="text-[11px] font-semibold text-charcoal-300 uppercase tracking-wider">
              Medios de pago recibidos:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="px-2 py-0.5 rounded bg-charcoal-900 border border-charcoal-800 text-charcoal-200 text-[11px] font-medium"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Franja de Derechos de Autor y Privacidad */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-charcoal-300">
        <div className="space-y-1.5 text-center md:text-left">
          <p className="text-charcoal-200">
            © {new Date().getFullYear()} {RESTAURANT_CONFIG.name}. Todos los derechos reservados.
            Usaquén, Bogotá D.C., Colombia.
          </p>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-amber-950/70 border border-amber-800/80 text-amber-300 text-[11px] font-medium">
              Marca ficticia con fines de demostración técnica
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenPrivacyModal}
            className="text-charcoal-200 hover:text-white underline cursor-pointer transition-colors"
          >
            Gestión de Datos Locales
          </button>
          <span className="text-charcoal-600">•</span>
          <span className="text-charcoal-300">Hecho con devoción napolitana</span>
        </div>
      </div>
    </footer>
  );
}

