# Weiterentwicklung – 35.174.0

## Aktueller Gerätetest

35.172.0 ergänzt die Wildcard-Korrektur, zwei alternative Abschlüsse des Trainer-Strangs und die vorbereiteten Speicherregressionen. Die neue APK kann über die bestehende App installiert werden; App-ID und Signierung bleiben erhalten. Auf dem Gerät besonders die Enthüllung bei normaler/großer Anzeige sowie mit und ohne Animation testen.

## Regressionen

`npm ci` und anschließend `npm test`. Aktuell **71** Tests einschließlich
Untertests (nachgezählt am 15.09.2026). Die Aufstellung darunter beschreibt den
Stand von 35.172.0 mit 62 Tests und wurde seither nicht nachgeführt; dazu kamen
die acht Prüfungen aus 35.173.0/35.174.0 und die Ankerprüfung vom 15.09.2026:

- Abschlussbelohnungen und Kaufbuchungen: 19 vorhandene Tests.
- Sieben weitere Prüfungen zu verdeckter Wildcard, Trainer-Pfaden, Wartezeit, alten Ereignisspielständen und eindeutigen Kennungen.
- Zusätzlich 34 Prüfungen zu Speicherfehlern, Wiederherstellung, Import/Rücknahme und Fortsetzen.
- Fehler werden an jedem Zugriff des normalen Mehrfachbuchungsablaufs einzeln injiziert; anschließend wird der vollständig wiederhergestellte Stand geprüft.
- Simulierte Prozessabbrüche nach 0–3 Teiländerungen sowie ein anhaltender Fehler während der Rücksetzung.
- Ereignisse überleben Katalogumsortierungen per stabiler ID; historische Auswahlindizes behalten ihre Folgen.
- Bereits feststehende Entscheidungen, Angebote und Saisonergebnisse bleiben beim Fortsetzen erhalten.

GitHub prüft Pull Requests automatisch mit Tests und Web-Build, ohne Signier-Secrets. Der Android-Release-Workflow bleibt unverändert und führt die erweiterte Testsuite ebenfalls aus.

Die Tests verwenden kontrollierte Speicheradapter und Ereignisbeispiele. Sie ersetzen weder den echten Android-Prozessabbruch noch eine vollständige Prüfung aller Ereignisfolgen. Lokal: 62/62 Tests, Produktionsbuild und Capacitor-Synchronisierung erfolgreich. Die Wildcard-Prüfung kontrolliert das initial gerenderte Markup und die Deckfarbe; sie ersetzt keine visuelle Prüfung der Drehung in der Android-WebView. CI-Ergebnisse stehen am jeweiligen Commit.

## Nächste kleine Inhaltsrunde

Umgesetzt: Der vierte Trainer-Schritt unterscheidet gepflegten, lockeren und abgebrochenen Kontakt. Erfolgreiche Annäherung im zweiten Schritt führt weiter zum engen Kontakt. Vier Schritte und bisherige Ereignisfrequenz bleiben erhalten. Bereits gespeicherte Abschiedsereignisse behalten ihre bisherigen Auswahlfolgen. Neue Varianten erhalten eigene stabile Kennungen.

Als mögliche nächste Runde wenige positions-/altersabhängige Varianten und präzisere Magazin-Schlagzeilen prüfen. Jede Inhaltsrunde braucht eindeutige Ereignis- und Auswahlkennungen sowie einen Ladeverträglichkeitstest für gespeicherte Ereignisse. Bekannte Grenzen 3/15 Saisons und Vorsatz unter der Wildcard erhalten.


## Prüfungsrunde 35.173.0

Behoben: Turnier-Schlagzeilen lasen `ntMajor.n`, die Simulation schreibt `turnier`. Ergebnis und Jahr werden nun passend angezeigt. Saisonkopien nach JSON-Laden wurden über Objektidentität gesucht: daraus konnten ein zusätzliches Vereinsjahr und ein Vergleich mit derselben statt der vorherigen Saison entstehen. Zuordnung jetzt über Saisonjahr und Verein; der Rückblick verwendet die ermittelte Vorsaison auch für seine Erklärungen.

