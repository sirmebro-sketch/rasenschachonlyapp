# CHAR-P1-05 – mobiler Wischhinweis für Charakter-Kategorien

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486` (`main`, Version 35.194.1)  
**Arbeitsbranch:** `lemming/char-p1-05-wischhinweis`

## Auftrag

Bei 320/390 px soll deutlicher erkennbar sein, dass die Kategorien der Charakter-Feinheiten horizontal wischbar sind und weitere Kategorien folgen. Kein Editorumbau, keine zusätzliche Pflichtaktion. Auswahl, Festhalten, Scrollen sowie Start-/Zurück-Buttons müssen unverändert funktionieren.

## Ausgangsbefund

Der integrierte Stand aus CHAR-P1-05 besitzt bereits eine zweizeilige horizontale Kategorienleiste. Die Bedienung ist technisch horizontal scrollbar und ein angeschnittener Folgebutton gibt einen visuellen Hinweis. In der Smartphone-Sicht ist dieser Hinweis jedoch leicht als bloß abgeschnittener Inhalt zu lesen; eine eindeutige Beschriftung für die horizontale Fortsetzung fehlte.

Parallel offene Pack-/Karten- und Wirtschaftsarbeiten wurden weder integriert noch verändert.

## Änderung

- Die bestehende Kategorienleiste bleibt scrollbar und behält Buttons, Auswahlzustände und Touchgrößen.
- Unter der Leiste erscheint bis 520 px eine kleine rein informative Wischlegende:
  - am Anfang: `Wischen · weitere Kategorien →`
  - in der Mitte: `← Kategorien wischen →`
  - am Ende: `← Frühere Kategorien · wischen`
- Der Zustand wird ausschließlich aus `scrollLeft`, `scrollWidth` und `clientWidth` abgeleitet. Er verändert keine Porträt-ID, keine Auswahl und keine Speicherung.
- Ein Toleranzrand von 8 px behandelt das im Chromium-Prüfweg reproduzierbare anfängliche 4-px-Einrasten weiterhin als linken Rand.
- Der Hinweis ist `aria-hidden`, nicht klickbar und damit keine neue Pflichtaktion.
- Desktop ab 521 px bleibt ohne zusätzlichen Hinweis.

## Regression

`tools/browser/charakter-p1-05.spec.js` wurde gezielt erweitert:

- App `/` und isolierter Spieltest `/.preview/spieltest.html` bei 320×720 und 390×844;
- zusätzlich isolierte Sichtprobe `/.preview/sichtprobe.html` bei beiden Breiten;
- horizontaler Browser-Eingabeweg direkt über der Kategorienleiste statt direkter `scrollLeft`-Manipulation;
- Anfang → Mitte → Ende → zurück wird anhand der realen Scrollposition und des sichtbaren Hinweises geprüft;
- Hautton und Bart werden weiterhin ausgewählt, festgehalten, nach Würfeln kontrolliert und nach echtem Karrierestart als stabile IDs `haut=12` und `bart=14` geprüft;
- `Los geht's` und `Zurück` bleiben erreichbar; in der isolierten Sichtprobe werden beide tatsächlichen Klickwege ausgelöst;
- Anfang und Ende werden in App/Spieltest und isolierter Sichtprobe als Smartphone-Screenshots festgehalten.

Wichtig zur Prüfmethodik: Chromiums CDP-Touch-Synthese scrollte den verschachtelten `overflow-x`-Container im headless CI nicht zuverlässig. Nach reproduzierbaren roten Gegenläufen wurde deshalb **nicht** auf direktes Setzen von `scrollLeft` ausgewichen, sondern auf horizontalen Browser-Wheel/Trackpad-Input über dem echten Element. Damit laufen Overflow, Scroll-Snap und der echte `onScroll`-Handler des Produkts. Ein physischer Android-Touchtest ist davon ausdrücklich getrennt.

## Sichtprüfung

Die erzeugten Belege aus App, isoliertem Spieltest und isolierter Sichtprobe wurden für 320 und 390 px geöffnet und geprüft:

- am Anfang ist `Wischen · weitere Kategorien →` sichtbar und nicht mit einer Aktion verwechselbar;
- am rechten Ende wechselt die Beschriftung korrekt auf `← Frühere Kategorien · wischen`;
- die teilweise angeschnittene Folgekategorie bleibt als zusätzliche visuelle Fortsetzung erhalten;
- kein horizontaler Seitenüberlauf wurde sichtbar;
- `Los geht's` und `Zurück` bleiben in beiden Breiten frei, erreichbar und werden nicht vom Hinweis überlagert;
- die isolierte Sichtprobe zeigt dasselbe Verhalten wie der App-/Spieltest-Pfad.

## Automatisierte Prüfung

Technischer Abnahmelauf auf dem code-identischen Head `8b3a8415d201188f925eabd39d12872acb859626`:

- Spielregressionen, Run `35369850919`: **grün**;
- `npm test`: **140/140 bestanden**, 0 Fehler;
- `npm run build`: **erfolgreich**;
- Visuelle Browsertests, Run `35369850891`: **grün**;
- Browser: **47 bestanden**, **25 planmäßig übersprungen**, **0 Fehler**;
- Browser-Artefakt: `10558566120`;
- SHA-256: `e3201e5b4ccc40ebe6b45820ba7f0d90a345ae53b3e15e2bf939abeaceca7858`.

Die letzten Änderungen nach diesem Lauf sind ausschließlich dieser Prüfbericht. Der PR-Head wird deshalb nach dem Dokumentationscommit noch einmal durch beide GitHub-Gates geprüft; die finalen Run-IDs stehen im PR.

## Bewusst nicht geändert

- kein Umbau der Charaktererstellung;
- keine Porträtoptionen, IDs, Würfellogik oder Speicherverträge;
- kein Pack-/Karten-/Wildcard-Code;
- keine Versionierung, kein Android-Release;
- keine parallelen PRs.

## Grenze

Kein physischer Android-Gerätetest in diesem kleinen Browser-/Bedienpaket. Responsive Darstellung, echte Klickwege und horizontaler Browser-Scrollweg sind bei 320/390 px geprüft; native WebView-Touchhaptik bleibt als Geräteprüfung außerhalb dieses Pakets.

**Status:** Lemming-Paket technisch abgeschlossen; Astra-Abnahme offen. Kein main-Merge, kein Release.
