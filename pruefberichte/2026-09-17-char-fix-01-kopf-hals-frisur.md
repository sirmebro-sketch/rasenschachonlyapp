# CHAR-FIX-01 – Kopf, Hals und Frisur sauber ankoppeln

Datum: 17.09.2026  
Bearbeiter: **ChatGPT/Codex**  
Basis: `85694fdbfe84f4155e6749fc388fcc6cc4387bd1` (`main`, Version 35.192.0)  
Arbeitsbranch: `codex/char-fix-01-kopf-hals-frisur`  
Pull Request: #14  
Paket: `CHAR-FIX-01`

## Ziel

Die auf aktuellen Android-Screenshots sichtbaren Anschlussfehler zwischen Kopf, Hals, Trikot/Kragen und Frisuren beheben, ohne gespeicherte Kopf-, Haar-, Bart- oder Gesichtskennungen umzudeuten. Besonders geprüft wurden die neuen Kopfformen **Trapez (ID 10), Langkantig (ID 11), Diamant (ID 12) und Kurzbreit (ID 13)** sowie kurze/rasierte Frisuren.

## Ursachenanalyse

### Kopf / Hals / Kragen

Der Hals war geometrisch an das variable Kinn der jeweiligen Kopfform gekoppelt, während Trikot und Kragen an einer festen Körperposition lagen. Dadurch konnte ein kurzer Kopf sichtbar über dem Trikot schweben; ein langes Kinn konnte dagegen bis in den Kragen hineinragen und einen eingesunkenen beziehungsweise buckligen Eindruck erzeugen.

### Haare / neue Kopfsilhouetten

Die moderne Haarpassform leitete ihre Geometrie zu stark aus einer allgemeinen Kopfbreite ab. Bei neuen Silhouetten ist Kopfbreite jedoch nicht gleich Stirn-/Schläfenbreite. Besonders bei Diamant, Langkantig und Kurzbreit entstanden deshalb seitliche Lücken, Hautkeile beziehungsweise unruhige Übergänge.

### Rasiert / sehr kurz

Die allgemeine Haarunterlage reichte auch bei `rasiert` weit an die Schläfen. Dadurch waren dunkle seitliche Schatten möglich, obwohl oben keine entsprechend große Haarfläche sichtbar war.

## Änderungen

### `App.jsx`

- gemeinsamer fester Hals-/Kragen-/Körperanker statt Halsposition aus dem variablen Kinn;
- Kragen liegt zeichnerisch sauber vor dem Hals;
- `Langkantig` wächst kontrolliert nach oben statt in den Kragen hinein;
- moderner Haar-Renderer erhält Kopfformprofil und den tatsächlichen Kopfpfad für beide Haarlagen;
- vorhandene Kopf-IDs bleiben unverändert.

### `haarformen.jsx`

- profilabhängige Passform für `trapez`, `lang`, `diamant` und `kurzbreit`;
- tatsächlicher Kopfpfad dient als Clip für die Haarunterlage;
- bei den neuen Silhouetten wird die Unterlage bewusst etwas größer als der theoretische Schädel gezeichnet und anschließend exakt am realen Kopfpfad beschnitten; dadurch entstehen keine offenen Hautspalten;
- `rasiert` verwendet eine flache, transparente Oberkopfkappe ohne breite dunkle Seitenunterlage;
- nach der ersten Sichtprüfung wurde ein verbleibender heller Saum bei Langkantig/Undercut/Pixie festgestellt und in zwei Schritten korrigiert:
  1. größere, am echten Kopfpfad geclippte Unterlage gegen den deutlichen Halo;
  2. ausschließlich an den vier neuen Köpfen eine schmale haarfarbene Überdeckung der oberen realen Kopfkontur gegen den verbleibenden Anti-Aliasing-/Kontursaum;
- `rasiert`, `licht` und `glatze` werden von dieser zusätzlichen Kontur nicht verfälscht;
- bestehende Reihenfolge und Bedeutung der Haar-IDs wurde nicht verändert.

### Reproduzierbarer Prüfstand

Neu hinzugefügt beziehungsweise eingebunden:

- `tools/char-fix-01.test.cjs`
- `tools/char-fix-01-vorschau.cjs`
- `tools/browser/char-fix-01.spec.js`
- `.preview/char-fix-01.html` über `npm run preview:gallery`

Die Sichtmatrix rendert für **jede der 14 Kopfformen**:

- 72 / 96 / 145 px;
- männlich / weiblich;
- helle / mittlere / dunkle Haut;
- wechselnde kritische kurze Frisuren.

Das ergibt **18 Kombinationen je Kopfform beziehungsweise 252 Porträts** in der Vollmatrix. Zusätzlich gibt es pro Kopf eine fokussierte kritische Reihe mit:

- Mann: `rasiert`, `undercut`, `fade`;
- Frau: `kurz`, `pixie`, `fade`.

## Kompatibilitätsnachweis

- Kopf-IDs 0–9 behalten ihre historische Bedeutung;
- neue Köpfe bleiben IDs 10–13 in derselben Reihenfolge;
- vorhandene Haar-IDs wurden weder umnummeriert noch neu belegt;
- Bart- und Gesichts-IDs wurden nicht verändert;
- Regression für historische Seed-Porträts bleibt grün;
- Porträtidentitätskette Karriere → Ruhmeshalle → Karte → Vereinskader bleibt grün.

## Automatische Prüfung des finalen PR-Codes

Geprüfter Code-Head: `2134a76cf2df226a4c7856314d9509cd99a014bd`.

### Spielregressionen und Web-Build

