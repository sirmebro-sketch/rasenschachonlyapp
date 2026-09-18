# CHAR-P1-02 – Gesichtszüge, Qualitätsrunde 2

**Datum:** 18.09.2026  
**Bearbeiter:** ChatGPT/Codex  
**Basis:** `main` `f431f74c6e4810ac2e65a1fc0253777eaf03d09b` / 35.193.0  
**Arbeitsbranch:** `chatgpt/char-p1-02-gesichtszuege-02`  
**Pull Request:** #25

## Anlass und Entscheidung

Nach Abschluss von CHAR-P1-03 wurde der aktuelle Charakter-Optik-Arbeitsplan zusammen mit dem Prüfbericht der Frisurenrunde und dem Live-Stand von `main` neu bewertet. Der Frisurenbericht empfiehlt als nächsten Qualitätsgewinn ausdrücklich stärker formprägende Gesichtszüge statt weiterer Frisurenmenge. CHAR-P1-02 war zudem noch in Sichtprüfung.

Die zweite Runde konzentriert sich deshalb auf Mund sowie Wangen/Kinn. Bestehende IDs werden nicht ersetzt oder umgedeutet.

## Produktionsänderungen

Append-only ergänzt:

- Mund **9 – Herzförmig**
- Mund **10 – Kompakt**
- Mund **11 – Breites Grinsen**
- Wangen/Kinn **7 – Markante Kieferkante**
- Wangen/Kinn **8 – Spitze Kinnkontur**

Die historische Seed-Ableitung in `ZUEGE_ANZAHL` bleibt bei `mund: 7` und `wangen: 3`. Neue Varianten werden nur über `portraetOptionen(...)` für Charaktereditor und Würfeln angeboten. Alte Seed→Porträt-Zuordnungen ändern sich damit nicht.

`App.jsx` wurde ausschließlich über die Safe-Patch-Brücke geändert. Die erste Produktionsgeometrie ergänzte fünf Zeilen im Avatar-Renderer.

## Prüfstand

Der bestehende CHAR-P1-02-Prüfstand wurde erweitert:

- aktive Mundvarianten: IDs 0–11;
- aktive Wangen/Kinn-Varianten: 0,1,2,3,5,6,7,8;
- unbeschriftete Gesamtprobe von sieben auf zehn Gesichter erweitert;
- separater Überlagerungscheck bei 96 px: ohne Bart/Brille, mit Vollbart sowie Ankerbart + Brille;
- Browserregression schützt Kataloggröße und Sichtbarkeit der neuen IDs;
- Rastermetrik läuft weiter für Mann/Frau, drei Hauttöne und 72/96 px.

## Erster PR-Lauf und gefundener Qualitätsmangel

Produkt-Head vor Korrektur: `c1a191326008663b95d6f654602fd3c3a2327172`.

- Spielregressionen Run `35319188302`: **140/140 bestanden**, 0 Fehler.
- Produktionsbuild: erfolgreich.
- Visuelle Browsertests Run `35319188356`: **42 bestanden, 23 übersprungen, 1 fehlgeschlagen**.
- Browser-Artefakt: `10536646955`, Digest `sha256:23aaeece9180819b24e821c7caf069e6a29db8293a3addd74e948b5ef3a29aea`.

Der Fehlschlag war fachlich berechtigt: Wangen/Kinn-ID 8 war bei 72 px für Mann und Frau auf allen drei geprüften Hauttönen rasterseitig praktisch identisch zu ID 0. Die Screenshots des Artefakts wurden tatsächlich geöffnet und bestätigten den Befund.

Daraufhin wurde ausschließlich ID 8 nachgeschärft: längere V-förmige Kinnkontur, etwas stärkere Strichbreite und höhere Deckkraft. Die Safe-Patch-Brücke übernahm die Korrektur als `64837f746df03c6720416a9da392c07090b9ef86`.

**Korrigierter Produkt-Head für die zweite PR-Abnahme:** `64837f746df03c6720416a9da392c07090b9ef86`. Der folgende Dokumentationscommit ändert keinen Produktcode und dient zugleich dazu, die vollständigen PR-Gates auf dem korrigierten Stand regulär neu auszulösen.

## Sichtprüfung des ersten Artefakts

Tatsächlich geöffnet wurden unter anderem:

- Mann / hell / 72 px / Münder
- Mann / hell / 72 px / Wangen/Kinn
- Frau / dunkel / 96 px / Münder
- Mund/Kinn-Überlagerungscheck / 96 px

Befund:

- Die neuen Mundformen sind bereits bei 72 px erkennbar verschieden.
- Auf dunkler Haut bei 96 px bleiben Lippenform und Mundbreite lesbar.
- Vollbart sowie Ankerbart + Brille erzeugen in der Überlagerungsprobe keine offensichtliche Kollision mit den neuen Mundformen.
- Wangen/Kinn-ID 7 ist als Kieferkontur erkennbar.
- Wangen/Kinn-ID 8 war in der ersten Fassung zu schwach und wurde deshalb **nicht** abgenommen, sondern korrigiert.

## Noch ausstehend vor Integration

- vollständiger PR-Lauf auf dem korrigierten Stand;
- erneutes Öffnen der neuen 72/96-px-Screenshots, insbesondere ID 8;
- Versions-/CHANGELOG-Aktualisierung erst nach erfolgreicher Sichtabnahme;
- Merge erst, wenn der Branch nicht hinter `main` liegt;
- danach Regression, Browsertests und Android-Build auf dem neuen `main` prüfen.

Ein physischer Android-Gerätetest wurde nicht durchgeführt und wird nicht behauptet.
