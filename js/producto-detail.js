/**
 * producto-detail.js
 * -------------------
 * Lógica de producto.html: lee el parámetro ?id= de la URL, busca ese
 * producto en UniclimaProducts (ver products-data.js, que debe cargarse
 * antes que este archivo) y llena la ficha. Si no existe (id inválido, o
 * el catálogo aún no se cargó en este navegador), muestra un mensaje de
 * "no encontrado" con un enlace de vuelta al catálogo.
 */
(function () {
  "use strict";

  var data = window.UniclimaProducts;
  var products = data.load();

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var product = id
    ? products.find(function (p) {
        return p.id === id;
      })
    : null;

  var notFoundEl = document.getElementById("productNotFound");
  var detailEl = document.getElementById("productDetail");

  if (!product) {
    notFoundEl.hidden = false;
    detailEl.hidden = true;
    return;
  }

  document.title = product.name + " — Grupo Uniclima";

  var img = document.getElementById("pdImage");
  var placeholder = document.getElementById("pdPlaceholder");
  if (product.image) {
    img.src = product.image;
    img.alt = product.name;
    img.hidden = false;
    img.onerror = function () {
      img.hidden = true;
      placeholder.hidden = false;
    };
  } else {
    placeholder.hidden = false;
  }

  document.getElementById("pdCategory").textContent =
    data.CATEGORY_LABELS[product.category] || product.category;

  var subEl = document.getElementById("pdSubcategory");
  if (product.subcategory) {
    subEl.textContent = product.subcategory;
    subEl.hidden = false;
  }

  document.getElementById("pdName").textContent = product.name;
  document.getElementById("pdSpecs").textContent = product.specs;

  // Precompleta el mensaje de WhatsApp con el nombre del producto.
  var waBtn = document.getElementById("pdWhatsappBtn");
  var waMessage = "Hola, quisiera más información sobre: " + product.name;
  waBtn.href =
    waBtn.href.split("?")[0] + "?text=" + encodeURIComponent(waMessage);

  // Deja el nombre del producto disponible como parámetro por si
  // cotizaciones.html quiere leerlo y precompletar el formulario.
  var quoteBtn = document.getElementById("pdQuoteBtn");
  quoteBtn.href =
    quoteBtn.href.split("?")[0] + "?producto=" + encodeURIComponent(product.name);

  notFoundEl.hidden = true;
  detailEl.hidden = false;
})();
