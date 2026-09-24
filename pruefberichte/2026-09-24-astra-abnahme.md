# Astra-Abnahme · 24.09.2026 · 35.195.2

Basis main `5491fa74657cc2198c6340bc6c438a3fe339e52a` (35.195.1).
Alle offenen PRs und Remote-Branches am Beginn erneut abgerufen.

| Übergabe | Geprüfter Head | Entscheidung |
|---|---|---|
| #49 Spielerpass-Vorschau | `a4198b1fc60da57aee09c97579dcafe923f0d61b` | Übernehmen mit unten beschriebener Aktionskorrektur |
| #50 Holo-Intensität | `d93cadf6b3d2f1485f3e326f210f881eb5b27409` | Übernehmen; Browserregression verbessert |
| #48 Sol-Musik/Klänge | `268dea4aa8d30fefc5bdb3347872d41faa37f08d` | Technisch geprüft und nachgebessert, Veröffentlichung bis Hör-/Geräteprüfung zurückgestellt |

## Optik und Nachbesserungen

Die 112-px-Porträts bleiben beim Öffnen/Schließen der Feinheiten stabil.
Eigene Sichtprüfung fand allerdings einen übersehenen Fehler bei 320 px in der
Galerie: Die beiden Aktionsflächen waren nur 32,5 px breit, die Beschriftungen
benötigten 43/57 px Scrollbreite. Die feste Zweispaltenstruktur wird deshalb
durch ein an den verfügbaren Platz angepasstes Raster ersetzt. Bei geringer
Breite stehen die Aktionen untereinander, andernfalls nebeneinander. Die
Beschriftungen passen nach der Korrektur vollständig. Der Test prüft dies nun
zusätzlich zur unveränderten Vorschaugeometrie.

Holo: Gold und Legendär sind wieder deutlich irisierend; Porträt, Name, Wert
und Auszeichnungen liegen vor der Folie. Die in 35.195.1 entfernten dunklen
Informationskästen bleiben entfernt. Bronze/Silber unverändert. Große und
kompakte Karten bei 320/390 px angesehen; Ruhemodus entfernt die bewegte
Materialebene. Kein neuer Konturüberlauf in der geprüften Ansicht.

Der neue Holo-Browsertest des Lemmings setzte ursprünglich in allen drei
Projekten dieselbe Breite von 390 px. Diese Überschreibung ist entfernt: Die
vorhandene 320/390/1280-Matrix wird nun tatsächlich genutzt; Seitenüberlauf
und Ruhemodus werden zusätzlich geprüft.

## Audio: konkreter Befund, keine vorgetäuschte Hörabnahme

Sols Quellstand unabhängig mit 238 Tests geprüft. Reproduziert: Eine verspätete
play()-Ablehnung beim Wiederaufnehmen eines alten Tracks pausierte die bereits
neu gestartete Karrieremusik. Ein synchroner Wiederaufnahmefehler war ebenfalls
ungeschützt. Astra-Korrektur in PR #51 (Ziel: Sols Branch) bindet Fehlerbehandlung
an Track und Wiedergabeversuch. Regressionen gegen alten Track, alten Versuch
desselben Tracks und synchronen Fehler; danach 239 Tests und Build erfolgreich.

Keine Audioänderung wird mit 35.195.2 ausgeliefert. PR #48 bleibt Draft. Es fehlt
hier ein prüfbarer subjektiver Hörkanal und ein physisches Android-Gerät.
Sols Herkunftsangaben sind im Generatorcode nachvollziehbar (eigene Synthese,
keine externen Samples); das ist keine vollständige rechtliche Klangfreigabe.
Vor Integration fehlen subjektive Qualität/Langzeitwirkung, Smartphone-Lautsprecher,
WebView-Loop sowie Unterbrechung und Audiofokus neben Podcasts. Signalwerte und
Mocks belegen das nicht. Bestehende Sounds bleiben erhalten.

## Prüfungen und Grenzen

- Kombinierte Optikfassung: 237 Tests bestanden, Produktionsbuild und Capacitor-Sync erfolgreich.
- Eigene Cloud-Browser-Sichtung mit 320/390-px-Rahmen: Karten, Feinheiten und tatsächlicher Karriere-Einstieg; reine Testdaten.
- GitHub-CI des Integrationsstands wird vor Main-Merge geprüft; deren Laufbelege stehen am Integrations-PR.
- Keine neue Balance/Spielstandstruktur; daher kein erneuter Langzeit-Balancelauf.
- Physischer Android-Test offen. Browser und erfolgreicher APK-Bau sind kein Gerätebeleg.

## Historische Branches

Keine neuen Änderungen an den bereits am 23.09. bewerteten historischen
chatgpt/codex-Charakterzweigen, den ersetzten Icon-/Startscreenzweigen oder
Claudes Beta-/Gehaltskurvenzweig beim heutigen Fetch. Entscheidungen aus
`2026-09-23-astra-gesamt-abnahme.md`, Abschnitt „Übrige Remote-Branches“, bleiben
bestehen. Keine alten Gesamtstände erneut eingespielt, keine fremden Branches gelöscht.
