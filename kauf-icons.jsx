import React from 'react';
// Stabile Schnittstelle für das Illustrationspaket. SVGs sind rein dekorativ.
const PFADE = {
 'akademie.plaetze':'M5 8h38v32H5z M24 8v32 M5 18h7v12H5 M43 18h-7v12h7',
 'akademie.scouting':'M8 14h12v24H5V23z M28 14h12l3 9v15H28z M20 23h8 M10 14V8h7v6 M31 14V8h7v6',
 'akademie.internat':'M8 42V15L24 5l16 10v27z M19 42V30h10v12 M15 18h4v5h-4z M29 18h4v5h-4z',
 'akademie.medizin':'M17 6h14v11h11v14H31v11H17V31H6V17h11z',
 'akademie.lehre':'M24 12C17 7 10 7 5 10v29c7-3 13-2 19 2 6-4 12-5 19-2V10c-5-3-12-3-19 2v29',
 'akademie.buehne':'M14 6h20v13c0 15-20 15-20 0z M14 11H6v8c0 6 5 9 11 9 M34 11h8v8c0 6-5 9-11 9 M24 30v10 M15 42h18',
 'akademie.mental':'M14 41v-9L8 25l5-5v-4C13 0 38 2 38 19c0 6-4 10-8 13v9 M19 19l4 4 8-9',
 'akademie.analyse':'M5 8h38v27H5z M18 43h12 M24 35v8 M20 16l11 6-11 6z',
 'akademie.netzwerk':'M8 30l16-17 16 17 M8 30h32 M19 8h10v10H19z M3 30h10v10H3z M35 30h10v10H35z',
};
export function KaufIcon({id}) {
 return <svg className="kauf-icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d={PFADE[id] || 'M8 8h32v32H8z M16 24h16 M24 16v16'}/></svg>;
}
