# Prüfbericht – CHAR-P0-01 vollständige visuelle Bestandsaufnahme

**Datum:** 18.09.2026  
**Bearbeiter:** ChatGPT  
**Paket:** `CHAR-P0-01`  
**Basis:** `main` @ `ff9e59d8aa9d4ebd775ac012c683c1d5d150de7e`  
**Arbeitsbranch:** `chatgpt/char-p0-01-visuelle-bestandsaufnahme`  
**Pull Request:** #23  
**Spielversion:** `35.192.0` unverändert

## Ziel und Abgrenzung

CHAR-P0-01 schließt die bislang fehlende tatsächliche Sichtbewertung des aktuellen Live-Katalogs ab. Es geht ausdrücklich nicht um möglichst viele neue Varianten, sondern um die Frage, welche angebotenen Optionen bei echter Spielgröße wirklich eigenständig aussehen, welche nur brauchbar beziehungsweise zu ähnlich sind und ob nach CHAR-FIX-04 noch konkrete Renderdefekte bestehen.

Produktcode wurde in diesem Paket **nicht verändert**. Der vorhandene Prüfstand wurde nur so erweitert, dass dieselben Live-Optionen bei 72, 96 und 145 px gleichzeitig gegen mehrere Kopf-, Haut- und Haarreferenzen geprüft werden können.

Historische, weiterhin renderbare, aber **nicht mehr neu angebotene** schwache IDs sind nicht in die Live-Matrix eingerechnet. Das betrifft insbesondere Nase 4 `Gerade`, Nase 7 `Fein` und Wange 4 `Wangengrübchen`; ihre gespeicherten Bedeutungen bleiben unverändert erhalten.

## Verwendeter Prüfstand

Weiterverwendet wurden:

- `tools/charakter-inventar.cjs`
- `tools/portraet-bogen.cjs`
- `tools/visuelle-vorschau.cjs`
- die vorhandenen Kopf-, Gesichts-, Frisur-, Bart- und Passungsprüfungen unter `tools/browser/`

Gezielte Erweiterung nur für die Bestandsaufnahme:

- Größenumschaltung 72 / 96 / 145 px im Charakter-Inventar;
- sechs Referenzkontexte je Variante statt bisher drei:
  - Kopf 3 Schmal, helle Haut, dunkles Haar;
  - Kopf 6 Breit, sehr dunkle Haut, helles Haar;
  - Kopf 10 Trapez;
  - Kopf 11 Langkantig;
  - Kopf 12 Diamant;
  - Kopf 13 Kurzbreit;
- dabei bewusst helle/dunkle Haut und helle/dunkle Haarfarbe gemischt;
- neuer Browserlauf erzeugt für **jede** Live-Merkmalsgruppe und beide Geschlechter Sichtbögen bei 72, 96 und 145 px.

Der grüne Browserlauf erzeugte 84 CHAR-P0-01-Sichtbögen. Diese Bögen sowie die bereits vorhandenen spezialisierten Kopf-/Frisur-/Bart-/Gesichtsbögen wurden tatsächlich geöffnet und visuell beurteilt. Ein grüner Test oder ein erzeugter Screenshot wurde nicht als Sichtprüfung gewertet.

## Aktuelles Live-Inventar

| Merkmalsgruppe | Live-Varianten |
|---|---:|
| Kopfform | 14 |
| Hautton | 14 |
| Haarfarbe | 13 |
| Frisur Mann | 26 |
| Frisur Frau | 24 |
| Bartwuchs | 16 |
| Augenform | 9 |
| Augenfarbe | 7 |
| Augenbrauen | 7 |
| Nase | 10 |
| Mund | 9 |
| Ohren | 5 |
| Wangen/Kinn | 6 |
| Schmuck/Accessoires | 8 |
| Besondere Merkmale | 9 |
| Make-up Frau | 7 |

## Qualitätsmatrix

`stark` bedeutet: bei normaler Spielgröße eigenständig und qualitativ überzeugend.  
`brauchbar` bedeutet: sichtbar und funktional, aber mit geringerem Identitätsgewinn.  
`ähnlich` bedeutet: technisch verschieden, bei 72–96 px aber mit wenig zusätzlicher Individualisierung.  
`Fehler` bedeutet: sichtbarer Renderdefekt wie Clipping, Spalt, harte Kante oder unplausible Geometrie.

