import React from 'react';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

/**
 * Datos estructurados Schema.org para tipo 'Restaurant'
 * Facilita el indexado semántico por motores de búsqueda y asistentes de voz.
 */
export function RestaurantJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: RESTAURANT_CONFIG.name,
    description: RESTAURANT_CONFIG.description,
    image: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200',
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1000',
    ],
    telephone: `+${RESTAURANT_CONFIG.whatsapp.phone}`,
    servesCuisine: ['Pizza Napoletana', 'Italiana', 'Artesanal'],
    priceRange: '$$',
    acceptsReservations: 'True',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle Ficticia 119 # 0-00 (Demostración)',
      addressLocality: 'Usaquén (Ficticio)',
      addressRegion: 'Bogotá D.C.',
      postalCode: '000000',
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 0.0,
      longitude: 0.0,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '12:30',
        closes: '22:30',
      },
    ],
    menu: 'https://fornace119.co/#carta',
    paymentAccepted: 'Cash, Credit Card, Debit Card, Nequi, Daviplata, PSE',
    currenciesAccepted: 'COP',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
