/**
 * registro-curso.js
 * ------------------
 * Lógica de registro-curso.html: llena el selector de cursos desde
 * UniclimaCursos (ver cursos-data.js, que debe cargarse antes que este
 * archivo), pre-selecciona el curso si se llegó desde una ficha
 * (?id=... o ?curso=...), valida el formulario, guarda el registro en
 * localStorage (por si luego se quiere revisar) y abre WhatsApp con un
 * mensaje precompletado — el sitio es 100% estático, sin backend, así
 * que WhatsApp es el canal real por el que el registro llega al equipo.
 */
(function () {
  "use strict";

  var data = window.UniclimaCursos;
  var cursos = data.load();

  var WHATSAPP_NUMBER = "584140260505";
  var REGISTROS_KEY = "uniclima-registros-cursos";

  var form = document.getElementById("registroForm");
  var cursoSelect = document.getElementById("regCurso");
  var subtitle = document.getElementById("registroSubtitle");
  var successBox = document.getElementById("registroSuccess");
  var successText = document.getElementById("registroSuccessText");

  /* ---------- Llenar el selector de cursos, agrupado por nivel ---------- */
  var order = ["basico", "intermedio", "avanzado"];
  cursoSelect.innerHTML =
    '<option value="">Selecciona un curso…</option>' +
    order
      .map(function (level) {
        var opts = cursos
          .filter(function (c) {
            return c.level === level;
          })
          .map(function (c) {
            return (
              '<option value="' +
              data.escapeHtml(c.id) +
              '">' +
              data.escapeHtml(c.title) +
              "</option>"
            );
          })
          .join("");
        return (
          '<optgroup label="' +
          data.escapeHtml(data.LEVEL_SECTION_TITLES[level]) +
          '">' +
          opts +
          "</optgroup>"
        );
      })
      .join("");

  /* ---------- Preseleccionar curso si se llegó desde una ficha ---------- */
  var params = new URLSearchParams(window.location.search);
  var preId = params.get("id");
  var preTitle = params.get("curso");
  var preselected = null;

  if (preId) {
    preselected = cursos.find(function (c) {
      return c.id === preId;
    });
  } else if (preTitle) {
    preselected = cursos.find(function (c) {
      return c.title === preTitle;
    });
  }

  if (preselected) {
    cursoSelect.value = preselected.id;
    subtitle.textContent =
      'Complete sus datos para registrarse en "' +
      preselected.title +
      '".';
  }

  /* ---------- Envío del formulario ---------- */
  function loadRegistros() {
    try {
      var raw = localStorage.getItem(REGISTROS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  }
  function saveRegistro(registro) {
    try {
      var registros = loadRegistros();
      registros.push(registro);
      localStorage.setItem(REGISTROS_KEY, JSON.stringify(registros));
    } catch (err) {
      /* si localStorage falla, igual seguimos: el dato ya va por WhatsApp */
    }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var nombre = document.getElementById("regNombre").value.trim();
    var email = document.getElementById("regEmail").value.trim();
    var telefono = document.getElementById("regTelefono").value.trim();
    var cursoId = cursoSelect.value;
    var comentario = document.getElementById("regComentario").value.trim();

    if (!nombre || !email || !telefono || !cursoId) return;

    var curso = cursos.find(function (c) {
      return c.id === cursoId;
    });
    var cursoTitle = curso ? curso.title : cursoId;

    var registro = {
      id: "r" + Date.now(),
      fecha: new Date().toISOString(),
      nombre: nombre,
      email: email,
      telefono: telefono,
      cursoId: cursoId,
      cursoTitle: cursoTitle,
      comentario: comentario,
    };
    saveRegistro(registro);

    var lines = [
      "Hola, quiero registrarme en un curso de la Academia Uniclima:",
      "",
      "Curso: " + cursoTitle,
      "Nombre: " + nombre,
      "Correo: " + email,
      "Teléfono: " + telefono,
    ];
    if (comentario) lines.push("Comentario: " + comentario);
    var message = lines.join("\n");

    window.open(
      "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message),
      "_blank",
      "noopener,noreferrer"
    );

    form.hidden = true;
    successText.textContent =
      'Te contactaremos pronto para confirmar tu cupo en "' +
      cursoTitle +
      '". Si no se abrió WhatsApp automáticamente, escríbenos al +58 414-0260505.';
    successBox.hidden = false;
  });
})();
