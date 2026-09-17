// CHAR-FIX-03: Gemeinsame Vertikalanker fuer Nase, Mund und Bart.
//
// Kopfhoehen variieren inzwischen deutlich (Kinn 64–73). Die alten festen
// Abstaende wurden jedoch fuer einen ca. 70er Kopf gezeichnet. Dadurch konnte
// dieselbe Nase auf einem kurzen Kopf bis in den Mund reichen und ein Bart,
// der nur aus der Kinnhoehe abgeleitet wurde, auf Nase/Lippen rutschen.
// Diese Datei enthaelt bewusst nur reine Geometrie. Gespeicherte IDs bleiben
// unveraendert; Renderer teilen lediglich dieselben Anker.
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
const num=(value,fallback)=>Number.isFinite(Number(value))?Number(value):fallback;

// Unterkante der jeweiligen Nasenform im korrigierten Standardkopf (kinn≈70).
// Werte sind Sicherheitsgrenzen fuer den Bartanker, keine neue ID-Semantik.
const NASEN_UNTERKANTE=[57,57.2,56.8,58,57,57.4,58.2,56.8,55.5,57,58.3,58.8];

// Sichtbare Ausdehnung der Mundform relativ zu ihrem Mittelpunkt. Die Werte
// werden auch fuer den Bart-Freiraum verwendet, damit Lippen/Zaehne nicht von
// Kinn- oder Vollbartflaechen uebermalt werden.
const MUND_MASSE=[
 {oben:.4,unten:4},
 {oben:1,unten:1.5},
 {oben:2.6,unten:2},
 {oben:1,unten:5.8},
 {oben:3,unten:3.4},
 {oben:3.3,unten:3.8},
 {oben:3.8,unten:4.2},
 {oben:.8,unten:2.2},
 {oben:1,unten:5.5},
];

export function gesichtsAnker(kopf={},nase=0,mund=0){
 const kinn=clamp(num(kopf.kinn,70),64,74);
 const naseId=clamp(Math.trunc(num(nase,0)),0,NASEN_UNTERKANTE.length-1);
 const mundId=clamp(Math.trunc(num(mund,0)),0,MUND_MASSE.length-1);
 const masse=MUND_MASSE[mundId];

 // Nur kuerzere Koepfe ziehen die Nase nach oben. Lange Koepfe behalten die
 // vertraute Augen-/Nasenlage; zusaetzliche Laenge liegt unterhalb davon.
 const naseDy=Math.min(0,(kinn-70)*.45);
 const naseBottom=NASEN_UNTERKANTE[naseId]+naseDy;

 // Auf kurzen Koepfen liegt der Mund naeher am Kinn, auf langen etwas hoeher.
 // Bei kinn=69–71 bleibt die historische Lage praktisch erhalten.
 const mundAbstand=clamp(5+(kinn-64)*.36,5,8.4);
 const mundY=kinn-mundAbstand;

 // Sehr kurze Koepfe bekommen eine leicht komprimierte Mundhoehe. Zusaetzlich
 // wird so weit komprimiert, dass weder Nasenunterkante noch Kinn geschnitten
 // werden. Breite bleibt unveraendert und die Mund-ID damit klar erkennbar.
 const grundSkala=clamp(.76+(kinn-64)*.06,.76,1);
 const maxNase=masse.oben>0?(mundY-(naseBottom+.7))/masse.oben:1;
 const maxKinn=masse.unten>0?((kinn-.8)-mundY)/masse.unten:1;
 const mundScale=clamp(Math.min(grundSkala,maxNase,maxKinn),.58,1);
 const mundTop=mundY-masse.oben*mundScale;
 const mundBottom=mundY+masse.unten*mundScale;

 // Schnurrbart liegt direkt oberhalb der Oberlippe, aber nie auf der Nase.
 // schnurrbartY ist die Basislinie des Pfades; dessen oberster Punkt liegt
 // rund drei Einheiten darueber.
 const schnurrbartY=Math.max(mundY-1.3,naseBottom+3.2);
 return {kinn,naseDy,naseBottom,mundY,mundScale,mundTop,mundBottom,schnurrbartY};
}

export const GESICHTSANKER_GRENZEN={NASEN_UNTERKANTE:[...NASEN_UNTERKANTE],MUND_MASSE:MUND_MASSE.map(v=>({...v}))};