Reproduzierbar mit `node tools/langzeit.cjs`: 192 vollständige Karrieren, acht Positionen, beide Geschlechter, drei Schwierigkeitsgrade, vier feste Auswahlstrategien/Startländer, davon eine im Speedmodus. 4.505 Saisons und 7.863 Ereignisse; 429 verschiedene Ereigniskennungen. Alle Läufe endeten; geprüfte Zahlen blieben endlich, Einsatzsummen und gespeicherte Saisonergebnisse stimmten überein. Laufbahnlänge: Median 25, Spanne 13–25 Saisons. Reine Laufbahn-VC: Median 81, Spanne 20–275, ohne zusätzliche Abschlussboni. Das ist eine Stichprobe mit vorgegebenen Strategien, keine allgemeine Spielerverteilung und keine Vollabnahme des Katalogs.

Der Prüfstand extrahiert die tatsächlich verwendeten Trainings-, Ereignis-, Saison- und Angebots-Handler. Er ersetzt React-Zustandswechsel, Animationen, physische Speicherung und den Karriereabschluss durch kontrollierte Testadapter. Die Abschlussbuchung wird separat in den Regressionen geprüft. Die ungenutzte alte Funktion `quickSim` ist ausdrücklich nicht die Prüfgrundlage.

Historischer Befund 35.173: Akademie-/Vereinsjahre und Rautekarten-Ausgleich liefen auch bei kurzen Karrieren weiter. Die neue Fünf-Saisons-Regel für Akademie und Verein ist unten umgesetzt; der Rautekarten-Zähler ist davon nicht betroffen.

Packwirtschaft: zusätzlich 2.000 Ziehungen je Packtyp; Verkaufserlöse liegen im Mittel unter dem Kaufpreis. Einzelne profitable Ziehungen sind möglich, daraus folgt kein zuverlässig profitabler Kreislauf. Der Prüfstand gibt die tatsächlichen Mittelwerte und Rückflussanteile aus.

Bedienung: Kartenverkäufe reichen Speicherfehler als Ausnahme an die Oberfläche weiter und melden erst nach bestätigter Speicherung Erfolg. Der breite visuelle Test von großen Anzeigen, Überlagerungen und mehrfachen Eingaben ist weiterhin offen; kein erfolgreicher Browser-/Android-Sichttest in dieser Runde behauptet.

## Vorbereitete kleine Inhaltsrunde

- Je eine Variante für Torhüter, defensive und offensive Feldspieler innerhalb bestehender Ereignisplätze; vor dem Ergänzen mit den bereits erreichten 429 Ereignissen und dem Gesamtkatalog auf Dopplungen abgleichen.
- Eine spätere Rückmeldung auf eine frühe Karriereentscheidung, mit unterschiedlichen Texten und nachvollziehbaren Folgen; bestehende Kennungen und gespeicherte Entscheidungen erhalten.
- Schlagzeilen anhand belegbarer Saisonwerte weiter präzisieren. Zunächst sind die zwei oben genannten Fehler behoben; zusätzliche Wertungen erst mit konkreten Beispielen aus dem Gerätetest.

Keine neuen Pflichtfenster, weitere Währung oder höhere Ereigniszahl vorgesehen. Gerätetest hat Vorrang vor der nächsten Inhaltsrunde.


## Umsetzung 35.174.0

Kevin legt mindestens fünf abgeschlossene Spielersaisons für Akademie-/Vereinsfortschritt und deren Freischaltung fest. Der Abschluss lässt diese Systeme unter fünf Saisons unverändert. Ein geeigneter Abschluss bringt weiterhin genau ein Jahr. Für die bisherigen Freischaltstufen (zwei/fünf Karrieren) zählt `hausKarrieren` nur geeignete neue Abschlüsse. `karrieren` bleibt die allgemeine Lebensstatistik. `bilanzLaden` erhält bereits erreichte alte Freischaltungen, ohne alte kurze Karrieren neu als qualifiziert anzurechnen. VC ab drei und Gratispack ab 15 Saisons bleiben bestehen.

