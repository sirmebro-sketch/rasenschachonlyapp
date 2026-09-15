# Weiterentwicklung

<!-- Bewusst ohne Versionsnummer im Titel (15.09.2026): sie stand zuletzt auf
     35.174.0, während das Projekt bei 35.176.0 war. Jeder Abschnitt unten trägt
     seine eigene Version — eine zweite im Titel kann nur veralten. -->

## Aktueller Gerätetest

35.172.0 ergänzt die Wildcard-Korrektur, zwei alternative Abschlüsse des Trainer-Strangs und die vorbereiteten Speicherregressionen. Die neue APK kann über die bestehende App installiert werden; App-ID und Signierung bleiben erhalten. Auf dem Gerät besonders die Enthüllung bei normaler/großer Anzeige sowie mit und ohne Animation testen.

## Regressionen

`npm ci` und anschließend `npm test`. **Die gültige Zahl nennt der Lauf selbst**
(`# pass` am Ende der Ausgabe) — hier steht sie bewusst nicht mehr, weil sie
zuletzt dreimal hintereinander veraltet war: 62, dann 71, dann 86, und im
Dokument blieb jedes Mal die alte stehen. Wer sie für einen Vermerk braucht,
zählt sie am eigenen Lauf ab und nennt sie dort mit Datum.

Die Aufstellung darunter beschreibt den Umfang zum Stand 35.172.0 und ist als
Übersicht gemeint, nicht als Zählung; seither sind die Prüfungen aus
35.173.0 bis 35.176.0 dazugekommen (Ankerprüfung, Vorsätze, Saisonziele,
Karrieregeschichten, späte Bildung):

- Abschlussbelohnungen und Kaufbuchungen: 19 vorhandene Tests.
- Sieben weitere Prüfungen zu verdeckter Wildcard, Trainer-Pfaden, Wartezeit, alten Ereignisspielständen und eindeutigen Kennungen.
- Zusätzlich 34 Prüfungen zu Speicherfehlern, Wiederherstellung, Import/Rücknahme und Fortsetzen.
- Fehler werden an jedem Zugriff des normalen Mehrfachbuchungsablaufs einzeln injiziert; anschließend wird der vollständig wiederhergestellte Stand geprüft.
- Simulierte Prozessabbrüche nach 0–3 Teiländerungen sowie ein anhaltender Fehler während der Rücksetzung.
- Ereignisse überleben Katalogumsortierungen per stabiler ID; historische Auswahlindizes behalten ihre Folgen.
- Bereits feststehende Entscheidungen, Angebote und Saisonergebnisse bleiben beim Fortsetzen erhalten.

GitHub prüft Pull Requests automatisch mit Tests und Web-Build, ohne Signier-Secrets. Der Android-Release-Workflow bleibt unverändert und führt die erweiterte Testsuite ebenfalls aus.

Die Tests verwenden kontrollierte Speicheradapter und Ereignisbeispiele. Sie ersetzen weder den echten Android-Prozessabbruch noch eine vollständige Prüfung aller Ereignisfolgen. Lokal zum Stand 35.172.0: 62/62 Tests, Produktionsbuild und Capacitor-Synchronisierung erfolgreich — der jeweils aktuelle Nachweis steht im Abschnitt der laufenden Runde. Die Wildcard-Prüfung kontrolliert das initial gerenderte Markup und die Deckfarbe; sie ersetzt keine visuelle Prüfung der Drehung in der Android-WebView. CI-Ergebnisse stehen am jeweiligen Commit.

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


## Gemeinsamer Stand 35.175.0 – Codex, 15.09.2026

Basis: `main` 649e253 (35.174.0), Claudes Branch `claude/elegant-cray-29rcm8` mit Commit `cd56ad92eaa495c4dffd6c4d68484920ef6452c8` vollständig übernommen. Dessen README, datierte Quellkommentare, Ankerwerkzeug, Ankertest und direkte esbuild-Abhängigkeit bleiben erhalten. Ein Konflikt am Dateiende von `tools/regression.test.cjs` wurde durch Erhalt beider Testgruppen gelöst. Der Langzeitlauf verwendet weiterhin Claudes benannte Blöcke. Ab jetzt durchläuft er außerdem alle sechs Vorsätze; deshalb sind seine Kennzahlen nicht unmittelbar als isolierter Vorher-/Nachher-Effekt einer einzelnen Regel interpretierbar.

