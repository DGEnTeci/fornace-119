# Fornace 119 — Pizza Napoletana & Fermento

> Aplicación web editorial y de pedidos de alta gama para **Fornace 119**, pizzería napolitana contemporánea con horno de leña a 450°C, masa madre viva con 48h–72h de fermentación lenta e ingredientes D.O.P. en el corazón histórico de Usaquén, Bogotá.

---

## 🍕 Resumen del Proyecto

Fornace 119 combina la estética visual editorial (inspirada en publicaciones gastronómicas como *Kinfolk* y *Cereal*) con una arquitectura técnica moderna, accesible y optimizada para dispositivos móviles (*mobile-first*).

El sistema canaliza pedidos a domicilio y reservas de salón directamente a **WhatsApp Business**, con mensajes estructurados y codificados que eliminan comisiones de intermediarios y agilizan la atención al cliente.

---

## 🌟 Características Principales

### 1. Menú Interactivo & Personalizador de Platos
- **Navegación accesible por teclado:** Pestañas de categorías con rol `tablist` y soporte para flechas (`←`, `→`, `Home`, `End`).
- **Badges de Denominación:** Distintivos visuales para *Masa Madre*, *D.O.P. (Denominazione d'Origine Protetta)*, *De Autor*, *Vegetariana* y *Picante*.
- **Modal de Personalización:** Permite seleccionar adiciones exclusivas (ej. *Extra Mozzarella di Bufala*, *Ricotta Trufada*), cantidades y notas especiales para la cocina.
- **Advertencia Legal de Bebidas Alcohólicas:** Cumplimiento automático de la **Ley 124 de 1994** al seleccionar vinos italianos (*Chianti Classico DOCG*), cervezas (*Peroni Nastro Azzurro*) o coctelería (*Aperol Spritz*).

### 2. Carrito Reactivo & Checkout Directo a WhatsApp
- **Drawer Lateral Accesible:** Trampa de foco (`focus trap`), cierre con tecla `Escape` y scroll lock en el body.
- **Selector Domicilio vs. Recogida:**
  - **Domicilio:** Validación de dirección y cálculo automático de tarifa ($6.000 COP fijo o **Envío Gratis** en compras superiores a $70.000 COP).
  - **Recogida:** Suprime el cobro de transporte y notifica al cliente para recoger en la sede de Usaquén.
- **Validación Estricta de Teléfono Colombiano:** Acepta formatos estándar e internacionales, normalizando a 10 dígitos numéricos iniciando por 3 (`^3\d{9}$`).
- **Mensaje Estructurado a WhatsApp:** Genera un enlace `https://wa.me/` con resumen detallado ítem por ítem, adiciones, dirección, método de pago y advertencia de alcohol si aplica.
- **Modal "Disfruta":** Confirmación posterior al checkout que invita al cliente a regresar y guarda el pedido para recompra rápida.

### 3. Recompra Inteligente en 1 Toque (`ReorderBanner`)
- **Memoria de Pedido:** Persiste de forma segura el último pedido confirmado en el `localStorage` del cliente.
- **Revalidación Dinámica:** Al cargar, coteja automáticamente cada ítem y adición contra la carta viva (`menu.json`), detectando platos retirados o cambios de precio sin quebrar la experiencia del usuario.

### 4. Módulo de Reservas de Salón
- **Reglas Centralizadas:** Validación estricta con anticipación mínima de 2 horas para el mismo día y exclusión de días de cierre (lunes por descanso de masa madre y mantenimiento del horno).
- **Turnos de Servicio:** Horarios cada 30 minutos desde las 12:30 p.m. hasta las 9:30 p.m.
- **Aviso para Grupos:** Advertencia automática para grupos de 8 o más comensales coordinando menú especial con el chef.
- **Confirmación WhatsApp:** Envío de solicitud estructurada con comensales, fecha, hora, ocasión especial y solicitudes de mesa.

### 5. Secciones Editoriales de Marca
- **Hero:** Fotografía envolvente de horno napolitano a 450°C, historia del *lievito madre* y llamadas claras a la acción.
- **Nuestra Masa:** Desglose de los 4 pilares de técnica artesanal:
  1. *Lievito Madre Vivo* (microbiota natural).
  2. *Maduración Lenta 48h–72h* (máxima digestibilidad).
  3. *Harina Italiana Tipo 00* (molienda de alta fuerza W300+).
  4. *90 Segundos a 450°C* (cornicione aireado con moteado de leopardo).
- **Sede en Usaquén:** Cobertura de entrega de 3 a 5 km (Usaquén, Santa Bárbara, Bella Suiza, Santa Ana, La Calleja, Unicentro, Chicó norte) y métodos de pago habilitados (Nequi, Daviplata, Llave Bre-B / QR, Datáfono contra entrega, Efectivo).
- **Footer:** Aviso de licor obligatorio, contacto directo, navegación y aviso legal.

### 6. Privacidad & Habeas Data (Ley 1581 de 2012)
- **Almacenamiento 100% en el Navegador:** Ni nombres ni teléfonos ni pedidos se envían a servidores de seguimiento o cookies invasivas.
- **Botón de Borrado Inmediato:** Permite al cliente eliminar su último pedido y todos los datos locales con un solo clic y retroalimentación accesible (`aria-live`).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Turbopack ready) |
| **Biblioteca UI** | React 19 |
| **Lenguaje** | TypeScript 5.7 (Modo estricto) |
| **Estilos & Diseño** | Tailwind CSS 3.4 (Tokens editorial lino/carbón/arcilla/oliva) |
| **Tipografía** | `next/font/google` (*Playfair Display* & *Plus Jakarta Sans*) |
| **Iconografía** | Lucide React |
| **Pruebas** | Vitest 2.1 + Testing Library (17 suites, 99 pruebas en verde) |
| **Optimización de Imágenes** | `next/image` con dominios remotos autorizados |
| **SEO & Datos Estructurados** | JSON-LD Schema.org (`Restaurant`), Open Graph, Twitter Cards |