Verkaufspreise: Bronze 10, Silber 24, Gold 60, Legende 170 VC. Vollständig über alle Packkombinationen einschließlich Mindestkarte gerechnet: Bronze 95,73 %, Silber 104,83 %, Gold 96,94 %, Legende 81,87 % durchschnittlicher Rückfluss. Ziel 80–120 % nach Kevins Vorgabe; Silber mit positivem Erwartungswert ist bewusst zugelassen. Preise gelten auch für vorhandene verkäufliche Packkarten; Sonder-/Erinnerungskarten bleiben unverkäuflich.

Inhalte: `video_tw`, `video_def`, `video_off` für frühe positionsgerechte Videoarbeit und `video_spaeter` ab 29 Jahren/acht Saisons mit früher angelegtem `videobuch`. Keine zusätzliche Ereigniszahl; neue stabile Ereignis-/Auswahlkennungen. Bestehende Auswahlfolgen bleiben erhalten.

70 Regressionen erfolgreich: echte Abschlussgrenzen 0/3/4/5/15; Akademiejahr, kontrollierter Aufruf der Vereinssimulation, Freischaltzähler und Altdaten nach erneutem Laden; exakter Verkaufserwartungswert; neue Ereignisbedingungen und gespeicherte Auswahlen. Der Vereinsadapter prüft die Aufrufgrenze, nicht jede Vereinskonstellation. Android-Gerätetest bleibt erforderlich, besonders Abschluss mit vier/fünf Saisons und bestehende Freischaltungen.

Neue Langzeit-Stichprobe 35.174: 192 Karrieren, 4.494 Saisons, 7.849 Ereignisse, 444 Ereigniskennungen; alle numerischen/Ablaufprüfungen bestanden. Je 2.000 Packs ergaben 94,3 / 102,0 / 95,4 / 80,9 % Rückfluss (Bronze/Silber/Gold/Legende). Exakte Erwartungswerte oben sind gegenüber dieser endlichen Stichprobe maßgeblich. Produktionsbuild und Capacitor-Synchronisierung erfolgreich; Release-Ergebnis am GitHub-Commit.

## Werkzeug- und Dokumentationsrunde, 15.09.2026 (ohne Versionswechsel)

Die Version bleibt bei 35.174.0, weil sich am Spiel nichts ändert. Nachgewiesen,
nicht behauptet: das Produktionsbündel ist vor und nach dieser Runde
**bitgleich** — `dist/assets/index-DZWeO9eP.js`, SHA-256
`a0b174e4…d308d2ee278`, unverändert. Die Änderungen an `App.jsx` sind reine
Kommentare, und Kommentare überleben die Minifizierung nicht. Es entsteht also
keine neue APK und kein neuer versionCode.

**`README.md` neu angelegt.** Bis jetzt hatte das Repository keinen Einstieg:
`ENTWICKLUNG.md` ist ein Arbeitstagebuch, `CHANGELOG.md` eine Versionsliste,
aber nirgends stand, was das Projekt ist, wie man es baut und woran man sich
beim Mitarbeiten hält. Darin jetzt auch die **Vermerk-Konvention** für die
Arbeit zu dritt: welche Art von Änderung in CHANGELOG, ENTWICKLUNG, README oder
in einen Kommentar am Code gehört, dazu fünf Regeln, die sich aus den bisherigen
Fehlern dieses Projekts ergeben (Messwerte mit Verfahren nennen; nichts als
geprüft ausgeben, was nicht lief; alte Begründungen nicht überschreiben, sondern
datiert ergänzen; Ereigniskennungen sind endgültig; `App.jsx` ist der
wahrscheinlichste Konfliktpunkt).

**Tote Verweise auf `STAND.md` aufgelöst.** `akademie.js` und `karten.js`
verwiesen auf ein Dokument, das nie in diesem Repository lag — es stammt aus der
Entwicklung vor 35.169.0 und wurde beim Import des vorbereiteten
Android-Projekts nicht mitgenommen (geprüft über den vollständigen
Git-Verlauf). Beide Stellen behalten ihren ursprünglichen Wortlaut und bekommen
einen datierten Nachtrag. Wichtig dabei: der in `akademie.js` erwähnte
Gleichheitslauf zu 35.48 ist damit **nicht mehr nachlesbar**. Die Aussage „reine
Umschichtung" steht dort weiter als historische Behauptung, gilt aber nicht als
heute belegt. In `karten.js` ist zusätzlich die Zahl überholt: aus den genannten
14.800 Zeilen in `App.jsx` sind 19.319 geworden — die Begründung, neue Systeme
in eigene Dateien zu legen, ist dadurch stärker geworden, nicht schwächer.

