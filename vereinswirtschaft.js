/* ==========================================================================
   vereinswirtschaft.js — die Profimannschaft verdient und zahlt in Geld
   --------------------------------------------------------------------------
   Kevin, 17.09.2026: „Ich möchte den Nutzen von VC in der Profimannschaft
   etwas limitieren. […] Das man keine VC in etwas versenkt was nach 15 Saison
   eh verschwindet. Lediglich gewisse extra Bonis und Ausbauten sollen mit VC
   möglich sein."

   DAS PROBLEM MIT DEM ALTEN SYSTEM. Bis 35.192 kostete jeder Vereinsausbau
   VC — dieselbe Währung, die auch die Akademie ausbaut und Packs kauft. VC
   sind aber laufbahnübergreifend und knapp (eine Laufbahn bringt rund 100),
   während der Verein nach fünfzehn Jahren abgeschlossen wird und samt Ausbau
   verschwindet. Wer 650 VC in ein Trainingszentrum steckte, hat sie in etwas
   gesteckt, das planmäßig endet. Das ist keine Entscheidung, sondern eine
   Falle: die Akademie bleibt, der Verein nicht.

   DIE NEUE TRENNUNG.
     Geld (€ bzw. Landeswährung)  — verdient der Verein selbst, gibt er selbst
                                    aus, verschwindet mit ihm. Alles Normale.
     VC                           — laufbahnübergreifend, knapp, kauft nur
                                    Extras, die diesen Verein überdauern oder
                                    einmalig etwas ermöglichen.

   WOHER DAS GELD KOMMT — vier Quellen, wie bei einem echten Verein:
     Zuschauer     Plätze × Auslastung × Preis × Heimspiele, plus Gastronomie
     Merchandising Sortiment × Reichweite (Laden, Onlineshop) × Bekanntheit
     Prämien       Ligastufe, Platzierung, Aufstieg, Meisterschaft
     Sponsoren     pro Saison aus einer Auswahl gewählt, mit Laufzeit

   MASSEINHEIT IST MILLIONEN EURO, genau wie `p.money` beim Spieler. Intern
   wird ausschliesslich in Euro gerechnet; die Landeswährung ist eine reine
   Anzeigefrage. Andersherum — pro Land rechnen — bräche bei jedem Vergleich
   zwischen zwei Ligen, und die Ausbaukosten müssten je Land gepflegt werden.

   DIESE DATEI RECHNET, SIE ZEICHNET NICHT. Keine React-Abhängigkeit, keine
   Zufallsquelle aus App.jsx: der Sponsorenwürfel bekommt seine Saat von
   aussen, damit dieselbe Saison reproduzierbar dieselben Angebote zeigt.
   ========================================================================== */

/* ---------------------------------------------------------------- Währung
   Nur Länder, die eigene Ligen im Spiel haben, brauchen einen Eintrag; alles
   andere fällt auf den Euro zurück. Die Kurse sind gerundete Grössenordnungen
   und bewusst keine Tageskurse — sie sollen die Zahl vertraut aussehen lassen
   („140 Mio ¥"), nicht eine Wechselstube nachbilden. Wer sie pflegt, ändert
   eine Anzeige, keine Bilanz.                                              */
export const WAEHRUNGEN = {
  GER: { code: "EUR", sym: "€",   kurs: 1 },      AUT: { code: "EUR", sym: "€",   kurs: 1 },
  ESP: { code: "EUR", sym: "€",   kurs: 1 },      ITA: { code: "EUR", sym: "€",   kurs: 1 },
  FRA: { code: "EUR", sym: "€",   kurs: 1 },      NED: { code: "EUR", sym: "€",   kurs: 1 },
  BEL: { code: "EUR", sym: "€",   kurs: 1 },      POR: { code: "EUR", sym: "€",   kurs: 1 },
  GRE: { code: "EUR", sym: "€",   kurs: 1 },      IRL: { code: "EUR", sym: "€",   kurs: 1 },
  FIN: { code: "EUR", sym: "€",   kurs: 1 },      SVK: { code: "EUR", sym: "€",   kurs: 1 },
  SVN: { code: "EUR", sym: "€",   kurs: 1 },      CRO: { code: "EUR", sym: "€",   kurs: 1 },
  ENG: { code: "GBP", sym: "£",   kurs: 0.85 },   SCO: { code: "GBP", sym: "£",   kurs: 0.85 },
  SUI: { code: "CHF", sym: "CHF", kurs: 0.95 },   DEN: { code: "DKK", sym: "kr",  kurs: 7.45 },
  NOR: { code: "NOK", sym: "kr",  kurs: 11.5 },   SWE: { code: "SEK", sym: "kr",  kurs: 11.3 },
  POL: { code: "PLN", sym: "zł",  kurs: 4.3 },    CZE: { code: "CZK", sym: "Kč",  kurs: 25 },
  HUN: { code: "HUF", sym: "Ft",  kurs: 395 },    ROU: { code: "RON", sym: "lei", kurs: 5 },
  TUR: { code: "TRY", sym: "₺",   kurs: 35 },     RUS: { code: "RUB", sym: "₽",   kurs: 100 },
  UKR: { code: "UAH", sym: "₴",   kurs: 42 },     SRB: { code: "RSD", sym: "din", kurs: 117 },
  USA: { code: "USD", sym: "$",   kurs: 1.08 },   CAN: { code: "CAD", sym: "C$",  kurs: 1.47 },
  MEX: { code: "MXN", sym: "MX$", kurs: 19 },     BRA: { code: "BRL", sym: "R$",  kurs: 5.5 },
  ARG: { code: "ARS", sym: "AR$", kurs: 1050 },   JPN: { code: "JPY", sym: "¥",   kurs: 160 },
  KOR: { code: "KRW", sym: "₩",   kurs: 1450 },   CHN: { code: "CNY", sym: "¥",   kurs: 7.8 },
  AUS: { code: "AUD", sym: "A$",  kurs: 1.65 },   KSA: { code: "SAR", sym: "SR",  kurs: 4.05 },
  UAE: { code: "AED", sym: "AED", kurs: 3.97 },   RSA: { code: "ZAR", sym: "R",   kurs: 19.5 },
  IND: { code: "INR", sym: "₹",   kurs: 90 },     EGY: { code: "EGP", sym: "E£",  kurs: 53 },
};
export const EURO = { code: "EUR", sym: "€", kurs: 1 };
export const waehrungFuer = (land) => WAEHRUNGEN[land] || EURO;

/* Anzeige eines Euro-Betrags (in Millionen) in der Landeswährung.
   Die Schwellen sind dieselben wie beim Spielergeld in App.jsx, damit sich
   beide Zahlen im Spiel gleich lesen. */
export function geldText(mioEuro, land, mitWaehrung = true) {
  const w = waehrungFuer(land);
  const x = (Number(mioEuro) || 0) * w.kurs;
  const einheit = (n, s) => n.toLocaleString("de-DE", { maximumFractionDigits: s });
  let text;
  /* NULL IST NICHT "0 Tsd". Eine leere Kasse als „0 Tsd €" zu schreiben liest
     sich wie ein Messfehler statt wie eine Aussage. Beim Rundgang durch die
     Oberfläche aufgefallen, nicht im Prüfstand: der rechnet mit Beträgen, der
     Spieler liest eine Zeile. */
  if (x === 0) return mitWaehrung ? "0 " + w.sym : "0";
  if (Math.abs(x) >= 1000) text = einheit(x / 1000, 2) + " Mrd";
  else if (Math.abs(x) >= 100) text = einheit(x, 0) + " Mio";
  else if (Math.abs(x) >= 1) text = einheit(x, 1) + " Mio";
  else text = einheit(x * 1000, 0) + " Tsd";
  return mitWaehrung ? text + " " + w.sym : text;
}