| Merkmalsgruppe | Stark | Brauchbar | Ähnlich | Fehler | Anteil stark | Ausbaupotenzial |
|---|---:|---:|---:|---:|---:|---|
| Kopfformen | 11 | 2 | 1 | 0 | 79 % | niedrig–mittel |
| Frisuren Mann | 22 | 3 | 1 | 0 | 85 % | mittel |
| Frisuren Frau | 18 | 4 | 2 | 0 | 75 % | **hoch** |
| Bärte | 13 | 3 | 0 | 0 | 81 % | niedrig–mittel |
| Augen | 6 | 1 | 2 | 0 | 67 % | mittel |
| Augenbrauen | 5 | 1 | 1 | 0 | 71 % | mittel |
| Nasen | 6 | 3 | 1 | 0 | 60 % | mittel |
| Münder | 6 | 1 | 2 | 0 | 67 % | mittel–hoch |
| Ohren | 2 | 3 | 0 | 0 | 40 % | niedrig |
| Wangen/Kinn | 3 | 3 | 0 | 0 | 50 % | **hoch** |
| Besondere Merkmale | 4 | 5 | 0 | 0 | 44 % | mittel–hoch |
| Schmuck/Accessoires | 5 | 3 | 0 | 0 | 63 % | mittel–hoch |
| Make-up | 3 | 4 | 0 | 0 | 43 % | mittel |
| Hautfarben | 10 | 4 | 0 | 0 | 71 % | niedrig |
| Haarfarben | 11 | 2 | 0 | 0 | 85 % | niedrig |
| Augenfarben | 4 | 3 | 0 | 0 | 57 % | niedrig |

Die Prozentwerte sind **keine Gesamtnote**, sondern nur der Anteil der Varianten, die nach diesem Sichtmaßstab als klar eigenständig/stark eingestuft wurden.

## Detailbewertung nach IDs

### Kopfformen

**Stark:**  
0 Oval, 2 Kantig, 3 Schmal, 4 Herz, 5 Vollmond, 6 Breit, 8 Zart, 10 Trapez, 11 Langkantig, 12 Diamant, 13 Kurzbreit.

**Brauchbar:**  
1 Rund, 7 Weich.

**Ähnlich:**  
9 Rundlich – bei 72–96 px zu nah an der Familie 1 Rund / 7 Weich. In der großen Vorschau ist die Kontur erkennbar anders, der zusätzliche Identitätsgewinn auf Karten bleibt aber klein.

**Fehler:** keine.

Die neuen Köpfe 10–13 funktionieren nach CHAR-FIX-04 auch mit den geprüften kurzen/langen Frisuren und Bärten ohne neue Hautspalten oder auffällige Überstände.

### Frisuren Mann

**Stark:**  
0 Rasiert, 2 Seitenscheitel, 3 Undercut, 4 Locken, 5 Afro, 6 Igel, 7 Halbglatze, 8 Zöpfe, 9 Knoten, 10 Vokuhila, 11 Glatze, 12 Zurückgekämmt, 14 Flacher Schnitt, 15 Seitlicher Ansatz, 16 Weiche Wellen, 17 Kurze Naturkrause, 18 Geflochtener Ansatz, 20 Mittelscheitel mit Fall, 22 Lange Locs, 23 Irokesenschnitt, 24 Schulterlang glatt, 25 Flechtkranz.

**Brauchbar:**  
1 Kurz, 19 Locken mit Seitenscheitel, 21 Kurzer Fade.

**Ähnlich:**  
13 Strukturierter Kurzschnitt – bringt bei 72–96 px gegenüber 1 Kurz / 21 Kurzer Fade zu wenig zusätzliche Silhouette. In 145 px ist die Textur besser erkennbar, auf der Karte bleibt der Abstand zu klein.

**Fehler:** keine.

Wichtig nach FIX-04: Rasiert, Kurz, strukturierte/gefadete Kurzformen sowie die langen/voluminösen Varianten wurden auf den Köpfen 10–13 erneut angesehen. Keine neue seitliche Fremdfläche oder Hautkante festgestellt.

### Frisuren Frau

**Stark:**  
1 Lang offen, 2 Voluminös, 3 Bob, 4 Knoten, 5 Seitenzopf, 6 Lang mit Scheitel, 7 Pixie, 8 Locken, 10 Hoher Pferdeschwanz, 11 Geflochtene Zöpfe, 12 Hochgesteckt, 14 Weiche Wellen, 16 Geflochtener Ansatz, 19 Kurzer Fade, 20 Lange Locs, 21 Irokesenschnitt, 22 Schulterlang glatt, 23 Flechtkranz.

