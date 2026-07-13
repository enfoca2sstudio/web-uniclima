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

  // Etiquetas "hijas" (subcategorías) dentro de cada categoría, para el
  // submenú de las píldoras de filtro y para el formulario de admin. El
  // orden aquí es el orden en que se muestran.
  var SUBCATEGORIES = {
    aplicado: [
      "Chillers enfriados por agua",
      "Chillers enfriados por aire",
      "Compactos",
      "Control de Sistema de Edificio",
      "Manejadoras de Aire",
      "Sistemas divididos (Splits)",
      "Unidad Fan Coil",
    ],
    compresores: ["Reciprocante", "Scroll", "Semi Herméticos"],
    ciac: [
      "Mini Splits Convencionales",
      "Mini Splits Inverter",
      "Paquetes pequeños",
      "Piso/Techo",
      "Sistemas de combinación flexible",
      "VRF",
    ],
    otros: ["Owens Corning"],
    residencial: [
      "Aire Acondicionado Central",
      "Aire Acondicionado De Ventana",
      "Calidad Del Aire Interior",
      "Cassettes",
      "Compactos",
      "Evaporadoras",
      "Mini Splits Conventional",
      "Mini Splits Inverter",
      "Paquetes pequeños y medianos",
      "Piso/Techo",
      "Sistema Multi Split Xpower",
      "Sistemas de Combinación Flexible",
      "Sistemas divididos (Splits)",
      "Termostatos y Controles",
    ],
    valvulas: ["Belimo"],
    vrf: ["CARRIER", "MDV"],
  };

  var COLLECTION = "products";

  /** Espera a que js/firebase-init.js (un módulo, carga aparte) esté listo. */
  function waitForFirebase() {
    return new Promise(function (resolve) {
      if (global.UniclimaFirebase) {
        resolve(global.UniclimaFirebase);
        return;
      }
      global.addEventListener("uniclima-firebase-ready", function handler() {
        global.removeEventListener("uniclima-firebase-ready", handler);
        resolve(global.UniclimaFirebase);
      });
    });
  }

  /**
   * Trae el catálogo completo desde Firestore. La PRIMERA vez que corre
   * el sitio contra un proyecto de Firebase nuevo (colección vacía), la
   * llena automáticamente con DEFAULT_PRODUCTS — así no hay que migrar
   * nada a mano.
   */
  async function load() {
    var fb = await waitForFirebase();
    await fb.seedIfEmpty(COLLECTION, DEFAULT_PRODUCTS);
    return fb.getAll(COLLECTION);
  }

  /** Agrega un producto nuevo (sin id) o actualiza uno existente (con id). */
  async function addOrUpdate(product) {
    var fb = await waitForFirebase();
    var id = product.id || "p" + Date.now();
    await fb.setItem(COLLECTION, id, product);
    return id;
  }

  /** Elimina un producto por id. */
  async function remove(id) {
    var fb = await waitForFirebase();
    await fb.deleteItem(COLLECTION, id);
  }

  /** Borra todo y vuelve a sembrar con el catálogo original. */
  async function resetToDefaults() {
    var fb = await waitForFirebase();
    await fb.clearCollection(COLLECTION);
    await fb.seedIfEmpty(COLLECTION, DEFAULT_PRODUCTS);
    return fb.getAll(COLLECTION);
  }

  /**
   * Importación masiva desde CSV. mode="append" agrega los items al
   * catálogo actual (les asigna id si no traen); mode="replace" borra
   * todo el catálogo actual primero. Devuelve el catálogo completo ya
   * actualizado.
   */
  async function importBulk(items, mode) {
    var fb = await waitForFirebase();
    var withIds = items.map(function (item, i) {
      var copy = Object.assign({}, item);
      if (!copy.id) copy.id = "p" + Date.now() + "_" + i;
      return copy;
    });
    if (mode === "replace") {
      await fb.clearCollection(COLLECTION);
    }
    await fb.bulkSet(COLLECTION, withIds);
    return fb.getAll(COLLECTION);
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  global.UniclimaProducts = {
    DEFAULT_PRODUCTS: DEFAULT_PRODUCTS,
    CATEGORY_LABELS: CATEGORY_LABELS,
    SUBCATEGORIES: SUBCATEGORIES,
    load: load,
    addOrUpdate: addOrUpdate,
    remove: remove,
    resetToDefaults: resetToDefaults,
    importBulk: importBulk,
    escapeHtml: escapeHtml,
  };
})(window);