/* --------------------------------------------------------------- Ausbau
   Sechs Abteilungen statt bisher drei. Die drei alten (`training`,
   `stadion`, `medizin`) BEHALTEN IHRE KENNUNGEN und ihre Wirkung — sonst
   verlören laufende Vereine ihren Ausbaustand, und `ausbauStufe` in
   verein.js liest sie an vier Stellen. Neu sind nur die drei Quellen, die
   Geld verdienen: Gastronomie, Sortiment, Reichweite.

   DIE KOSTEN SIND IN MILLIONEN EURO und bewusst gross: der Vollausbau aller
   sechs Abteilungen kostet rund 320 Mio. Ein Verein im Unterhaus nimmt in
   fünfzehn Jahren nicht annähernd so viel ein — wer alles will, muss
   aufsteigen. Genau das soll die Entscheidung sein.

   Das erste Feld jeder Kostenliste ist 0: Stufe 1 hat man von Anfang an,
   `kosten[stufe]` ist der Preis für den Sprung auf die nächste Stufe. */
export const AUSBAU_MAX = 6;
export const AUSBAU = [
  { id: "stadion", n: "Stadion", art: "geld", kosten: [0, 4, 9, 18, 32, 55],
    t: "Mehr Plätze, mehr Zuschauer, mehr Rückhalt.",
    wirkt: "+0,8 Mannschaftsstärke je Stufe · mehr Ticketeinnahmen" },
  { id: "gastro", n: "Gastronomie", art: "geld", kosten: [0, 1, 2.5, 5, 9, 15],
    t: "Kioske, Logen, Catering. Jeder Besucher lässt mehr da.",
    wirkt: "höherer Umsatz je Zuschauer" },
  { id: "sortiment", n: "Fanartikel", art: "geld", kosten: [0, 1.5, 3, 6, 11, 19],
    t: "Vom Schal zur eigenen Kollektion.",
    wirkt: "Grundlage der Merchandising-Einnahmen" },
  { id: "reichweite", n: "Vertrieb", art: "geld", kosten: [0, 0.8, 2, 4, 7, 12],
    t: "Vereinsladen, Filialen, Onlineshop.",
    wirkt: "Vervielfacht, was das Sortiment einbringt" },
  { id: "training", n: "Trainingszentrum", art: "geld", kosten: [0, 2, 4.5, 9, 16, 27],
    t: "Deine Spieler entwickeln sich schneller.",
    wirkt: "+1 Stärke je Stufe und Jahr" },
  { id: "medizin", n: "Medizinische Abteilung", art: "geld", kosten: [0, 1.5, 3.5, 7, 12, 20],
    t: "Weniger Ausfälle, längere Laufbahnen.",
    wirkt: "Spieler halten ein Jahr länger durch" },
];

/* --------------------------------------------------------------- VC-Extras
   Was mit VC bezahlt wird, muss zwei Bedingungen erfüllen: es muss den Verein
   ÜBERDAUERN oder etwas ermöglichen, das mit Geld allein nicht geht — sonst
   wäre es wieder das alte Problem. Deshalb nur vier Posten, jeder einmal pro
   Vereinsdurchlauf.

   Die Preise liegen im Bereich einer halben bis anderthalb Laufbahnen
   (≈ 100 VC je Laufbahn), nicht mehr. VC bleibt die Währung der Akademie. */
export const VC_EXTRAS = [
  { id: "startkapital", n: "Gründungskapital", vc: 45, einmalig: true,
    t: "Ein Investor steigt zum Start ein.", wirkt: "+12 Mio in die Kasse",
    fx: { kasse: 12 } },
  /* „Scoutnetz" stand hier und versprach für 70 VC „Bleibt der Akademie
     erhalten" über ein Feld `akademieAufnahmen`, das NIEMAND liest. Beim
     Gegenlesen aufgefallen: der Spieler hätte eine gute Laufbahn Ersparnis
     für nichts ausgegeben. Es ist ersatzlos entfernt statt notdürftig
     verdrahtet — der naheliegende Anker wäre `bonus.aufnahmen` aus den
     Abschluss-BONI gewesen, und der wird ebenfalls nur ANGEZEIGT und nie
     gelesen (App.jsx:9483). An etwas anzudocken, das selbst nichts tut, wäre
     derselbe Fehler mit mehr Zeilen. Kommt zurück, sobald die Akademie einen
     Haken für ihre Aufnahmen hat. */
  { id: "namensrecht", n: "Namensrecht am Stadion", vc: 90, einmalig: true,
    t: "Der Name gehört dir, nicht dem Sponsor.",
    wirkt: "+25 % Ticketeinnahmen, dauerhaft", fx: { ticketFaktor: .25 } },
  { id: "ewigkeit", n: "Vermächtnisplakette", vc: 120, einmalig: true,
    t: "Dieser Verein zählt auch nach seinem Abschluss.",
    wirkt: "+15 % Abschlusspunkte", fx: { punkteFaktor: .15 } },
];

/* ------------------------------------------------------------- Sponsoren
   Erfundene Firmen, keine echten Marken. Jede hat eine Branche, einen
   Grundbetrag je Saison und einen Vorteil. Der Betrag wird mit der Ligastufe
   und der Bekanntheit des Vereins skaliert — ein Drittligist bekommt nicht
   das Angebot eines Meisters.

   `laufzeit` ist die Zahl der Saisons. Lange Laufzeiten zahlen etwas weniger
   je Saison und binden: wer aufsteigt, hätte neu verhandeln können. */
export const SPONSOREN = [
  { id: "nordwind",  n: "Nordwind Energie",    branche: "Energie",       basis: 3.2, fx: null },
  { id: "kesselbau", n: "Kesselbau & Söhne",   branche: "Industrie",     basis: 2.4, fx: null },
  { id: "lumen",     n: "Lumen Versicherung",  branche: "Versicherung",  basis: 3.8, fx: null },
  { id: "tramonto",  n: "Tramonto Sportswear", branche: "Ausrüster",     basis: 2.6, fx: { merchFaktor: .30 },
    vorteil: "+30 % Merchandising" },
  { id: "hafenkorn", n: "Hafenkorn Brauerei",  branche: "Getränke",      basis: 2.2, fx: { gastroFaktor: .35 },
    vorteil: "+35 % Gastronomie" },
  { id: "vitalis",   n: "Vitalis Klinikgruppe", branche: "Gesundheit",   basis: 2.0, fx: { medizin: 1 },
    vorteil: "wirkt wie eine Stufe Medizin" },
  { id: "aurex",     n: "Aurex Bank",          branche: "Finanzen",      basis: 4.5, fx: null },
  { id: "steinweg",  n: "Steinweg Logistik",   branche: "Logistik",      basis: 2.8, fx: null },
  { id: "pixelfeld", n: "Pixelfeld Interactive", branche: "Software",    basis: 3.0, fx: { reichweite: 1 },
    vorteil: "wirkt wie eine Stufe Vertrieb" },
  { id: "almgut",    n: "Almgut Molkerei",     branche: "Lebensmittel",  basis: 1.8, fx: { jugend: .2 },
    vorteil: "Nachwuchs entwickelt sich etwas schneller" },
  { id: "kranich",   n: "Kranich Reisen",      branche: "Reise",         basis: 2.5, fx: null },
  { id: "ferrum",    n: "Ferrum Stahlwerke",   branche: "Industrie",     basis: 3.4, fx: null },
];

/* Ein kleiner, eigener Zufall. Bewusst NICHT `Math.random`: dieselbe Saison
   soll dieselben Angebote zeigen, auch nach Neuladen des Spielstands. */
