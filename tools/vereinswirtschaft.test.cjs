/* Regressionen zum Wirtschaftskern der Profimannschaft (WIRT-P0-01).
   Geprüft wird das Verhalten, nicht die Kalibrierung: dass Geld nur über
   belegte Posten entsteht, dass Kaufen vor dem Schreiben prüft und dass
   Sponsorenangebote reproduzierbar sind. Ob die Beträge Spaß machen, sagt
   erst ein Langzeitlauf und der Gerätetest. */
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
let W;
before(async () => { W = await import('../vereinswirtschaft.js'); });

const verein = (zu = {}) => ({
  land: 'GER', ligastufe: 2, kasse: 0, sponsoren: [], extras: [],
  ausbau: { stadion: 1, gastro: 1, sortiment: 1, reichweite: 1, training: 1, medizin: 1 },
  bilanz: { saisons: 0, aufstiege: 0, abstiege: 0, meister: 0, punkte: 0, bestePlatzierung: null },
  ...zu,
});
const erg = (zu = {}) => ({ rang: 8, N: 18, aufstieg: false, abstieg: false, ...zu });

test('Währung: Anzeige folgt dem Land, Rechnung bleibt in Euro', () => {
  assert.equal(W.waehrungFuer('GER').code, 'EUR');
  assert.equal(W.waehrungFuer('JPN').code, 'JPY');
  assert.equal(W.waehrungFuer('gibtesnicht').code, 'EUR', 'unbekanntes Land fällt auf Euro zurück');
  /* Derselbe Euro-Betrag, zwei Länder: die Zahl wächst mit dem Kurs, der
     gespeicherte Wert bleibt unberührt. */
  assert(W.geldText(10, 'GER').includes('€'));
  assert(W.geldText(10, 'JPN').includes('¥'));
  assert.equal(W.geldText(0.25, 'GER'), '250 Tsd €');
  assert.equal(W.geldText(1.5, 'GER'), '1,5 Mio €');
  assert.equal(W.geldText(-3, 'GER', false), '-3 Mio', 'Minusbeträge bleiben lesbar');
  assert.equal(W.geldText(10, 'JPN'), '1,6 Mrd ¥', 'grosse Landeswährungen wechseln auf Milliarden');
});

test('Einnahmen entstehen nur aus belegten Posten und die Summe stimmt', () => {
  const v = verein({ ausbau: { stadion: 3, gastro: 2, sortiment: 2, reichweite: 2, training: 1, medizin: 1 } });
  const e = W.saisonEinnahmen(v, erg());
  assert(e.posten.length >= 4, 'Zuschauer, Gastro, Merch und Prämien');
  assert(e.posten.every((p) => typeof p.k === 'string' && p.k.length > 0 && p.v > 0));
  const summe = e.posten.reduce((a, x) => a + x.v, 0);
  assert(Math.abs(summe - e.summe) < 0.02, 'Summe ist die Summe der Posten');
  assert(e.auslastung > 0.35 && e.auslastung <= 0.99);
  assert.equal(e.zuschauer, Math.round(W.plaetze(v) * e.auslastung));
});

test('Ausbau wirkt auf die Einnahmen: mehr Stufen, mehr Geld', () => {
  const klein = verein();
  const gross = verein({ ausbau: { stadion: 6, gastro: 6, sortiment: 6, reichweite: 6, training: 1, medizin: 1 } });
  assert(W.saisonEinnahmen(gross, erg()).summe > W.saisonEinnahmen(klein, erg()).summe * 3,
    'Vollausbau bringt ein Vielfaches');
  assert(W.plaetze(gross) > W.plaetze(klein));
});

test('Erfolg zahlt sich aus: Platzierung, Aufstieg und Titel schlagen durch', () => {
  const v = verein({ ausbau: { stadion: 3, gastro: 2, sortiment: 2, reichweite: 2, training: 1, medizin: 1 } });
  const letzter = W.saisonEinnahmen(v, erg({ rang: 18 })).summe;
  const mitte = W.saisonEinnahmen(v, erg({ rang: 9 })).summe;
  const erster = W.saisonEinnahmen(v, erg({ rang: 1 })).summe;
  assert(letzter < mitte && mitte < erster, 'bessere Platzierung bringt mehr');
  assert(W.saisonEinnahmen(v, erg({ rang: 2, aufstieg: true })).summe
       > W.saisonEinnahmen(v, erg({ rang: 2 })).summe, 'Aufstiegsprämie kommt dazu');
  const meister = W.saisonEinnahmen(v, erg({ rang: 1 }));
  assert(meister.posten.some((p) => p.k.startsWith('Meisterprämie')));
});

test('Ligastufe trägt die Grössenordnung: erste Liga verdient mehr als vierte', () => {
  const bau = { stadion: 4, gastro: 3, sortiment: 3, reichweite: 3, training: 1, medizin: 1 };
  const erste = W.saisonEinnahmen(verein({ ligastufe: 1, ausbau: bau }), erg()).summe;
  const vierte = W.saisonEinnahmen(verein({ ligastufe: 4, ausbau: bau }), erg()).summe;
  assert(erste > vierte * 1.8, 'erste Liga deutlich über vierter, nicht nur ein bisschen');
});

