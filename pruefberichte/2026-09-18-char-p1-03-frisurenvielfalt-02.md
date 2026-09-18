# Prüfbericht – CHAR-P1-03 Frisurenvielfalt, zweite Qualitätsrunde

**Datum:** 18.09.2026  
**Bearbeiter:** ChatGPT  
**Paket:** `CHAR-P1-03`  
**Basis:** `main` @ `545b8929b4866dddb4ee2cd9b3825ff4061f951f`  
**Arbeitsbranch:** `chatgpt/char-p1-03-frisurenvielfalt-02`  
**Status:** Planung und Vorab-Sichtung abgeschlossen; Produktänderung folgt erst nach dieser Bestandsentscheidung.

## Ausgangsbefund

Die vollständige CHAR-P0-01-Sichtprüfung wird als verbindliche Basis verwendet. Der aktuelle Live-Katalog enthält 26 Männer- und 24 Frauenfrisuren. Es bestehen keine bestätigten Renderdefekte, aber drei konkrete Ähnlichkeitskandidaten:

- Mann ID 13 **Strukturierter Kurzschnitt** gegenüber ID 1 **Kurz** und ID 21 **Kurzer Fade**;
- Frau ID 9 **Kurzer Ansatz** gegenüber ID 0 **Kurz** und ID 7 **Pixie**;
- Frau ID 13 **Naturvolumen** gegenüber ID 2 **Voluminös** und ID 8 **Locken**.

Die IDs bleiben bestehen. Geändert werden darf nur ihre Geometrie innerhalb derselben gespeicherten Identität.

## Vorab-Sichtung und Frisurenfamilien

Die aktuellen 72-px- und Vollbögen des letzten grünen `main`-Browserartefakts wurden vor der Produktänderung tatsächlich geöffnet. Der Befund aus CHAR-P0-01 ist reproduzierbar: M13 liegt in Silhouette und Höhe dicht am Kurz-/Fade-Cluster, W9 ist als kompakte Kappe kaum von Kurz/Pixie getrennt, W13 liegt in derselben runden Volumen-/Lockenwolke wie W2/W8.

### Männer

Bestehende Familien:

- kahl/minimal: rasiert, Halbglatze, Glatze;
- kurz/kompakt: Kurz, Seitenscheitel, Undercut, Igel/Textur, Slick, Crop, Flachschnitt, seitlicher Ansatz, Fade;
- Locken/Textur: Locken, Afro, weiche Wellen, Naturkrause, Locken mit Seitenscheitel;
- Flecht-/Hochformen: Zöpfe, Knoten, geflochtener Ansatz/Cornrows, Flechtkranz;
- lang/fallend: Vokuhila, Mittelscheitel mit Fall, lange Locs, schulterlang glatt;
- extreme Silhouette: Irokesenschnitt.

**Fehlender visueller Raum:** echte mittlere und lange Lockenlängen, herabhängende Flechtstruktur, zurückgebundene Locs/Zopfstruktur und stark asymmetrischer Pony.

### Frauen

Bestehende Familien:

- kurz/kompakt: Kurz, Bob, Pixie, Kurzer Ansatz, Fade, Irokesenschnitt;
- lang/fallend: Lang offen, Lang mit Scheitel, Seitenzopf, lange Locs, schulterlang glatt;
- hoch/gebunden: Knoten, Pferdeschwanz, zwei geflochtene Zöpfe, Hochgesteckt, Flechtkranz;
- Locken/Volumen: Voluminös, Locken, Naturvolumen, weiche Wellen, Naturkrause, Locken mit Seitenscheitel;
- Flechtansatz: geflochtener Ansatz/Cornrows.

**Fehlender visueller Raum:** gerader Vollpony, Curtain Bangs, asymmetrischer Bob, Half-up, ein einzelner langer Flechtzopf, wirklich lange fallende Wellen/Locken und zwei getrennte Knoten.

## Festgelegte Kandidaten vor Produktcode

Nur Varianten mit einer klar neuen Hauptdimension werden umgesetzt. Geplante append-only IDs:

