import React from 'react';

// 20 eigenstaendige Kaufmotive plus neutraler Fallback. Die Datenform bleibt
// bewusst schlicht: Das Vorschauwerkzeug liest exakt dieselbe Geometrie, damit
// Sichtpruefung und App nicht mit zwei voneinander abweichenden Icon-Saetzen arbeiten.
const ICON_DATA = /* KAUF_ICON_DATA_START */ {
  "motive": {
    "akademie.plaetze": [
      {
        "t": "rect",
        "x": 5.5,
        "y": 8.5,
        "width": 37,
        "height": 31,
        "rx": 3
      },
      {
        "t": "line",
        "x1": 24,
        "y1": 9,
        "x2": 24,
        "y2": 39
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 24,
        "r": 5,
        "fill": "#829178"
      },
      {
        "t": "rect",
        "x": 5.5,
        "y": 17,
        "width": 5,
        "height": 14,
        "rx": 1.5
      },
      {
        "t": "rect",
        "x": 37.5,
        "y": 17,
        "width": 5,
        "height": 14,
        "rx": 1.5
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 24,
        "r": 1.2,
        "fill": "currentColor",
        "stroke": "none"
      }
    ],
    "akademie.scouting": [
      {
        "t": "path",
        "d": "M10 20l4-8h7l3 8 3-8h7l4 8v8H10z",
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 14.5,
        "cy": 31,
        "r": 6.5
      },
      {
        "t": "circle",
        "cx": 33.5,
        "cy": 31,
        "r": 6.5
      },
      {
        "t": "path",
        "d": "M20 30c1.5-2 6.5-2 8 0"
      },
      {
        "t": "line",
        "x1": 24,
        "y1": 20,
        "x2": 24,
        "y2": 26
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 13,
        "r": 2.2,
        "fill": "currentColor"
      }
    ],
    "akademie.internat": [
      {
        "t": "line",
        "x1": 8,
        "y1": 10,
        "x2": 8,
        "y2": 40
      },
      {
        "t": "line",
        "x1": 40,
        "y1": 10,
        "x2": 40,
        "y2": 40
      },
      {
        "t": "rect",
        "x": 9,
        "y": 13,
        "width": 30,
        "height": 8,
        "rx": 2,
        "fill": "#829178"
      },
      {
        "t": "rect",
        "x": 9,
        "y": 28,
        "width": 30,
        "height": 8,
        "rx": 2,
        "fill": "#829178"
      },
      {
        "t": "rect",
        "x": 12,
        "y": 15,
        "width": 7,
        "height": 4,
        "rx": 1,
        "fill": "currentColor"
      },
      {
        "t": "rect",
        "x": 12,
        "y": 30,
        "width": 7,
        "height": 4,
        "rx": 1,
        "fill": "currentColor"
      },
      {
        "t": "line",
        "x1": 34,
        "y1": 21,
        "x2": 34,
        "y2": 28
      },
      {
        "t": "line",
        "x1": 29,
        "y1": 22.5,
        "x2": 39,
        "y2": 22.5
      },
      {
        "t": "line",
        "x1": 29,
        "y1": 25.5,
        "x2": 39,
        "y2": 25.5
      }
    ],
    "akademie.medizin": [
      {
        "t": "rect",
        "x": 7,
        "y": 15,
        "width": 34,
        "height": 25,
        "rx": 4,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M17 15v-4c0-2 1.5-3 3.5-3h7c2 0 3.5 1 3.5 3v4"
      },
      {
        "t": "rect",
        "x": 21,
        "y": 21,
        "width": 6,
        "height": 13,
        "rx": 1,
        "fill": "#A66B59",
        "stroke": "none"
      },
      {
        "t": "rect",
        "x": 17.5,
        "y": 24.5,
        "width": 13,
        "height": 6,
        "rx": 1,
        "fill": "#A66B59",
        "stroke": "none"
      }
    ],
    "akademie.lehre": [
      {
        "t": "path",
        "d": "M5.5 11c7-3 13-2 18.5 2v27c-5.5-4-11.5-5-18.5-2z",
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M42.5 11c-7-3-13-2-18.5 2v27c5.5-4 11.5-5 18.5-2z",
        "fill": "#829178"
      },
      {
        "t": "line",
        "x1": 24,
        "y1": 13,
        "x2": 24,
        "y2": 40
      },
      {
        "t": "path",
        "d": "M32 10l5 5-12 12-6 1 1-6z",
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 31,
        "y1": 16,
        "x2": 34,
        "y2": 19
      }
    ],
    "akademie.buehne": [
      {
        "t": "rect",
        "x": 7,
        "y": 31,
        "width": 11,
        "height": 10,
        "rx": 1,
        "fill": "#829178"
      },
      {
        "t": "rect",
        "x": 18.5,
        "y": 25,
        "width": 11,
        "height": 16,
        "rx": 1,
        "fill": "#B0915B"
      },
      {
        "t": "rect",
        "x": 30,
        "y": 34,
        "width": 11,
        "height": 7,
        "rx": 1,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M24 7l2.3 4.8 5.3.8-3.8 3.7.9 5.2-4.7-2.5-4.7 2.5.9-5.2-3.8-3.7 5.3-.8z",
        "fill": "#A66B59"
      },
      {
        "t": "line",
        "x1": 8,
        "y1": 14,
        "x2": 15,
        "y2": 19
      },
      {
        "t": "line",
        "x1": 40,
        "y1": 14,
        "x2": 33,
        "y2": 19
      }
    ],
    "akademie.mental": [
      {
        "t": "path",
        "d": "M31 40H20v-7c-5-2-8-7-8-13 0-8 6-14 14-14 7 0 12 4 13 10l-3 4 3 3-4 3v7h-4"
      },
      {
        "t": "circle",
        "cx": 23,
        "cy": 16,
        "r": 3.2,
        "fill": "#829178"
      },
      {
        "t": "circle",
        "cx": 28,
        "cy": 18,
        "r": 3.2,
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 23.5,
        "cy": 22,
        "r": 3.2,
        "fill": "#A66B59"
      },
      {
        "t": "path",
        "d": "M19 29c3 2 7 2 10 0"
      }
    ],
    "akademie.analyse": [
      {
        "t": "rect",
        "x": 6,
        "y": 8,
        "width": 36,
        "height": 31,
        "rx": 3
      },
      {
        "t": "line",
        "x1": 11,
        "y1": 34,
        "x2": 11,
        "y2": 15
      },
      {
        "t": "line",
        "x1": 11,
        "y1": 34,
        "x2": 37,
        "y2": 34
      },
      {
        "t": "polyline",
        "points": "13,30 20,24 25,27 34,17 38,20",
        "stroke": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 20,
        "cy": 24,
        "r": 2,
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 34,
        "cy": 17,
        "r": 2,
        "fill": "#A66B59"
      }
    ],
    "akademie.netzwerk": [
      {
        "t": "line",
        "x1": 24,
        "y1": 12,
        "x2": 11,
        "y2": 33
      },
      {
        "t": "line",
        "x1": 24,
        "y1": 12,
        "x2": 37,
        "y2": 33
      },
      {
        "t": "line",
        "x1": 11,
        "y1": 33,
        "x2": 37,
        "y2": 33
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 11,
        "r": 5,
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 10,
        "cy": 34,
        "r": 5,
        "fill": "#829178"
      },
      {
        "t": "circle",
        "cx": 38,
        "cy": 34,
        "r": 5,
        "fill": "#A66B59"
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 27,
        "r": 3.5,
        "fill": "currentColor"
      },
      {
        "t": "line",
        "x1": 24,
        "y1": 23.5,
        "x2": 24,
        "y2": 16
      }
    ],
    "verein.stadion": [
      {
        "t": "path",
        "d": "M6 23c4-8 12-12 18-12s14 4 18 12v12c-5 4-11 6-18 6S11 39 6 35z",
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M11 24c4-4 8-6 13-6s9 2 13 6v7c-4 3-8 4-13 4s-9-1-13-4z"
      },
      {
        "t": "rect",
        "x": 19,
        "y": 27,
        "width": 10,
        "height": 6,
        "rx": 1,
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 6,
        "y1": 22,
        "x2": 6,
        "y2": 8
      },
      {
        "t": "line",
        "x1": 42,
        "y1": 22,
        "x2": 42,
        "y2": 8
      },
      {
        "t": "line",
        "x1": 4,
        "y1": 8,
        "x2": 10,
        "y2": 8
      },
      {
        "t": "line",
        "x1": 38,
        "y1": 8,
        "x2": 44,
        "y2": 8
      },
      {
        "t": "line",
        "x1": 6,
        "y1": 11,
        "x2": 10,
        "y2": 14
      },
      {
        "t": "line",
        "x1": 42,
        "y1": 11,
        "x2": 38,
        "y2": 14
      }
    ],
    "verein.gastro": [
      {
        "t": "path",
        "d": "M9 29h30c-1-8-7-14-15-14S10 21 9 29z",
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 6,
        "y1": 30,
        "x2": 42,
        "y2": 30
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 35,
        "x2": 36,
        "y2": 35
      },
      {
        "t": "circle",
        "cx": 24,
        "cy": 12,
        "r": 2.5,
        "fill": "#A66B59"
      },
      {
        "t": "path",
        "d": "M16 11c-2-3 1-5 0-8 M24 9c-2-3 1-5 0-8 M32 11c-2-3 1-5 0-8"
      }
    ],
    "verein.sortiment": [
      {
        "t": "path",
        "d": "M16 9l8 4 8-4 10 7-5 8-5-3v19H16V21l-5 3-5-8z",
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M20 12c1 4 7 4 8 0"
      },
      {
        "t": "rect",
        "x": 18,
        "y": 25,
        "width": 12,
        "height": 5,
        "rx": 1,
        "fill": "#B0915B",
        "stroke": "none"
      }
    ],
    "verein.reichweite": [
      {
        "t": "path",
        "d": "M7 21h10l17-9v24l-17-9H7z",
        "fill": "#B0915B"
      },
      {
        "t": "path",
        "d": "M17 27l4 12h-7l-4-12"
      },
      {
        "t": "path",
        "d": "M38 17c3 2 4 4 4 7s-1 5-4 7"
      },
      {
        "t": "path",
        "d": "M41 12c5 3 7 7 7 12s-2 9-7 12"
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 24,
        "r": 2,
        "fill": "#A66B59",
        "stroke": "none"
      }
    ],
    "verein.training": [
      {
        "t": "path",
        "d": "M8 37l7-24h10l7 24z",
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 11,
        "y1": 28,
        "x2": 29,
        "y2": 28
      },
      {
        "t": "circle",
        "cx": 36,
        "cy": 31,
        "r": 8,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M36 23l3 3-1 4-4 1-3-3 1-4z"
      },
      {
        "t": "line",
        "x1": 36,
        "y1": 31,
        "x2": 40,
        "y2": 36
      },
      {
        "t": "line",
        "x1": 34,
        "y1": 31,
        "x2": 29,
        "y2": 34
      }
    ],
    "verein.medizin": [
      {
        "t": "rect",
        "x": 7,
        "y": 25,
        "width": 34,
        "height": 8,
        "rx": 2,
        "fill": "#829178"
      },
      {
        "t": "line",
        "x1": 11,
        "y1": 33,
        "x2": 9,
        "y2": 41
      },
      {
        "t": "line",
        "x1": 37,
        "y1": 33,
        "x2": 39,
        "y2": 41
      },
      {
        "t": "circle",
        "cx": 16,
        "cy": 19,
        "r": 4,
        "fill": "#B0915B"
      },
      {
        "t": "path",
        "d": "M20 22h10c3 0 5 2 5 5"
      },
      {
        "t": "polyline",
        "points": "25,17 28,17 30,13 33,22 35,18 41,18",
        "stroke": "#A66B59"
      }
    ],
    "vermoegen.wohnen": [
      {
        "t": "path",
        "d": "M6 23L24 8l18 15v18H6z",
        "fill": "#829178"
      },
      {
        "t": "rect",
        "x": 20,
        "y": 28,
        "width": 8,
        "height": 13,
        "rx": 1,
        "fill": "#B0915B"
      },
      {
        "t": "rect",
        "x": 11,
        "y": 26,
        "width": 6,
        "height": 6,
        "rx": 1,
        "fill": "currentColor"
      },
      {
        "t": "rect",
        "x": 31,
        "y": 26,
        "width": 6,
        "height": 6,
        "rx": 1,
        "fill": "currentColor"
      },
      {
        "t": "circle",
        "cx": 25.5,
        "cy": 35,
        "r": 1,
        "fill": "#A66B59",
        "stroke": "none"
      }
    ],
    "vermoegen.fahrzeug": [
      {
        "t": "path",
        "d": "M7 28l4-9c1-3 3-4 6-4h14c3 0 5 1 7 4l4 9v8H7z",
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M14 21h20l3 7H11z",
        "fill": "currentColor"
      },
      {
        "t": "circle",
        "cx": 15,
        "cy": 36,
        "r": 4,
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 34,
        "cy": 36,
        "r": 4,
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 10,
        "y1": 29,
        "x2": 14,
        "y2": 29
      },
      {
        "t": "line",
        "x1": 34,
        "y1": 29,
        "x2": 38,
        "y2": 29
      }
    ],
    "vermoegen.umfeld": [
      {
        "t": "circle",
        "cx": 24,
        "cy": 15,
        "r": 5,
        "fill": "#B0915B"
      },
      {
        "t": "circle",
        "cx": 12,
        "cy": 20,
        "r": 4,
        "fill": "#829178"
      },
      {
        "t": "circle",
        "cx": 36,
        "cy": 20,
        "r": 4,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M15 39c0-7 4-12 9-12s9 5 9 12"
      },
      {
        "t": "path",
        "d": "M4 38c0-6 3-10 8-10 2 0 4 1 5 2"
      },
      {
        "t": "path",
        "d": "M44 38c0-6-3-10-8-10-2 0-4 1-5 2"
      },
      {
        "t": "path",
        "d": "M24 34c-4-4-8-1-6 3 1 2 4 4 6 6 2-2 5-4 6-6 2-4-2-7-6-3z",
        "fill": "#A66B59"
      }
    ],
    "vermoegen.geschaeft": [
      {
        "t": "rect",
        "x": 8,
        "y": 18,
        "width": 32,
        "height": 23,
        "rx": 2,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M7 18l4-9h26l4 9z",
        "fill": "#B0915B"
      },
      {
        "t": "line",
        "x1": 12,
        "y1": 18,
        "x2": 12,
        "y2": 23
      },
      {
        "t": "line",
        "x1": 20,
        "y1": 18,
        "x2": 20,
        "y2": 23
      },
      {
        "t": "line",
        "x1": 28,
        "y1": 18,
        "x2": 28,
        "y2": 23
      },
      {
        "t": "line",
        "x1": 36,
        "y1": 18,
        "x2": 36,
        "y2": 23
      },
      {
        "t": "rect",
        "x": 13,
        "y": 28,
        "width": 9,
        "height": 13,
        "rx": 1,
        "fill": "currentColor"
      },
      {
        "t": "rect",
        "x": 27,
        "y": 28,
        "width": 8,
        "height": 7,
        "rx": 1,
        "fill": "currentColor"
      }
    ],
    "vermoegen.vermaechtnis": [
      {
        "t": "rect",
        "x": 18,
        "y": 20,
        "width": 12,
        "height": 17,
        "rx": 1,
        "fill": "#B0915B"
      },
      {
        "t": "rect",
        "x": 14,
        "y": 37,
        "width": 20,
        "height": 5,
        "rx": 1,
        "fill": "#829178"
      },
      {
        "t": "path",
        "d": "M24 7l2 4 4.5.7-3.2 3.2.8 4.6-4.1-2.2-4.1 2.2.8-4.6-3.2-3.2 4.5-.7z",
        "fill": "#A66B59"
      },
      {
        "t": "path",
        "d": "M14 30c-5-4-7-9-6-15 M11 27l-5-1 M10 22l-4-3 M10 17l-2-4"
      },
      {
        "t": "path",
        "d": "M34 30c5-4 7-9 6-15 M37 27l5-1 M38 22l4-3 M38 17l2-4"
      }
    ]
  },
  "fallback": [
    {
      "t": "rect",
      "x": 8,
      "y": 8,
      "width": 32,
      "height": 32,
      "rx": 5,
      "fill": "#829178"
    },
    {
      "t": "path",
      "d": "M24 14l10 10-10 10-10-10z",
      "fill": "none"
    },
    {
      "t": "circle",
      "cx": 24,
      "cy": 24,
      "r": 2.3,
      "fill": "currentColor",
      "stroke": "none"
    }
  ]
} /* KAUF_ICON_DATA_END */;

function Form({ t, ...props }, key) {
  return React.createElement(t, { key, ...props });
}

// Stabile Schnittstelle fuer Kauf- und Ausbaukacheln. SVGs sind rein dekorativ.
export function KaufIcon({ id }) {
  const formen = ICON_DATA.motive[id] || ICON_DATA.fallback;
  return <svg
    className="kauf-icon"
    viewBox="0 0 48 48"
    aria-hidden="true"
    focusable="false"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {formen.map(Form)}
    </g>
  </svg>;
}
