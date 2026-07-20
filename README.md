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
- **Productos** – Catálogo de equipos HVAC (`productos.html`), con hero de presentación, buscador de productos en vivo y píldoras de filtro por categoría (Aplicado, Compresores, Línea CIAC, Otros, Residencial - Comercial Ligero, VRF, Válvulas de Control), cada una con su propio submenú desplegable de subcategorías, sobre una grilla de fichas de producto. El catálogo vive en una base de datos real (Firestore) y se administra desde un panel interno independiente — ver "🔐 Panel de administración" y "🔥 Base de datos (Firestore)" más abajo.
- **Proyectos** – Portafolio de proyectos ejecutados.
- **Servicios** – Cinco páginas de servicio (`servicios/`), todas con el mismo formato: hero con curva decorativa, sección "¿Por qué elegirnos?" con tarjetas, "Detalle del Servicio" con checklist, y CTA final.
  - **Asesoría Técnica** (`servicios/asesoria-tecnica.html`)
  - **Ventas e Instalación** (`servicios/ventas-instalacion.html`)
  - **Mantenimiento** (`servicios/mantenimiento.html`)
  - **Limpieza de Ductos** (`servicios/limpieza-ductos.html`)
  - **Capacitación Técnica** (`servicios/capacitacion-tecnica.html`)
