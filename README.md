# Uniclima – Web App

Sitio web / aplicación web corporativa de **Grupo Uniclima**, empresa con más de 40 años de experiencia dedicada a ofrecer soluciones integrales en aire acondicionado, ventilación y refrigeración: venta, suministro e instalación de equipos, servicios e insumos, así como desarrollo de proyectos residenciales, comerciales y domésticos.

## 📋 Acerca de Uniclima

Grupo Uniclima es un holding de empresas distribuidor autorizado de marcas líderes del sector HVAC (entre ellas CIAC, Climatemasters, MDV, Westinghouse, Chigo, Belimo, Owens, Carlyle, Copeland, Invotech, S&P, Toptech), lo cual respalda la calidad de sus productos y servicios y garantiza soporte técnico en la ejecución de sus proyectos.

- **Sucursales en Venezuela:** Caracas, Valencia, Puerto Ordaz y Margarita, atendiendo todo el territorio nacional.
- **Presencia internacional:** Panamá y Miami, como enlace para toda Latinoamérica.
- **Posicionamiento:** N.º 1 en ventas de aire acondicionado en el país.

## 🌐 Secciones del sitio

- **Inicio** – Hero en carrusel (3 diapositivas: marca general, proyectos/experiencia, servicio técnico), presentación general de la empresa y marcas representadas.
- **Nosotros** – Historia, misión y trayectoria del grupo.
- **Productos** – Catálogo de equipos HVAC (`productos.html`), con hero de presentación, buscador de productos en vivo y píldoras de filtro por categoría (Aplicado, Compresores, Línea CIAC, Otros, Residencial - Comercial Ligero, VRF, Válvulas de Control), cada una con su propio submenú desplegable de subcategorías, sobre una grilla de fichas de producto. El catálogo se administra desde un panel interno independiente — ver "🔐 Panel de administración" más abajo.
- **Proyectos** – Portafolio de proyectos ejecutados.
- **Cursos / Academia Uniclima** (`cursos.html`) – Catálogo de 16 cursos de formación HVAC organizados por nivel (Básico, Intermedio, Avanzado — cada uno en su propia sección), con buscador de texto, píldoras de nivel (Todos/Básico/Intermedio/Avanzado) y un desplegable de palabras clave (Chiller, Agua helada, VRF, Básico, Aire acondicionado, Inverter, Cargas térmicas, Software) dentro de la barra de búsqueda; los tres filtros se combinan entre sí. Incluye aviso de que los cursos no requieren examen y que los certificados no están avalados por Carrier. Se administra desde el mismo panel interno que los productos — ver "🔐 Panel de administración" más abajo.
- **Cotizaciones** – Solicitud de cotizaciones de productos y proyectos.
- **Noticias** – Blog / novedades de la empresa.
- **Atención al Cliente**
  - **Calculadora de BTU** (`atencion-al-cliente/calculadora-btu.html`) – Calcula la capacidad de aire acondicionado recomendada a partir del ancho, largo y alto del espacio, la cantidad de personas y de equipos electrónicos. Sugiere además el tamaño de equipo comercial más cercano (9,000 / 12,000 / 18,000 BTU, etc.). Incluye instrucciones de uso en un modal aparte. Cálculo 100% en el cliente (JavaScript vanilla, sin backend) — ver `js/calculadora-btu.js`.
  - **Guía Práctica** (`atencion-al-cliente/guia-practica.html`) – Qué verificar antes de llamar al servicio técnico (interruptor, termostato, panel eléctrico, ventilador exterior, filtros) y cómo preparar la visita de un técnico (factura, marca/modelo/serial, historial de servicios, ubicación de las unidades, entre otros).
  - **Garantía** (`atencion-al-cliente/garantia.html`) – Condiciones de la garantía de los equipos, casos en los que no aplica, y botón de descarga de la planilla de solicitud de garantía en PDF.
- **Contacto** – Datos de contacto y sucursales.

## ❄️ Categorías de producto

Aire Acondicionado · Chillers · Equipos Compactos · Fan & Coil · Manejadoras de Aire · Mini Splits · Mini VRF · Piso-Techo · Sistemas VRF · Tecnología Inverter · Unidad Condensadora · Unidad Evaporadora · Unidades de Paquete · Ventilación

## ✨ Características destacadas