test('Abrechnung: Kasse ändert sich genau um das ausgewiesene Ergebnis', () => {
  const v = verein({ kasse: 5, ausbau: { stadion: 3, gastro: 2, sortiment: 2, reichweite: 2, training: 2, medizin: 2 } });
  const { v: neu, beleg } = W.saisonAbrechnung(v, erg());
  assert.equal(beleg.kasseVorher, 5);
  /* Das Ergebnis ist Einnahmen − Kosten + Ereignisse + Vorstandsprämie.
     Jeder Teil steht einzeln im Beleg, damit nichts unerklärt auftaucht. */
  const ereignisGeld = beleg.ereignisse.reduce((a, e) => a + e.geld, 0);
  assert(Math.abs(beleg.ergebnis - (beleg.summeEin - beleg.summeAus + ereignisGeld + beleg.ziel.praemie)) < 0.02);
  assert(Math.abs(neu.kasse - (5 + beleg.ergebnis)) < 0.02);
  assert.equal(neu.kasse, beleg.kasse, 'Beleg und Buchung nennen dieselbe Kasse');
  assert(beleg.ausgaben.length >= 2 && beleg.summeAus > 0, 'Kosten sind nicht null');
  assert.deepEqual(v.ausbau, { stadion: 3, gastro: 2, sortiment: 2, reichweite: 2, training: 2, medizin: 2 },
    'Eingabeverein bleibt unverändert');
});

test('Ein Verein ohne Ausbau im Unterhaus kann rote Zahlen schreiben', () => {
  const v = verein({ ligastufe: 5, kasse: 0 });
  const { beleg } = W.saisonAbrechnung(v, erg({ rang: 16, N: 18 }));
  assert(beleg.summeAus > 0);
  assert(typeof beleg.ergebnis === 'number' && Number.isFinite(beleg.ergebnis));
  /* Kein Automatismus nach oben: die Kasse darf sinken. */
  assert(beleg.kasse === Math.round((beleg.kasseVorher + beleg.ergebnis) * 100) / 100);
});

test('Sponsorenangebote sind reproduzierbar, überschneidungsfrei und laufen ab', () => {
  const v = verein();
  const a1 = W.sponsorAngebote(v, 4711, 3);
  const a2 = W.sponsorAngebote(v, 4711, 3);
  assert.deepEqual(a1, a2, 'gleiche Saat, gleiche Angebote');
  assert.notDeepEqual(a1, W.sponsorAngebote(v, 4712, 3), 'andere Saat, andere Angebote');
  assert.equal(a1.length, 3);
  assert.equal(new Set(a1.map((x) => x.id)).size, 3, 'keine Firma doppelt');
  assert(a1.every((x) => x.betrag > 0 && x.laufzeit >= 1 && x.laufzeit <= 4));

  const { v: mit, fehler } = W.sponsorAnnehmen(v, a1[0]);
  assert.equal(fehler, null);
  assert.equal(mit.sponsoren.length, 1);
  assert.equal(W.sponsorAnnehmen(mit, a1[0]).fehler, 'Diese Firma ist bereits Partner.');
  assert(!W.sponsorAngebote(mit, 4711, 3).some((x) => x.id === a1[0].id),
    'laufender Partner wird nicht erneut angeboten');

  /* Laufzeit herunterzählen bis zum Ende. */
  let lauf = mit, runden = 0;
  while (lauf.sponsoren.length && runden++ < 10) {
    const t = W.sponsorenTicken(lauf);
    lauf = { ...lauf, sponsoren: t.sponsoren };
  }
  assert.equal(lauf.sponsoren.length, 0, 'jeder Vertrag endet');
  assert.equal(runden, a1[0].laufzeit, 'er endet genau nach seiner Laufzeit');
});

test('Sponsorenbeträge folgen Ligastufe und Erfolg', () => {
  const unten = W.sponsorAngebote(verein({ ligastufe: 5 }), 99, 3);
  const oben = W.sponsorAngebote(verein({ ligastufe: 1, bilanz: { meister: 3, aufstiege: 2, abstiege: 0 } }), 99, 3);
  const mittel = (a) => a.reduce((s, x) => s + x.betrag, 0) / a.length;
  assert(mittel(oben) > mittel(unten) * 1.5, 'ein Meister der ersten Liga bekommt deutlich mehr');
  assert(W.ansehen(verein({ ligastufe: 1 }), 1) > W.ansehen(verein({ ligastufe: 4 }), 4));
});

test('Sponsorenvorteile wirken auf die Einnahmen und verschwinden mit dem Vertrag', () => {
  const v = verein({ ausbau: { stadion: 3, gastro: 3, sortiment: 3, reichweite: 3, training: 1, medizin: 1 } });
  const ohne = W.saisonEinnahmen(v, erg()).summe;
  const merch = { id: 'tramonto', n: 'Tramonto Sportswear', betrag: 0, rest: 2, laufzeit: 2, fx: { merchFaktor: .30 } };
  const mit = W.saisonEinnahmen({ ...v, sponsoren: [merch] }, erg()).summe;
  assert(mit > ohne, 'der Merch-Vorteil erhöht die Einnahmen');
  assert.equal(W.wirkung({ ...v, sponsoren: [merch] }).merchFaktor, .30);
  assert.equal(W.wirkung(v).merchFaktor, undefined, 'ohne Vertrag keine Wirkung');
});

