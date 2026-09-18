# CHAR-FIX-04 – Bart-/Kurzhaar-Restpassung

Datum: 18.09.2026  
Status: **ABGENOMMEN – vor Integration in main**  
Basis: `main` @ `904bee4a06d07156963531023798b22747a5c926`  
PR: #22  
Sichtgeprüfter Produkt-/Test-Head: `7e80051bae544b100c1d200468ab043b0395e526`

## Anlass

CHAR-FIX-03 hatte technisch grüne Matrizen, die anschließende echte Nutzersichtung zeigte jedoch weiterhin sichtbare Restfehler:

- Bart-ID 4 **Kinnbart** saß nicht zuverlässig am tatsächlichen Kinnzentrum.
- Bart-ID 14 **Ankerbart** saß nicht zuverlässig am tatsächlichen Kinnzentrum.
- weitere Bärte mussten systematisch gegen schmale, breite, lange und kurze Köpfe geprüft werden;
- zahlreiche kurze/kompakte Frisuren wirkten auf Kopf 10–13 zu klein, sodass am oberen oder seitlichen Schädelrand unbeabsichtigt Haut sichtbar wurde.

Die Nutzerbeobachtung hatte für diese Runde ausdrücklich Vorrang vor der früheren grünen CHAR-FIX-03-Abnahme.

## Ursache

### Haare

`haarformen.jsx` verwendete für die vier neueren Kopfprofile feste historische Profilbreiten. Zusammen mit einer generischen Haarunterlage konnte daraus technisch gültiges SVG entstehen, das die tatsächliche Kopfkontur dennoch nicht vollständig abdeckte. Besonders kurze/kompakte Formen wirkten deshalb auf einzelnen neuen Köpfen wie eine zu kleine aufgesetzte Haarfläche.

### Bärte

Kinnnahe Formen wurden noch stark aus festen Offsets relativ zu `kinn` aufgebaut. Mundmaske und Kopfclip verhinderten zwar grobe Übermalung, garantierten aber weder eine plausible Mund→Kinn-Zone noch, dass der sichtbare untere Kinnanteil erhalten blieb. Gerade ID 4 und 14 konnten dadurch sichtbar zu hoch, zu klein oder am Kinn abgeschnitten wirken.

## Produktkorrektur

### Haarpassung

Für die neuen Profile `trapez`, `lang`, `diamant` und `kurzbreit` gilt für kompakte/kopfnahe Frisuren jetzt:

- horizontale Passung aus der tatsächlich übergebenen Kopfbreite statt fester historischer Zielbreite;
- kleiner profilspezifischer Zuschlag für die reale Schläfenkurve;
- großzügige Haarunterlage, die erst durch den echten `kopfpfad` auf die tatsächliche Kopfform begrenzt wird;
- kopfnahe Vorderhaarformen werden auf den neuen Köpfen ebenfalls an der realen Kopfmaske begrenzt;
- `rasiert` bleibt bewusst transparent/offen, nutzt aber eine zur neuen Kopfbreite passende flache Kappe;
- alte Köpfe 0–9 behalten ihre bisherige Breitenbasis. Es wurde **keine globale Pauschalvergrößerung** eingeführt.

### Bartpassung

Für die zentrale Kinnfamilie wurde eine gemeinsame Mund→Kinn-Zone eingeführt:

- reale Mundunterkante als obere Begrenzung;
- tatsächliche Kinn-Y-Position als geometrischer Bezug;
- Kieferbreite beeinflusst die sichtbare Bartbreite;
- Kinnbart 4, Ziegenbart 5 und Ankerbart 14 nutzen denselben gemeinsamen geometrischen Vertrag;
- Kinnbart und Ankerbart dürfen ihren beabsichtigten zentralen Anteil kontrolliert unter das tatsächliche Kinn fortsetzen, statt genau dort durch den Kopfclip abgeschnitten zu werden;
- Schnurrbart-/Mundfreiraum bleibt getrennt, sodass Bartteile nicht auf Nase, Lippen oder Zähne geschoben werden.

Bestehende Bart- und Frisur-IDs sowie Reihenfolgen blieben unverändert.

## Neue Regressionen

Neu hinzugefügt:

- `tools/char-fix-04.test.cjs`
- `tools/char-fix-04-vorschau.cjs`
- `tools/browser/char-fix-04.spec.js`

Abgedeckt werden unter anderem:

- **200** Frisur-Renderings auf Kopf 10–13 im vollständigen Katalog;
- kritische männliche und weibliche Kurz-/Kompaktformen mit expliziter Kopfkontur-Passung;
- alte Köpfe 0–9 als Schutz gegen globale Skalierung;
- **168** gezielte Renderings der Kinnfamilie 4/5/14 über alle 14 Köpfe und vier kritische Nase/Mund-Paare;
- **840** Bart-Renderings des vollständigen Bartkatalogs 1–15 über alle 14 Köpfe und vier kritische Gesichter;
- explizite Prüfung, dass Kinnbart und Ankerbart auf breiten Kiefern breiter reagieren als auf schmalen;
- reale Mundunterkante, Kinn-Y und Kieferbreite als Diagnoseattribute.

Die veralteten CHAR-FIX-01/03-Tests, die exakt die inzwischen als fehlerhaft erkannte alte Festbreiten-Implementierung festschrieben, wurden auf den stärkeren geometrischen Vertrag aktualisiert. Die eigentlichen Schutzabsichten bleiben erhalten.

## Sichtbogen

Der CHAR-FIX-04-Browserbogen enthält:

1. alle Frisuren × Kopf 10–13 bei **72 px**;
2. die kritischen Kurz-/Kompaktformen bei **96 px** und **145 px**;
3. eine Diagnoseansicht mit rot markierter echter Kopfkontur;
4. alle Bart-IDs 0–15 × Kopf 10–13 bei **72/96 px** und drei kritischen Nase/Mund-Paaren;
5. alte Köpfe **Schmal (3)**, **Vollmond (5)** und **Breit (6)** als Regressionsvergleich;
6. kritische Bart-IDs 4, 5, 8, 12, 13, 14 und 15 bei **145 px** auf den neuen Köpfen sowie Schmal/Breit.

## Tatsächliche Sichtprüfung

Das finale Browserartefakt des sichtgeprüften Heads wurde heruntergeladen und die sechs erzeugten CHAR-FIX-04-Screenshots wurden einzeln geöffnet und bewertet.

### Haare

**Kopf 10 – Trapez:** kurze, gescheitelte, crop-/fade-/slickartige Formen decken den oberen und seitlichen Kopfbereich ohne unbeabsichtigten Hautkeil ab.  
**Kopf 11 – Langkantig:** die zuvor besonders auffällige hohe/lange Schädelkontur bleibt unter den kompakten Formen geschlossen; kein „zu kleine Perücke“-Eindruck.  
**Kopf 12 – Diamant:** Schläfen-/obere Seitenkontur ist bei den kompakten Formen geschlossen; die stärkere Kopfbreite führt nicht zu seitlichen Löchern.  
**Kopf 13 – Kurzbreit:** breite obere Kontur wird von den kompakten Formen plausibel erreicht; keine sichtbaren seitlichen Hautspalten.

`rasiert` und `licht` zeigen weiterhin bewusst Haut. Diese wirkt in der Diagnoseansicht symmetrisch und als Teil der Frisur, nicht als versehentlich fehlende Haarfläche.

Die Vollmatrix aller männlichen und weiblichen Frisuren auf Kopf 10–13 wurde ebenfalls geöffnet. Es wurde kein neuer sichtbarer Clipping-/Hautspalt-Blocker gefunden.

### Bärte

Alle Bart-IDs wurden auf den neuen Köpfen in den 72/96-px-Bögen gesichtet; die kritischen IDs zusätzlich groß.

- **ID 4 Kinnbart:** sitzt jetzt mittig an der tatsächlichen Kinnachse und wandert weder auf Mund/Lippe noch unplausibel in den Hals. Schmale und breite Kiefer ergeben sichtbar unterschiedliche, plausible Breiten.
- **ID 5 Ziegenbart:** bleibt schmaler/länger als ID 4 und folgt derselben Kinnachse.
- **ID 8 Kinnriemen:** bleibt an der Kieferlinie; kein neuer Mund-/Nasenübergriff.
- **ID 12 Konturierter Bart:** Kiefer-/Mundfreiraum bleibt sauber.
- **ID 13 Spitzer Vollbart:** Spitze bleibt zentriert.
- **ID 14 Ankerbart:** Oberlippenanteil, zentraler Steg und Ankerbogen bleiben unterhalb des Mundes und sichtbar am tatsächlichen Kinnzentrum.
- **ID 15 Breiter Vollbart:** bleibt auch auf Kurzbreit/Breit plausibel und kollidiert nicht mit Nase oder Zähnen.

