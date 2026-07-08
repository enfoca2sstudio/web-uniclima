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

  /* ---------- Importar / exportar CSV ---------- */
  var CSV_HEADERS = ["nombre", "categoria", "especificaciones", "imagen"];

  var csvFile = document.getElementById("csvFile");
  var csvFileName = document.getElementById("csvFileName");
  var csvTemplateBtn = document.getElementById("csvTemplateBtn");
  var csvExportBtn = document.getElementById("csvExportBtn");
  var csvPreview = document.getElementById("csvPreview");
  var csvSummary = document.getElementById("csvSummary");
  var csvErrors = document.getElementById("csvErrors");
  var csvAppendBtn = document.getElementById("csvAppendBtn");
  var csvReplaceBtn = document.getElementById("csvReplaceBtn");
  var csvCancelBtn = document.getElementById("csvCancelBtn");

  var pendingImport = null; // productos parseados listos para aplicar

  function stripAccents(str) {
    return String(str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function normalizeKey(str) {
    return stripAccents(str).trim().toLowerCase();
  }

  // Mapa "categoria en cualquier forma" -> clave interna (aplicado, vrf...)
  var CATEGORY_LOOKUP = {};
  Object.keys(data.CATEGORY_LABELS).forEach(function (key) {
    CATEGORY_LOOKUP[normalizeKey(key)] = key;
    CATEGORY_LOOKUP[normalizeKey(data.CATEGORY_LABELS[key])] = key;
  });

  // Parser de CSV simple tipo RFC4180: soporta campos con comas y saltos de
  // línea si van entre comillas dobles, y comillas escapadas ("").
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var next = text[i + 1];
      if (inQuotes) {
        if (c === '"' && next === '"') {
          field += '"';
          i++;
        } else if (c === '"') {
          inQuotes = false;
        } else {
          field += c;
        }
      } else if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\r") {
        /* ignorar: el \n que sigue cierra la fila */
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
    if (field.length > 0 || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    // descarta filas totalmente vacías (ej. línea en blanco al final)
    return rows.filter(function (r) {
      return r.some(function (cell) {
        return cell.trim() !== "";
      });
    });
  }

  function csvCell(value) {
    var str = value == null ? "" : String(value);
    if (/[",\n]/.test(str)) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function buildCSV(rows) {
    return rows
      .map(function (row) {
        return row.map(csvCell).join(",");
      })
      .join("\r\n");
  }

  function downloadFile(filename, content, mime) {
    var blob = new Blob([content], { type: mime || "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  function parseImportedCSV(text) {
    var rows = parseCSV(text);
    var result = { products: [], errors: [] };
    if (!rows.length) {
      result.errors.push("El archivo está vacío.");
      return result;
    }

    var header = rows[0].map(normalizeKey);
    var col = {
      nombre: header.indexOf("nombre"),
      categoria: header.indexOf("categoria"),
      especificaciones: header.indexOf("especificaciones"),
      imagen: header.indexOf("imagen"),
    };
    if (col.nombre === -1 || col.categoria === -1 || col.especificaciones === -1) {
      result.errors.push(
        "Encabezado inválido. Se esperaban las columnas: " +
          CSV_HEADERS.join(", ") +
          " (imagen es opcional)."
      );
      return result;
    }

    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      var rowNum = i + 1; // +1 porque la fila 1 es el encabezado
      var name = (r[col.nombre] || "").trim();
      var categoryRaw = (r[col.categoria] || "").trim();
      var specs = (r[col.especificaciones] || "").trim();
      var image = col.imagen !== -1 ? (r[col.imagen] || "").trim() : "";

      if (!name || !categoryRaw || !specs) {
        result.errors.push(
          "Fila " + rowNum + ": faltan datos obligatorios (nombre, categoría o especificaciones)."
        );
        continue;
      }
      var category = CATEGORY_LOOKUP[normalizeKey(categoryRaw)];
      if (!category) {
        result.errors.push(
          "Fila " +
            rowNum +
            ': categoría "' +
            categoryRaw +
            '" no reconocida (usa una de: ' +
            Object.keys(data.CATEGORY_LABELS).join(", ") +
            ")."
        );
        continue;
      }
      result.products.push({
        id: "p" + Date.now() + "_" + i,
        category: category,
        name: name,
        specs: specs,
        image: image,
      });
    }
    return result;
  }

  function resetCsvUI() {
    csvFile.value = "";
    csvFileName.hidden = true;
    csvPreview.hidden = true;
    csvErrors.hidden = true;
    csvErrors.innerHTML = "";
    pendingImport = null;
  }

  csvFile.addEventListener("change", function () {
    var file = csvFile.files && csvFile.files[0];
    if (!file) return;
    csvFileName.hidden = false;
    csvFileName.textContent = "Archivo elegido: " + file.name;

    var reader = new FileReader();
    reader.onload = function () {
      var parsed = parseImportedCSV(String(reader.result));
      pendingImport = parsed.products;
      csvPreview.hidden = false;

      csvSummary.textContent =
        parsed.products.length +
        " producto(s) válido(s) encontrados en el archivo" +
        (parsed.errors.length
          ? ", " + parsed.errors.length + " fila(s) con problemas (ver abajo)."
          : ".");

      if (parsed.errors.length) {
        csvErrors.hidden = false;
        csvErrors.innerHTML = parsed.errors
          .map(function (msg) {
            return "<li>" + data.escapeHtml(msg) + "</li>";
          })
          .join("");
      } else {
        csvErrors.hidden = true;
        csvErrors.innerHTML = "";
      }

      var noValidProducts = parsed.products.length === 0;
      csvAppendBtn.disabled = noValidProducts;
      csvReplaceBtn.disabled = noValidProducts;
    };
    reader.onerror = function () {
      csvPreview.hidden = false;
      csvSummary.textContent = "No se pudo leer el archivo.";
      csvErrors.hidden = false;
      csvErrors.innerHTML = "<li>Error de lectura del archivo.</li>";
      pendingImport = null;
    };
    reader.readAsText(file, "UTF-8");
  });

  csvAppendBtn.addEventListener("click", function () {
    if (!pendingImport || !pendingImport.length) return;
    products = products.concat(pendingImport);
    data.save(products);
    renderAdminList();
    showToast(pendingImport.length + " producto(s) agregado(s) desde el CSV");
    resetCsvUI();
  });

  csvReplaceBtn.addEventListener("click", function () {
    if (!pendingImport || !pendingImport.length) return;
    if (
      !confirm(
        "¿Reemplazar TODO el catálogo actual (" +
          products.length +
          " producto(s)) por los " +
          pendingImport.length +
          " del CSV? Esta acción no se puede deshacer."
      )
    )
      return;
    products = pendingImport;
    data.save(products);
    renderAdminList();
    showToast("Catálogo reemplazado con " + pendingImport.length + " producto(s) del CSV");
    resetCsvUI();
  });

  csvCancelBtn.addEventListener("click", resetCsvUI);

  csvTemplateBtn.addEventListener("click", function () {
    var sample = [
      CSV_HEADERS,
      [
        "Serie 16LJ",
        "aplicado",
        "75 – 525 Toneladas",
        "img/productos/16lj.jpg",
      ],
      ["Serie XYZ VRF", "vrf", "10 – 20 Toneladas", ""],
    ];
    downloadFile("plantilla-productos.csv", buildCSV(sample));
  });

  csvExportBtn.addEventListener("click", function () {
    var rows = [CSV_HEADERS];
    products.forEach(function (p) {
      rows.push([p.name, p.category, p.specs, p.image || ""]);
    });
    downloadFile("catalogo-productos.csv", buildCSV(rows));
  });
})();
