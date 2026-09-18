# Mobile QA – lange Spieler- und Vereinsnamen bei 320/390 px

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Status:** Dokumentationsbefund zur Astra-Abnahme; keine Produktcodeänderung  
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486` · Version `35.194.1`  
**Branch:** `lemming/mobile-lange-namen`

## Auftrag und Grenze

Geprüft wurden lange Spieler- und Vereinsnamen, Doppelnamen, Leerzeichen und Umlaute in:

- Charaktererstellung,
- Spielerkarten,
- Saisonbilanz,

jeweils bei **320 px** und **390 px** Bildschirmbreite.

Geachtet wurde auf abgeschnittene Angaben, Überlagerungen, ungewolltes horizontales Scrollen und verdrängte Buttons. Es wurden nur Eingaben beziehungsweise Vereinsnamen verwendet, die das aktuelle Spiel tatsächlich zulässt. Produktcode, Balance, Speicherschema und bestehende PRs wurden nicht verändert.

## Live-Stand und parallele Arbeit

Vor Beginn wurden die aktuellen `START-NEUER-CHAT.md`, `AGENTS.md`, `README.md`, `LEMMING.md`, der Charakter-/Optik-Arbeitsplan sowie die offenen Pull Requests geprüft.

`main` stand vor Beginn und beim abschließenden Abgleich auf `703d377e8eaa7932b6f5fed62ca313807ad16486`.

Der bereits bekannte Karten-Lesbarkeitsbefund zu Gold/Legendär liegt in [PR #32](https://github.com/sirmebro-sketch/rasenschachonlyapp/pull/32). Er wird hier **nicht** als neuer Befund dupliziert. Die übrigen offenen Lemming-/Claude-PRs wurden weder integriert noch verändert.

## Getrennter Testspielstand

Verwendet wurde der isolierte Spieltest aus dem erfolgreichen GitHub-Actions-Artefakt **„Rasenschach-Browsertest“** vom exakten Basiscommit `703d377e…` (Workflow-Run `35324596284`). Dessen `.preview/spieltest.html` verwendet getrennte Sitzungsdaten und berührt den normalen Spielstand nicht.

Die Prüfung erfolgte in echten Browseransichten mit **320 × 900 px** und **390 × 900 px**. Für beide Breiten wurden Screenshots erzeugt, anschließend tatsächlich geöffnet und visuell bewertet; nicht nur der Browser-/Teststatus wurde betrachtet.

## Verwendete Eingaben

### Spielername

`Jean-Pierre Großmüller`

Der Name enthält:

- Doppelname mit Bindestrich,
- Leerzeichen,
- Umlaut `ü`,
- `ß`,
- insgesamt **22 Zeichen**.

Das echte Namensfeld der Charaktererstellung erlaubt `maxlength=22` und setzt keine zusätzliche Zeichenmuster-Sperre. Der Testname liegt damit genau an der tatsächlich zulässigen Obergrenze.

### Vereinsnamen

Es wurden ausschließlich Namen verwendet, die über die echte Spieloberfläche vorkamen beziehungsweise auswählbar waren:

- `BOR. MÖNCHENGLADBACH`
- `1. FC Kaiserslautern`
- `SV Darmstadt 98`
- `Hertha BSC`

Damit wurden Großbuchstaben, Leerzeichen, Punkt, Ziffern und Umlaut im realen Datenbestand abgedeckt.

## Priorisierte Befunde

### P1 / hoch – Spielerpass verdrängt den Vereinsnamen bei 320 px vollständig

**Reproduktion**

1. Isolierten Spieltest öffnen.
2. Neue Laufbahn mit `Jean-Pierre Großmüller` anlegen.
3. Einen angebotenen Verein wählen und die Laufbahn starten.
4. Auf **320 px** Breite den Spielerpass beziehungsweise die Kopfzeile mit Vereinszuordnung ansehen.
5. Gegenprobe bei **390 px**.

**Soll**

Vereinswappen und Vereinsname bleiben auch bei 320 px wenigstens in sinnvoll gekürzter oder umgebrochener Form erkennbar. Ein erlaubter Vereinsname darf nicht vollständig aus der Informationszeile verschwinden.

**Ist**

Bei 320 px bleibt das Wappen sichtbar, während der Textbereich des Vereinsnamens auf **0 px nutzbare Breite** zusammengedrückt wird. Das trat auch mit dem kurzen realen Namen `Hertha BSC` auf und ist daher nicht nur ein Extremfall langer Vereinsnamen.

Bei 390 px bleibt `Hertha BSC` vollständig sichtbar. `1. FC Kaiserslautern` wird dort bereits gekürzt, aber nicht vollständig verdrängt.

Es wurde **kein horizontaler Seitenscroll** erzeugt; das Problem entsteht durch internes Zusammendrücken der Zeile.

**Kleine Lösungsidee**

Für sehr schmale Ansichten die Vereinsinformation im Pass stapeln: Label in eine eigene Zeile, darunter Wappen + Vereinsname mit flexibler Restbreite. Alternativ dem Vereinsnamen eine definierte Mindestbreite geben und weniger wichtige Nachbarspalten zuerst umbrechen. Keine Änderung an Vereinsdaten oder Speicherformat nötig.

---

### P2 / mittel – maximal zulässiger Spielername ist schon in der Charaktervorschau abgeschnitten

**Reproduktion**

1. Charaktererstellung bei 320 px beziehungsweise 390 px öffnen.
2. In das echte Namensfeld `Jean-Pierre Großmüller` eingeben.
3. Die Identitäts-/Passvorschau oberhalb der Detailauswahl betrachten.
4. Eingabefeld und Vorschau vergleichen.

**Soll**

Ein Name, den das Formular ausdrücklich bis 22 Zeichen akzeptiert, sollte in der Erstellungsansicht sinnvoll erkennbar bleiben. Eine Kürzung darf die Identifikation nicht bereits bei der zulässigen Obergrenze stark entwerten.

**Ist**

Der Eingabewert bleibt vollständig und korrekt gespeichert. Die kompakte Vorschau kürzt den Namen jedoch:

- bei **320 px** im Wesentlichen auf `JEAN-PIERRE …`,
- bei **390 px** ebenfalls mit Ellipse; ein Teil von `Großmüller` fehlt.

Es gibt dabei keine Überlagerung und keinen horizontalen Seitenscroll. Der Informationsverlust entsteht allein durch die einzeilige Ellipsenbegrenzung.

**Kleine Lösungsidee**

Im kompakten Vorschaukopf bis zu **zwei Namenszeilen** zulassen und erst danach ellipsieren. Der bestehende 22-Zeichen-Vertrag kann unverändert bleiben.

## Positive Befunde / kein neuer Fehler

### Spielerkarten

Die Karte in der Sammlung zeigte `JEAN-PIERRE GROSSMÜLLER` bei **320 px und 390 px vollständig innerhalb der Karte**. Name und Stärke überlagerten sich nicht; die Seite erzeugte keinen horizontalen Scroll.

Die bereits bekannte allgemeine Lesbarkeitsproblematik bestimmter Gold-/Legendär-Sekundärinformationen ist separat in PR #32 dokumentiert und wird hier nicht erneut bewertet.

### Saisonbilanz

Alle fünf Rückblickseiten wurden bei **320 px und 390 px** tatsächlich geöffnet.

Geprüft wurden unter anderem:

- `Jean-Pierre Großmüller` mit `SV Darmstadt 98`,
- zusätzliche Vereinsnamensprobe mit `1. FC Kaiserslautern`.

In den angesehenen Saisonbilanzseiten waren Spieler-/Vereinsangaben lesbar; es wurden keine Überlagerungen, abgeschnittenen Aktionsbuttons oder horizontaler Seitenscroll reproduziert.

### Charaktererstellung – Bedienbarkeit am Seitenende

Bei 320 px wurde zusätzlich bis zum unteren Ende der Charaktererstellung gescrollt. Die letzte Vorsatz-Auswahl blieb oberhalb der festen Startaktion erreichbar; `LOS GEHT'S` verdrängte keine der geprüften Auswahlmöglichkeiten.