- **Cursos / Academia Uniclima** (`cursos.html`) – Catálogo de 16 cursos de formación HVAC organizados por nivel (Básico, Intermedio, Avanzado — cada uno en su propia sección), con buscador de texto, píldoras de nivel (Todos/Básico/Intermedio/Avanzado) y un desplegable de palabras clave (Chiller, Agua helada, VRF, Básico, Aire acondicionado, Inverter, Cargas térmicas, Software, y "Activo" como filtro de estado) dentro de la barra de búsqueda; los filtros se combinan entre sí. Cada curso tiene su propia ficha (`curso.html?id=...`, ver `js/curso-detail.js`) con descripción completa y botón de registro. Incluye aviso de que los cursos no requieren examen y que los certificados no están avalados por Carrier. Se administra desde el mismo panel interno que los productos — ver "🔐 Panel de administración" más abajo.
- **Planilla de Inscripción** (`cotizaciones.html`) – Formulario de inscripción a cursos de la Academia: nombre, correo, teléfono, curso de interés (desplegable poblado con los cursos activos) y comentario opcional. Al enviarse, además de guardar una copia local, se envía por correo mediante [FormSubmit](https://formsubmit.co) a `mercadeoypublicidaduniclima@gmail.com` (servicio gratuito de formulario-a-correo; requiere una activación única la primera vez que llega un envío real — ver el aviso en el propio archivo). Si el envío por correo falla, se le indica al visitante escribir por WhatsApp como respaldo. `registro-curso.html` existía antes como una página de inscripción independiente (con envío por WhatsApp); ahora es solo una redirección automática hacia esta página, para no romper enlaces ya compartidos.
- **Noticias** – Blog / novedades de la empresa.
- **Atención al Cliente**
  - **Calculadora de BTU** (`atencion-al-cliente/calculadora-btu.html`) – Calcula la capacidad de aire acondicionado recomendada a partir del ancho, largo y alto del espacio, la cantidad de personas y de equipos electrónicos. Sugiere además el tamaño de equipo comercial más cercano (9,000 / 12,000 / 18,000 BTU, etc.). Incluye instrucciones de uso en un modal aparte. Cálculo 100% en el cliente (JavaScript vanilla, sin backend) — ver `js/calculadora-btu.js`.
  - **Guía Práctica** (`atencion-al-cliente/guia-practica.html`) – Qué verificar antes de llamar al servicio técnico (interruptor, termostato, panel eléctrico, ventilador exterior, filtros) y cómo preparar la visita de un técnico (factura, marca/modelo/serial, historial de servicios, ubicación de las unidades, entre otros).
  - **Garantía** (`atencion-al-cliente/garantia.html`) – Condiciones de la garantía de los equipos, casos en los que no aplica, y botón de descarga de la planilla de solicitud de garantía en PDF.
- **Contacto** (`contacto.html`) – Las 10 sedes reales de Grupo Uniclima agrupadas por país: Venezuela (6), Panamá (3) y Miami (1), cada una con dirección, teléfono móvil y de oficina, correo y enlace directo a Google Maps.

## ❄️ Categorías de producto

Aire Acondicionado · Chillers · Equipos Compactos · Fan & Coil · Manejadoras de Aire · Mini Splits · Mini VRF · Piso-Techo · Sistemas VRF · Tecnología Inverter · Unidad Condensadora · Unidad Evaporadora · Unidades de Paquete · Ventilación

## ✨ Características destacadas

- **Tema claro/oscuro** – Toggle en el header que alterna entre tema claro y oscuro. La preferencia se guarda en `localStorage` y, si el usuario no ha elegido ninguna, se respeta la preferencia del sistema operativo (`prefers-color-scheme`) y se sigue actualizando en vivo si esta cambia. Un script inline en el `<head>` aplica el tema antes del primer render para evitar parpadeos (FOUC). Las secciones oscuras por diseño (hero, footer, banners) se mantienen igual en ambos temas; solo cambian las secciones "claras" (fondos, tarjetas, textos).
- **Carrusel del hero** – La sección de Inicio muestra 3 diapositivas (marca general, proyectos/experiencia, servicio técnico) con transición tipo *crossfade*, autoplay (7s), flechas y puntos de navegación. El autoplay se pausa al pasar el mouse, al enfocar con teclado o al cambiar de pestaña, soporta swipe en móvil y respeta `prefers-reduced-motion`.
- **Catálogo de productos con filtros en vivo** – La página de Productos (`productos.html`) incluye un buscador de texto y píldoras de filtro por categoría — con submenú de subcategorías — que muestran/ocultan las fichas de producto al instante, en el cliente. El catálogo (categorías, subcategorías y productos) vive en Firestore y se gestiona desde un panel de administración separado — ver "🔐 Panel de administración" y "🔥 Base de datos (Firestore)" más abajo.
- **Academia con filtro combinado** – La página de Cursos (`cursos.html`) organiza los cursos en 3 secciones por nivel y permite filtrar por nivel, por palabra clave (en un desplegable dentro del buscador) y por texto libre al mismo tiempo; las secciones sin resultados se ocultan solas. Igual que el catálogo de productos, vive en Firestore y se administra desde el mismo panel.
- **Cursos activos/inactivos** – Cada curso puede marcarse como activo o inactivo desde el panel de administración. Los inactivos se siguen mostrando en `cursos.html` (con una etiqueta "No disponible", visible al pasar el mouse) pero sin enlace funcional a su ficha, y quedan excluidos del desplegable de la Planilla de Inscripción.
- **Menú responsive** – El panel deslizante del menú móvil incluye un botón de cierre propio (insertado por `main.js` en todas las páginas, sin duplicar marcado), submenús desplegables que se expanden en el lugar (Servicios, Atención al Cliente) sin cerrar el panel completo al abrirlos, y colores/sombras que se adaptan al tema claro/oscuro.
- **Calculadora de BTU** – Estimación rápida de la capacidad de A/C necesaria (volumen del espacio × factor base, más ajustes por ocupantes y equipos electrónicos), con validación de campos y sugerencia del tamaño de equipo comercial más cercano. Cálculo instantáneo en el cliente, sin backend.

## 🔐 Panel de administración

Página interna independiente (`admin-productos.html`) para gestionar el catálogo de productos y el de cursos sin tocar código, organizada en dos pestañas: **Productos** y **Cursos**. No está enlazada desde el menú principal del sitio y lleva `<meta name="robots" content="noindex, nofollow">`. Hay un botón "Administrar productos" en `productos.html` y "Administrar cursos" en `cursos.html` que llevan directo a esta página.

- **Pantalla de acceso propia** (no el `prompt()` del navegador) con contraseña simple; recuerda el acceso durante la sesión del navegador (`sessionStorage`).
- **Pestaña Productos** – CRUD completo (agregar, editar, eliminar), incluyendo categoría y subcategoría (cada una de las 7 categorías tiene su propia lista de subcategorías — ver `js/products-data.js`). Incluye **importar / exportar CSV**: sube un CSV para agregar productos en bloque o reemplazar todo el catálogo. El importador reconoce automáticamente varios formatos de encabezado, en español e inglés, incluyendo exportaciones de WooCommerce/Shopify (`Name`/`Nombre`, `Categories`/`Categorías` — incluso jerárquicas tipo "Padre > Hijo" —, `Short description`/`Description`, `Images`/`Imágenes`). Si una categoría del CSV no coincide con las propias, el producto igual se importa (queda en "Otros" en vez de perderse). También permite descargar una plantilla CSV o exportar el catálogo actual.
- **Pestaña Cursos** – CRUD completo (agregar, editar, eliminar, restaurar): título, nivel (Básico/Intermedio/Avanzado), horas, descripción, ícono de la tarjeta, estado activo/inactivo (interruptor visual), y palabras clave como casillas de verificación (puede marcar varias por curso) — ver `js/cursos-data.js`. La lista de cursos actuales muestra una etiqueta de estado (Activo/Inactivo) por cada uno.
- **Notificación de confirmación** (toast) tras cada acción, en ambas pestañas.
- Todo se guarda en **Firestore** (ver la sección siguiente): los cambios quedan disponibles de inmediato para cualquier visitante del sitio, no solo en el navegador donde se hicieron.

> ⚠️ **Aviso de seguridad:** la contraseña del panel (definida en `js/admin-productos.js`) es solo para desalentar ediciones accidentales — el sitio es 100% estático y ese código, incluida la contraseña, es público y legible por cualquiera. Sin Firebase Authentication (no incluido en esta versión), alguien con conocimientos técnicos podría escribir en la base de datos sin pasar por esta contraseña. No reemplaza un control de acceso real — ver el aviso ampliado en `js/firebase-init.js`.

## 🔥 Base de datos (Firestore)

El catálogo de productos y de cursos vive en **Cloud Firestore** (Google Firebase), no en el navegador. Antes de esta migración usaban `localStorage`, que solo persistía en el navegador donde se hacía el cambio — un curso agregado desde el panel de administración nunca lo veía nadie más. Con Firestore, cualquier cambio hecho desde el panel es visible para todos los visitantes del sitio, de inmediato.

- **`js/firebase-init.js`** – Inicializa Firebase/Firestore (vía el SDK modular de Firebase, cargado desde CDN como módulo de JavaScript — no requiere `npm install` ni build) y expone `window.UniclimaFirebase` con funciones básicas (`getAll`, `setItem`, `deleteItem`, `seedIfEmpty`, `bulkSet`, `clearCollection`) para que el resto de los scripts del sitio las use sin tener que lidiar con imports.
- **`js/products-data.js`** y **`js/cursos-data.js`** – Ya no exponen `load()`/`save()` síncronos; ahora son funciones asíncronas (`load()`, `addOrUpdate()`, `remove()`, `resetToDefaults()`, y `importBulk()` para productos) que leen/escriben en las colecciones `products` y `cursos` de Firestore. La primera vez que el sitio corre contra un proyecto de Firebase nuevo (colección vacía), se siembra sola con el catálogo original incluido en el código — no hace falta migrar datos a mano.
- Las páginas que muestran este contenido (`productos.html`, `producto.html`, `cursos.html`, `curso.html`, `admin-productos.html`, y el desplegable de cursos en `cotizaciones.html`) muestran un mensaje de "Cargando…" mientras llega la respuesta de Firestore, y un mensaje de error si la conexión falla.

### Configuración necesaria en Firebase Console

Este repositorio ya trae el código listo, pero **Firestore no funciona hasta que se complete esta configuración manual** (no se puede hacer desde el código):

1. En [Firebase Console](https://console.firebase.google.com), dentro del proyecto, ir a **Build → Firestore Database → Crear base de datos** (si todavía no existe).
2. En **Firestore Database → Reglas**, pegar unas reglas que permitan leer y escribir (ver el aviso de seguridad más abajo):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
3. La configuración del proyecto (`apiKey`, `projectId`, etc.) ya está incluida en `js/firebase-init.js`. Si se conecta el sitio a un proyecto de Firebase distinto, hay que reemplazar el objeto `firebaseConfig` ahí (Firebase Console → Configuración del proyecto → tu app web → `</>`).

> ⚠️ **Aviso de seguridad:** las reglas de arriba (`allow read, write: if true`) dejan escribir en la base de datos a cualquiera que sepa cómo llamar a Firestore directamente desde las herramientas de desarrollador del navegador, no solo a través del panel de administración. Es funcional pero no ofrece protección real. Para un control de acceso real, la solución es agregar **Firebase Authentication** y condicionar las reglas de escritura a un usuario autenticado — no incluido en esta versión.

## 🖼️ Descarga local de imágenes de CSV

`scripts/download-csv-images.js` es un script de Node.js (18+) que se corre por fuera del navegador — no es una función del sitio — para descargar a `img/productos/` las imágenes referenciadas en un CSV de productos (por ejemplo, una exportación de WooCommerce con imágenes alojadas en otro dominio) y generar una copia del CSV con las rutas locales, lista para volver a importar desde el panel de administración:

```bash
node scripts/download-csv-images.js mi-catalogo.csv
```

Detecta y reutiliza imágenes repetidas, y si una descarga falla deja la URL original en esa fila en vez de perder el dato.

## 🛠️ Stack tecnológico

- **Frontend:** HTML5, JavaScript (Vanilla, sin frameworks de JS)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com) vía Play CDN (`assets/js/tailwind-config.js` define los tokens de color/tipografía de la marca) + CSS custom (`assets/css/styles.css`) para componentes bespoke (gradientes, animaciones, clip-paths) que no se expresan bien como utilidades
- **Base de datos:** [Cloud Firestore](https://firebase.google.com/docs/firestore) (Firebase), vía el SDK modular cargado desde CDN — ver "🔥 Base de datos (Firestore)" más abajo. Guarda el catálogo de productos y de cursos.
- **Persistencia local:** localStorage (preferencia de tema claro/oscuro; también se usa para recordar el acceso al panel de administración durante la sesión)
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

> Para que el catálogo de productos y de cursos cargue (no solo el resto del sitio), el proyecto de Firebase debe estar configurado — ver "🔥 Base de datos (Firestore)" más abajo. Sin eso, esas páginas se quedan en "Cargando…".

## 📁 Estructura del proyecto

```
uniclima-web/
├── index.html
├── nosotros.html
├── productos.html
├── admin-productos.html        # panel interno de administración (pestañas: Productos y Cursos)
├── proyectos.html
├── cursos.html                 # Academia Uniclima: 16 cursos por nivel, con filtros (ver características destacadas)
├── curso.html                  # ficha individual de curso (?id=...), con registro y estado activo/inactivo
├── cotizaciones.html           # Planilla de Inscripción a cursos (envío por correo vía FormSubmit)
├── registro-curso.html         # redirección a cotizaciones.html (página de inscripción anterior, ver características destacadas)
├── noticias.html
├── contacto.html                # las 10 sedes reales (Venezuela, Panamá, Miami)
├── servicios/
│   ├── asesoria-tecnica.html
│   ├── ventas-instalacion.html
│   ├── mantenimiento.html
│   ├── limpieza-ductos.html
│   └── capacitacion-tecnica.html
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
│       ├── main.js             # header, menú (con botón de cierre y submenús), dropdowns, reveal-on-scroll, contadores, tema claro/oscuro, carrusel del hero
│       ├── calculadora-btu.js  # lógica de la Calculadora de BTU (atencion-al-cliente/calculadora-btu.html)
│       ├── firebase-init.js    # inicializa Firebase/Firestore, expone window.UniclimaFirebase (ver "🔥 Base de datos (Firestore)")
│       ├── products-data.js    # catálogo de productos: categorías/subcategorías compartidas (Firestore)
│       ├── productos-grid.js   # grilla pública + buscador + filtros (productos.html)
│       ├── producto-detail.js  # ficha individual de producto (producto.html)
│       ├── cursos-data.js      # catálogo de cursos: niveles/palabras clave/estado activo compartidos (Firestore)
│       ├── cursos-grid.js      # grilla pública + buscador + filtro nivel/palabra clave/estado (cursos.html)
│       ├── curso-detail.js     # ficha individual de curso (curso.html)
│       ├── registro-curso.js   # sin uso actualmente (registro-curso.html pasó a ser una redirección)
│       └── admin-productos.js  # pantalla de acceso + CRUD de productos (con import/export CSV) y de cursos (admin-productos.html)
└── README.md
```

## 📞 Contacto

- **Móvil / WhatsApp:** +58 414 0260505
- **Oficina:** +58 212 2341454 / 2349167
- **Redes sociales:** [Facebook](https://www.facebook.com/grupouniclima/) · [Instagram](https://www.instagram.com/grupouniclima/) · [Twitter](https://www.twitter.com/grupouniclima)

## 📄 Licencia

© Uniclima. Todos los derechos reservados. Este proyecto es de uso privado/interno salvo que se indique lo contrario.