test('Ausbau kaufen: prüft vor dem Schreiben und bucht genau einmal ab', () => {
  const v = verein({ kasse: 3 });
  const zuTeuer = W.ausbauKaufen(v, 'stadion');          /* Stufe 1 -> 2 kostet 4 Mio */
  assert(zuTeuer.fehler && zuTeuer.fehler.includes('fehlen'));
  assert.equal(zuTeuer.v.kasse, 3, 'bei Fehler wird nichts gebucht');
  assert.equal(W.ausbauStufe(zuTeuer.v, 'stadion'), 1);

  const reich = W.ausbauKaufen(verein({ kasse: 10 }), 'stadion');
  assert.equal(reich.fehler, null);
  assert.equal(reich.kosten, 4);
  assert.equal(reich.v.kasse, 6);
  assert.equal(W.ausbauStufe(reich.v, 'stadion'), 2);

  /* Vollausbau meldet sich als fertig statt weiterzuzählen. */
  const voll = verein({ kasse: 999, ausbau: { stadion: W.AUSBAU_MAX } });
  assert.equal(W.ausbauKosten(voll, 'stadion'), null);
  assert.equal(W.ausbauKaufen(voll, 'stadion').fehler, 'Schon voll ausgebaut.');
});

test('Alle Ausbaustufen sind bezahlbar beschrieben und vollständig', () => {
  for (const a of W.AUSBAU) {
    assert.equal(a.kosten.length, W.AUSBAU_MAX, a.id + ': eine Kostenangabe je Stufe');
    assert.equal(a.kosten[0], 0, a.id + ': Stufe 1 ist der Anfangszustand');
    for (let i = 1; i < a.kosten.length; i++)
      assert(a.kosten[i] > a.kosten[i - 1], a.id + ': jede Stufe kostet mehr als die vorige');
    assert(a.n && a.t && a.wirkt, a.id + ': Name, Text und Wirkung sind gefüllt');
    assert.equal(a.art, 'geld');
  }
  /* Die drei alten Kennungen bleiben erhalten — laufende Vereine hängen daran. */
  for (const id of ['training', 'stadion', 'medizin'])
    assert(W.AUSBAU.some((a) => a.id === id), 'alte Ausbaukennung ' + id + ' fehlt');
});

test('VC-Extras: einmalig, geprüft, und nur wenige', () => {
  assert(W.VC_EXTRAS.length <= 5, 'VC bleibt die Währung der Akademie');
  assert(W.VC_EXTRAS.every((e) => e.vc > 0 && e.einmalig && e.n && e.t && e.wirkt));

  const v = verein({ kasse: 1 });
  assert(W.extraKaufen(v, 'startkapital', 10).fehler.includes('fehlen'));
  assert.equal(W.extraKaufen(v, 'startkapital', 10).v.kasse, 1, 'bei Fehler keine Gutschrift');

  const gekauft = W.extraKaufen(v, 'startkapital', 100);
  assert.equal(gekauft.fehler, null);
  assert.equal(gekauft.kosten, 45);
  assert.equal(gekauft.v.kasse, 13, 'Gründungskapital landet in der Kasse');
  assert.deepEqual(gekauft.v.extras, ['startkapital']);
  assert.equal(W.extraKaufen(gekauft.v, 'startkapital', 100).fehler, 'Schon vorhanden.');
  assert.equal(W.extraKaufen(v, 'gibtesnicht', 100).fehler, 'Unbekanntes Extra.');
});

test('Gekaufte Extras wirken wie beschrieben', () => {
  const v = verein({ ausbau: { stadion: 4, gastro: 2, sortiment: 2, reichweite: 2, training: 1, medizin: 1 } });
  const ohne = W.saisonEinnahmen(v, erg()).summe;
  const mit = W.saisonEinnahmen({ ...v, extras: ['namensrecht'] }, erg()).summe;
  assert(mit > ohne, 'Namensrecht erhöht die Ticketeinnahmen');
  assert.equal(W.wirkung({ ...v, extras: ['ewigkeit'] }).punkteFaktor, .15);
});

test('Alles bleibt endlich: keine NaN, keine Unendlichkeiten in Grenzlagen', () => {
  const faelle = [
    verein({ ligastufe: 1, ausbau: { stadion: 6, gastro: 6, sortiment: 6, reichweite: 6, training: 6, medizin: 6 },
             bilanz: { meister: 15, aufstiege: 6, abstiege: 0 } }),
    verein({ ligastufe: 9, ausbau: {}, bilanz: { abstiege: 9 } }),
    { land: 'JPN' },                                    /* fast leerer Verein */
    {},
  ];
  for (const v of faelle) for (const e of [erg(), erg({ rang: 1, N: 2 }), erg({ rang: 20, N: 20, abstieg: true })]) {
    const { beleg } = W.saisonAbrechnung(v, e);
    for (const k of ['summeEin', 'summeAus', 'ergebnis', 'kasse'])
      assert(Number.isFinite(beleg[k]), k + ' ist keine Zahl bei ' + JSON.stringify(v).slice(0, 40));
    assert(beleg.zuschauer >= 0 && Number.isFinite(beleg.zuschauer));
  }
});

/* ===================== Runde 2: die fünf Vereinsführungs-Systeme ===================== */

