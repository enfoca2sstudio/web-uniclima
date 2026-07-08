#!/usr/bin/env node
/**
 * download-csv-images.js
 * -----------------------
 * Descarga las imágenes referenciadas en un CSV de productos (columna
 * "Imágenes"/"Images"/"imagen", como las que exporta WooCommerce) a una
 * carpeta local (por defecto img/productos/), y genera una copia del CSV
 * con esa columna reemplazada por la ruta local — lista para volver a
 * importarla en admin-productos.html.
 *
 * Por qué un script y no un botón en el navegador:
 * - Un sitio estático (sin backend) no puede escribir archivos dentro de
 *   tu carpeta img/ desde el navegador; es una restricción de seguridad
 *   de todos los navegadores, no algo que se pueda evitar con más código.
 * - Guardar 100+ imágenes como base64 dentro de localStorage fácilmente
 *   supera el límite de espacio del navegador (~5-10MB).
 * Este script corre en tu computadora con Node.js, donde sí hay acceso
 * normal al sistema de archivos y a tu propio dominio.
 *
 * USO:
 *   node scripts/download-csv-images.js entrada.csv [carpeta-salida-img] [carpeta-imagenes]
 *
 * Ejemplos:
 *   node scripts/download-csv-images.js wc-product-export.csv
 *   node scripts/download-csv-images.js wc-product-export.csv wc-product-export-local.csv img/productos
 *
 * Requiere Node.js 18 o más reciente (usa fetch, incluido desde esa versión).
 */

const fs = require("fs");
const path = require("path");

const HEADER_ALIASES = {
  nombre: ["nombre", "name", "product name", "title", "nombre del producto"],
  sku: ["sku"],
  imagenes: [
    "imagenes",
    "imágenes",
    "image",
    "images",
    "image src",
    "imagen",
    "imagen destacada",
    "featured image",
  ],
};

function stripAccents(str) {
  return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function normalizeKey(str) {
  return stripAccents(str).trim().toLowerCase();
}

// Parser de CSV tipo RFC4180: soporta comillas, comas y saltos de línea
// dentro de campos entre comillas, y comillas escapadas ("").
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
      /* ignorar */
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
  return rows;
}

function csvCell(value) {
  var str = value == null ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function buildCSV(rows) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
}

function findColumn(header, field) {
  var aliases = HEADER_ALIASES[field];
  for (var i = 0; i < aliases.length; i++) {
    var idx = header.indexOf(aliases[i]);
    if (idx !== -1) return idx;
  }
  return -1;
}

function slugify(str) {
  return stripAccents(str)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function extFromUrl(url) {
  var match = /\.(jpg|jpeg|png|webp|gif|svg)(\?|#|$)/i.exec(url);
  return match ? match[1].toLowerCase() : "jpg";
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function main() {
  const [, , inputPath, outputPathArg, imgDirArg] = process.argv;

  if (!inputPath) {
    console.error(
      "Uso: node scripts/download-csv-images.js entrada.csv [salida.csv] [carpeta-imagenes]"
    );
    process.exit(1);
  }
  if (!fs.existsSync(inputPath)) {
    console.error("No se encontró el archivo:", inputPath);
    process.exit(1);
  }

  const imgDir = imgDirArg || "img/productos";
  const outputPath =
    outputPathArg ||
    inputPath.replace(/\.csv$/i, "") + "-imagenes-locales.csv";

  fs.mkdirSync(imgDir, { recursive: true });

  const text = fs.readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (!rows.length) {
    console.error("El CSV está vacío.");
    process.exit(1);
  }

  const header = rows[0].map(normalizeKey);
  const col = {
    nombre: findColumn(header, "nombre"),
    sku: findColumn(header, "sku"),
    imagenes: findColumn(header, "imagenes"),
  };

  if (col.imagenes === -1) {
    console.error(
      'No se encontró una columna de imágenes (se aceptan encabezados como "Imágenes", "Images" o "imagen").'
    );
    process.exit(1);
  }

  // Cache: mismo URL de imagen -> misma ruta local (varios productos
  // suelen repetir la misma imagen genérica).
  const urlToLocalPath = new Map();
  let downloaded = 0;
  let reused = 0;
  let failed = 0;
  const failedList = [];

  console.log("Filas a procesar:", rows.length - 1);
  console.log("Carpeta de imágenes:", imgDir);
  console.log("");

  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rawImages = (r[col.imagenes] || "").trim();
    if (!rawImages) continue;

    const urls = rawImages
      .split(/[|,]/)
      .map((u) => u.trim())
      .filter(Boolean);

    const localUrls = [];
    for (const url of urls) {
      if (urlToLocalPath.has(url)) {
        localUrls.push(urlToLocalPath.get(url));
        reused++;
        continue;
      }

      const nameHint =
        (col.sku !== -1 && r[col.sku]) ||
        (col.nombre !== -1 && r[col.nombre]) ||
        "producto-" + i;
      const ext = extFromUrl(url);
      let filename = slugify(nameHint) + "." + ext;
      let destPath = path.join(imgDir, filename);
      // Evita sobreescribir si dos productos distintos generan el mismo slug
      let counter = 2;
      while (
        fs.existsSync(destPath) &&
        !Array.from(urlToLocalPath.values()).includes(
          path.posix.join(imgDir, filename)
        )
      ) {
        filename = slugify(nameHint) + "-" + counter + "." + ext;
        destPath = path.join(imgDir, filename);
        counter++;
      }

      const localRelPath = path.posix.join(imgDir, filename);
      try {
        const bytes = await downloadImage(url, destPath);
        urlToLocalPath.set(url, localRelPath);
        localUrls.push(localRelPath);
        downloaded++;
        console.log(
          "✓ [" + i + "/" + (rows.length - 1) + "]",
          url,
          "->",
          localRelPath,
          "(" + Math.round(bytes / 1024) + " KB)"
        );
      } catch (err) {
        failed++;
        failedList.push({ row: i, url, error: err.message });
        localUrls.push(url); // deja la URL original si falla, para no perder el dato
        console.log(
          "✗ [" + i + "/" + (rows.length - 1) + "]",
          url,
          "-> ERROR:",
          err.message
        );
      }
    }

    r[col.imagenes] = localUrls.join(", ");
  }

  fs.writeFileSync(outputPath, buildCSV(rows), "utf8");

  console.log("");
  console.log("========================================");
  console.log("Listo.");
  console.log("  Imágenes descargadas:", downloaded);
  console.log("  Imágenes reutilizadas (URL repetida):", reused);
  console.log("  Fallidas:", failed);
  console.log("  CSV actualizado:", outputPath);
  console.log("========================================");
  if (failedList.length) {
    console.log("");
    console.log("Filas con errores (quedaron con la URL original, revisa a mano):");
    failedList.forEach((f) =>
      console.log("  Fila " + f.row + ": " + f.url + " — " + f.error)
    );
  }
  console.log("");
  console.log(
    "Siguiente paso: sube la carpeta '" +
      imgDir +
      "' a tu sitio junto con el resto de tus archivos, y en admin-productos.html importa '" +
      outputPath +
      "' (con 'Reemplazar todo el catálogo' o 'Agregar', según prefieras)."
  );
}

main().catch((err) => {
  console.error("Error inesperado:", err);
  process.exit(1);
});
