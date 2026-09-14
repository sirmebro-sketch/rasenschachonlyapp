/* Abschlussbelohnungen: Buchung und Anzeige verwenden denselben Beleg. */
export const VC_MIN_SAISONEN = 3;
export const PACK_MIN_SAISONEN = 15;
export const saisonenGespielt = p => Array.isArray(p?.seasons) ? p.seasons.length : 0;

export function laufbahnBeleg(p, urteil) {
  if (!p || saisonenGespielt(p) < VC_MIN_SAISONEN) return { vc: 0, posten: [] };
  const posten = [];
  const dazu = (k, v) => { if (v > 0) posten.push({ k, v }); };
  dazu('Aus ' + urteil.score.toLocaleString('de-DE') + ' Vermächtnispunkten', Math.round(urteil.score / 26));
  if (urteil.ehre) dazu('Vermächtnistitel', 11);
  dazu((p.trophies || []).length + ' Titel', (p.trophies || []).length);
  dazu((p.nt?.caps || 0) + ' Länderspiele', Math.round((p.nt?.caps || 0) / 26));
  if (p.flags?.legende) dazu('Vereinslegende', 7);
  if (['goat', 'hsv'].includes(p.wc?.r)) dazu('Besondere Karte', 9);
  let summe = posten.reduce((s, x) => s + x.v, 0);
  const shop = Math.round(summe * 1.18);
  dazu('Laufbahnzuschlag · 18 % (gerundet)', shop - summe);
  const ausbau = Math.round(shop * 1.80);
  dazu('Ausbauzuschlag · 80 % (gerundet)', ausbau - shop);
  dazu('Aufstockung auf mindestens 5 VC', Math.max(0, 5 - ausbau));
  return { vc: posten.reduce((s, x) => s + x.v, 0), posten };
}

export function abschlussBeleg(p, urteil, haus = { posten: [] }, erfolge = { posten: [] }) {
  const basis = laufbahnBeleg(p, urteil);
  const posten = saisonenGespielt(p) >= VC_MIN_SAISONEN
    ? [...basis.posten, ...haus.posten, ...erfolge.posten] : [];
  return {
    vc: posten.reduce((s, x) => s + x.v, 0), posten,
    gratisPacks: saisonenGespielt(p) >= PACK_MIN_SAISONEN ? 1 : 0,
  };
}