test('Bauprojekte: Geld sofort weg, Stufe nach höchstens zwei Saisons', () => {
  assert.equal(W.BAU_MAX_SAISONS, 2);
  assert.equal(W.bauSaisons(0.8), 1);
  assert.equal(W.bauSaisons(3), 1);
  assert.equal(W.bauSaisons(4), 2);
  assert.equal(W.bauSaisons(55), 2, 'auch das teuerste Projekt dauert höchstens zwei Saisons');
  for (const a of W.AUSBAU) for (const k of a.kosten.slice(1))
    assert(W.bauSaisons(k) >= 1 && W.bauSaisons(k) <= W.BAU_MAX_SAISONS, a.id + ' bei ' + k + ' Mio');

  const v = verein({ kasse: 20 });
  const start = W.bauStart(v, 'stadion');                 /* 4 Mio, also 2 Saisons */
  assert.equal(start.fehler, null);
  assert.equal(start.kosten, 4);
  assert.equal(start.dauer, 2);
  assert.equal(start.v.kasse, 16, 'sofort bezahlt');
  assert.equal(W.ausbauStufe(start.v, 'stadion'), 1, 'die Stufe steigt noch nicht');
  assert(W.baustellenText(start.v)[0].includes('Stadion'));

  /* Dieselbe Abteilung nicht zweimal, eine andere sehr wohl. */
  assert.equal(W.bauStart(start.v, 'stadion').fehler, 'An dieser Abteilung wird schon gebaut.');
  const zwei = W.bauStart(start.v, 'gastro');
  assert.equal(zwei.fehler, null, 'zwei Abteilungen dürfen gleichzeitig bauen');
  assert.equal(W.baustellenText(zwei.v).length, 2);
  assert(W.bauStart(verein({ kasse: 1 }), 'stadion').fehler.includes('fehlen'));

  /* Gastro (1 Mio) ist nach einer Saison fertig, Stadion erst nach zweien. */
  const nach1 = W.saisonAbrechnung(zwei.v, erg(), 1);
  assert.equal(W.ausbauStufe(nach1.v, 'gastro'), 2, 'das kurze Projekt steht');
  assert.equal(W.ausbauStufe(nach1.v, 'stadion'), 1, 'das lange noch nicht');
  assert.equal(nach1.beleg.bau.fertig.length, 1);
  const nach2 = W.saisonAbrechnung(nach1.v, erg(), 2);
  assert.equal(W.ausbauStufe(nach2.v, 'stadion'), 2);
  assert.equal(W.baustellenText(nach2.v).length, 0, 'keine Baustelle mehr offen');
});

test('Mit genug Geld ist der Vollausbau zeitlich erreichbar', () => {
  /* Kevins Vorgabe: „Man sollte schon alles schaffen, wenn man genug Geld
     hat. Die Bauzeit sollte also einen nicht begrenzen." Geprüft mit einer
     Kasse, die nie leer wird — dann darf nur die Bauzeit bremsen. */
  let v = verein({ kasse: 10000 });
  let saisons = 0;
  while (saisons < 15) {
    for (const a of W.AUSBAU) if (W.ausbauKosten(v, a.id) != null) {
      const r = W.bauStart(v, a.id);
      if (!r.fehler) v = r.v;
    }
    v = W.saisonAbrechnung({ ...v, kasse: 10000 }, erg(), saisons).v;
    saisons++;
    if (W.AUSBAU.every((a) => W.ausbauStufe(v, a.id) === W.AUSBAU_MAX)) break;
  }
  const stufen = W.AUSBAU.reduce((a, x) => a + (W.ausbauStufe(v, x.id) - 1), 0);
  assert.equal(stufen, 30, 'alle dreissig Stufen erreicht, nicht nur elf');
  assert(saisons <= 12, 'und zwar in ' + saisons + ' Saisons, also innerhalb der fünfzehn');
});

test('Restkasse wird am Abschluss zu Vermächtnispunkten', () => {
  assert.equal(W.abschlussWirtschaft(verein({ kasse: 0 })).punkte, 0);
  assert.equal(W.abschlussWirtschaft(verein({ kasse: 100 })).punkte, 25, '4 Mio je Punkt');
  assert.equal(W.abschlussWirtschaft(verein({ kasse: -50 })).punkte, 0, 'Schulden zählen nicht negativ');
  /* Der Deckel verhindert, dass eine nie ausgegebene Kasse den Sport ersetzt. */
  assert.equal(W.abschlussWirtschaft(verein({ kasse: 99999 })).punkte, W.PUNKTE_DECKEL);
  /* Das VC-Extra „Vermächtnisplakette" wirkt hier — und nur hier. */
  const mit = W.abschlussWirtschaft(verein({ kasse: 100, extras: ['ewigkeit'] }));
  assert.equal(mit.faktor, 1.15);
  assert.equal(mit.punkte, Math.round(25 * 1.15));
  assert.equal(W.abschlussWirtschaft(verein({ kasse: 100 })).faktor, 1);
});