### Männer

| neue ID | Name | Familie | neuer visueller Raum / bewusste Abgrenzung |
|---:|---|---|---|
| 26 | Mittellange Locken | Locken · mittlere Länge | Ohr-/Nackenlänge statt kurzer Lockenwolke; Abstand zu 4/16/19 und zu glattem 24 |
| 27 | Lange Locken | Locken · lang fallend | lange fallende Ringel-/Wellenkontur statt glatter Schulterform 24 oder Locs 22 |
| 28 | Box Braids | Flechtstruktur · fallend | klar herabhängende segmentierte Flechtsträhnen statt reinem Kopfansatz 18 |
| 29 | Zurückgebundene Locs | Locs · gebunden | Loc-Textur mit gebundener Rückensilhouette statt offenen Locs 22 und einfachem Knoten 9 |
| 30 | Asymmetrischer Fringe | kurz/mittel · asymmetrisch | deutlich diagonaler langer Vorderbereich statt weiterer symmetrischer Kurz-/Fadeform |

### Frauen

| neue ID | Name | Familie | neuer visueller Raum / bewusste Abgrenzung |
|---:|---|---|---|
| 24 | Vollpony | Pony · gerade | klare geschlossene Stirnfranse; im aktuellen Katalog nicht vorhanden |
| 25 | Curtain Bangs | Pony · geteilt | zweigeteilte Gesichtsrahmung statt bloßem Mittelscheitel/Fall 18 |
| 26 | Asymmetrischer Bob | Bob · asymmetrisch | ungleiche Seitenlänge/Seitenschwerpunkt statt symmetrischem Bob 3/Pixie 7 |
| 27 | Half-up | lang · halb gebunden | lange Falllänge plus sichtbare obere Bindung statt offen oder vollständig hoch |
| 28 | Langer Flechtzopf | Flechtstruktur · einzeln lang | ein klarer langer Rücken-/Seitenzopf statt zwei Zöpfen 11 oder Flechtkranz 23 |
| 29 | Lange Wellen | Wellen · lang fallend | tatsächliche lange S-Wellen statt kurzer Wellenform 14 oder glatter Schulterform 22 |
| 30 | Twin Buns | hoch · zwei Knoten | zwei getrennte Seitenknoten statt Einzelknoten 4/Hochgesteckt 12 |

Diese Menge ist kein Muss. Ein Kandidat wird nach der 72/96-px-Sichtprüfung verworfen oder weiter differenziert, wenn er keinen eigenständigen Raum behauptet.

## Bestehende IDs – Ziel der Differenzierung

- **M13** bleibt „Strukturierter Kurzschnitt“, erhält aber eine klar stufige/choppy Vorderkante und Texturverteilung statt derselben runden Kurzhaarkappe.
- **W9** bleibt „Kurzer Ansatz“, erhält eine bewusst asymmetrischere, diagonal fallende Kurzsilhouette statt der bisherigen generischen Crop-Kappe.
- **W13** bleibt „Naturvolumen“, wird aus der praktisch gleichen runden Afro-/Volumenwolke in eine oben konzentrierte, nach unten schmaler werdende Naturvolumen-Silhouette überführt.

## Verbindliche Abnahme für die folgende Umsetzung

- bestehende IDs bleiben vollständig erhalten und nummernstabil;
- neue IDs nur hinten anhängen;
- 72 / 96 / 145 px;
- Köpfe 3 / 6 / 10 / 11 / 12 / 13 plus ovale Referenz;
- sehr dunkles, braunes, blondes/helles, kupfer/rotes und grau/weißes Haar auf hellen und dunklen Hauttönen;
- direkte Nachbarschaftsvergleiche der drei Alt-Kandidaten und jeder neuen Variante;
- CHAR-FIX-03 und CHAR-FIX-04 dürfen nicht regressieren;
- Screenshots werden geöffnet und visuell bewertet; ein grüner Test allein ist keine Abnahme.

Die Umsetzung beginnt erst auf Basis dieser dokumentierten Entscheidung.
