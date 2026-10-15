# Implementation Plan: Fornace 119

## 1. Overview & Architecture
Desarrollo de la aplicación web editorial para **Fornace 119** (Usaquén, Bogotá) construida con **Next.js (App Router)**, **TypeScript** y **Tailwind CSS**. 

La arquitectura se compone de:
1. **Configuración y Modelos:** Configuración del restaurante (`src/config/restaurant.ts`), carta en JSON (`src/data/menu.json`), y contratos TypeScript estrictos.
2. **Capa de Utilidades y Lógica Pura:** Formateo COP (`formatCOP`), generadores de mensajes codificados a WhatsApp para pedidos y reservas, y abstracción lista para Wompi (`src/lib/payments/`).
3. **Gestión de Estado del Cliente:** `useCart` y `useLastOrder` con sincronización segura con `localStorage` (hidratación SSR protegida).
4. **Diseño Visual Editorial (Mobile-First):** Tipografía serif editorial (*Playfair Display*) y sans-serif suiza (*Plus Jakarta Sans*), paleta cromática lino/carbón/arcilla/oliva, microinteracciones sutiles.
5. **Flujos Clave:**
   - Menú interactivo por categorías con modal de personalización.
   - Drawer de carrito con selector de entrega/recogida, cálculo automático de envío y botón de WhatsApp.
   - Botón inteligente de repetición del último pedido en 1 toque.
   - Modal de reserva de salón con envío de solicitud estructurada a WhatsApp.

---

## 2. Dependency Graph
```text
Config & Variables (.env, restaurant.ts)
    │
    ▼
Types & Menú Data (menu.ts, cart.ts, reservation.ts, menu.json)
    │
    ▼
Pure Logic (formatters.ts, whatsapp.ts, wompi-types.ts) + Tests
    │
    ▼
Client State Hooks (useCart.ts, useLastOrder.ts) + Tests
    │
    ▼
UI Components (Buttons, Modals, Drawer, Badges)
    │
    ▼
Page Sections (Hero, Philosophy, Menu, Reservations, Location, Footer)
    │
    ▼
Smoke & End-to-End Verification
```

---

## 3. Tasks Breakdown

### Task 1: Configuración base, variables y modelos de datos
- **Descripción:** Inicializar el entorno del proyecto Next.js / TypeScript / Tailwind CSS, variables de entorno (`.env.local` con `573000000000`, `.env.example` con valor ficticio), configuración de tarifas en `src/config/restaurant.ts`, tipos TypeScript y la carta gastronómica en `src/data/menu.json`.
- **Files touched:**
  - `.env.local`
  - `.env.example`
  - `src/config/restaurant.ts`
  - `src/types/menu.ts`
  - `src/types/cart.ts`
  - `src/types/reservation.ts`
  - `src/data/menu.json`
- **Dependencies:** None
- **Scope:** M

### Task 2: Utilidades de formateo, generadores de WhatsApp y Wompi stub (con TDD)
- **Descripción:** Implementar formateador monetario en COP sin centavos, funciones puras que generan mensajes estructurados y codificados para WhatsApp (tanto pedidos con desglose de ítems como reservas con fecha/hora/ocasión), y tipos/stubs para la futura pasarela Wompi. Escribir pruebas unitarias que verifiquen el formato exacto de los mensajes.
- **Files touched:**
  - `src/lib/formatters.ts`
  - `src/lib/whatsapp.ts`
  - `src/lib/payments/wompi.ts`
  - `tests/unit/formatters.test.ts`
  - `tests/unit/whatsapp.test.ts`
- **Dependencies:** Task 1
- **Scope:** M

### Task 3: Hooks de estado: Carrito y Recompra del último pedido (con TDD)
- **Descripción:** Crear `useCart` (agregar, remover, modificar cantidad, vaciar, calcular subtotal, envío fijo de $6.000 o gratis > $70.000, total) y `useLastOrder` (guardar pedido exitoso en `localStorage`, recuperar y restaurar en 1 clic). Proteger contra *hydration mismatch* en Next.js.
- **Files touched:**
  - `src/hooks/useCart.ts`
  - `src/hooks/useLastOrder.ts`
  - `tests/unit/cart.test.ts`