Die Altvergleiche Schmal/Vollmond/Breit zeigen keine durch CHAR-FIX-04 eingeführte sichtbare Regression.

## Automatische Abnahme

### Sicheres Regression-/Build-Gate vor PR-Endabnahme

Workflow Run `35304607810`:

- `npm test`: **140/140 bestanden**
- Fehler: **0**
- Produktionsbuild: **erfolgreich**
- Vite 6.4.3, 55 Module transformiert

### Finaler PR-Head `7e80051b…`

Spielregressionen Run `35305188844`: **erfolgreich**

Visuelle Browsertests Run `35305188852`: **erfolgreich**

Browserlauf:
- **41 bestanden**
- **19 bewusst übersprungen** (projektübliche projekt-/viewportabhängige Skips)
- CHAR-FIX-04 Hauptsichtbogen: erfolgreich
- CHAR-FIX-04 DOM-/Geometriediagnose: erfolgreich
- Browserartefakt: `Rasenschach-Browsertest`, ID `10530558142`
- Artefakt-Digest: `sha256:56f977c4538b97e37e3d6f710ef9a3c6dded29205b56523a2dc626ccb2355c43`

## Zwischenzeitliche rote Läufe

Während der Runde gab es rote CI-Läufe, die **keine Produktfehler** waren:

1. Syntaxfehler ausschließlich im neu gebauten CHAR-FIX-04-Vorschau-Generator;
2. falscher Testselektor `haar-alle` statt `haar-alle-neue`;
3. zu breiter 96/145-px-Selektor, der Grid-Container und Karten gleichzeitig gezählt hätte.

Diese Prüfstandfehler wurden korrigiert, ohne Produktanforderungen oder Sollzahlen zu lockern. Der finale Browserlauf ist grün.

## Kompatibilität

- keine Bart-ID gelöscht oder umnummeriert;
- keine Frisur-ID gelöscht oder umnummeriert;
- keine Kopfform-ID geändert;
- gespeicherte Porträtindizes bleiben gültig;
- alte Köpfe behalten ihre bisherige Haarbreitenbasis;
- keine Änderung an Karriere-/Spielmechanik oder Speicherung.

## Android

Kein nativer Android-spezifischer Code wurde geändert. Ein physischer Android-Geräte-Sichttest ist in dieser Runde nicht durchgeführt worden und wird deshalb nicht behauptet. Die für CHAR-FIX-04 festgelegte Abnahme erfolgte über echten Avatar-Renderer, 72/96/145-px-Browserdarstellungen, Diagnosekontur und vollständige Browsermatrizen.

## Ergebnis

Die konkreten Nutzerbefunde aus CHAR-FIX-03 sind in der CHAR-FIX-04-Sichtprüfung nicht mehr reproduzierbar:

- Kinnbart 4 sitzt sichtbar am Kinnzentrum.
- Ankerbart 14 sitzt sichtbar am Kinnzentrum.
- alle Bart-IDs 1–15 wurden erneut in den neuen Kopfmatrizen gesichtet;
- alle Frisuren auf Kopf 10–13 wurden im vollständigen 72-px-Bogen geprüft;
- die kritischen Kurzhaarformen wurden zusätzlich bei 96/145 px und gegen die echte Kopfkontur geprüft;
- unbeabsichtigte obere/seitliche Hautspalten der problematischen Kurzformen sind in den finalen Bögen nicht mehr sichtbar;
- die geprüften alten schmalen/breiten Köpfe zeigen keine neue Regression;
- Regression, Build und Browser-CI sind grün.

**CHAR-FIX-04 erfüllt damit die vorgesehenen Abnahmekriterien und kann nach erneut grünem CI auf dem Dokumentations-Head in `main` integriert werden.**
