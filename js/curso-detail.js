/**
 * curso-detail.js
 * ----------------
 * Lógica de curso.html: lee el parámetro ?id= de la URL, busca ese curso
 * en UniclimaCursos (ver cursos-data.js, que debe cargarse antes que
 * este archivo) y llena la ficha con el nuevo diseño (topbar + hero +
 * cuerpo). Si no existe (id inválido, o el catálogo aún no se cargó en
 * este navegador), muestra el estado de "no encontrado".
 */
(function () {
  "use strict";

  var data   = window.UniclimaCursos;
  var cursos = data.load();

  var params = new URLSearchParams(window.location.search);
  var id     = params.get("id");
  var curso  = id
    ? cursos.find(function (c) { return c.id === id; })
    : null;

  // ── Curso no encontrado ──────────────────────────────────────────────
  if (!curso) {
    document.getElementById("cdBodyNotFound").hidden = false;
    return;
  }

  // ── Título de la pestaña ─────────────────────────────────────────────
  document.title = curso.title + " — Grupo Uniclima";

  // ── Topbar: pills de horas y nivel ──────────────────────────────────
  document.getElementById("cdHoursText").textContent =
    curso.hours + " horas";
  document.getElementById("cdLevelText").textContent =
    data.LEVEL_LABELS[curso.level] || curso.level;

  // ── Hero: título y subtítulo ─────────────────────────────────────────
  var heroSection = document.getElementById("cdHeroSection");
  document.getElementById("cdHeroTitle").textContent = curso.title;

  // Descripción corta para el subtítulo del hero (máx. 120 chars)
  var desc    = curso.description || "";
  var shortSub = desc.length > 120
    ? desc.slice(0, desc.lastIndexOf(" ", 120)) + "…"
    : desc;
  document.getElementById("cdHeroSub").textContent = shortSub;
  heroSection.hidden = false;

  // ── Media: icono SVG con gradiente de nivel ──────────────────────────
  var iconSvgHTML = data.ICONS[curso.icon] || data.ICONS.ac;
  var levelClass  = data.LEVEL_ICON_CLASS[curso.level] || "";

  var mediaEl = document.getElementById("cdMedia");
  // Aplica la clase de color de nivel como background vía la clase existente
  // (LEVEL_ICON_CLASS devuelve clases como "cd-nivel-basico", etc.
  //  Si no existen en styles.css usa el gradiente por defecto definido en curso.html)
  if (levelClass) mediaEl.classList.add(levelClass);
  mediaEl.classList.add("cd-media-gradient");

  var iconEl = document.getElementById("cdIcon");
  iconEl.innerHTML = iconSvgHTML;

  // ── Info: icono + título ─────────────────────────────────────────────
  var infoIconEl = document.getElementById("cdInfoIcon");
  infoIconEl.innerHTML = iconSvgHTML;

  document.getElementById("cdInfoTitle").textContent = curso.title;

  // ── Descripción completa ─────────────────────────────────────────────
  document.getElementById("cdDescription").textContent = desc;

  // ── Chips de palabras clave ──────────────────────────────────────────
  var chipsWrap = document.getElementById("cdChips");
  chipsWrap.innerHTML = (curso.tags || [])
    .map(function (t) {
      return '<span class="cd-chip">' + data.escapeHtml(t) + "</span>";
    })
    .join("");

  // ── Botones de acción ────────────────────────────────────────────────
  var isActive    = curso.activo !== false;
  var registerBtn = document.getElementById("cdRegisterBtn");
  var waBtn       = document.getElementById("cdWhatsappBtn");

  if (!isActive) {
    registerBtn.textContent = "Curso no disponible";
    registerBtn.classList.add("btn-disabled");
    registerBtn.setAttribute("aria-disabled", "true");
    registerBtn.removeAttribute("href");
    registerBtn.tabIndex = -1;

    var waMessageInactive =
      "Hola, quisiera saber cuándo vuelve a estar disponible el curso: " +
      curso.title;
    waBtn.textContent = "Consultar disponibilidad por WhatsApp";
    waBtn.href =
      waBtn.href.split("?")[0] +
      "?text=" +
      encodeURIComponent(waMessageInactive);
  } else {
    var waMessage = "Hola, quisiera registrarme en el curso: " + curso.title;
    waBtn.href =
      waBtn.href.split("?")[0] + "?text=" + encodeURIComponent(waMessage);

    registerBtn.href =
      registerBtn.href.split("?")[0] +
      "?id=" +
      encodeURIComponent(curso.id);
  }

  // ── Mostrar cuerpo ───────────────────────────────────────────────────
  document.getElementById("cdBodyContent").hidden = false;
})();
