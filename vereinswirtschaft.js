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
  { id: "scoutnetz", n: "Scoutnetz", vc: 70, einmalig: true,
    t: "Späher in drei Ländern, die auch nach dem Verein weiterarbeiten.",
    wirkt: "Bleibt der Akademie erhalten", fx: { akademieAufnahmen: 1 } },
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
  dazu("Zuschauer · " + Math.round(plaetze(v) * auslastung).toLocaleString("de-DE")
       + " × " + heimspiele + " Heimspiele",
       plaetze(v) * auslastung * preis * heimspiele / 1e6 * ticketFaktor);

  /* Gastronomie: Umsatz je Besucher, abhängig von der Gastrostufe. */
  const gastroStufe = stufeVon(v, "gastro");
  const jeBesucher = 2.2 + (gastroStufe - 1) * 2.6;
  dazu("Gastronomie · Stufe " + gastroStufe,
       plaetze(v) * auslastung * jeBesucher * heimspiele / 1e6 * (1 + (w.gastroFaktor || 0)));

  /* Merchandising: Sortiment mal Reichweite mal Bekanntheit. Ohne Reichweite
     bringt das beste Sortiment wenig — deshalb Produkt, nicht Summe. */
  const sortiment = stufeVon(v, "sortiment");
  const reichweite = Math.min(AUSBAU_MAX, stufeVon(v, "reichweite") + (w.reichweite || 0));
  dazu("Merchandising · Sortiment " + sortiment + " · Vertrieb " + reichweite,
       sortiment * reichweite * ruf * .55 * (1 + (w.merchFaktor || 0)));

  /* Prämien: Grundbetrag der Ligastufe plus Platzierung, Aufstieg, Titel. */
  const grund = 26 / Math.pow(stufe, 1.15);
  dazu("Fernsehgeld und Prämien · Liga " + stufe, grund * (.6 + platzTeil * .8));
  if (erg.aufstieg) dazu("Aufstiegsprämie", grund * .9);
  if (rang === 1) dazu("Meisterprämie", grund * .7);

  (v?.sponsoren || []).forEach((s) => dazu("Sponsor · " + s.n + " (noch " + s.rest + ")", s.betrag));

  const summe = Math.round(posten.reduce((a, x) => a + x.v, 0) * 100) / 100;
  return { posten, summe, auslastung, zuschauer: Math.round(plaetze(v) * auslastung) };
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

   SPIELERGEHÄLTER SIND HIER NICHT EINZELN ABGEBILDET. Der Posten schätzt sie
   pauschal mit. Echte Verträge je Spieler hängen am Kader, ändern die
   Transferlogik und gehören in ein eigenes Paket — siehe Arbeitsplan
   WIRT-P1-03. Wer das baut, ersetzt diesen Posten, statt ihn zu ergänzen. */
export function saisonKosten(v) {
  const posten = [];
  const dazu = (k, betrag) => { const x = Math.round(betrag * 100) / 100; if (x > 0) posten.push({ k, v: x }); };
  const stufe = v?.ligastufe || 3;
  const stufen = AUSBAU.reduce((a, x) => a + (stufeVon(v, x.id) - 1), 0);
  /* Der Exponent 1,5 ist nachgerechnet, nicht geschätzt. Mit 0,85 zahlte ein
     Fünftligist 7,3 Mio Personal bei 9,1 Mio Einnahmen und stand fünfzehn
     Jahre im Minus, ohne je eine Ausbaustufe zu erreichen — aus „sich
     hocharbeiten" wurde „nichts geht". Mit 1,5 zahlt er 1,8 und wächst
     langsam, während ein Erstligist 20 zahlt. */
  dazu("Personal und Mannschaft", 20 / Math.pow(stufe, 1.5) + plaetze(v) / 1000 * .40);
  dazu("Betrieb und Unterhalt", 1.2 + stufen * 0.85);
  dazu("Spielbetrieb und Reisen", Math.max(.5, 3.5 / Math.pow(stufe, .5)));
  const summe = Math.round(posten.reduce((a, x) => a + x.v, 0) * 100) / 100;
  return { posten, summe };
}

/* Die vollständige Abrechnung einer Saison: Einnahmen minus Kosten auf die
   Kasse, Sponsorenverträge um ein Jahr weiter. Ein Beleg, den Buchung und
   Anzeige gemeinsam benutzen. */
export function saisonAbrechnung(v, erg = {}) {
  const ein = saisonEinnahmen(v, erg);
  const aus = saisonKosten(v);
  const { sponsoren, ausgelaufen } = sponsorenTicken(v);
  const kasseVorher = Math.round((Number(v?.kasse) || 0) * 100) / 100;
  const kasse = Math.round((kasseVorher + ein.summe - aus.summe) * 100) / 100;
  return {
    v: { ...v, kasse, sponsoren },
    beleg: { kasseVorher, einnahmen: ein.posten, ausgaben: aus.posten,
             summeEin: ein.summe, summeAus: aus.summe,
             ergebnis: Math.round((ein.summe - aus.summe) * 100) / 100,
             kasse, zuschauer: ein.zuschauer, auslastung: ein.auslastung,
             ausgelaufen: ausgelaufen.map((s) => s.n) },
  };
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
