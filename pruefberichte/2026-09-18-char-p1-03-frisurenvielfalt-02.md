# Prüfbericht – CHAR-P1-03 Frisurenvielfalt, zweite Qualitätsrunde

**Datum:** 18.09.2026  
**Bearbeiter:** ChatGPT  
**Paket:** `CHAR-P1-03`  
**Basis:** `main` @ `545b8929b4866dddb4ee2cd9b3825ff4061f951f`  
**Arbeitsbranch:** `chatgpt/char-p1-03-frisurenvielfalt-02`  
**Pull Request:** #24  
**Sichtgeprüfter Produkt-Head:** `aa74789c4c4bd4a40a4d2fd7b4dd39e488355e24`  
**Spielversion:** `35.193.0`  
**Status:** fachlich und visuell abgenommen; finale Dokumentations-/Versions-Head-CI vor Merge noch als normales Integrationsgate.

## Ausgangsbefund

CHAR-P0-01 ermittelte 26 Männer- und 24 Frauenfrisuren ohne Renderfehler, aber mit drei bei 72–96 px zu nahen Live-IDs:

- Mann 13 **Strukturierter Kurzschnitt** gegenüber 1 **Kurz** / 21 **Kurzer Fade**;
- Frau 9 **Kurzer Ansatz** gegenüber 0 **Kurz** / 7 **Pixie**;
- Frau 13 **Naturvolumen** gegenüber 2 **Voluminös** / 8 **Locken**.

Vor jeder Produktänderung wurden die vorhandenen Vollbögen erneut geöffnet und nach Silhouette, Länge, Textur und Bindungsform kategorisiert. Die dokumentierte Lückenentscheidung entstand vor dem Produktcode und ist Teil des Git-Verlaufs.

## Katalogentscheidung

Keine zusätzlichen ähnlichen Kurzhaarschnitte. Neu aufgenommen wurden nur Formen mit einem bislang fehlenden Hauptmerkmal.

### Männer – append-only IDs 26–30

| ID | Name | Familie | Warum visuell neu / Abgrenzung | Sichtbefund 72 / 96 / 145 px |
|---:|---|---|---|---|
| 26 | Mittellange Locken | mittlere Lockenlänge | Ohr-/Nackenlänge statt kurzer Locken-/Wellenwolke 4/16/19 | bei 72 klar mehr Seiten-/Nackenfall; bei 96/145 Textur und Länge stabil |
| 27 | Lange Locken | lang fallende Locken | lange lockige Kontur statt glatter Schulterform 24 oder Locs 22 | bereits 72 deutlich lang/voluminös; 96/145 ohne Abschneiden, Augen bleiben lesbar |
| 28 | Box Braids | fallende Flechtstruktur | mehrere getrennte Hängepartien plus geflochtener Kopf-/Strangcharakter statt Zöpfe 8, Cornrows 18, Flechtkranz 25 | erste Sichtung war zu glatt; danach Segmentstruktur nachgeschärft; final bei 72 eigenständig, bei 96/145 klarer |
| 29 | Zurückgebundene Locs | gebundene Locs | seitlich/rückwärts gebundene Loc-Silhouette statt offener Locs 22 und Knoten 9 | Bindung bei 72 sichtbar, bei 96/145 klar; keine Schulter-/Halskollision |
| 30 | Asymmetrischer Fringe | asymmetrischer Kurz/Mittelschnitt | langer diagonaler Vorderfall statt symmetrischer Kurz-/Fadefamilie | starke neue Silhouette schon bei 72; 96/145 sauber auf schmal/breit und Kopf 10–13 |

### Frauen – append-only IDs 24–30

| ID | Name | Familie | Warum visuell neu / Abgrenzung | Sichtbefund 72 / 96 / 145 px |
|---:|---|---|---|---|
| 24 | Vollpony | gerader Pony | geschlossene Stirnfranse; bisher keine echte Vollponyfamilie | bei 72 sofort lesbar, bei 96/145 klarer Fransenrand ohne Augenverlust |
| 25 | Curtain Bangs | geteilter Pony | zwei getrennte Gesichtsrahmen statt bloßem Mittelscheitel 18 | 72 bereits andere Stirn-/Seitenform; 96/145 sauberer Spalt und Fall |
| 26 | Asymmetrischer Bob | asymmetrischer Bob | unterschiedliche Seitenlängen statt symmetrischem Bob 3/Pixie 7 | 72 klarer Seitenschwerpunkt; 96/145 ohne Hals-/Schulterproblem |
| 27 | Half-up | halboffen gebunden | Falllänge plus sichtbare obere/rückwärtige Bindung | erste Fassung bei 72 zu nah an Lang offen; Bindung danach vergrößert; final bei 72/96 eindeutig, 145 sauber |
| 28 | Langer Flechtzopf | einzelner langer Zopf | eine seitlich fallende lange Flechtform statt Seitenzopf 5, Doppelzöpfe 11, Kranz 23 | erste Fassung zu glatt; Segmentstruktur nachgeschärft; final bei 72 neue Seitenkontur, 96/145 Flechtverlauf klarer |
| 29 | Lange Wellen | lang fallende Wellen | echte lange S-/Lockenlänge statt kurzer Wellen 14 oder glatter Schulterform 22 | 72 deutlich längere Wellenfamilie; 96/145 keine abgeschnittenen Enden |
| 30 | Twin Buns | zwei Knoten | zwei getrennte Außenknoten statt Einzelknoten 4/Hochgesteckt 12 | stärkste neue Hochsilhouette; bei 72 sofort eindeutig, 96/145 stabil |

