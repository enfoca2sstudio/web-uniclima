/* ============================================================
   Conectar #themeToggleMobile (botón de tema dentro del menú móvil)
   ============================================================
   Pegar este bloque en js/main.js. Es independiente del listener que
   ya tiene #themeToggle (el del header) — no lo toca ni lo duplica —
   así que no hay riesgo de que un click alterne el tema dos veces.

   Usa exactamente el mismo mecanismo que ya usa el script inline del
   <head> para evitar parpadeos (FOUC): clase "theme-dark" en <html> +
   localStorage["uniclima-theme"]. Si tu toggle del header hace algo
   más además de eso (p. ej. despachar un evento personalizado), avisame
   y lo agrego acá también para que quede 100% en paralelo.
   ============================================================ */
(function () {
  var mobileBtn = document.getElementById("themeToggleMobile");
  if (!mobileBtn) return;

  mobileBtn.addEventListener("click", function () {
    var isDark = document.documentElement.classList.toggle("theme-dark");
    try {
      localStorage.setItem("uniclima-theme", isDark ? "dark" : "light");
    } catch (e) {
      /* localStorage no disponible: el cambio de tema sigue funcionando,
         solo no se recuerda entre visitas */
    }
    mobileBtn.classList.add("spin");
    mobileBtn.addEventListener(
      "animationend",
      function () {
        mobileBtn.classList.remove("spin");
      },
      { once: true },
    );
  });
})();
