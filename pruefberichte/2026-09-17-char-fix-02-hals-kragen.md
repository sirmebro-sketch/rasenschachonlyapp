# CHAR-FIX-02 – Hals/Kragen sauber maskieren

Datum: 17.09.2026  
Bearbeiter: **ChatGPT/Codex**  
Basis: `6c99b9e4136e219ea00b39591d15cd7c6559acec` (`main`, Version 35.192.0)  
Arbeitsbranch: `chatgpt/char-fix-02-optik`  
Pull Request: #20  
Paket: `CHAR-FIX-02`

## Ziel

Den sichtbaren Hals-/Kragenfehler im gemeinsamen Avatar-Renderer so beheben, dass die geschlossenen Trikotflächen den Hals sauber maskieren, **die tatsächliche V-Ausschnitt-Öffnung aber Kopf-Hautfarbe zeigt**. Gespeicherte Porträtkennungen bleiben unangetastet.

## Ursache

`CHAR-FIX-01` hatte feste Hals-/Kragenanker eingeführt. Beim ersten `CHAR-FIX-02`-Versuch wurde anschließend die Reihenfolge Hals → Trikot → Kragen hergestellt. Damit verschwand zwar das seitliche Hautdurchscheinen, zugleich überdeckte das Trikot aber auch die offene Innenfläche des V-Ausschnitts. Dort blieb dadurch Trikotfarbe sichtbar, obwohl anatomisch Haut zu sehen sein muss.

Der Nutzer hat diesen Fehler bei der Sichtprüfung erkannt. Die erste positive visuelle Abnahme ist damit **verworfen** und darf nicht als gültiger Endbefund verwendet werden.

## Korrigierte Änderung

Die endgültige Layerlogik lautet:

1. Hals und Halsschatten;
2. Trikot/Schultern als geschlossene Vorderfläche;
3. **explizite Innenfläche des offenen V-Ausschnitts in `haut`, also exakt der Basis-Hautfarbe des Kopfes**;
4. Kragenrand als vorderste Ebene.

Die V-Öffnung verwendet die Geometrie

`M44,${KRAGEN_Y-1} L50,${KRAGEN_Y+8} L56,${KRAGEN_Y-1} Z`

und liegt zwischen Trikot und Kragen. Dadurch bleibt der geschlossene Stoff vor dem Hals, während ausschließlich die tatsächliche Öffnung wieder Haut zeigt.

Die festen Anker aus `CHAR-FIX-01` (`KRAGEN_Y`, `HALS_OBEN_Y`, `HALS_BASIS_Y`) bleiben unverändert. Keine Kopf-, Haar-, Bart- oder sonstigen Porträt-IDs wurden geändert oder umnummeriert.

## Regression

`tools/char-fix-02.test.cjs` schützt nun insbesondere:

- Hals wird vor Trikot und Kragen gerendert;
- die V-Ausschnitt-Hautfläche liegt **nach** dem Trikot und **vor** dem Kragen;
- genau diese Öffnung verwendet `fill={haut}`;
- die feste V-Geometrie bleibt erhalten;
- die Hals-/Kragenanker aus `CHAR-FIX-01` bleiben erhalten.

## Sichere Patch-Brücke

Der Spielcode wurde über `.github/workflows/safe-patch.yml` eingespielt. Die Brücke hat im Verlauf sowohl fehlerhafte Patchstände vor jeder Quelländerung abgelehnt als auch gültige Patches nach `git apply --check`, Regression und Build automatisiert übernommen.

Für die korrigierte V-Ausschnitt-Version:

- Patch-Commit: `5673ab8a8de7fdee0fbb4da1798259ccaf86c464`;
- Safe-Patch-Run `35274142553`: **erfolgreich**;
- Patchprüfung und Anwendung: erfolgreich;
- `npm ci`: erfolgreich;
- `npm test`: erfolgreich;
- `npm run build`: erfolgreich;
- geprüfter Bot-Commit: `aeea757a72e099f35cf46ebf13bbdf6c179f9850`.

Die Patch-Brücke ist dauerhaft dokumentiert in:

- `PATCH-BRUECKE.md`;
- `AGENTS.md`;
- `.github/workflows/safe-patch.yml`.

## Erneute Browser-/Sichtabnahme

Nach dem Nutzerhinweis ist eine **neue** Browsergalerie auf dem korrigierten Endstand Pflicht. Die frühere Galerie/Artifact-ID `10519334408` belegt nur den verworfenen Zwischenstand und darf nicht als Endabnahme von CHAR-FIX-02 gelten.

Die erneute PR-CI und Sichtprüfung werden auf dem korrigierten Code ausgeführt. Erst danach wird dieses Paket im Arbeitsplan auf `ERLEDIGT` gesetzt und PR #20 integriert.

## Status

**KORRIGIERT, erneute visuelle Abnahme läuft. Noch nicht zur Integration freigegeben.**
