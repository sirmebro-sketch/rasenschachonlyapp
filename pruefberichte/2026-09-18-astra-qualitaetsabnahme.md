# Unabhängige Qualitätsabnahme – 18.09.2026

## Auftrag und Entscheidung

Kevin beauftragte eine unabhängige Prüfung der integrierten ChatGPT-Charakterarbeit,
eine Funktions- und Spielgefühlstichprobe sowie kleine nötige Bereinigungen.
Keine neue Ausbauwelle, keine Übernahme von Claudes separater Vereinswirtschaft.

Basis: main `e9b21630bd378504226812867613ed27249af627`, Paketversion 35.194.0.
Vergleichsbasis vor der Charakterarbeit: `78f7dc8` (35.192).
Korrekturversion: **35.194.1**, Android versionCode **3519401**.

**Entscheidung:** Arbeit erhalten. Kein belegter schwerer Spielkern- oder
Speicherschaden und kein Anlass für einen pauschalen Rollback. Die bisherige
Eigenabnahme war dennoch zu optimistisch hinsichtlich vollständiger Folgekosten
neuer Varianten. Kleine Korrekturen sind nötig; vollständige Android-Geräte- und
ästhetische Gesamtfreigabe wird nicht behauptet.

## Belegte Befunde und kleine Korrekturen

| Befund | Bedeutung | Behandlung |
|---|---|---|
| Mund-IDs 9–11 fehlten in `MUND_MASSE`; `gesichtsAnker` klemmte sie auf ID 8. Der Kombinationstest endete bei neun Mündern. | Die gemeinsame Lippen-/Bart-Abstandsrechnung kannte die neuen Formen nicht. Grüne Tests erfassten diese Lücke nicht. Kein Spielabbruch. | Eigene konservative Grenzen ergänzt; Test liest den Katalog und prüft 14 × 12 × 12 = 2.016 Kombinationen sowie vollständige Maßtabellenabdeckung. |
| `tools/portraet-bogen.cjs` zeichnete 31 Frisuren auf eine feste Fläche für 25. | Die letzten sechs Varianten wurden im PNG abgeschnitten. Andere CI-Galerien waren davon nicht betroffen. | Höhe aus der tatsächlichen Variantenanzahl; beide vollständigen Bögen erzeugt und geöffnet. |
| `charakter-ui.css` wurde nur von `main.jsx`, nicht von Galerie/isoliertem Spieltest geladen. | Die Vorschau der Charakterbedienung entsprach nicht der ausgelieferten mobilen App. Der bisherige Browsertest auf `/` war dadurch nicht ungültig. | Produkt-CSS in beide eigenständigen HTML-Vorschauen eingebettet; mobiler Bedien-/Speichertest auf beide Einstiegspfade erweitert. |
| `App.jsx` meldete weiterhin 35.192 und den alten Änderungstext. | Anzeige und Sicherungsmetadaten nannten einen veralteten Stand, trotz Paket-/Androidversion 35.194.0. | Version aus package.json, Beschreibung aktualisiert. |
| Tracker führte P1-04/P1-05 als nicht begonnen, obwohl Code, Berichte und Tests vorhanden sind. | Vermeidbare Unübersichtlichkeit und Risiko doppelter Arbeit. | Umsetzungsstatus berichtigt; Umsetzung und unabhängige Abnahme ausdrücklich getrennt. |

Bestehende Porträt-IDs, historische Seed-Zuordnung, Spielregeln, Belohnungen,
Vereinswirtschaft, Signatur und App-ID werden nicht verändert. Die Maßkorrektur
betrifft die neuen Mundformen; Tabellenwerte 0–8 bleiben erhalten.

## Unabhängig ausgeführte Prüfungen

- `npm ci`, **140/140 Regressionen**, Produktionsbuild erfolgreich.
- Dieselben Regressionen nach den Korrekturen erneut erfolgreich; die vorhandene
  Gesichtsankerprüfung enthält nun 2.016 statt 1.512 Kombinationen.
- `npm run preview:gallery` erfolgreich; Capacitor-Sync erfolgreich.
- Langzeitlauf auf dem Ausgangsstand: **192 Karrieren, 4.527 Saisons**, kein Abbruch;
  zusätzlich je 2.000 Ziehungen der vier Packtypen. Kein Beleg für vollständige
  Balance oder UI-Fehlerfreiheit. Keine Balanceänderung aus dieser Stichprobe.
- GitHub am exakten Ausgangscommit unabhängig abgefragt: Regression/Build
  `35321171083`, Browser `35321171023`, Android `35321170992` jeweils erfolgreich.
- Der lokale Chromium-Download scheiterte mit Timeout. Kein lokaler vollständiger
  Playwright-Erfolg behauptet. Die verwaltete Browseroberfläche war nutzbar;
  einzelne Browsersteuerungs-Timeouts waren keine reproduzierten Spielabstürze.
- Manuelle Browserstichprobe im isolierten Teststand: Charaktererstellung,
  Namenseingabe, neue Mundform, Festhalten und Würfeln, 390/320-Pixel-Ansicht,
  Karrierestart, Wildcard, Training und zwei Ereignisentscheidungen. Weitere
  Abschlussbelege werden im untenstehenden Nachtrag dokumentiert.
- Eigene Sichtprüfung: vollständige 31er-Frisurbögen beider Geschlechter auf
  Kurzbreit; Mund 8–11 auf Oval/Vollmond/Kurzbreit mit Bart 0/3/14 und Nase 11;
  Kopfformgalerie mit mehreren Haut-/Haar-/Bartkontexten; mobile Feinheiten.
  Diese Stichprobe ist keine erneute Vollabnahme jeder denkbaren Kombination.

