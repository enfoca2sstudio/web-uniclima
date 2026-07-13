/**
 * firebase-init.js
 * -----------------
 * Inicializa Firebase/Firestore y deja todo lo necesario colgado de
 * `window.UniclimaFirebase` para que el resto de los scripts del sitio
 * (que NO son módulos — son <script> normales, para no tener que
 * convertir todo el proyecto a módulos) puedan usar Firestore sin tener
 * que lidiar con imports.
 *
 * Este archivo SÍ es un módulo (<script type="module" src="js/firebase-init.js">)
 * porque el SDK de Firebase se reparte como paquete ES module vía CDN
 * (no hay paso de build en este sitio, así que se carga directo desde
 * gstatic.com — no hace falta `npm install`).
 *
 * IMPORTANTE — Reglas de seguridad de Firestore:
 * Este proyecto usa una contraseña simple en el panel de administración
 * (ver js/admin-productos.js) en vez de autenticación real de Firebase.
 * Eso significa que, tal como está configurado aquí, cualquiera que abra
 * las herramientas de desarrollador del navegador podría escribir en la
 * base de datos directamente, sin pasar por la contraseña. Para un uso
 * real recomendamos:
 *   1. En Firebase Console → Firestore Database → Reglas, usar reglas
 *      que permitan lectura pública pero escritura solo con Firebase
 *      Authentication (no incluido en esta versión).
 *   2. O, como mínimo, revisar el uso de la base de datos periódicamente.
 * Mientras tanto, estas reglas de ejemplo dejan leer a cualquiera y
 * escribir a cualquiera (funcional pero sin protección real):
 *
 *   rules_version = '2';
 *   service cloud.firestore {
 *     match /databases/{database}/documents {
 *       match /{document=**} {
 *         allow read, write: if true;
 *       }
 *     }
 *   }
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDDPIxNpUMHErHqPkkpPCHDrlU-9eNsOAE",
  authDomain: "web-uniclima.firebaseapp.com",
  projectId: "web-uniclima",
  storageBucket: "web-uniclima.firebasestorage.app",
  messagingSenderId: "697603890418",
  appId: "1:697603890418:web:9624de8df226481da7c46b",
  measurementId: "G-PT8MDK1994",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Trae todos los documentos de una colección como un array plano
 * (cada documento incluye su propio `id`).
 */
async function getAll(collectionName) {
  const snap = await getDocs(collection(db, collectionName));
  const out = [];
  snap.forEach((d) => out.push({ id: d.id, ...d.data() }));
  return out;
}

/** Crea o reemplaza un documento completo por su id. */
async function setItem(collectionName, id, data) {
  const clean = { ...data };
  delete clean.id; // el id vive como key del documento, no adentro
  await setDoc(doc(db, collectionName, id), clean);
}

/** Elimina un documento por id. */
async function deleteItem(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
}

/**
 * Si la colección está vacía (primera vez que corre el sitio contra
 * este proyecto de Firebase), la llena con los datos por defecto — así
 * no se pierde el catálogo original al migrar desde localStorage.
 */
async function seedIfEmpty(collectionName, defaultItems) {
  const snap = await getDocs(collection(db, collectionName));
  if (!snap.empty) return false;
  const batch = writeBatch(db);
  defaultItems.forEach((item) => {
    const clean = { ...item };
    delete clean.id;
    batch.set(doc(db, collectionName, item.id), clean);
  });
  await batch.commit();
  return true;
}

/**
 * Escribe muchos documentos de una sola vez (usa writeBatch de Firestore,
 * en tandas de 450 para no pasarse del límite de 500 operaciones por
 * batch). Cada item debe tener `id`.
 */
async function bulkSet(collectionName, items) {
  var CHUNK = 450;
  for (var i = 0; i < items.length; i += CHUNK) {
    var slice = items.slice(i, i + CHUNK);
    var batch = writeBatch(db);
    slice.forEach((item) => {
      const clean = { ...item };
      delete clean.id;
      batch.set(doc(db, collectionName, item.id), clean);
    });
    await batch.commit();
  }
}

/** Borra TODOS los documentos de una colección (en tandas de 450). */
async function clearCollection(collectionName) {
  var snap = await getDocs(collection(db, collectionName));
  var ids = [];
  snap.forEach((d) => ids.push(d.id));
  var CHUNK = 450;
  for (var i = 0; i < ids.length; i += CHUNK) {
    var slice = ids.slice(i, i + CHUNK);
    var batch = writeBatch(db);
    slice.forEach((id) => batch.delete(doc(db, collectionName, id)));
    await batch.commit();
  }
}

window.UniclimaFirebase = {
  db: db,
  getAll: getAll,
  setItem: setItem,
  deleteItem: deleteItem,
  seedIfEmpty: seedIfEmpty,
  bulkSet: bulkSet,
  clearCollection: clearCollection,
};

// Avisa a quien esté esperando (ver waitForFirebase en products-data.js /
// cursos-data.js) que ya se puede usar window.UniclimaFirebase.
window.dispatchEvent(new CustomEvent("uniclima-firebase-ready"));
