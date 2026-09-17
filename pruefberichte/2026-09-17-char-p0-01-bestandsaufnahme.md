# CHAR-P0-01 – Bestandsaufnahme Charaktererstellung

Datum: 17.09.2026  
Arbeitsart: technische Inventarisierung + Vorbereitung der systematischen Sichtprüfung  
Basis bei Beginn: `f0087ebfac38c15590d5dcd60659d81a8b51ca08` (`main`)  
Paket: `CHAR-P0-01`

## Ziel dieser Runde

Vor weiteren neuen Gesichtern, Frisuren oder Bärten wird der tatsächlich aktuelle Editor inventarisiert. Zahlen stammen aus dem Live-Code dieser Basis, nicht aus älteren Berichten. Diese Runde soll außerdem die nächste Sichtprüfung reproduzierbar machen: ein eigener Charakter-Inventar-Prüfstand zeigt gespeicherte IDs, Freischaltungszustände und jede Variante in mehreren Referenzgesichtern.

**Wichtig:** Diese Bestandsaufnahme trennt technische Vollständigkeit von ästhetischer Bewertung. Aus Quellcode und Struktur lässt sich belegen, dass eine Variante existiert und anders gezeichnet wird; ob zwei Varianten bei 72–145 px *zu ähnlich* wirken, muss sichtbar beurteilt werden. Das wird nicht aus dem Code erfunden.

## Aktueller Editor – objektive Live-Zählung

`CreateScreen` bietet für Mann und Frau jeweils 14 sichtbare Merkmalsgruppen. Bart ist nur bei Männern wählbar, Make-up nur bei Frauen. Intern bleibt beim jeweils anderen Geschlecht der neutrale Wert `0` erhalten.

| Merkmal | Mann Basis | Mann mit Freischaltung | Frau Basis | Frau mit Freischaltung | gespeicherte IDs / Hinweis |
|---|---:|---:|---:|---:|---|
| Kopfform | 10 | 10 | 10 | 10 | 0–9 |
| Hautton | 14 | 14 | 14 | 14 | Editorpalette 0–13; historische Zufallsableitung nutzt bewusst die alte Grundpalette |
| Haarfarbe | 13 | 13 | 13 | 13 | Editorpalette 0–12; historische Zufallsableitung nutzt bewusst die alte Grundpalette |
| Frisur | 18 | 22 | 16 | 20 | Mann Basis: 0–11 + 16–21; frei: 0–21. Frau Basis: 0–9 + 14–19; frei: 0–19 |
| Bartwuchs | 16 | 16 | — | — | Mann 0–15; Frau intern fest 0 |
| Augenform | 7 | 7 | 7 | 7 | 0–6 |
| Augenfarbe | 7 | 7 | 7 | 7 | 0–6 |
| Augenbrauen | 7 | 7 | 7 | 7 | 0–6 |
| Nase | 10 | 10 | 10 | 10 | 0–9 |
| Mund | 9 | 9 | 9 | 9 | 0–8 |
| Ohren | 5 | 5 | 5 | 5 | 0–4 |
| Wangen und Kinn | 5 | 5 | 5 | 5 | 0–4 |
| Schmuck | 2 | 8 | 2 | 8 | Basis 0–1, Freischaltung 0–7 |
| Besondere Merkmale | 7 | 7 | 7 | 7 | 0–6 |
| Make-up | — | — | 7 | 7 | Frau 0–6; Mann intern fest 0 |

### Warum die Frisur-IDs Lücken haben

Die Lücken sind **kein Aufräumfehler**. Alte Bonusfrisuren behalten ihre historischen IDs und Freischaltungsregel. Später hinzugefügte Formen wurden append-only an höhere IDs gehängt und sind unabhängig davon verfügbar. Deshalb sind ohne `mk_haar` bei Männern die IDs 12–15 und bei Frauen 10–13 nicht wählbar, während die späteren IDs 16–21 bzw. 14–19 bereits vorhanden sind.

Diese Struktur darf nicht durch „schöne fortlaufende Nummern“ ersetzt werden. Ein Neuordnen würde gespeicherte Gesichter umdeuten.

## Renderer und Identität – technischer Befund

### Kopfformen

Es existieren zehn gespeicherte Kopfformen. Die ersten fünf historischen Formen bleiben an ihren Indizes. Weitere Formen wurden angehängt. Die Geometrie arbeitet mit Wangenbreite (`b`), Kieferbreite (`j`), Kinnhöhe (`kinn`) und bei zarter zulaufenden Formen zusätzlich `kv`. Haare und Bärte beziehen diese Geometrie mit ein, statt eine unabhängige Standardellipse anzunehmen.

**Befund:** technisch gut als gemeinsame Geometriebasis vorbereitet. Ob alle zehn Formen bei kleiner Darstellung ausreichend weit auseinanderliegen, bleibt Sichtprüfung und ist Kern von `CHAR-P1-01`.

### Frisuren