**Brauchbar:**  
0 Kurz, 15 Kurze Naturkrause, 17 Locken mit Seitenscheitel, 18 Mittelscheitel mit Fall.

**Ähnlich:**  
9 Kurzer Ansatz – zu nah an 0 Kurz / 7 Pixie.  
13 Naturvolumen – zu nah an der Volumen-/Lockenfamilie 2 Voluminös / 8 Locken, vor allem bei 72 px.

**Fehler:** keine.

Die Frauenfrisuren haben inzwischen viele echte Kategorien, aber die Kurz- und Volumen-/Lockenfamilien sind dichter besetzt als klar unterscheidbare Pony-, asymmetrische und mittellange Formen.

### Bärte

**Stark:**  
0 Glatt, 2 Dreitagebart, 3 Schnurrbart, 4 Kinnbart, 5 Ziegenbart, 6 Kurzer Vollbart, 7 Langer Vollbart, 8 Kinnriemen, 9 Koteletten, 10 Schnurrbart und Stoppeln, 13 Spitzer Vollbart, 14 Ankerbart, 15 Breiter Vollbart.

**Brauchbar:**  
1 Stoppeln, 11 Breiter Schnurrbart, 12 Konturierter Bart.

**Ähnlich:** keine Variante fällt nach P1-04/FIX-04 in diese Stufe.

**Fehler:** keine.

Stoppeln/Dreitagebart sind bei 72 px noch als Dichte-/Texturunterschied lesbar. Schnurrbart/breiter Schnurrbart und kurzer/konturierter Vollbart bleiben verwandt, sind aber in Wangenlinie beziehungsweise Breite ausreichend verschieden. Auf schmalen und breiten Kiefern sowie Kopf 10–13 kein neuer Passungsdefekt.

### Augen

**Stark:**  
0 Mandelförmig, 1 Schmal, 3 Tief liegend, 4 Offen, 7 Angehobene Außenkante, 8 Abgesenkte Außenkante.

**Brauchbar:**  
2 Betont.

**Ähnlich:**  
5 Sanft rund – bei kleiner Größe nah an 4 Offen.  
6 Leicht angehoben – bei 72–96 px nah an 7 Angehobene Außenkante.

**Fehler:** keine.

### Augenbrauen

**Stark:**  
0 Gerade, 1 Geschwungen, 2 Markant, 3 Fein, 4 Breit geschwungen.

**Brauchbar:**  
5 Weich auslaufend.

**Ähnlich:**  
6 Sanfter Bogen – bei 72 px zu nah an 1 Geschwungen / 5 Weich auslaufend.

**Fehler:** keine.

### Nasen

Aktiv angeboten werden die IDs 0, 1, 2, 3, 5, 6, 8, 9, 10 und 11.

**Stark:**  
1 Breit, 3 Lang, 6 Kräftig, 8 Kurze Nasenspitze, 10 Breite Stupsnase, 11 Hoher Nasenrücken.

**Brauchbar:**  
0 Ausgeglichen, 2 Schmal, 5 Rund.

**Ähnlich:**  
9 Sanfter Nasenrücken – in 145 px lesbar, bei 72–96 px aber zu nahe an der neutralen/hohen Nasenrückenfamilie 0 / 11.

**Fehler:** keine.

Die historischen IDs 4 Gerade und 7 Fein bleiben kompatibel renderbar, werden aber zu Recht nicht mehr neu angeboten und sind nicht in den zehn Live-Varianten enthalten.

### Münder

**Stark:**  
0 Lächelnd, 1 Gerade, 2 Schmal geschwungen, 5 Voll, 6 Breit, 8 Offenes Lächeln.

**Brauchbar:**  
3 Entspannt.

**Ähnlich:**  
4 Ausgeglichen – bei 72–96 px zu nah an 1 Gerade / 3 Entspannt.  
7 Leichtes Lächeln – zu nah an 0 Lächelnd, der Unterschied wird erst in der großen Vorschau wirklich sicher.

**Fehler:** keine.

### Ohren

**Stark:**  
0 Klein, 2 Groß.

**Brauchbar:**  
1 Mittel, 3 Anliegend, 4 Rund.

**Ähnlich:** keine harte Dublette, aber die Formvarianten 3/4 wirken wegen der kleinen Fläche naturgemäß schwächer als der Größenunterschied 0/2.

**Fehler:** keine.

### Wangen und Kinn

Aktiv angeboten werden 0, 1, 2, 3, 5 und 6.