- **Tema claro/oscuro** – Toggle en el header que alterna entre tema claro y oscuro. La preferencia se guarda en `localStorage` y, si el usuario no ha elegido ninguna, se respeta la preferencia del sistema operativo (`prefers-color-scheme`) y se sigue actualizando en vivo si esta cambia. Un script inline en el `<head>` aplica el tema antes del primer render para evitar parpadeos (FOUC). Las secciones oscuras por diseño (hero, footer, banners) se mantienen igual en ambos temas; solo cambian las secciones "claras" (fondos, tarjetas, textos).
- **Carrusel del hero** – La sección de Inicio muestra 3 diapositivas (marca general, proyectos/experiencia, servicio técnico) con transición tipo *crossfade*, autoplay (7s), flechas y puntos de navegación. El autoplay se pausa al pasar el mouse, al enfocar con teclado o al cambiar de pestaña, soporta swipe en móvil y respeta `prefers-reduced-motion`.
- **Catálogo de productos con filtros en vivo** – La página de Productos (`productos.html`) incluye un buscador de texto y píldoras de filtro por categoría — con submenú de subcategorías — que muestran/ocultan las fichas de producto al instante, en el cliente y sin recargar la página (JavaScript vanilla, sin backend ni llamadas a servidor). El catálogo (categorías, subcategorías y productos) vive en `localStorage` y se gestiona desde un panel de administración separado — ver la sección dedicada más abajo.
- **Academia con filtro combinado** – La página de Cursos (`cursos.html`) organiza los cursos en 3 secciones por nivel y permite filtrar por nivel, por palabra clave (en un desplegable dentro del buscador) y por texto libre al mismo tiempo; las secciones sin resultados se ocultan solas. Igual que el catálogo de productos, vive en `localStorage` y se administra desde el mismo panel.
- **Calculadora de BTU** – Estimación rápida de la capacidad de A/C necesaria (volumen del espacio × factor base, más ajustes por ocupantes y equipos electrónicos), con validación de campos y sugerencia del tamaño de equipo comercial más cercano. Cálculo instantáneo en el cliente, sin backend.

## 🔐 Panel de administración

Página interna independiente (`admin-productos.html`) para gestionar el catálogo de productos y el de cursos sin tocar código, organizada en dos pestañas: **Productos** y **Cursos**. No está enlazada desde el menú principal del sitio y lleva `<meta name="robots" content="noindex, nofollow">`. Hay un botón "Administrar productos" en `productos.html` y "Administrar cursos" en `cursos.html` que llevan directo a esta página.

- **Pantalla de acceso propia** (no el `prompt()` del navegador) con contraseña simple; recuerda el acceso durante la sesión del navegador (`sessionStorage`).
- **Pestaña Productos** – CRUD completo (agregar, editar, eliminar), incluyendo categoría y subcategoría (cada una de las 7 categorías tiene su propia lista de subcategorías — ver `js/products-data.js`). Incluye **importar / exportar CSV**: sube un CSV para agregar productos en bloque o reemplazar todo el catálogo. El importador reconoce automáticamente varios formatos de encabezado, en español e inglés, incluyendo exportaciones de WooCommerce/Shopify (`Name`/`Nombre`, `Categories`/`Categorías` — incluso jerárquicas tipo "Padre > Hijo" —, `Short description`/`Description`, `Images`/`Imágenes`). Si una categoría del CSV no coincide con las propias, el producto igual se importa (queda en "Otros" en vez de perderse). También permite descargar una plantilla CSV o exportar el catálogo actual.
- **Pestaña Cursos** – CRUD completo (agregar, editar, eliminar, restaurar): título, nivel (Básico/Intermedio/Avanzado), horas, descripción, ícono de la tarjeta, y palabras clave como casillas de verificación (puede marcar varias por curso) — ver `js/cursos-data.js`.
- **Notificación de confirmación** (toast) tras cada acción, en ambas pestañas.
- Todo se guarda en `localStorage`: los productos bajo la misma clave que lee `productos.html` (`js/products-data.js`), y los cursos bajo la misma clave que lee `cursos.html` (`js/cursos-data.js`) — así los cambios se reflejan de inmediato en las páginas públicas, sin backend.

> ⚠️ **Aviso de seguridad:** la contraseña del panel (definida en `js/admin-productos.js`) es solo para desalentar ediciones accidentales — el sitio es 100% estático y ese código, incluida la contraseña, es público y legible por cualquiera. No reemplaza un control de acceso real, que requeriría un backend con autenticación.

## 🖼️ Descarga local de imágenes de CSV