---

## 📊 Métricas de Rendimiento & Auditoría Lighthouse

Ejecutado sobre el build de producción con emulación móvil en Chrome:

### 1. Modo Demostración / Marca Ficticia (`noindex` por defecto)
Configuración: `NEXT_PUBLIC_ALLOW_INDEXING` **sin definir** (evalúa a `false`, emitiendo `noindex, nofollow, noimageindex` y `robots.txt` con `Disallow: /`).

| Categoría | Puntaje | Estado |
| :--- | :---: | :---: |
| ⚡ **Performance (Rendimiento)** | **92 / 100** | ✅ Objetivo 90+ cumplido (FCP: 1.4s, CLS: 0, TBT: 50ms) |
| ♿ **Accessibility (Accesibilidad)** | **96 / 100** | ✅ WCAG AA cumplido |
| 🛡️ **Best Practices (Buenas Prácticas)** | **100 / 100** | ✅ Perfecto |
| 🔍 **SEO (Motores de Búsqueda)** | **66 / 100** | ℹ️ Resultado intencional: la auditoría `is-crawlable` califica 0 debido al bloqueo deliberado de indexación para marcas de prueba |

### 2. Modo Producción Indexable (Verificación de Metadatos & SEO Completo)
Configuración: `NEXT_PUBLIC_ALLOW_INDEXING=true` y `robots.txt` permisivo.

| Categoría | Puntaje | Estado |
| :--- | :---: | :---: |
| ⚡ **Performance (Rendimiento)** | **91 / 100** | ✅ Objetivo 90+ cumplido |
| ♿ **Accessibility (Accesibilidad)** | **96 / 100** | ✅ WCAG AA cumplido |
| 🛡️ **Best Practices (Buenas Prácticas)** | **100 / 100** | ✅ Perfecto |
| 🔍 **SEO (Motores de Búsqueda)** | **100 / 100** | ✅ 100% de cumplimiento (JSON-LD, canonical, OpenGraph, viewport, tap targets) |


---

## 🚀 Instalación y Desarrollo Local

### 1. Clonar y preparar dependencias

```bash
cd fornace-119
npm install
```

### 2. Configuración de Variables de Entorno

Copia el archivo de plantilla `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local`:
```env
# Número de WhatsApp oficial para recibir pedidos y reservas
# Formato internacional sin símbolos: 57 + número (ej. 573000000000)
NEXT_PUBLIC_WHATSAPP_NUMBER=573000000000

# Control de indexación: DEJAR SIN DEFINIR para marca ficticia / demo (noindex por defecto)
# NEXT_PUBLIC_ALLOW_INDEXING=true
```