**Stark:**  
1 Kinngrübchen, 2 Wangenknochen, 5 Hohe Wangenkontur.

**Brauchbar:**  
0 Weich, 3 Dezente Kontur, 6 Weiche Wangenfülle.

**Ähnlich:** keine aktive Variante ist eine direkte Dublette.

**Fehler:** keine.

Die Gruppe besitzt trotzdem hohes Ausbaupotenzial, weil nur drei der sechs Zustände das Gesicht bei 72 px deutlich prägen. Die historische ID 4 Wangengrübchen bleibt renderbar, ist aber nicht mehr neu auswählbar.

### Besondere Merkmale

**Stark:**  
2 Dichte Sommersprossen, 3 Augenbrauennarbe, 4 Wangennarbe, 8 Kleine Kinnnarbe.

**Brauchbar:**  
0 Ohne, 1 Feine Sommersprossen, 5 Schönheitsfleck, 6 Leichte Lachfältchen, 7 Leichte Augenringe.

**Ähnlich:** keine.

**Fehler:** keine.

Die subtilen Varianten sind bewusst nicht automatisch schlecht: Sommersprossen, Lachfältchen und Augenringe dürfen feiner wirken. Sie tragen auf 72 px aber weniger zur Personenunterscheidung bei als eine neue Silhouette oder Gesichtsgeometrie.

### Schmuck / Accessoires

**Stark:**  
2 Breites Stirnband, 3 Runde Brille, 5 Schmales Stirnband, 6 Sportbrille, 7 Creolen.

**Brauchbar:**  
0 Ohne, 1 Ohrstecker, 4 Kette.

**Ähnlich:** keine.

**Fehler:** keine. Brillen, Stirnbänder und Ohrschmuck sitzen in den geprüften hellen/dunklen und Kopf-10–13-Kontexten sauber.

### Make-up

**Stark:**  
1 Augen betonen, 2 Lippen betonen, 3 Augen und Lippen.

**Brauchbar:**  
0 Ohne, 4 Dezent, 5 Feiner Lidstrich, 6 Warmer Lippenakzent.

**Ähnlich:** keine direkte Dublette; 4–6 sind bewusst subtiler.

**Fehler:** keine.

### Hautfarben

**Stark:**  
0 Hell warm, 2 Mittel golden, 3 Bronze, 4 Braun warm, 5 Dunkel warm, 6 Sehr hell, 7 Hell rosig, 9 Kupfer, 12 Tiefbraun, 13 Sehr dunkel.

**Brauchbar:**  
1 Hell golden, 8 Mittel rosig, 10 Braun neutral, 11 Dunkel neutral.

**Ähnlich:** keine echte Dublette. Die brauchbaren Einträge sind engere Untertonabstufungen, bleiben im direkten 72-px-Vergleich erkennbar.

**Fehler:** keine.

### Haarfarben

**Stark:**  
0 Schwarzbraun, 2 Braun, 4 Goldblond, 5 Grau, 6 Kupferrot, 7 Hellblond, 8 Dunkelblond, 9 Kastanie, 10 Dunkelrot, 11 Silbergrau, 12 Weiß.

**Brauchbar:**  
1 Dunkelbraun, 3 Hellbraun.

**Ähnlich:** keine echte Dublette.

**Fehler:** keine.

### Augenfarben

**Stark:**  
2 Bernstein, 4 Grün, 5 Graublau, 6 Blau.

**Brauchbar:**  
0 Dunkelbraun, 1 Braun, 3 Haselnuss.

**Ähnlich:** keine technische/visuelle Dublette; bei 72 px ist die Irisfläche allerdings klein, weshalb Braunabstufungen naturgemäß weniger Identitätswirkung besitzen.

**Fehler:** keine.

## Konkrete Ähnlichkeitskandidaten

Die folgenden **aktuell angebotenen** IDs sollten in späteren Qualitätspaketen zuerst stärker differenziert werden; sie werden nicht gelöscht oder umnummeriert:

1. Kopf 9 Rundlich gegenüber Kopf 1 Rund / 7 Weich.
2. Frisur Mann 13 Strukturierter Kurzschnitt gegenüber 1 Kurz / 21 Kurzer Fade.
3. Frisur Frau 9 Kurzer Ansatz gegenüber 0 Kurz / 7 Pixie.
4. Frisur Frau 13 Naturvolumen gegenüber 2 Voluminös / 8 Locken.
5. Auge 5 Sanft rund gegenüber 4 Offen.
6. Auge 6 Leicht angehoben gegenüber 7 Angehobene Außenkante.
7. Braue 6 Sanfter Bogen gegenüber 1 Geschwungen / 5 Weich auslaufend.
8. Nase 9 Sanfter Nasenrücken gegenüber 0 Ausgeglichen / 11 Hoher Nasenrücken.
9. Mund 4 Ausgeglichen gegenüber 1 Gerade / 3 Entspannt.
10. Mund 7 Leichtes Lächeln gegenüber 0 Lächelnd.

