# Rasenschach XI – Charakter- & Optik-Arbeitsplan

> **Lebendes Arbeitsdokument.** Keine Versionsnummer im Titel, keine feste Testzahl und kein statischer „aktueller Stand“. Vor jeder Runde zuerst `START-NEUER-CHAT.md`, `AGENTS.md`, `README.md` und den aktuellen Repository-Stand lesen. Dieses Dokument beschreibt **Zielbild, Arbeitsweise, Einstiegspunkte und abnehmbare Arbeitspakete** für Charaktererstellung, Porträts, Spielerkarten, Wildcards, Packs und visuelle Qualität.

## 1. Warum dieses Dokument existiert

Der Bereich Charakter & Optik ist inzwischen groß genug, dass „mehr Varianten“ oder „schöner machen“ als Auftrag zu ungenau ist. Neue Formen können technisch korrekt sein und trotzdem praktisch gleich aussehen; Effekte können spektakulär sein und gleichzeitig Text oder Porträt verdecken. Dieses Dokument macht daraus überprüfbare Arbeit.

Es ist gleichermaßen für ChatGPT/Codex/Astra, Claude Code und spätere Arbeitsumgebungen gedacht. Es ersetzt weder die Rollenregeln noch `ENTWICKLUNG.md`: **hier stehen dauerhafte Ziele und Arbeitspakete; konkrete Ergebnisse, Messwerte und offene Befunde einer Runde gehören weiter in Entwicklungsvermerk oder Prüfbericht.**

## 2. Nicht verhandelbare Qualitätsregeln

1. **Erkennbare Variation statt bloßer Anzahl.** Eine neue Variante zählt erst als Gewinn, wenn sie bei normaler Darstellungsgröße tatsächlich von bestehenden Varianten unterscheidbar ist.
2. **Porträtidentität bleibt stabil.** Ein Charakter soll zwischen Erstellung/Karriere, Ruhmeshalle, Sammelkarte und Vereinskader wiedererkennbar bleiben. Neue Arbeit darf diese Weitergabe nicht erneut aufbrechen.
3. **Gespeicherte Indizes sind Vertrag.** Bestehende Porträt-/Frisur-/Bartkennungen nicht umnummerieren oder neu belegen. Neue Formen grundsätzlich anhängen oder bewusst migrieren; alte Speicherstände mitprüfen.
4. **Lesbarkeit schlägt Effektmenge.** Holo-, Glanz-, Licht- und Seltenheitseffekte dürfen Namen, Werte, erklärenden Text oder Gesicht nicht verschleiern.
5. **Formtreue.** Effekte müssen der tatsächlichen Karte, Wildcard oder Packkontur folgen. Keine rechteckigen Fremdkanten, abgeschnittenen Zacken oder Folien außerhalb der vorgesehenen Form.
6. **Mobile zuerst.** Schmale Smartphoneansichten, kleine Karten und Touch-Ziele sind Pflichtfälle, nicht Nacharbeit.
7. **Ruhemodus ist wirklich ruhig.** Bei ausgeschalteten/reduzierten Animationen dürfen keine versteckten Wander-, Schwebe-, Beben- oder Pulsbewegungen weiterlaufen.
8. **Vorher/Nachher ansehen.** Visuelle Änderungen sind nicht allein durch Build oder Unit-Test abgenommen.
9. **Keine alte Gesamtdatei zurückkopieren.** `App.jsx` ist konfliktanfällig. Änderungen gezielt integrieren und parallele Arbeit erhalten.
10. **Keine Testbehauptung ohne Test.** Browser, Galerie, statisches Rendering und Android-Gerät sind verschiedene Prüfarten.

## 3. Dauerhafte technische Einstiegspunkte

Nicht mit Zeilennummern arbeiten; Funktionen und Dateien können wandern.

### Porträt und Charaktererstellung