test('Preise: wer nichts zu bieten hat, kann nicht erhöhen', () => {
  const stark = verein({ ligastufe: 1, bilanz: { meister: 3, aufstiege: 2, abstiege: 0 } });
  const schwach = verein({ ligastufe: 5, bilanz: { abstiege: 2 } });
  /* Kevins erstes Beispiel: der schwache Verein hat sein Ertragsmaximum bei
     oder unter Normalpreis, der starke deutlich darüber. */
  assert(W.bestPreis(stark, 'ticket') > W.bestPreis(schwach, 'ticket') + 0.15,
    'Ansehen entscheidet, wie viel man verlangen darf');
  assert(W.bestPreis(schwach, 'ticket') <= 1.05, 'ein schwacher Verein kann kaum erhöhen');

  /* Kevins zweites Beispiel: schlechte Gastro verträgt keine hohen Preise. */
  const gastroMies = verein({ ausbau: { gastro: 1 } });
  const gastroGut = verein({ ausbau: { gastro: 6 } });
  assert(W.bestPreis(gastroMies, 'gastro') < 1, 'Stufe 1 muss unter Normalpreis bleiben');
  assert(W.bestPreis(gastroGut, 'gastro') > 1.25, 'Stufe 6 darf deutlich zulangen');

  /* Merch hängt an Sortiment UND Vertrieb. */
  assert(W.bestPreis(verein({ ausbau: { sortiment: 6, reichweite: 6 } }), 'merch')
       > W.bestPreis(verein({ ausbau: { sortiment: 1, reichweite: 1 } }), 'merch'));
});

test('Preise: am Optimum bringt der Regler am meisten, darüber weniger', () => {
  const v = verein({ ligastufe: 2, ausbau: { stadion: 4, gastro: 3, sortiment: 3, reichweite: 3, training: 1, medizin: 1 } });
  /* `bestPreis` ist ein Versprechen an den Spieler: kein anderer Reglerwert
     bringt mehr. Genau das wird geprüft — über das ganze Band, für alle drei
     Preise, und nicht nur gegen den Normalpreis. */
  for (const feld of ['ticket', 'gastro', 'merch']) {
    const opt = W.bestPreis(v, feld);
    const ertrag = (f) => W.saisonEinnahmen({ ...v, preise: { [feld]: f } }, erg()).summe;
    const beste = ertrag(opt);
    for (let f = W.PREIS_MIN; f <= W.PREIS_MAX + 1e-9; f = Math.round((f + 0.05) * 100) / 100)
      assert(ertrag(f) <= beste + 0.02,
        feld + ': Faktor ' + f.toFixed(2) + ' bringt ' + ertrag(f).toFixed(2)
        + ' und schlägt damit das angezeigte Optimum ' + opt + ' (' + beste.toFixed(2) + ')');
    assert(ertrag(W.PREIS_MAX) < beste, feld + ': der teuerste Preis ist nicht der beste');
    assert(ertrag(W.PREIS_MIN) < beste, feld + ': verschenken lohnt auch nicht');
  }
  /* Zu hohe Preise kosten zusätzlich Stimmung — der Schaden wirkt weiter. */
  const gierig = W.saisonAbrechnung({ ...v, preise: { ticket: 1.6, gastro: 1.6, merch: 1.6 } }, erg(), 5);
  const fair = W.saisonAbrechnung({ ...v, preise: { ticket: 1, gastro: 1, merch: 1 } }, erg(), 5);
  assert(gierig.v.stimmung < fair.v.stimmung, 'Überteuerung verprellt die Fans');
});

test('Stimmung bewegt sich träge und wirkt auf Zuschauer', () => {
  const v = verein({ ausbau: { stadion: 4 }, stimmung: 60 });
  const froh = W.saisonEinnahmen({ ...v, stimmung: 95 }, erg()).zuschauer;
  const sauer = W.saisonEinnahmen({ ...v, stimmung: 15 }, erg()).zuschauer;
  assert(froh > sauer, 'gute Stimmung füllt das Stadion');
  /* Höchstens gut zehn Punkte je Saison, in beide Richtungen. */
  for (const e of [erg({ rang: 1, aufstieg: true }), erg({ rang: 18, abstieg: true })]) {
    const n = W.saisonAbrechnung(v, e, 3).v.stimmung;
    assert(Math.abs(n - 60) <= 14, 'Stimmungssprung zu gross: ' + n);
    assert(n >= 0 && n <= 100);
  }
});

test('Vorstandsziel: aus der Ausgangslage abgeleitet, Prämie nur bei Erfolg', () => {
  const v = verein({ ligastufe: 2 });
  assert.equal(W.zielSetzen(v, 17, 18).id, 'halt', 'wer unten stand, soll die Liga halten');
  assert.equal(W.zielSetzen(v, 9, 18).id, 'mitte');
  assert.equal(W.zielSetzen(v, 5, 18).id, 'oben');
  assert.equal(W.zielSetzen(v, 2, 18).id, 'titel');
  const z = W.zielSetzen(v, 9, 18);
  assert(z.praemie > 0 && z.soll >= 1);

  const mitZiel = { ...v, ziel: z };
  assert.equal(W.zielPruefen(mitZiel, erg({ rang: z.soll })).erfuellt, true);
  assert.equal(W.zielPruefen(mitZiel, erg({ rang: z.soll })).praemie, z.praemie);
  assert.equal(W.zielPruefen(mitZiel, erg({ rang: z.soll + 1 })).erfuellt, false);
  assert.equal(W.zielPruefen(mitZiel, erg({ rang: z.soll + 1 })).praemie, 0, 'verfehlt kostet nichts');
  assert.equal(W.zielPruefen(v, erg()).gesetzt, false, 'ohne Ziel passiert nichts');

  /* Eine AG erwartet mehr als ein e.V. */
  const evZiel = W.zielSetzen({ ...v, rechtsform: 'ev' }, 9, 18);
  const agZiel = W.zielSetzen({ ...v, rechtsform: 'ag' }, 9, 18);
  assert(agZiel.soll <= evZiel.soll, 'die AG verlangt mindestens denselben Platz');
});

