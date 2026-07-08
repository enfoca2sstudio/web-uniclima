/**
 * admin-productos.js
 * -------------------
 * Lógica de la página admin-productos.html: pantalla de acceso, y el CRUD
 * (agregar / editar / eliminar / restaurar) del catálogo, que guarda en
 * localStorage a través de UniclimaProducts (ver products-data.js, que
 * debe cargarse antes que este archivo).
 *
 * OJO: la contraseña (ADMIN_PASSWORD) es solo para desalentar ediciones
 * accidentales, NO es seguridad real: el sitio es 100% estático y este
 * archivo es público, cualquiera puede leer la contraseña en el código
 * fuente y entrar directo a esta página. Si necesitas control de acceso
 * real, esta página debe vivir detrás de un login con backend (y no debe
 * enlazarse desde el menú público).
 */
(function () {
  "use strict";

  var data = window.UniclimaProducts;
  var products = data.load();

  // Cambia esta contraseña por la que prefieras.
  var ADMIN_PASSWORD = "uniclima2026";
  var SESSION_KEY = "uniclima-admin-unlocked";

  var gate = document.getElementById("adminGate");
  var gateForm = document.getElementById("gateForm");
  var gatePassword = document.getElementById("gatePassword");
  var gateError = document.getElementById("gateError");
  var content = document.getElementById("adminContent");

  var form = document.getElementById("adminForm");
  var idField = document.getElementById("prodId");
  var nameField = document.getElementById("prodName");
  var categoryField = document.getElementById("prodCategory");
  var specsField = document.getElementById("prodSpecs");
  var imageField = document.getElementById("prodImage");
  var submitBtn = document.getElementById("prodSubmitBtn");
  var cancelBtn = document.getElementById("prodCancelBtn");
  var adminList = document.getElementById("adminList");
  var adminCount = document.getElementById("adminCount");
  var resetBtn = document.getElementById("resetProductsBtn");
  var toast = document.getElementById("adminToast");
  var toastText = document.getElementById("adminToastText");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("show");
    }, 2600);
  }

  /* ---------- Pantalla de acceso ---------- */
  function unlock() {
    gate.hidden = true;
    content.hidden = false;
    renderAdminList();
  }

  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") unlock();
  } catch (err) {
    /* sessionStorage no disponible: se pedirá contraseña siempre */
  }

  gateForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (gatePassword.value === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch (err) {
        /* no pasa nada si no se puede recordar la sesión */
      }
      gateError.hidden = true;
      gatePassword.value = "";
      unlock();
    } else {
      gateError.hidden = false;
      gatePassword.select();
    }
  });

  /* ---------- Formulario agregar/editar ---------- */
  function resetForm() {
    form.reset();
    idField.value = "";
    submitBtn.textContent = "Agregar producto";
    cancelBtn.hidden = true;
  }

  function renderAdminList() {
    adminCount.textContent = products.length;
    adminList.innerHTML = products
      .map(function (p) {
        return (
          '<li class="admin-list-item" data-id="' +
          data.escapeHtml(p.id) +
          '">' +
          "<div><strong>" +
          data.escapeHtml(p.name) +
          "</strong><span>" +
          data.escapeHtml(data.CATEGORY_LABELS[p.category] || p.category) +
          " · " +
          data.escapeHtml(p.specs) +
          "</span></div>" +
          '<div class="admin-list-actions">' +
          '<button type="button" class="admin-edit" data-id="' +
          data.escapeHtml(p.id) +
          '">Editar</button>' +
          '<button type="button" class="admin-delete" data-id="' +
          data.escapeHtml(p.id) +
          '">Eliminar</button>' +
          "</div></li>"
        );
      })
      .join("");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = idField.value;
    var entry = {
      category: categoryField.value,
      name: nameField.value.trim(),
      specs: specsField.value.trim(),
      image: imageField.value.trim(),
    };
    if (!entry.name || !entry.specs) return;

    var wasEdit = !!id;
    if (id) {
      var idx = products.findIndex(function (p) {
        return p.id === id;
      });
      if (idx !== -1) products[idx] = Object.assign({ id: id }, entry);
    } else {
      entry.id = "p" + Date.now();
      products.push(entry);
    }
    data.save(products);
    renderAdminList();
    resetForm();
    showToast(
      wasEdit
        ? "Producto actualizado correctamente"
        : "Producto agregado correctamente"
    );
  });

  adminList.addEventListener("click", function (e) {
    var editBtn = e.target.closest(".admin-edit");
    var delBtn = e.target.closest(".admin-delete");

    if (editBtn) {
      var p = products.find(function (p) {
        return p.id === editBtn.dataset.id;
      });
      if (!p) return;
      idField.value = p.id;
      nameField.value = p.name;
      categoryField.value = p.category;
      specsField.value = p.specs;
      imageField.value = p.image || "";
      submitBtn.textContent = "Guardar cambios";
      cancelBtn.hidden = false;
      nameField.focus();
    }

    if (delBtn) {
      var target = products.find(function (p) {
        return p.id === delBtn.dataset.id;
      });
      if (!target) return;
      if (
        !confirm(
          '¿Eliminar "' + target.name + '"? Esta acción no se puede deshacer.'
        )
      )
        return;
      products = products.filter(function (p) {
        return p.id !== delBtn.dataset.id;
      });
      data.save(products);
      renderAdminList();
      if (idField.value === delBtn.dataset.id) resetForm();
      showToast('Producto "' + target.name + '" eliminado');
    }
  });

  cancelBtn.addEventListener("click", resetForm);

  resetBtn.addEventListener("click", function () {
    if (
      !confirm(
        "¿Restaurar el catálogo original? Se perderán los productos agregados/editados en este navegador."
      )
    )
      return;
    products = data.DEFAULT_PRODUCTS.slice();
    data.save(products);
    renderAdminList();
    resetForm();
    showToast("Catálogo restaurado a los valores originales");
  });
})();