- `portraet.js` – stabile Editoroptionen, Anzeigenamen, neue Indizes und Würfellogik. Neue gespeicherte Varianten hier **append-only** ergänzen.
- `haarformen.jsx` – moderner Renderer für Frisuren und Haarsilhouetten.
- `bartformen.jsx` – Bartgeometrie, die an tatsächliche Kopf-/Kieferkonturen gekoppelt ist.
- `App.jsx` – unter anderem `Avatar`, Merkmals-/Farbdefinitionen, Kopfformen und `CreateScreen`; außerdem die Stellen, an denen Porträtdaten in Karriere, Halle, Karten und Verein weitergereicht werden.
- `tools/portraet.test.cjs` – Schutz für stabile Optionen, Freischaltungen, Würfeln und gespeicherte Merkmale.
- `tools/portraet-bogen.cjs` – gerenderte Vergleichsbögen aus dem echten Avatar-Renderer.
- `tools/visuelle-vorschau.cjs` – isolierte Galerie mit Merkmalwahl, Haut-/Haarfarbe, Kopf, Geschlecht und Charaktererstellung.

### Karten, Wildcards und Packs

- `karteneffekte.jsx` – gemeinsame Material-/Folienebene und Konturen für Karten/Elfkarte/Pack.
- `wildcardoptik.jsx` – Prägungen und Bühnen hoher Wildcard-Seltenheiten sowie Ruhemodus-CSS.
- `App.jsx` – `Spielerkarte`, `Elfkarte`, `WildcardCard`, `WildcardEnthuellung`, `Boosterpack` und die jeweilige Informationshierarchie.
- `tools/karteneffekte.test.cjs` – strukturelle Regressionen der Materialeffekte.
- `tools/visuelle-vorschau.cjs` – echte Spielerkarten, Packs, Wildcard-Aufdeckungen und Bewegung-aus-Vergleich.
- `tools/browser/` und `npm run test:browser` – responsive Browserwege/Screenshots/Traces.

### Ganze Bedienwege

- `tools/spieltest.cjs` – echte App mit getrenntem Sitzungsspeicher für reproduzierbare Klickpfade.
- `.preview/bildschirm.html` – feste schmale/breite Prüfansichten laut README.
- echter Android-Build/Gerätetest – maßgeblich für Touch, WebView-Leistung, native Unterbrechungen und Dateidialoge.

## 4. Arbeitsmodus für diesen Bereich

Jede Runde nimmt **ein oder wenige klar benannte Arbeitspakete** aus Abschnitt 6. Der Bearbeiter schreibt vor Beginn kurz in seinen Entwicklungsvermerk:

- Paket-ID(s),
- Basiscommit,
- betroffene Dateien/Komponenten,
- was als Erfolg gelten soll,
- welche Prüfungen vorgesehen sind.

Nach der Runde werden dort Ergebnis, Tests, Screenshots/Befunde und Restpunkte dokumentiert. Dieses Dokument wird nur geändert, wenn sich ein dauerhaftes Ziel, Paket oder technischer Einstiegspunkt ändert.

### Statusbegriffe

- **BEREIT** – kann ohne weitere Produktentscheidung begonnen werden.
- **SICHTPRÜFUNG** – Umsetzung kann vorbereitet werden, endgültige Auswahl braucht visuelle Bewertung.
- **ANDROID** – Browserprüfung reicht nicht; echte Geräteabnahme bleibt erforderlich.
- **OPTIONAL** – sinnvoll, aber nicht vor höher priorisierten offenen Punkten.
- **ERLEDIGT** – nur setzen, wenn Akzeptanzkriterien und vorgesehene Prüfungen dokumentiert erfüllt sind.

## 5. Bewertungsmatrix für Porträtqualität

Bei jeder neuen oder überarbeiteten Merkmalsgruppe mindestens diese Fragen beantworten:

| Kriterium | Frage |
|---|---|
| Silhouette | Ist die Variante auf 72–145 px ohne Beschriftung erkennbar anders? |
| Kombination | Funktioniert sie mit mehreren Kopfbreiten/-formen und Haut-/Haarfarben? |
| Kontur | Gibt es Hautkeile, Löcher, Überstände, harte Kanten oder ungewollte Clippings? |
| Identität | Bleibt derselbe gespeicherte Index überall gleich gerendert? |
| Geschlecht/Typ | Ist die Zuordnung sinnvoll, ohne unnötig Varianten doppelt zu pflegen? |
| Mobil | Bleibt das Merkmal auch auf kleinen Karten erkennbar? |
| Vielfalt | Fügt die Variante eine neue Formensprache hinzu statt nur 1–2 Pixel zu verschieben? |
| Benennung | Beschreibt der sichtbare Name die Form eindeutig genug? |
| Freischaltung | Bleiben alte Basis-/Bonusformen und gespeicherte Indizes gültig? |

