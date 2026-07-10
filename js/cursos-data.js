/**
 * cursos-data.js
 * --------------
 * Catálogo de cursos de la Academia Uniclima. Fuente de datos compartida
 * entre cursos.html (grilla pública) y admin-productos.html (panel de
 * administración, sección "Cursos"). Igual que products-data.js: guarda
 * en localStorage, y si no hay nada guardado aún usa DEFAULT_CURSOS (el
 * contenido real tomado de CORRECCIONES_WEB.docx, organizado por nivel
 * básico → avanzado).
 *
 * Las duraciones en horas de los cursos por defecto son ESTIMADAS (el
 * documento no especifica horas por curso).
 */
(function (global) {
  "use strict";

  var LEVEL_LABELS = {
    basico: "Básico",
    intermedio: "Intermedio",
    avanzado: "Avanzado",
  };

  var LEVEL_SECTION_TITLES = {
    basico: "Cursos Básicos",
    intermedio: "Cursos Intermedios",
    avanzado: "Cursos Avanzados",
  };

  // Palabras clave sugeridas en el documento para buscar cursos.
  var KEYWORDS = [
    "Chiller",
    "Agua helada",
    "VRF",
    "Básico",
    "Aire acondicionado",
    "Inverter",
    "Cargas térmicas",
    "Software",
  ];

  // Íconos (paths SVG) por temática, compartidos entre cursos-grid.js
  // (tarjetas) y curso-detail.js (ficha individual), para no duplicarlos.
  var ICONS = {
    ac: '<path d="M4 9h16M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2m-16 0v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M8 19l-1 2m9-2 1 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 12.5h.01M11 12.5h.01M15 12.5h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    electric:
      '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    snow: '<path d="M12 2v20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1M12 7l-2.5-1.5M12 7l2.5-1.5M12 17l-2.5 1.5M12 17l2.5 1.5M7 9.5 5 8M7 9.5l-.5 2.4M17 9.5 19 8M17 9.5l.5 2.4M7 14.5 5 16M7 14.5l-.5-2.4M17 14.5 19 16M17 14.5l.5-2.4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>',
    water:
      '<path d="M12 3c3 4.5 7 8.6 7 12.2A7 7 0 0 1 5 15.2C5 11.6 9 7.5 12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
    vrf: '<circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="6" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="6" cy="18" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="18" cy="18" r="2.4" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/><path d="M8.2 7.7 10 10.3M15.8 7.7 14 10.3M8.2 16.3 10 13.7M15.8 16.3 14 13.7" stroke="currentColor" stroke-width="1.4"/>',
    software:
      '<rect x="3" y="4" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
  };

  var LEVEL_ICON_CLASS = {
    basico: "cursos-icon-basico",
    intermedio: "cursos-icon-intermedio",
    avanzado: "cursos-icon-avanzado",
  };

  var CURSOS = [
    // ---------- Básico-Introductorio ----------
    {
      id: "c1",
      level: "basico",
      hours: 20,
      title: "Fundamentos de Aire Acondicionado (Teórico-Práctico)",
      description:
        "Principios físicos de la refrigeración y funcionamiento de los sistemas de aire acondicionado.",
      tags: ["Aire acondicionado", "Básico"],
      icon: "ac",
    },
    {
      id: "c2",
      level: "basico",
      hours: 16,
      title:
        "Electricidad Aplicada a Sistemas de Climatización: Nivel Introductorio",
      description:
        "Fundamentos eléctricos necesarios para instalar y diagnosticar equipos de climatización con seguridad.",
      tags: ["Básico"],
      icon: "electric",
    },
    {
      id: "c3",
      level: "basico",
      hours: 18,
      title: "Introducción a los Sistemas de Refrigeración Moderna",
      description:
        "Conceptos base de los ciclos de refrigeración y las tecnologías actuales del mercado.",
      tags: ["Básico"],
      icon: "snow",
    },
    {
      id: "c4",
      level: "basico",
      hours: 24,
      title:
        "Instalación y Puesta en Marcha de Equipos Split y Compactos (Tecnología MDV)",
      description:
        "Procedimiento completo de instalación y arranque de equipos split y compactos MDV.",
      tags: ["Aire acondicionado", "Inverter"],
      icon: "ac",
    },
    {
      id: "c5",
      level: "basico",
      hours: 24,
      title: "Diseño e Instalación de Sistemas de Agua Helada (Módulo I)",
      description:
        "Primeros pasos en el diseño e instalación de sistemas de agua helada (chillers).",
      tags: ["Chiller", "Agua helada"],
      icon: "water",
    },
    {
      id: "c6",
      level: "basico",
      hours: 20,
      title: "Principios Fundamentales de los Sistemas VRF",
      description:
        "Introducción a la tecnología VRF: componentes, funcionamiento y aplicaciones.",
      tags: ["VRF", "Básico"],
      icon: "vrf",
    },

    // ---------- Intermedios ----------
    {
      id: "c7",
      level: "intermedio",
      hours: 28,
      title: "Puesta en Marcha y Diagnóstico de Fallas en Sistemas VRF VC MAX",
      description:
        "Arranque y diagnóstico de fallas en sistemas VRF VC MAX.",
      tags: ["VRF"],
      icon: "vrf",
    },
    {
      id: "c8",
      level: "intermedio",
      hours: 28,
      title: "Operación y Mantenimiento de Sistemas de Agua Helada (Módulo II)",
      description:
        "Operación y mantenimiento preventivo/correctivo de sistemas de agua helada.",
      tags: ["Chiller", "Agua helada"],
      icon: "water",
    },
    {
      id: "c9",
      level: "intermedio",
      hours: 24,
      title:
        "Diseño, Cálculo y Construcción de Ductos con Asistencia de IA (Teórico-Práctico)",
      description:
        "Diseño y cálculo de ductería de aire apoyado en herramientas de inteligencia artificial.",
      tags: ["Software", "Cargas térmicas"],
      icon: "software",
    },
    {
      id: "c10",
      level: "intermedio",
      hours: 8,
      title:
        "Sistemas VRF: Impacto e Importancia en Edificaciones Modernas (Masterclass Live)",
      description:
        "Masterclass en vivo sobre el rol de los sistemas VRF en la edificación moderna.",
      tags: ["VRF"],
      icon: "vrf",
    },
    {
      id: "c11",
      level: "intermedio",
      hours: 16,
      title: "Nuevas Tendencias en Refrigerantes: Aplicaciones de R-32 y R-454B",
      description:
        "Panorama actual de los refrigerantes de nueva generación R-32 y R-454B.",
      tags: ["Inverter"],
      icon: "snow",
    },
    {
      id: "c12",
      level: "intermedio",
      hours: 20,
      title:
        "Gestión de Controles VRF y Compatibilidad con Termostatos Multimarca",
      description:
        "Configuración de controles VRF y su compatibilidad con termostatos de distintas marcas.",
      tags: ["VRF"],
      icon: "vrf",
    },
    {
      id: "c13",
      level: "intermedio",
      hours: 24,
      title: "Técnicas Avanzadas para la Detección de Fallas en Aire Acondicionado",
      description:
        "Metodologías de diagnóstico para identificar fallas comunes en sistemas de aire acondicionado.",
      tags: ["Aire acondicionado"],
      icon: "ac",
    },

    // ---------- Avanzados ----------
    {
      id: "c14",
      level: "avanzado",
      hours: 32,
      title: "Optimización y Selección de Sistemas VRF V8 mediante Software MDV",
      description:
        "Selección y optimización de sistemas VRF V8 utilizando el software de diseño MDV.",
      tags: ["VRF", "Software"],
      icon: "software",
    },
    {
      id: "c15",
      level: "avanzado",
      hours: 32,
      title:
        "Interpretación de Diagramas Eléctricos en Sistemas de Agua Helada (Módulo III)",
      description:
        "Lectura e interpretación avanzada de diagramas eléctricos en sistemas de agua helada.",
      tags: ["Chiller", "Agua helada"],
      icon: "electric",
    },
    {
      id: "c16",
      level: "avanzado",
      hours: 40,
      title:
        "Cálculo Especializado de Cargas Térmicas con Software HAP Carrier (Módulos I y II)",
      description:
        "Cálculo especializado de cargas térmicas utilizando el software HAP de Carrier.",
      tags: ["Cargas térmicas", "Software"],
      icon: "software",
    },
  ];

  var DEFAULT_CURSOS = CURSOS;

  var STORAGE_KEY = "uniclima-cursos";

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (err) {
      /* localStorage no disponible o dato corrupto: usar catálogo original */
    }
    return DEFAULT_CURSOS.slice();
  }

  function save(cursos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cursos));
      return true;
    } catch (err) {
      return false;
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  global.UniclimaCursos = {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_CURSOS: DEFAULT_CURSOS,
    KEYWORDS: KEYWORDS,
    LEVEL_LABELS: LEVEL_LABELS,
    LEVEL_SECTION_TITLES: LEVEL_SECTION_TITLES,
    ICONS: ICONS,
    LEVEL_ICON_CLASS: LEVEL_ICON_CLASS,
    load: load,
    save: save,
    escapeHtml: escapeHtml,
  };
})(window);
