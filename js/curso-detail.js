/**
 * curso-detail.js
 * ----------------
 * Lógica de curso.html: lee el parámetro ?id= de la URL, busca ese curso
 * en UniclimaCursos (ver cursos-data.js, que debe cargarse antes que
 * este archivo) y llena la ficha. Si no existe (id inválido, o el
 * catálogo aún no se cargó en este navegador), muestra un mensaje de
 * "no encontrado" con un enlace de vuelta a la academia.
 */
(function () {
  "use strict";

  var data = window.UniclimaCursos;
  var cursos = data.load();

  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");
  var curso = id
    ? cursos.find(function (c) {
        return c.id === id;
      })
    : null;

  var notFoundEl = document.getElementById("cursoNotFound");
  var detailEl = document.getElementById("cursoDetail");

  if (!curso) {
    notFoundEl.hidden = false;
    detailEl.hidden = true;
    return;
  }

  document.title = curso.title + " — Grupo Uniclima";

  var media = document.getElementById("cdMedia");
  var icon = document.getElementById("cdIcon");
  media.className =
    "curso-detail-media " + (data.LEVEL_ICON_CLASS[curso.level] || "");
  icon.innerHTML = data.ICONS[curso.icon] || data.ICONS.ac;

  document.getElementById("cdLevel").textContent =
    data.LEVEL_LABELS[curso.level] || curso.level;
  document.getElementById("cdHours").textContent = curso.hours + " horas";
  document.getElementById("cdTitle").textContent = curso.title;
  document.getElementById("cdDescription").textContent = curso.description;

  var chipsWrap = document.getElementById("cdChips");
  chipsWrap.innerHTML = (curso.tags || [])
    .map(function (t) {
      return '<span class="curso-chip">' + data.escapeHtml(t) + "</span>";
    })
    .join("");

  // Precompleta el mensaje de WhatsApp y el parámetro de registro con el
  // nombre del curso.
  var waBtn = document.getElementById("cdWhatsappBtn");
  var waMessage = "Hola, quisiera registrarme en el curso: " + curso.title;
  waBtn.href =
    waBtn.href.split("?")[0] + "?text=" + encodeURIComponent(waMessage);

  var registerBtn = document.getElementById("cdRegisterBtn");
  registerBtn.href =
    registerBtn.href.split("?")[0] + "?id=" + encodeURIComponent(curso.id);

  notFoundEl.hidden = true;
  detailEl.hidden = false;
})();