**Heuristik:** Wenn zwei Varianten in einem unbeschrifteten Vergleichsbogen bei normaler Größe regelmäßig verwechselt werden, gelten sie als Kandidaten für stärkere Differenzierung statt als zwei wertvolle Optionen.

## 6. Vorbereiteter, priorisierter Backlog

Die Reihenfolge ist eine Qualitäts-/Risikoreihenfolge. Der letzte Nutzerauftrag kann sie jederzeit ändern.

### CHAR-P0-01 – Live-Bestandsaufnahme der Charaktererstellung — BEREIT

**Ziel:** Vor weiteren Massenergänzungen erfassen, welche vorhandenen Optionen wirklich unterschiedlich, schwach, fehlerhaft oder redundant wirken.

**Vorgehen:**
- aktuelle Optionen aus dem Live-Code bestimmen, keine Zahlen aus alten Berichten übernehmen;
- in der isolierten Galerie alle Merkmalsgruppen für Mann/Frau durchsehen;
- Kopfformen mit mehreren Haar-/Hautfarben kombinieren;
- Frisuren und Bärte zusätzlich mit `tools/portraet-bogen.cjs` als unbeschriftete/vergleichbare Bögen rendern;
- Befunde in neuem datierten `pruefberichte/...`-Bericht als Matrix `stark / brauchbar / ähnlich / Fehler` dokumentieren;
- **keine Varianten allein aufgrund persönlicher Vorliebe löschen oder umnummerieren.**

**Abnahme:** Jede aktuelle Merkmalsgruppe hat einen belegten Befund; konkrete Dopplungen/Defekte sind mit Index und reproduzierbarer Ansicht benannt.

### CHAR-P0-02 – Porträt-Identitätskette absichern — BEREIT

**Ziel:** Jede künftige Erweiterung kann nachweisen, dass Gesicht/Frisur/Bart/Geschlecht beim Übergang Karriere → Ruhmeshalle → Karte → Vereinskader erhalten bleiben.

**Vorgehen:** vorhandene Regressionen prüfen und nur fehlende Übergänge ergänzen; Altstand-Fall mit vorhandener Hallen-ID beibehalten; keine namensbasierte Rekonstruktion einführen.

**Abnahme:** automatisierte Regression für die relevanten Übergänge plus ein sichtbarer Vergleich im isolierten Spieltest. Fehlende historische Quelle wird als Grenze dokumentiert, nicht erfunden.

### CHAR-P1-01 – Kopfformen stärker differenzieren — SICHTPRÜFUNG

**Ziel:** breite, schmale, kantige, runde, längliche und zartere Silhouetten klar unterscheidbar machen, ohne Haare/Bärte zu zerreißen.

**Regel:** vorhandene Indizes erhalten. Wenn bestehende Form nur korrigiert wird, prüfen, ob alte Porträts dadurch unvertretbar ihr Aussehen ändern; bei grundlegender neuer Silhouette neuen Index anhängen.

**Abnahme:** Vergleichsbögen über mehrere Frisuren/Bärte; keine sichtbaren Kiefer-/Haar-Clippingfehler; mobile Lesbarkeit.

### CHAR-P1-02 – Augen/Brauen/Nase/Mund/Wangen mit echter Formvielfalt — SICHTPRÜFUNG

**Ziel:** Unterschiede sollen das Gesicht erkennbar prägen und nicht nur als benannte Miniabweichungen existieren.

**Vorgehen:** zuerst CHAR-P0-01 nutzen; redundante Formen gezielt auseinanderziehen; neue Formen nur append-only. Übertreibung vermeiden, aber Unterschiede bei Karten-/Avatargröße sichtbar halten.

**Abnahme:** unbeschrifteter Vergleich bei normaler Avatargröße; mindestens mehrere deutlich verschiedene Kombinationen mit gleicher Kopf-/Haarbasis.

### CHAR-P1-03 – Frisurenkatalog qualitativ verbreitern — SICHTPRÜFUNG

