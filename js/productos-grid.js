/**
 * productos-grid.js
 * -----------------
 * Pinta la grilla pública de productos.html a partir de UniclimaProducts
 * (ver products-data.js, que debe cargarse antes que este archivo) y
 * maneja el buscador + los filtros por categoría. La administración
 * (agregar/editar/eliminar) vive en admin-productos.html.
 */
(function () {
  "use strict";

  var data = window.UniclimaProducts;
  var products = data.load();

  var grid = document.getElementById("productGrid");

  function renderGrid() {
    if (!grid) return;
    grid.innerHTML = products
      .map(function (p) {
        var img = p.image
          ? '<img src="' +
            data.escapeHtml(p.image) +
            '" alt="' +
            data.escapeHtml(p.name) +
            '" onerror="this.replaceWith(this.nextElementSibling); this.remove();">' +
            '<svg viewBox="0 0 100 100" class="product-placeholder" style="display:none"><rect x="18" y="26" width="64" height="52" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>'
          : '<svg viewBox="0 0 100 100" class="product-placeholder"><rect x="18" y="26" width="64" height="52" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M18 42h64M34 26v52M66 26v52" stroke="currentColor" stroke-width="2"/></svg>';
        return (
          '<article class="product-card" data-category="' +
          data.escapeHtml(p.category) +
          '">' +
          '<div class="product-card-image">' +
          img +
          "</div>" +
          '<span class="product-tag">' +
          data.escapeHtml(data.CATEGORY_LABELS[p.category] || p.category) +
          "</span>" +
          "<h3>" +
          data.escapeHtml(p.name) +
          "</h3>" +
          "<p>" +
          data.escapeHtml(p.specs) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
    applyFilters();
  }

  /* ---------- Buscador + filtros ---------- */
  var search = document.getElementById("productSearch");
  var pills = document.querySelectorAll(".filter-pill");

  function applyFilters() {
    var term = (search.value || "").trim().toLowerCase();
    var active = document.querySelector(".filter-pill.active");
    var cat = active ? active.dataset.filter : "todos";
    var cards = grid.querySelectorAll(".product-card");
    cards.forEach(function (card) {
      var matchesCat = cat === "todos" || card.dataset.category === cat;
      var matchesTerm =
        !term || card.textContent.toLowerCase().indexOf(term) !== -1;
      card.style.display = matchesCat && matchesTerm ? "" : "none";
    });
  }

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) {
        p.classList.remove("active");
      });
      pill.classList.add("active");
      applyFilters();
    });
  });
  if (search) search.addEventListener("input", applyFilters);

  // Si el catálogo cambió en otra pestaña (ej. el panel de admin abierto
  // en otra pestaña), refresca la grilla al volver a esta pestaña.
  window.addEventListener("storage", function (e) {
    if (e.key === data.STORAGE_KEY) {
      products = data.load();
      renderGrid();
    }
  });

  renderGrid();
})();
