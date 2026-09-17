# CHAR-FIX-02 – Hals/Kragen sauber maskieren

Datum: 17.09.2026  
Bearbeiter: **ChatGPT/Codex**  
Basis: `6c99b9e4136e219ea00b39591d15cd7c6559acec` (`main`, Version 35.192.0)  
Arbeitsbranch: `chatgpt/char-fix-02-optik`  
Pull Request: #20  
Paket: `CHAR-FIX-02`

## Ziel

Den sichtbaren Hals-/Kragenfehler im gemeinsamen Avatar-Renderer so beheben, dass geschlossene Trikotflächen den Hals sauber maskieren, die tatsächliche V-Ausschnitt-Öffnung aber exakt die Kopf-Hautfarbe zeigt. Gespeicherte Porträtkennungen bleiben unangetastet.

## Ursache und verworfener Zwischenstand

`CHAR-FIX-01` hatte feste Hals-/Kragenanker eingeführt. Beim ersten `CHAR-FIX-02`-Versuch wurde die Reihenfolge Hals → Trikot → Kragen hergestellt. Damit verschwand zwar seitliches Hautdurchscheinen, zugleich überdeckte das Trikot aber auch die offene Innenfläche des V-Ausschnitts. Dort blieb Trikotfarbe sichtbar, obwohl Haut zu sehen sein muss.

Der Nutzer hat diesen Fehler bei der Sichtprüfung erkannt. Die erste positive visuelle Abnahme und das zugehörige alte Browserartefakt sind deshalb **verworfen** und gelten nicht als Endabnahme.

## Endgültige Änderung

Die finale Layerlogik lautet:

1. Hals und Halsschatten;
2. Trikot/Schultern als geschlossene Vorderfläche;
3. explizite Innenfläche des offenen V-Ausschnitts in `haut`, also exakt der Basis-Hautfarbe des Kopfes;
4. Kragenrand als vorderste Ebene.

Die V-Öffnung verwendet die Geometrie

`M44,${KRAGEN_Y-1} L50,${KRAGEN_Y+8} L56,${KRAGEN_Y-1} Z`

und liegt zwischen Trikot und Kragen. Dadurch bleibt Stoff außerhalb des Ausschnitts vor dem Hals, während ausschließlich die tatsächliche Öffnung Haut zeigt. Die festen Anker aus `CHAR-FIX-01` (`KRAGEN_Y`, `HALS_OBEN_Y`, `HALS_BASIS_Y`) bleiben unverändert. Keine Kopf-, Haar-, Bart- oder sonstigen Porträt-IDs wurden geändert oder umnummeriert.

## Regression

`tools/char-fix-02.test.cjs` schützt insbesondere:

- Hals wird vor Trikot und Kragen gerendert;
- die V-Ausschnitt-Hautfläche liegt nach dem Trikot und vor dem Kragen;
- genau diese Öffnung verwendet `fill={haut}`;
- die feste V-Geometrie bleibt erhalten;
- die Hals-/Kragenanker aus `CHAR-FIX-01` bleiben erhalten.

## Sichere Patch-Brücke

Der Spielcode wurde über `.github/workflows/safe-patch.yml` eingespielt. Die Brücke hat im Verlauf sowohl einen formal fehlerhaften Patch vor jeder Quelländerung abgelehnt als auch gültige Patches nach `git apply --check`, Regression und Build automatisiert übernommen.

Für die korrigierte V-Ausschnitt-Version:

- Patch-Commit: `5673ab8a8de7fdee0fbb4da1798259ccaf86c464`;
- Safe-Patch-Run `35274142553`: **erfolgreich**;
- Patchprüfung und Anwendung: erfolgreich;
- `npm ci`: erfolgreich;
- `npm test`: erfolgreich;
- `npm run build`: erfolgreich;
- geprüfter Bot-Commit: `aeea757a72e099f35cf46ebf13bbdf6c179f9850`.

Die Patch-Brücke ist dauerhaft dokumentiert in `PATCH-BRUECKE.md`, `AGENTS.md` und `.github/workflows/safe-patch.yml`; zusätzlich wird sie im Einstieg `START-NEUER-CHAT.md` verlinkt.

## Finale PR-Regressionsprüfung

GitHub Actions Run `35274277908`: **erfolgreich**.

- `npm ci`: erfolgreich;
- `npm test`: erfolgreich;
- `npm run build`: erfolgreich.

Damit wurde der korrigierte Quellstand nach dem Nutzerhinweis erneut vollständig durch das normale Regression-Gate geprüft.

## Finale Browser-/Sichtabnahme

GitHub Actions Run `35274277996`: **erfolgreich**.

- 51 Playwright-Testfälle;
- **38 bestanden, 13 planmäßig übersprungen, 0 fehlgeschlagen**;
- Galerie und Browserprüfungen für Handy, schmale Ansicht und Desktop erfolgreich;
- 103 Dateien im Browserartefakt.

Finales Browserartefakt:

- Name: `Rasenschach-Browsertest`;
- Artifact-ID: `10519114631`;
- Größe: `27.151.608` Byte;
- SHA-256: `25dfa3a7dbd350d35f5e38ce235210c959c28b6dbb0320f9f7d4467de799d9a7`.

Das neue Artefakt wurde tatsächlich geöffnet und mit dem verworfenen Zwischenstand verglichen. Im kontrollierten 145-px-Beispiel mit dunkler Haut änderten sich innerhalb des V-Ausschnitts 143 Pixel. Die vorher dort sichtbare Trikotfarbe `(11, 42, 91)` wird im Zentrum der Öffnung durch die Hautfarbe `(73, 49, 40)` ersetzt. Der helle Kragenrand bleibt erhalten. Damit ist der konkret vom Nutzer gemeldete Fehler im Endrendering sichtbar behoben.

Zusätzlich blieben die vorhandenen Porträt-, Kopf-, Haar-, Bart- und Identitätsprüfungen im Browserlauf grün.

## Grenzen

- Kein neuer physischer Android-Geräte-Screenshot speziell für diesen Fix.
- Browser-Sichtprüfung und Android-Geräteprüfung werden nicht gleichgesetzt.
- Der Fix betrifft SVG-Layering im gemeinsamen Avatar-Renderer und enthält keine native Android-Änderung.

## Status

**CHAR-FIX-02 erfüllt nach der Nutzerkorrektur die vorgesehenen technischen und visuellen Abnahmekriterien und ist zur Integration freigegeben.**