Das sind **10 konkrete Differenzierungskandidaten**. Keiner davon ist ein Speicher-/Kompatibilitätsfehler.

## Defekte

Im geprüften aktuellen Live-Katalog wurde in dieser Runde **kein neuer klarer Produktdefekt** gefunden.

Insbesondere nicht reproduziert wurden:

- Hautspalten an kurzen Frisuren auf Köpfen 10–13;
- harte Fremdflächen an Schläfen;
- abgeschnittene lange Frisuren;
- Bartüberstände an schmalen/breiten Kiefern;
- die früher problematischen Kinn-/Ankerpassungen;
- neue Clippings von Brillen/Stirnbändern/Creolen in den geprüften Referenzen.

Daher wurde bewusst **kein Produktcode** verändert. Das Paket bleibt eine Bestandsaufnahme plus verbesserter Prüfstand.

## Priorisierte Ausbauempfehlung

### 1. Frisuren – zuerst Frau, dann gezielt Mann

**Priorität: sehr hoch.**  
Die Frisuren haben den größten unmittelbaren Einfluss auf die Silhouette. Der Katalog ist inzwischen groß, aber bei Frauen liegen mehrere Kurz- und Volumen-/Lockenvarianten näher beieinander als die reine Zahl 24 vermuten lässt.

Für eine nächste CHAR-P1-03-Runde qualitativ sinnvoll:

**Frau: etwa 5–7 neue Varianten.**
Nicht noch mehr Varianten derselben Lockenwolke, sondern fehlende Kategorien:

- gerader Vollpony / Stirnfranse;
- Curtain Bangs beziehungsweise deutlich geteilter Pony;
- asymmetrischer Bob oder Sidecut;
- halboffen / Half-up;
- eine einzelne lange Flechtform beziehungsweise klarer Rücken-/Seitenzopf;
- lange, deutlich fallende Wellen oder lange Locken;
- optional Twin Buns / zwei klar getrennte Knoten.

Parallel sollten ID 9 und ID 13 stärker von ihren Nachbarn getrennt werden.

**Mann: etwa 3–5 neue Varianten.**

- echte mittellange lockige/wellige Form statt weiterer Kurzschnitt;
- längere lockige/texturierte Form;
- klare Cornrow-/Box-Braid-Silhouette zusätzlich zum geflochtenen Ansatz;
- zurückgebundene Locs oder markanter langer Zopf;
- optional stärker asymmetrischer Fringe.

ID 13 sollte als bestehende Kurzform stärker gegenüber 1/21 differenziert werden.

### 2. Formtragende Gesichtszüge – Wangen/Kinn, Mund, Augen/Nase

**Priorität: hoch.**  
Wenn Kopf, Frisur und Haut gleich bleiben, tragen diese Gruppen die Personenidentität. Der aktuelle Katalog funktioniert, hat aber mehrere sehr feine Nachbarn.

Qualitativ sinnvoll als nächste CHAR-P1-02-Fortsetzung:

- **Wangen/Kinn: 3 neue beziehungsweise deutlich stärkere Formen**, z. B. markantere Kinnfalte, klare Grübchenform, deutlich andere Wangenfülle/-senke;
- **Mund: 3 neue Formen**, z. B. asymmetrisches Schmunzeln, klar nach unten gezogene Form, markanter voller Unterlippen-/schmaler Oberlippenkontrast;
- **Augen: 2–3 neue Formen**, z. B. klar hooded/monolid-artig, stärker rund, stärker nach unten gezogen statt weiterer Mini-Winkel;
- **Nase: 2–3 neue Formen**, z. B. aquilin/gebogen, deutlich aufwärts gerichtete Spitze, flacher/breiter Nasenrücken.

Vor zusätzlichen IDs zuerst die oben genannten ähnlichen IDs 5/6 Augen, 9 Nase und 4/7 Mund auseinanderziehen.

### 3. Brillen und Accessoires