**Ziel:** zusätzliche echte Kategorien statt Variationen derselben Kurzhaar-/Locken-Silhouette. Besonders Längen, Volumen, Haaransatz, Scheitel, Flecht-/Zopfstrukturen und unterschiedliche Texturen abdecken.

**Technik:** `portraet.js` Indizes/Namen append-only; Renderer in `haarformen.jsx`; alte Renderer/alte Kennungen nicht nebenbei brechen.

**Abnahme:** Bögen für beide Geschlechter, mehrere Haarfarben/Kopfformen, keine Hautspalten am Scheitel/Schläfen, kleine Darstellung geprüft.

### CHAR-P1-04 – Bärte und Kombinationen ausbauen — SICHTPRÜFUNG

**Ziel:** Bartformen unterscheiden sich in Wangenlinie, Kinnlänge und Schnurrbartanteil und passen zu unterschiedlichen Kieferformen.

**Technik:** vorhandene Bartkontur-Kopplung in `bartformen.jsx` erhalten; keine Rückkehr zu angenäherter Ellipse.

**Abnahme:** mehrere Kopfformen, helle/dunkle Bartfarben, keine Hautkeile; kleine Avatargröße.

### CHAR-P1-05 – Charaktererstellung als Bedienoberfläche verbessern — BEREIT

**Ziel:** große Auswahl bleibt auf dem Smartphone verständlich und schnell bedienbar.

**Prüfpunkte:** Kategorien, sichtbare aktuelle Auswahl, Würfeln + Festhalten, Freischaltungen, Zurück/Weiter, Scroll-/Touchwege, 320/390 px. Keine neue Pflichtwährung oder unnötige Zwischenseite.

**Abnahme:** echter Browserklickweg auf schmalen Größen; kein verdeckter Pflichtbutton; gespeicherte Auswahl nach Start identisch.

### CHAR-FIX-02 – Hals/Kragen sauber maskieren — ERLEDIGT

**Einordnung:** gezielter Korrekturschritt nach CHAR-P1-05 und vor dem nächsten Karten-/Effektpaket. Der sichtbare Porträtfehler soll zuerst bereinigt werden, ohne die bestehende Charakteridentität oder gespeicherte Kennungen zu verändern.

**Ziel:** Der Hals liegt geometrisch korrekt im Trikotausschnitt. Der Kragen wird vor dem unteren Hals gerendert bzw. maskiert; Haut darf nicht durch geschlossene Kragenflächen oder über deren Vorderkante scheinen.

**Technik:** Ursache im gemeinsamen Avatar-/Porträt-Renderer beheben und eine belastbare Layer-/Maskenlösung verwenden. Keine Sonderfälle pro Porträtindex und keine Umnummerierung vorhandener Kopf-, Haar-, Bart- oder sonstiger Porträt-IDs.

**Prüfung:** beide Geschlechter/Typen, mehrere breite/schmale Kopfformen und repräsentative Porträtkombinationen; große Charaktervorschau sowie kleine Spieler-/Vereinskarten; helle und dunkle Haut-/Trikotkontraste. Vorher/Nachher visuell vergleichen und eine Regression für die Rendering-Reihenfolge bzw. relevante Struktur ergänzen, soweit sinnvoll automatisierbar.

**Abnahme:** kein Hals-/Hautdurchscheinen außerhalb der vorgesehenen Kragenöffnung, keine neuen Hals-/Kragen-Clippings oder sichtbaren Spalten, Porträt-IDs und gespeicherte Charaktere bleiben kompatibel, kleine und große Darstellung sind sichtbar geprüft.

### CHAR-FIX-04 – Bart-/Kurzhaar-Restpassung — SICHTPRÜFUNG

**Anlass:** Die formale CHAR-FIX-03-Matrix war grün, aber die anschließende echte Nutzersichtung zeigt weiterhin konkrete Passungsfehler. Besonders **Kinnbart (Bart-ID 4)** und **Ankerbart (Bart-ID 14)** sitzen falsch; weitere Bartformen müssen deshalb systematisch mitgeprüft werden. Außerdem sind viele kurze Frisuren auf den vier neueren Kopfformen **Trapez (Kopf 10)**, **Langkantig (11)**, **Diamant (12)** und **Kurzbreit (13)** zu klein bzw. decken die reale Kopfkontur oben/seitlich nicht, sodass Haut sichtbar durchscheint.