test('Wirtschaftsereignisse: 0 bis 2 je Saison in Kevins Verteilung', () => {
  /* Die Verteilung 30/50/20 direkt an der Funktion geprüft. */
  const zahl = { 0: 0, 1: 0, 2: 0 };
  for (let i = 0; i < 6000; i++) {
    let x = (i + 0.5) / 6000;                              /* gleichverteilt über [0,1) */
    zahl[W.ereignisAnzahl(() => x)]++;
  }
  assert(Math.abs(zahl[0] / 6000 - .30) < .01, 'keins: ' + (zahl[0] / 6000));
  assert(Math.abs(zahl[1] / 6000 - .50) < .01, 'eins: ' + (zahl[1] / 6000));
  assert(Math.abs(zahl[2] / 6000 - .20) < .01, 'zwei: ' + (zahl[2] / 6000));

  /* Reproduzierbar, positiv wie negativ möglich, Beträge skalieren mit der Liga. */
  const v = verein();
  assert.deepEqual(W.ereignisseZiehen(v, 12), W.ereignisseZiehen(v, 12));
  let plus = 0, minus = 0, gross = 0, klein = 0;
  for (let s = 0; s < 400; s++) {
    for (const e of W.ereignisseZiehen(verein({ ligastufe: 1 }), s)) { if (e.geld > 0) plus++; else minus++; gross += Math.abs(e.geld); }
    for (const e of W.ereignisseZiehen(verein({ ligastufe: 5 }), s)) klein += Math.abs(e.geld);
  }
  assert(plus > 0 && minus > 0, 'es gibt gute und schlechte Nachrichten');
  assert(gross > klein * 3, 'ein Erstligist erlebt grössere Beträge als ein Fünftligist');
  assert(W.WIRTSCHAFTSEREIGNISSE.every((e) => e.n && e.t && (e.art === 'plus' || e.art === 'minus')));
});

test('Rechtsform: nur nach vorn, nur ab Grösse, mit Einlage und Stimmungskosten', () => {
  const klein = verein({ ligastufe: 5, kasse: 50 });
  assert(W.rechtsformWechseln(klein, 'ag').fehler.includes('zu klein'));
  assert.equal(W.rechtsform(klein).id, 'ev', 'Voreinstellung ist der e.V.');

  const gross = verein({ ligastufe: 1, kasse: 50, stimmung: 70 });
  const zurGmbH = W.rechtsformWechseln(gross, 'gmbh');
  assert.equal(zurGmbH.fehler, null);
  assert.equal(zurGmbH.v.rechtsform, 'gmbh');
  assert.equal(zurGmbH.v.kasse, 50 - 2 + 15, 'Kosten ab, Einlage drauf');
  assert.equal(zurGmbH.v.stimmung, 62, 'der Wechsel kostet Rückhalt');

  assert(W.rechtsformWechseln(zurGmbH.v, 'ev').fehler.includes('nur nach vorn'));
  assert(W.rechtsformWechseln(zurGmbH.v, 'gmbh').fehler.includes('nur nach vorn'));
  assert(W.rechtsformWechseln(verein({ ligastufe: 1, kasse: 1 }), 'gmbh').fehler.includes('kostet'));
  assert.equal(W.rechtsformWechseln(gross, 'sarl').fehler, 'Unbekannte Rechtsform.');
});

test('Rechtsform: mehr Kapital gegen weniger Rückhalt', () => {
  const bau = { stadion: 5, gastro: 4, sortiment: 4, reichweite: 4, training: 1, medizin: 1 };
  const je = (id) => verein({ ligastufe: 1, rechtsform: id, ausbau: bau,
    sponsoren: [{ id: 'aurex', n: 'Aurex Bank', betrag: 8, rest: 2, fx: null }] });
  const ev = W.saisonEinnahmen(je('ev'), erg()).summe;
  const ag = W.saisonEinnahmen(je('ag'), erg()).summe;
  assert(ag > ev, 'die AG vermarktet besser');
  assert(W.bestPreis(je('ev'), 'ticket') > W.bestPreis(je('ag'), 'ticket'),
    'dafür ertragen die Fans des e.V. höhere Preise');
  /* Mitgliedsbeiträge sind beim e.V. eine Säule, bei der AG ein Rest. */
  const beitrag = (id) => (W.saisonEinnahmen(je(id), erg()).posten
    .find((p) => p.k.startsWith('Mitgliedsbeiträge')) || { v: 0 }).v;
  assert(beitrag('ev') > beitrag('ag') * 5);
  /* Aufsteigende Reihe: jede Form vermarktet besser als die vorige. */
  const reihe = W.RECHTSFORMEN.map((r) => W.saisonEinnahmen(je(r.id), erg()).summe);
  for (let i = 1; i < reihe.length; i++) assert(reihe[i] > reihe[i - 1], 'Reihenfolge der Rechtsformen');
});

