# KAUF-03 · Unabhängige Bedienprüfung des Jugendakademie-Piloten

**Datum:** 24.09.2026  
**Rolle:** Lemming 3  
**Zielbranch:** `astra/kaufkacheln-pilot`  
**Geprüfter Produktcommit:** `3be4a3cadc63a26173609f8dd83c7e16150d2a06`  
**Prüfcode-Head vor diesem Bericht:** `e2bb6b0bc58c45c336974d2a50e568f1fa29081b`  
**Version laut package.json:** 35.196.0

## Ausgangslage und Integration

KAUF-01 und KAUF-02 sind vor dieser Prüfung bereits durch Astra in den Pilot integriert worden. Der Integrationscommit `e4dd45129acc0f2826d31fec0a10237255610b56` enthält die übernommenen Köpfe:

- KAUF-01 / PR #55: `bc71be5cfa031d3d95be90112c7632abbdebb87b`
- KAUF-02 / PR #56: `e5d88e07acaf55bf4977a9c2201fb5c22f0800db`

Während KAUF-03 anlief, wurde der Pilot um das von Kevin gewünschte optische und
haptische Bedienfeedback ergänzt. Deshalb wurde die Prüfbasis vor dem Abschluss
auf `3be4a3cadc63a26173609f8dd83c7e16150d2a06` aktualisiert. Dieser Commit ist
direkter Nachfolger von `e4dd451` und ist die hier abgenommene Produktfassung.

