import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { RESTAURANT_CONFIG } from '@/config/restaurant';
import { CartProvider } from '@/hooks/useCart';
import { SkipLink } from '@/components/layout/SkipLink';
import { RestaurantJsonLd } from '@/components/seo/RestaurantJsonLd';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';

export const metadata: Metadata = {
  metadataBase: new URL('https://fornace119.co'),
  title: {
    default: `${RESTAURANT_CONFIG.name} — Pizza Napoletana & Fermento en Usaquén, Bogotá`,
    template: `%s | ${RESTAURANT_CONFIG.name}`,
  },
  description: RESTAURANT_CONFIG.description,
  keywords: [
    'pizza napolitana',
    'masa madre',
    'Usaquén',
    'Bogotá',
    'horno de leña',
    'pizza artesanal',
    'ingredientes DOP',
    'San Marzano',
    'domicilios Usaquén',
    'restaurantes Bogotá',
  ],
  authors: [{ name: 'Fornace 119' }],
  creator: 'Fornace 119',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://fornace119.co',
    siteName: RESTAURANT_CONFIG.name,
    title: `${RESTAURANT_CONFIG.name} — Pizza Napoletana & Fermento en Usaquén`,
    description: RESTAURANT_CONFIG.description,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Fornace 119 Pizza Napolitana Artesanal en Horno de Leña',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${RESTAURANT_CONFIG.name} — Pizza Napoletana & Fermento`,
    description: RESTAURANT_CONFIG.description,
    images: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    ],
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    nocache: !allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
      noimageindex: !allowIndexing,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <RestaurantJsonLd />
      </head>
      <body className="min-h-screen bg-cream-100 text-charcoal-900 font-sans selection:bg-terracotta/20 selection:text-terracotta-dark">
        <SkipLink />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
