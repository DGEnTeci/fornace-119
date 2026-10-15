# Spec: Fornace 119 — Pizza Napoletana & Fermento

## 1. Objective
Construir una aplicación web *mobile-first*, accesible y de alto rendimiento para **Fornace 119**, una pizzería napolitana artesanal contemporánea ubicada en Usaquén (Bogotá, Colombia).

El sitio web servirá como canal digital directo para:
1. Exhibir la carta gastronómica editorial con precios en Pesos Colombianos (COP).
2. Facilitar pedidos a domicilio (radio 3–5 km en Usaquén) y para llevar (*take-away*) mediante un carrito interactivo que empaqueta y envía la orden estructurada directamente a WhatsApp Business.
3. Permitir la repetición inmediata del último pedido (*recompra en 1 clic*) mediante persistencia en `localStorage`.
4. Captar solicitudes de reserva de mesa en salón (especialmente para parejas y ocasiones especiales) enviadas estructuradas vía WhatsApp.
5. Dejar la arquitectura desacoplada y lista para incorporar rutas de servidor (API routes) y la pasarela de pagos Wompi en una fase posterior.

---

## 2. Tech Stack
- **Framework:** Next.js (App Router, React 19)
- **Lenguaje:** TypeScript (modo estricto)
- **Estilos:** Tailwind CSS v3 / v4 con tokens de color editorial personalizados
- **Iconografía:** Lucide React (minimalista)
- **Fuentes:** Google Fonts vía `next/font`: *Playfair Display* (titulares serif) y *Plus Jakarta Sans* (lectura y componentes)
- **Persistencia local:** `localStorage` (para carrito activo y `lastOrder`)
- **Integraciones:** URLs de WhatsApp (`https://wa.me/57...`) con mensajes URI-encoded
- **Herramientas de Calidad:** ESLint, Prettier, Vitest / React Testing Library para pruebas unitarias de utilidades y estado.

---

## 3. Commands
- **Instalación:** `npm install`
- **Desarrollo:** `npm run dev` (inicia en `http://localhost:3000`)
- **Compilación de producción:** `npm run build`
- **Inicio de producción:** `npm run start`
- **Linter y formato:** `npm run lint` / `npx prettier --check .`
- **Pruebas:** `npm test`

---

## 4. Project Structure
```text
fornace-119/
├── public/
│   ├── images/              # Fotografías gastronómicas y texturas de apoyo
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout global (metadatos, fuentes y proveedores)
│   │   ├── page.tsx         # Landing page editorial completa (One-page fluida)
│   │   └── globals.css      # Directivas de Tailwind y estilos base
│   ├── components/
│   │   ├── ui/              # Componentes visuales base (Button, Badge, Modal, Input)
│   │   ├── layout/          # Header, Navigation, Footer
│   │   ├── sections/        # Hero, CraftPhilosophy, MenuSection, LocationSection
│   │   ├── menu/            # MenuCategoryTabs, MenuItemCard, ItemCustomizerModal
│   │   ├── cart/            # CartDrawer, CartItemRow, ReorderPrompt
│   │   └── reservations/    # ReservationForm, ReservationModal
│   ├── data/
│   │   └── menu.json        # Carta oficial (categorías, pizzas, antipasti, vinos, COP)
│   ├── hooks/
│   │   ├── useCart.ts       # Hook de gestión de carrito + sync con localStorage
│   │   └── useLastOrder.ts  # Hook para consultar y restaurar el último pedido
│   ├── lib/
│   │   ├── formatters.ts    # Formateo de moneda COP ($xx.xxx) y fechas
│   │   ├── whatsapp.ts      # Generadores de enlaces y mensajes estructurados
│   │   └── payments/
│   │       └── wompi-types.ts # Stubs y tipos preparados para la pasarela Wompi
│   └── types/
│       ├── menu.ts          # Interfaces de ítems, adiciones y categorías
│       ├── cart.ts          # Tipos de ítems en carrito, delivery vs take-away
│       └── reservation.ts   # Tipos para datos de reserva de salón
├── tests/
│   ├── unit/
│   │   ├── whatsapp.test.ts # Verificación de formateo de mensajes a WhatsApp
│   │   ├── cart.test.ts     # Pruebas de lógica de totales y adiciones
│   │   └── formatters.test.ts
├── docs/
│   └── intent/fornace-119.md
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Code Style & Standards

### Convenciones
- Componentes funcionales con TypeScript estricto.
- Separación de responsabilidades: la lógica de estado y cálculo del carrito reside en hooks desacoplados, los componentes solo renderizan.
- Manejo defensivo de `localStorage` para evitar errores de hidratación (*hydration mismatch*) en SSR con Next.js.
- Nombres de archivos en kebab-case o PascalCase para componentes.

### Ejemplo de estilo: Formateo de mensaje para WhatsApp (`src/lib/whatsapp.ts`)
```typescript
import { CartState, CustomerDetails } from '@/types/cart';
import { formatCOP } from './formatters';