**Priorität: mittel–hoch.**  
Schon acht Varianten liefern einen guten Effekt, weil Accessoires bei 72 px stark sichtbar sein können. Etwa **3–4** zusätzliche hochwertige Formen wären sinnvoll:

- rechteckige/alltagstaugliche Brille;
- dünne Metall-/Halbrandbrille;
- kleines Nasenpiercing oder anderer klarer, nicht haarabhängiger Gesichtsschmuck;
- optional ein weiteres deutlich anderes Stirn-/Sportaccessoire.

Hier ist der Nutzen pro zusätzlicher Variante höher als bei weiteren sehr kleinen Augenfarbabstufungen.

### 4. Besondere Merkmale

**Priorität: mittel.**  
Etwa **3–4** Ergänzungen sind sinnvoll, aber erst nach den formtragenden Gruppen. Geeignet wären größere/anders platzierte Narbe, markanteres Muttermal-/Fleckmuster, eine zweite klar erkennbare Sommersprossenverteilung oder ein anderes gut lesbares Detail. Subtile Varianten dürfen subtil bleiben; sie sollten nicht künstlich überzeichnet werden.

### 5. Bärte

**Priorität: niedrig–mittel.**  
Nach P1-04 und FIX-04 ist der Bartkatalog aktuell eine der stärksten Gruppen. Keine Reparatur vor weiterem Ausbau nötig. Wenn später erweitert wird, reichen **2–4** echte neue Kategorien, beispielsweise Hufeisen-Schnurrbart, Soul-Patch-orientierte Form, ausgeprägtere Koteletten/Mutton-Chops oder eine weitere klar andere Wangenlinie.

### 6. Farben, Ohren und Make-up

**Priorität: niedrig.**  
Keine Massenerweiterung nötig.

- Haarfarbe: optional 1–2 Ergänzungen, vor allem ein echtes sehr dunkles Schwarz beziehungsweise eine klar aschige Braun-/Blondstufe.
- Hautfarben: die 14 Stufen decken den jetzigen Bereich gut ab; zusätzliche Untertöne nur gezielt und nicht als Zahlenziel.
- Augenfarben: kleine Fläche, daher geringer Zusatznutzen.
- Ohren: maximal 1–2 deutlichere Formen, wenn überhaupt.
- Make-up: 1–2 klar neue Stile wären vertretbar, aber nicht vor Haaren/Gesichtsformen.

## Automatisierte Prüfung des erweiterten Prüfstands

Grüner Head vor Dokumentation: `6edd6f069c48a2676820235ecc9ba8b2479f5065`.

### Spielregressionen / Build

GitHub Actions **Spielregressionen**, Run **35310049237**:

- `npm test`: erfolgreich;
- `npm run build`: erfolgreich;
- Workflow insgesamt: **success**.

### Browser

GitHub Actions **Visuelle Browsertests**, Run **35310049190**:

- **42 bestanden**;
- **21 projektbedingt übersprungen**;
- **0 fehlgeschlagen**;
- Artefakt `Rasenschach-Browsertest`, ID **10533281664**;
- Artefakt-Digest `sha256:e9ec1ac84a6e227f506a165d3462bc804bf158af99b0a1b8efc4c807e822f71b`.

Der erste Lauf des erweiterten Prüfstands war rot, weil der ältere Frisurentest weiterhin genau drei Referenzporträts pro Inventarkarte erwartete, während CHAR-P0-01 bewusst auf sechs Referenzen erweitert wurde. Der neue CHAR-P0-01-Sichtbogentest selbst war in diesem Lauf bereits grün. Die veraltete Sollzahl wurde auf sechs angepasst; die fachlichen Kriterien wurden nicht abgeschwächt. Der anschließende vollständige Lauf ist grün.

## Ergebnis

**CHAR-P0-01 ist inhaltlich abgeschlossen.**

Die Live-Bestandsaufnahme ist jetzt nicht mehr nur technisch, sondern tatsächlich visuell belegt. Die wichtigste Konsequenz ist **nicht** eine Defektreparatur, sondern eine gezieltere nächste Ausbauphase:

1. Frisuren mit echten fehlenden Kategorien statt weiterer naher Varianten;
2. danach formtragende Gesichtszüge, vor allem Wangen/Kinn und Mund sowie klarere Augen-/Nasenfamilien;
3. anschließend Accessoires und markante Details;
4. Bärte nur noch gezielt, nicht als dringendste Baustelle.

Bestehende IDs bleiben vollständig kompatibel. Keine Variante wurde gelöscht oder umnummeriert.