## Optik und Spielgefühl

Die Vielfalt ist sichtbar gewachsen. IDs und Namensauflösung wurden insgesamt
sorgfältig weitergeführt; gemeinsame Kopf-/Gesichtsanker sind sinnvoller als
zahlreiche voneinander unabhängige Sonderfälle. Die mobile kompakte Vorschau,
Festhalten und feste Startleiste erleichtern die Bedienung.

Die Qualitätsobergrenze ist noch nicht erreicht: mehrere kurze Frisuren sind
weiterhin nahe verwandt; lange Männerlocken (27) verdecken große Teile der
Gesichtszone, während Augen/Brauen darüber gezeichnet werden. Das sollte eine
spätere gezielte Form-/Schichtenrunde prüfen. Kleine Mund-/Wangenunterschiede
sind teilweise subtil. Unterschiedliche Pixel sind kein Beweis für hochwertigen
Charakterausdruck. Keine IDs allein deshalb gelöscht.

Der konkrete Karriereweg ist verständlich: Training → Entscheidung → Folge.
Die Ereignistexte und sofort erläuterten Folgen geben den Entscheidungen Gewicht.
Die lange Charakterseite und die horizontalen Kategorien kosten auf 320 px
weiterhin Scrollarbeit. Das ist ein Bedienungsrest, kein Startblocker.

Die Kernsimulation ist gegenüber der Ausgangsversion außerhalb des Porträt- und
Editorbereichs unverändert. Ein neues allgemeines Spielgefühl lässt sich deshalb
nicht allein der Charakterarbeit zuschreiben.

## Repo-Hygiene und Zusammenarbeit

Seit `78f7dc8` wurden 137 Commits integriert, bei 64 geänderten Dateien. Ein großer
Teil sind Prüfstände, Berichte und Zwischenkorrekturen. Kein eingechecktes
node_modules, dist, APK/ZIP oder Vorschau-Bildmüll festgestellt. Keine sinnvolle
Funktionsbereinigung durch massenhaftes Löschen erkennbar.

Mehrere ChatGPT/Codex-Branches erscheinen wegen Rebase weiterhin als nicht
abstammungsmäßig gemergt. Aktive/ungeprüfte Branchspitzen werden nicht gelöscht.
Die bestehenden Historien werden nicht nachträglich umgeschrieben. Für neue
Runden: Arbeitsbranch, ein kleines Paket, geprüfte Integration, klarer Bericht.

Claudes offene PR-Kette zur Vereinswirtschaft wurde zur Abgrenzung gelesen
(#6, #9, #11, #13, #15, #16; zusätzlich #7 CI-Handstart). Keine Übernahme, Ablehnung
oder fachliche Abnahme dieser Arbeit in diesem Auftrag. Der separate Beta-Branch
bleibt unberührt.

## Einschätzung des anderen Modells

Für klar begrenzte Entwicklungspakete weiterhin geeignet. Grobe subjektive
Bewertung dieser Arbeitsserie: **80/100 für den technischen Beitrag**, **70/100
für die aktuelle optische Ausreifung**, **65/100 für Übersicht und Abschlussdisziplin**.
Dies sind Bewertungsmaßstäbe, keine statistischen Erfolgswahrscheinlichkeiten.

Stärken: kompatible Kennungen, nutzbare neue Varianten, Regressionen und echte
Nachkorrekturen nach roten Prüfungen. Schwächen: vergessene abhängige Tabellen/
Vorschaupfade, widersprüchlicher Fortschrittsstatus und viele Zwischencommits.
Die passenden Leitplanken stehen jetzt zusätzlich in README unter
„Kleine Entwicklungsrunden und unabhängige Abnahme“.

## Grenzen

Kein physischer Android-Test, keine WebView-Leistungsmessung, keine vollständige
manuell durchgespielte Karriere, kein neuer Kompletttest sämtlicher Import-/
Dateidialogwege. Automatische Speicherregressionen sind gelaufen. Android-Build
und CI der Korrektur müssen am veröffentlichten Commit separat bestätigt werden.

## Nachtrag vor Bereitstellung des Review-Branches

Der manuelle Weg erreichte Saisonende 2026/27: 24 Pflichtspiele, 2 Tore, 1 Vorlage,
Platz 6 von 20. Alle vier Rückblickseiten waren weiterklickbar. Keine Aussage über
sämtliche Karrierepfade aus dieser einzelnen Stichprobe.

Die automatische Freigabeprüfung lehnte den direkten Push nach main ab: Der
aktuelle Auftrag sei Review/Bereinigung und autorisiere nach ihrer Bewertung
keine Veröffentlichung von Code-/Versions-/Androidänderungen auf main. Deshalb
werden die Änderungen auf einem getrennten Review-Branch mit Draft-PR angeboten.
Kein main-Update und kein neuer APK-Erfolg werden behauptet. Die dauerhafte
Freigabe in README wurde nicht entfernt; die aktuelle technische Sperre wird
nicht umgangen. Die Nutzerfreigabe zur Integration ist abschließend einzuholen.

Empfohlene Trackerberichtigung: P1-04 und P1-05 mindestens als umgesetzt/gelb
führen; P1-01 weiter mit konkreter Grenze der unabhängigen Kombinationsabnahme.
Der bestehende Issue-Text wird vor Integration dieser Runde nicht überschrieben.
