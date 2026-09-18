# CARD-P0-02 – Packkontur und Folie

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486`  
**Arbeitsbranch:** `lemming/card-p0-02-packkontur`  
**PR:** #31  
**Paket:** CARD-P0-02

## Ziel und Umfang

Alle vier Packstufen bei 320 × 720 und 390 × 844 px mit und ohne Bewegung
prüfen. Folie/Glanz müssen innerhalb der sichtbaren Zickzack-Packkontur bleiben,
der Aufdruck muss darüber stabil und vollständig lesbar sein. Nur belegte
Kontur-, Überlagerungs- oder Abschneidefehler dürfen Produktcode ändern; kein
allgemeines Effekt-Redesign.

Vor Beginn wurden Live-main, offene Branches und offene PRs geprüft. Es lag
keine parallele Pack-/CARD-P0-02-Arbeit vor. Die offenen Claude-Wirtschaftszweige
und die vorhandenen Charakterzweige betreffen andere Bereiche und wurden nicht
integriert oder verändert.

## Vorher – sichtbare Reproduktion auf main

Quelle war der erfolgreiche main-Browserlauf **35324596284** auf
`703d377e8eaa7932b6f5fed62ca313807ad16486`, Artefakt
**10538017870** (`Rasenschach-Browsertest`). Die daraus stammende
`.preview/sichtprobe.html` wurde isoliert geöffnet.

Geprüft und tatsächlich angesehen:

- 320 × 720: Bronze, Silber, Gold, Legendär; Animation an und aus.
- 390 × 844: Bronze, Silber, Gold, Legendär; Animation an und aus.
- Gold und Legendär zusätzlich als Nahansicht bei mehreren Animationsständen
  (0 / 1,0 / 2,5 / 4,0 / 5,2 s).

**Befund:** Kein Produktdefekt reproduziert. Gold-/Legendenfolie blieb an allen
angesehenen Animationsständen innerhalb der gezackten Packform. Ball,
Naht und Stufenbeschriftung lagen sichtbar oberhalb der Folie. Keine obere oder
seitliche Fremdkante und kein abgeschnittener Aufdruck. Im Ruhemodus stand die
Folie still.

Zusätzliche DOM-Messung auf beiden Breiten:

- Pack- und Materialebene von Gold/Legendär hatten dieselbe Bounding-Box.
- Der `clipPath` der Materialfolie entsprach dem sichtbaren Basis-Packpfad.
- Alle vier Beschriftungs-Bounding-Boxes lagen vollständig innerhalb des Packs.
- Gold/Legendär meldeten mit Bewegung `rs-folienfarbe` und
  `rs-folienzug` als laufende Animationen; im Ruhemodus keine laufende
  Animation im Materialteilbaum.

Da kein belegter Kontur-, Überlagerungs- oder Abschneidefehler vorlag, wurde
**kein Produktcode geändert**. Insbesondere wurden weder Farben, Intensitäten,
Timings noch die Packgestaltung verändert.

## Geändert

Neu: `tools/browser/packs.spec.js`.

Die Browserregression prüft gezielt in den bestehenden Projekten
`schmal` (320 × 720) und `handy` (390 × 844):

1. Bronze/Silber/Gold/Legendär werden vollständig im Viewport gerendert.
2. Jede Stufenbeschriftung ist sichtbar und liegt geometrisch im Pack.
3. Bronze/Silber besitzen erwartungsgemäß keine Holo-Materialebene.
4. Gold/Legendär besitzen genau eine Materialebene, bündig zur Packbox.
5. Der Folien-`clipPath` ist identisch mit dem sichtbaren Basis-Packpfad.
6. Mit Bewegung laufen Farbfolie und Lichtzug.
7. Mit `Animationen aus` läuft im Materialteilbaum keine Animation.
8. Pro Breite/Zustand wird ein Vollseiten-Screenshot als Sichtbeleg erzeugt.

Desktop wird für diesen gezielten Test bewusst übersprungen, weil CARD-P0-02
explizit 320/390 px verlangt.

## Nachher – CI und Sichtprüfung

Erster PR-Head mit der neuen Regression:
`bdc105f19f7d9b8cb476d06bd32ac6f48240b821`.

- **Spielregressionen 35344224202:** 140/140 bestanden; `npm run build`
  erfolgreich.
- **Visuelle Browsertests 35344224314:** 49 bestanden, 26 planmäßig
  übersprungen, 0 fehlgeschlagen.
- Die vier neuen CARD-P0-02-Fälle (320/390 × Bewegung an/aus) sind bestanden.
- Browserartefakt **10545817967**, Digest
  `sha256:9606be365fe1ff9872fb680b66f1417e01ecbbf060cbf7e2f2764124e6d6028a`.

Die vier neu erzeugten Pack-Screenshots wurden nach dem CI-Lauf tatsächlich
geöffnet und angesehen. Der Vorher-Befund bestätigt sich: keine abgeschnittene
Zickzackkante, keine Folie außerhalb der Packform und keine verdeckte oder
abgeschnittene Stufenbeschriftung.

Als Gegenkontrolle ist die generierte `.preview/sichtprobe.html` im main-
Artefakt und im PR-Artefakt bytegleich
(`sha256:f7f0fb0109dda2f44fe930ad1b855d55179d6c8aeefa1974a5343d79e569c24a`).
Das passt dazu, dass dieser PR absichtlich keinen Produktcode verändert.

## Kompatibilität / parallele Arbeit

- Kein `App.jsx`-, Karten-, Pack- oder Effekt-Produktcode geändert.
- Keine Versionsänderung.
- Keine fremden Branches/PRs integriert oder bereinigt.
- Keine Spielstands-, ID-, Balance- oder Releaseänderung.
- Die bereits doppelt notierte Basis-Packgeometrie und
  `EFFEKT_KONTUREN.pack` stimmen im geprüften Stand überein; die neue
  Browserregression macht eine künftige Abweichung sichtbar. Unter dem
  vorgegebenen Auftrag wurde daraus ohne sichtbaren Fehler kein Refactor
  abgeleitet.

## Bewusst offen

- **Echte Android-Sichtprüfung für Gold/Legendär** ist nach Arbeitsplan
  weiterhin offen und gehört zur Astra-/Geräteabnahme. Browser, CI und
  Produktionsbuild werden nicht als Gerätetest ausgegeben.
- Dieser Befund gilt für den geprüften Stand und die geprüften Ansichten; er ist
  keine pauschale Aussage, dass alle Karten-/Wildcard-Effekte fehlerfrei seien.

**Status:** umgesetzt / zur Astra-Abnahme, noch nicht integriert.
