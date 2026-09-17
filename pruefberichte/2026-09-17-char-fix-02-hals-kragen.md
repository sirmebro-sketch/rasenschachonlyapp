# CHAR-FIX-02 – Hals/Kragen sauber maskieren

Datum: 17.09.2026  
Bearbeiter: **ChatGPT/Codex**  
Basis: `6c99b9e4136e219ea00b39591d15cd7c6559acec` (`main`, Version 35.192.0)  
Arbeitsbranch: `chatgpt/char-fix-02-optik`  
Pull Request: #20  
Paket: `CHAR-FIX-02`

## Ziel

Den sichtbaren Hals-/Kragenfehler im gemeinsamen Avatar-Renderer so beheben, dass Haut ausschließlich innerhalb der vorgesehenen Kragenöffnung sichtbar bleibt. Geschlossene Trikot- und Kragenflächen dürfen nicht von der Halsbasis überzeichnet werden. Gespeicherte Porträtkennungen bleiben unangetastet.

## Ursache

`CHAR-FIX-01` hatte bereits feste Hals-/Kragenanker eingeführt und den Kragen nach dem Hals gerendert. Das Trikot selbst lag aber weiterhin **vor dem Hals im Quelltext und damit hinter dem Hals in der SVG-Zeichenreihenfolge**. Dadurch konnte die untere Halsfläche außerhalb der eigentlichen V-Öffnung auf geschlossenen Trikotflächen sichtbar werden.

## Änderung

In `App.jsx` wurde ausschließlich die gemeinsame Layerreihenfolge des Avatar-Oberkörpers korrigiert:

1. Hals und Halsschatten;
2. Trikot/Schultern;
3. Kragen als vorderste der drei Ebenen.

Damit maskiert die Trikotfläche die Halsbasis bereits flächig; der Kragen deckt anschließend seine Vorderkante sauber ab. Die festen Anker aus `CHAR-FIX-01` (`KRAGEN_Y`, `HALS_OBEN_Y`, `HALS_BASIS_Y`) bleiben unverändert.

Keine Kopf-, Haar-, Bart- oder sonstigen Porträt-IDs wurden geändert oder umnummeriert.

## Neue Regression

`tools/char-fix-02.test.cjs` schützt drei Punkte:

- Hals wird vor Trikot und Kragen gerendert;
- zwischen Trikot und Kragen wird keine Haut-/Halsschicht erneut aufgetragen;
- die festen Hals-/Kragenanker aus `CHAR-FIX-01` bleiben erhalten.

## Automatische Prüfung

### Sichere Patch-Brücke

Der Spielcode-Fix wurde über `.github/workflows/safe-patch.yml` eingespielt.

- erster eingereichter Patch: wegen formal fehlerhafter Unified-Diff-Zeilenzählung **vor jeder Quelländerung abgelehnt**;
- korrigierter Lauf `35273131521`: **erfolgreich**;
- Patchprüfung, Anwendung, `npm ci`, komplette Regression und Produktions-Build erfolgreich;
- geprüfter Bot-Commit: `6e3142a3bd466517754c8200308714c64d362901`.

Damit sind sowohl der Schutz-/Ablehnungsweg als auch der Erfolgsweg der neuen Patch-Brücke praktisch belegt.

### PR-Spielregression

GitHub Actions Run `35273291894`: **erfolgreich**.

- `npm test`: **130/130 bestanden**, 0 fehlgeschlagen, 0 übersprungen;
- darin alle drei neuen `CHAR-FIX-02`-Regressionen erfolgreich;
- `npm run build`: **erfolgreich**;
- Vite 6.4.3, 54 Module transformiert.

Bekannte, nicht blockierende Hinweise bleiben bestehen:

- React-SSR-Hinweise zu `useLayoutEffect`;
- Vite-Hinweis auf den großen Hauptchunk;
- GitHub-Actions-Hinweis zur Node-20-Abkündigung älterer Actions.

### Browser / Playwright

GitHub Actions Run `35273291878`: **erfolgreich**.

- **38 bestanden, 13 planmäßig übersprungen, 0 fehlgeschlagen**;
- 51 Testfälle über `handy`, `schmal` und `desktop`;
- die bestehende CHAR-FIX-01-Vollmatrix mit 14 Kopfformen und 252 Porträts lief auf allen drei Projekten erfolgreich;
- Porträt-Identitätskette, Charaktererstellung, Kopfformen, Gesichtsmerkmale, Frisuren und Bartprüfungen blieben grün.

Browserartefakt:

- Name: `Rasenschach-Browsertest`
- Artifact-ID: `10519334408`
- SHA-256: `46b7669665d8aa6542b832985dca24806f6ccc2d86e5b4861c21229ae8f15fc4`
- Größe: 27.043.709 Byte
- 103 Dateien im Artefakt.

## Tatsächliche visuelle Kontrolle

Das Browserartefakt wurde heruntergeladen und die erzeugten PNG-Matrizen wurden geöffnet. Geprüft wurden insbesondere:

- Gesamtmatrix aller 14 Kopfformen;
- kritische Reihen der neuen Kopfformen 10–13;
- 72-, 96- und 145-px-Darstellungen;
- männliche und weibliche Porträts;
- helle, mittlere und dunkle Haut-/Trikotkontraste.

### Befund

- Hals bleibt sichtbar innerhalb der vorgesehenen V-Öffnung;
- geschlossene Trikotflächen decken die Halsbasis sauber ab;
- an der Vorderkante des Kragens ist kein Hautdurchscheinen mehr erkennbar;
- keine neue sichtbare Lücke zwischen Kopf/Hals/Kragen;
- die kleinen 72-px-Porträts bleiben geschlossen und lesbar;
- die neuen Kopfformen, Frisuren- und Bartkorrekturen aus den vorherigen Paketen bleiben optisch intakt.

## Patch-Brücke dokumentiert

Die neue Arbeitsmöglichkeit ist dauerhaft im Repository beschrieben:

- `PATCH-BRUECKE.md` – Zweck, Schutzregeln, Nutzung, Grenzen und belegter Ersteinsatz;
- `AGENTS.md` – verbindlicher Verweis für automatisierte Mitarbeit und neue Bearbeiter;
- `.github/workflows/safe-patch.yml` – ausführender, auf Arbeitsbranches begrenzter Workflow.

Dadurch können spätere ChatGPT-/Codex-/Claude- oder andere Arbeitsumgebungen gezielte Änderungen an konfliktanfälligen Großdateien sicher über Unified Diffs einspielen, ohne eine komplette alte `App.jsx` zurückzuschreiben.

## Grenzen

- Es wurde kein neuer physischer Android-Geräte-Screenshot speziell für diesen Fix aufgenommen.
- Browser-Sichtprüfung und Android-Geräteprüfung werden nicht gleichgesetzt.
- Der Fix betrifft ausschließlich SVG-Layering im gemeinsamen Avatar-Renderer und enthält keine native Android-Änderung.

## Status

**CHAR-FIX-02 erfüllt die vorgesehenen technischen und visuellen Abnahmekriterien und ist zur Integration freigegeben.**
