'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { formatCOP } from '@/lib/formatters';
import { Flame, Calendar, ArrowRight, Sparkles, MapPin, Clock } from 'lucide-react';

export interface HeroProps {
  onOpenReservation: () => void;
}

/**
 * Sección Hero de Marca:
 * Narra la historia del horno napolitano a 450°C y la masa madre viva ("lievito madre")
 * con llamadas claras a la acción para pedir y reservar.
 */
export function Hero({ onOpenReservation }: HeroProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative rounded-3xl overflow-hidden bg-charcoal-950 text-white border border-charcoal-800 shadow-xl"
    >
      {/* Fondo fotográfico ambiental */}
      <div className="absolute inset-0 z-0 opacity-25">
        <Image
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1600&auto=format&fit=crop"
          alt="Horno artesanal de leña de Fornace 119 con llamas vivas"
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950 via-charcoal-950/90 to-charcoal-950/60" />
      </div>

      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-3xl space-y-6">
        {/* Badge de confianza e identidad */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-terracotta/25 border border-terracotta/40 text-amber-200 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Horno de leña a 450°C • Usaquén, Bogotá</span>
        </div>

        {/* Titular Editorial */}
        <div className="space-y-3">
          <h1
            id="hero-heading"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream-50 leading-[1.1]"
          >
            Pizze Napoletane & Fermento Antico.
          </h1>
          <p className="text-charcoal-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans font-light max-w-2xl">
            Nacidas del fuego y el reposo. Cada pizza comienza con nuestro <em>lievito madre</em>{' '}
            centenario y una fermentación paciente de 48 a 72 horas. Horneadas a 450°C en
            leña de roble durante 90 segundos sobre piedra volcánica.
          </p>
        </div>

        {/* Acciones principales */}
        <div className="pt-2 flex flex-wrap items-center gap-3.5">
          <a href="#carta" className="no-underline">
            <Button
              variant="primary"
              size="lg"
              className="gap-2 shadow-lg hover:shadow-terracotta/30 group text-sm font-semibold"
            >
              <span>Ver Carta & Pedir</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </a>

          <Button
            variant="outline"
            size="lg"
            onClick={onOpenReservation}
            className="gap-2 bg-charcoal-900/80 text-cream-100 border-charcoal-700 hover:bg-charcoal-800 hover:border-terracotta/60 text-sm font-semibold"
          >
            <Calendar className="w-4 h-4 text-terracotta-light" />
            <span>Reservar Mesa</span>
          </Button>

          <a href="#nuestra-masa" className="hidden sm:inline-block">
            <Button
              variant="ghost"
              size="lg"
              className="text-xs text-charcoal-300 hover:text-white"
            >
              Conoce nuestra masa →
            </Button>
          </a>
        </div>

        {/* Métricas y Datos Rápidos de Confianza */}
        <div className="pt-6 border-t border-charcoal-800 flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-charcoal-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-terracotta shrink-0" />
            <span>
              {RESTAURANT_CONFIG.location.neighborhood}, {RESTAURANT_CONFIG.location.address}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{RESTAURANT_CONFIG.schedule.hours}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Envío gratis desde {formatCOP(RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP)}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
