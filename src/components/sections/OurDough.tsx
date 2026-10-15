import React from 'react';
import Image from 'next/image';
import { Sparkles, Clock, Wheat, Flame } from 'lucide-react';

/**
 * Sección de Marca "Nuestra Masa":
 * Profundiza en la filosofía artesanal de Fornace 119:
 * fermentación de 48-72h, masa madre viva, harina italiana 00 y el calor de 450°C.
 */
export function OurDough() {
  const pillars = [
    {
      step: '01',
      icon: Sparkles,
      title: 'Lievito Madre Vivo',
      subtitle: 'La cepa madre de fermentación natural',
      description:
        'Cultivamos diariamente nuestro propio fermento vivo sin levaduras químicas industriales. Esta microbiota produce ácidos lácticos y acéticos que aportan el aroma profundo, notas florales y la inconfundible fragancia del pan recién horneado.',
    },
    {
      step: '02',
      icon: Clock,
      title: 'Maduración Lenta 48h - 72h',
      subtitle: 'Digestibilidad absoluta y ligereza',
      description:
        'El reposo prolongado a temperatura controlada permite que las enzimas descompongan los azúcares complejos y desnaturalicen el gluten. El resultado es una pizza extraordinariamente etérea que no produce pesadez ni sed posterior.',
    },
    {
      step: '03',
      icon: Wheat,
      title: 'Harina Italiana Tipo 00',
      subtitle: 'Trigo seleccionado de alta fuerza (W300+)',
      description:
        'Importamos harina de molienda suave con gran elasticidad y tolerancia a alta hidratación (68%). La estructura de gluten sedosa retiene el gas generado por la masa madre durante el reposo.',
    },
    {
      step: '04',
      icon: Flame,
      title: '90 Segundos a 450°C',
      subtitle: 'El choque térmico del horno napolitano',
      description:
        'Sobre la piedra volcánica y bajo las llamas de madera de roble certificada, la masa se infla instantáneamente creando el icónico «cornicione» alveolar: una corteza dorada y crujiente con motas de leopardo y un corazón suave y fundente.',
    },
  ];

  return (
    <section
      id="nuestra-masa"
      aria-labelledby="masa-heading"
      className="rounded-3xl bg-cream-100/70 border border-charcoal-700/10 p-6 sm:p-10 lg:p-12 space-y-10"
    >
      {/* Encabezado Editorial */}
      <div className="max-w-2xl space-y-3">
        <span className="text-xs uppercase tracking-widest text-terracotta font-bold">
          Filosofía & Método Napolitano
        </span>
        <h2
          id="masa-heading"
          className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 tracking-tight leading-tight"
        >
          Nuestra Masa: El Respeto por el Tiempo y el Fuego.
        </h2>
        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed font-sans">
          En un mundo de prisas y aditivos, en Fornace 119 elegimos la disciplina tradicional.
          No aceleramos procesos: dejamos que el tiempo, el agua pura y el fermento hagan su obra.
        </p>
      </div>

      {/* Grid de los 4 Pilares */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.step}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-charcoal-700/10 shadow-sm hover:shadow-md transition-shadow space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5 text-terracotta" />
                </div>
                <span className="font-serif text-2xl font-bold text-charcoal-300">
                  {pillar.step}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-900">
                  {pillar.title}
                </h3>
                <p className="text-xs font-semibold text-terracotta mt-0.5">
                  {pillar.subtitle}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Frase / Cita de la cocina con imagen ilustrativa */}
      <div className="p-6 sm:p-8 rounded-2xl bg-charcoal-900 text-cream-50 flex flex-col md:flex-row items-center gap-6 border border-charcoal-800">
        <div className="relative w-full md:w-48 h-36 rounded-xl overflow-hidden shrink-0 border border-charcoal-700">
          <Image
            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop"
            alt="Masa madre napolitana fermentada y horneada a 450°C"
            fill
            sizes="(max-width: 768px) 100vw, 200px"
            className="object-cover"
          />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <p className="font-serif italic text-base sm:text-lg text-cream-100 leading-snug">
            «La verdadera pizza napolitana no te llena el estómago de harina pesada; te nutre el espíritu
            con la ligereza de una nube y el perfume del fuego vivo.»
          </p>
          <p className="text-xs uppercase tracking-widest text-terracotta-light font-bold">
            Mastro Pizzaiolo — Fornace 119
          </p>
        </div>
      </div>
    </section>
  );
}