Es handelt sich damit **nicht** um eine Pilot-Vorprüfung: Illustrationen und
Kauftexte sind integriert. Andere offene Arbeiten (#57/#58) wurden nicht einbezogen.

## Prüfaufbau

Geprüft wurde ausschließlich der isolierte Spieltest
`/.preview/spieltest.html` mit dem Startzustand **„Akademie-Kacheln“**.
Produktive Spielstände wurden nicht verändert. Verzögerte bzw. fehlschlagende
Speicherung wurde ausschließlich im isolierten `sessionStorage`-Adapter
simuliert.

Browserprojekte:

- 320 × 720 px (`schmal`)
- 390 × 844 px (`handy`)
- 1280 × 900 px (`desktop`)
- zusätzlich kurze Höhe 420 px bei der jeweiligen Projektbreite
- höchste Anzeigegröße: 150 %
- `prefers-reduced-motion: reduce` und Spiel-Ruhemodus

Die Screenshots aus dem GitHub-Artefakt wurden tatsächlich geöffnet und
visuell bewertet. Browserprüfung und Android-Geräteprüfung werden ausdrücklich
getrennt behandelt.

## Automatische Ergebnisse

### Spielregressionen

GitHub Actions, Run 35999128469 auf `e2bb6b0`:

- **244 bestanden**
- Produktionsbuild erfolgreich
- darunter die Haptik-Regressionen des aktuellen Piloten:
  tatsächliche Button-Betätigung statt Scrollbeginn, stärkere Rückmeldung bei
  Primäraktion, keine Vibration bei gesperrter Aktion, Ruhemodus oder
  abgeschalteter Vibration sowie vorhandene Android-VIBRATE-Berechtigung.

### Visuelle Browsertests

GitHub Actions, Run 35999128367 auf `e2bb6b0`:

- **99 bestanden**
- **3 fehlgeschlagen**
- **33 projektbedingt übersprungen**
- die drei Fehler sind **derselbe einzelne Produktbefund**, reproduziert bei
  320 px, 390 px und Desktop: Fokusbindung im Kaufdialog.

Die übrigen KAUF-03-Fälle bestanden in allen drei Projekten, darunter
Escape/Zurück, Scrollposition, große Anzeige, kurze Höhe, exaktes/knappes
Guthaben, Maximalstufe, Doppeltipp, verzögerte Speicherung und
Speicherfehler-Rücknahme.

## Bestandene Bedien- und Funktionsprüfung

### Kacheln und Informationen

Alle neun Akademiekacheln werden angezeigt. Jede besitzt ein eigenes integriertes
SVG-Motiv, Titel, aktuelle Stufe, Nutzen, Preis bzw. „Voll ausgebaut“ und einen
verständlichen Zustand/Sperrgrund. Die Motive sind in der tatsächlichen
Kachelansicht unterscheidbar; die gemeinsame matte Sportmagazin-Sprache passt
zur vorhandenen Oberfläche.

Das Öffnen einer Kachel verändert Guthaben und Ausbaustufe nicht. Erst der
separate Kaufbutton löst die Buchung aus. Der Detaildialog nennt aktuellen
Ausbau, Guthaben, nächste Stufe und einmaligen Preis. Bei zu wenig Guthaben
wird der fehlende VC-Betrag genannt; auf Maximalstufe gibt es keinen Kaufbutton.

### Guthaben, Kauf und Persistenz

- **Knapp zu wenig:** Scouting bei 17 VC / Preis 18 VC zeigt „Noch 1 VC nötig“
  und deaktiviert den Kauf.
- **Exakt ausreichend:** Trainingsplätze bei 16 VC / Preis 16 VC buchen
  Stufe 1 → 2 und Guthaben 16 → 0.
- Nach erneutem Laden bleibt Stufe 2 erhalten.
- Maximalstufe Medizin 6 / 6 bleibt als Detail aufrufbar und erklärt
  „Vollständig ausgebaut“.

### Doppeltipp und verzögerte Speicherung

Der Speichervorgang wurde im isolierten Prüfstand künstlich um 500 ms verzögert.
Zwei unmittelbar ausgelöste Klicks führen zu **genau einer** Akademie-Schreibung.
Währenddessen ist der Kaufbutton gesperrt und zeigt „Wird gespeichert …“.
Vor Abschluss erscheint keine Erfolgsmeldung und der persistierte Stand bleibt
noch unverändert. Erst nach bestätigter Speicherung erscheinen Stufe 2 und
0 VC.

### Fehlgeschlagene Speicherung

Beim ersten Schreiben wurde im isolierten Prüfstand gezielt ein Fehler erzeugt.
Die App zeigt **keine** falsche Kauf-Erfolgsmeldung, wechselt in die vorhandene
sichere Fehleransicht und meldet:

„Speichern fehlgeschlagen. Der bisherige Stand wurde vollständig wiederhergestellt.“

Danach liegen weiterhin 16 VC und Stufe 1 vor. Damit entsteht weder eine
doppelte Abbuchung noch ein halb sichtbarer Kaufzustand.

### Escape, Zurück, Fokus nach Schließen und Scrollposition

Escape schließt nur den Detaildialog. Browser-Zurück schließt ebenfalls nur den
Dialog. In beiden Fällen wird der Fokus auf die zuvor geöffnete Kachel
zurückgegeben und die Scrollposition bleibt erhalten.

Der Browser-Zurück-Test belegt den Web-/History-Pfad. Er ist **kein** physischer
Android-Hardware-Zurück-Test.

### Anzeigegröße, kurze Höhe, Touchflächen und Ruhemodus

Bei 150 % Anzeigegröße wechselt das Raster auf schmalen Ansichten sinnvoll auf
eine Spalte. Kacheltexte, Preis und Status bleiben lesbar. Bei 420 px Höhe ist
der Dialog scrollbar; Schließen und Kaufbutton bleiben erreichbar. Die
geprüften Aktionen besitzen mindestens 44 × 44 px erreichbare Fläche.

Im Spiel-Ruhemodus und bei Systempräferenz „reduzierte Bewegung“ wurden in
Kaufübersicht und Kaufdialog keine benannten laufenden Bewegungsanimationen
festgestellt. Das aktuelle Kachel-Druckfeedback verändert Fläche/Rahmen ohne
Bewegung.

## Sichtprüfung der Screenshots

Geöffnet und bewertet wurden unter anderem:

- `kauf-03-uebersicht.png` bei 320, 390 und 1280 px
- `kauf-03-sehr-gross.png` bei 150 % Anzeigegröße
- `kauf-03-kurze-hoehe.png` bei 420 px Höhe
- `kachel-gedrueckt.png` für das sichtbare Druckfeedback
- die Fehler-Screenshots des Fokusbefunds

Positiv: klare Informationshierarchie, ausreichend deutliche Preis-/Statuszeilen,
erkennbare Motive, sinnvolle Einspaltenansicht bei sehr großer Anzeige,
gut erkennbarer gedrückter Zustand und kein abgeschnittener Kaufbutton im
kurzen Dialog.

## Befunde

### KAUF-03-01 · Fokus verlässt modalen Dialog bei Tab

**Schwere:** Mittel  
**Bereich:** `kauf-ui.jsx` / `KaufDetail`  
**Reproduziert:** 320 × 720, 390 × 844, 1280 × 900  
**Eingabe:** Tastatur

**Schritte**

1. Startzustand „Akademie-Kacheln“ öffnen.
2. „Profi-Netzwerk“ öffnen; mit 16 VC ist der Kaufbutton deaktiviert.
3. Fokus liegt korrekt auf „Schließen“.
4. `Tab` drücken.

**Soll:** Der Fokus bleibt innerhalb des modalen Dialogs und zyklisch auf einem
Dialogelement.

**Ist:** Nach `Tab` ist das aktive Element kein Nachfahre von
`dialog.kauf-detail` mehr. Der Hintergrund bleibt zwar durch das native
Modal inert, aber die geforderte Fokusbindung ist nicht erfüllt.

**Einordnung:** Kein Daten- oder Touch-Kaufproblem, aber ein reproduzierbarer
Tastatur-/Barrierefreiheitsfehler. `showModal()` allein sichert diesen
Ein-Element-Fall in Chromium nicht ausreichend ab. Der Test bleibt absichtlich
rot und wurde nicht abgeschwächt.

### KAUF-03-02 · unschöner Einzelbuchstaben-Umbruch bei 320 px

**Schwere:** Niedrig  
**Bereich:** `kauf-ui.jsx` / Kacheltitel-CSS  
**Reproduziert:** 320 × 720, normale Anzeigegröße

**Schritte**

1. „Akademie-Kacheln“ bei 320 px öffnen.
2. Trainingsplätze-Kachel ansehen.

**Soll:** Der Titel bricht als gut lesbare Wort-/Zeileneinheit um.

**Ist:** „Trainingsplätze“ wird so knapp umgebrochen, dass das letzte „e“ allein
in der nächsten Zeile steht. Funktion, Klickfläche und Verständlichkeit bleiben
erhalten, die Darstellung wirkt aber weniger hochwertig als bei 390 px und
Desktop.

## Optisches und haptisches Bedienfeedback

Das nachgezogene Pilotfeedback aus `3be4a3c` ist in der Browser-/Codeprüfung
enthalten:

- sichtbarer gedrückter Zustand der Kaufkachel durch Fläche, Akzent-Rahmen und
  Innenrahmen;
- keine zusätzliche Bewegung des Elements beim Drücken;
- Haptik wird zentral erst auf `click` ausgelöst, nicht beim Scrollbeginn;
- Primäraktionen erhalten den stärkeren Impuls;
- gesperrte Aktionen, Ruhemodus und deaktivierte Vibration bleiben stumm;
- Android deklariert die Vibrationsberechtigung.

**Nicht geprüft:** tatsächliche Stärke, Gefühl und Zuverlässigkeit der Vibration
auf einem physischen Android-Gerät. Der Browser-/Regressionstest darf nicht als
Geräte-Haptiktest ausgegeben werden.

## Android-Grenze

Es wurde **kein echter Android-Gerätetest** durchgeführt. Offen bleiben daher
insbesondere:

- reale Touch-/WebView-Eigenheiten gegenüber Chromium;
- physische Haptik/Vibrationsstärke;
- Android-Hardware-Zurück;
- Verhalten mit Bildschirmtastatur/Accessibility-Diensten;
- tatsächliche Darstellung unter Gerätesafeareas und Systemskalierung.

## Abnahmeempfehlung an Astra

**Noch keine vollständige Abnahme des Piloten.**

Die Kaufmechanik, Speicherrobustheit, Texte, Illustrationen, responsive
Bedienbarkeit und das neue optische Bedienfeedback sind für den geprüften
Browserumfang belastbar. Der reproduzierbare Fokusverlust bei `Tab` verletzt
jedoch ein ausdrücklich gefordertes Abnahmekriterium und sollte vor der
Übertragung der gemeinsamen Kaufoberfläche auf Vermögen und Profimannschaft
korrigiert werden.

Empfohlene Folge für Astra:

1. Fokusbindung in `KaufDetail` korrigieren, insbesondere den Fall mit nur
   einem aktiv fokussierbaren Steuerelement.
2. KAUF-03 unverändert erneut laufen lassen.
3. Den 320-px-Titelumbruch nach Möglichkeit in derselben UI-Korrektur sauber
   gestalten, ohne die Informationsdichte zu verschlechtern.
4. Danach Browserabnahme erneut bewerten; physische Android-/Haptikprüfung
   weiterhin separat am Gerät durchführen.

**Status:** KAUF-03 geprüft, ein mittlerer und ein niedriger Befund; Astra-Abnahme
und Produktkorrektur offen. Kein Produktcode durch Lemming 3 geändert, kein
Merge, kein Release, keine Versionsänderung.