test('Gehaltsniveau: steigt schnell mit dem Erfolg, fällt langsam danach', () => {
  const oben = verein({ ligastufe: 1 });
  const hoch = W.gehaltsniveauNeu(oben, erg({ rang: 1 }));
  assert(hoch > 1, 'wer oben mitspielt, zahlt mehr als der Durchschnitt');
  assert(hoch <= W.GEHALT_MAX);
  /* Zweimal dieselbe Saison: der zweite Schritt ist kleiner als der erste,
     weil nur der halbe Abstand zum Ziel gegangen wird. */
  const zweiter = W.gehaltsniveauNeu({ ...oben, gehaltsniveau: hoch }, erg({ rang: 1 }));
  assert(zweiter > hoch, 'anhaltender Erfolg treibt weiter');
  assert(zweiter - hoch < hoch - 1, 'aber in kleineren Schritten');
  /* Abgestiegen mit Spitzengehältern: es geht abwärts, aber langsamer als
     es hinaufging — eine Gehaltsstruktur wird ein Verein nicht in einem
     Jahr los, und genau das macht anhaltenden Erfolg teuer. */
  const nach = W.gehaltsniveauNeu({ ...verein({ ligastufe: 4 }), gehaltsniveau: 1.8 }, erg({ rang: 14 }));
  assert(nach < 1.8 && nach >= W.GEHALT_MIN, 'das Niveau sinkt, aber nicht unter die Grenze');
  assert(1.8 - nach < hoch - 1, 'langsamer abwärts als aufwärts');
});

test('Die Abrechnung schreibt das Gehaltsniveau fort und weist es im Beleg aus', () => {
  const v = verein({ ligastufe: 1, kasse: 50 });
  const { v: neu, beleg } = W.saisonAbrechnung(v, erg({ rang: 1 }), 5);
  assert(Number.isFinite(neu.gehaltsniveau) && neu.gehaltsniveau > 1, 'das Niveau wandert mit');
  assert.equal(beleg.gehalt.vorher, 1, 'bezahlt wird, was vorher vereinbart war');
  assert.equal(beleg.gehalt.neu, neu.gehaltsniveau, 'Beleg und Verein nennen dieselbe Zahl');
  assert(beleg.gehalt.kader.anzahl > 0 && beleg.gehalt.kader.summe > 0);
  /* Dieselbe Mannschaft, ein Jahr Erfolg später: sie kostet mehr. */
  assert(W.saisonKosten(neu).summe > W.saisonKosten(v).summe, 'anhaltender Erfolg wird teurer');
});

test('Gehälter ersetzen die alte Personalpauschale, statt sie zu ergänzen', () => {
  const k = W.saisonKosten(verein({ ligastufe: 1 }));
  assert(!k.posten.some((p) => p.k.startsWith('Personal und Mannschaft')),
    'die Pauschale ist weg — sonst würde doppelt gezahlt (Arbeitsplan WIRT-P1-03)');
  assert(k.posten.some((p) => p.k.startsWith('Spielergehälter')));
  assert(k.posten.some((p) => p.k.startsWith('Mitarbeiter und Verwaltung')));
  assert(Math.abs(k.posten.reduce((a, x) => a + x.v, 0) - k.summe) < 0.02, 'Summe ist die Summe der Posten');
});

test('Spielergehälter hängen am Kader und an der Liga', () => {
  const mit = (ovrs, zu) => W.kaderKosten(verein({ ...zu, kader: ovrs.map((ovr) => ({ ovr })) }));
  /* Stärke schlägt überproportional durch: mit dem Exponenten 3 kostet ein
     Spieler mit 80 rund das Vierfache eines mit 50, nicht das Anderthalbfache. */
  assert.equal(W.GEHALT_KURVE, 3, 'die Gehaltskurve steht an genau einer Stelle');
  const verhaeltnis = mit([80], { ligastufe: 1 }).summe / mit([50], { ligastufe: 1 }).summe;
  assert(verhaeltnis > 3.5 && verhaeltnis < 4.5,
    'ein Spitzenspieler kostet ein Vielfaches, aber kein Zehnfaches (war ' + verhaeltnis.toFixed(2) + ')');
  /* Die Kurve ist nachgebessert worden, und zwar nach unten. Mit dem alten
     Exponenten 4 wäre das Verhältnis 6,6 — daran ist ein Verein mit starkem
     Kader und kleinem Stadion zugrunde gegangen (WIRT-P0-03, Lauf im Vermerk).
     Wer sie wieder erhöht, soll hier stolpern und nicht erst im Spiel. */
  assert(Math.pow(80 / 50, W.GEHALT_KURVE) < Math.pow(80 / 50, 4),
    'die Kurve ist flacher als die ursprüngliche');
  assert.equal(mit([80], { ligastufe: 1 }).geschaetzt, false);
  /* Derselbe Spieler kostet oben mehr als unten — die Liga gibt es her. */
  assert(mit([70, 70], { ligastufe: 1 }).summe > mit([70, 70], { ligastufe: 5 }).summe * 4);
  /* Ohne Kader wird geschätzt: der Rechenkern muss auch isoliert laufen,
     solange der Anschluss an `verein.js` aussteht (WIRT-P0-02). */
  const ohne = W.kaderKosten(verein({ ligastufe: 3 }));
  assert.equal(ohne.geschaetzt, true);
  assert.equal(ohne.anzahl, W.KADER_SOLL);
  assert(ohne.summe > 0 && Number.isFinite(ohne.summe));
});