- **Dependencies:** Task 1, Task 2
- **Scope:** M

### Checkpoint 1 (Lógica y Modelo)
- [ ] Pruebas unitarias de formateo, WhatsApp y carrito pasando al 100%.
- [ ] Verificación de tipos TypeScript sin errores.

### Task 4: Sistema de diseño editorial y componentes visuales base
- **Descripción:** Configurar tokens en Tailwind (paleta lino/carbón/arcilla/oliva), fuentes de Google (*Playfair Display* y *Plus Jakarta Sans*), y crear componentes base accesibles (Button, Modal, Badge, Drawer de Carrito, Toast/Notificación).
- **Files touched:**
  - `tailwind.config.ts` o `src/app/globals.css`
  - `src/app/layout.tsx`
  - `src/components/ui/Button.tsx`
  - `src/components/ui/Modal.tsx`
  - `src/components/ui/Badge.tsx`
  - `src/components/cart/CartDrawer.tsx`
  - `src/components/cart/ReorderBanner.tsx`
- **Dependencies:** Task 3
- **Scope:** M

### Task 5: Módulos de Menú, Reservas de Mesa y Pantalla de Confirmación ("Disfruta")
- **Descripción:** Construir las pestañas de categorías de menú, tarjetas de pizza con estética sobria y fotografía de apoyo, modal para notas o adiciones, formulario elegante de reservas de mesa en salón (nombre, teléfono, personas, fecha, hora, ocasión especial) con validación y enlace directo a WhatsApp. Incluir la pantalla/modal de confirmación posterior al envío ("Disfruta": resumen, tiempo estimado de 30-45 min para entrega o confirmación de mesa, sugerencia de maridaje/invitación a volver).
- **Files touched:**
  - `src/components/menu/MenuSection.tsx`
  - `src/components/menu/MenuItemCard.tsx`
  - `src/components/menu/ItemModal.tsx`
  - `src/components/reservations/ReservationModal.tsx`
  - `src/components/confirmation/ConfirmationScreen.tsx`
- **Dependencies:** Task 4
- **Scope:** M

### Task 6a: Integración de la Landing Page y Secciones de Marca
- **Descripción:** Ensamblar la página principal completa (`src/app/page.tsx`): Header con navegación y trigger del carrito flotante, Hero con horno y masa madre, Filosofía artesanal (48h fermentación), Menú interactivo, Reservas, Ubicación en Usaquén con mapa/radio de entrega (3-5 km), Footer editorial con métodos de pago (Nequi, Daviplata, PSE, datáfono). Conectar el flujo integral con la pantalla de confirmación.
- **Files touched:**
  - `src/app/page.tsx`
  - `src/components/sections/Hero.tsx`
  - `src/components/sections/Philosophy.tsx`
  - `src/components/sections/Location.tsx`
  - `src/components/layout/Header.tsx`
  - `src/components/layout/Footer.tsx`
- **Dependencies:** Task 5
- **Scope:** M

### Task 6b: Verificación Final, Rendimiento, Accesibilidad y Code Review
- **Descripción:** Ejecutar compilación de producción (`npm run build`), auditoría de rendimiento y Core Web Vitals, pruebas de contraste y accesibilidad (WCAG AA), y revisión multidimensional de calidad de código (`code-review-and-quality`).
- **Files touched:**
  - Suite de pruebas y validaciones
  - Reporte de verificación en `docs/`
- **Dependencies:** Task 6a
- **Scope:** S

### Checkpoint 2 (Flujo Completo y Calidad)
- [ ] `npm run build` compila con 0 errores.
- [ ] Flujo de compra: Agregar al carrito -> Abrir carrito -> Enviar por WhatsApp con mensaje estructurado -> Ver pantalla de confirmación ("Disfruta").
- [ ] Flujo de recompra: El último pedido se recuerda y se puede reordenar en 1 clic.
- [ ] Flujo de reserva: Formulario validado y mensaje estructurado enviado a WhatsApp -> Ver confirmación.
- [ ] Auditoría de accesibilidad y revisión de código completadas.
