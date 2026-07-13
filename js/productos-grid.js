/**
 * productos-grid.js
 * -----------------
 * Pinta la grilla pública de productos.html a partir de UniclimaProducts
 * (ver products-data.js, que debe cargarse antes que este archivo), arma
 * las píldoras de filtro (con su submenú de subcategorías) a partir de
 * CATEGORY_LABELS/SUBCATEGORIES, y maneja el buscador + los filtros. La
 * administración (agregar/editar/eliminar) vive en admin-productos.html.
 */
(function () {
  "use strict";

  var data = window.UniclimaProducts;
  var products = [];

  var grid = document.getElementById("productGrid");
  var pillsWrap = document.getElementById("filterPills");
  var search = document.getElementById("productSearch");

  var activeCategory = "todos";
  var activeSubcategory = "";

  /* ---------- Píldoras de filtro + submenú ---------- */
  function buildPills() {
    if (!pillsWrap) return;
    var html = '<button class="filter-pill active" data-filter="todos">Todos</button>';

    Object.keys(data.CATEGORY_LABELS).forEach(function (key) {
      var label = data.CATEGORY_LABELS[key];
      var subs = data.SUBCATEGORIES[key] || [];
      var hasSubs = subs.length > 0;

      html += '<div class="filter-pill-wrap">';
      html +=
        '<button class="filter-pill' +
        (hasSubs ? " has-submenu" : "") +
        '" data-filter="' +
        data.escapeHtml(key) +
        '">' +
        data.escapeHtml(label) +
        (hasSubs
          ? '<svg class="filter-pill-chev" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          : "") +
        "</button>";

      if (hasSubs) {
        html += '<div class="filter-submenu">';
        html +=
          '<button type="button" class="filter-subpill filter-subpill-all" data-filter="' +
          data.escapeHtml(key) +
          '" data-subfilter="">Todo en ' +
          data.escapeHtml(label) +
          "</button>";
        subs.forEach(function (sub) {
          html +=
            '<button type="button" class="filter-subpill" data-filter="' +
            data.escapeHtml(key) +
            '" data-subfilter="' +
            data.escapeHtml(sub) +
            '">' +
            data.escapeHtml(sub) +
            "</button>";
        });
        html += "</div>";
      }
      html += "</div>";
    });

    pillsWrap.innerHTML = html;
  }

  function closeAllSubmenus() {
    pillsWrap.querySelectorAll(".filter-pill-wrap.open").forEach(function (w) {
      w.classList.remove("open");
    });
  }

  function updatePillStates() {
    pillsWrap.querySelectorAll(".filter-pill[data-filter]").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.filter === activeCategory);
    });
    pillsWrap.querySelectorAll(".filter-subpill").forEach(function (btn) {
      var isActive =
        btn.dataset.filter === activeCategory &&
        (btn.dataset.subfilter || "") === activeSubcategory;
      btn.classList.toggle("active", isActive);
    });
  }

  pillsWrap.addEventListener("click", function (e) {
    var subBtn = e.target.closest(".filter-subpill");
    var mainBtn = e.target.closest(".filter-pill[data-filter]");

    if (subBtn) {
      activeCategory = subBtn.dataset.filter;
      activeSubcategory = subBtn.dataset.subfilter || "";
      updatePillStates();
      closeAllSubmenus();
      applyFilters();
      return;
    }

    if (mainBtn) {
      var wrap = mainBtn.closest(".filter-pill-wrap");
      if (wrap && mainBtn.classList.contains("has-submenu")) {
        var wasOpen = wrap.classList.contains("open");
        closeAllSubmenus();
        if (!wasOpen) wrap.classList.add("open");
      } else {
        closeAllSubmenus();
      }
      activeCategory = mainBtn.dataset.filter;
      activeSubcategory = "";
      updatePillStates();
      applyFilters();
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".filter-pills")) closeAllSubmenus();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeAllSubmenus();
  });

  /* ---------- Grilla de productos ---------- */
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
        var tagLabel = data.escapeHtml(
          data.CATEGORY_LABELS[p.category] || p.category
        );
        return (
          '<a class="product-card" href="producto.html?id=' +
          encodeURIComponent(p.id) +
          '" data-category="' +
          data.escapeHtml(p.category) +
          '" data-subcategory="' +
          data.escapeHtml(p.subcategory || "") +
          '">' +
          '<div class="product-card-image">' +
          img +
          "</div>" +
          '<span class="product-tag">' +
          tagLabel +
          (p.subcategory
            ? ' <span class="product-tag-sub">· ' +
              data.escapeHtml(p.subcategory) +
              "</span>"
            : "") +
          "</span>" +
          "<h3>" +
          data.escapeHtml(p.name) +
          "</h3>" +
          "<p>" +
          data.escapeHtml(p.specs) +
          "</p>" +
          "</a>"
        );
      })
      .join("");
    applyFilters();
  }

  function applyFilters() {
    var term = (search.value || "").trim().toLowerCase();
    var cards = grid.querySelectorAll(".product-card");
    cards.forEach(function (card) {
      var matchesCat =
        activeCategory === "todos" || card.dataset.category === activeCategory;
      var matchesSub =
        !activeSubcategory || card.dataset.subcategory === activeSubcategory;
      var matchesTerm =
        !term || card.textContent.toLowerCase().indexOf(term) !== -1;
      card.style.display =
        matchesCat && matchesSub && matchesTerm ? "" : "none";
    });
  }

  if (search) search.addEventListener("input", applyFilters);

  /* ---------- Carga inicial desde Firestore ---------- */
  buildPills();
  if (grid) {
    grid.innerHTML =
      '<p class="data-loading">Cargando catálogo…</p>';
  }
  data
    .load()
    .then(function (loaded) {
      products = loaded;
      renderGrid();
    })
    .catch(function (err) {
      console.error("No se pudo cargar el catálogo de productos:", err);
      if (grid) {
        grid.innerHTML =
          '<p class="data-error">No se pudo cargar el catálogo. Por favor, recarga la página.</p>';
      }
    });
})();
