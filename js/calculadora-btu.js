/**
 * calculadora-btu.js
 * -------------------
 * Lógica de la Calculadora de BTU (atencion-al-cliente/calculadora-btu.html).
 * Calcula la capacidad de aire acondicionado recomendada (en BTU/h) a partir
 * de las dimensiones del espacio, la cantidad de personas y de equipos
 * electrónicos.
 *
 * Fórmula (estimación estándar usada en la industria HVAC):
 *   1. Volumen del espacio (m³) = ancho × largo × alto
 *   2. Base: 65 BTU por cada m³ (equivale a ~600 BTU/m² con techo de 2.4m,
 *      el estándar habitual para espacios residenciales/comerciales)
 *   3. + 600 BTU por cada persona adicional a partir de la segunda
 *      (2 personas ya están contempladas en la base)
 *   4. + 400 BTU por cada equipo electrónico (computadoras, TV, etc.)
 *
 * Esto da una ESTIMACIÓN de referencia rápida, no un cálculo de carga
 * térmica certificado (para eso está el servicio de Asesoría Técnica).
 */
(function () {
  "use strict";

  var form = document.getElementById("btuForm");
  var resultBox = document.getElementById("btuResult");
  var resultValue = document.getElementById("btuResultValue");
  var resultHint = document.getElementById("btuResultHint");

  if (!form) return;

  var BTU_POR_M3 = 65;
  var BTU_POR_PERSONA_EXTRA = 600;
  var BTU_POR_EQUIPO = 400;
  var PERSONAS_INCLUIDAS_EN_BASE = 2;

  function numberOr(value, fallback) {
    var n = parseFloat(value);
    return isNaN(n) || n < 0 ? fallback : n;
  }

  function formatBTU(n) {
    return Math.round(n).toLocaleString("es-VE") + " BTU/h";
  }

  // Sugiere el tamaño de equipo comercial más cercano (en BTU) para dar
  // una referencia práctica además del número exacto calculado.
  var TAMANOS_COMERCIALES = [
    9000, 12000, 18000, 24000, 30000, 36000, 48000, 60000,
  ];
  function equipoSugerido(btu) {
    for (var i = 0; i < TAMANOS_COMERCIALES.length; i++) {
      if (btu <= TAMANOS_COMERCIALES[i]) return TAMANOS_COMERCIALES[i];
    }
    return null;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var ancho = numberOr(document.getElementById("btuAncho").value, 0);
    var largo = numberOr(document.getElementById("btuLargo").value, 0);
    var alto = numberOr(document.getElementById("btuAlto").value, 0);
    var personas = numberOr(document.getElementById("btuPersonas").value, 0);
    var equipos = numberOr(document.getElementById("btuEquipos").value, 0);

    if (ancho <= 0 || largo <= 0 || alto <= 0) {
      resultBox.hidden = false;
      resultValue.textContent = "—";
      resultHint.textContent =
        "Ingresa el ancho, largo y alto del espacio (deben ser mayores a 0).";
      resultBox.classList.add("btu-result-error");
      return;
    }
    resultBox.classList.remove("btu-result-error");

    var volumen = ancho * largo * alto;
    var base = volumen * BTU_POR_M3;
    var extraPersonas =
      Math.max(0, personas - PERSONAS_INCLUIDAS_EN_BASE) *
      BTU_POR_PERSONA_EXTRA;
    var extraEquipos = equipos * BTU_POR_EQUIPO;

    var total = base + extraPersonas + extraEquipos;
    var sugerido = equipoSugerido(total);

    resultBox.hidden = false;
    resultValue.textContent = formatBTU(total);
    resultHint.textContent = sugerido
      ? "Equivale aproximadamente a un equipo de " +
        sugerido.toLocaleString("es-VE") +
        " BTU/h."
      : "Para espacios de esta capacidad, contáctenos para una asesoría personalizada.";

    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  /* ---------- Modal de instrucciones de uso ---------- */
  var instructionsBtn = document.getElementById("btuInstructionsBtn");
  var instructionsOverlay = document.getElementById(
    "btuInstructionsOverlay"
  );
  var instructionsClose = document.getElementById("btuInstructionsClose");

  function openInstructions() {
    instructionsOverlay.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeInstructions() {
    instructionsOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  if (instructionsBtn && instructionsOverlay) {
    instructionsBtn.addEventListener("click", openInstructions);
    instructionsClose.addEventListener("click", closeInstructions);
    instructionsOverlay.addEventListener("click", function (e) {
      if (e.target === instructionsOverlay) closeInstructions();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !instructionsOverlay.hidden)
        closeInstructions();
    });
  }
})();
