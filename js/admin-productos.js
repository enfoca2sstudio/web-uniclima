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
  var subcategoryField = document.getElementById("prodSubcategory");
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

  /* ---------- Subcategoría dependiente de la categoría elegida ---------- */
  function populateSubcategoryOptions(selectedValue) {
    var subs = data.SUBCATEGORIES[categoryField.value] || [];
    subcategoryField.innerHTML =
      '<option value="">— Ninguna —</option>' +
      subs
        .map(function (s) {
          return (
            '<option value="' +
            data.escapeHtml(s) +
            '"' +
            (s === selectedValue ? " selected" : "") +
            ">" +
            data.escapeHtml(s) +
            "</option>"
          );
        })
        .join("");
  }
  categoryField.addEventListener("change", function () {
    populateSubcategoryOptions("");
  });
  populateSubcategoryOptions("");

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
    populateSubcategoryOptions("");
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
          (p.subcategory ? " · " + data.escapeHtml(p.subcategory) : "") +
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
      subcategory: subcategoryField.value,
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
      populateSubcategoryOptions(p.subcategory || "");
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
  var CSV_HEADERS = [
    "nombre",
    "categoria",
    "subcategoria",
    "especificaciones",
    "imagen",
  ];

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

  // Alias de encabezados: además de nuestras columnas propias, reconoce los
  // nombres típicos de exportaciones de WooCommerce, Shopify y similares.
  // Cada campo interno se resuelve probando esta lista en orden hasta
  // encontrar la primera columna presente en el archivo.
  var HEADER_ALIASES = {
    nombre: ["nombre", "name", "product name", "title", "nombre del producto"],
    categoria: [
      "categoria",
      "categorias",
      "category",
      "categories",
      "product category",
      "product categories",
    ],
    especificaciones: [
      "especificaciones",
      "specs",
      "specifications",
      "short description",
      "descripcion corta",
      "description",
      "descripcion",
      "detalles",
    ],
    imagen: [
      "imagen",
      "imagenes",
      "image",
      "images",
      "image src",
      "imagen destacada",
      "featured image",
    ],
    subcategoria: ["subcategoria", "subcategory"],
  };

  function findColumn(header, field) {
    var aliases = HEADER_ALIASES[field];
    for (var i = 0; i < aliases.length; i++) {
      var idx = header.indexOf(aliases[i]);
      if (idx !== -1) return idx;
    }
    return -1;
  }

  // Como findColumn, pero devuelve TODAS las columnas que matchean (en el
  // orden de prioridad de los alias), no solo la primera. Se usa para
  // especificaciones: así, si "short description" viene vacía en una fila
  // puntual, esa fila cae a "description" en vez de quedar en blanco.
  function findAllColumns(header, field) {
    var aliases = HEADER_ALIASES[field];
    var found = [];
    for (var i = 0; i < aliases.length; i++) {
      var idx = header.indexOf(aliases[i]);
      if (idx !== -1) found.push(idx);
    }
    return found;
  }

  // Quita etiquetas HTML (frecuentes en descripciones exportadas de
  // WooCommerce/Shopify, ej. "<p>Texto</p>") y decodifica entidades como
  // &nbsp;, dejando solo texto plano legible.
  function stripHtml(str) {
    var div = document.createElement("div");
    div.innerHTML = String(str || "");
    return (div.textContent || div.innerText || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Mapa por categoría de "subcategoría en cualquier forma" -> nombre
  // canónico exacto (el que se muestra en las píldoras/formulario).
  var SUBCATEGORY_LOOKUP = {};
  Object.keys(data.SUBCATEGORIES).forEach(function (catKey) {
    SUBCATEGORY_LOOKUP[catKey] = {};
    data.SUBCATEGORIES[catKey].forEach(function (sub) {
      SUBCATEGORY_LOOKUP[catKey][normalizeKey(sub)] = sub;
    });
  });

  // Los campos de categoría pueden traer varios valores separados por coma
  // (ej. "APLICADO, APLICADO > Chillers enfriados por agua") y jerarquías
  // tipo "Padre > Hijo > Nieto" (así exporta WooCommerce). De todos los
  // valores separados por coma nos quedamos con el que tenga MÁS niveles de
  // jerarquía (el más específico), y de ahí tomamos el 1er nivel como
  // categoría y el 2do como subcategoría (se ignoran niveles más profundos,
  // ej. la marca del compresor).
  function parseCategoryPath(raw) {
    var candidates = String(raw || "")
      .split(",")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    var best = null;
    var bestDepth = -1;
    candidates.forEach(function (c) {
      var depth = c.split(">").length;
      if (depth > bestDepth) {
        bestDepth = depth;
        best = c;
      }
    });
    if (!best) return { parent: "", child: "" };
    var parts = best.split(">").map(function (s) {
      return s.trim();
    });
    return { parent: parts[0] || "", child: parts[1] || "" };
  }

  function parseImportedCSV(text) {
    var rows = parseCSV(text);
    var result = { products: [], errors: [], warnings: [] };
    if (!rows.length) {
      result.errors.push("El archivo está vacío.");
      return result;
    }

    var header = rows[0].map(normalizeKey);
    var col = {
      nombre: findColumn(header, "nombre"),
      categoria: findColumn(header, "categoria"),
      subcategoria: findColumn(header, "subcategoria"),
      imagen: findColumn(header, "imagen"),
    };
    var specsCols = findAllColumns(header, "especificaciones");

    // Salvaguarda: en WooCommerce la columna "Type" (tipo de producto:
    // simple/variable/grouped/external/variation) a veces se confunde con
    // categoría. Si TODOS los valores de la columna detectada caen dentro
    // de ese set fijo, no es una columna de categorías real: la ignoramos.
    var WOO_PRODUCT_TYPES = [
      "simple",
      "variable",
      "grouped",
      "external",
      "variation",
      "",
    ];
    if (col.categoria !== -1) {
      var looksLikeProductType = rows.slice(1).every(function (r) {
        return (
          WOO_PRODUCT_TYPES.indexOf(normalizeKey(r[col.categoria] || "")) !==
          -1
        );
      });
      if (looksLikeProductType) col.categoria = -1;
    }

    if (col.nombre === -1) {
      result.errors.push(
        "No se encontró una columna de nombre del producto (se aceptan encabezados como " +
          '"nombre", "name" o "product name").'
      );
      return result;
    }

    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      var rowNum = i + 1; // +1 porque la fila 1 es el encabezado
      var name = stripHtml(r[col.nombre] || "").trim();
      var catPath =
        col.categoria !== -1
          ? parseCategoryPath(r[col.categoria])
          : { parent: "", child: "" };
      // Prueba cada columna candidata (ej. "short description", luego
      // "description") hasta encontrar la primera con contenido en esta fila.
      var specs = "";
      for (var s = 0; s < specsCols.length; s++) {
        var candidate = stripHtml(r[specsCols[s]] || "");
        if (candidate) {
          specs = candidate;
          break;
        }
      }
      var image =
        col.imagen !== -1
          ? String(r[col.imagen] || "")
              .split(/[|,]/)[0] // si trae varias imágenes, usamos la primera
              .trim()
          : "";

      if (!name) {
        result.errors.push("Fila " + rowNum + ": falta el nombre del producto.");
        continue;
      }
      if (!specs) specs = "Sin especificaciones";

      var category = catPath.parent
        ? CATEGORY_LOOKUP[normalizeKey(catPath.parent)]
        : null;
      if (!category) {
        category = "otros";
        result.warnings.push(
          "Fila " +
            rowNum +
            ' ("' +
            name +
            '"): categoría' +
            (catPath.parent ? ' "' + catPath.parent + '"' : "") +
            ' no reconocida, se asignó a "Otros". Puedes cambiarla luego con "Editar".'
        );
      }

      var subcategory = "";
      var explicitSub =
        col.subcategoria !== -1 ? String(r[col.subcategoria] || "").trim() : "";
      if (explicitSub && SUBCATEGORY_LOOKUP[category]) {
        subcategory = SUBCATEGORY_LOOKUP[category][normalizeKey(explicitSub)] || "";
      } else if (catPath.child && SUBCATEGORY_LOOKUP[category]) {
        subcategory =
          SUBCATEGORY_LOOKUP[category][normalizeKey(catPath.child)] || "";
      }

      result.products.push({
        id: "p" + Date.now() + "_" + i,
        category: category,
        subcategory: subcategory,
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

      var noteParts = [];
      if (parsed.errors.length)
        noteParts.push(parsed.errors.length + " fila(s) omitida(s) por error");
      if (parsed.warnings.length)
        noteParts.push(
          parsed.warnings.length + " fila(s) con categoría reasignada a \"Otros\""
        );

      csvSummary.textContent =
        parsed.products.length +
        " producto(s) listo(s) para importar" +
        (noteParts.length ? " — " + noteParts.join(", ") + "." : ".");

      var allNotes = parsed.errors.concat(parsed.warnings);
      if (allNotes.length) {
        csvErrors.hidden = false;
        var MAX_SHOWN = 25;
        var shown = allNotes.slice(0, MAX_SHOWN);
        var extra = allNotes.length - shown.length;
        csvErrors.innerHTML =
          shown
            .map(function (msg) {
              return "<li>" + data.escapeHtml(msg) + "</li>";
            })
            .join("") +
          (extra > 0
            ? "<li><em>…y " + extra + " fila(s) más con el mismo tipo de aviso.</em></li>"
            : "");
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
        "Chillers enfriados por agua",
        "75 – 525 Toneladas",
        "img/productos/16lj.jpg",
      ],
      ["Serie XYZ VRF", "vrf", "CARRIER", "10 – 20 Toneladas", ""],
    ];
    downloadFile("plantilla-productos.csv", buildCSV(sample));
  });

  csvExportBtn.addEventListener("click", function () {
    var rows = [CSV_HEADERS];
    products.forEach(function (p) {
      rows.push([p.name, p.category, p.subcategory || "", p.specs, p.image || ""]);
    });
    downloadFile("catalogo-productos.csv", buildCSV(rows));
  });

  /* ==================================================================
     PESTAÑAS (Productos / Cursos)
     ================================================================== */
  var tabs = document.querySelectorAll(".admin-tab");
  var panelProductos = document.getElementById("panelProductos");
  var panelCursos = document.getElementById("panelCursos");
  var backLink = document.getElementById("adminBackLink");

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) {
        t.classList.remove("active");
      });
      tab.classList.add("active");
      var panel = tab.dataset.panel;
      panelProductos.hidden = panel !== "productos";
      panelCursos.hidden = panel !== "cursos";
      if (panel === "cursos") {
        backLink.href = "cursos.html";
        backLink.textContent = "← Volver a la academia";
      } else {
        backLink.href = "productos.html";
        backLink.textContent = "← Volver al catálogo";
      }
    });
  });

  /* ==================================================================
     CURSOS (agregar / editar / eliminar / restaurar)
     ================================================================== */
  var cursosData = window.UniclimaCursos;
  var cursos = cursosData.load();

  var cursoForm = document.getElementById("cursoForm");
  var cursoIdField = document.getElementById("cursoId");
  var cursoTitleField = document.getElementById("cursoTitle");
  var cursoLevelField = document.getElementById("cursoLevel");
  var cursoHoursField = document.getElementById("cursoHours");
  var cursoDescField = document.getElementById("cursoDescription");
  var cursoIconField = document.getElementById("cursoIcon");
  var cursoKeywordsGroup = document.getElementById("cursoKeywordsGroup");
  var cursoSubmitBtn = document.getElementById("cursoSubmitBtn");
  var cursoCancelBtn = document.getElementById("cursoCancelBtn");
  var cursoList = document.getElementById("cursoList");
  var cursoCount = document.getElementById("cursoCount");
  var resetCursosBtn = document.getElementById("resetCursosBtn");

  function populateKeywordCheckboxes(checkedKeywords) {
    checkedKeywords = checkedKeywords || [];
    cursoKeywordsGroup.innerHTML = cursosData.KEYWORDS.map(function (kw) {
      var checked = checkedKeywords.indexOf(kw) !== -1 ? " checked" : "";
      return (
        "<label><input type=\"checkbox\" value=\"" +
        cursosData.escapeHtml(kw) +
        '"' +
        checked +
        " />" +
        cursosData.escapeHtml(kw) +
        "</label>"
      );
    }).join("");
  }

  function getCheckedKeywords() {
    return Array.prototype.map.call(
      cursoKeywordsGroup.querySelectorAll("input:checked"),
      function (input) {
        return input.value;
      }
    );
  }

  function resetCursoForm() {
    cursoForm.reset();
    cursoIdField.value = "";
    cursoSubmitBtn.textContent = "Agregar curso";
    cursoCancelBtn.hidden = true;
    populateKeywordCheckboxes([]);
  }

  function renderCursoList() {
    cursoCount.textContent = cursos.length;
    cursoList.innerHTML = cursos
      .map(function (c) {
        return (
          '<li class="admin-list-item" data-id="' +
          cursosData.escapeHtml(c.id) +
          '">' +
          "<div><strong>" +
          cursosData.escapeHtml(c.title) +
          "</strong><span>" +
          cursosData.escapeHtml(cursosData.LEVEL_LABELS[c.level] || c.level) +
          " · " +
          c.hours +
          " horas · " +
          cursosData.escapeHtml(c.description) +
          "</span></div>" +
          '<div class="admin-list-actions">' +
          '<button type="button" class="admin-edit" data-id="' +
          cursosData.escapeHtml(c.id) +
          '">Editar</button>' +
          '<button type="button" class="admin-delete" data-id="' +
          cursosData.escapeHtml(c.id) +
          '">Eliminar</button>' +
          "</div></li>"
        );
      })
      .join("");
  }

  populateKeywordCheckboxes([]);
  renderCursoList();

  cursoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var id = cursoIdField.value;
    var entry = {
      title: cursoTitleField.value.trim(),
      level: cursoLevelField.value,
      hours: parseInt(cursoHoursField.value, 10) || 0,
      description: cursoDescField.value.trim(),
      icon: cursoIconField.value,
      tags: getCheckedKeywords(),
    };
    if (!entry.title || !entry.description || !entry.hours) return;

    var wasEdit = !!id;
    if (id) {
      var idx = cursos.findIndex(function (c) {
        return c.id === id;
      });
      if (idx !== -1) cursos[idx] = Object.assign({ id: id }, entry);
    } else {
      entry.id = "c" + Date.now();
      cursos.push(entry);
    }
    cursosData.save(cursos);
    renderCursoList();
    resetCursoForm();
    showToast(
      wasEdit
        ? "Curso actualizado correctamente"
        : "Curso agregado correctamente"
    );
  });

  cursoList.addEventListener("click", function (e) {
    var editBtn = e.target.closest(".admin-edit");
    var delBtn = e.target.closest(".admin-delete");

    if (editBtn) {
      var c = cursos.find(function (c) {
        return c.id === editBtn.dataset.id;
      });
      if (!c) return;
      cursoIdField.value = c.id;
      cursoTitleField.value = c.title;
      cursoLevelField.value = c.level;
      cursoHoursField.value = c.hours;
      cursoDescField.value = c.description;
      cursoIconField.value = c.icon || "ac";
      populateKeywordCheckboxes(c.tags || []);
      cursoSubmitBtn.textContent = "Guardar cambios";
      cursoCancelBtn.hidden = false;
      cursoTitleField.focus();
    }

    if (delBtn) {
      var target = cursos.find(function (c) {
        return c.id === delBtn.dataset.id;
      });
      if (!target) return;
      if (
        !confirm(
          '¿Eliminar "' + target.title + '"? Esta acción no se puede deshacer.'
        )
      )
        return;
      cursos = cursos.filter(function (c) {
        return c.id !== delBtn.dataset.id;
      });
      cursosData.save(cursos);
      renderCursoList();
      if (cursoIdField.value === delBtn.dataset.id) resetCursoForm();
      showToast('Curso "' + target.title + '" eliminado');
    }
  });

  cursoCancelBtn.addEventListener("click", resetCursoForm);

  resetCursosBtn.addEventListener("click", function () {
    if (
      !confirm(
        "¿Restaurar los cursos originales? Se perderán los cursos agregados/editados en este navegador."
      )
    )
      return;
    cursos = cursosData.DEFAULT_CURSOS.slice();
    cursosData.save(cursos);
    renderCursoList();
    resetCursoForm();
    showToast("Cursos restaurados a los valores originales");
  });
})();