Neues Modul `vorsatz.js`: abgeleiteter Fortschritt, einmalige Belohnungsbelege in `p.vorsatzLohn`, pure Punkteberechnung ohne doppelte Addition. Prüfung nach Ereignissen, nach einer Saison und vor Abschluss. Bestehende aktive Spielstände erhalten einen erreichten Bonus bei der nächsten solchen Aktion einmalig; abgeschlossene Halleneinträge werden nicht neu bewertet. Spielerwerte bleiben innerhalb ihrer bisherigen Grenzen. Der Vorsatz bleibt an seiner Position direkt unter der Wildcard, ohne das entfernte Tätigkeitsfenster wieder einzuführen.

| Vorsatz | Voraussetzung | Einmaliger Spielerbonus | Vermächtnispunkte |
|---|---|---|---:|
| Weltenbummler | Saisons in 3 Ländern | Bekanntheit +6, Moral +8 | 70 |
| Daheim | 10 heimische Saisons; für Punkte bis Ende keine Auslandssaison | Vertrauen +10, Moral +10 | 90 |
| Lange Laufbahn | 10 Saisons | Fitness +10, Verletzungsanfälligkeit −3 | 45 |
| Herausragende Saison | gültige Saisonnote ≤2,0 | Bekanntheit +8, Moral +8 | 65 |
| Zweites Standbein | Abschluss erworben | Moral +10, 50.000 € | 35 |
| Auf dem Platz zuhause | 300 Pflichtspiele | Vertrauen +8, Fitness +8 | 80 |

Die Abstufung ist eine erste Designkalibrierung, kein empirisch belegtes Optimum. Daheim belohnt den erreichten Zehnjahres-Meilenstein sofort; bei späterer Auslandssaison bleiben dieser frühere Spielerbonus und sein Beleg erhalten, aber der Abschlussbonus entfällt. Die zusätzlichen Vermächtnispunkte fließen über den normalen Score auch in die bestehende VC-Formel ein; die Drei-Saisons-Grenze gilt weiterhin.

Saisonziel: zu Saisonbeginn aus letzter Saison/Alter/Wechsel abgeleitet, im Spielstand fixiert. 10, 15 oder 20 Pflichtspiele; +3 Moral einmalig bei Erfolg, keine Strafe und keine neue Pflichtentscheidung. Anzeige vor Training und im bestehenden Saisonrückblick. In historischen Saisons ohne Zielfeld wird kein Ergebnis erfunden.

Inhalte: neue Abschlussvarianten `bu_3_kontrolle`, `bu_3_ohne`, `kn_3_behandelt`, `kn_3_pausiert`; vorhandene Abschlusskennungen/Optionen bleiben für alte Speicherstände bestehen. `videoKontakt` hält den Namen aus dem gespeicherten Ereigniskontext und den Saisonabstand fest; `video_kontakt` kann frühestens zwei Saisons später erscheinen. Keine erhöhte Ereignisfrequenz.

Validierung: `npm ci`, `npm test` (83/83, inklusive Claudes Wächter), Produktionsbuild und Capacitor-Synchronisierung. Neue Tests prüfen alle Vorsätze, knappe Zielverfehlung, Spielerwertgrenzen, wiederholtes Prüfen nach JSON-Laden, Daheim-Bruch, echte Abschlusswertung, Saisonziele und alte/neue Geschichtskennungen. Visuelle Android-Prüfung und echte App-Neustarts mit erreichtem Vorsatz bleiben offen.

Hinweis zu Claudes offener Beobachtung (8 statt 13 Saisons): Die 35.174-Runde änderte auch den Ereigniskatalog und damit den Verbrauch des festen Zufallsstroms. Aus derselben Startzahl allein lässt sich deshalb keine Ursache für einzelne kürzere Laufbahnen ableiten. Die Fünf-Saisons-Regel betrifft den Abschlussfortschritt; ihre Grenze wird gezielt getestet. Keine kausale Diagnose der kürzesten Laufbahn behauptet.

Langzeitlauf des gemeinsamen Stands am 15.09.2026: `node tools/langzeit.cjs`, 192 Karrieren mit allen sechs Vorsätzen, 4.494 Saisons, 7.852 Ereignisse, 447 Kennungen; alle Ablauf-/Zahlenprüfungen bestanden. Laufbahn-VC Median 83, Spanne 22–279; unveränderte Packstichprobe. Gerätetest ersetzt das nicht.