**Ziel:** Keine kosmetische Einzelkorrektur, sondern belastbare Restpassung der Bart- und Kurzhaar-Geometrie. Problematische Formen müssen an der tatsächlichen Kopf-/Kiefer-/Gesichtsgeometrie sitzen und kurze Frisuren die beabsichtigte Kopfzone ohne ungewollte Hautkeile abdecken.

**Pflichtprüfung Bärte:**
- alle sichtbaren Bart-IDs 1–15 auf allen 14 Kopfformen prüfen;
- Schwerpunkt mindestens auf ID 4 **Kinnbart**, ID 5 **Ziegenbart**, ID 8 **Kinnriemen**, ID 12 **Konturierter Bart**, ID 13 **Spitzer Vollbart**, ID 14 **Ankerbart**, ID 15 **Breiter Vollbart**;
- kritische Nasen-/Mundkombinationen aus CHAR-FIX-03 weiterverwenden und um Kombinationen ergänzen, bei denen Kinn-/Ankerformen sichtbar verrutschen;
- Bart darf nicht auf Nase, Lippen oder Zähne rutschen; Kinn-/Ankerteile müssen am tatsächlichen Kinn und nicht an einer generischen historischen Y-Position sitzen;
- absichtliche Längen unterhalb des Kinns bleiben erlaubt, müssen aber zentriert und proportional zur jeweiligen Kinn-/Kieferform sein.

**Pflichtprüfung Frisuren:**
- alle Frisuren gegen Kopf 10–13 rendern; Schwerpunkt auf kurzen/kompakten Typen;
- Männer insbesondere: `rasiert(0)`, `kurz(1)`, `scheitel(2)`, `undercut(3)`, `textur(6)`, `licht(7)`, `slick(12)`, `crop(13)`, `flach(14)`, `seitlich(15)`, `vorhang(20)`, `fade(21)`, `iro(23)`;
- Frauen insbesondere: `kurz(0)`, `bob(3)`, `pixie(7)`, `crop(9)`, `fade(19)`, `iro(21)`;
- keine ungewollten Hautspalten am Scheitel, oberen Schädelrand oder an den seitlichen Kopfenden;
- bei bewusst rasierten/Fade-Formen darf Haut sichtbar sein, aber nur als erkennbar gewollte Frisur — nicht als unmaskierter Spalt oder zu kleine Haarunterlage;
- keine pauschale Übervergrößerung, die Haarflächen in Stirn/Gesicht oder außerhalb der realen Kopfmaske drückt.

**Technik:** Bestehende IDs bleiben unverändert. `haarformen.jsx`, `bartformen.jsx`, `gesichtsanker.js` und der echte `Avatar` in `App.jsx` sind gemeinsam zu betrachten. Die reale Kopfmaske/`kopfpfad` soll Quelle der Passung bleiben. Keine Sonderfälle nur für einzelne gespeicherte Porträt-IDs, wenn eine geometrische Regel das Problem sauber lösen kann.

**Abnahme:** Vorher/Nachher-Sichtbogen mit allen vier neuen Köpfen und den kritischen Kurzhaarformen; Bart-Vollbogen mit mindestens allen 15 Bart-IDs auf den vier neuen Köpfen sowie repräsentativen alten Köpfen. Kleine Spielgröße (72/96 px) und große Vorschau prüfen. Automatische Tests müssen zusätzlich **Hautkeile/Abdeckungsfehler** und **Bartanker-Lage** stärker absichern als CHAR-FIX-03. Build/Browser grün allein gilt ausdrücklich nicht als visuelle Abnahme.

### CARD-P0-01 – Schichtenvertrag für Spielerkarten — BEREIT

**Ziel:** Kartenmaterial wirkt hochwertig, ohne Porträt/Text/Werte zu überdecken.

**Soll-Reihenfolge:** Kartenfläche/Material **hinter** Inhalt; dekorative Druck-/Rahmenelemente kontrolliert; Porträt und Informationsinhalt lesbar; Aufdecklicht/Bühne außerhalb nur wo bewusst vorgesehen.