**Prüfstand-Anker eingeführt.** `tools/langzeit.cjs` baut keine React-Oberfläche
auf, sondern schneidet die echten Handler textlich aus `App.jsx`. Die
Schnittstellen dafür waren beliebige Codezeilen — der Handler-Block endete an
`const quickSim =`, also an einer Funktion, die von keiner Stelle aufgerufen
wird und die jeder jederzeit hätte löschen dürfen. Der Lauf wäre dann mit
„Handler fehlt: const chooseTraining =" abgebrochen, obwohl `chooseTraining`
unverändert dasteht; und weil der Langzeitlauf nicht in der CI läuft, hätte das
erst der nächste bemerkt, der ihn von Hand startet.

Jetzt markieren vier Kommentarzeilen in `App.jsx` die Blöcke
(`PRUEFSTAND-ANFANG/ENDE: helfer` und `…: handler`), `tools/anker.cjs` führt sie
an einer Stelle für alle Nutzer, und eine neue Regression prüft bei jedem
`npm test` Vorhandensein, Eindeutigkeit, Reihenfolge und Inhalt der Marken. Die
Kopplung an `quickSim` ist gelöst: die Funktion kann jetzt entfernt werden, ohne
etwas mitzunehmen — bewusst nicht in dieser Runde, das ist eine eigene
Entscheidung und keine Nebenwirkung.

**`esbuild` als devDependency deklariert.** Sowohl `tools/langzeit.cjs` als auch
`tools/regression.test.cjs` laden `esbuild`, ohne dass es in `package.json`
stand; es kam bisher nur zufällig über Vite herein (`npm ls esbuild`:
`vite@6.4.3 → esbuild@0.25.12`). Das betrifft nicht nur den optionalen Lauf,
sondern `npm test` und damit die CI: hätte Vite seinen Bündler gewechselt, wären
die Regressionen ohne eigenes Zutun rot geworden. Jetzt steht `^0.25.12`
ausdrücklich in `package.json`; npm löst weiterhin auf dieselbe einzige Kopie
auf (`deduped`), `npm ci` installiert unverändert 160 Pakete.

**Geprüft in dieser Runde:** `npm test` 71/71 (vorher 70/70), Produktionsbündel
bitgleich, `node tools/langzeit.cjs` zeichengleiche Ausgabe zum Lauf vor der
Änderung (192 Karrieren, 4.494 Saisons, 7.849 Ereignisse, 444 Kennungen;
Packrückfluss 94,3 / 102,0 / 95,4 / 80,9 %). Der neue Wächter wurde nicht nur
geschrieben, sondern ausgelöst: eine testweise entfernte Marke ließ `npm test`
rot werden und den Langzeitlauf sofort mit der neuen, benannten Meldung
abbrechen; danach wurde `App.jsx` prüfsummengleich zurückgestellt.

**Kein Eintrag in `CHANGELOG.md`** — dort steht, was Spielende merken, und das
ist hier nichts. Der Vermerk gehört an diese Stelle.

### Beobachtung am Rand, nicht behoben

Die Laufbahnlänge im Langzeitlauf reicht heute von **8** bis 25 Saisons
(Median 25). Für 35.173 sind an anderer Stelle in dieser Datei 13–25 vermerkt.
Mindestens eine der 192 Karrieren endet also deutlich früher als zuvor. Das
liegt zeitlich an der Fünf-Saisons-Regel aus 35.174, ist aber **nicht**
untersucht — die Stichprobe fährt feste Strategien, kein Spielerverhalten, und
eine einzelne Laufbahn kann aus ganz anderen Gründen früh enden. Wer die neue
Grenze prüft, sollte hier zuerst hinsehen.