## 15.09.2026 — 35.176.0: Prüfung und persönliche Karrieregeschichten (Codex)
Basis: main fa3b395 (35.175 inklusive Claudes Werkzeugrunde). Vor Beginn abgerufen;
keine neueren Änderungen. Claudes Anker und Dokumentationsregeln erhalten.

Prüfung vor Inhaltsänderung: 192 Karrieren, 7.852 Ereignisse, darunter 77
Wiederholungen innerhalb derselben Karriere (0,98 %). Zielbewusster Vergleich:
heimische Sommerangebote für Daheim bevorzugt, Abschlussoptionen für Beruf.
Daheim steigt von 0/32 auf 15/32 (46,9 %). Welt 30/32, Lange 32/32,
Glanz 8/32, Beruf 11/32, Einsatz 30/32. Das sind feste Strategien und Seeds,
keine menschlichen Erfolgswahrscheinlichkeiten; Vorsatzzuweisung ist nicht
vollfaktoriell über Position, Modus, Auswahl und Geschlecht. Daher keine
Belohnungsanpassung aus diesen Zahlen. Im Vergleichslauf in allen fünf
Karrierephasen keine Saison ohne Ereignis, im Mittel 1,73–1,75 Ereignisse
(enthält Schnellmodus). Ereignismenge misst keine subjektive Spannung.

Neue Inhalte: bildung_spaet_start / bildung_spaet_ende bilden einen optionalen
Zweiteiler mit zwei wirklich verstrichenen Saisons. Abbruch und vorhandener
Abschluss sperren die Fortsetzung. video_abschied braucht den gespeicherten
Kontakt, Alter 34 und zwei Saisons Abstand zu video_kontakt. Neue IDs;
keine historischen Auswahl-IDs geändert. Keine zusätzlichen Ereignisplätze.

karrieregeschichten.js liefert bis zu vier kurze Rückblickabsätze aus Vorsatz,
Kontakt, mentorSpur und abgeschlossenem Buchzweig. evLog allein ist KEIN
Beweis für eine Wahl, da auch übersprungene Ereignisse dort stehen. Neue
Mentorflagge wird erst bei tatsächlicher Auswahl gesetzt. Kein neuer Dialog.

86 Tests bestanden, Produktionsbuild erfolgreich. Neue Regressionen prüfen
Bildungswartezeit/Abbruch, Mentorbedingungen und belegte Erinnerungen nach
JSON-Rundreise. Android-Darstellung bleibt im Gerätetest zu prüfen.
Offen: subjektive Wiederholung, positionsweise Vorsatzbalance in einer
vollfaktoriellen Stichprobe; bestehende ältere Bildungsereignisse fassen
mehrjährige Ausbildung teils weiterhin in einem Ereignis zusammen.

Abschließender Lauf der neuen Inhalte: 192 Karrieren, 4.505 Saisons,
7.860 Ereignisse, 449 verschiedene IDs, 77 Wiederholungen. Keine Saison
ohne Ereignis in den ausgewerteten Phasen. Beruf 15/32 (46,9 %), Glanz
6/32 (18,8 %); alle anderen obigen Quoten gleich. Ein veränderter Katalog
ändert den Zufallsverbrauch; Differenzen sind kein isolierter Wirksamkeitsnachweis.


## Aufräumrunde Dokumentation, 15.09.2026 (Claude, ohne Versionswechsel)

Basis: `main` 0426852 (35.176.0), vor Beginn abgerufen, keine neueren Änderungen.
Ausschließlich Dokumentation — kein Quellcode, keine Tests, keine Spielinhalte
angefasst. Version bleibt 35.176.0, kein neuer versionCode, kein
CHANGELOG-Eintrag (dort steht, was Spielende merken).

- **`CHANGELOG.md` strukturell repariert.** Der Abschnitt 35.176.0 stand über der
  Dokumentüberschrift `# Änderungen`; der Titel saß dadurch mitten im Dokument,
  zwischen 35.176.0 und 35.175.0. Jetzt wieder: eine H1 ganz oben, darunter alle
  Versionen als H2 in absteigender Reihenfolge. 35.176.0 hat außerdem ein
  Stichwort bekommen wie alle anderen Einträge auch — übernommen aus dem
  Commit-Betreff und der Abschnittsüberschrift in dieser Datei, nicht neu
  erfunden. Am Wortlaut der Einträge selbst wurde nichts geändert.