**Prüfung:** Bronze/Silber/Gold/Legende klein + groß, mehrere Porträts, helle/dunkle Bereiche, Ruhemodus.

**Abnahme:** kein wandernder Effekt über lesekritischem Inhalt, sofern nicht bewusst sehr dezent; keine abgeschnittenen Rechtecke; Seltenheiten bleiben visuell unterscheidbar.

### CARD-P0-02 – Packkontur und Folie systematisch prüfen — BEREIT

**Ziel:** Holo-/Glanzfläche folgt der gezackten Packform, Druck bleibt darüber stabil und nichts wirkt seitlich/oben abgeschnitten.

**Technik:** gemeinsame Kontur in `karteneffekte.jsx` als Quelle nutzen; doppelte konkurrierende Masken vermeiden.

**Abnahme:** alle Packstufen in Galerie und schmaler Browseransicht, mit/ohne Bewegung; mindestens Gold/Legende auf Android nachziehen.

### WILD-P0-01 – Wildcard-Seltenheiten als konsistente Familie — SICHTPRÜFUNG

**Ziel:** alle Seltenheitsstufen teilen dieselbe Informationslogik; höhere Stufen steigern Material/Bühne, nicht Unlesbarkeit.

**Prüfung:** Vorderseite im Pass und bei Enthüllung vergleichen; Welt/GOAT/HSV mit eigener Bühne; Ruhemodus; Weiter-Button und vollständiger Text im Sichtbereich.

**Abnahme:** keine Layoutsprünge, kein abgeschnittener Effekt, keine überlagerte Information, hohe Stufen eindeutig aber nicht chaotisch.

### OPTIK-P0-01 – Ruhemodus-Audit — BEREIT

**Ziel:** sämtliche Charakter-/Karten-/Wildcard-/Packeffekte respektieren reduzierte Bewegung.

**Vorgehen:** Galerie mit „Animationen aus“, Browser-Smokes und CSS-Klassen prüfen; Farb-/Zustandsfeedback darf bleiben, echte Bewegung nicht.

**Abnahme:** keine verbleibende periodische Translation/Rotation/Skalierung/Schwebe-/Bebenanimation in den geprüften Komponenten.

### OPTIK-P1-01 – Mobile visuelle Abnahme — BEREIT / ANDROID

**Ziel:** 320/390 px Browserprüfung plus echte Android-Nachkontrolle für die wichtigsten Oberflächen.

**Browser:** Charaktererstellung, Spielerkarte, Wildcard-Aufdeckung, Packladen, horizontale Reiter.

**Android:** Touch, Framerate/Effektleistung, Launcher/WebView-Darstellung, Rotation/Unterbrechung soweit betroffen.

**Abnahme:** Browserbefund und Androidbefund getrennt dokumentiert.

### OPTIK-P2-01 – Barrierearme Kontraste/Lesbarkeit — OPTIONAL

**Ziel:** Spezialfarben und Seltenheiten bleiben auch bei kleinen Texten und hellen/dunklen Porträts lesbar. Keine rein farbliche Information, wenn ohne großen Aufwand ein zusätzliches Form-/Textsignal möglich ist.

## 7. Was ChatGPT/Astra besonders übernehmen sollte

Für einen leistungsstarken Hauptlauf sind besonders geeignet:

- CHAR-P0-01 auswerten und daraus die **visuell wertvollsten** neuen Merkmale auswählen;
- Varianten gegeneinander beurteilen, bevor viele neue Indizes dauerhaft eingeführt werden;
- große Querschnittsentscheidungen über Gesichtsstil, Charaktererstellungs-UX und Seltenheitsdesign;
- Claudes Branches fachlich abnehmen und in den aktuellen `main` integrieren;
- nach mehreren Teilrunden eine Gesamt-Sichtprüfung durchführen.

Astra/ChatGPT soll nicht Zeit damit verlieren, erst herauszufinden, wo Renderer, Tests und Galerien liegen: Abschnitt 3 ist dafür der Einstieg.

## 8. Was Claude Code gut parallel vorbereiten kann

Unter Beachtung von `CLAUDE.md` und ausschließlich auf eigenem Branch:

