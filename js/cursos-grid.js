/**
 * cursos-grid.js
 * --------------
 * Arma la Academia (cursos.html) a partir de UniclimaCursos (ver
 * js/cursos-data.js, que debe cargarse antes que este archivo): las
 * píldoras de palabras clave, las 3 secciones por nivel (Básico,
 * Intermedio, Avanzado) con sus tarjetas de curso, y el buscador +
 * filtro por palabra clave (funcionan juntos, en el cliente).
 */
(async function () {
  "use strict";

  var data = window.UniclimaCursos;
  var cursosList = await data.load();
  var activeKeyword = "";
  var activeStatus = "";
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
    var keywordPills = data.KEYWORDS.map(function (kw) {
      return (
        '<button type="button" class="academia-keyword-pill" data-keyword="' +
        esc(kw) +
        '">' +
        esc(kw) +
        "</button>"
      );
    }).join("");
    // "Activo" es un filtro de estado, no una palabra clave de tema, pero
    // vive en el mismo desplegable (se pidió así) — se distingue con su
    // propio data-status en vez de data-keyword.
    var statusPill =
      '<span class="academia-keyword-divider"></span>' +
      '<button type="button" class="academia-keyword-pill academia-keyword-pill-status" data-status="activo">Activo</button>';
    keywordsDropdown.innerHTML = keywordPills + statusPill;
  }

  function courseCard(curso) {
    var iconSvg = data.ICONS[curso.icon] || data.ICONS.ac;
    var isActive = curso.activo !== false;
    var tag = isActive ? "a" : "div";
    var tagsHtml = curso.tags
      .map(function (t) {
        return '<span class="curso-chip">' + esc(t) + "</span>";
      })
      .join("");
    return (
      "<" +
      tag +
      ' class="curso-card' +
      (isActive ? "" : " curso-card-inactive") +
      '"' +
      (isActive
        ? ' href="curso.html?id=' + encodeURIComponent(curso.id) + '"'
        : "") +
      ' data-level="' +
      esc(curso.level) +
      '" data-activo="' +
      isActive +
      '" data-title="' +
      esc(curso.title.toLowerCase()) +
      '" data-desc="' +
      esc(curso.description.toLowerCase()) +
      '" data-keywords="' +
      esc(curso.tags.join(",").toLowerCase()) +
      '">' +
      '<span class="curso-card-badge ' +
      (isActive ? "curso-card-badge-active" : "curso-card-badge-inactive") +
      '">' +
      (isActive ? "Activo" : "No disponible") +
      "</span>" +
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
      "</" +
      tag +
      ">"
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
      var matchesStatus =
        !activeStatus || card.dataset.activo === "true";
      var visible =
        matchesLevel && matchesTerm && matchesKeyword && matchesStatus;
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
    var statusBtn = e.target.closest(".academia-keyword-pill-status");
    var kwBtn = !statusBtn && e.target.closest(".academia-keyword-pill");

    if (statusBtn) {
      if (activeStatus === "activo") {
        activeStatus = "";
        statusBtn.classList.remove("active");
      } else {
        activeStatus = "activo";
        statusBtn.classList.add("active");
      }
      applyFilters();
      return;
    }

    if (kwBtn) {
      var kw = kwBtn.dataset.keyword;
      if (activeKeyword === kw) {
        activeKeyword = "";
        kwBtn.classList.remove("active");
      } else {
        activeKeyword = kw;
        keywordsDropdown
          .querySelectorAll(".academia-keyword-pill:not(.academia-keyword-pill-status)")
          .forEach(function (p) {
            p.classList.remove("active");
          });
        kwBtn.classList.add("active");
      }
      applyFilters();
    }
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
  // Nota: como el catálogo ahora vive en Firestore (no en localStorage),
  // el evento "storage" ya no se dispara para estos cambios — queda acá
  // por si en el futuro se agrega algún dato que sí use localStorage.
  window.addEventListener("storage", function (e) {
    if (e.key === data.STORAGE_KEY) {
      data.load().then(function (list) {
        cursosList = list;
        buildLevels();
        applyFilters();
      });
    }
  });

  buildLevelPills();
  buildKeywordDropdown();
  buildLevels();
})();
