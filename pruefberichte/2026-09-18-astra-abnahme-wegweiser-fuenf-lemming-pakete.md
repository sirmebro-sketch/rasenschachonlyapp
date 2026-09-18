# Astra-Abnahme-Wegweiser – fünf Lemming-Pakete

**Stand:** 18.09.2026  
**Rolle:** Lemming · reine Dokumentation  
**Live-main:** `703d377e8eaa7932b6f5fed62ca313807ad16486` · Version `35.194.1`

## Kurzlage

Die fünf beauftragten Pakete lassen sich anhand von PR-Inhalt, Diff und Prüfberichten eindeutig zuordnen:

| Paket | Zugehöriger PR | Live-Status |
|---|---|---|
| Packkonturen und Glanz | [#31 – CARD-P0-02](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/31) | offen, nicht Draft, nicht gemergt, mergebar, 0 hinter main |
| Lesbarkeit der Spielerkarten | [#32 – OPTIK-P2-01](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/32) | offen, nicht Draft, nicht gemergt, mergebar, 0 hinter main |
| Ruhemodus bei Packs | [#33 – OPTIK-P0-01](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/33) | offen, nicht Draft, nicht gemergt, mergebar, 0 hinter main |
| Wischhinweis der Charakter-Kategorien | [#38 – CHAR-P1-05](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/38) | offen, nicht Draft, nicht gemergt, mergebar, 0 hinter main |
| Wildcard-Aufdeckung auf schmalen Bildschirmen | [#39 – WILD-P0-01](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/39) | offen, nicht Draft, nicht gemergt, mergebar, 0 hinter main |

Für „Packkonturen und Glanz“ wurde kein zweiter separater Glanz-PR gefunden. Die Zuordnung zu #31 ist dennoch eindeutig: dessen Prüfbericht verlangt ausdrücklich, dass „Folie/Glanz“ innerhalb der gezackten Packkontur bleibt.

Alle fünf PRs basieren auf dem derzeitigen main-Commit `703d377`. GitHubs heutige Mergebar-Angabe ist nur eine Momentaufnahme; nach Integration eines anderen PRs muss der dann verbleibende Stand erneut abgeglichen werden.

## 1. Packkonturen und Glanz — PR #31

- **Branch / Head:** `lemming/card-p0-02-packkontur` · `4aa1bf62a0afa560aa2968b02eb3e2191f656a18` · 5 Commits vor main.
- **Umfang laut Lemming:** Bronze/Silber/Gold/Legendär bei 320×720 und 390×844, Animation an/aus; Packkontur, Folienclip, Druckebene und Lesbarkeit. Kein Produktfehler reproduziert, deshalb kein Produktcode geändert.
- **Geänderte Dateien, von mir am PR-Diff geprüft:** `CHARAKTER-OPTIK-ARBEITSPLAN.md`, `pruefberichte/2026-09-18-card-p0-02-packkontur.md`, neu `tools/browser/packs.spec.js`.
- **Lemming-Testangaben:** final 140/140 Spielregressionen; Browser 49 bestanden / 26 planmäßig übersprungen / 0 Fehler; vier Pack-Screenshots geöffnet und beurteilt.
- **CI von mir nachgeprüft:** Head-Runs [35345216167](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35345216167) „Spielregressionen“ und [35345216155](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35345216155) „Visuelle Browsertests“ sind beide `success`; die Jobs bestätigen erfolgreiche Schritte `npm test`, `npm run build`, `npm run preview:gallery` und `npm run test:browser`.
- **Bildnachweis:** CI-Artefakt `10546850722` „Rasenschach-Browsertest“, Digest `45ab…21f5`, derzeit nicht abgelaufen, Ablauf 02.10.2026. Die vier Screenshots sind laut Lemming angesehen worden; ich habe das ca. 100-MB-Artefakt für diesen Wegweiser nicht erneut heruntergeladen.
- **Offen:** echte Android-Sichtprüfung mindestens Gold/Legendär; keine Aussage zu Wildcards oder Spielerkarten. Das Paket belegt den Ist-Zustand und eine Regression, nicht ein Effekt-Redesign.

## 2. Lesbarkeit der Spielerkarten — PR #32

- **Branch / Head:** `lemming/optik-p2-01-spielerkarten-lesbarkeit` · `40a1510b656d00d9db9ee325e74134a3092130f1` · 2 Commits vor main.
- **Umfang laut Lemming:** reine Diagnose aller vier Seltenheiten, klein/groß, helles/dunkles Porträt, Animation an/aus. **Keine Produktkorrektur.**
- **Geänderte Dateien, von mir am PR-Diff geprüft:** `pruefberichte/2026-09-18-optik-p2-01-spielerkarten-lesbarkeit.md` und `pruefberichte/bilder/2026-09-18-optik-p2-01-spielerkarten-matrix.webp`.
- **Lemming-Befunde:** P1 bewegtes Material verschlechtert Gold/Legendär-Sekundärtext deutlich; P2 Legendär ist auch still zu kontrastarm, Gold-Eigenschaft knapp; P3 Eigenschaft bleibt auch in großer Karte bei 9,5 px. Diese Punkte sind ausdrücklich **nicht behoben**.
- **Lemming-Evidenz:** Ausgangssichtung auf main-Run `35324596284`; acht Kombinationen in einer Matrix, vier Seltenheiten je Zeile; Matrix und zugrunde liegende Einzelbilder laut Bericht geöffnet.
- **CI von mir nachgeprüft:** Der eigentliche PR-Head besitzt zusätzlich grüne Runs, die im PR-Text nicht genannt werden: [35355423500](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35355423500) „Spielregressionen“ und [35355423584](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35355423584) „Visuelle Browsertests“, beide `success`; Test- und Build-Schritte sind erfolgreich.
- **Bildnachweis:** Die Matrix-WEBP ist direkt im PR committed und bleibt damit unabhängig von CI-Artefaktfristen zugänglich. Zusätzlich existiert das nicht abgelaufene Browserartefakt `10551447977` bis 02.10.2026. Die acht unkomprimierten Ausgangsscreenshots sind nicht als eigene Repository-Dateien dokumentiert.
- **Offen:** P1/P2/P3 sind echte Folgearbeit, keine Abnahme erledigter Produktkorrekturen; kein Android-Test, keine vollständige WCAG-Prüfung, kein kompletter Animationszyklus als Minimum-Kontrastscan.

## 3. Ruhemodus bei Packs — PR #33

- **Branch / Head:** `lemming/optik-p0-01-packs-ruhemodus` · `9e46e696c930ae06b779afd624dff51f2e81c676` · 2 Commits vor main.
- **Umfang laut Lemming:** alle vier Packstufen; normale Bewegung als Gegenprobe, danach Spieloption „Animationen aus“ und System-`prefers-reduced-motion: reduce`; zeitliche Messung von Animation API sowie Transform/Opacity. Kein Verstoß reproduziert, daher kein Produktcode.
- **Geänderte Dateien, von mir am PR-Diff geprüft:** `pruefberichte/2026-09-18-optik-p0-01-packs-ruhemodus.md`, neu `tools/browser/packs-ruhemodus.spec.js`.
- **Lemming-Testangaben:** 140/140 Regressionen; Browser 51 bestanden / 24 planmäßig übersprungen / 0 Fehler; sechs neue Ruhemodus-Prüfungen über 320, 390 und 1280 px.
- **CI von mir nachgeprüft:** [35358255626](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35358255626) und [35358255735](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35358255735) sind am exakten Head `success`; relevante npm-/Browser-Schritte ebenfalls `success`.
- **Bildnachweis:** kein eigener statischer Screenshot-Beleg als Kernnachweis vorgesehen; hier ist der zeitliche Bewegungsnachweis fachlich wichtiger. Generisches Browserartefakt `10554030560`, Digest `7607…1a2`, ist bis 02.10.2026 verfügbar.
- **Offen:** nur Packs; OPTIK-P0-01 insgesamt bleibt offen. Kein Android-Gerätetest.

## 4. Wischhinweis der Charakter-Kategorien — PR #38

- **Branch / Head:** `lemming/char-p1-05-wischhinweis` · `4dbda20b141fee5d06d107afc1f96020901eef24` · 13 Commits vor main.
- **Umfang laut Lemming:** bis 520 px rein informativer Hinweis unter der bestehenden horizontalen Kategorienleiste; Text wechselt anhand echter Scrollposition zwischen Anfang/Mitte/Ende. Keine Porträt-ID-, Auswahl-, Würfel- oder Speicherlogikänderung.
- **Geänderte Dateien, von mir am PR-Diff geprüft:** `App.jsx`, `CHANGELOG.md`, `charakter-ui.css`, `pruefberichte/2026-09-18-char-p1-05-wischhinweis.md`, `tools/browser/charakter-p1-05.spec.js`. Dies ist als einziges der fünf Pakete eine Produktcode-/UI-Änderung.
- **Lemming-Testangaben:** 140/140 Regressionen; Browser 47 bestanden / 25 planmäßig übersprungen / 0 Fehler; App, isolierter Spieltest und Sichtprobe bei 320/390; Auswahl/Festhalten/Würfeln und Startweg geprüft.
- **Prüfmethodik laut Lemming:** Headless-CDP-Touch scrollte den verschachtelten Container nicht zuverlässig; deshalb echter horizontaler Wheel/Trackpad-Browserinput über der Leiste, **kein** direktes Setzen von `scrollLeft`.
- **CI von mir nachgeprüft:** [35371113673](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35371113673) und [35371113734](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35371113734) sind am finalen Head `success`; npm-/Preview-/Playwright-Schritte erfolgreich.
- **Bildnachweis:** Lemming nennt Start-/End-Screenshots aus App, Spieltest und Sichtprobe bei 320/390. Diese sind nicht committed, aber das zugehörige Browserartefakt `10558338406`, Digest `d1e9…227`, ist bis 02.10.2026 verfügbar. Ich habe das Artefakt hier nicht erneut geöffnet.
- **Offen:** physischer Android-Touch-/WebView-Test; Browser-Wheel ist ein echter Browser-Scrollweg, aber kein Ersatz für Fingerwischen auf dem Gerät.

## 5. Wildcard-Aufdeckung auf schmalen Bildschirmen — PR #39

- **Branch / Head:** `lemming/wild-p0-01-aufdeckung-mobil` · `a4ba0aaa43134dc4f0f0b252b245ea4d1ed32cb0` · 1 Commit vor main.
- **Umfang laut Lemming:** alle sieben Wildcard-Seltenheiten bei 320×720 und 390×844, animiert/still, mit jeweils längster aktueller realer Titel-/Beschreibungskombination. Kein Produktfehler reproduziert; kein Produkt- oder Effektcode geändert.
- **Geänderte Dateien, von mir am PR-Diff geprüft:** `CHARAKTER-OPTIK-ARBEITSPLAN.md`, `pruefberichte/2026-09-18-wild-p0-01-aufdeckung.md`, `tools/browser/aufdeckung.spec.js`, `tools/visuelle-vorschau.cjs`.
- **Lemming-Testangaben:** 28 mobile Sichtfälle; Text/Button/Kartenkontur stabil, gemeldeter vertikaler Bühnenversatz 0 px; 28 Screenshots aus dem finalen Artefakt zu vier Kontaktbögen zusammengeführt und angesehen.
- **CI von mir nachgeprüft:** [35375609138](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35375609138) und [35375609207](https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35375609207) sind `success`; Regression, Build, Galerie und Browsertest sind in den Jobs erfolgreich.
- **Bildnachweis:** Browserartefakt `10559728791`, Digest `dd21…a99`, ist bis 02.10.2026 verfügbar. Die darin behaupteten 28 Wildcard-Screenshots habe ich für diesen Dokumentationslauf nicht erneut heruntergeladen. Die nachträglich erzeugten vier Kontaktbögen sind weder als Repository-Datei noch als eigener CI-Artefakt-Eintrag nachweisbar.
- **Offen:** kein Android-Test; Pass-vs.-Enthüllung-Vergleich fehlt; WILD-P0-01 als Gesamtpaket bleibt ausdrücklich offen.

## Überschneidungen und Abhängigkeiten

1. **#31 ↔ #33: gleicher Pack-/Materialbereich, aber keine gemeinsame geänderte Datei.** #31 prüft Kontur, Layer und Spiel-Ruhemodus mit; #33 ergänzt den strengeren zeitlichen Stillstandsnachweis und zusätzlich System-`reduce`. Inhaltlich ergänzend, teilweise überlappend, nicht gegenseitig ersetzend.
2. **#31 ↔ #39: direkte Dateikollision in `CHARAKTER-OPTIK-ARBEITSPLAN.md`.** Beide stammen vom selben Basiscommit und ändern benachbarte CARD-/WILD-Abschnitte. Nach Integration des ersten PRs den zweiten vor Merge neu abgleichen; GitHubs heutiges `mergeable=true` garantiert die Lage nach dem ersten Merge nicht.
3. **#39 → gemeinsame Vorschau-Infrastruktur:** `tools/visuelle-vorschau.cjs` wird verändert. Pack-Ansicht selbst wird dabei nicht geändert, dennoch erzeugen #31/#33 ihre Browserbelege aus derselben Sichtprobe. Wenn #39 zuerst integriert wird und Pack-PRs anschließend aktualisiert werden, betroffene Browser-CI erneut am aktualisierten Head prüfen.
4. **#32 ist Diagnose, keine Produktlösung.** Eine Übernahme dokumentiert die Lesbarkeitsbefunde; sie darf nicht als Behebung von P1/P2/P3 verstanden werden.
5. **#38 ist technisch weitgehend unabhängig.** Keine gemeinsame Datei mit #31/#32/#33/#39; einziges Paket mit Produktcode und daher eigener visueller/taktiler Abnahmepunkt.

## Empfohlene Reihenfolge für Astras Abnahme

1. **#31 Packkontur/Glanz** – schafft den dokumentierten Pack-Grundbefund und den Konturtest.
2. **#33 Pack-Ruhemodus** – direkt anschließend als ergänzender Bewegungs-/Reduced-Motion-Nachweis desselben Subsystems.
3. **#32 Spielerkarten-Lesbarkeit** – Bericht und Matrix abnehmen, dabei klar festhalten, dass P1/P2/P3 offen bleiben.
4. **#39 Wildcard-Aufdeckung** – danach Tracker-Kollision mit #31 bewusst behandeln; WILD-P0-01 nur als Teilprüfung betrachten.
5. **#38 Wischhinweis** – separat als einzige Produktänderung mit eigener mobiler Bedien-/Geräteentscheidung prüfen.

Diese Reihenfolge ist eine Review-Empfehlung, keine Abnahme- oder Merge-Entscheidung.

## Gezielte Restprüfliste für Astra

- [ ] Bei **#31** die vier Packbelege stichprobenartig öffnen; für Gold/Legendär den noch offenen Android-Sichtcheck entscheiden/durchführen.
- [ ] Bei **#33** Testlogik auf echten Stillstand in beiden Ruhewegen prüfen; keine gesonderte Screenshotkampagne nötig.
- [ ] Bei **#32** die committed Matrix ansehen und ausdrücklich zwischen „Bericht akzeptiert“ und „Lesbarkeitsfehler behoben“ unterscheiden; P1/P2/P3 gegebenenfalls als Folgepaket behandeln.
- [ ] Bei **#39** einige der 320-/390-Belege aus dem noch verfügbaren Artefakt öffnen; Pass-vs.-Enthüllung und Android bleiben außerhalb dieses Teilpakets offen.
- [ ] Bei **#38** mobile Darstellung 320/390 ansehen und wegen der Wheel-statt-Touch-Testmethodik möglichst einmal echtes Fingerwischen auf Android prüfen.
- [ ] Vor Integration von **#31/#39** den gemeinsamen Tracker-Diff neu abgleichen; nach jedem Merge verbleibende PRs gegen den neuen main-Stand prüfen.
- [ ] Nur die jeweils tatsächlich geprüften Teilumfänge als abgenommen dokumentieren; grüne CI nicht als Gesamtfreigabe von OPTIK-P0-01, OPTIK-P2-01 oder WILD-P0-01 behandeln.

## Eigene Prüfung dieses Wegweisers

Ich habe keine vollständige Testkampagne erneut ausgeführt. Für diesen Dokumentationsauftrag wurden stattdessen der Live-main-Stand, PR-Status, Branch/Head, Net-Diffs und Dateilisten sowie die GitHub-Actions-Läufe am jeweiligen exakten PR-Head geprüft. Bei den Browserartefakten wurde deren GitHub-Metadatenstatus einschließlich `expired=false` kontrolliert; die großen Artefakte wurden nicht erneut heruntergeladen und die darin enthaltenen Screenshots daher nicht als eigene visuelle Abnahme ausgegeben.