- **Versionsnummer aus dem Titel dieser Datei entfernt.** Sie stand auf
  35.174.0, während das Projekt bei 35.176.0 war. Jeder Abschnitt trägt seine
  eigene Version; eine zweite im Titel kann nur veralten.

- **Feste Testzahlen aus `ENTWICKLUNG.md` und `README.md` entfernt.** Die Zahl im
  Abschnitt „Regressionen" war dreimal hintereinander überholt — 62, dann 71,
  dann 86, und im Dokument blieb jedes Mal die alte stehen. Maßgeblich ist
  jetzt die Ausgabe des Laufs (`# pass`). Die Aufstellung darunter bleibt als
  Übersicht über den geprüften Umfang erhalten und ist als solche gekennzeichnet.
  Die historische Angabe „62/62" ist als Stand 35.172.0 markiert, statt als
  aktueller Nachweis gelesen zu werden.

Geprüft: `npm test` und `npm run build` nach der Änderung erneut durchlaufen,
beide unverändert erfolgreich — erwartbar, weil keine Datei angefasst wurde, die
in den Build oder in die Tests eingeht. Der Nachweis dient nur dem Ausschluss
eines Versehens.


## Übergaberegel für alle Beteiligten, 15.09.2026 (Claude, ohne Versionswechsel)

Basis: `main` 0426852. Wieder ausschließlich Dokumentation, kein Quellcode.

Anlass: Die Aufräumrunde davor lag fertig auf einem Branch, während `main`
unverändert weiterlief. Wer aus `main` heraus die nächste Runde begonnen hätte,
hätte die reparierte CHANGELOG-Struktur nicht gesehen — und den nächsten
Versionseintrag vermutlich wieder über der Dokumentüberschrift eingefügt, also
genau den Fehler reproduziert, den die Korrektur verhindern soll. Das ist kein
Einzelfall, sondern die Regel bei drei Beteiligten, die einander nicht sehen.

Umgesetzt als Regel 6 in `README.md` samt neuem Abschnitt „Offene Übergaben
finden". Der Kern: **die Übergabeliste pflegt niemand von Hand.**

    git fetch --all --prune
    git branch -r --no-merged origin/main

Jeder gelistete Branch trägt Arbeit, die noch nicht in `main` ist; erledigte
verschwinden von selbst, sobald ihre Commits dort stehen. Am 15.09.2026
geprüft: die Ausgabe nennt genau `origin/claude/elegant-cray-29rcm8` und
übergeht `origin/test/save-resume-regressions` korrekt, weil dessen Commit
längst in `main` liegt. Eine handgeführte Liste hätte denselben Alterungsfehler
wie die Testzahlen davor.

Damit es die automatisierten Beteiligten beim Start erreicht, steht der Ablauf
zusätzlich in `AGENTS.md` (der Datei, die Codex als Projektanweisung liest) und
`CLAUDE.md` (dieselbe Rolle für Claude Code). Beide sind bewusst kurze
Wegweiser auf `README.md` und wiederholen die Regeln nicht — sonst gäbe es drei
Fassungen, die auseinanderlaufen. Ob ein fremdes Werkzeug seine Anweisungsdatei
tatsächlich liest, lässt sich von hier aus nicht nachweisen; belegt ist nur,
dass die README-Konventionen in den Runden 35.175/35.176 übernommen und sogar
erweitert wurden.

Verbindlich ist auch der Umkehrfall: Wer eine gefundene Übergabe bewusst nicht
mitnimmt, schreibt den Grund hierher. Stillschweigendes Übergehen ist der eine
Fall, den die Regel verhindern soll.

Geprüft: `npm test` und `npm run build` erneut durchlaufen, Produktionsbündel
prüfsummengleich. Dokumentation ändert daran nichts — der Lauf schließt nur ein
Versehen aus.


## Rollen und Abnahme, 15.09.2026 (Claude, ohne Versionswechsel)

Basis: `main` 0426852. Ausschließlich Dokumentation, kein Quellcode.

Entscheidung des Eigentümers: Claude entwickelt zu, **Codex nimmt ab.** Claudes
Arbeit geht nicht direkt nach `main`, sondern wird von Codex geprüft und
entschieden. Codex' eigene Runden gehen weiterhin direkt nach `main`; die
Abnahme gilt nur in eine Richtung. Der Eigentümer hat in allem das letzte Wort.