Neue Porträts verwenden `haarformen.jsx`. Der Renderer trennt Vorder- und Hinterebene, benutzt die reale Kopfbreite und hat eigene Geometrie/Textur für die aktuellen gespeicherten IDs. Die sechs später ergänzten Frisurnamen werden append-only in `portraet.js` geführt.

**Befund:** keine aktuelle Option ist allein wegen fehlender Namenszuordnung unsichtbar. Die historische Freischaltungsstruktur ist absichtlich nicht linear. Eine perceptuelle Dublettenprüfung fehlte bisher.

### Bärte

`bartformen.jsx` koppelt Wangen-/Kinnkontur an die echte Kopfform. Vorhanden sind 16 Männer-IDs einschließlich Stoppeln, Schnurrbartvarianten, Vollbärten, Kinn-/Ankerformen und Kombinationen.

**Befund:** technisch klarer als eine unabhängige Bartmaske; kleine Unterschiede zwischen verwandten Vollbart-/Schnurrbartformen müssen sichtbar verglichen werden.

### Gesichtszüge

Die neueren Erweiterungs-IDs sind nicht nur benannt, sondern haben aktuelle Renderlogik: Augen/Brauen, Nasen 8/9, Münder 7/8, Wangen 3/4 sowie die zusätzlichen Details/Accessoires/Make-up-Varianten besitzen eigene Zeichenpfade oder Parameter.

**Befund:** kein offensichtlicher „Option vorhanden, Renderer fehlt“-Fall aus der statischen Prüfung. Besonders Augen, Brauen, Ohren und Wangen arbeiten aber mit kleinen geometrischen Änderungen; hier ist eine 72–96-px-Sichtprüfung wichtiger als die bloße Existenz unterschiedlicher SVG-Befehle.

### Farben

Der Editor stellt 14 Haut- und 13 Haarfarben bereit. Die alte deterministische Ableitung aus einer Spielerkennung benutzt bewusst die historischen Grundpaletten, damit bestehende Zufalls-/Altdatenlogik nicht nachträglich umgedeutet wird. Der Editor und das freie Würfeln in der Charaktererstellung können die erweiterten Paletten nutzen.

Der Avatar besitzt zusätzlich einen Kontrastschutz für den Hintergrund gegenüber dem dunkelsten Haar. Das schützt die Silhouette, ersetzt aber keine Prüfung aller Gesichtsdetails auf allen Hauttönen.

## Bedienlogik der Charaktererstellung

- Neue Erstellung startet mit modernem Porträtstil `stil:2`.
- „Würfeln“ verwendet die realen Editoroptionen und verändert nur nicht festgehaltene Merkmale.
- Einzelne Merkmale lassen sich festhalten; bestehende Browserregression prüft dies am Bart.
- Jede sichtbare Variante wird als eigener Button mit Anzeigenamen und `aria-pressed` geführt.
- Haut-/Haar-/Augenfarbe und geometrische Merkmale verwenden dieselbe gespeicherte `zuege`-Struktur.
- Geschlechtswechsel begrenzt nur nicht verfügbare Merkmale; manuell gewählte Haut-/Haarfarben werden nicht wieder an eine Herkunftspalette gezwungen.

### Technischer Restpunkt

`zugDrehen(...)` ist im aktuellen Quellstand nur noch als Definition auffindbar; die moderne Feineinstellung arbeitet über direkte Optionswahl und `portraetWuerfeln`. Das ist kein belegter Spielerfehler, aber ein Kandidat für spätere Totcode-Bereinigung. Nicht nebenbei entfernen, solange kein eigener Prüfauftrag dafür besteht.

## Bisherige Prüfdeckung vor dieser Runde

`tools/portraet.test.cjs` schützt bereits:

- append-only Optionen und gesperrte Altformen,
- festgehaltene Merkmale beim Würfeln und JSON-Roundtrip,
- Erreichbarkeit der neuen Varianten,
- Frisurfreischaltungen und stabile Kennungen,
- Accessoire-Freischaltung sowie vorhandene Anzeigenamen.

`tools/browser/charakter.spec.js` prüfte bereits:

- schmale/typische/große Browserprojekte über Playwright,
- kompakte Charaktererstellung und sichtbaren Startknopf,
- Würfeln + Festhalten,
- einen vollständigen Startweg,
- sämtliche Merkmalsgruppen in der isolierten Galerie für beide Geschlechter,
- Accessoires mit und ohne Freischaltung,
- Browserfehler/`undefined`-Ausgaben.

Was bisher fehlte: eine leicht zugängliche Gesamtzählung mit gespeicherten IDs, eine Mehrkontextansicht je Variante und ein automatischer Wächter gegen **exakt identische** Renderausgaben innerhalb einer Merkmalsgruppe.

## Neu vorbereitet: Charakter-Inventar

Neue Datei: `tools/charakter-inventar.cjs`

Sie erzeugt `.preview/charakter-inventar.html` aus den **echten** Komponenten und Optionen des aktuellen `App.jsx`/Porträtcodes. Der Prüfstand:

1. zählt alle sichtbaren Merkmalsgruppen live für Mann/Frau und Basis/Freischaltung;
2. zeigt die tatsächlichen gespeicherten IDs statt künstlich neu zu nummerieren;
3. zeigt jede Variante gleichzeitig in drei Referenzgesichtern mit unterschiedlichen Kopf-/Haut-/Haargrundlagen;
4. verwendet den echten `Avatar`-Renderer;
5. schreibt keinen produktiven Spielstand;
6. ist über `.preview/bildschirm.html` direkt als Ansicht auswählbar.

Der Browserlauf erhält zusätzlich eine `charakter-inventar.json`-Anlage mit den gezählten Optionen und einen Screenshot der Frisurenansicht.

## Neuer Dubletten-Wächter

Der neue Desktop-Browsercheck normalisiert die internen SVG-IDs und vergleicht pro Merkmalsgruppe die Renderstruktur der drei Referenzgesichter. Zwei gespeicherte Varianten, die in allen drei Fällen exakt dasselbe Avatar-SVG erzeugen, lassen den Test scheitern.

Das ist bewusst nur ein **exakter Dubletten-Wächter**. Er darf nicht behaupten, zwei nur sehr ähnliche Varianten seien ausreichend verschieden. Dafür bleibt die menschliche Sichtprüfung mit den Vergleichsbögen/Inventaransichten erforderlich.

## Matrix für die folgende Sichtprüfung

| Gruppe | technischer Stand | Sichtpriorität | worauf konkret achten |
|---|---|---|---|
| Kopfformen | vollständig inventarisiert | hoch | Rund/Oval/Weich sowie Zart/Schmal bei 72–96 px auseinanderhalten |
| Hauttöne | vollständig inventarisiert | mittel | Details/Nase/Mund auf sehr hell bis sehr dunkel sichtbar |
| Haarfarben | vollständig inventarisiert | mittel | dunkle Haare vor Hintergrund; Grau/Weiß/Blond nicht auswaschen |
| Frisuren | vollständig inventarisiert | sehr hoch | echte Silhouette, Scheitel/Volumen/Textur, keine Hautspalten, Basis vs. Bonus |
| Bärte | vollständig inventarisiert | hoch | Vollbartfamilie, Schnurrbartkombinationen, Kieferübergang |
| Augenform | vollständig inventarisiert | sehr hoch | Unterschiede bei kleiner Darstellung erkennbar |
| Augenfarbe | vollständig inventarisiert | mittel | Iris bleibt sichtbar, aber nicht überzeichnet |
| Augenbrauen | vollständig inventarisiert | sehr hoch | neue Bögen/Breiten nicht nur beschriftet unterschiedlich |
| Nase | vollständig inventarisiert | hoch | Breite/Länge/Spitze in Frontansicht erkennbar |
| Mund | vollständig inventarisiert | hoch | entspannt/lächelnd/offen/voll klar genug getrennt |
| Ohren | vollständig inventarisiert | hoch | Varianten nicht nur numerisch verschieden |
| Wangen/Kinn | vollständig inventarisiert | sehr hoch | dezente Konturen/Grübchen bei 72–96 px noch sichtbar |
| Schmuck | vollständig inventarisiert | mittel | Brillen/Stirnbänder/Creolen/Kette nicht mit Haaren kollidieren |
| Details | vollständig inventarisiert | hoch | Sommersprossen/Narben/Fleck/Fältchen auf allen Hauttönen |
| Make-up | vollständig inventarisiert | hoch | Varianten sichtbar, aber Gesicht nicht übermalen |

## Abnahmestand von CHAR-P0-01

**Technische Inventarisierung: abgeschlossen.**  
**Prüfwerkzeug für reproduzierbare Sichtprüfung: vorbereitet.**  
**Automatischer exakter Dublettencheck: vorbereitet.**  
**Perzeptive Einstufung `stark / brauchbar / ähnlich / Fehler`: noch offen**, bis der neue Inventarlauf tatsächlich gerendert und die Gruppen sichtbar beurteilt wurden.  
**Android-Sichtprüfung: offen.**

Das Paket bleibt deshalb im Meta-Tracker noch offen. Die nächste Runde muss nicht erneut zählen oder den Prüfweg bauen; sie kann direkt den erzeugten Inventar-/Screenshotstand durchgehen und die Matrix mit konkreten IDs befüllen.

## Nächster sinnvoller Schritt

1. Browser-CI des neuen Inventars am exakten Commit prüfen.
2. Exakte Dubletten aus dem neuen Wächter zuerst beheben, falls vorhanden.
3. Danach die sichtbare Matrix Gruppe für Gruppe ausfüllen; bei `ähnlich` immer die konkreten IDs nennen.
4. Aus diesen Befunden `CHAR-P1-01` bis `CHAR-P1-04` gezielt schneiden, statt pauschal neue Varianten hinzuzufügen.
5. Abschließend Android-Sicht-/Touchprüfung nachziehen.
