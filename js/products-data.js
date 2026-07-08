/**
 * products-data.js
 * ----------------
 * Fuente de datos compartida del catálogo de productos. La usan tanto
 * productos.html (para pintar la grilla pública) como admin-productos.html
 * (para el panel de administración). Guarda el catálogo en localStorage
 * bajo la misma clave en ambas páginas, así que los cambios hechos desde
 * el panel de administración se reflejan en el catálogo público sin
 * necesidad de backend.
 *
 * Expone todo bajo el objeto global `window.UniclimaProducts` para no
 * depender de módulos ES ni de un build step (el sitio se sirve tal cual,
 * sin compilar).
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "uniclima-products";

  var DEFAULT_PRODUCTS = [
    {
      id: "p1",
      category: "aplicado",
      name: "Serie 16LJ",
      specs: "75 – 525 Toneladas",
      image: "",
    },
    {
      id: "p2",
      category: "aplicado",
      name: "Serie 16TJ",
      specs: "100 – 700 Toneladas",
      image: "",
    },
    {
      id: "p3",
      category: "aplicado",
      name: "Serie AquaEdge® – 19XRV",
      specs:
        "19XR Etapa Doble (800 – 3000 Toneladas), 19XR Etapa Simple (200 – 1600 Toneladas)",
      image: "",
    },
    {
      id: "p4",
      category: "aplicado",
      name: "Serie AquaEdge® – 23XRV",
      specs: "175 – 550 Toneladas",
      image: "",
    },
    {
      id: "p5",
      category: "aplicado",
      name: "Serie AquaForce® – 30XW",
      specs: "150 – 400 Toneladas",
      image: "",
    },
    {
      id: "p6",
      category: "aplicado",
      name: "Serie Quaforce® – 30HX",
      specs: "75 – 265 Toneladas",
      image: "",
    },
    {
      id: "p7",
      category: "aplicado",
      name: "Serie AquaForce® – 30XA",
      specs: "80 – 500 Toneladas – 140 to 350 Toneladas",
      image: "",
    },
    {
      id: "p8",
      category: "aplicado",
      name: "Serie AquaForce® – 30XV",
      specs: "80 to 500 Toneladas – 140 a 500 Tonos nominales",
      image: "",
    },
  ];

  var CATEGORY_LABELS = {
    aplicado: "Aplicado",
    compresores: "Compresores",
    ciac: "Línea CIAC",
    otros: "Otros",
    residencial: "Residencial - Comercial Ligero",
    vrf: "VRF",
    valvulas: "Válvulas de Control",
  };

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      /* localStorage no disponible o dato corrupto: usar catálogo original */
    }
    return DEFAULT_PRODUCTS.slice();
  }

  function save(products) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return true;
    } catch (err) {
      return false;
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  global.UniclimaProducts = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_PRODUCTS: DEFAULT_PRODUCTS,
    CATEGORY_LABELS: CATEGORY_LABELS,
    load: load,
    save: save,
    escapeHtml: escapeHtml,
  };
})(window);
