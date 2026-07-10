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
  var activeKeyword = "";

  var ICONS = {
    ac: '<path d="M4 9h16M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2m-16 0v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M8 19l-1 2m9-2 1 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 12.5h.01M11 12.5h.01M15 12.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    electric:
      '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1M12 7l-2.5-1.5M12 7l2.5-1.5M12 17l-2.5 1.5M12 17l2.5 1.5M7 9.5 5 8M7 9.5l-.5 2.4M17 9.5 19 8M17 9.5l.5 2.4M7 14.5 5 16M7 14.5l-.5-2.4M17 14.5 19 16M17 14.5l.5-2.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    water:
      '<path d="M12 3c3 4.5 7 8.6 7 12.2A7 7 0 0 1 5 15.2C5 11.6 9 7.5 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    vrf: '<circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="6" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/><path d="M8.2 7.7 10 10.3M15.8 7.7 14 10.3M8.2 16.3 10 13.7M15.8 16.3 14 13.7" stroke="currentColor" stroke-width="1.4"/>',
    software:
      '<rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  };

  var LEVEL_ICON_CLASS = {
    basico: "cursos-icon-basico",
    intermedio: "cursos-icon-intermedio",
    avanzado: "cursos-icon-avanzado",
  };

  var pillsWrap = document.getElementById("academiaPills");
  var levelsWrap = document.getElementById("cursosLevels");
  var search = document.getElementById("cursoSearch");
  var emptyMsg = document.getElementById("cursosEmpty");

  function esc(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function buildPills() {
    pillsWrap.innerHTML = data.KEYWORDS.map(function (kw) {
      return (
        '<button type="button" class="academia-pill" data-keyword="' +
        esc(kw) +
        '">' +
        esc(kw) +
        "</button>"
      );
    }).join("");
  }

  function courseCard(curso) {
    var iconSvg = ICONS[curso.icon] || ICONS.ac;
    var tagsHtml = curso.tags
      .map(function (t) {
        return '<span class="curso-chip">' + esc(t) + "</span>";
      })
      .join("");
    return (
      '<article class="curso-card" data-title="' +
      esc(curso.title.toLowerCase()) +
      '" data-desc="' +
      esc(curso.description.toLowerCase()) +
      '" data-keywords="' +
      esc(curso.tags.join(",").toLowerCase()) +
      '">' +
      '<div class="curso-card-media ' +
      LEVEL_ICON_CLASS[curso.level] +
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
      '<a href="cotizaciones.html?curso=' +
      encodeURIComponent(curso.title) +
      '" class="curso-register">Registrarme <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
      "</div>" +
      "</article>"
    );
  }

  function buildLevels() {
    var order = ["basico", "intermedio", "avanzado"];
    levelsWrap.innerHTML = order
      .map(function (level) {
        var cursos = data.CURSOS.filter(function (c) {
          return c.level === level;
        });
        return (
          '<section class="section' +
          (level === "basico" ? " section-alt" : "") +
          '" data-level-section="' +
          level +
          '">' +
          '<div class="mx-auto max-w-container px-6">' +
          '<div class="section-head reveal">' +
          "<h2>" +
          esc(data.LEVEL_SECTION_TITLES[level]) +
          "</h2>" +
          "</div>" +
          '<div class="cursos-grid reveal-stagger">' +
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
      var matchesTerm =
        !term ||
        card.dataset.title.indexOf(term) !== -1 ||
        card.dataset.desc.indexOf(term) !== -1;
      var matchesKeyword =
        !activeKeyword ||
        card.dataset.keywords.indexOf(activeKeyword.toLowerCase()) !== -1;
      var visible = matchesTerm && matchesKeyword;
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

  pillsWrap.addEventListener("click", function (e) {
    var btn = e.target.closest(".academia-pill");
    if (!btn) return;
    var kw = btn.dataset.keyword;
    if (activeKeyword === kw) {
      activeKeyword = "";
      btn.classList.remove("active");
    } else {
      activeKeyword = kw;
      pillsWrap.querySelectorAll(".academia-pill").forEach(function (p) {
        p.classList.remove("active");
      });
      btn.classList.add("active");
    }
    applyFilters();
  });

  if (search) search.addEventListener("input", applyFilters);

  buildPills();
  buildLevels();
})();
