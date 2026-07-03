# Uniclima – Web App

Sitio web / aplicación web corporativa de **Grupo Uniclima**, empresa con más de 40 años de experiencia dedicada a ofrecer soluciones integrales en aire acondicionado, ventilación y refrigeración: venta, suministro e instalación de equipos, servicios e insumos, así como desarrollo de proyectos residenciales, comerciales y domésticos.

## 📋 Acerca de Uniclima

Grupo Uniclima es un holding de empresas distribuidor autorizado de marcas líderes del sector HVAC (entre ellas CIAC, Climatemasters, MDV, Westinghouse, Chigo, Belimo, Owens, Carlyle, Copeland, Invotech, S&P, Toptech), lo cual respalda la calidad de sus productos y servicios y garantiza soporte técnico en la ejecución de sus proyectos.

- **Sucursales en Venezuela:** Caracas, Valencia, Puerto Ordaz y Margarita, atendiendo todo el territorio nacional.
- **Presencia internacional:** Panamá y Miami, como enlace para toda Latinoamérica.
- **Posicionamiento:** N.º 1 en ventas de aire acondicionado en el país.

## 🌐 Secciones del sitio

- **Inicio** – Presentación general de la empresa y marcas representadas.
- **Nosotros** – Historia, misión y trayectoria del grupo.
- **Productos** – Catálogo / tienda de equipos y repuestos.
- **Proyectos** – Portafolio de proyectos ejecutados.
- **Cursos** – Capacitación online, cursos presenciales y transmisiones vía Instagram Live.
- **Cotizaciones** – Solicitud de cotizaciones de productos y proyectos.
- **Noticias** – Blog / novedades de la empresa.
- **Atención al Cliente**
  - Calculadora de BTU
  - Guía práctica
  - Garantía (condiciones y planilla de solicitud)
- **Contacto** – Datos de contacto y sucursales.

## ❄️ Categorías de producto

Aire Acondicionado · Chillers · Equipos Compactos · Fan & Coil · Manejadoras de Aire · Mini Splits · Mini VRF · Piso-Techo · Sistemas VRF · Tecnología Inverter · Unidad Condensadora · Unidad Evaporadora · Unidades de Paquete · Ventilación

## 🛠️ Stack tecnológico

- **Frontend:** HTML5, JavaScript (Vanilla, sin frameworks de JS)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com) vía Play CDN (`assets/js/tailwind-config.js` define los tokens de color/tipografía de la marca) + CSS custom (`assets/css/styles.css`) para componentes bespoke (gradientes, animaciones, clip-paths) que no se expresan bien como utilidades
- **Persistencia:** localStorage (si aplica para paneles admin o datos locales)
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
├── proyectos.html
├── cursos.html
├── cotizaciones.html
├── noticias.html
├── contacto.html
├── atencion-al-cliente/
│   ├── calculadora-btu.html
│   ├── guia-practica.html
│   └── garantia.html
├── assets/
│   ├── img/
│   ├── css/
│   │   └── styles.css          # componentes custom (no cubiertos por utilidades Tailwind)
│   └── js/
│       ├── tailwind-config.js  # tokens de marca para Tailwind (colores, tipografías, sombras)
│       ├── main.js             # header, menú, dropdowns, reveal-on-scroll, contadores
│       └── calculadora-btu.js
└── README.md
```

## 📞 Contacto

- **Móvil / WhatsApp:** +58 414 0260505
- **Oficina:** +58 212 2341454 / 2349167
- **Redes sociales:** [Facebook](https://www.facebook.com/grupouniclima/) · [Instagram](https://www.instagram.com/grupouniclima/) · [Twitter](https://www.twitter.com/grupouniclima)

## 📄 Licencia

© Uniclima. Todos los derechos reservados. Este proyecto es de uso privado/interno salvo que se indique lo contrario.
