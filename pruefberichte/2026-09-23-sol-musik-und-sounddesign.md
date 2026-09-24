# Sol · Klangwelt mit Musik · 23.09.2026

**Rolle:** eigenständiger Sol-Branch, Abnahme durch Astra. **Basis:** `main`
`5491fa74657cc2198c6340bc6c438a3fe339e52a`, `package.json` 35.195.1.
**Branch:** `sol/klangwelt-musik-20260923`. Kein Main-Merge und kein Release.
Die vorhandenen 16 Sol-Klänge, `sound.js` und ihre Tests waren bereits in main.
Es gab zum Arbeitsbeginn keine offenen PRs. Alte historische Branches wurden
nicht überschrieben oder integriert.

## Klang und Einbindung

Eigenes fünftöniges Motiv, warme tiefe Tasten, weiche Bassimpulse, sanfte
elektronische Flächen und sparsames synthetisches Rascheln. Die drei Stücke
haben jeweils 64 komponierte Takte und ruhige Abschnitte; Dauer 2:51–3:17.
Kein Abschnitt wurde bloß mehrfach dupliziert, um die Dauer aufzublähen.
Die neuen Effekte ergänzen den alten Generator. Bronze/Silber/Gold/Legendär
steigen in harmonischer und zeitlicher Ausarbeitung, nicht einfach im Pegel.

Ein zentraler Mischer steuert drei gleichzeitig mögliche Effekte und höchstens
zwei Musikdateien während einer Überblendung. Er drosselt wiederholte
Eingaben, schützt größere Erfolge vor Klickteppichen, senkt die Musik bei
Belohnungen kurz ab, lädt Musik erst nach Auswahl und Geste, pausiert im
Hintergrund und setzt sie nach Rückkehr erst bei einer Spielaktion fort.
Musikstandard Aus (Rücksicht auf eigene Musik); Effekte Leise. Die Stufen
sind unabhängig, im Speicher dauerhaft und beim Zurücksetzen entfernt.
Karten setzen den neutralen Spannungsimpuls vor die Enthüllung; die eigentliche
Stufe ertönt im selben Timer wie das Sichtbarwerden. Bei reduzierter Bewegung
entfällt die Wartezeit. Jede Rückmeldung hat weiterhin eine sichtbare Ausgabe.

## Dateien und Auslöser

Die Pegelspalte bezeichnet den `HTMLAudioElement.volume`-Faktor bei
Leise/Normal, zusätzlich zu den konservativen Pegeln im Original. Andere
Systemlautstärken sind davon unabhängig. `—` heißt: Legacy-Datei bleibt aus
Kompatibilitätsgründen vorhanden, im aktuellen Ablauf ohne eigenen Auslöser.

