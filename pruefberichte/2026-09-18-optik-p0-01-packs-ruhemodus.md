# OPTIK-P0-01 – Pack-Ruhemodus-Audit

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Auftrag:** OPTIK-P0-01, ausschließlich Packs  
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486`, Version 35.194.1  
**Arbeitsbranch:** `lemming/optik-p0-01-packs-ruhemodus`

## Abgrenzung zu paralleler Arbeit

Vor Beginn wurden die offenen Pack-/Effektarbeiten geprüft. PR #31
(`CARD-P0-02: Packkontur bei 320/390 px absichern`) bearbeitet bereits
Packkontur, Folienclip, Ebenen und Lesbarkeit und bringt dafür
`tools/browser/packs.spec.js` mit. Diese Arbeit wurde weder integriert noch
verändert. Auch der Tracker `CHARAKTER-OPTIK-ARBEITSPLAN.md` bleibt in diesem
Branch unangetastet, weil PR #31 ihn bereits parallel ändert.

PR #32 betrifft ausschließlich die Lesbarkeit von Spielerkarten und liegt
außerhalb dieses Packs-only-Auftrags.

## Ausgangsbefund im Produktcode

- Bronze- und Silberpacks besitzen keine bewegte Materialfolie.
- Gold- und Legendärpacks verwenden `KartenEffekt form="pack"`.
- Der Spiel-Ruhemodus reicht `still={RUHE}` an die Materialfolie weiter.
- `.rs-folie-still` schaltet `.rs-folienfarbe` und `.rs-folienzug` ab.
- Zusätzlich schaltet
  `@media(prefers-reduced-motion:reduce)` dieselben beiden Animationen ab.
- Am Pack selbst wurde keine weitere periodische Translation, Rotation,
  Skalierung, Schwebe- oder Pulsanimation gefunden.

Der statische Codebefund allein wurde ausdrücklich nicht als Nachweis gewertet.
Die tatsächliche Bewegung wurde anschließend im Browser gemessen.

## Ergänzte Browserregression

Neu: `tools/browser/packs-ruhemodus.spec.js`.

Die Regression verwendet die echte isolierte Sichtprobe und alle vier aktuellen
Packstufen. Sie prüft drei Zustände:

1. **Normale Bewegung erlaubt:** Gold/Legendär müssen weiterhin
   `rs-folienfarbe` und `rs-folienzug` als laufende Animationen besitzen und
   ihre berechneten Transform-/Opacity-Werte müssen sich über die Zeit ändern.
   Damit wird abgesichert, dass der Ruhemodus nicht versehentlich das normale
   Verhalten zerstört.
2. **Spieloption „Animationen aus“:** keine laufende Packanimation; nach 700 ms
   müssen Transform und Opacity der beweglichen Folienteile unverändert sein.
3. **Systempräferenz `prefers-reduced-motion: reduce`:** gleicher
   Stillstandsnachweis bei weiterhin ausgeschalteter Spiel-Ruheoption.

Bronze/Silber werden zusätzlich darauf geprüft, dass keine versteckte
Packanimation vorhanden ist.

Die Tests laufen in den bestehenden Playwright-Projekten:
- 390 × 844 px (`handy`)
- 320 × 720 px (`schmal`)
- 1280 × 900 px (`desktop`)

## Ergebnis

**Kein Produktdefekt reproduziert.**

In allen drei Browsergrößen gilt:

- Bronze/Silber bleiben erwartungsgemäß statisch.
- Gold/Legendär bewegen Farbschimmer und Lichtzug bei normal erlaubten
  Animationen tatsächlich weiter.
- Bei „Animationen aus“ stehen Gold/Legendär vollständig still.
- Bei aktiver Systempräferenz für reduzierte Bewegung stehen Gold/Legendär
  ebenfalls vollständig still.
- Während der beiden Ruheprüfungen wurden weder laufende CSS-Animationen noch
  zeitliche Änderungen an Transform/Opacity der beweglichen Folienteile
  festgestellt.

Nach Kevins Vorgabe „nur reproduzierte Verstöße korrigieren“ wurde deshalb
**kein Produktcode geändert**. Gestaltung, Intensität, Timings und normales
Animationsverhalten bleiben unverändert.

## Automatische Prüfung des ersten Code-Heads

Geprüfter Head: `4bd4b6bba65387135e1ec7cf8d458a2f59349927`.

- GitHub Actions „Spielregressionen“, Run **35357651545**:
  `npm test` **140/140 bestanden**, 0 Fehler; `npm run build` erfolgreich
  (2,30 s).
- GitHub Actions „Visuelle Browsertests“, Run **35357651584**:
  **51 bestanden, 24 planmäßig übersprungen, 0 Fehler**.
- Die sechs neuen OPTIK-P0-01-Prüfungen bestanden in allen drei Projekten:
  Spiel-Ruhemodus und System-`reduce` jeweils bei 390 px, 320 px und Desktop.
- Browserartefakt: **10552531827**, Digest
  `sha256:9f808e25e694040eab474587d6dff9f2d7666f9782bacefaa7816f695982215b`.

## Bewusst nicht geändert / Grenzen

- Kein `App.jsx`- oder `karteneffekte.jsx`-Patch, weil kein Verstoß
  reproduziert wurde.
- Keine Kontur-, Masken-, Ebenen- oder Lesbarkeitsarbeit aus CARD-P0-02 / PR #31.
- Keine Karten-, Wildcard-, Charakter- oder Elfkartenprüfung; dieser Auftrag ist
  ausdrücklich Packs-only.
- Kein Android-Gerätetest. Der Auftrag verlangt die tatsächliche
  Browserbewegung; Produktcode wurde nicht geändert.
- OPTIK-P0-01 als Gesamtpaket ist damit **nicht** abgeschlossen, sondern nur der
  beauftragte Pack-Teil belegt.

**Status:** zur Astra-Abnahme, noch nicht integriert. Kein main-Merge und kein
Release.