Das ersetzt die Übergaberegel von heute Vormittag, statt sie zu ergänzen: dort
hieß es „gefundene Arbeit wird übernommen", was keine Ablehnung kannte. Jetzt
sind drei Ausgänge vorgesehen — übernehmen, mit Änderungswünschen zurückgeben,
ablehnen —, alle drei mit Begründung. Nicht vorgesehen ist der vierte:
kommentarlos liegen lassen. Die Begründung ist dabei die eigentliche
Information; ohne sie legt Claude denselben Vorschlag in der nächsten Runde
wieder vor.

Umgesetzt in `README.md` („Rollen und Abnahme", Regel 6 umformuliert),
`AGENTS.md` (Codex' Abnahmeliste und die drei Ausgänge) und `CLAUDE.md`
(Claudes Pflichten: eigener Branch, kein Selbst-Zusammenführen auch bei grünen
Prüfungen, Abnahme vorlegen, Entscheidung nicht neu verhandeln). Die beiden
Agentendateien bleiben kurze Verweise auf `README.md`.

Der Befehl aus „Offene Übergaben finden" bleibt unverändert und bekommt nur
eine zweite Lesart: für Codex ist die Ausgabe die Abnahmeliste, für Claude die
Kontrolle, ob eigene Arbeit noch hängt.

Nicht nachweisbar von hier aus: ob Codex seine Anweisungsdatei liest und die
Rolle annimmt. Was technisch erzwingbar wäre — ein Branch-Schutz auf `main` mit
Pflichtprüfung —, ist bewusst nicht eingerichtet; er würde auch Codex und den
Eigentümer binden. Vorerst gilt die Vereinbarung, nicht der Zwang.

Offen zur Abnahme liegen damit drei Commits auf `claude/elegant-cray-29rcm8`:
`c824e34` (Dokumentation aufräumen), `8eb858b` (Übergaberegel) und dieser.

Geprüft: `npm test` 86/86, `npm run build` erfolgreich, Produktionsbündel
prüfsummengleich. Dokumentation ändert daran nichts; der Lauf schließt nur ein
Versehen aus.


## Fehlerbehebung 35.177.0 — Karriereende stürzte ab (Claude, 15.09.2026)

Basis: `main` 0426852 (35.176.0), auf `claude/elegant-cray-29rcm8` aufgesetzt.

**Befund aus dem Gerätetest.** Ein Mitspieler des Eigentümers beendete seine
Laufbahn über die Rücktrittsfrage („Wie lange noch?" → „Schluss machen") und
bekam statt der Bilanz den Fehlerbildschirm mit `s is not defined`. Die
Meldung stammt aus dem ausgelieferten Bündel `index-DJDCFSJK.js`, also aus
35.176.0.

**Ursache.** In `KarriereRueckblick` (App.jsx, Seite „Auf dem Platz") stand
seit 35.175.0 die Zeile `{s.saisonZiel && …}`. Die Komponente bekommt aber nur
`{ p, onFertig }` — ein `s` gibt es dort nicht. Die Seiten dieses Rückblicks
werden gebaut, bevor die erste erscheint; das JSX wird also sofort ausgewertet
und wirft beim Bau, nicht erst beim Anzeigen.

**Reichweite — größer als der gemeldete Fall.** `finish()` setzt
`setKarriereRueck(...)` bei *jedem* Karriereende (App.jsx:18034). Der
vorzeitige Rücktritt war nur der Weg, den der Tester genommen hat. Nachgestellt
mit 3, 5 und 12 Saisons: alle drei stürzen ab. Es entkommt nur, wer die Laufbahn
ohne einen einzigen Pflichtspiel-Einsatz beendet, weil die Seite dann unter
`p.tot.apps > 0` entfällt. Praktisch heißt das: in 35.175.0 und 35.176.0 war
das Karriereende nicht erreichbar.

**Behebung.** Die Zeile ist aus `KarriereRueckblick` entfernt und steht jetzt
im `SaisonRueckblick`, der `s` als Saison führt — dort, wo CHANGELOG 35.175.0
sie ohnehin zusagt („Ergebnis im bestehenden Saisonrückblick"). Wortlaut und
Auszeichnung des Autors sind unverändert übernommen; die Textfassung ist
bewusst nicht angefasst worden, das wäre eine Produktentscheidung.

**Warum keine der 86 Prüfungen das gefunden hat.** `runFinish` prüft den
Abschluss-*Handler*, der Langzeitlauf ersetzt die Oberfläche vollständig. Den
Rückblick hat schlicht nie etwas gezeichnet. Zwei neue Regressionen schließen
die Lücke: Karriererückblick für 1/3/5/12 Saisons und ohne Pflichtspiele,
Saisonrückblick mit erfülltem, verfehltem und fehlendem Saisonziel. Gegenprobe
gemacht — der Fehler testweise wieder eingebaut, `npm test` wurde rot, danach
`App.jsx` prüfsummengleich zurückgestellt.

Geprüft: 88/88 Regressionen, Produktionsbuild erfolgreich. Version auf 35.177.0,
versionCode 3517700 über `tools/android-version.cjs`, alle drei Versionsfelder
konsistent.

**Für die Abnahme, zwei bewusste Entscheidungen zum Widersprechen:**

1. *Das Saisonziel wurde verschoben, nicht gelöscht.* Die kleinstmögliche
   Behebung wäre gewesen, die Zeile ersatzlos zu streichen — dann fehlte aber
   eine Zusage aus CHANGELOG 35.175.0. Wer das anders sieht, streicht sie; die
   Regression dazu müsste dann mit.
2. *Die Version wurde auf 35.177.0 erhöht.* Das ist ein ausgelieferter
   Absturz, der eine neue APK braucht. Soll die Behebung stattdessen in eine
   größere Runde einfließen, ist die Nummer frei wählbar — dann sind
   `package.json`, `App.jsx` (`VERSION`), `android/app/build.gradle` und der
   CHANGELOG-Kopf gemeinsam anzupassen.

Offen: Der Gerätetest dieser Behebung steht aus. Die Prüfungen zeichnen mit
`renderToStaticMarkup` und ersetzen keine Sicht auf dem Gerät — insbesondere
nicht das Weitertippen durch die Rückblickseiten.


## 15.09.2026 — 35.178.0: Vorsatzvergleich und zeitliche Konsistenz (Codex)
Basis main 0426852 (35.176). Vor Beginn keine neuen Remote-Commits.

Vollständige Kombinationen: 1.152 Karrieren / 27.214 Saisons / 47.534
Ereignisse auf 35.176; alle acht Positionen, beide Geschlechter, drei Modi,
vier Strategien und sechs Vorsätze. Pro Vorsatz 192 Karrieren.
Erfüllung: Welt 93,8 %, Daheim 68,8 %, Lange 100 %, Glanz 31,3 %, Beruf
33,3 %, Einsatz 95,8 %. Glanz positionsweise 20,8–41,7 % (24 Läufe je
Position); nach Modus 46,9 / 25 / 21,9 %. Beruf m 24 %, w 42,7 %.
Feste Wahl-/Transferstrategie, vier Nationen und unterschiedliche Seeds;
keine repräsentativen Spielerquoten oder isolierten Kausalvergleiche.
Deshalb bleiben Punkte und Schwellen unverändert.

Bestätigt: vollständig wirkungslose Belohnungen bei Welt 8, Lange 4,
Glanz 26 (von 60 erfüllten Glanz-Vorsätzen). Neu: nur wenn sämtliche
berechneten Deltas null sind, einmalig 25.000 € Karrieregeld. Betrag ist
eine Designentscheidung (halbe Berufsprämie), keine empirische Kalibrierung.
Keine VC. Bestehende Belege bekommen keine rückwirkende Ersatzprämie.
Anzeige nutzt jetzt wirkliche Deltas aus dem gespeicherten Beleg. Auch
Wertgrenzen und Ersatzprämie werden vorab erläutert.

Bestätigt: ew_ausbildung.1 vergab Abschluss sofort bei Text „vier Jahre“;
Option .0 behauptete ebenfalls einen Abschluss ohne entsprechende Flagge.
IDs bleiben bestehen, beide Einschreibewege beginnen jetzt den Strang
studium. Neue Fortsetzung ew_studienabschluss erst vier Saisons später.
Absage schließt den Strang ohne Abschluss. Bereits erhaltene Abschlüsse
werden nicht entfernt. Bereits geladene alte Auswahlen behalten ihre IDs,
werden bei Entscheidung nach den aktuellen Einschreiberegeln behandelt.
Laufender Studienweg verhindert parallelen späten Bildungskurs. Beim
Berufsvorsatz steht Lernzeit bzw. ausstehende Abschlussentscheidung.

spaete_prioritaet nutzt vorhandene Form-/Fitness-/Vertrauenswerte und
behauptet weder garantierten Stammplatz noch fest zugesagten Transfer.
Kein zusätzlicher Ereignisplatz. Bestehende Folgenanzeige von applyFx
bleibt erhalten; keine spekulative Erklärung für Vertragsangebote ergänzt.

90 Tests: neue Prüfungen für vierjährige Wartezeit/Abbruch, gespeicherte
Abschlüsse, tatsächliche Deltas, einmalige Ersatzprämie und Lernanzeige.
Offen für Gerätetest: Verständlichkeit/Lesbarkeit der ergänzten Hinweise,
subjektiver Wert der Ersatzprämie, späte Karriereentscheidung.


### Abgleich und Abnahme vor Veröffentlichung (Codex, 15.09.2026)
Während der Runde main bis e67b19daaec7bb4bf263db288b68c8e2951a012c
weitergelaufen. Enthält vom Eigentümer freigegebene Claude-Arbeit:
93a6660 (Dokumentation), 2b6b7d7 (Übergaberegel), b876c8a (Rollen),
e67b19d (Absturz Karriereende). Alle vier geprüft und übernommen.
Claude-Branch 771a6c6f04f404af59d11c14dbd9acb84821e0de ist baumgleich
mit diesem main, aber hat andere Commit-IDs. Wird als weiterer Elterncommit
integriert; dadurch verschwindet die bereits abgenommene Übergabe aus
`--no-merged`. Keine Produktänderung allein durch diesen Elterncommit.

Abnahme: Saisonziel gehört in SaisonRueckblick; Verschiebung und Hotfixversion
35.177 sind richtig. Rendering-Testlücke bestand in Codex' voriger Runde.
Neue Runde deshalb 35.178.0. Konflikte: VERSION_INFO zusammengeführt,
CHANGELOG-Hauptüberschrift und historische Versionen erhalten, Entwicklungs-
vermerke beider Seiten bewahrt; README ohne veraltende Testzahl; beide
angehängten Testgruppen erhalten. App-ID und Signierkonfiguration unverändert.

Gemeinsamer Stand: 92 Tests bestanden, einschließlich beider tatsächlicher
Rückblick-Renderings. Frühere Angabe 90 bezog sich auf Codex' Stand vor Merge.

Langzeitlauf nach Zusammenführung: 192 Karrieren, 4.502 Saisons, 7.858
Ereignisse, ohne Prüfungsfehler. Web-Build und Capacitor-Synchronisierung
erfolgreich. Geräteprüfung bleibt offen.


## 15.09.2026 — 35.179.0: Rendering-Absicherung und späte Karriere (Codex)
Basis main 5dd76aa357888dcae501b2f2627709524e0dbb30, vor Beginn remote
geprüft; keine offenen Branches. Claudes Hotfix und Rückblicktests erhalten.

Echte React-Komponenten via renderToStaticMarkup, ohne Komponenten-Mocks:
EndScreen nach produktivem finish mit 0/3/15 Saisons, mit/ohne Vorsatz;
VereinScreen mit produktiv gegründetem Verein und leerem Kader;
Packladen im Laden- und Sammlungsreiter, leer sowie mit produktiv gezogenen
und zusammengeführten Karten. Die Assertions prüfen relevante Inhalte.
Kein zusätzlicher Produktfehler in diesen Ansichten gefunden. Ein fehlerhaft
angenommener Rückgabewert im neuen Test wurde nach Lesen von karten.js
korrigiert; kein Fehler im Packladen. Grenzen: keine Klicks, Effekte oder
Animationen ausgeführt; keine vollständige Abdeckung aller Vereinsreiter,
Dialoge, Kaderzustände oder Packöffnungsphasen. Dafür bleibt der Gerätetest.

README erklärt den Fehlalarm nach Rebase/Squash, AGENTS verweist darauf.
Vor Branchbereinigung immer neue Branch-Arbeit ausschließen; keine pauschale
Löschung und keine Force-Pushes. Bereits erfolgte Abnahme 35.178 unverändert.

Inhalt: spaete_prioritaet startet den Zweiteiler spaet. Drei neue IDs
spaet_einsatz / spaet_begleiten / spaet_kraefte folgen ausschließlich der
wirklichen Wahl mit einer Saison Abstand. Keine zusätzlichen Ereignisplätze.
Die Einsatzgeschichte nennt echte letzte Saisonspiele; keine Behauptung,
dass Trainer oder Verein unverändert geblieben seien. Alle alten Auswahl-IDs
bleiben. Historisch nur in evLog vermerkte Ereignisse lösen KEINE rückwirkend
erfundene Fortsetzung aus. Persönlicher Abschluss erinnert an belegte Priorität.

96 Tests bestanden, einschließlich Zweig-/Wartezeit-/Speicherrundreise und
historischem Zustand ohne bekannte Wahl. Versionsnummer 35.179.0 / 3517900;
App-ID, Signierung, Vorsatzprämien und Freischaltungsschwellen unverändert.
Offen: Darstellung und Bedienung auf Android, subjektive Wirkung der
Fortsetzungen und weniger häufige Oberflächenzustände.

Abschließender Langzeitlauf: 192 Karrieren, 4.504 Saisons, 7.863 Ereignisse,
ohne Prüfungsfehler. Web-Build und Capacitor-Synchronisierung erfolgreich.
main unmittelbar vor Veröffentlichung unverändert bei 5dd76aa.


## 15.09.2026 — 35.180.0: Charakterporträts (Codex)
Basis main fccac8f1f4f5537d9496eaba049c5fa51371a6da, Remote/Übergaben vor
Beginn abgerufen, keine offenen Branches. Schwerpunkt CreateScreen und Avatar.

Neue Figuren speichern zuege.stil=2. Weicheres Gesichtlicht und kleinere
Augenproportionen nur für diesen Stil. Alte Figuren ohne stil=2 behalten
Formen, Farben und Darstellung; Basisgenerator und Merkmalsreihenfolge bleiben
unverändert. Editorpaletten getrennt erweitert, damit Zufallskennungen alter
Porträts nicht durch neue Palettenlängen verändert werden.

Galerie: 164px Vorschau statt 86px; bei geschlossener Anpassung kompakt.
Anklickbare Varianten mit Auswahlmarkierung/aria-pressed, benannte Farbflächen,
Merkmalskategorien und Festhalten beim Würfeln. Vorschau nicht mehr sticky,
damit sie auf schmalen Geräten nicht den gesamten sichtbaren Bereich besetzt.
Farben unabhängig von Nationalität. 14 Haut-/13 Haarfarben. Neu vier Frisuren
je Geschlecht (m16–19/w14–17), Bärte10–12, details0–4. Frühere freischaltbare
Frisuren behalten ihre Sperren. Make-up war vorhanden, jetzt direkt sichtbar.
Geschlechtswechsel setzt nicht verfügbare Varianten zurück; ein Festhalten
kann eine im neuen Geschlecht nicht vorhandene Variante nicht verfügbar machen.

React.useId trennt SVG-Clip-/Gradienten-IDs zwischen Galeriekacheln, die dieselbe
Spielerkennung besitzen. Sonst würden Elemente nach dem ersten Porträt clippen.
Neue reine Funktionen in portraet.js; Auswahlwerte werden im bestehenden
zuege-Objekt gespeichert. Festhalten ist eine Editorpräferenz dieser Sitzung.

101 Tests: neue Rendererprüfungen für CreateScreen/acht neue Porträts und
SVG-Referenzen, Optionen/Freischaltungen, Würfelgrenzen und gesperrte Merkmale
mit JSON-Rundreise. Bestehende Karriere-/Rückblicktests bleiben erhalten.
Produktive SVGs für zwölf unterschiedliche Porträts mit Sharp gerastert und
visuell geprüft. Kein Chromium installiert: interaktive Touch-/Scrollprüfung
und Darstellung auf Android bleiben offen. Die Sichtprobe ersetzt diese nicht.
App-ID, Signierung und Spiellogik/Belohnungen unverändert.

Zusätzliche Altporträt-Gegenprobe: acht m/w-Kennungen gegen 35.179,
SVG nach Normalisierung der technischen IDs zeichengleich. Produktionsbuild
und Capacitor-Synchronisierung erfolgreich. main vor Veröffentlichung
unverändert bei fccac8f. Keine Simulation nötig: reine Porträt-/Editorrunde.