| Datei | Spielauslöser | Dauer (s) | Pegel Leise/Normal | Varianten | Loop |
|---|---|---|---|---|---|
| `tap.mp3` | Häufiger Standardtipp | 0.11 | 0.10/0.18 | tap_2, tap_3 | nein |
| `tap_2.mp3` | Variierter Standardtipp | 0.11 | 0.15/0.29 | tap, tap_3 | nein |
| `tap_3.mp3` | Variierter Standardtipp | 0.11 | 0.16/0.30 | tap, tap_2 | nein |
| `navigate.mp3` | Menü/Abschnitt öffnen | 0.19 | 0.14/0.26 | — | nein |
| `back.mp3` | Zurück/Schließen | 0.18 | 0.13/0.25 | — | nein |
| `confirm.mp3` | Auswahl/Bestätigung | 0.28 | 0.23/0.43 | — | nein |
| `denied.mp3` | Fehlgeschlagene Buchung | 0.24 | 0.23/0.43 | — | nein |
| `save.mp3` | Sicherungstext erfolgreich vorbereitet | 0.40 | 0.23/0.43 | — | nein |
| `buy.mp3` | Gespeicherter VC-Kauf | 0.44 | 0.23/0.43 | — | nein |
| `sell.mp3` | Gespeicherter Kartenverkauf | 0.39 | 0.23/0.43 | — | nein |
| `unlock.mp3` | Letzte Akademie-Ausbaustufe | 0.65 | 0.23/0.43 | — | nein |
| `training.mp3` | Trainingsauswahl | 0.32 | 0.23/0.43 | — | nein |
| `progress.mp3` | Attributgewinn aus Ereignis | 0.24 | 0.17/0.31 | — | nein |
| `breakthrough.mp3` | Großer Trainingsgewinn/Aufstieg | 0.65 | 0.23/0.43 | — | nein |
| `event.mp3` | Ereignisausgang | 0.34 | 0.23/0.43 | — | nein |
| `setback.mp3` | Rückschlag/Abstieg | 0.36 | 0.23/0.43 | injury | nein |
| `injury.mp3` | Schwere Saisonverletzung | 0.54 | 0.23/0.43 | setback | nein |
| `whistle.mp3` | Karrierestart | 0.39 | 0.23/0.43 | — | nein |
| `season.mp3` | Saisonergebnis ohne Titel | 0.78 | 0.23/0.43 | — | nein |
| `goal.mp3` | Erfolgreicher Sonderschuss | 0.71 | 0.23/0.43 | — | nein |
| `trophy.mp3` | Kleine Auszeichnung/Titel ohne Hauptpokal | 1.22 | 0.23/0.43 | champion | nein |
| `milestone.mp3` | Erreichte Bestmarke | 0.82 | 0.23/0.43 | — | nein |
| `champion.mp3` | Meisterschaft/Pokalsieg | 1.39 | 0.23/0.43 | — | nein |
| `pack_open.mp3` | Pack nach erfolgreicher Buchung | 0.22 | 0.23/0.43 | — | nein |
| `pack_tension.mp3` | Karte vor sichtbarer Enthüllung | 0.29 | 0.15/0.28 | — | nein |
| `card_bronze.mp3` | Sichtbare Bronzekarte | 0.30 | 0.23/0.43 | card_silver, card_gold, card_legendary | nein |
| `card_silver.mp3` | Sichtbare Silberkarte | 0.43 | 0.23/0.43 | card_bronze, card_gold, card_legendary | nein |
| `card_gold.mp3` | Sichtbare Goldkarte | 0.63 | 0.23/0.43 | card_bronze, card_silver, card_legendary | nein |
| `card_legendary.mp3` | Sichtbare legendäre Karte | 0.97 | 0.23/0.43 | card_bronze, card_silver, card_gold | nein |
| `wildcard.mp3` | Wildcard-Enthüllung | 0.97 | 0.23/0.43 | — | nein |
| `transfer.mp3` | Vereinswechsel | 0.57 | 0.23/0.43 | — | nein |
| `flip.mp3` | Spielerpass wenden | 0.38 | 0.23/0.43 | — | nein |
| `farewell.mp3` | Karriereabschluss | 1.71 | 0.23/0.43 | — | nein |
| `pack.mp3` | — (Legacy, keine aktuelle Auslösung) | 0.82 | 0.23/0.43 | — | nein |
| `reveal.mp3` | — (Legacy, keine aktuelle Auslösung) | 0.52 | 0.23/0.43 | — | nein |
| `ankommen.ogg` | Hauptmenü | 192.00 | 0.14/0.26 | — | ja |
| `karriere.ogg` | Laufbahn: Training und Ereignisse | 196.92 | 0.14/0.26 | — | ja |
| `endspurt.ogg` | Saisonbilanz, Vertrag und Karriereende | 170.67 | 0.14/0.26 | — | ja |

## Quelle, Rechte und Technik

- `tools/generate-sounds.py` und `tools/generate-soundtrack.py` erzeugen die
  Töne deterministisch aus eigenen Tonfolgen, mathematischen Wellen und
  lokal erzeugtem Rauschen. Verwendete Audio-Samples, fremde Presets,
  Aufnahmen, Vereinstöne oder Modell-Audio-Generatoren: keine.
- Erstellung hier mit Python, NumPy **2.3.5** und FFmpeg **6.1.1-3ubuntu5**,
  mit `libmp3lame` und `libvorbis`. Die Bibliotheken/Encoder sind Werkzeuge
  zur Erzeugung, nicht Bestandteil der ausgelieferten APK. NumPy beschreibt
  die eigene Lizenz in https://numpy.org/doc/stable/license.html; FFmpeg seine
  LGPL/GPL-Konfiguration in https://ffmpeg.org/legal.html. Bei anderen
  Generatoren oder Audiomaterial müssten deren Bedingungen neu geprüft werden.
  Keine Behauptung einer vollständigen urheberrechtlichen Freigabe: Vor
  kommerzieller Veröffentlichung sind finale Ähnlichkeitsprüfung und
  rechtliche Bewertung durch die Verantwortlichen nötig.