## Bestehende Ähnlichkeitskandidaten – Vorher/Nachher

### Mann 13 – Strukturierter Kurzschnitt

Vorher lag die runde Kappe bei 72–96 px zu nah an Kurz 1 und Fade 21. ID 13 behält Name und gespeicherte Bedeutung, nutzt jetzt aber eine stufige/choppy Oberkante und stärker unterbrochene Vorderkontur. In den final geöffneten 72- und 96-px-Direktvergleichen ist 13 ohne Beschriftung klar von 1/21 trennbar.

### Frau 9 – Kurzer Ansatz

Vorher war W9 praktisch eine weitere kompakte Kappe neben Kurz 0 und Pixie 7. Die neue Geometrie ist deutlich diagonal/asymmetrisch und rahmt eine Seite stärker. Der 72-/96-px-Direktvergleich zeigt einen sichtbaren Abstand zu beiden Nachbarn.

### Frau 13 – Naturvolumen

Vorher teilte W13 weitgehend dieselbe runde Volumenwolke mit 2/8. Naturvolumen ist jetzt oben konzentrierter und nach unten schmaler. Voluminös 2 bleibt breiter/länger, Locken 8 kompakter/runder. Der Unterschied bleibt bei 72 und 96 px sichtbar.

## Passung, Köpfe und Farben

Der Charakter-Inventar-Prüfstand verwendet nun sieben Referenzen:

- Kopf 0 Oval mit Kupferhaar;
- Kopf 3 Schmal mit weißem Haar;
- Kopf 6 Breit mit sehr dunklem Haar;
- Kopf 10 Trapez mit blond/hell;
- Kopf 11 Langkantig mit braun/dunkel;
- Kopf 12 Diamant mit silbergrau/hell;
- Kopf 13 Kurzbreit mit braun/dunkel.

Damit wurden sehr dunkle, braune, blonde/helle, kupfer/rote und grau/weiße Haare auf hellen und dunklen Hauttönen im selben reproduzierbaren Bogen geprüft. Keine der neuen Formen ist nur mit schwarzem Haar brauchbar.

### CHAR-FIX-03

Der Haar-Vollbogen wurde auf **868 Kopf/Frisur-Paarungen** erweitert: 14 Köpfe × (31 Männer + 31 Frauen). Der finale Vollbogen wurde geöffnet. Keine ungültige Geometrie, kein neuer sichtbarer grober Überstand und keine neue systematische Passungsregression.

### CHAR-FIX-04

Die vollständige 72-px-Matrix aller 31 Männer- und 31 Frauenfrisuren auf Kopf 10–13 wurde geöffnet. Zusätzlich wurde der kritische 96/145-px-Bogen gesichtet.

Befund:

- keine neuen oberen Hautkeile;
- keine seitlichen Hautspalten der kompakten Formen;
- keine neue „zu kleine Perücke“ auf Trapez/Langkantig/Diamant/Kurzbreit;
- lange Formen werden nicht unplausibel am Hals oder an den Schultern abgeschnitten;
- Vollpony/Curtain/Fringe liegen bewusst in der Stirn, verdecken die Augen aber nicht unbrauchbar;
- Rasiert/Licht bleiben die bekannten absichtlich hautzeigenden Ausnahmen.

## Tatsächlich geöffnete Sichtbögen

Für den sichtgeprüften Produkt-Head wurden nicht nur Screenshots erzeugt, sondern geöffnet und bewertet:

- komplette Männerfrisuren: 72, 96, 145 px;
- komplette Frauenfrisuren: 72, 96, 145 px;
- direkte Altvergleiche M 1/13/21 bei 72 und 96 px;
- direkte Altvergleiche W 0/7/9 bei 72 und 96 px;
- direkte Altvergleiche W 2/8/13 bei 72 und 96 px;
- alle 12 neuen Frisuren bei 72 px gegen ihre engsten bestehenden Nachbarn;
- CHAR-FIX-03 Haar-Vollmatrix;
- CHAR-FIX-04 alle Frisuren × Kopf 10–13 bei 72 px;
- CHAR-FIX-04 kritische Kurz-/Kompaktformen bei 96 und 145 px.

