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

test('Abrechnung: Kasse ändert sich genau um Einnahmen minus Kosten', () => {
  const v = verein({ kasse: 5, ausbau: { stadion: 3, gastro: 2, sortiment: 2, reichweite: 2, training: 2, medizin: 2 } });
  const { v: neu, beleg } = W.saisonAbrechnung(v, erg());
  assert.equal(beleg.kasseVorher, 5);
  assert(Math.abs(beleg.ergebnis - (beleg.summeEin - beleg.summeAus)) < 0.02);
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
