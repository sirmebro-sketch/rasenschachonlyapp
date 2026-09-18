# CHAR-P1-05 – mobiler Wischhinweis für Charakter-Kategorien

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486` (`main`, Version 35.194.1)  
**Arbeitsbranch:** `lemming/char-p1-05-wischhinweis`

## Auftrag

Bei 320/390 px soll deutlicher erkennbar sein, dass die Kategorien der Charakter-Feinheiten horizontal wischbar sind und weitere Kategorien folgen. Kein Editorumbau, keine zusätzliche Pflichtaktion. Auswahl, Festhalten, Scrollen sowie Start-/Zurück-Buttons müssen unverändert funktionieren.

## Ausgangsbefund

Der integrierte Stand aus CHAR-P1-05 besitzt bereits eine zweizeilige horizontale Kategorienleiste. Die Bedienung ist technisch wischbar und ein angeschnittener Folgebutton gibt einen visuellen Hinweis. In der aktuellen Smartphone-Sicht ist dieser Hinweis jedoch leicht als bloß abgeschnittener Inhalt zu lesen; eine eindeutige Beschriftung für die horizontale Fortsetzung fehlt.

Parallel offene PRs #31–#33 betreffen Packs/Karten und wurden weder integriert noch verändert. Die offenen Wirtschafts-/CI-Arbeiten liegen ebenfalls außerhalb dieses Pakets.

## Änderung

- Die bestehende Kategorienleiste bleibt unverändert scrollbar und behält ihre Buttons, Auswahlzustände und Touchgrößen.
- Unter der Leiste erscheint bis 520 px eine kleine rein informative Wischlegende:
  - am Anfang: `Wischen · weitere Kategorien →`
  - in der Mitte: `← Kategorien wischen →`
  - am Ende: `← Frühere Kategorien · wischen`
- Der Zustand wird ausschließlich aus `scrollLeft`, `scrollWidth` und `clientWidth` abgeleitet. Er verändert keine Porträt-ID, keine Auswahl und keine Speicherung.
- Der Hinweis ist `aria-hidden`, nicht klickbar und damit keine neue Pflichtaktion.
- Desktop ab 521 px bleibt ohne zusätzlichen Hinweis.

## Regression

`tools/browser/charakter-p1-05.spec.js` wurde erweitert:

- App `/` und isolierter Spieltest `/.preview/spieltest.html` bei 320×720 und 390×844;
- zusätzlich isolierte Sichtprobe `/.preview/sichtprobe.html` bei beiden Breiten;
- echter Touch-Wischweg über Chromiums Eingabeschnittstelle statt direkter `scrollLeft`-Manipulation;
- Anfang → Mitte → Ende → zurück wird anhand des sichtbaren Hinweises und der realen Scrollposition geprüft;
- Hautton und Bart werden weiterhin ausgewählt, festgehalten, nach Würfeln kontrolliert und nach echtem Karrierestart als stabile IDs geprüft;
- `Los geht's` und `Zurück` bleiben erreichbar; in der isolierten Sichtprobe werden beide tatsächlichen Klickwege ausgelöst;
- Screenshots an Anfang und Ende dienen der visuellen Sichtprüfung.

## Bewusst nicht geändert

- kein Umbau der Charaktererstellung;
- keine Porträtoptionen, IDs, Würfellogik oder Speicherverträge;
- kein Pack-/Karten-/Wildcard-Code;
- keine Versionierung, kein Android-Release;
- keine parallelen PRs.

## Prüfung

Die automatisierten GitHub-Prüfungen werden auf dem PR-Head ausgeführt. Ergebnisse und Sichtbefund der erzeugten Smartphone-Screenshots werden vor der Übergabe hier bzw. im PR dokumentiert.

## Grenze

Kein Android-Gerätetest in diesem kleinen Browser-/Bedienpaket. Touch und Responsive-Verhalten werden real im Chromium-Browser bei 320/390 px geprüft; native WebView-Haptik bleibt davon getrennt.

**Status:** Umsetzung auf Lemming-Branch; Astra-Abnahme offen.
