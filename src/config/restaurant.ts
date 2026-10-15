export interface RestaurantConfig {
  name: string;
  tagline: string;
  description: string;
  location: {
    neighborhood: string;
    city: string;
    address: string;
    deliveryRadiusKm: string;
    mapQuery: string;
  };
  schedule: {
    days: string;
    hours: string;
    closedDays: string[];
  };
  delivery: {
    fixedFeeCOP: number;
    freeShippingThresholdCOP: number;
    estimatedTimeMinutes: string;
    estimatedTimeApproximate: string;
  };
  reservations: {
    minAdvanceHours: number;
    maxPartySize: number;
    largePartyThreshold: number;
    largePartyNotice: string;
    confirmationNotice: string;
    timeSlots: string[];
  };
  whatsapp: {
    phone: string;
  };
  paymentMethods: string[];
}

export const RESTAURANT_CONFIG: RestaurantConfig = {
  name: 'Fornace 119',
  tagline: 'Pizza Napoletana & Fermento',
  description:
    'Auténtica pizza napolitana contemporánea en horno de leña, masa madre con 48 horas de fermentación e ingredientes italianos con denominación de origen en el corazón de Usaquén.',
  location: {
    neighborhood: 'Usaquén',
    city: 'Bogotá, Colombia',
    address: 'Calle 119 # 5-28, Usaquén, Bogotá',
    deliveryRadiusKm: '3 a 5 km a la redonda',
    mapQuery: 'Calle 119, Usaquen, Bogota, Colombia',
  },
  schedule: {
    days: 'Martes a Domingo',
    hours: '12:30 p.m. – 10:30 p.m.',
    closedDays: ['Lunes'],
  },
  delivery: {
    fixedFeeCOP: 6000,
    freeShippingThresholdCOP: 70000,
    estimatedTimeMinutes: '35 - 50 min',
    estimatedTimeApproximate: '35 - 50 min (aprox., sujeto a confirmación)',
  },
  reservations: {
    minAdvanceHours: 2, // Mínimo 2 horas de anticipación
    maxPartySize: 12, // Máximo 12 personas por reserva estándar en línea
    largePartyThreshold: 8, // A partir de 8 personas se muestra aviso de grupo grande
    largePartyNotice:
      'Para grupos de 8 o más personas, nuestro chef coordina una experiencia de menú especial.',
    confirmationNotice:
      'Tu solicitud está sujeta a confirmación por el equipo de Fornace 119 vía WhatsApp.',
    timeSlots: [
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30',
      '21:00',
      '21:30',
    ],
  },
  whatsapp: {
    phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573000000000',
  },
  paymentMethods: [
    'Transferencia digital (Nequi / Daviplata)',
    'Llave Bre-B / QR Bancario',
    'Datáfono contra entrega (Crédito / Débito)',
    'Efectivo contra entrega',
  ],
};
