# CHAR-FIX-03 – Haar-/Bart-/Gesichtspassung

Datum: 18.09.2026
Arbeitsbranch: `chatgpt/char-fix-03-haar-bart-passung`

## Anlass

Die bisherigen Charakterprüfungen deckten bewusst Stichproben ab. Im Android-/Sichtfeedback blieben Kombinationen, bei denen Frisuren zu klein oder zu hoch saßen und Bartformen je nach Kopf/Nase/Mund zu weit in das Gesicht ragten.

## Technische Korrekturen

- Haarunterlage und kritische Kurzhaarformen sitzen größer und tiefer, bleiben aber auf die echte Kopfhülle geclippt.
- Neue Kopfprofile verwenden keine künstlich nach oben gezogene Haarpassung mehr.
- `gesichtsanker.js` koppelt Nase, Mund und Bart an dieselbe vertikale Geometrie.
- Kurze Köpfe ziehen lange Nasen stärker nach oben; breite/offene Mundformen werden bei Bedarf vertikal komprimiert.
- Schnurrbärte sind deutlich kompakter und zwischen Nasenunterkante und Mundzentrum begrenzt.
- Bartkörper erhalten einen Mundfreiraum; Kiefer/Kinn bleiben weiterhin aus der realen Kopfform abgeleitet.
- Nach dem ersten Browserlauf wurde zusätzlich `Kinngrübchen` relativ zur tatsächlichen Mundunterkante positioniert, weil Wangen-ID 1 bei 72 px vollständig vom Mund verdeckt wurde.

## Erweiterte Prüfmatrix

Automatisiert:
- 1.512 Kombinationen aus 14 Köpfen × 12 Nasen × 9 Mündern für kollisionsfreie Gesichtsanker.
- 700 Frisur×Kopf-Renderings.
- 840 kritische Bart-Renderings über vier Nase/Mund-Paare und alle 14 Köpfe.

Browser-Sichtbogen:
- 700 Frisur×Kopf-Darstellungen.
- 896 Bartdarstellungen (14 Köpfe × 4 kritische Gesichtspaare × 16 Bart-IDs).

## Bisherige Nachweise

Die sichere Patch-Brücke lief nach den Geometriekorrekturen vollständig grün: Patchprüfung, `npm ci`, `npm test` und `npm run build` erfolgreich.

Der erste PR-Browserlauf zeigte:
- `CHAR-FIX-03` selbst erfolgreich, einschließlich beider Vollmatrizen.
- Sichtung der erzeugten Haar- und Bartmatrizen: keine abgeschnittenen Bartkörper, keine auf die Nase gerutschten Schnurrbärte und keine offensichtlich zu kleinen neuen Kopf-/Frisurpassungen in den geprüften Reihen.
- Ein bestehender CHAR-P1-02-Rastertest fand Wangen-ID 0/1 pixelidentisch. Der erste Fix setzte das Kinngrübchen korrekt unter den Mund, blieb rasterseitig aber noch zu kontrastarm. Deshalb wird ID 1 nun als kleine, dunklere Kinnkontur gezeichnet; die Position folgt weiter der tatsächlichen Mundunterkante.

## Status

Noch **nicht final abgenommen**. Die zweite Kinngrübchen-Korrektur hat die sichere Patch-Brücke inklusive Regressionen und Produktionsbuild bestanden. Spielregressionen und der vollständige Browserlauf müssen nun auf demselben normalen PR-Head erneut grün sein. Danach werden Artefakt/Screenshots erneut geprüft und dieser Bericht mit finalen Run-IDs ergänzt.