## Sichtkorrektur während der Abnahme

Der erste grüne Gesamtbogen auf Head `3725ae31…` wurde nicht einfach akzeptiert. Die echte Sichtprüfung fand drei qualitative Schwächen:

1. M28 Box Braids: bei 72 px noch zu glatt;
2. W27 Half-up: obere Bindung zu schwach, zu nah an Lang offen;
3. W28 Langer Flechtzopf: eigene Silhouette vorhanden, Flechtcharakter aber zu schwach.

Commit `aa74789c…` verstärkte deshalb Flechtsegmentierung und Half-up-Bindung. Erst der danach neu erzeugte Browserbogen wurde als Produktabnahme verwendet.

## Automatische Prüfung des sichtgeprüften Produkt-Heads

### Spielregressionen / Build

GitHub Actions **Spielregressionen**, Run **35315705473**:

- `npm test`: **140/140 bestanden**;
- `npm run build`: erfolgreich;
- Fehler: 0.

### Browser

GitHub Actions **Visuelle Browsertests**, Run **35315705414**:

- **42 bestanden**;
- **21 projekt-/viewportbedingt übersprungen**;
- **0 fehlgeschlagen**;
- CHAR-P1-03 Direktvergleichstest: erfolgreich;
- CHAR-P0-01 Gesamtbögen: erfolgreich;
- CHAR-FIX-03: erfolgreich;
- CHAR-FIX-04: erfolgreich;
- Porträt-Identitätskette: erfolgreich;
- Artefakt `Rasenschach-Browsertest`: ID **10535950715**;
- Digest: `sha256:171132150dcb8d87268a4b9c03cd5aa1ae187086e89d651c33f72a78383f42df`.

### Safe-Patch-Brücke

Die zwei kleinen Namensstellen in der großen `App.jsx` wurden über die dokumentierte sichere Patch-Brücke geändert. Run **35314484312** bestand Patchprüfung, `npm test` und `npm run build`, bevor der Bot-Commit erzeugt wurde.

## Zwischenzeitlicher roter Browserlauf

Run **35314563601** war rot, nachdem der Katalog bereits von 700 auf 868 CHAR-FIX-03-Haarpaarungen gewachsen war.

Ursachen waren Prüfstand-/Galerie-Sollwerte, nicht Produktgeometrie:

- `tools/browser/char-fix-03.spec.js` erwartete noch exakt 700 statt 868 Haar-Elemente;
- `tools/visuelle-vorschau.cjs` hatte die neue geschlechtsspezifische Frisurnamenslogik noch nicht übernommen, wodurch der alte Galeriepfad keine Porträts lieferte.

Die fachlichen Anforderungen wurden nicht abgeschwächt. Commit `3725ae31…` zog die Prüfstände auf den real erweiterten Katalog nach; danach waren Regression und Browser vollständig grün.

## Kompatibilität

- keine bestehende Männer- oder Frauenfrisur-ID gelöscht;
- keine bestehende ID umnummeriert;
- historische Freischaltungs-/Seed-Struktur nicht „aufgeräumt“;
- neue IDs ausschließlich hinten angehängt;
- M13/W9/W13 behalten ihre gespeicherten IDs und sichtbaren Namen;
- Porträt-Identitätsregression Karriere → Ruhmeshalle → Karte → Vereinskader bleibt grün;
- keine Änderung an Karriere-/Wirtschafts-/Kartenmechanik.

## Verbleibende Frisurenlücken

Nach dieser Runde besteht kein dringender Katalogdefekt mehr. Für spätere optionale Vielfalt bleiben denkbar:

- Männer: eine sehr lange einzelne Flecht-/Pferdeschwanzform oder weitere kulturell klar andere Langhaarbindung;
- Frauen: sehr lange enge Ringellocken beziehungsweise eine noch deutlichere Sidecut-Familie;
- unisex: einzelne experimentellere Sport-/Protective-Styles nur dann, wenn sie bei 72 px wieder echten neuen Raum schaffen.

Diese Punkte rechtfertigen **keine** weitere Menge um der Menge willen.

## Ergebnis und Empfehlung

CHAR-P1-03 erfüllt die Qualitätsanforderung: Der Katalog wächst nicht nur von 26/24 auf **31/31**, sondern gewinnt neue Pony-, Bindungs-, Flecht-, Lockenlängen- und asymmetrische Familien. Die drei belegten Alt-Ähnlichkeitskandidaten sind sichtbar auseinandergezogen. 72/96 px waren bei der Auswahl entscheidend; schwache erste Fassungen wurden nach der Sichtung nachgebessert.

**Empfohlener nächster Charakter-Schwerpunkt:** formtragende Gesichtszüge aus CHAR-P1-02/CHAR-P0-01 – insbesondere Wangen/Kinn und Mund – statt weiterer Frisurenmenge.
