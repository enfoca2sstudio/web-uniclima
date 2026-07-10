/**
 * cursos-grid.js
 * --------------
 * Arma la Academia (cursos.html) a partir de UniclimaCursos (ver
 * js/cursos-data.js, que debe cargarse antes que este archivo): las
 * píldoras de palabras clave, las 3 secciones por nivel (Básico,
 * Intermedio, Avanzado) con sus tarjetas de curso, y el buscador +
 * filtro por palabra clave (funcionan juntos, en el cliente).
 */
(function () {
  "use strict";

  var data = window.UniclimaCursos;
  var cursosList = data.load();
  var activeKeyword = "";
  var activeLevel = "todos";

  var levelPillsWrap = document.getElementById("academiaLevelPills");
  var keywordsToggle = document.getElementById("academiaKeywordsToggle");
  var keywordsDropdown = document.getElementById("academiaKeywordsDropdown");
  var levelsWrap = document.getElementById("cursosLevels");
  var search = document.getElementById("cursoSearch");
  var emptyMsg = document.getElementById("cursosEmpty");

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function buildLevelPills() {
    var order = ["todos", "basico", "intermedio", "avanzado"];
    levelPillsWrap.innerHTML = order
      .map(function (level) {
        var label =
          level === "todos" ? "Todos" : data.LEVEL_LABELS[level];
        return (
          '<button type="button" class="academia-pill' +
          (level === "todos" ? " active" : "") +
          '" data-level="' +
          level +
          '">' +
          esc(label) +
          "</button>"
        );
      })
      .join("");
  }

  function buildKeywordDropdown() {
    keywordsDropdown.innerHTML = data.KEYWORDS.map(function (kw) {
      return (
        '<button type="button" class="academia-keyword-pill" data-keyword="' +
        esc(kw) +
        '">' +
        esc(kw) +
        "</button>"
      );
    }).join("");
  }

  function courseCard(curso) {
    var iconSvg = data.ICONS[curso.icon] || data.ICONS.ac;
    var tagsHtml = curso.tags
      .map(function (t) {
        return '<span class="curso-chip">' + esc(t) + "</span>";
      })
      .join("");
    return (
      '<a class="curso-card" href="curso.html?id=' +
      encodeURIComponent(curso.id) +
      '" data-level="' +
      esc(curso.level) +
      '" data-title="' +
      esc(curso.title.toLowerCase()) +
      '" data-desc="' +
      esc(curso.description.toLowerCase()) +
      '" data-keywords="' +
      esc(curso.tags.join(",").toLowerCase()) +
      '">' +
      '<div class="curso-card-media ' +
      data.LEVEL_ICON_CLASS[curso.level] +
      '">' +
      '<svg viewBox="0 0 24 24" fill="none">' +
      iconSvg +
      "</svg>" +
      "</div>" +
      '<div class="curso-card-body">' +
      '<div class="curso-meta">' +
      '<span><svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      curso.hours +
      " horas</span>" +
      '<span class="meta-dot">•</span>' +
      '<span><svg viewBox="0 0 24 24" fill="none"><path d="M4 20V10M12 20V4M20 20v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      esc(data.LEVEL_LABELS[curso.level]) +
      "</span>" +
      "</div>" +
      "<h3>" +
      esc(curso.title) +
      "</h3>" +
      "<p>" +
      esc(curso.description) +
      "</p>" +
      '<div class="curso-chips">' +
      tagsHtml +
      "</div>" +
      "</div>" +
      "</a>"
    );
  }

  function buildLevels() {
    var order = ["basico", "intermedio", "avanzado"];
    levelsWrap.innerHTML = order
      .map(function (level) {
        var cursos = cursosList.filter(function (c) {
          return c.level === level;
        });
        return (
          '<section class="section' +
          (level === "basico" ? " section-alt" : "") +
          '" data-level-section="' +
          level +
          '">' +
          '<div class="mx-auto max-w-container px-6">' +
          '<div class="section-head">' +
          "<h2>" +
          esc(data.LEVEL_SECTION_TITLES[level]) +
          "</h2>" +
          "</div>" +
          '<div class="cursos-grid">' +
          cursos.map(courseCard).join("") +
          "</div>" +
          "</div>" +
          "</section>"
        );
      })
      .join("");
  }

  function applyFilters() {
    var term = (search.value || "").trim().toLowerCase();
    var cards = levelsWrap.querySelectorAll(".curso-card");
    var visibleCount = 0;

    cards.forEach(function (card) {
      var matchesLevel =
        activeLevel === "todos" || card.dataset.level === activeLevel;
      var matchesTerm =
        !term ||
        card.dataset.title.indexOf(term) !== -1 ||
        card.dataset.desc.indexOf(term) !== -1;
      var matchesKeyword =
        !activeKeyword ||
        card.dataset.keywords.indexOf(activeKeyword.toLowerCase()) !== -1;
      var visible = matchesLevel && matchesTerm && matchesKeyword;
      card.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    // Oculta secciones de nivel que se quedaron sin ningún curso visible.
    levelsWrap.querySelectorAll("[data-level-section]").forEach(function (sec) {
      var anyVisible = Array.prototype.some.call(
        sec.querySelectorAll(".curso-card"),
        function (c) {
          return c.style.display !== "none";
        }
      );
      sec.hidden = !anyVisible;
    });

    emptyMsg.hidden = visibleCount !== 0;
  }

  /* ---------- Píldoras de nivel ---------- */
  levelPillsWrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".academia-pill");
    if (!btn) return;
    activeLevel = btn.dataset.level;
    levelPillsWrap.querySelectorAll(".academia-pill").forEach(function (p) {
      p.classList.remove("active");
    });
    btn.classList.add("active");
    applyFilters();
  });

  /* ---------- Desplegable de palabras clave ---------- */
  function openKeywordsDropdown() {
    keywordsDropdown.hidden = false;
    keywordsToggle.setAttribute("aria-expanded", "true");
  }
  function closeKeywordsDropdown() {
    keywordsDropdown.hidden = true;
    keywordsToggle.setAttribute("aria-expanded", "false");
  }
  keywordsToggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (keywordsDropdown.hidden) openKeywordsDropdown();
    else closeKeywordsDropdown();
  });
  keywordsDropdown.addEventListener("click", function (e) {
    var btn = e.target.closest(".academia-keyword-pill");
    if (!btn) return;
    var kw = btn.dataset.keyword;
    if (activeKeyword === kw) {
      activeKeyword = "";
      btn.classList.remove("active");
    } else {
      activeKeyword = kw;
      keywordsDropdown
        .querySelectorAll(".academia-keyword-pill")
        .forEach(function (p) {
          p.classList.remove("active");
        });
      btn.classList.add("active");
    }
    applyFilters();
  });
  document.addEventListener("click", function (e) {
    if (
      !keywordsDropdown.hidden &&
      !e.target.closest(".academia-search-wrap")
    ) {
      closeKeywordsDropdown();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !keywordsDropdown.hidden)
      closeKeywordsDropdown();
  });

  if (search) search.addEventListener("input", applyFilters);

  // Si el catálogo de cursos cambió en otra pestaña (ej. el panel de
  // admin abierto en otra pestaña), refresca la grilla al volver a esta.
  window.addEventListener("storage", function (e) {
    if (e.key === data.STORAGE_KEY) {
      cursosList = data.load();
      buildLevels();
      applyFilters();
    }
  });

  buildLevelPills();
  buildKeywordDropdown();
  buildLevels();
})();
