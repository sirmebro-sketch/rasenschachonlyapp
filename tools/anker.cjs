/* Die Marken, an denen `tools/langzeit.cjs` Blöcke aus App.jsx herausschneidet.
   ==========================================================================
   Der Langzeitlauf baut keine React-Oberfläche auf. Er nimmt die echten
   Handler TEXTLICH aus App.jsx und setzt sie mit Testadaptern neu zusammen —
   nur so prüft er den wirklich ausgelieferten Code statt einer Nachbildung.

   Bis 15.09.2026 waren die Schnittstellen dafür beliebige Codezeilen: der
   Handler-Block endete an der Zeichenkette `const quickSim =`, also an einer
   ungenutzten Funktion, die jeder jederzeit hätte löschen dürfen. Im Quelltext
   stand kein Hinweis darauf, und der Langzeitlauf läuft nicht in der CI — ein
   Versehen wäre erst Wochen später aufgefallen.

   Deshalb diese Datei: EINE Stelle für beide Nutzer, den Langzeitlauf und die
   Regression in `regression.test.cjs`, die das Vorhandensein der Marken bei
   jedem `npm test` prüft. Wer die Marken in App.jsx ändert, ändert sie hier
   mit — und merkt es sofort, weil sonst die CI rot wird.

   Siehe README.md, Abschnitt „Prüfstände".                                  */

/* Der Name des Blocks, der Inhalt, den er umfassen muss, und wozu er da ist.
   `pflicht` ist eine grobe Plausibilitätsprüfung: sie fängt den Fall ab, dass
   jemand die Marken zwar stehen lässt, aber an eine andere Stelle schiebt. */
const BLOECKE = [
  { name: "helfer",  pflicht: "const clone =",
    zweck: "Kopierhelfer für den Spielerzustand" },
  { name: "handler", pflicht: "const chooseTraining =",
    zweck: "die echten Ablauf-Handler von Training bis Saisonende" },
];

const anfang = (name) => `/* PRUEFSTAND-ANFANG: ${name} */`;
const ende = (name) => `/* PRUEFSTAND-ENDE: ${name} */`;

const wieOft = (text, marke) => text.split(marke).length - 1;

const hinweis = (name) =>
  `\nDer Prüfstand schneidet diesen Block textlich aus App.jsx heraus. ` +
  `Erwartet werden genau eine Zeile ${anfang(name)} und genau eine Zeile ` +
  `${ende(name)}, in dieser Reihenfolge.\n` +
  `Wer die Marken verschiebt oder entfernt, muss tools/anker.cjs mitführen — ` +
  `siehe README.md, Abschnitt „Prüfstände".`;

/* Grenzen eines Blocks ermitteln und dabei prüfen, dass die Marken eindeutig
   sind und richtig herum stehen. Wirft mit einer Meldung, die sagt, was zu
   tun ist — nicht nur, dass etwas fehlt. */
function grenzen(quelle, name) {
  const a = anfang(name), e = ende(name);
  const na = wieOft(quelle, a), ne = wieOft(quelle, e);
  if (na !== 1 || ne !== 1)
    throw Error(`Prüfstand-Marke "${name}": ${na}× Anfang und ${ne}× Ende in App.jsx gefunden.` + hinweis(name));
  const i = quelle.indexOf(a), j = quelle.indexOf(e);
  if (j < i)
    throw Error(`Prüfstand-Marke "${name}": Ende steht vor dem Anfang.` + hinweis(name));
  return { von: i + a.length, bis: j };
}

/* Den Block herausschneiden. Zusätzlich zur Lage wird geprüft, dass der
   erwartete Inhalt wirklich darin liegt — sonst stünden die Marken zwar da,
   umschlössen aber den falschen Code. */
function block(quelle, name) {
  const eintrag = BLOECKE.find((b) => b.name === name);
  if (!eintrag) throw Error(`Unbekannter Prüfstand-Block: ${name}. Bekannt: ${BLOECKE.map((b) => b.name).join(", ")}.`);
  const { von, bis } = grenzen(quelle, name);
  const inhalt = quelle.slice(von, bis);
  if (!inhalt.includes(eintrag.pflicht))
    throw Error(`Prüfstand-Marke "${name}" umschließt nicht mehr ${eintrag.zweck}: "${eintrag.pflicht}" liegt nicht darin.` + hinweis(name));
  return inhalt;
}

module.exports = { BLOECKE, anfang, ende, grenzen, block };
