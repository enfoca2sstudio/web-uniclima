/**
 * cursos-data.js
 * --------------
 * Catálogo de cursos de la Academia Uniclima (cursos.html). Contenido
 * real tomado de CORRECCIONES_WEB.docx: los 16 cursos organizados por
 * nivel (básico → avanzado), tal como se pidió ahí ("en lugar de colocar
 * por curso o módulo, colocarlo por sección de básico a avanzado").
 *
 * Las duraciones en horas son ESTIMADAS (el documento no especifica
 * horas por curso) — ajústalas a los valores reales cuando los tengas.
 * Las descripciones son un resumen breve a partir del título de cada
 * curso, ya que el documento tampoco incluye descripciones; el
 * documento pide además agregar "el contenido programático por cada
 * curso", que no está incluido aquí por no tener esa información.
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

  global.UniclimaCursos = {
    CURSOS: CURSOS,
    KEYWORDS: KEYWORDS,
    LEVEL_LABELS: LEVEL_LABELS,
    LEVEL_SECTION_TITLES: LEVEL_SECTION_TITLES,
  };
})(window);