GitHub Actions Run `35260714068`: **erfolgreich**.

- `npm test`: **123/123 bestanden**, 0 fehlgeschlagen, 0 übersprungen;
- alle vier gezielten CHAR-FIX-01-Regressionen bestanden;
- `npm run build`: **erfolgreich**;
- Vite 6.4.3, 53 Module transformiert.

Bekannte, nicht blockierende Hinweise:

- vorhandene React-SSR-Hinweise zu `useLayoutEffect`;
- Vite-Hinweis auf großen Hauptchunk;
- GitHub-Actions-Hinweis zur Node-20-Abkündigung älterer Actions.

Keiner dieser Hinweise verursacht einen Fehlschlag dieser Runde.

### Browser / Playwright

GitHub Actions Run `35260714256`: **erfolgreich**.

- **35 bestanden, 10 planmäßig übersprungen, 0 fehlgeschlagen**;
- 45 Testfälle über `handy`, `schmal` und `desktop`;
- CHAR-FIX-01-Vollmatrix auf allen drei Projekten erfolgreich;
- zusätzlicher Geometriecheck für `rasiert`/kurz auf Desktop erfolgreich; auf den beiden mobilen Projekten bewusst per Testdefinition übersprungen;
- vorhandene Porträt-, Frisuren-, Kopfform- und Identitätsprüfungen weiterhin erfolgreich.

Browserartefakt:

- Name: `Rasenschach-Browsertest`
- Artifact-ID: `10514627244`
- SHA-256: `69ab4d6012e605a498890e030061ba61d319506fced3cb1966ffd819e8d08635`
- Größe: 25.367.895 Byte
- 99 Dateien im Artefakt.

## Android-Build

Ein vollständiger signierter Android-Release-Lauf wurde auf dem Arbeitsbranch nach den Kernänderungen an Kopf/Hals/Haaren erfolgreich ausgeführt:

GitHub Actions Run `35259106610`: **erfolgreich**.

Bestanden:

- Signierschlüsselprüfung;
- Regressionen;
- Web-Build und Capacitor-Synchronisierung;
- Release-APK;
- Release-AAB;
- Signaturprüfung von APK und AAB;
- Artefakt-Upload.

Die beiden danach vorgenommenen Änderungen betreffen ausschließlich die optische Anti-Halo-Feinabstimmung in `haarformen.jsx`. Der exakte finale Code-Head wurde anschließend erneut durch Regression, Produktions-Web-Build und Browser-Sichtmatrix geprüft. Der vollständige Android-Build des exakt gemergten Endstands ist deshalb zusätzlich als **Post-Merge-Gate auf `main`** vorgesehen und wird nicht vorweg behauptet.

## Tatsächliche visuelle Kontrolle

Die erzeugten PNG-Screenshots wurden nicht nur automatisch erzeugt, sondern geöffnet und visuell kontrolliert.

Geprüft wurden insbesondere die fokussierten und vollständigen Matrizen für:

- ID 10 – Trapez;
- ID 11 – Langkantig;
- ID 12 – Diamant;
- ID 13 – Kurzbreit.

Dabei wurden 72 / 96 / 145 px, beide Geschlechter, helle / mittlere / dunkle Haut und die kritischen Kurzhaarvarianten betrachtet.

### Verlauf der Sichtprüfung

Die Sichtprüfung hat in dieser Runde tatsächlich zwei weitere Korrekturen ausgelöst:

1. Ein früheres Artefakt zeigte bei Langkantig und teilweise Kurzbreit noch einen deutlich hellen Hautsaum um kurze Frisuren. **Nicht freigegeben; korrigiert.**
2. Das Folgeartefakt reduzierte diesen auf einen sehr dünnen Kontur-/Anti-Aliasing-Saum, unter anderem bei Langkantig + Undercut/Pixie. **Ebenfalls nicht freigegeben; nochmals korrigiert.**
3. Das finale Artefakt des Heads `2134a76...` wurde erneut geöffnet. Der störende helle Saum ist nicht mehr sichtbar.

### Finaler visueller Befund

- keine schwebenden neuen Köpfe über Trikot/Kragen erkannt;
- keine eingesunkene Langkantig-Kopfform mehr;
- Halsbasis und Kragen wirken über alle vier neuen Köpfe konsistent;
- keine auffälligen Haut-Zipfel oder offenen Schläfenlücken in den geprüften Kurzhaarvarianten;
- `rasiert` zeigt keine früheren dunklen seitlichen Fremdflächen;
- Trapez, Diamant und Kurzbreit erhalten durch die Anti-Halo-Korrektur keine unerwünschte dunkle Außenkontur;
- 72-px-Darstellung bleibt lesbar und geschlossen;
- keine sichtbaren Überläufe oder abgeschnittenen Kopf-/Haarflächen in den geprüften Matrizen.

## Grenzen der Prüfung

- Es wurde in dieser Runde kein neuer physischer Android-Geräte-Screenshot des finalen Heads `2134a76...` aufgenommen.
- Browser-Screenshot und Android-Build sind getrennte Nachweise; sie werden nicht gleichgesetzt.
- Der exakte gemergte Endstand muss nach dem Merge noch den normalen `main`-Android-Workflow bestehen.

## Status

**CHAR-FIX-01 ist technisch und visuell zur Integration freigegeben.**  
**PR #14 kann nach unverändert grünem Stand gemergt werden.**  
**Danach: Post-Merge-CI auf `main`, insbesondere vollständiger signierter Android-Build.**  
**Nächstes Charakterpaket: CHAR-P1-04 – Bärte und Bart/Kopfform-Kombinationen.**
