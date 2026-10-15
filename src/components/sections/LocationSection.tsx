import React from 'react';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { formatCOP } from '@/lib/formatters';
import { MapPin, Clock, Truck, CreditCard, Compass, ShieldCheck } from 'lucide-react';

/**
 * Sección de Ubicación, Cobertura de Entrega y Horarios en Usaquén.
 */
export function LocationSection() {
  const coveredNeighborhoods = [
    'Usaquén Tradicional',
    'Santa Bárbara Alta & Central',
    'Bella Suiza',
    'Santa Ana Oriental',
    'La Calleja',
    'Unicentro & Multicentro',
    'Santa Paula',
    'El Chicó Norte (hasta Cl. 95)',
  ];

  return (
    <section
      id="ubicacion"
      aria-labelledby="ubicacion-heading"
      className="rounded-3xl bg-white border border-charcoal-700/10 p-6 sm:p-10 lg:p-12 shadow-sm space-y-10"
    >
      {/* Encabezado */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs uppercase tracking-widest text-terracotta font-bold">
          Sede & Cobertura
        </span>
        <h2
          id="ubicacion-heading"
          className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight"
        >
          En el Corazón Histórico de Usaquén.
        </h2>
        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-sans">
          Un refugio gastronómico de muros rústicos, aroma a leña viva y mesas dispuestas para la
          conversación pausada. Visítanos en nuestro salón o pide tus pizzas a domicilio en nuestra
          zona de cobertura de 3 a 5 km.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tarjeta 1: Dirección y Horario */}
        <div className="rounded-2xl bg-cream-50 p-6 border border-charcoal-700/10 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
              <MapPin className="w-5 h-5 text-terracotta" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">
                Dirección del Restaurante
              </h3>
              <p className="text-sm text-charcoal-700 font-medium mt-1">
                {RESTAURANT_CONFIG.location.address}
              </p>
              <p className="text-xs text-charcoal-500">
                {RESTAURANT_CONFIG.location.neighborhood}, {RESTAURANT_CONFIG.location.city}
              </p>
            </div>

            <div className="pt-2 border-t border-charcoal-700/10 space-y-1 text-xs text-charcoal-600">
              <div className="flex items-center gap-1.5 font-semibold text-charcoal-900">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Horarios de Atención:</span>
              </div>
              <p className="pl-5 text-charcoal-800">
                {RESTAURANT_CONFIG.schedule.days}: {RESTAURANT_CONFIG.schedule.hours}
              </p>
              <p className="pl-5 text-xs text-charcoal-500">
                Lunes cerrado por descanso de masa madre y mantenimiento de refractarios.
              </p>
            </div>
          </div>

          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(RESTAURANT_CONFIG.location.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-terracotta hover:text-terracotta-dark underline pt-2"
          >
            <Compass className="w-4 h-4" />
            <span>Ver ubicación en Google Maps →</span>
          </a>
        </div>

        {/* Tarjeta 2: Cobertura de Domicilios */}
        <div className="rounded-2xl bg-cream-50 p-6 border border-charcoal-700/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-olive-dark/10 text-olive-dark flex items-center justify-center">
              <Truck className="w-5 h-5 text-olive-dark" />
            </div>

            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Zona de Domicilios (3 - 5 km)
            </h3>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              Para garantizar que el <em>cornicione</em> llegue con el crujiente y calor perfecto,
              despachamos en un radio estricto con cajas térmicas transpirables:
            </p>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-charcoal-700 pt-1">
              {coveredNeighborhoods.map((barrio) => (
                <div key={barrio} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span className="truncate">{barrio}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-charcoal-700/10 text-xs text-charcoal-700 space-y-1">
            <div className="flex justify-between font-semibold">
              <span>Tarifa fija:</span>
              <span className="text-charcoal-900">{formatCOP(RESTAURANT_CONFIG.delivery.fixedFeeCOP)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-semibold">
              <span>Envío gratis desde:</span>
              <span>{formatCOP(RESTAURANT_CONFIG.delivery.freeShippingThresholdCOP)}</span>
            </div>
            <div className="text-[10px] text-charcoal-500 pt-1">
              Tiempo estimado: {RESTAURANT_CONFIG.delivery.estimatedTimeMinutes}
            </div>
          </div>
        </div>

        {/* Tarjeta 3: Métodos de Pago */}
        <div className="rounded-2xl bg-cream-50 p-6 border border-charcoal-700/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal-900/10 text-charcoal-900 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-charcoal-900" />
            </div>

            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Medios de Pago Habilitados
            </h3>

            <p className="text-xs text-charcoal-600 leading-relaxed">
              Aceptamos los métodos más cómodos y seguros de Colombia tanto en salón como en delivery:
            </p>

            <ul className="space-y-2 text-xs text-charcoal-700">
              {RESTAURANT_CONFIG.paymentMethods.map((method, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta shrink-0 mt-0.5" />
                  <span>{method}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-white border border-charcoal-700/10 text-[11px] text-charcoal-600 leading-tight">
            💡 Pagos directos coordinados de forma segura a través de WhatsApp Business sin comisiones
            adicionales para ti.
          </div>
        </div>
      </div>
    </section>
  );
}