## Sichtprüfung und technische Beobachtungen

Für die dokumentierten Zustände wurden die erzeugten 320-/390-px-Screenshots **geöffnet und visuell bewertet**. Bewertet wurden insbesondere:

- Zeichenverlust beziehungsweise Ellipse,
- Wappen-/Text-Kollision,
- sichtbare Buttons,
- vertikale Erreichbarkeit,
- Seitenscroll.

Zusätzlich wurde in den geprüften Ansichten `document.documentElement.scrollWidth` gegen `clientWidth` kontrolliert. In den protokollierten Fällen bestand **kein ungewolltes horizontales Scrollen**.

Der Bericht commitet bewusst keine Produktänderung und keine neue Browser-Spezifikation. Er hält nur reproduzierte Befunde und bestandene Sichtfälle fest, damit Astra über einen gezielten Folgepatch entscheiden kann.

## Bewusst nicht geprüft

- physisches Android-Gerät / WebView,
- Systemschriftvergrößerung oder Browserzoom,
- sämtliche Länder- und Vereinsnamen des Gesamtkatalogs,
- andere Schriftsysteme,
- Wildcards und Packs,
- fremde offene PR-Branches nach deren Änderungen.

## Ergebnis

**Zwei neue reproduzierbare Befunde:**

1. **P1 hoch:** Vereinsname wird im Spielerpass bei 320 px vollständig verdrängt.
2. **P2 mittel:** maximal erlaubter 22-Zeichen-Spielername wird bereits in der Charaktervorschau bei 320/390 px gekürzt.

Spielerkarten und Saisonbilanz bestanden die beauftragte Namens-/Überlaufstichprobe ohne neuen Befund. Bekannte Kartenprobleme bleiben in PR #32 verlinkt.

**Status:** zur Astra-Abnahme; noch nicht integriert. Kein main-Merge, kein Release, keine Produktcodeänderung.