const streuung = (saat) => {
  let a = (Number(saat) || 0) | 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/* Wie gut ein Verein dasteht, in einer Zahl von etwa 0,4 bis 2,6. Fliesst in
   Sponsorenbeträge, Zuschauerzahlen und Merchandising.
   `stufe` ist 1 für die höchste Liga eines Landes, dann aufsteigend. */
export function ansehen(v, stufe = 3) {
  const b = v?.bilanz || {};
  const s = Math.max(1, Number(stufe) || 3);
  const ligaTeil = 1.9 / Math.pow(s, 0.62);                     /* 1. Liga ≈ 1,90 · 3. Liga ≈ 0,94 */
  const erfolg = (b.meister || 0) * .10 + (b.aufstiege || 0) * .06 - (b.abstiege || 0) * .05;
  return Math.max(.4, Math.min(2.6, ligaTeil + erfolg));
}

/* Angebote einer Saison. Immer `anzahl` Stück, nie zweimal dieselbe Firma,
   und nie eine, die gerade unter Vertrag steht. */
export function sponsorAngebote(v, saat, anzahl = 3) {
  const stufe = v?.ligastufe || 3;
  const w = ansehen(v, stufe);
  const laufend = new Set((v?.sponsoren || []).map((s) => s.id));
  const frei = SPONSOREN.filter((s) => !laufend.has(s.id));
  const r = streuung(saat);
  const gemischt = frei.map((s) => ({ s, k: r() })).sort((a, b) => a.k - b.k).map((x) => x.s);
  return gemischt.slice(0, Math.min(anzahl, gemischt.length)).map((s) => {
    const laufzeit = 1 + Math.floor(r() * 4);                   /* 1 bis 4 Saisons */
    /* Lange Bindung zahlt je Saison weniger: 1 Saison 100 %, 4 Saisons 82 %. */
    const bindung = 1 - (laufzeit - 1) * .06;
    const betrag = Math.round(s.basis * w * bindung * (.9 + r() * .25) * 100) / 100;
    return { id: s.id, n: s.n, branche: s.branche, vorteil: s.vorteil || null,
             fx: s.fx || null, laufzeit, betrag, rest: laufzeit };
  });
}

/* Einen Vertrag annehmen. Gibt den neuen Verein zurück; ein doppelter
   Abschluss derselben Firma wird abgewiesen statt stillschweigend gedoppelt. */
export function sponsorAnnehmen(v, angebot) {
  if (!angebot) return { v, fehler: "Kein Angebot gewählt." };
  const laufend = v?.sponsoren || [];
  if (laufend.some((s) => s.id === angebot.id)) return { v, fehler: "Diese Firma ist bereits Partner." };
  return { v: { ...v, sponsoren: [...laufend, { ...angebot, rest: angebot.laufzeit }] }, fehler: null };
}

/* Nach einer Saison läuft jeder Vertrag ein Jahr ab. Abgelaufene fallen raus
   und werden gemeldet, damit die Oberfläche es sagen kann. */
export function sponsorenTicken(v) {
  const alle = (v?.sponsoren || []).map((s) => ({ ...s, rest: (s.rest || 0) - 1 }));
  return { sponsoren: alle.filter((s) => s.rest > 0), ausgelaufen: alle.filter((s) => s.rest <= 0) };
}

/* Summierte Wirkung aller laufenden Sponsoren und gekauften VC-Extras. */
export function wirkung(v) {
  const a = {};
  const dazu = (fx) => { if (fx) Object.entries(fx).forEach(([k, w]) => { a[k] = (a[k] || 0) + w; }); };
  (v?.sponsoren || []).forEach((s) => dazu(s.fx));
  (v?.extras || []).forEach((id) => dazu((VC_EXTRAS.find((x) => x.id === id) || {}).fx));
  return a;
}

/* ----------------------------------------------------------- Rechtsform
   Kevin, 17.09.2026: „Ich fände es noch cool wenn man im Laufe des Spiel die
   Körperschaft der Profimannschaft ändern kann um so die Finanziellen
   Möglichkeiten zu ändern und sich Vor- und Nachteile zur verschaffen."

   Die Reihe ist eine Einbahnstrasse von der Mitgliederhand zum Kapitalmarkt.
   Jede Stufe bringt mehr kommerzielle Einnahmen und eine Einlage, kostet aber
   Rückhalt: Fans ertragen weniger Preiserhöhungen, und der Vorstand erwartet
   mehr. Kein Weg ist richtig — ein e.V. mit treuen Fans kann hohe Preise
   verlangen, wo eine AG schon Pfiffe erntet.

   `toleranz` verschiebt, wie weit man mit Preisen über die Norm gehen darf,
   `kommerz` skaliert Merchandising und Sponsoren, `beitrag` sind die
   Mitgliedsbeiträge (nur der e.V. hat sie in nennenswerter Höhe). */
export const RECHTSFORMEN = [
  { id: "ev",   n: "e.V.",  lang: "Eingetragener Verein", kommerz: 0.92, toleranz: +0.18, beitrag: 0.9,
    einlage: 0,  wechselKosten: 0,  zielHaerte: 0.85, mindestStufe: 9,
    t: "Die Mitglieder entscheiden. Wenig Kapital, viel Rückhalt." },
  { id: "gmbh", n: "GmbH",  lang: "Gesellschaft mit beschränkter Haftung", kommerz: 1.00, toleranz: 0, beitrag: 0.3,
    einlage: 15, wechselKosten: 2, zielHaerte: 1.00, mindestStufe: 4,
    t: "Ein Investor steigt ein. Mehr Geld, etwas weniger Geduld." },
  { id: "kgaa", n: "KGaA",  lang: "Kommanditgesellschaft auf Aktien", kommerz: 1.09, toleranz: -0.09, beitrag: 0.15,
    einlage: 45, wechselKosten: 6, zielHaerte: 1.12, mindestStufe: 2,
    t: "Kapital von aussen, Führung bleibt beim Verein." },
  { id: "ag",   n: "AG",    lang: "Aktiengesellschaft", kommerz: 1.20, toleranz: -0.20, beitrag: 0.05,
    einlage: 110, wechselKosten: 14, zielHaerte: 1.28, mindestStufe: 1,
    t: "Der Kapitalmarkt zahlt — und schaut jede Saison genau hin." },
];
export const rechtsform = (v) => RECHTSFORMEN.find((r) => r.id === (v?.rechtsform || "ev")) || RECHTSFORMEN[0];
const rfIndex = (id) => RECHTSFORMEN.findIndex((r) => r.id === id);

/* Wechseln geht nur nach vorne und nur, wenn der Verein gross genug ist:
   niemand bringt einen Fünftligisten an die Börse. Der Wechsel kostet Geld
   und Stimmung, bringt dafür die Einlage. */
export function rechtsformWechseln(v, zielId) {
  const jetzt = rechtsform(v);
  const ziel = RECHTSFORMEN.find((r) => r.id === zielId);
  if (!ziel) return { v, fehler: "Unbekannte Rechtsform." };
  if (rfIndex(ziel.id) <= rfIndex(jetzt.id)) return { v, fehler: "Der Weg führt nur nach vorn." };
  const stufe = v?.ligastufe || 3;
  if (stufe > ziel.mindestStufe) return { v, fehler:
    "Dafür ist der Verein zu klein — nötig ist mindestens Liga " + ziel.mindestStufe + "." };
  const kasse = Number(v?.kasse) || 0;
  if (kasse < ziel.wechselKosten) return { v, fehler:
    "Die Umwandlung kostet " + geldText(ziel.wechselKosten, v?.land) + "." };
  return { v: { ...v, rechtsform: ziel.id,
                kasse: Math.round((kasse - ziel.wechselKosten + ziel.einlage) * 100) / 100,
                stimmung: Math.max(0, (v?.stimmung ?? 60) - 8) },
           einlage: ziel.einlage, kosten: ziel.wechselKosten, fehler: null };
}

/* ------------------------------------------------------- Preise und Stimmung
   Kevin: „Ticketpreise einstellbar, Gastro Preise einstellbar und Merch Preise
   einstellbar. Alles mit vor und nachteilen. (Ein schlecht dahstenhender
   Verein mit wenig Bekanntheit kann keine Hohen Preise verlangen ohne
   nachteile. Ein Verein mit schlechter Gastro kann keine Hohen Preise
   verlangen ohne Nachteile.)"

   UMGESETZT ÜBER DIE ELASTIZITÄT, nicht über ein Verbot. Der Preis ist ein
   Faktor auf den Normalpreis (0,6 bis 1,6). Wer ihn anhebt, nimmt je Einheit
   mehr ein und verkauft weniger. Wie viel weniger, hängt davon ab, was der
   Verein zu bieten hat:

     Tickets  — am Ansehen. Ein Erstligist mit Ansehen 1,9 hat Elastizität
                0,68 und sein Ertragsmaximum bei Faktor 1,24: er DARF 24 %
                über Normalpreis gehen. Ein Fünftligist mit Ansehen 0,7 hat
                1,04 und sein Maximum bei 0,98 — er kann nicht erhöhen, ohne
                draufzuzahlen. Genau Kevins erstes Beispiel.
     Gastro   — an der Gastrostufe. Stufe 1 verträgt nichts (Maximum 0,92),
                Stufe 6 verträgt viel (Maximum 1,36). Kevins zweites Beispiel.
     Merch    — an Sortiment und Vertrieb zusammen.

   Die Rechtsform verschiebt jede dieser Toleranzen: ein e.V. darf mehr, eine
   AG weniger. Wer über das Maximum hinausgeht, verliert zusätzlich Stimmung —
   der Schaden ist also doppelt und wirkt in die nächste Saison hinein. */
export const PREIS_MIN = 0.6, PREIS_MAX = 1.6;
export const preisFaktor = (v, feld) => {
  const x = Number((v?.preise || {})[feld]);
  return Number.isFinite(x) ? Math.max(PREIS_MIN, Math.min(PREIS_MAX, x)) : 1;
};

/* Elastizität: je höher, desto schneller bricht die Nachfrage weg. */
export function elastizitaet(v, feld) {
  const rf = rechtsform(v);
  const tol = rf.toleranz + (((v?.stimmung ?? 60) - 60) / 400);   /* gute Stimmung verträgt mehr */
  let e;
  if (feld === "ticket") e = 1.25 - ansehen(v, v?.ligastufe || 3) * 0.30;
  else if (feld === "gastro") e = 1.30 - stufeVon(v, "gastro") * 0.12;
  else e = 1.25 - (stufeVon(v, "sortiment") + stufeVon(v, "reichweite")) / 2 * 0.10;
  return Math.max(0.35, e - tol * 0.55);
}

/* Der Preis, der am meisten einbringt — als Hinweis für die Oberfläche, damit
   der Regler nicht blind bedient wird.

   Für Gastro und Merch ist das die Schulformel: der Ertrag f · (1 − e(f−1))
   hat sein Maximum bei (1+e)/(2e).

   BEIM TICKETPREIS REICHT DAS NICHT (gemerkt beim Nachrechnen, 17.09.2026).
   Wer die Karten teurer macht, lässt weniger Leute ins Stadion — und die
   fehlen auch an der Wurst- und Bierbude. Die Gastronomie hängt an der
   BESUCHERZAHL, nicht am Ticketpreis. Isoliert lag das Optimum bei Faktor
   1,14, in Wahrheit bei 0,98: ein Hinweis, der 14 % danebenlag und den
   Spieler in ein Minusgeschäft geschickt hätte.

   Mit dem Gastro-Anteil r je Besucher verschiebt sich das Maximum um r/2
   nach unten. Ein Verein mit starker Gastronomie muss seine Tickets also
   billiger halten — ein Zusammenhang, der sich von selbst ergibt und den
   niemand erfinden musste.

   UND AUCH DAS WAR NOCH ZU EINFACH. Über 10.935 Vereinskonfigurationen
   nachgerechnet lag die Formel in 558 Fällen daneben — 5,1 %. Der Grund sind
   die Deckelungen: die Auslastung kann nicht über 99 % und nicht unter 35 %,
   die Menge nicht unter 5 %. Ein ausverkauftes Stadion verliert bei einer
   Preiserhöhung zunächst gar keine Besucher, also liegt sein Optimum HÖHER
   als jede Parabel es vorhersagt. Man könnte die Formel um jede Deckelung
   erweitern — oder den Ertrag einfach ausrechnen. Letzteres ist kürzer,
   immer richtig und kostet einundfünfzig Multiplikationen.

   Der Hinweis ist damit keine Schätzung mehr, sondern ein Versprechen: kein
   anderer Reglerwert bringt mehr. Genau das prüft die Regression. */
export function bestPreis(v, feld, erg = { rang: 10, N: 18 }) {
  let bester = PREIS_MIN, hoechster = -Infinity;
  for (let f = PREIS_MIN; f <= PREIS_MAX + 1e-9; f = Math.round((f + .02) * 100) / 100) {
    const s = saisonEinnahmen({ ...v, preise: { ...(v?.preise || {}), [feld]: f } }, erg).summe;
    if (s > hoechster) { hoechster = s; bester = f; }
  }
  return bester;
}

/* Mengenwirkung eines Preisfaktors: 1 bei Normalpreis, weniger darüber. */
const menge = (v, feld) => Math.max(0.05, 1 - (preisFaktor(v, feld) - 1) * elastizitaet(v, feld));

/* Wie weit der Preis über dem liegt, was der Verein rechtfertigen kann —
   daraus entsteht der Stimmungsschaden. Unterhalb gibt es keinen Ärger, nur
   weniger Geld; wer Fans billig reinlässt, wird nicht bestraft.

   DIE GRENZE IST NIE KLEINER ALS 1, UND DAS IST DIE KORREKTUR EINES FEHLERS.
   Der erste Entwurf maß den Abstand allein zum ertragreichsten Preis. Der
   liegt aber fast überall UNTER 1 (gemessen: Liga 1 0,22, Liga 3 0,24, selbst
   ein voll ausgebauter Drittligist 0,34) — und der Voreinstellung 1,0 fehlt
   jede Absicht des Spielers. Ergebnis: jeder Verein verlor jede Saison fünf
   bis zehn Stimmungspunkte, ohne dass jemand etwas getan hatte. Gemessen an
   einem Drittligisten auf Platz 9: 60 → 55 → 54 → 47 → 42 → 37 → 31 → 23 in
   acht Saisons, danach weiter gegen null. Und weil die Stimmung auf
   Auslastung und Merchandising wirkt, war es eine Abwärtsspirale ohne Hebel —
   eine Preisoberfläche gibt es noch nicht.

   Der Normalpreis ist kein Übergriff. Ärger entsteht erst, wenn der Spieler
   ÜBER den Normalpreis geht und der Verein nichts zu bieten hat, was ihn
   trägt. Deshalb `Math.max(1, bestPreis(...))`. */
const ueberzogen = (v, erg) => ["ticket", "gastro", "merch"].reduce((a, f) => {
  const preis = preisFaktor(v, f);
  /* ABKÜRZUNG, DIE NICHTS VERÄNDERT. Der Term ist
     `max(0, preis - max(1, optimum))`. Für `preis <= 1` ist er immer null,
     ganz gleich, wo das Optimum liegt — also braucht es das Optimum dann auch
     nicht. Das ist keine Näherung, sondern dieselbe Zahl auf kürzerem Weg.
     Und es ist der Normalfall: `bestPreis` sucht in 51 Schritten und rechnet
     bei jedem Schritt die vollen Saisoneinnahmen, dreimal je Abrechnung —
     153 volle Einnahmerechnungen, deren Ergebnis bis auf einen Skalar
     weggeworfen wird. Solange es keine Preisoberfläche gibt, steht überall
     die Voreinstellung 1, und damit fällt die ganze Rechnerei weg. */
  if (preis <= 1) return a;
  return a + Math.max(0, preis - Math.max(1, bestPreis(v, f, erg)));
}, 0);

/* ------------------------------------------------------------- Einnahmen */
const stufeVon = (v, id) => Math.max(1, Math.min(AUSBAU_MAX, ((v?.ausbau || {})[id]) || 1));

/* Plätze je Stadionstufe. Bewusst überproportional: die ersten Ausbaustufen
   sind billig und bringen wenig, die letzten teuer und viel. */
export const PLAETZE = [0, 8000, 14000, 22000, 33000, 47000, 64000];
export const plaetze = (v) => PLAETZE[stufeVon(v, "stadion")];

/* Eine Saison abrechnen. `erg` ist das Ergebnis aus `vereinSaison`:
   { rang, N, aufstieg, abstieg, ... }. Zurück kommt ein BELEG — dieselbe
   Bauart wie `abschlussBeleg` in belohnungen.js, damit Buchung und Anzeige
   dieselbe Quelle haben und keine zwei Rechnungen auseinanderlaufen. */
export function saisonEinnahmen(v, erg = {}) {
  const stufe = v?.ligastufe || 3;
  const w = wirkung(v);
  const ruf = ansehen(v, stufe);
  const posten = [];
  const dazu = (k, betrag) => { const x = Math.round(betrag * 100) / 100; if (x > 0) posten.push({ k, v: x }); };

  const rang = Number(erg.rang) || 10;
  const N = Number(erg.N) || 18;
  const heimspiele = Math.max(8, Math.round((N - 1)));            /* Hin- und Rückrunde: N-1 Heimspiele */
  /* Auslastung: Grundwert aus dem Ansehen, dazu die aktuelle Platzierung.
     Tabellenführer füllen das Haus, Abstiegsplätze nicht. */
  const platzTeil = 1 - (rang - 1) / Math.max(1, N - 1);           /* 1. Platz = 1, letzter = 0 */
  const auslastung = Math.max(.35, Math.min(.99, .45 + ruf * .18 + platzTeil * .22));
  /* Ticketpreis in Euro, aus der Ligastufe. 1. Liga 34 €, 3. Liga 19 €,
     5. Liga 14 €. Der erste Entwurf stand bei 42 € für die erste Liga — das
     ist mehr, als eine Bundesligakarte im Schnitt kostet, und es war einer
     der Gründe, warum ein Spitzenverein in fünfzehn Jahren eine Milliarde
     anhäufte. */
  const preis = Math.max(9, 34 / Math.pow(stufe, .55));
  const ticketFaktor = 1 + (w.ticketFaktor || 0);
  /* Die Stimmung bewegt die Auslastung um ±10 %: begeisterte Fans füllen das
     Haus auch bei mässiger Platzierung, verprellte bleiben trotz Erfolg weg. */
  const stimmung = Math.max(0, Math.min(100, v?.stimmung ?? 60));
  const stimmungsFaktor = 1 + (stimmung - 60) / 400;
  const besucher = Math.round(plaetze(v) * Math.min(.99, auslastung * stimmungsFaktor * menge(v, "ticket")));
  dazu("Zuschauer · " + besucher.toLocaleString("de-DE") + " × " + heimspiele + " Heimspiele"
       + (preisFaktor(v, "ticket") !== 1 ? " · Preis " + Math.round(preisFaktor(v, "ticket") * 100) + " %" : ""),
       besucher * preis * preisFaktor(v, "ticket") * heimspiele / 1e6 * ticketFaktor);

  /* Gastronomie: Umsatz je Besucher, abhängig von der Gastrostufe. */
  const gastroStufe = stufeVon(v, "gastro");
  const jeBesucher = 2.2 + (gastroStufe - 1) * 2.6;
  dazu("Gastronomie · Stufe " + gastroStufe
       + (preisFaktor(v, "gastro") !== 1 ? " · Preis " + Math.round(preisFaktor(v, "gastro") * 100) + " %" : ""),
       besucher * jeBesucher * preisFaktor(v, "gastro") * menge(v, "gastro") * heimspiele / 1e6
       * (1 + (w.gastroFaktor || 0)));

  /* Merchandising: Sortiment mal Reichweite mal Bekanntheit. Ohne Reichweite
     bringt das beste Sortiment wenig — deshalb Produkt, nicht Summe.

     ABER GEDÄMPFT (korrigiert 17.09.2026). Das reine Produkt wächst
     quadratisch: bei Stufe 6/6 waren es 59,7 Mio und damit die GRÖSSTE
     Einnahmequelle eines Erstligisten — mehr als alle Ticketverkäufe
     zusammen (36,6). Das ist weder realistisch noch gut fürs Spiel, weil
     „beides auf 6" damit die einzig richtige Strategie war. Die Wurzel
     erhält die Aussage „beides zusammen wirkt", nimmt ihr aber die
     Explosion: 6/6 bringt jetzt das Sechsfache von 1/1, nicht das
     Sechsunddreissigfache. */
  const sortiment = stufeVon(v, "sortiment");
  const reichweite = Math.min(AUSBAU_MAX, stufeVon(v, "reichweite") + (w.reichweite || 0));
  const rf = rechtsform(v);
  dazu("Merchandising · Sortiment " + sortiment + " · Vertrieb " + reichweite
       + (preisFaktor(v, "merch") !== 1 ? " · Preis " + Math.round(preisFaktor(v, "merch") * 100) + " %" : ""),
       Math.sqrt(sortiment * reichweite) * (sortiment + reichweite) * ruf * .55
       * preisFaktor(v, "merch") * menge(v, "merch") * stimmungsFaktor
       * rf.kommerz * (1 + (w.merchFaktor || 0)));

  /* Prämien: Grundbetrag der Ligastufe plus Platzierung, Aufstieg, Titel.

     EXPONENT 1,6 STATT 1,15 (korrigiert 17.09.2026). Mit 1,15 bekam ein
     Drittligist 7,87 Mio Fernsehgeld gegen 2,66 Mio aus Zuschauern,
     Gastronomie und Merchandising zusammen. Sein eigener Ausbau war damit
     fast gleichgültig — genau das Gegenteil dessen, was dieses System
     erreichen soll. Fernsehgeld ist jetzt ein Oberhaus-Privileg: Liga 1
     bekommt 26, Liga 3 noch 4,2, Liga 5 nur 1,8. */
  const grund = 26 / Math.pow(stufe, 1.6);
  dazu("Fernsehgeld und Prämien · Liga " + stufe, grund * (.6 + platzTeil * .8));
  if (erg.aufstieg) dazu("Aufstiegsprämie", grund * .9);
  if (rang === 1) dazu("Meisterprämie", grund * .7);

  (v?.sponsoren || []).forEach((s) => dazu("Sponsor · " + s.n + " (noch " + s.rest + ")", s.betrag * rf.kommerz));

  /* Mitgliedsbeiträge. Für den e.V. eine echte Säule, für die AG ein Rest.
     Sie hängen an Ansehen und Stimmung, nicht am Ausbau: Mitglieder gewinnt
     man durch Erfolg und Anstand, nicht durch ein grösseres Stadion. */
  dazu("Mitgliedsbeiträge · " + rf.n, rf.beitrag * ruf * (stimmung / 60));

  const summe = Math.round(posten.reduce((a, x) => a + x.v, 0) * 100) / 100;
  return { posten, summe, auslastung: besucher / Math.max(1, plaetze(v)), zuschauer: besucher };
}

/* Laufende Kosten. Ohne sie wäre jede Kasse nach drei Saisons voll und jeder
   Ausbau eine Formsache.

   WARUM SIE MIT DER VEREINSGRÖSSE WACHSEN MÜSSEN (nachgerechnet 17.09.2026).
   Der erste Entwurf hatte nur „Betrieb" (mit den Ausbaustufen wachsend) und
   „Spielbetrieb" (mit der Ligastufe fallend). Ergebnis über fünfzehn Jahre in
   der ersten Liga: 1.908 Mio eingenommen, 440 ausgegeben, Vollausbau für 319
   bezahlt — und **1.148 Mio lagen danach in der Kasse**. Damit war oben keine
   Entscheidung mehr zu treffen, und genau die soll das System erzeugen.

   Der fehlende Posten ist der grösste eines echten Vereins: das Personal. Ein
   Erstligist mit 64.000 Plätzen beschäftigt Hunderte, ein Fünftligist ein
   Dutzend. Deshalb hängt er an Ligastufe UND Stadiongrösse.

   DIE SPIELERGEHÄLTER STEHEN SEIT 17.09.2026 ALS EIGENER POSTEN DA und haben
   die alte Pauschale „Personal und Mannschaft" ersetzt, nicht ergänzt — sonst
   würde doppelt gezahlt (Arbeitsplan WIRT-P1-03). Sie hängen am Kader und am
   Gehaltsniveau; „Betrieb und Unterhalt" wurde im selben Zug von 0,85 auf
   0,55 je Ausbaustufe gesenkt, weil das Personal dort mit drinsteckte. */
export function saisonKosten(v) {
  const posten = [];
  const dazu = (k, betrag) => { const x = Math.round(betrag * 100) / 100; if (x > 0) posten.push({ k, v: x }); };
  const stufe = v?.ligastufe || 3;
  const stufen = AUSBAU.reduce((a, x) => a + (stufeVon(v, x.id) - 1), 0);
  const niveau = gehaltsniveau(v);
  const k = kaderKosten(v);
  dazu("Spielergehälter · " + k.anzahl + " Spieler, Ø " + k.schnitt
       + (niveau > 1.02 ? " · Niveau " + Math.round(niveau * 100) + " %" : ""), k.summe * niveau);
  dazu("Mitarbeiter und Verwaltung", (2.2 / Math.pow(stufe, .6) + stufen * .55 + plaetze(v) / 1000 * .22) * niveau);
  dazu("Betrieb und Unterhalt", 1.2 + stufen * 0.55);
  dazu("Spielbetrieb und Reisen", Math.max(.5, 3.5 / Math.pow(stufe, .5)));
  const summe = Math.round(posten.reduce((a, x) => a + x.v, 0) * 100) / 100;
  return { posten, summe, niveau, kader: k };
}

/* ---------------------------------------------------------- Gehälter
   Kevin, 17.09.2026: „Spielergehälter und allgemein laufende Kosten und
   Mitarbeitergehälter steigen bei langanhaltenden Erfolg."

   DAS PROBLEM, DAS DAMIT GELÖST WIRD. Bis dahin schätzte ein einziger Posten
   „Personal und Mannschaft" das Personal pauschal aus Ligastufe und
   Stadiongrösse. Der wuchs mit dem Ausbau, aber nicht mit dem ERFOLG — und
   deshalb sass ein Erstligist nach fünfzehn Jahren auf 1.248 Mio, die nichts
   mehr kaufen konnten.

   DIE RATSCHE. Wer oben mitspielt, zahlt Spitzengehälter: die Spieler
   verlangen sie, die Konkurrenz bietet sie, und der Stab wächst mit. Das
   Niveau steigt schnell (halber Abstand zum Ziel je Saison) und fällt
   langsam (ein Sechstel) — ein Verein wird seine Gehaltsstruktur nach einem
   Abstieg nicht in einem Jahr los. Genau das macht anhaltenden Erfolg teuer,
   ohne einen einzelnen guten Lauf zu bestrafen.

   Die Spanne 0,75 bis 2,00 ist nachgerechnet, nicht geraten: darunter wäre
   der Effekt unsichtbar, darüber frisst er auch einen gesunden Verein auf. */
export const GEHALT_MIN = 0.75, GEHALT_MAX = 2.0;
export const gehaltsniveau = (v) => {
  const x = Number(v?.gehaltsniveau);
  return Number.isFinite(x) ? Math.max(GEHALT_MIN, Math.min(GEHALT_MAX, x)) : 1;
};

/* Wohin das Niveau strebt: Ligastufe, aktuelle Platzierung und die Summe der
   bisherigen Erfolge. Der Erfolgsanteil ist gedeckelt, sonst würde ein Verein
   mit fünfzehn Meisterschaften unbezahlbar. */
export function gehaltsZiel(v, erg = {}) {
  const stufe = v?.ligastufe || 3;
  const N = Number(erg.N) || 18;
  const platzTeil = 1 - ((Number(erg.rang) || 10) - 1) / Math.max(1, N - 1);
  const b = v?.bilanz || {};
  const geschichte = Math.min(.55, (b.meister || 0) * .075 + (b.aufstiege || 0) * .05);
  const ligaTeil = .55 + .75 / Math.pow(stufe, .8);
  return Math.max(GEHALT_MIN, Math.min(GEHALT_MAX,
    ligaTeil + platzTeil * .35 + geschichte - (b.abstiege || 0) * .04));
}

/* Schnell hoch, langsam runter. */
export function gehaltsniveauNeu(v, erg = {}) {
  const jetzt = gehaltsniveau(v);
  const ziel = gehaltsZiel(v, erg);
  const tempo = ziel > jetzt ? .5 : 1 / 6;
  return Math.round((jetzt + (ziel - jetzt) * tempo) * 1000) / 1000;
}

/* Was der Kader kostet, bevor das Niveau daraufkommt.

   Der Exponent 4 ist Absicht: Gehälter wachsen im Fussball nicht linear mit
   der Stärke. Ein Spieler mit 85 kostet nicht anderthalbmal so viel wie einer
   mit 55, sondern das Sechsfache.

   DER TEILER `stufe` IST NACHGERECHNET, NICHT GERATEN. Ohne ihn zahlte ein
   Viertligist 11,4 Mio Gehälter bei 17 Mio Einnahmen und erreichte in
   fünfzehn Jahren **0 von 30** Ausbaustufen — das alte „sich hocharbeiten"
   war damit tot (Lauf vom 17.09.2026, Tabelle im Vermerk). Er hat einen
   Grund über die Rechnung hinaus: derselbe Spieler verdient in der ersten
   Liga mehr als in der vierten, weil die Liga es hergibt, nicht weil er
   besser ist. Gerechnet: 0,9 Mio × (ovr/60)^4 ÷ Ligastufe je Spieler.

   OHNE KADER wird geschätzt. Der Rechenkern muss auch dann eine sinnvolle
   Zahl liefern, wenn er isoliert läuft — im Prüfstand und bevor der Anschluss
   an `verein.js` steht (WIRT-P0-02). Die Schätzwerte je Ligastufe stammen aus
   den Vereinsstärken des Spiels. */
export const KADER_SOLL = 18;
const SCHAETZ_OVR = [0, 74, 66, 60, 55, 51, 48];
export function kaderKosten(v) {
  const kader = Array.isArray(v?.kader) ? v.kader.filter((s) => s && Number.isFinite(Number(s.ovr))) : [];
  const stufe = Math.max(1, Math.min(6, v?.ligastufe || 3));
  const werte = kader.length ? kader.map((s) => Number(s.ovr))
    : Array.from({ length: KADER_SOLL }, () => SCHAETZ_OVR[stufe]);
  const summe = werte.reduce((a, o) => a + 0.9 * Math.pow(Math.max(30, o) / 60, 4) / stufe, 0);
  return { anzahl: werte.length, geschaetzt: !kader.length,
           schnitt: Math.round(werte.reduce((a, o) => a + o, 0) / Math.max(1, werte.length)),
           summe: Math.round(summe * 100) / 100 };
}

/* Die vollständige Abrechnung einer Saison: Einnahmen minus Kosten auf die
   Kasse, Sponsorenverträge um ein Jahr weiter. Ein Beleg, den Buchung und
   Anzeige gemeinsam benutzen. */
export function saisonAbrechnung(v, erg = {}, saat = 0) {
  const ein = saisonEinnahmen(v, erg);
  const aus = saisonKosten(v);
  const { sponsoren, ausgelaufen } = sponsorenTicken(v);

  /* Reihenfolge ist Absicht: Ereignisse und Prämie gehören zur abgelaufenen
     Saison und werden mitgebucht; der Bau schreitet danach voran, damit ein
     Projekt, das in dieser Saison fertig wird, erst ab der nächsten wirkt. */
  const ereignisse = ereignisseZiehen(v, saat);
  const ereignisGeld = ereignisse.reduce((a, e) => a + (e.geld || 0), 0);
  const ziel = zielPruefen(v, erg);
  const bau = bauTicken(v);

  /* Das Gehaltsniveau der ABGELAUFENEN Saison steckt in `aus`; hier entsteht
     das der kommenden. Bezahlt wird, was vorher vereinbart war — der Erfolg
     dieser Saison verteuert den Kader erst ab dem nächsten Jahr. */
  const gehaltNeu = gehaltsniveauNeu(v, erg);

  const kasseVorher = Math.round((Number(v?.kasse) || 0) * 100) / 100;
  const ergebnis = Math.round((ein.summe - aus.summe + ereignisGeld + (ziel.praemie || 0)) * 100) / 100;
  const kasse = Math.round((kasseVorher + ergebnis) * 100) / 100;

  /* Stimmung: Erfolg hebt, Überteuerung senkt, ein fertiges Bauprojekt freut.
     Sie bewegt sich träge — höchstens gut zehn Punkte je Saison, damit eine
     einzelne Saison die Fans nicht umdreht. */
  const N = Number(erg.N) || 18;
  const platzTeil = 1 - ((Number(erg.rang) || 10) - 1) / Math.max(1, N - 1);
  const stimmungNeu = Math.max(0, Math.min(100, Math.round(
      (v?.stimmung ?? 60)
    + (platzTeil - .5) * 9
    + (erg.aufstieg ? 6 : 0) - (erg.abstieg ? 8 : 0)
    - ueberzogen(v, erg) * 22
    + bau.fertig.length * 3
    + ereignisse.reduce((a, e) => a + (e.stimmung || 0), 0))));

  return {
    v: { ...v, kasse, sponsoren, stimmung: stimmungNeu, gehaltsniveau: gehaltNeu,
         ausbau: bau.ausbau, baustellen: bau.baustellen, ziel: null },
    beleg: { kasseVorher, einnahmen: ein.posten, ausgaben: aus.posten,
             summeEin: ein.summe, summeAus: aus.summe, ergebnis, kasse,
             zuschauer: ein.zuschauer, auslastung: ein.auslastung,
             ausgelaufen: ausgelaufen.map((s) => s.n),
             ereignisse, ziel, bau, stimmung: stimmungNeu,
             stimmungVorher: v?.stimmung ?? 60,
             gehalt: { vorher: aus.niveau, neu: gehaltNeu, kader: aus.kader } },
  };
}

/* ---------------------------------------------------------- Bauprojekte
   Kevin, zunächst: „Eine Range von 1-max. 3 Saison Dauer."
   Nach der ersten Kalibrierung: „Man sollte schon alles schaffen, wenn man
   genug Geld hat. Die Bauzeit sollte also einen nicht begrenzen. Limitieren
   wir die Bauzeit auf max 2 Jahre […]. Aber wie du sagst, eine gewisse
   Spezialisierung sollte bleiben."

   WARUM EINE BAUSTELLE JE ABTEILUNG, NICHT EINE INSGESAMT. Der erste Entwurf
   liess nur ein Projekt gleichzeitig zu. Nachgerechnet: höchstens elf der
   dreissig Ausbaustufen waren in fünfzehn Jahren zu schaffen — die ZEIT war
   die Grenze, nicht das Geld, und ein Erstligist sass auf 674 Mio, die nichts
   mehr kaufen konnten. Auch mit zwei Jahren Höchstdauer bliebe es dabei:
   dreissig Projekte nacheinander sind nie unter sechzig Saisons zu schaffen.

   Jede Abteilung baut deshalb für sich. Stadion und Gastronomie gleichzeitig:
   ja. Stadion Stufe 3 und Stufe 4 gleichzeitig: nein — man kann dieselbe
   Tribüne nicht zweimal auf einmal erweitern. Damit ist der volle Ausbau
   zeitlich möglich (jede Abteilung braucht höchstens zehn Saisons, und sie
   laufen parallel), und die Grenze ist wieder das Geld. Genau so wollte Kevin
   es: alles schaffbar, wenn man es sich leisten kann — und weil man es sich
   meist nicht leisten kann, bleibt die Spezialisierung. */
export const BAU_MAX_SAISONS = 2;
export const bauSaisons = (kosten) => (kosten <= 3 ? 1 : BAU_MAX_SAISONS);

const baustellen = (v) => (v?.baustellen && typeof v.baustellen === "object") ? v.baustellen : {};

export function bauStart(v, id) {
  const offen = baustellen(v);
  if (offen[id]) return { v, fehler: "An dieser Abteilung wird schon gebaut." };
  const k = ausbauKosten(v, id);
  if (k == null) return { v, fehler: "Schon voll ausgebaut." };
  const kasse = Number(v?.kasse) || 0;
  if (kasse < k) return { v, fehler: "Dafür fehlen " + geldText(k - kasse, v?.land) + "." };
  const dauer = bauSaisons(k);
  return { v: { ...v, kasse: Math.round((kasse - k) * 100) / 100,
                baustellen: { ...offen, [id]: { stufe: stufeVon(v, id) + 1, dauer, rest: dauer } } },
           kosten: k, dauer, fehler: null };
}

/* Alle laufenden Projekte als Text, für die Oberfläche. */
export function baustellenText(v) {
  return Object.entries(baustellen(v)).map(([id, b]) => {
    const a = AUSBAU.find((x) => x.id === id);
    return (a ? a.n : id) + " Stufe " + b.stufe + " · noch "
         + b.rest + (b.rest === 1 ? " Saison" : " Saisons");
  });
}

/* Eine Saison weiterbauen — alle Abteilungen zugleich. Fertige Projekte
   heben ihre Stufe und werden gemeldet. */
export function bauTicken(v) {
  const ausbau = { ...(v?.ausbau || {}) };
  const weiter = {}, fertig = [];
  for (const [id, b] of Object.entries(baustellen(v))) {
    const rest = (b.rest || 0) - 1;
    if (rest > 0) { weiter[id] = { ...b, rest }; continue; }
    ausbau[id] = Math.min(AUSBAU_MAX, b.stufe);
    fertig.push({ id, stufe: ausbau[id], n: (AUSBAU.find((x) => x.id === id) || {}).n || id });
  }
  return { ausbau, baustellen: weiter, fertig };
}

/* ------------------------------------------------- Abschluss nach 15 Jahren
   Kevin zur Restkasse: „Das finde ich gut was du mit dem Restgeld vorhast."

   Was übrig bleibt, war bis dahin verloren — und damit war Wirtschaften ab
   dem Jahr, in dem alles gebaut war, gleichgültig. Jetzt zählt es als
   Vermächtnis: vier Millionen ergeben einen Abschlusspunkt.

   DIE DECKELUNG BEI 250 PUNKTEN IST ABSICHT. Zum Vergleich wiegt ein Aufstieg
   120 Punkte und eine Meisterschaft 90 (`punkte` in verein.js). Ohne Deckel
   wären 674 Mio Restkasse 168 Punkte — noch vertretbar; aber eine Kasse, die
   nie ausgegeben wurde, darf kein Ersatz für sportlichen Erfolg werden.
   Schulden zählen nicht negativ: der Abschluss soll nicht zweimal bestrafen. */
export const PUNKTE_JE_MIO = 0.25;
export const PUNKTE_DECKEL = 250;
export function abschlussWirtschaft(v) {
  const kasse = Math.round((Number(v?.kasse) || 0) * 100) / 100;
  const roh = Math.max(0, kasse) * PUNKTE_JE_MIO;
  const faktor = 1 + (wirkung(v).punkteFaktor || 0);
  /* ERST RECHNEN, DANN DECKELN. Andersherum hob die Vermächtnisplakette den
     Deckel selbst an: aus 250 wurden 288, während zwei Kommentare und der
     Arbeitsplan „gedeckelt bei 250" behaupteten. Der Deckel ist die Aussage,
     der Faktor ein Vorteil darunter. */
  return { kasse, punkte: Math.min(PUNKTE_DECKEL, Math.round(roh * faktor)), faktor };
}

/* ------------------------------------------------------- Vorstandsziel
   Ein Ziel je Saison, aus der Ausgangslage abgeleitet — wie das freiwillige
   Saisonziel des Spielers. Erfüllt bringt es eine Prämie, verfehlt kostet es
   nichts: der Verein soll etwas zu erreichen haben, keine Strafe fürchten.
   Die Härte hängt an der Rechtsform: eine AG erwartet mehr als ein e.V. */
export function zielSetzen(v, letzterRang, N = 18) {
  const stufe = v?.ligastufe || 3;
  const rang = Number(letzterRang) || Math.round(N / 2);
  const rf = rechtsform(v);
  const grund = 26 / Math.pow(stufe, 1.6);
  const drittel = Math.max(3, Math.round(N / 3));
  let z;
  if (rang > N - drittel) z = { id: "halt", n: "Klassenerhalt", soll: N - drittel, lohn: .35 };
  else if (rang > drittel) z = { id: "mitte", n: "Gesicherte Mitte", soll: Math.round(N / 2), lohn: .45 };
  /* Schwelle bei Platz 2 statt 3 (Kevin, 17.09.2026). Vorher bekam ein
     Verein, der jedes Jahr Dritter wurde, dauerhaft „Um den Titel spielen"
     mit Soll 1 — und verdiente nie eine Prämie. */
  else if (rang > 2) z = { id: "oben", n: "Vorne angreifen", soll: 3, lohn: .70 };
  else z = { id: "titel", n: "Um den Titel spielen", soll: 1, lohn: 1.10 };
  return { ...z, soll: Math.max(1, Math.round(z.soll / rf.zielHaerte)),
           praemie: Math.round(grund * z.lohn * 100) / 100 };
}

/* Am Saisonende prüfen. Ohne gesetztes Ziel passiert nichts — alte
   Spielstände ohne `ziel` laufen unverändert weiter. */
export function zielPruefen(v, erg = {}) {
  const z = v?.ziel;
  if (!z) return { gesetzt: false, erfuellt: false, praemie: 0 };
  const erfuellt = (Number(erg.rang) || 99) <= z.soll;
  return { gesetzt: true, n: z.n, soll: z.soll, rang: Number(erg.rang) || null,
           erfuellt, praemie: erfuellt ? (z.praemie || 0) : 0 };
}

/* --------------------------------------------------- Wirtschaftsereignisse
   Kevin: „0-2 (0=30 % Wahrscheinlichkeit, 1=50%, 2=20%) Ereignisse pro Saison
   die Wirtschaftlichen Einfluss haben positiv wie negativ möglich."

   Die Beträge sind ANTEILE der Vereinsgrösse, keine festen Summen: 2 Mio sind
   für einen Fünftligisten eine Katastrophe und für einen Erstligisten
   Kleingeld. Bezugsgrösse ist der Grundbetrag der Ligastufe. */
export const WIRTSCHAFTSEREIGNISSE = [
  { id: "sturm",     n: "Sturmschaden am Dach",        art: "minus", anteil: -.55, stimmung: -2,
    t: "Eine Novembernacht kostet die Nordtribüne ihr halbes Dach." },
  { id: "steuer",    n: "Steuernachzahlung",           art: "minus", anteil: -.40, stimmung: 0,
    t: "Das Finanzamt sieht drei Jahre anders als der Verein." },
  { id: "ausfall",   n: "Geisterspiel",                art: "minus", anteil: -.30, stimmung: -3,
    t: "Ein Heimspiel ohne Zuschauer. Die Kosten bleiben, die Einnahmen nicht." },
  { id: "strafe",    n: "Verbandsstrafe",              art: "minus", anteil: -.25, stimmung: -4,
    t: "Pyrotechnik im Gästeblock, und der Verband schickt die Rechnung." },
  { id: "abgang",    n: "Sponsor springt ab",          art: "minus", anteil: -.35, stimmung: -2,
    t: "Der Partner zieht sich zurück, das Logo verschwindet von der Brust." },
  { id: "pokal",     n: "Pokalüberraschung",           art: "plus",  anteil: .60,  stimmung: +5,
    t: "Eine Runde weiter als alle dachten — ausverkauftes Haus inklusive." },
  { id: "transfer",  n: "Weiterverkaufsbeteiligung",   art: "plus",  anteil: .50,  stimmung: 0,
    t: "Ein früherer Eigengewächs wechselt teuer, und der Verein verdient mit." },
  { id: "spende",    n: "Nachlass eines Mitglieds",    art: "plus",  anteil: .35,  stimmung: +2,
    t: "Sechzig Jahre Dauerkarte, und am Ende ein Vermächtnis." },
  { id: "tv",        n: "Nachzahlung der Liga",        art: "plus",  anteil: .30,  stimmung: 0,
    t: "Der Vermarktungserlös fiel höher aus als geplant." },
  { id: "jubilaeum", n: "Jubiläumsspiel",              art: "plus",  anteil: .25,  stimmung: +4,
    t: "Ein Freundschaftsspiel gegen alte Helden füllt Stadion und Kasse." },
];

/* Anzahl nach Kevins Verteilung: 30 % keins, 50 % eins, 20 % zwei. */
export function ereignisAnzahl(zufall) {
  const x = zufall();
  return x < .30 ? 0 : x < .80 ? 1 : 2;
}

export function ereignisseZiehen(v, saat = 0) {
  const r = streuung((Number(saat) || 0) + 77);
  const anzahl = ereignisAnzahl(r);
  if (!anzahl) return [];
  const stufe = v?.ligastufe || 3;
  const grund = 26 / Math.pow(stufe, 1.6);
  const gemischt = WIRTSCHAFTSEREIGNISSE.map((e) => ({ e, k: r() }))
    .sort((a, b) => a.k - b.k).map((x) => x.e);
  return gemischt.slice(0, anzahl).map((e) => ({
    id: e.id, n: e.n, t: e.t, art: e.art, stimmung: e.stimmung,
    geld: Math.round(grund * e.anteil * (.8 + r() * .4) * 100) / 100,
  }));
}

/* ------------------------------------------------------------ Kaufen */
export const ausbauStufe = stufeVon;
export const ausbauKosten = (v, id) => {
  const a = AUSBAU.find((x) => x.id === id);
  const st = stufeVon(v, id);
  return (a && st < AUSBAU_MAX) ? a.kosten[st] : null;            /* null = fertig */
};

/* Ausbau mit Geld aus der Vereinskasse. Prüft VOR dem Schreiben, wie
   `buchungen.js` es für Karten und Coins tut. */
export function ausbauKaufen(v, id) {
  const k = ausbauKosten(v, id);
  if (k == null) return { v, kosten: 0, fehler: "Schon voll ausgebaut." };
  const kasse = Number(v?.kasse) || 0;
  if (kasse < k) return { v, kosten: 0,
    fehler: "Dafür fehlen " + geldText(k - kasse, v?.land) + "." };
  return { v: { ...v, kasse: Math.round((kasse - k) * 100) / 100,
                ausbau: { ...(v.ausbau || {}), [id]: stufeVon(v, id) + 1 } },
           kosten: k, fehler: null };
}

/* VC-Extra kaufen. Der VC-Vorrat liegt in der Akademie, nicht am Verein —
   deshalb kommt er als Zahl herein und die Buchung geht ausserhalb weiter,
   genau wie beim Packkauf. */
export function extraKaufen(v, id, vcVorrat) {
  const e = VC_EXTRAS.find((x) => x.id === id);
  if (!e) return { v, kosten: 0, fehler: "Unbekanntes Extra." };
  if ((v?.extras || []).includes(id)) return { v, kosten: 0, fehler: "Schon vorhanden." };
  if ((Number(vcVorrat) || 0) < e.vc) return { v, kosten: 0,
    fehler: "Dafür fehlen " + (e.vc - (Number(vcVorrat) || 0)) + " VC." };
  const neu = { ...v, extras: [...(v?.extras || []), id] };
  if (e.fx && e.fx.kasse) neu.kasse = Math.round(((Number(v?.kasse) || 0) + e.fx.kasse) * 100) / 100;
  return { v: neu, kosten: e.vc, fehler: null };
}