`scripts/download-csv-images.js` es un script de Node.js (18+) que se corre por fuera del navegador — no es una función del sitio — para descargar a `img/productos/` las imágenes referenciadas en un CSV de productos (por ejemplo, una exportación de WooCommerce con imágenes alojadas en otro dominio) y generar una copia del CSV con las rutas locales, lista para volver a importar desde el panel de administración:

```bash
node scripts/download-csv-images.js mi-catalogo.csv
```

Detecta y reutiliza imágenes repetidas, y si una descarga falla deja la URL original en esa fila en vez de perder el dato.

## 🛠️ Stack tecnológico

- **Frontend:** HTML5, JavaScript (Vanilla, sin frameworks de JS)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com) vía Play CDN (`assets/js/tailwind-config.js` define los tokens de color/tipografía de la marca) + CSS custom (`assets/css/styles.css`) para componentes bespoke (gradientes, animaciones, clip-paths) que no se expresan bien como utilidades
- **Persistencia:** localStorage (preferencia de tema claro/oscuro; disponible también para paneles admin o datos locales si se necesita)
- **Integraciones:** WhatsApp (contacto directo), formularios de cotización, calculadora de BTU
- **Sin backend / servidor:** sitio 100% estático, desplegable en cualquier hosting estático
- **Sin build step:** Tailwind se carga vía CDN (Play CDN), así que no hace falta `npm install` ni compilar nada para ver el sitio. Si el proyecto crece, se recomienda migrar a un build local de Tailwind (Tailwind CLI) para producción.

## 🚀 Instalación y ejecución local

No requiere instalación de dependencias ni build. Al ser un sitio estático en HTML/CSS/JS plano, basta con abrir el proyecto:

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd uniclima-web

# Abrir index.html directamente en el navegador
# o servirlo con un servidor local simple, por ejemplo:
npx serve .
# o
python3 -m http.server 8000
```

## 📁 Estructura del proyecto

```
uniclima-web/
├── index.html
├── nosotros.html
├── productos.html
├── admin-productos.html        # panel interno de administración (pestañas: Productos y Cursos)
├── proyectos.html
├── cursos.html                 # Academia Uniclima: 16 cursos por nivel, con filtros (ver características destacadas)
├── cotizaciones.html
├── noticias.html
├── contacto.html
├── atencion-al-cliente/
│   ├── calculadora-btu.html     # calculadora de BTU funcional (ver características destacadas)
│   ├── guia-practica.html       # checklist antes de llamar a servicio técnico + preparación de visita
│   └── garantia.html            # condiciones de garantía + descarga de planilla de solicitud (PDF)
├── scripts/
│   └── download-csv-images.js  # descarga local de imágenes referenciadas en un CSV (se corre con Node, no en el navegador)
├── assets/
│   ├── img/
│   │   └── productos/          # imágenes de producto (destino de scripts/download-csv-images.js)
│   ├── css/
│   │   └── styles.css          # componentes custom (no cubiertos por utilidades Tailwind)
│   └── js/
│       ├── tailwind-config.js  # tokens de marca para Tailwind (colores, tipografías, sombras)
│       ├── main.js             # header, menú, dropdowns, reveal-on-scroll, contadores, tema claro/oscuro, carrusel del hero
│       ├── calculadora-btu.js  # lógica de la Calculadora de BTU (atencion-al-cliente/calculadora-btu.html)
│       ├── products-data.js    # catálogo de productos: categorías/subcategorías compartidas (localStorage)
│       ├── productos-grid.js   # grilla pública + buscador + filtros (productos.html)
│       ├── cursos-data.js      # catálogo de cursos: niveles/palabras clave compartidos (localStorage)
│       ├── cursos-grid.js      # grilla pública + buscador + filtro nivel/palabra clave (cursos.html)
│       └── admin-productos.js  # pantalla de acceso + CRUD de productos (con import/export CSV) y de cursos (admin-productos.html)
└── README.md
```

## 📞 Contacto

- **Móvil / WhatsApp:** +58 414 0260505
- **Oficina:** +58 212 2341454 / 2349167
- **Redes sociales:** [Facebook](https://www.facebook.com/grupouniclima/) · [Instagram](https://www.instagram.com/grupouniclima/) · [Twitter](https://www.twitter.com/grupouniclima)

## 📄 Licencia

© Uniclima. Todos los derechos reservados. Este proyecto es de uso privado/interno salvo que se indique lo contrario.