test('Das Gehaltsniveau bleibt in seinen Grenzen, auch bei absurder Vorgeschichte', () => {
  assert(W.gehaltsZiel(verein({ ligastufe: 1, bilanz: { meister: 99, aufstiege: 99 } }),
    erg({ rang: 1 })) <= W.GEHALT_MAX);
  assert(W.gehaltsZiel(verein({ ligastufe: 6, bilanz: { abstiege: 99 } }),
    erg({ rang: 18 })) >= W.GEHALT_MIN);
  /* Alte Spielstände kennen das Feld nicht und beginnen bei 100 %. */
  assert.equal(W.gehaltsniveau({}), 1);
  assert.equal(W.gehaltsniveau({ gehaltsniveau: 'kaputt' }), 1);
  assert.equal(W.gehaltsniveau({ gehaltsniveau: 99 }), W.GEHALT_MAX, 'gedeckelt statt geglaubt');
});

test('Fünfzehn Saisons: der Weg nach oben bleibt begehbar, oben reisst der Deckel nicht', () => {
  /* Diese Regression hat einen konkreten Anlass. Der erste Entwurf der
     Gehälter rechnete sie ohne Ligateiler — ein Viertligist zahlte damit
     11,4 Mio bei 17 Mio Einnahmen und erreichte in fünfzehn Jahren NULL
     Ausbaustufen. Der Rechenkern war in sich stimmig und die 138 anderen
     Regressionen blieben grün; erst der Langzeitlauf zeigte es. */
  const lauf = (stufe) => {
    let v = verein({ ligastufe: stufe, kasse: 0, ausbau: {}, baustellen: {}, stimmung: 60 });
    for (let s = 1; s <= 15; s++) {
      const saat = stufe * 1000 + s, e = erg({ rang: 3 });
      v = { ...v, ziel: W.zielSetzen(v, 3, 18) };
      for (const a of W.sponsorAngebote(v, saat).sort((x, y) => y.betrag - x.betrag).slice(0, 2)) {
        const r = W.sponsorAnnehmen(v, a); if (!r.fehler) v = r.v;
      }
      let weiter = true;
      while (weiter) {
        weiter = false;
        for (const x of W.AUSBAU.map((a) => ({ id: a.id, k: W.ausbauKosten(v, a.id) }))
               .filter((x) => x.k != null && !(v.baustellen || {})[x.id]).sort((a, b) => a.k - b.k)) {
          const r = W.bauStart(v, x.id);
          if (!r.fehler) { v = r.v; weiter = true; break; }
        }
      }
      v = W.saisonAbrechnung(v, e, saat).v;
    }
    return { stufen: W.AUSBAU.reduce((a, x) => a + (W.ausbauStufe(v, x.id) - 1), 0),
             kasse: v.kasse, punkte: W.abschlussWirtschaft(v).punkte };
  };
  /* Unten muss sich Aufbau lohnen: wer fünfzehn Jahre ordentlich wirtschaftet,
     kommt voran, auch im Unterhaus. */
  for (const stufe of [2, 3, 4, 5]) {
    const r = lauf(stufe);
    assert(r.stufen >= 12, 'Liga ' + stufe + ' erreicht nur ' + r.stufen + ' von 30 Ausbaustufen');
    assert(r.kasse > -5, 'Liga ' + stufe + ' endet bei ' + r.kasse + ' Mio');
  }
  /* Oben darf Geld nicht aufhören, eine Entscheidung zu sein: wer den
     Punktedeckel reisst, für den ist die letzte Saison wirtschaftlich egal. */
  const eins = lauf(1);
  assert.equal(eins.stufen, 30, 'die erste Liga schafft weiterhin den Vollausbau');
  assert(eins.punkte < W.PUNKTE_DECKEL,
    'der Überschuss reisst den Deckel wieder (' + eins.kasse + ' Mio, ' + eins.punkte + ' Punkte)');
});

test('Alles bleibt endlich, auch mit allen neuen Systemen', () => {
  const faelle = [
    verein({ ligastufe: 1, rechtsform: 'ag', stimmung: 100, preise: { ticket: 1.6, gastro: 1.6, merch: 1.6 },
             ausbau: { stadion: 6, gastro: 6, sortiment: 6, reichweite: 6, training: 6, medizin: 6 },
             baustelle: { id: 'stadion', stufe: 6, dauer: 3, rest: 1 },
             ziel: { id: 'titel', n: 'Titel', soll: 1, praemie: 9 } }),
    verein({ ligastufe: 9, stimmung: 0, preise: { ticket: 0.6, gastro: 0.6, merch: 0.6 }, ausbau: {} }),
    { land: 'JPN' }, {},
  ];
  for (const v of faelle) for (const e of [erg(), erg({ rang: 1, N: 2 }), erg({ rang: 20, N: 20, abstieg: true })]) {
    const { v: neu, beleg } = W.saisonAbrechnung(v, e, 9);
    for (const k of ['summeEin', 'summeAus', 'ergebnis', 'kasse', 'stimmung'])
      assert(Number.isFinite(beleg[k]), k + ' ist keine Zahl');
    assert(neu.stimmung >= 0 && neu.stimmung <= 100);
    assert(beleg.zuschauer >= 0 && Number.isFinite(beleg.zuschauer));
    assert(beleg.ereignisse.length <= 2);
  }
});