> ⚠️ **Aviso de Privacidad sobre `NEXT_PUBLIC_WHATSAPP_NUMBER`:**
> Al utilizar el prefijo `NEXT_PUBLIC_`, este valor se compila dentro del bundle JavaScript que se descarga en el navegador del usuario y es visible en DevTools, código fuente y enlaces generados de `https://wa.me/`.
> - Para repositorios públicos o demostraciones de portafolio, **nunca uses tu número personal real**.
> - Mantén el valor ficticio `573000000000` o configura una línea secundaria de pruebas exclusiva.
> - `.env.local` está ignorado en `.gitignore` y **nunca debe subirse al control de versiones**.


### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre en tu navegador:
- Aplicación principal: [http://localhost:3000](http://localhost:3000)
- Catálogo de componentes y diseño: [http://localhost:3000/design](http://localhost:3000/design)

### 4. Pruebas y Verificación

```bash
# Ejecutar suite de pruebas unitarias
npm test

# Verificación de tipos TypeScript
npx tsc --noEmit

# Compilación de producción
npm run build
```

---

## ☁️ Guía de Despliegue en Vercel (Paso a Paso)

Sigue estos pasos para desplegar **Fornace 119** en Vercel manteniendo tu configuración segura:

### Paso 1: Subir tu repositorio a GitHub

Crea un repositorio privado o público en tu cuenta de GitHub (ej. `tu-usuario/fornace-119`):

```bash
git remote add origin https://github.com/tu-usuario/fornace-119.git
git branch -M main
git push -u origin main
```

*(El repositorio no contiene números privados ni credenciales).*

### Paso 2: Importar el proyecto en Vercel

1. Ingresa a [Vercel](https://vercel.com/) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en el botón **"Add New..."** → **"Project"**.
3. Selecciona el repositorio `fornace-119` y haz clic en **"Import"**.

### Paso 3: Configurar Ajustes de Compilación

Vercel detectará automáticamente Next.js. Confirma los siguientes valores:
- **Framework Preset:** `Next.js`
- **Root Directory:** `./`
- **Build Command:** `next build` (o dejar por defecto)
- **Output Directory:** `.next` (por defecto)
- **Install Command:** `npm install` (por defecto)

### Paso 4: Variables de Entorno en Vercel & Advertencia de Seguridad

En la sección **"Environment Variables"** de Vercel, configura:

| Key | Value | Entornos seleccionados |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `573000000000` *(o tu número secundario de pruebas)* | Production, Preview, Development |

> 🔒 **Aviso Crítico de Privacidad (`NEXT_PUBLIC_`):**
> Al estar prefijada con `NEXT_PUBLIC_`, esta variable se incrusta en los archivos JavaScript compilados que descarga el navegador y es **visible para cualquier usuario** inspeccionando el código fuente, la consola DevTools o los enlaces generados de `https://wa.me/`.
> - **Recomendación para portafolios y demostraciones públicas:** Utiliza un número secundario exclusivo de pruebas o mantén el número ficticio `573000000000`. Nunca utilices tu línea telefónica personal si el repositorio o la demo será accesible públicamente.
> - **Indexación de Buscadores (`noindex`):** Al ser una marca ficticia con fines demostrativos, la variable `NEXT_PUBLIC_ALLOW_INDEXING` debe dejarse **sin definir**. Por defecto, la web emite directivas `noindex, nofollow` y `public/robots.txt` bloquea el rastreo de motores de búsqueda.

### Paso 5: Desplegar

1. Haz clic en **"Deploy"**.
2. Vercel compilará la aplicación en aproximadamente 30-45 segundos.
3. Al finalizar, recibirás una URL de producción pública con certificado SSL automático (ej. `https://fornace-119.vercel.app`).

### Paso 6: Dominio Personalizado (Opcional)

Si cuentas con un dominio propio (ej. `fornace119.co`):
1. Ve a **Settings** → **Domains** en tu panel de Vercel.
2. Agrega `fornace119.co` y configura los registros DNS `CNAME` / `A` según las instrucciones en pantalla.

---

## ⚖️ Avisos Legales

- **Ley 124 de 1994 y Ley 30 de 1986 (República de Colombia):** *«El exceso de alcohol es perjudicial para la salud. Prohíbase el expendio de bebidas embriagantes a menores de edad»*.
- **Ley 1581 de 2012 (Régimen General de Protección de Datos Personales / Habeas Data):** Los datos personales recolectados en el navegador del usuario se limitan exclusivamente a facilitar la experiencia de compra y recompra local en este dispositivo, pudiendo ser eliminados en cualquier momento por el titular mediante el botón de purga local habilitado en la interfaz.

---

© 2026 Fornace 119. Pizzería Napoletana — Usaquén, Bogotá D.C., Colombia.