export function generateOrderWhatsAppUrl(
  phone: string,
  cart: CartState,
  customer: CustomerDetails
): string {
  const itemsText = cart.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.name} (${formatCOP(item.unitPrice * item.quantity)})` +
        (item.notes ? `\n   Nota: ${item.notes}` : '')
    )
    .join('\n');

  const message = [
    `*NUEVO PEDIDO — FORNACE 119* 🍕`,
    `--------------------------------`,
    `*Tipo:* ${customer.deliveryType === 'delivery' ? 'Domicilio' : 'Para Llevar (Take-away)'}`,
    `*Cliente:* ${customer.name}`,
    `*Teléfono:* ${customer.phone}`,
    customer.deliveryType === 'delivery' ? `*Dirección (Usaquén):* ${customer.address}` : null,
    customer.deliveryType === 'delivery' && customer.notes ? `*Indicaciones:* ${customer.notes}` : null,
    `*Método de Pago Preferido:* ${customer.paymentMethod}`,
    `--------------------------------`,
    `*RESUMEN DEL PEDIDO:*`,
    itemsText,
    `--------------------------------`,
    `*Subtotal:* ${formatCOP(cart.subtotal)}`,
    customer.deliveryType === 'delivery' ? `*Envío:* ${formatCOP(cart.deliveryFee)}` : null,
    `*TOTAL A PAGAR:* ${formatCOP(cart.total)}`,
    `--------------------------------`,
    `_Por favor confírmenme el tiempo estimado de entrega/preparación._`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

---

## 6. Testing Strategy
- **Framework:** Vitest + Testing Library.
- **Unit Testing:**
  - Lógica de cálculo de precios, impuestos/envío y adiciones en `cart.test.ts`.
  - Construcción y codificación de URLs de WhatsApp en `whatsapp.test.ts`.
  - Persistencia y rescate del último pedido en `useLastOrder`.
- **E2E / Smoke:**
  - Validación de navegación fluida, adición al carrito, render del cajón y apertura correcta de enlace de WhatsApp.

---

## 7. Boundaries

- **Siempre hacer (Always):**
  - Tratar montos en enteros COP (sin centavos) con formateo visual `$ 48.000 COP`.
  - Proteger llamadas a `window.localStorage` dentro de `useEffect` o verificadores de montaje para evitar fallos de hidratación en Next.js.
  - Asegurar accesibilidad (etiquetas `aria`, contraste de color legible, foco en modales de carrito y reserva).
  - Diseñar bajo enfoque *mobile-first* impecable.
- **Consultar primero (Ask first):**
  - Modificar la carta de pizzas o precios base del JSON.
  - Añadir librerías pesadas de animación o dependencias de terceros no especificadas.
- **Nunca hacer (Never):**
  - Guardar información sensible o contraseñas en `localStorage`.
  - Desplegar enlaces de WhatsApp con teléfonos no configurables o quemados sin variable de entorno / configuración.
  - Romper el diseño responsivo en pantallas menores a 375px.

---

## 8. Success Criteria (Criterios de Aceptación)
1. **Rendimiento y Carga:**
   - Carga inicial rápida con First Contentful Paint < 1.2s y LCP < 2.0s en emulación móvil.
2. **Menú Interactivo:**
   - Filtrado fluido por pestañas (Tradicionales, De Autor, Antipasti, Vinos/Bebidas).
   - Selector de opciones/adiciones (ej. masa tradicional vs doble fermentación, adición de prosciutto di Parma o trufa).
3. **Flujo de Carrito y Recompra:**
   - Carrito persistente en sesión; badge numérico visible con micro-animación al agregar ítem.
   - Si existe un pedido previo en `localStorage`, la interfaz muestra la tarjeta: *"¿Quieres repetir tu última orden?"* que precarga el carrito en 1 toque.
4. **Mensajería a WhatsApp:**
   - Pedido estructurado con ítems, subtotales, método de pago seleccionado (Nequi, Daviplata, PSE, datáfono contra entrega) y dirección en Usaquén.
   - Reserva de mesa estructurada con nombre, fecha, hora, personas y ocasión especial.
5. **Preparación para Pasarela (Extensibilidad):**
   - El código incluye la interfaz `PaymentProvider` y un stub de Wompi listo para ser activado en `/api/checkout` cuando se defina la cuenta comercial.

---

## 9. Decisiones Confirmadas
1. **Número de WhatsApp de contacto:**
   - Especificación y plantilla pública (`.env.example`): Número ficticio `+573000000000` (`NEXT_PUBLIC_WHATSAPP_NUMBER=573000000000`).
   - Entorno local privado (`.env.local`): Número real de pruebas configurado exclusivamente en `.env.local` (estrictamente ignorado en `.gitignore`).
2. **Costo de envío en Usaquén:**
   - Tarifa fija: `$6.000 COP`.
   - Envío gratuito a partir de: `$70.000 COP`.
   - Ambos valores centralizados y configurables en `src/config/restaurant.ts`.
3. **Pantalla de Confirmación ("Disfruta"):**
   - Vista/modal de agradecimiento y confirmación tras despachar el pedido o la reserva a WhatsApp: muestra resumen, tiempo estimado de preparación/entrega, recordatorio de canales de atención y botón para regresar o explorar más.