- App: 35 kurze MP3, 3 Ogg/Vorbis-Stücke, gesamt ungefähr 1,7 MB komprimierte
  Dateigröße auf Datenträger. Die Ogg-Dateien dekodieren auf 22.050 Hz mono;
  jedes Musikstück ist in der App lazy geladen. Android dokumentiert
  Ogg/Vorbis-Plattformunterstützung unter
  https://developer.android.com/media/platform/supported-formats.
  Das beweist nicht den konkreten App- oder WebView-Gerätepfad.
- Reproduzierbare WAV-Master, eine bedienbare HTML-Hörprobe, eine kurze
  MP3-Hörfolge und eine CSV-Übersicht liegen separat in der Sol-Übergabe.
  Die WAVs gehören absichtlich nicht in das App-Bundle.

## Prüfnachweis und offene Abnahme

- Asset-Audit: alle 38 Dateien decodiert; kurze Effekte 0,11–1,71 s,
  Musik 170,667/192,000/196,923 s. Die decodierten Musikschleifen haben
  an der Schnittstelle höchstens rund 0,0011 linearen Sample-Pegel Sprung.
  Pegel der Musik liegen um −21,4 dBFS RMS mit rund −8 dBFS Spitzen.
- Mischer-Unit-Tests: unabhängige Stummschaltung, Priorität, schnelle
  Wiederholung, Start nach Geste, Kontextwechsel und Rückkehr aus dem
  Hintergrund. `npm test`: **238/238**; `npm run build`: erfolgreich;
  `npx cap sync android`: erfolgreich nach dem Build. Die übliche Vite-Warnung
  zum schon zuvor großen Hauptbundle bleibt bestehen.
- Die Browserprüfung wurde lokal versucht; Chromium-Installation lieferte
  wiederholt ein ungültiges 0-MiB-Archiv. Ein visueller/akustischer echter
  Spielablauf im Browser ist hier deshalb **nicht belegt**.
- **Offen für Astra/Kevin:** subjektives Hören aller Dateien und der
  vollständigen Spielwege, mindestens eine Stunde Dauernutzung, geringe
  Medienlautstärke/Smartphone-Lautsprecher, schnelle Kartenfolgen, wirkliche
  WebView-Wiedergabe, Verhalten mit laufendem Podcast, Telefonunterbrechung,
  Hintergrund/Rückkehr und Loop-Timing auf Android. Code- und Signalprüfung
  ersetzen diese Hör- und Geräteprüfung nicht.

**Status:** umgesetzt zur unabhängigen Astra-Abnahme; nicht nach `main` integriert.

## Astra-Nachprüfung · 24.09.2026

Quellhead `268dea4`: 238 Tests unabhängig erneut bestanden; Audio-Code und
Generatoren gelesen. Reproduzierter Fehler: Ein noch offenes play()-Promise
beim Wiederanlaufen des Menütracks wurde nach Wechsel zum Karrieretrack
abgelehnt. Der alte catch-Aufruf pausierte den neuen Track (paused false → true).
Auch ein synchroner Fehler beim Wiederanlaufen war nicht abgefangen.

Korrektur auf Astra-Arbeitsbranch: Track-Identität und fortlaufende
Wiedergabeversuche prüfen, bevor eine Ablehnung den Mischer pausieren darf.
Regression deckt alten Track, älteren Versuch desselben Tracks und synchronen
Fehler ab. Danach 239 Tests und Produktionsbuild erfolgreich.

Entscheidung: technische Korrektur zur Übernahme in Sols PR; keine klangliche
Endabnahme und keine Veröffentlichung des Musikpakets. In dieser Umgebung steht
kein prüfbarer Hörkanal zur Verfügung; Signalwerte oder Audio-Mocks ersetzen
keine subjektive Hörprobe. Insbesondere Handy-Lautsprecher, längeres Hören,
WebView-Loop und Audiofokus neben einem Podcast bleiben offen. PR #48 bleibt
Draft. Für eine Freigabe sind diese Befunde nachzuliefern; die Assets bleiben
vollständig erhalten.
