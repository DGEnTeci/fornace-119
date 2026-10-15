# Task Checklist: Fornace 119

- [x] **Task 1: Configuración base, variables y modelos de datos**
  - [x] `.env.local` con número real privado y `.env.example` con número ficticio (`573001234567`)
  - [x] Verificar que `.env.local` esté explícitamente en `.gitignore`
  - [x] Configuración de negocio en `src/config/restaurant.ts` (tarifa envío $6.000, envío gratis desde $70.000, radio 3-5 km Usaquén)
  - [x] Tipos TypeScript (`src/types/menu.ts`, `cart.ts`, `reservation.ts`)
  - [x] Carta gastronómica en `src/data/menu.json` con precios en COP, ingredientes y categorías

- [x] **Task 2: Utilidades de formateo, generadores de WhatsApp y Wompi stub (con TDD)**
  - [x] Formateador `formatCOP(value: number): string`
  - [x] Función generadora de URL de WhatsApp para pedidos estructurados
  - [x] Función generadora de URL de WhatsApp para reservas de salón estructuradas
  - [x] Stubs y tipos de integración para Wompi (`src/lib/payments/wompi.ts`)
  - [x] Pruebas unitarias en `tests/unit/formatters.test.ts`, `tests/unit/shipping.test.ts`, `tests/unit/whatsapp.test.ts` y `tests/unit/wompi.test.ts`

- [x] **Task 3: Hooks de estado del cliente: Carrito y Recompra del último pedido (con TDD)**
  - [x] Hook `useCart` con persistencia en `localStorage`, cálculo de subtotal, costo de envío dinámico y total
  - [x] Hook `useLastOrder` para persistir el último pedido confirmado y restaurarlo en 1 toque
  - [x] Revalidación de pedido guardado contra `menu.json` (detección de platos eliminados y actualización de precios)
  - [x] Protección contra errores de hidratación (*hydration mismatch*) y manejo defensivo de localStorage corrupto
  - [x] Pruebas unitarias en `tests/unit/cart.test.ts` y `tests/unit/last-order.test.ts`

- [x] **Checkpoint 1: Lógica y Modelos**
  - [x] Todas las pruebas unitarias pasan (`npm test`) — 33 pruebas en verde
  - [x] Typecheck sin errores (`npx tsc --noEmit`)

- [x] **Task 4a: Tokens de diseño, tipografía next/font y componentes base accesibles**
  - [x] Tokens de Tailwind (lino, carbón, arcilla, terracota, oliva) y tipografía (*Playfair Display*, *Plus Jakarta Sans*)
  - [x] Componente `Button` (variantes, tamaños, objetivos táctiles >= 44px, foco visible terracota)
  - [x] Componente `Badge` (masa-madre, dop, vegetariana, de-autor, picante)
  - [x] Componente `Modal` (focus trap, cierre Esc, devolver foco al trigger, aria-modal, reduced motion)
  - [x] Componente `Drawer` (slide lateral, focus trap, cierre Esc, devolver foco al trigger, reduced motion)
  - [x] Vista previa funcional en `localhost:3000` con `src/app/page.tsx` y `layout.tsx`

- [x] **Task 4b: Módulos de Carrito y Recompra (CartDrawer y Banner Reorder)**
  - [x] `CartDrawer` con lista de productos, selector delivery/takeaway, desglose de totales y checkout WhatsApp
  - [x] Formulario validado (nombre, teléfono colombiano de 10 dígitos iniciando por 3, dirección solo en domicilio, método de pago)
  - [x] Región accesible `aria-live="polite"` para anuncios de carrito
  - [x] Pantalla/modal de confirmación "Disfruta" tras el envío con guardado de último pedido y vaciado de carrito
  - [x] Banner interactivo de Recompra (*"Repetir mi último pedido"*) con total actualizado antes de agregar y aviso de platos no disponibles
  - [x] Pruebas unitarias en `tests/unit/cart-drawer.test.tsx` y `tests/unit/reorder-banner.test.tsx`


- [x] **Task 5: Módulos de Menú, Reservas de Mesa y Pantalla de Confirmación ("Disfruta")**
  - [x] Pestañas de categorías de menú (Tradizionali, D'Autore, Antipasti, Dolci, Vini)
  - [x] Tarjeta de ítem con badges (Masa Madre, D.O.P., etc.) y modal de adiciones
  - [x] Formulario de reservas de mesa (Nombre, personas, fecha, hora, ocasión especial) con botón directo a WhatsApp
  - [x] Pantalla/modal de confirmación ("Disfruta": resumen, tiempo estimado, invitación a volver)

- [x] **Task 6a: Integración de la Landing Page y Secciones de Marca**
  - [x] Header con navegación accesible y trigger reactivo del carrito
  - [x] Hero con fotografía del horno de leña, titular editorial y CTAs
  - [x] Sección de Filosofía artesanal y masa madre ("Nuestra masa", 48h fermentación)
  - [x] Sección de Ubicación en Usaquén (cobertura 3-5 km, horarios y medios de pago)
  - [x] Footer editorial con aviso legal de licor (Ley 124/1994) y contacto
  - [x] Aviso de tratamiento de datos (Habeas Data Ley 1581) con botón para borrar último pedido
  - [x] Metadatos Open Graph, Twitter card, favicon SVG y datos estructurados Schema.org Restaurant
  - [x] Enlace SkipLink "saltar al contenido principal" y landmarks accesibles


- [x] **Task 6b: Verificación Final, Rendimiento, Accesibilidad y Code Review**
  - [x] Build de producción exitoso (`npm run build`)
  - [x] Auditoría de accesibilidad (WCAG AA) y rendimiento (Lighthouse: 91 Perf, 96 A11y, 100 Best Practices, 100 SEO)
  - [x] Revisión de calidad de código con `code-reviewer` y auditoría de rendimiento con `web-performance-auditor`
  - [x] Documentación exhaustiva en README.md y guía de despliegue en Vercel con número privado seguro

- [x] **Checkpoint 2: Verificación Final**
  - [x] Build exitoso en producción (0 errores)
  - [x] Flujos de pedido, carrito, recompra en 1 toque y reservas verificados
  - [x] Separación de repositorio limpia y 99 pruebas en verde
