/**
 * proyectos-page.js
 * -----------------
 * Maneja las píldoras de rubro en la sección "Más proyectos" de
 * proyectos.html: al hacer clic en una, muestra la lista correspondiente
 * y oculta las demás. Es contenido estático (no depende de localStorage
 * ni de products-data.js).
 */
(function () {
  "use strict";

  var pills = document.querySelectorAll("#projectCategoryPills .filter-pill");
  if (!pills.length) return;

  pills.forEach(function (pill) {
    pill.addEventListener("click", function () {
      pills.forEach(function (p) {
        p.classList.remove("active");
      });
      pill.classList.add("active");

      var cat = pill.dataset.projectCat;
      document.querySelectorAll(".project-list").forEach(function (list) {
        list.hidden = list.id !== cat + "-list";
      });
    });
  });
})();