- einzelne Renderer-/Konturverbesserungen mit klarer Paket-ID;
- neue append-only Merkmalsvarianten mit Namen + Tests;
- Erweiterungen der Galerie/Porträtbögen für bessere Vergleiche;
- gezielte Regressionen für Porträtweitergabe und Effektlayer;
- reproduzierbare Befundberichte zu einem abgegrenzten Paket.

Claude soll **keine große Stilentscheidung durch Menge erzwingen** (z. B. 30 neue Frisuren ungeprüft hinzufügen) und die eigene Arbeit nicht selbst nach `main` integrieren.

## 9. Pflichtprüfungen nach Art der Änderung

| Änderung | Mindestprüfung |
|---|---|
| Namen/Optionen/Indizes | `npm test`, Speicher-/Freischaltungsregressionen |
| Haar/Bart/Gesichtsgeometrie | `npm test`, Porträtbogen, Galerie, mehrere Köpfe/Farben |
| Charaktererstellungs-UI | `npm test`, `npm run build`, Browserweg 320/390, Galerie |
| Karten-/Packeffekt | `npm test`, `npm run build`, Galerie mit/ohne Bewegung, Browser |
| Wildcard-Bühne/Aufdeckung | Regression + Galerie aller relevanten Stufen + schmale Ansicht |
| Identitätsweitergabe | Regression + isolierter Spieltest |
| native/Touch/Performance | Android-Gerätetest zusätzlich; Browser nicht als Ersatz ausgeben |

Wenn eine App-Code-Änderung veröffentlicht werden soll, zusätzlich die normalen Projektregeln für Capacitor-Sync, Versionierung und CI anwenden.

## 10. Dokumentationsformat für eine Teilrunde

In `ENTWICKLUNG.md` oder einem neuen `pruefberichte/<datum>-charakter-optik-....md` mindestens:

```text
Paket: CHAR-/CARD-/WILD-/OPTIK-...
Basiscommit: ...
Ziel: ...
Geändert: ...

Sichtprüfung:
- Umgebung/Viewport:
- Varianten/Fälle:
- Befund:

Automatisch geprüft:
- npm test:
- build:
- browser:
- weitere:

Android:
- durchgeführt / ausdrücklich offen

Kompatibilität:
- alte Indizes/Spielstände:
- Porträtidentität:

Bewusst offen:
- ...

Empfehlung für nächste Runde:
- ...
```

Keine feste Testzahl oder Versionsnummer aus diesem Arbeitsplan kopieren; immer den aktuellen Lauf dokumentieren.

## 11. Definition „fertig“ für Charakter & Optik

Der Bereich ist nicht dadurch fertig, dass eine Zielzahl an Frisuren oder Effekten erreicht ist. Eine größere Qualitätsrunde gilt als erfolgreich, wenn:

- die vorhandenen Optionen systematisch gesichtet und Redundanzen bekannt sind,
- neue Merkmale sichtbar neue Silhouetten/Formen bringen,
- Kombinationen über mehrere Kopf-/Haut-/Haarvarianten robust sind,
- Porträtidentität über alle Systeme stabil bleibt,
- Karten/Wildcards/Packs ihre Information nicht durch Effekte verlieren,
- Ruhemodus und mobile Layouts sauber sind,
- automatisierte Regressionen die wichtigsten Verträge schützen,
- Android-spezifische Restprüfung klar benannt oder durchgeführt ist,
- der nächste Bearbeiter anhand Paket-IDs und Prüfbericht exakt weiß, wo weiterzumachen ist.

## 12. Erster sinnvoller Einstieg für einen neuen Bearbeiter

Wenn der Nutzer nur sagt „arbeite an Charakteren/Optik weiter“:

1. Live-Stand und offene Branches/PRs nach `START-NEUER-CHAT.md` prüfen.
2. Dieses Dokument lesen.
3. Jüngsten passenden Prüfbericht lesen.
4. Falls noch keine aktuelle vollständige Bestandsaufnahme existiert: **CHAR-P0-01** beginnen.
5. Danach zuerst belegte Defekte/Redundanzen beseitigen, dann hochwertige neue Varianten hinzufügen.
6. Bei Karten-/Effektauftrag stattdessen mit **CARD-P0-01/CARD-P0-02/WILD-P0-01** starten.
7. Ergebnisse dokumentieren und Paketstatus nur mit Beleg als erledigt behandeln.
