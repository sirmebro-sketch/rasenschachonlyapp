## 23.09.2026 · Astra · 35.195.1 · Kartenflächen nach Nutzerfeedback

Basis `095da80`. Kevin beanstandet die dunklen Ausschnitte auf Gold-/Legendärkarten
und nennt Bronze als Vorbild. Die bei 35.195.0 eingeführten Informationskästen
sind entfernt. Die Spielerkarte begrenzt stattdessen die Folie auf 16 % Deckkraft;
helle Sekundärtexte bleiben erhalten. Sammlung und große Karten nutzen dieselbe
durchgehende Fläche. Die Galerie enthält zusätzlich kompakte Ruhmeshallenkarten
mit drei Auszeichnungen, damit dieser Fall künftig direkt sichtbar ist.

Geprüft: 236 Regressionen bestanden, Produktionsbuild und Capacitor-Sync erfolgreich.
Mobile Sichtprobe bei 390 und 320 px, Gold/Legendär mit drei Auszeichnungen.
Android-Geräteprüfung steht aus; die Browseransicht ist keine Geräteemulation.

## 23.09.2026 · Astra · 35.195.0 · gemeinsame Abnahme

Basis `703d377`; 26 offene PRs in einem Integrationsstand zusammengeführt und nachgebessert.
Entscheidung je PR mit Head, Korrekturen, Prüfungen, historische Branches und offene
Android-Grenzen: [Gesamtabnahme](pruefberichte/2026-09-23-astra-gesamt-abnahme.md).
Die kombinierte Browser-CI und Veröffentlichung werden dort nachgetragen.

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

## 35.181.0 – Kartenmaterial, Codex, 15.09.2026

Basis 095fb762 (35.180.0); Remote vor Veröffentlichung erneut geprüft,
keine offenen Übergaben und main unverändert. Die unterbrochene Arbeitsrunde
hatte keine Änderungen hinterlassen.

Befund: flächige Holo-/Jubelüberlagerungen konnten Text und Porträts aufhellen.
Der rechteckige Packeffekt entsprach nicht der gezackten Packkontur.
Gemeinsame SVG-Materialkante in karteneffekte.jsx ersetzt diese Überlagerungen
an Wildcard, Aufdeckung, Spielerkarte, Kaderkarte und Pack. Drei Konturen,
keine Füllung, eindeutige Gradientreferenzen; nur dezente Lichtopazität animiert.
Breiter Jubelstreifen entfällt. Reduzierte Bewegung bleibt berücksichtigt.
Historische CSS-Begründungen bleiben erhalten, die alten Flächeneffekte werden
an diesen Stellen nicht mehr eingesetzt.

102 Tests erfolgreich, einschließlich SVG-Referenzen und ungefüllter Konturen;
Produktionsbuild und Capacitor-Synchronisierung erfolgreich. Drei produktive
SVG-Konturen mit Sharp in Kartenformaten gerastert und visuell geprüft;
mittlere Inhaltsflächen zusätzlich auf transparente Pixel geprüft. Kein
Chromium vorhanden: Prüfung kompletter animierter Ansichten/Touch auf Android
bleibt offen. Bitte Gold-/Legendenkarte, Wildcardaufdeckung und Packöffnung
auf dem Gerät ansehen. Keine Änderung an Spielständen, Belohnungen, App-ID
oder bestehender Release-Signatur. Version 35.181.0 / 3518100.

Fortsetzung am 15.09.2026: Die vorbereiteten, bereits gestagten Änderungen
wiedergefunden und erhalten. Remote erfolgreich aktualisiert: main weiterhin
095fb762, keine nicht integrierten Remote-Branches. Alle 102 Tests, Web-Build
und Capacitor-Synchronisierung erneut erfolgreich. Vorhandene Kontur-Bildtafel
erneut angesehen; kein Ersatz für die weiterhin offene Android-Sichtprüfung.
Versionshinweis im Spiel auf die Kartenrunde aktualisiert.

## 15.09.2026 – Arbeitsbasis und fortlaufende Freigabe

Eigentümer autorisiert Upload von 4cc06f4, APK-Build sowie zukünftigen lesenden
und schreibenden Repository-Zugriff. Freigabe in README festgehalten.
Vor Upload Remote aktualisiert: origin/main bei 095fb762 (35.180.0), keine
nicht integrierten Remote-Branches, keine offenen Pull Requests.

Arbeitsbasis: React/Vite mit Capacitor Android, App-ID de.rasenschach.xi.
35.178 korrigiert Vorsätze/Studienverlauf, 35.179 vertieft späte Entscheidungen,
35.180 erweitert Porträts und Editor; 35.181 bearbeitet Kartenmaterial.
Alte angehängte Prüfstandsdateien (u. a. Anleitung 35.98) sind historische
Unterlagen, keine Basis zum Überschreiben des aktuellen Repositorys.

Nächste Schritte: Android-Sichtprüfung der Charaktergalerie, Karten und Packs;
danach anhand konkreter Rückmeldungen Optik/Individualisierung nachbessern und
die inhaltliche Vertiefung fortsetzen. Animierte Gesamtansichten und Touch
sind durch die bisherigen Renderer-/Konturtests nicht abgedeckt.
Je Runde Remote und Claude-Übergaben prüfen, Änderungen gezielt testen,
Web-Build ausführen und bei App-Änderungen APK-Workflow bis zum Ergebnis prüfen.
Spielstandskennungen, Altporträts und Release-Signatur erhalten.

## 15.09.2026 – Einstieg für zukünftige Chats (Dokumentation)

Auf ausdrücklichen Wunsch des Eigentümers START-NEUER-CHAT.md erstellt und in
AGENTS.md sowie README.md verlinkt. Nutzerfreigabe in README mit Originalwortlaut
belegt. Einstieg trennt Autorisierung von technisch verfügbarem Zugriff,
erklärt Shell-/GitHub-Anbindung, Remote-Abgleich, Rollen und Buildkontrolle.
Ausgangsstand und offene Android-Prüfungen ausdrücklich datiert statt als
dauerhaft aktuellen Status dargestellt. Keine Code-, Versions- oder APK-Änderung.

## 35.182.0 – Sichtbare Sammelfolie, Codex, 15.09.2026

Basis 371e10f, keine offenen PRs oder nicht integrierten Remote-Branches.
Kevins Gerätetest zeigt: 35.181 ist zu dezent, die inset-Kontur wirkt auf
breiten Spielerkarten wie ein ungewollter zweiter Rahmen. Er möchte sichtbare
Animation und eine stärkere Seltenheitswirkung. Kontur deshalb durch bewegte
Gold-/Holografiefolie ersetzt, legendär mit stärkerem Farbwechsel und kürzerem
Lichtzyklus. Keine umlaufende Innenlinie mehr. SVG wird auf die jeweilige
Karten-/Packform zugeschnitten; eigener isolierter Stapel legt Kartenfolie
unter Inhalte. Packfolie maskiert Ball und Text aus. Animationszyklen blenden
außerhalb der Fläche um; Bewegungseinstellungen bleiben berücksichtigt.

102 Tests bestanden, Web-Build und Capacitor-Sync erfolgreich; SVG-Referenzen,
Packmaskierung und Ebenenvertrag geprüft. Remote vor Veröffentlichung erneut
unverändert. Keine Spielregel- oder Speicheränderung. Browserinstallation in
 dieser Umgebung nicht verfügbar: bewegte Gesamtansicht und Lesbarkeit auf
Android noch offen, insbesondere Gold/Legende, Wildcardaufdeckung und Packs.
Die Gestaltung ist implementiert, aber nicht als visuell abgenommen bezeichnet.

## 35.183.0 – Doppelten Wildcard-Glanz entfernt, Codex, 15.09.2026

Basis e59a807 (35.182.0); keine offenen PRs oder nicht integrierten Branches.
Kevins Gerätetest bestätigt die verbesserte Folie, meldet aber zwei Glanzzüge
auf seltenen Wildcards. Ursache: WildcardEnthuellung renderte ab pomp .8
KartenEffekt und zusätzlich ab pomp .5 den alten rs-band auf derselben
Vorderseite. Letzterer überlagerte weiter den Inhalt im 1,5-Sekunden-Takt.
Vorderseite jetzt ausschließlich KartenEffekt ab pomp .5, kräftig ab .8.
Der alte Streifen bleibt nur auf der verdeckten Rückseite; die dauerhafte
Wildcard, Spieler- und Packfolie aus 35.182 bleiben erhalten.

103 Tests bestanden, darunter Renderer-Gegenprobe aller sechs regulären
Seltenheiten auf genau eine beziehungsweise keine Folie und nur einen alten
Streifen auf der Rückseite. Web-Build und Capacitor-Sync erfolgreich.
Android-Version 35.183.0 / 3518300. Keine Regeln oder Spielstände geändert.
Animierte Geräteprüfung bleibt offen; kein Browser-/Android-Sichttest behauptet.

## 35.184.0 – Kompakte Charaktervorschau, Codex, 15.09.2026

Basis c8e4077; keine offenen PRs oder nicht integrierten Remote-Branches.
Auf Kevins Wunsch startet CreateScreen mit geschlossenen Feinheiten.
Würfeln/Feinheiten sind zwei gleich gestaltete Grid-Spalten; die Beschriftung
Würfeln behält den vollständigen zugänglichen Namen „Freie Merkmale würfeln“.
Positionskürzel, Fuß und Nr. stehen ohne Umbruch unter dem Namen. Name und
Verein ebenfalls einzeilig mit Ellipse bei Platzmangel; Vereinszeile bleibt
reserviert. Im kompakten Modus kein Wrap zwischen Avatar und Angaben.
Feinheiten lassen sich weiterhin öffnen, einschließlich großer Vorschau;
aria-expanded und aria-controls bilden den Zustand ab.

103 Tests, Web-Build und Capacitor-Sync erfolgreich. Bestehende Renderprüfung
an den ausdrücklich gewünschten geschlossenen Startzustand angepasst.
Android-Sichtprüfung, besonders schmale Anzeige und große Schrift, bleibt offen.
Version 35.184.0 / 3518400; keine Änderungen an Spielständen oder Spielregeln.

## 35.185.0 – Aufdeckungen und Haarformen, Codex, 16.09.2026

Basis bd3fbd2 (35.184); keine offenen PRs oder nicht integrierten Branches.
Wildcards erhalten eine größere Bühne (bis 380 × 250 px), größere Wirkungs-
schrift und einen kurzen Lichtakzent ab selten. Höchste Stufen mit vier statt
zwei Sternakzenten und stärkerem Lichtbett. Kein zusätzlicher Folienzug.
Vollbildblitz, Dauerkonfetti, Dauerschweben und Funken der Wildcard entfernt;
Aufdeckzeitplan und Abschlussbedienung erhalten. Gold/Legenden-Spielerkarten
bekommen denselben kurzen Akzent im Hintergrund und einen sanfteren Auftritt.
Reduzierte Bewegung wird berücksichtigt. Animationen noch nicht visuell geprüft.

Moderner Haar-Renderer separat in haarformen.jsx; Front- und Hinterhaar mit
zusammenhängenden Silhouetten und kopfbreitenabhängiger Skalierung. Keine
versetzten Kappenduplikate oder hart abgeschnittenen Strukturstreifen mehr.
Alle bestehenden Bonusfrisuren einbezogen; deren Kennungen und Zugang bleiben.
Zwei neue Formen je Auswahl (m20/21, w18/19), alte Zusatzformen unverändert
adressierbar. 32 Altporträts ohne stil:2 gegen Basis zeichengleich gerendert.

104 Tests bestanden; Freischaltungsprüfung erweitert. Web-Build und Capacitor-
Sync erfolgreich. Echte Avatar-SVGs mit Sharp gerastert und Bildbögen für Oval,
Schmal und Vollmond angesehen, einschließlich aller freischaltbaren Formen.
Dabei flachen Schnitt nachkorrigiert (Kopfhaut oberhalb Haarfläche sichtbar).
Keine vollständige Prüfung jeder Haar-/Hautfarbkombination behauptet.

Visueller Arbeitsweg: tools/visuelle-vorschau.cjs erzeugt isolierte Einzel-HTML
mit echten Komponenten; tools/portraet-bogen.cjs erzeugt PNG-Bögen. README enthält
Bedienung. Cloud-Browser verbunden, aber localhost und Datei-URLs ausdrücklich
blockiert; keine Umgehung. Daher kein Live-/Touch-/Animationstest. Nutzer kann
weiter Android-Screenshots liefern; Aufdeck-Timing und Landschaftsmodus bleiben
als Geräteprüfung offen. Version 35.185.0 / 3518500.

## 35.186.0 – Charaktermerkmale und echter Browserzugriff, Codex, 16.09.2026

Basis main 950e0ed (35.185), keine offenen PRs oder zusätzlichen Remote-Übergaben.
Alle Einstellgruppen im Code geprüft: Porträtvarianten einschließlich mk_haar/
mk_acc; Name, Nummer, Fuß, Nation, Position, Geschlecht, Jugend-/Wunschverein,
Typ, Statur, freigeschaltete Beinamen und Vorsatz. Neue Varianten ausschließlich
angehängt; Zufalls-Basiszahlen alter Porträts unverändert. Haut-/Haarfarben,
Kopfformen und Gameplay-Auswahl bewusst nicht beliebig vermehrt.

Moderner Bart in bartformen.jsx folgt der Kopfkontur und lässt Längen außerhalb
der Kinnmaske zu. Zusätzliche Gesichtsformen und Make-up; Accessoire-Namen an
die tatsächlich gespeicherten Zeichnungen angepasst. mk_acc bleibt Zugang zu
Bonusaccessoires, mk_haar zu Bonusfrisuren. Augen-Iris moderner Figuren geclippt.
Wunschverein wird zurückgesetzt, wenn er nicht zur neuen Spielklasse passt.

105 Node-Tests erfolgreich. Verwaltete Browservorschau tatsächlich erreichbar:
Willkommen übersprungen, Laufbahn erstellt, Ankerbart ausgewählt/festgehalten,
Würfeln erhielt Auswahl, Wildcard abgeschlossen und Techniktraining bis zum
Ereignis gespielt. Bärte, Schmuck und Augen auf Beispielköpfen visuell angesehen;
keine Prüfung sämtlicher kombinatorischen Varianten behauptet. Galerie bekam
fehlenden fl-Stilrahmen, vorher fehlten dort echte Farben/Typografie.

Neue Playwright-Smokes prüfen drei Breiten, Merkmalgruppen beider Auswahlen,
Accessoire-Freischaltungen, kompakten Einstieg und festgehaltenen Bart beim
Würfeln sowie Karrierestart. CI speichert Screenshots und Traces. README und
Startdatei halten den reproduzierbaren Browserzugang fest. Android-Animationen
und native Bedienung bleiben Geräteprüfung. Version 35.186.0 / 3518600.

## Sichtprüfung nach 35.186 – Codex, 16.09.2026

Basis 847b90e, Remote und offene PRs geprüft, keine fremden Änderungen.
GOAT-Aufdeckung im echten Browser auf Desktop und 320 × 720 angesehen:
Text lesbar, Weiter erreichbar, kein zweiter alter Lichtstreifen sichtbar.
Kompakter Spielerpass der Galerie auf 320 Pixeln mit langem Namen angesehen;
Name wird gekürzt, Metadaten einzeilig, beide Buttons bleiben nebeneinander.
Keine vollständige Android-Animationsabnahme daraus abgeleitet.

Bildschirmrahmen für die verwaltete Vorschau ergänzt, damit vw/vh und
Media Queries der tatsächlichen Testbreite folgen. Zusätzliche Browsertests
für alle Seltenheiten, Ruhemodus, Lesbarkeit und Abschluss der Aufdeckung.
Bei der DOM-Stilprüfung im Ruhemodus tatsächlich einen laufenden rs-schimmer
auf der Rückseite gefunden. Rückseitenband wird nun bei RUHE und nach dem
Aufdecken nicht mehr gerendert; System-reduced-motion zusätzlich im CSS
berücksichtigt. Deshalb App-Korrektur als 35.187.0 / 3518700.

Nach Korrektur im Browser-Ruhemodus keine animierten Nachfahren mehr;
HSV-Sonderkarte auch bei 844 × 390 vollständig samt Weiter sichtbar.
105 Node-Tests, Web-Build und Capacitor-Sync erfolgreich.

CI-Nachprüfung: APK erfolgreich, neun Browserfälle bestanden; drei Ruhefälle
melden eine laufende Animation. Diagnose um Name, Übergangseigenschaft und
Zielelement erweitert; Freigabe bis zur Klärung offen.

Diagnose bestätigt: die verbleibende Meldung ist ausschließlich der
background-color-Übergang des Weiter-Buttons (keine Kartenbewegung). Der Test
erlaubt deshalb Farb-Transitions als Bedienfeedback, prüft aber weiterhin
alle CSS-Animationen und sonstigen Transitions. Kein App-Code geändert.

## Karten, Porträts und Bedienung – Codex, 16.09.2026

Basis 210dada (35.187), Remote und offene PRs erneut geprüft: keine fremden
Änderungen. Alle zehn Punkte der Nutzerliste bearbeitet; bisherige Korrekturen
waren teilweise vorhanden, die gemeldeten Restfehler aber weiterhin relevant.
Version 35.188.0 / 3518800.

Wildcards verwenden dieselbe Vorderseite mit Kopfstreifen, Seltenheitsrahmen
und permanenter Prägung im Pass und beim Aufdecken. Reservierter Fußbereich
verhindert Positionssprung bei Weiter. Welt/GOAT/HSV erhalten eigene Bühne,
HSV blau-weiße Folie. Packfolie ohne grobe Ausschnittmaske; Druck separat darüber.

Porträt-Zuarbeit abgenommen: geschlossene Kopfhaarfläche, differenzierte Formen,
Bartkonturen aus den tatsächlichen Kieferdaten statt angenäherter Kontur.
Kopfschatten zusätzlich auf Kopf geclippt. Breite, schmale, kantige und zarte
Köpfe samt hellen Haarfarben anhand gerenderter Bögen angesehen. Bestehende
Merkmalnummern und Freischaltungen erhalten. Kein Anspruch, jede mögliche
Kombination ästhetisch abschließend abgenommen zu haben.

Einstellungs-Zuarbeit abgenommen und bei 320 Pixeln mit XL-Anzeige nachgebessert:
Kopfzeile, Abschnittsbänder und Schalterreihen umbrechen innerhalb ihrer Breite.
Fünf Bereiche, bestehende Speicher- und Bestätigungslogik erhalten. Charakter-
Startleiste außerhalb des transformierten fade-Containers, damit position:fixed
wirklich am Bildschirm haftet; im echten Browser geprüft. Dezenter Menüpfeil.
Icon-Geometrie vektoriell neu aufgebaut, native und Legacy-Ressourcen enthalten.
Sonderschuss zuletzt optisch überarbeitet, Spielmechanik unverändert.

Sichtprüfung im verwalteten Browser: kompakte Erstellung und Fußleiste bei320,
Einstellungen XL bei320, Packfolie, HSV-Aufdeckung, Sonderschuss. Automatische
Browserprüfungen um stabile Aufdeckposition, Startleiste, gespeicherte Optionen
und einmaligen Sonderschuss erweitert. 105 Node-Tests, Web-Build und Capacitor-
Sync erfolgreich. GitHub-Browser- und Android-Build bei Veröffentlichung prüfen.
Android-Launcher, native Touchbedienung und Effektleistung bleiben Geräteprüfung.

Abschluss 35.188: veröffentlicht als 86a9589, Dateibaum b9493eb identisch
zum lokal geprüften 1c422e1. Alle GitHub-Prüfungen erfolgreich: 105 Regressionen,
18 Browserprüfungen in drei Bildschirmgrößen; APK und AAB gebaut und Signaturen
geprüft. Android-Artefakt verfügbar unter Lauf 35131289278, Browserbericht unter
35131289445. Verwaltete Vorschau nach Prüfung beendet. Nächster Schritt ist
Kevins Android-Sichtprüfung, insbesondere Launcher-Icon, seltene Aufdeckungen
und konkrete noch auffällige Haar-/Bartkombinationen; Beispielbilder willkommen.

## Nachbesserung 35.189 – Codex, 16.09.2026

Basis 5936f64, keine neuen Remote-Branches. Nutzerbilder zeigen Restkanten bei
Rasiert/Halbglatze. Ursache: pauschal skalierte Schädelkontur mit abweichenden
Bezier-Stützpunkten. Haarunterlage folgt nun exakt der Kopfkurve; Halbglatze
verwendet deren Teilkurven, Kanten leicht überdeckt gegen Antialias-Hautsäume.
Bartkonturen innerhalb des Kopfbeschnitts ebenfalls minimal überdeckt.
Zarte Kopfform als Haar-/Bartbogen visuell geprüft; Kennungen bleiben erhalten.

Aufdecktext in flexibler Mitte unter dem Band, im echten Browser an HSV geprüft.
Seltene Enthüllungen: längere Vorbereitung, zwei endende Lichtwellen und
18 einmalige Funken (HSV: Rauten), langsamer Lichtfächer. Ruhe- und Systemmodus
reduzierter Bewegung berücksichtigt. Vorhandene Browserprüfungen überprüfen
weiterhin alle Stufen, Abschlussposition, Lesbarkeit und Ruhemodus.

Icon ohne eingebetteten Rahmen; Vordergrund nutzt sichtbare 72dp statt54dp
der108dp-Fläche, Hintergrund reicht über deren Maskenrand. Legacy-PNGs und
Vektoren neu generiert, runden Zuschnitt angesehen. Launcherwirkung und native
Effektleistung bleiben Android-Sichtprüfung.

## Icon-Rand 35.190 – Codex, 16.09.2026

Basis 2894ab5. Nutzerfoto zeigt dunklen Saum um den roten Icon-Kopf.
Die ehemaligen Abzeichenpfade endeten bei x5/95 und y5. Rot und weißer
Trennstreifen nun mit Beschnittzugabe von -30 bis130 gezeichnet; Android
schneidet die äußere Form. Motiv, Schrift und unterer Teil unverändert.
Vektor und alle Legacy-Dichten aus derselben Quelle regeneriert.


## Porträtidentität und Spieltest 35.191 – Codex, 17.09.2026

Basis main 9bb0d57, vor Veröffentlichung erneut abgeglichen. Keine fremden
Änderungen ersetzt. Porträtverlust in ausHalle/Spielerkarte/Elfkarte behoben,
Merkmale beim Karteneinsatz und Kaderabschluss weitergetragen. Altstand-Abgleich
über vorhandene Hallenkennungen; keine namensbasierte Rekonstruktion.
Fehlende historische Hallenquellen bleiben eine Grenze der Reparatur.

Isolierter vollständiger App-Prüfstand tools/spieltest.cjs ergänzt und im
Bildschirmrahmen verlinkt. Die neue Vorlage verwendet ausschließlich getrennte
Sitzungsdaten. Browserdurchlauf und konkrete offene Befunde stehen in
[pruefberichte/35.191-spieltest.md](pruefberichte/35.191-spieltest.md).
Kein Anspruch auf vollständige Spiel- oder Android-Fehlerfreiheit.

Nächste Prioritäten: inkonsistente Gesamttabelle, Abschlussjahr bei Rücktritt
nach Saisonende, dann restlicher Akademie-/Vereins- und Sicherungsdurchlauf.

Lokale Prüfungen: 107 Regressionen bestanden, Produktionsbuild erfolgreich,
Capacitor-Android-Synchronisierung erfolgreich. Galerie und isolierter Spieltest
neu erzeugt. GitHub- und Android-Workflow-Ergebnisse sind am Release-Commit
zu prüfen; zum Zeitpunkt dieses Vermerks noch nicht ausgeführt.


## Konsistenz und fortgesetzter Spieltest 35.192 – Codex, 17.09.2026

Lokaler Ausgang 07e2966 (unveröffentlichte 35.191), Remote main 9bb0d57.
Porträtkorrektur erhalten und gemeinsam mit dieser Runde zur Veröffentlichung
vorbereitet. Keine offenen PRs oder neuen Remote-Übergaben festgestellt.

Gemeinsame Paarungen statt unabhängiger Tabellenzeilen; sortierte Leistungsplätze
werden der bestehenden Rangfolge zugeordnet, damit Karrierefolgen konsistent bleiben.
Kalendergrenzen aus tatsächlichen Saisonangaben für Abschluss, Rückblick und Halle.
Kein zusätzliches Jahr im Spielerzustand und keine Änderung alter Tabellen.
Sichtbarer Rückweg aus erster Vereinsgründung; Mindestdauertexte korrigiert.

109 Regressionen, Web-Build und Capacitor-Sync bestanden. Langzeitlauf 192 Karrieren
mit 4527 Saisons erfolgreich. Echte Browserwege für Gründung, Ausbau, Hochziehen,
Aufstellung und Textsicherung; Details und klare Grenzen in
[pruefberichte/35.192-spieltest.md](pruefberichte/35.192-spieltest.md).
Version 35.192.0 / 3519200. CI-/APK-Ergebnis nach Veröffentlichung prüfen.

Fortsetzung 17.09.2026: Lokalen Commit 5f9d6d7 vollständig wiedergefunden.
109 Regressionen, Produktionsbuild und Capacitor-Sync erneut erfolgreich.
Lokale Playwright-Ausführung konnte mangels installiertem Chromium nicht starten;
kein Browsererfolg daraus abgeleitet. GitHub-Browser-CI bleibt Release-Gate.
Die automatische Freigabeprüfung lehnte den ersten main-Push ab. Kevin bestätigte
daraufhin ausdrücklich die dauerhafte Freigabe für Updates und APK-Builds sowie
sein letztes Wort; Wortlaut in README. Veröffentlichung wird damit fortgesetzt.


## CHAR-P0-01 visuelle Bestandsaufnahme – ChatGPT, 18.09.2026

Basis `main` ff9e59d8aa9d4ebd775ac012c683c1d5d150de7e nach CHAR-FIX-04.
Offene Claude-PRs zur Vereinswirtschaft wurden vor Beginn geprüft und nicht
verändert oder übernommen.

Der vorhandene Charakter-Inventar-Prüfstand wurde ausschließlich für die
Sichtabnahme auf 72/96/145 px und sechs Referenzkontexte (Schmal/Breit sowie
Kopf 10–13, helle/dunkle Haut und Haare) erweitert. Alle Live-Merkmalsgruppen
für Mann/Frau wurden als 84 CI-Sichtbögen gerendert und tatsächlich angesehen.
Kein neuer Produktdefekt gefunden, daher kein Produktcode und keine Version
geändert. Konkrete Ähnlichkeitskandidaten und die priorisierte Ausbauempfehlung
stehen in [pruefberichte/2026-09-18-char-p0-01-visuelle-bestandsaufnahme.md](pruefberichte/2026-09-18-char-p0-01-visuelle-bestandsaufnahme.md).

Prüfstand-Head 6edd6f0: Spielregressionen/Build Run 35310049237 erfolgreich;
Visuelle Browsertests Run 35310049190 mit 42 bestanden, 21 projektbedingt
übersprungen, 0 fehlgeschlagen. Browserartefakt 10533281664, Digest
e9ec1ac84a6e227f506a165d3462bc804bf158af99b0a1b8efc4c807e822f71b.


## CHAR-P1-03 – Frisurenvielfalt, zweite Qualitätsrunde (35.193.0) – ChatGPT, 18.09.2026

**Basis:** `main` `545b8929b4866dddb4ee2cd9b3825ff4061f951f`.  
**Arbeitsbranch:** `chatgpt/char-p1-03-frisurenvielfalt-02`.  
**PR:** #24.

Die Runde folgt ausdrücklich der vollständigen CHAR-P0-01-Bestandsaufnahme statt einer Zielzahl. Vor dem Produktcode wurden die vorhandenen Haarfamilien und die belegten Ähnlichkeitskandidaten M13, W9 und W13 erneut in den 72-px-Bögen gesichtet und die fehlenden visuellen Räume dokumentiert.

Umgesetzt:

- Männer append-only 26–30: Mittellange Locken, Lange Locken, Box Braids, Zurückgebundene Locs, Asymmetrischer Fringe.
- Frauen append-only 24–30: Vollpony, Curtain Bangs, Asymmetrischer Bob, Half-up, Langer Flechtzopf, Lange Wellen, Twin Buns.
- M13, W9 und W13 innerhalb ihrer bestehenden IDs deutlich stärker differenziert.
- gemeinsame Namensauflösung geschlechtsspezifisch erweitert, ohne historische IDs umzubelegen;
- Inventar auf sieben Kopf-/Farbkontexte erweitert, darunter Oval/Kupfer sowie Schmal/Breit und Kopf 10–13;
- CHAR-FIX-03 auf 868 Haarpaarungen, CHAR-FIX-04 auf 31+31 Frisuren hochgezogen;
- direkte 72/96-px-Nachbarschaftsbögen für die Alt-Kandidaten und 72-px-Vergleiche für jede neue Frisur.

Die erste echte Sichtung des bereits grünen Zwischenstands führte bewusst zu einer weiteren Produktkorrektur: Box Braids und langer Flechtzopf brauchten stärkere Segmentierung; Half-up eine klarere obere/rückwärtige Bindung. Sichtgeprüfter Produkt-Head danach: `aa74789c4c4bd4a40a4d2fd7b4dd39e488355e24`.

**Automatisch geprüft auf diesem Produkt-Head:**

- Spielregressionen Run `35315705473`: 140/140 bestanden, Produktionsbuild erfolgreich.
- Visuelle Browsertests Run `35315705414`: 42 bestanden, 21 planmäßig übersprungen, 0 Fehler.
- Browserartefakt `Rasenschach-Browsertest`: ID `10535950715`, Digest `sha256:171132150dcb8d87268a4b9c03cd5aa1ae187086e89d651c33f72a78383f42df`.
- Safe-Patch-Brücke für die zwei `App.jsx`-Namensstellen: Run `35314484312` vollständig grün.

**Tatsächliche Sichtprüfung:** vollständige Männer-/Frauenbögen bei 72/96/145 px; Alt-Nachbarschaften M1/13/21, W0/7/9, W2/8/13; jede neue ID gegen ihre engsten Nachbarn; CHAR-FIX-03-Haarmatrix; CHAR-FIX-04 Kopf-10–13-Matrix bei 72 px sowie kritischer 96/145-px-Bogen. Kein neuer Hautkeil, keine seitliche Haarlücke, keine zu kleine Perücke und kein unplausibles Hals-/Schulter-Clipping gefunden.

Der erste PR-Browserlauf `35314563601` war wegen veralteter Prüfstandzahlen/alter Galerienamensauflösung rot (700 erwartet, tatsächlich 868; Galeriepfad ohne neue geschlechtsspezifische Namen). Die Sollwerte wurden ausschließlich an den gewollt größeren Katalog angepasst; fachliche Prüfungen wurden nicht gelockert.

Vollständiger Bericht: `pruefberichte/2026-09-18-char-p1-03-frisurenvielfalt-02.md`.

**Bewusst offen:** kein physischer Android-Geräte-Sichttest in der Charakterrunde. Der signierte Android-Build wird nach Integration als normales Post-Merge-Gate ausgeführt; ein erfolgreicher Build wird nicht als Geräte-Sichttest ausgegeben.


## CHAR-P1-02 – Gesichtszüge, Qualitätsrunde 2 (35.194.0) – ChatGPT, 18.09.2026

**Basis:** `main` `f431f74c6e4810ac2e65a1fc0253777eaf03d09b`.  
**Arbeitsbranch:** `chatgpt/char-p1-02-gesichtszuege-02`.  
**PR:** #25.

Nach CHAR-P1-03 wurde der belegte nächste Qualitätsgewinn bei formtragenden Gesichtszügen umgesetzt. Append-only neu: Mund 9–11 (Herzförmig, Kompakt, Breites Grinsen) und Wangen/Kinn 7–8 (Markante Kieferkante, Spitze Kinnkontur). Historische Seed-Ableitung und bestehende IDs bleiben unverändert.

Der erste PR-Browserlauf `35319188356` war bewusst rot: Wangen/Kinn-ID 8 war bei 72 px praktisch identisch zu ID 0. Die echte Screenshot-Sichtung bestätigte den Befund. ID 8 wurde daraufhin gezielt mit stärkerer V-Kontur nachgeschärft.

Finale PR-Abnahme auf dem korrigierten Produktcode:
- Spielregressionen `35320111345`: 140/140 bestanden, Build erfolgreich.
- Visuelle Browsertests `35320111337`: 43 bestanden, 23 planmäßig übersprungen, 0 Fehler.
- Browserartefakt `10536434215`, Digest `sha256:adb0b77d25d517666dc7d8dd9e41891770433c67aead7c2940eced63c97b80a4`.
- Finalbilder bei 72/96 px tatsächlich geöffnet; Kinn-ID 8 nun klar eigenständig, neue Münder lesbar, Bart-/Brillenprobe ohne störende Kollision.

Vollständiger Bericht: [pruefberichte/2026-09-18-char-p1-02-gesichtszuege-02.md](pruefberichte/2026-09-18-char-p1-02-gesichtszuege-02.md).

**Bewusst offen:** kein physischer Android-Gerätetest. Post-Merge-Regressionen, Browsertests und signierter Android-Build werden auf dem neuen `main` geprüft.

## Unabhängige Qualitätsabnahme 35.194.1 – Codex/Astra, 18.09.2026

Basis main e9b21630, geprüft gegen den Ausgang vor der Charakterarbeit 78f7dc8.
Auftrag: integrierte ChatGPT-Arbeit abnehmen, kleine Defekte bereinigen; Claudes
Vereinswirtschaft ausdrücklich ausgenommen. Kein Rollback erforderlich.

Vier kleine Korrekturen: Mund-IDs 9–11 in der gemeinsamen Abstandsrechnung;
Katalogabdeckung im Kombinationstest; vollständige 31er-Porträtbögen; mobile CSS
auch in isolierten Vorschauen. Versionsanzeige zusätzlich an package.json gebunden.
140 Regressionen, Build, Galerie und Capacitor-Sync erfolgreich. Langzeitstichprobe
am Ausgang: 192 Karrieren / 4.527 Saisons. Eigene mobile Browser-/Renderstichproben,
Befunde, Bewertung und Grenzen im [Abnahmebericht](pruefberichte/2026-09-18-astra-qualitaetsabnahme.md).
Keine fremden Branches gelöscht und keine Claude-PRs integriert. Korrekturversion
35.194.1 / 3519401; CI und Android nach Veröffentlichung am exakten Commit prüfen.

## Dauerhafte Rollen Astra / Lemming – 18.09.2026

Kevin hat PR #26 und den APK-Build 35.194.1 ausdrücklich freigegeben. PR #26 wurde
als a804a9b11886167a3cb7331ce1ac8b864b98811e nach main übernommen.

Auf Kevins Auftrag werden neue ChatGPT-Chats nach Ansprache als Astra oder Lemming
geführt: README ist die maßgebliche Rollenquelle; AGENTS und START-NEUER-CHAT
verweisen darauf. LEMMING.md enthält kleine Arbeitspakete, Umfangsgrenzen,
Prüfkriterien und einen verbindlichen PR-Abschluss zur Astra-Abnahme. Ohne
Astra-Zuordnung gilt für neue ChatGPT-/Codex-Chats die Lemming-Arbeitsweise.
Keine automatische Modellerkennung behauptet. Claude bleibt getrennt und seine
Vereinswirtschaft wurde nicht integriert. Reine Dokumentation, keine neue Version.

## WIRT-P0-01 – Wirtschaftskern der Profimannschaft (Claude, 17.09.2026)

Basis: `main` 8e4eeec (35.192.0), vor Beginn abgerufen. Branch
`claude/vereinswirtschaft`.

**Auftrag des Eigentümers:** Der Vereinsausbau soll mit Geld bezahlt werden,
nicht mit VC — „das man keine VC in etwas versenkt was nach 15 Saison eh
verschwindet". Einnahmen aus Werbedeals, sportlichem Erfolg, Ticketverkäufen
(Stadion, Gastronomie) und Merchandising. VC nur noch für wenige Extras.
Dauerhafter Rahmen dazu in `VEREINSWIRTSCHAFT-PLAN.md`.

**Nicht übernommen:** Der offene Branch `codex/char-p0-02-identitaet` wurde
bewusst nicht in die Arbeitsbasis geholt. Er ist Codex' laufende Arbeit an der
Porträt-Identitätskette, berührt diese Runde inhaltlich nicht, und ein
Zusammenführen vor seinem Abschluss würde beim nächsten Rebase Konflikte
erzeugen. Begründung hier, wie die Übergaberegel es verlangt.

**Neu: `vereinswirtschaft.js`.** Reine Rechnung, kein React, keine Zufallsquelle
aus `App.jsx` — die Sponsorenwürfel bekommen ihre Saat von außen, damit
dieselbe Saison reproduzierbar dieselben Angebote zeigt.

- **Währung.** 42 Länder mit Code, Symbol und Kurs; alles andere fällt auf Euro
  zurück. Gerechnet wird ausschließlich in Millionen Euro, wie `p.money` beim
  Spieler; die Landeswährung ist reine Anzeige. Andersherum — je Land rechnen —
  bräche jeden Vergleich zwischen zwei Ligen und zwänge dazu, die Ausbaukosten
  je Land zu pflegen.
- **Ausbau, sechs Abteilungen auf Geldbasis.** Die drei alten Kennungen
  (`training`, `stadion`, `medizin`) behalten Namen und Wirkung — laufende
  Vereine hängen daran, `ausbauStufe` liest sie in `verein.js` an vier Stellen.
  Neu sind die drei Geldquellen: Gastronomie, Fanartikel, Vertrieb.
  Vollausbau aller sechs kostet 319 Mio.
- **Vier VC-Extras**, jedes einmal je Durchlauf: Gründungskapital,
  Scoutnetz, Namensrecht am Stadion, Vermächtnisplakette. Bedingung für jedes:
  es überdauert den Verein oder ermöglicht etwas, das mit Geld allein nicht
  geht. Preise zwischen einer halben und anderthalb Laufbahnen.
- **Zwölf erfundene Sponsoren**, keine echten Marken. Pro Saison drei Angebote,
  Laufzeit ein bis vier Saisons, Betrag skaliert mit Ligastufe und Erfolg;
  lange Bindung zahlt je Saison weniger. Sechs haben einen Vorteil
  (Merchandising, Gastronomie, Medizin, Vertrieb, Nachwuchs).
- **Einnahmen** aus Zuschauern (Plätze × Auslastung × Preis × Heimspiele),
  Gastronomie, Merchandising (Sortiment × Vertrieb × Ansehen, als Produkt: ohne
  Vertrieb bringt das beste Sortiment wenig), Prämien und Sponsoren.
- **Laufende Kosten** und eine **Saisonabrechnung mit Beleg** — dieselbe Bauart
  wie `abschlussBeleg` in `belohnungen.js`, damit Buchung und Anzeige dieselbe
  Quelle haben.

**Balance, nachgerechnet statt geschätzt.** Verfahren: fünfzehn Vereinsjahre,
jede zweite Saison das wertvollste Sponsorenangebot angenommen, jede Saison der
billigste offene Ausbau gekauft, solange die Kasse reicht. Ø-Einnahmen je
Saison und erreichte Ausbaustufen von 30:

| Liga | Rang | Ø Einnahmen | Ø Kosten | Ausbau | Minusjahre |
|---:|---:|---:|---:|---:|---:|
| 1 | 3 | 110,0 | 60,2 | 30/30 | 0 |
| 1 | 10 | 86,8 | 53,8 | 30/30 | 0 |
| 2 | 5 | 44,2 | 31,2 | 26/30 | 0 |
| 2 | 14 | 29,3 | 24,4 | 18/30 | 1 |
| 3 | 8 | 21,9 | 19,1 | 13/30 | 1 |
| 4 | 10 | 14,0 | 13,3 | 7/30 | 5 |
| 5 | 12 | 10,4 | 10,4 | 4/30 | 7 |

Zwei Zwischenstände mussten korrigiert werden, beide durch diesen Lauf
aufgedeckt und nicht durch Hinsehen:

1. **Erster Entwurf:** Ein Erstligist nahm 1.908 Mio ein, gab 440 aus und hatte
   nach Vollausbau **1.148 Mio** in der Kasse. Oben war damit keine Entscheidung
   mehr zu treffen. Ursachen: Ticketpreis 42 € in der ersten Liga (mehr als eine
   Bundesligakarte im Schnitt kostet) und laufende Kosten, die nicht mit der
   Vereinsgröße wuchsen. Es fehlte der größte Posten eines echten Vereins, das
   Personal.
2. **Zweiter Entwurf:** Personalkosten mit Exponent 0,85 nach Ligastufe — jetzt
   stand ein Fünftligist fünfzehn Jahre im Minus und erreichte **null**
   Ausbaustufen. Aus „sich hocharbeiten" war „nichts geht" geworden. Mit
   Exponent 1,5 zahlt er 1,8 Mio statt 7,3, ein Erstligist zahlt 20.

**Geprüft:** 15 neue Regressionen, `npm test` 124/124 (vorher 109),
`npm run build` erfolgreich. Die Regressionen prüfen Verhalten, nicht
Kalibrierung: dass Geld nur über belegte Posten entsteht, dass die Summe die
Summe der Posten ist, dass ein Kauf ohne Deckung gar nichts ändert, dass
Sponsorenangebote bei gleicher Saat gleich bleiben und Verträge genau nach
ihrer Laufzeit enden, und dass in Grenzlagen (leerer Verein, Liga 9, Rang 20)
keine NaN entstehen.

**Ausdrücklich offen:**

- **Das Modul ist noch an nichts angeschlossen.** Weder `verein.js` noch die
  Oberfläche rufen es auf; der alte VC-Ausbau läuft unverändert weiter. Das ist
  der Zuschnitt dieser Runde, kein Versehen: Anschluss (WIRT-P0-02),
  Umstellung des Ausbaus (P0-03) und Sponsorenwahl (P0-04) sind eigene Pakete,
  und der Aufrufer für P0-03 liegt in `App.jsx`, wo Codex parallel arbeitet.
- **Ein erfolgreicher Erstligist hat nach Vollausbau noch rund 429 Mio übrig.**
  Zu viel, um eine Entscheidung zu bleiben. Es fehlen die Spielergehälter
  (WIRT-P1-03); bis dahin ist der Überschuss bekannt, nicht übersehen.
- **Eine leere Kasse hat keine Folgen.** Der Verein kann ins Minus laufen, ohne
  dass etwas passiert (WIRT-P1-04) — bewusst, weil es die Schwierigkeit spürbar
  verschöbe.
- **Kein Gerätetest, keine Oberflächenprüfung.** Es gibt noch nichts zu sehen.
- **Die Kurse sind gerundete Größenordnungen**, keine Tageskurse. Sie sollen
  die Zahl vertraut aussehen lassen, nicht eine Wechselstube nachbilden.

Keine Versionserhöhung und kein CHANGELOG-Eintrag: für Spielende ändert sich in
dieser Runde nichts.


## WIRT-P0-05 – Vereinsführung: fünf Systeme (Claude, 17.09.2026)

Basis: derselbe Branch `claude/vereinswirtschaft`, aufgesetzt auf WIRT-P0-01.
Der Eigentümer hat die fünf Vorschläge einzeln bestätigt und einen ergänzt.

**1. Bauzeit 1–3 Saisons.** Bezahlt wird sofort und vollständig, gebaut über
Saisons; eine Baustelle gleichzeitig. Dauer aus den Kosten: bis 3 Mio eine
Saison, bis 12 Mio zwei, darüber drei.

**2. Preise für Tickets, Gastronomie und Fanartikel.** Faktor 0,6 bis 1,6.
Umgesetzt über Elastizität, nicht über ein Verbot — Kevins Beispiele sind
damit eine Folge der Rechnung, keine Sonderregel:

- *Tickets am Ansehen.* Ein Erstligist mit Ansehen 1,9 darf über Normalpreis
  gehen; ein Fünftligist mit Ansehen 0,7 zahlt bei jeder Erhöhung drauf.
- *Gastronomie an der Gastrostufe.* Stufe 1 muss unter Normalpreis bleiben,
  Stufe 6 darf deutlich zulangen.
- *Fanartikel an Sortiment und Vertrieb.*

Wer über das ertragreichste Niveau hinausgeht, verliert zusätzlich Stimmung —
der Schaden ist doppelt und wirkt in die nächste Saison.

**3. Vorstandsziel je Saison**, aus der Ausgangslage abgeleitet (Klassenerhalt
/ Gesicherte Mitte / Vorne angreifen / Um den Titel spielen). Prämie nur bei
Erfolg, Verfehlen kostet nichts. Die Härte hängt an der Rechtsform.

**4. Null bis zwei Wirtschaftsereignisse je Saison** in Kevins Verteilung
30 % / 50 % / 20 %, fünf positive und fünf negative. Die Beträge sind Anteile
der Vereinsgrösse, keine festen Summen: 2 Mio sind für einen Fünftligisten eine
Katastrophe und für einen Erstligisten Kleingeld.

**5. Rechtsform e.V. → GmbH → KGaA → AG.** Nur nach vorn und nur ab Grösse
(die AG braucht die erste Liga). Jede Stufe bringt Einlage und bessere
Vermarktung, kostet aber Fan-Toleranz und verschärft das Vorstandsziel. Ein
e.V. darf höhere Preise verlangen als eine AG — die Mitgliedsbeiträge sind bei
ihm eine Säule, bei der AG ein Rest.

Dazu **Stimmung** (0–100) als einziger neuer sichtbarer Wert. Sie bewegt sich
träge (höchstens rund zehn Punkte je Saison), wächst mit Erfolg und fertigen
Bauprojekten, sinkt bei Überteuerung, und wirkt auf Auslastung und
Merchandising.

**Zwei Korrekturen am Kern aus P0-01**, beide durch den Durchrechnungslauf
aufgedeckt und im vorigen Vermerk bereits als Schwäche benannt:

1. *Merchandising wuchs quadratisch* und war bei Vollausbau mit 59,7 Mio die
   grösste Einnahmequelle — mehr als alle Ticketverkäufe zusammen. Jetzt über
   die Wurzel gedämpft: 6/6 bringt das Sechsfache von 1/1, nicht das
   Sechsunddreissigfache.
2. *Fernsehgeld erdrückte das Unterhaus.* Ein Drittligist bekam 7,87 Mio
   Prämien gegen 2,66 Mio aus eigener Arbeit; sein Ausbau war fast
   gleichgültig. Exponent von 1,15 auf 1,6 — Liga 1 bekommt 26, Liga 3 noch
   4,2, Liga 5 nur 1,8.

**Ein Befund beim Nachrechnen der Preisregler.** Der angezeigte „beste Preis"
ist ein Versprechen an den Spieler, und die erste Fassung hat es gebrochen.
Zuerst rechnete sie die Schulformel (1+e)/(2e) — beim Ticketpreis 14 % daneben,
weil höhere Kartenpreise auch den Gastro-Umsatz kosten: wer nicht kommt, kauft
auch keine Bratwurst. Nach Einrechnen dieser Kopplung lag sie über 10.935
Vereinskonfigurationen immer noch in 558 Fällen falsch (5,1 %) — Ursache sind
die Deckelungen (Auslastung höchstens 99 %, Menge mindestens 5 %): ein
ausverkauftes Stadion verliert bei einer Preiserhöhung zunächst gar keine
Besucher, sein Optimum liegt also höher als jede Parabel vorhersagt. Der
Hinweis wird jetzt **numerisch am echten Ertrag** bestimmt, einundfünfzig
Auswertungen über das Reglerband. Gegenprobe: dieselben 10.935 Konfigurationen,
**null** Abweichungen.

**Kalibrierung mit allen Systemen.** Verfahren: fünfzehn Vereinsjahre, Preise
jede Saison auf das Optimum gesetzt, jede zweite Saison das wertvollste
Sponsorenangebot, Baustart sobald bezahlbar, Rechtsformwechsel sobald möglich.

| Liga | Rang | Form am Ende | Ø Ein | Ø Aus | Kasse | Stimmung | Ausbau | Minusjahre |
|---:|---:|---|---:|---:|---:|---:|---:|---:|
| 1 | 3 | AG | 68,5 | 32,9 | 674,5 | 100 | 11/30 | 0 |
| 2 | 5 | KGaA | 31,6 | 18,9 | 222,2 | 100 | 11/30 | 0 |
| 3 | 8 | e.V. | 20,4 | 15,2 | 84,3 | 100 | 11/30 | 0 |
| 4 | 10 | e.V. | 15,4 | 13,6 | 22,4 | 85 | 11/30 | 2 |
| 5 | 12 | e.V. | 8,8 | 9,1 | −4,7 | 43 | 2/30 | 9 |

Kluge Preise und der Rechtsformwechsel sind spürbar, aber kein Freifahrtschein:
in Liga 1 steigen die Ø-Einnahmen von 64,8 auf 68,5, in Liga 3 von 19,1 auf
20,4 — und vor allem hält der Verein seine Stimmung (100 statt 45).

**Geprüft:** 24 Regressionen im Modul (9 neue), `npm test` 133/133 (vorher 124),
`npm run build` erfolgreich. Die neuen Prüfungen decken ab: Bauzeiten für jede
Ausbaustufe, nur eine Baustelle, Fertigstellung genau nach Ablauf; Kevins beide
Preisbeispiele; das Optimum-Versprechen über das ganze Reglerband für alle drei
Preise; Stimmungsgrenzen und -trägheit; alle vier Zielstufen mit und ohne
Erfüllung; die 30/50/20-Verteilung über 6.000 Ziehungen; Rechtsform nur nach
vorn, nur ab Grösse, mit Einlage und Stimmungskosten, und die aufsteigende
Vermarktungsreihe.

**Ausdrücklich offen:**

- **Die Bauzeit ist jetzt die eigentliche Grenze, nicht das Geld.** Höchstens
  elf der dreissig Ausbaustufen sind in fünfzehn Jahren zu schaffen, auch mit
  voller Kasse. Das ist eine Eigenschaft — ein Verein wird nie fertig, man
  spezialisiert sich —, aber der Eigentümer sollte sie kennen und
  entscheiden, ob sie so bleiben soll.
- **Geld sammelt sich ohne Verwendung**, in Liga 1 rund 674 Mio. Zwei
  Abhilfen offen: Spielergehälter (WIRT-P1-03) und die Restkasse am Ende in
  Abschlusspunkte (WIRT-P1-05).
- **Wer immer Dritter wird, bekommt dauerhaft „Um den Titel spielen"** und
  verdient nie eine Prämie. Ob die Schwelle bei Platz 2 besser läge, sagt der
  Gerätetest.
- **Weiterhin an nichts angeschlossen** und kein Gerätetest: es gibt nichts zu
  sehen. Anschluss ist WIRT-P0-02 bis P0-04.

Keine Versionserhöhung, kein CHANGELOG-Eintrag: für Spielende ändert sich
nichts, solange das Modul nicht angeschlossen ist.


## WIRT-P0-05 Nachtrag – drei Entscheidungen des Eigentümers (Claude, 17.09.2026)

Nach der Kalibrierung hat der Eigentümer drei Punkte entschieden.

**1. „Man sollte schon alles schaffen, wenn man genug Geld hat. Die Bauzeit
sollte also einen nicht begrenzen. Limitieren wir die Bauzeit auf max 2 Jahre
[…]. Aber wie du sagst, eine gewisse Spezialisierung sollte bleiben."**

Die Höchstdauer allein hätte das nicht gelöst: dreissig Projekte nacheinander
sind auch bei zwei Jahren nie unter sechzig Saisons zu schaffen. Die Änderung
liegt deshalb woanders — **jede Abteilung baut für sich**. Stadion und
Gastronomie gleichzeitig: ja. Stadion Stufe 3 und Stufe 4 gleichzeitig: nein,
man kann dieselbe Tribüne nicht zweimal auf einmal erweitern. Damit braucht
jede Abteilung höchstens zehn Saisons, und sie laufen parallel.

Neu gerechnet, gleiches Verfahren wie zuvor:

| Liga | Rang | Form am Ende | Ø Einnahmen | Kasse | Ausbau | Punkte aus Kasse |
|---:|---:|---|---:|---:|---:|---:|
| 1 | 3 | AG | 142,6 | 1.248,2 | **30/30** | 250 (Deckel) |
| 1 | 10 | AG | 132,9 | 1.052,2 | **30/30** | 250 (Deckel) |
| 2 | 5 | KGaA | 73,1 | 294,6 | **30/30** | 74 |
| 3 | 8 | GmbH | 38,2 | 43,3 | 25/30 | 11 |
| 4 | 10 | GmbH | 20,6 | 6,6 | 14/30 | 2 |
| 5 | 12 | e.V. | 8,8 | −4,7 | 2/30 | 0 |

Alles schaffbar, wenn das Geld reicht; ab Liga 3 entscheidet man, was man
weglässt. Genau die gewünschte Mischung.

**2. Restkasse zu Vermächtnispunkten.** Vier Millionen ergeben einen
Abschlusspunkt, gedeckelt bei 250. Zum Vergleich wiegt ein Aufstieg 120 Punkte
und eine Meisterschaft 90 — eine nie ausgegebene Kasse darf sportlichen Erfolg
nicht ersetzen. Schulden zählen nicht negativ; der Abschluss soll nicht zweimal
bestrafen. Das VC-Extra „Vermächtnisplakette" wirkt hier, und nur hier: sein
`punkteFaktor` hatte bis jetzt keinen Leser.

**3. Zielschwelle verschoben.** Das härteste Vorstandsziel beginnt jetzt ab
Platz 2 statt ab Platz 3. Vorher bekam ein Verein, der jedes Jahr Dritter
wurde, dauerhaft „Um den Titel spielen" mit Soll 1 und verdiente nie eine
Prämie.

**Geprüft:** 26 Regressionen im Modul (2 neue), `npm test` 135/135 (vorher 133),
`npm run build` erfolgreich. Die neuen Prüfungen decken ab: Höchstdauer zwei
Saisons für jede Ausbaustufe, dieselbe Abteilung nicht zweimal gleichzeitig,
zwei Abteilungen gleichzeitig erlaubt, unterschiedlich lange Projekte werden
zu unterschiedlichen Zeitpunkten fertig — und ein Lauf mit unerschöpflicher
Kasse, der belegt, dass **alle dreissig** Stufen innerhalb der fünfzehn Jahre
erreichbar sind. Dazu Restkasse-Umrechnung mit Deckel, Schuldenfall und
Plakettenfaktor.

**Offen bleibt:** der Überschuss oben (rund 1.250 Mio in Liga 1, der den
Punktedeckel reisst) — das ist der fehlende Posten Spielergehälter
(WIRT-P1-03). Anschluss an Spielablauf und Oberfläche unverändert offen
(WIRT-P0-02 bis P0-04), kein Gerätetest.

## WIRT-P1-03 — Spielergehälter mit Erfolgsratsche (Claude, 17.09.2026)

**Basis-Commit:** `c632163` (Zusammenführung von `origin/main` = `a96660f`).
**Branch:** `claude/vereinswirtschaft`. **Vorgelegt zur Abnahme, nicht
zusammengeführt.**

**Auftrag.** Kevin: „Lass uns die Sache mit dem Überschuss angehen!
Spielergehälter und allgemein laufende Kosten und Mitarbeitergehälter steigen
bei langanhaltendem Erfolg. Vielleicht bekommen wir es damit etwas reduziert."

Damit ist der Punkt erledigt, der im Vermerk davor ausdrücklich offen blieb:
ein Erstligist sass nach fünfzehn Jahren auf rund 1.250 Mio und riss den
Punktedeckel — ab dem Jahr, in dem alles gebaut war, war Wirtschaften egal.

**Was geändert wurde** (`vereinswirtschaft.js`):

1. **Die Pauschale „Personal und Mannschaft" ist ersetzt, nicht ergänzt.** Das
   stand so im Arbeitsplan (WIRT-P1-03) und war die eine Falle: wer den Posten
   stehen lässt und Gehälter danebenstellt, zahlt doppelt. An seiner Stelle
   stehen **Spielergehälter** und **Mitarbeiter und Verwaltung**; „Betrieb und
   Unterhalt" sank im selben Zug von 0,85 auf 0,55 je Ausbaustufe, weil das
   Personal dort mit drinsteckte.
2. **Gehalt je Spieler: 0,9 Mio × (ovr/60)^4 ÷ Ligastufe.** Der Exponent
   bildet ab, dass Gehälter nicht linear mit der Stärke wachsen; der Teiler,
   dass derselbe Spieler in der ersten Liga mehr verdient als in der vierten.
   Ohne Kader wird je Ligastufe geschätzt (74/66/60/55/51/48), damit der
   Rechenkern auch isoliert läuft, solange `verein.js` keinen Kader führt.
3. **Gehaltsniveau als Ratsche, 0,75 bis 2,00.** Ziel aus Ligastufe,
   Platzierung und Vorgeschichte (Meisterschaften und Aufstiege, gedeckelt bei
   +0,55). Je Saison wird der **halbe** Abstand nach oben gegangen und **ein
   Sechstel** nach unten. Anhaltender Erfolg wird dadurch dauerhaft teuer,
   eine einzelne gute Saison nicht bestraft — und ein Absteiger wird seine
   Gehaltsstruktur nicht in einem Jahr los.
4. **Die Abrechnung schreibt das Niveau fort.** Bezahlt wird die abgelaufene
   Saison mit dem alten Niveau; das neue gilt ab der kommenden. Der Beleg
   weist `gehalt: { vorher, neu, kader }` aus, damit die Oberfläche später
   dieselbe Quelle liest wie die Buchung.

**Nachgerechnet.** Fünfzehn Saisons je Ligastufe, gieriger Verein (Preise auf
dem rechnerischen Optimum, die zwei besten Sponsorenangebote angenommen, jede
bezahlbare Stufe sofort begonnen), Platz 3 in jeder Liga, gleiches Verfahren
für beide Spalten:

| Liga | Kasse vorher | Kasse nachher | Ausbau vorher | Ausbau nachher | Punkte vorher | Punkte nachher | Niveau am Ende |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1.435 | **667** | 30/30 | 30/30 | 250 (Deckel) | **167** | 1,61 |
| 2 | 537 | 302 | 30/30 | 30/30 | 134 | 76 | 1,29 |
| 3 | 151 | 86 | 30/30 | 29/30 | 38 | 21 | 1,17 |
| 4 | 32 | 22 | 27/30 | 24/30 | 8 | 6 | 1,11 |
| 5 | 42 | 24 | 24/30 | 22/30 | 10 | 6 | 1,06 |

Der Überschuss oben ist mehr als halbiert und der Punktedeckel wird nicht mehr
gerissen — die letzte Saison bleibt eine wirtschaftliche Entscheidung. Unten
bleibt der Weg begehbar.

**Ein Fehler auf dem Weg, weil er sich wiederholen kann.** Die erste Fassung
rechnete die Gehälter **ohne Ligateiler**. In sich stimmig, alle 138
bestehenden Regressionen grün — und trotzdem falsch: ein Viertligist zahlte
11,4 Mio Gehälter bei 17 Mio Einnahmen und erreichte in fünfzehn Jahren **0
von 30** Ausbaustufen, Liga 3 kam auf 8. Aus „sich hocharbeiten" wurde „nichts
geht". Gefunden hat das nicht der Prüfstand, sondern erst der Langzeitlauf.
Deshalb ist er jetzt selbst eine Regression.

**Geprüft:** `npm test` **144/144** (vorher 138), `npm run build` erfolgreich.
Sechs neue Regressionen im Modul: Ratsche schnell hoch und langsam runter;
Fortschreibung und Beleg; die Pauschale ist nachweislich verschwunden; Gehälter
folgen Kader und Liga; Grenzen halten auch bei absurder Vorgeschichte; und ein
Fünfzehn-Saisons-Lauf, der unten mindestens 12 von 30 Stufen und oben den
Vollausbau **unter** dem Punktedeckel verlangt. Gegenprobe gemacht: nimmt man
den Ligateiler wieder heraus, werden genau diese Regressionen rot (`not ok 29`
und `not ok 31`, „Liga 3 erreicht nur 8 von 30 Ausbaustufen"). Die CI lief
nicht, weil ein Branch-Push sie nicht auslöst.

**Zusätzlich, weil die Regel sonst in der nächsten Sitzung wieder falsch
gilt:** `CLAUDE.md` und `README.md` sagten „ein Pull Request ist der
bevorzugte Weg" und ließen damit offen, wer ihn eröffnet. Kevin hat das am
17.09.2026 in zwei Schritten geklärt — erst „Pull requests macht nur Astra",
dann, nachdem der Unterschied zwischen Eröffnen und Zusammenführen auf dem
Tisch lag, die endgültige Fassung: **Claude eröffnet, Codex entscheidet.**
Das Eröffnen ändert an `main` nichts und lässt die CI am Vorschlag laufen,
was ein reiner Branch-Push nicht tut; Abnahme, Prüfung, Gegenprobe und der
Merge-Knopf bleiben bei Codex. Ausdrücklich ausgenommen bleibt für Claude:
zusammenführen, freigeben, Auto-Merge einschalten, fremde Pull Requests
schliessen. Beide Dateien stehen jetzt auf dieser Fassung.

**Offen bleibt:**

- **Der Kader ist geschätzt, nicht gelesen.** `kaderKosten` liest `v.kader`,
  wenn es da ist — `verein.js` führt aber keinen. Sobald er da ist, ist die
  Kalibrierung erneut zu prüfen.
- **Anschluss an Spielablauf und Oberfläche** unverändert offen (WIRT-P0-02
  bis P0-04). Das Gehaltsniveau braucht dabei ein Feld im Spielstand;
  alte Spielstände ohne `gehaltsniveau` beginnen bei 100 % (geprüft).
- **Kein Gerätetest.** Die Zahlen stammen aus Läufen, nicht aus dem Spiel.
- **Ob 667 Mio oben noch zu viel sind, entscheidet Kevin.** Der Lauf ist der
  bestmögliche Verlauf, nicht der mittlere; ein normaler Verlauf liegt
  darunter. Nachschärfen ginge über die Obergrenze des Niveaus (2,00) oder
  das Tempo nach oben (halber Abstand).

## WIRT-P0-02 — Wirtschaft am Spielablauf (Claude, 17.09.2026)

**Basis-Commit:** `1ac1f18` (Zweig `claude/vereinswirtschaft`, Pull Request #6).
**Branch:** `claude/wirt-p0-02`. **Vorgelegt zur Abnahme, nicht zusammengeführt.**
Dieser Zweig setzt auf #6 auf, weil `vereinswirtschaft.js` nur dort existiert.

**Auftrag.** Kevin: „Dann mache mit WIRT-P0-02 weiter". Der Rechenkern lief bis
hierher isoliert — geprüft, aber von niemandem aufgerufen.

**Was geändert wurde** (`verein.js`):

1. **Gewöhnlicher Import statt Fabrik.** `vereinswirtschaft.js` braucht keinen
   Namen aus `App.jsx`, importiert selbst nichts und kann deshalb ohne
   Ringimport eingebunden werden. Die Zusicherung steht als Kommentar an der
   Importzeile, damit sie nicht versehentlich gebrochen wird.
2. **`leererVerein` trägt die Wirtschaft:** `kasse`, `sponsoren`, `extras`,
   `stimmung`, `rechtsform`, `preise`, `baustellen`, `gehaltsniveau`, `ziel`.
   Die alten Ausbaukennungen `training`, `stadion`, `medizin` bleiben
   unverändert — sie sind Vertrag.
3. **Die Ligastufe wird abgeleitet, nicht gespeichert.** `ligastufe(land, liga)`
   dreht die Pyramide aus `stufenVon` um, sodass 1 die höchste Liga ist. Ein
   Auf- oder Abstieg führt sie sofort mit, und kein Land braucht eine gepflegte
   Tabelle.
4. **Die Saat kommt aus dem Verein**, nicht aus `rnd()`: FNV-1a über Name,
   Land, Liga und Jahr. Ein Neuladen würfelt damit keine neuen
   Sponsorenangebote — die Zusage aus WIRT-P0-04.
5. **`vereinSaison` rechnet ab.** Mit der Liga der abgelaufenen Saison, der
   Bilanz einschliesslich dieser Saison und dem **echten Kader** — damit
   rechnet `kaderKosten` erstmals mit wirklichen Stärken statt der Schätzung.
   Das Ziel der kommenden Saison wird in der NEUEN Liga gesetzt.
6. **Chronik: Kurzfassung, nicht voller Beleg.** Fünfzehn vollständige Belege
   lägen dauerhaft im Spielstand; gelesen wird die Summe. Dieselbe Abwägung wie
   bei den Einzelspielen. Der volle Beleg kommt als Rückgabewert.
7. **`mitWirtschaft` für alte Spielstände.** Ergänzt wird beim **Lesen**, nicht
   beim Speichern: ein Spielstand aus 35.192 muss sich öffnen lassen, ohne dass
   ihn vorher jemand anfasst. Geprüft wird auf endliche Zahl statt auf
   Wahrheitswert, damit eine gespeicherte 0 nicht als „fehlt" gilt.

**Geprüft:** `npm test` **149/149** (vorher 144), `npm run build` erfolgreich.
Fünf neue Regressionen in `tools/regression.test.cjs`, also am zusammengebauten
`App.jsx` und nicht an einer Nachbildung: Abrechnung und Fortschreibung,
abgeleitete Ligastufe, alter Spielstand ohne jedes Wirtschaftsfeld,
Reproduzierbarkeit bei festgehaltenem Würfel, fünfzehn Jahre am Stück ohne
NaN. **Gegenprobe gemacht:** lässt man die Kasse aus der Fortschreibung weg,
werden Prüfung 48 und 50 rot; lässt man die Chronik-Kurzfassung weg, Prüfung 48.

**DER WICHTIGE BEFUND — bitte vor der Abnahme lesen.**

Der Anschluss funktioniert. Genau deshalb zeigt er etwas, das vorher niemand
sehen konnte. Fünfzehn Jahre durch den echten Spielablauf, Kader aus Spielern
der Stärke 70, `zufallSetzen(20260917)`:

| Jahr | Liga | Plätze | Einnahmen | Kosten | davon Gehälter | Kasse |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 3. Liga | 8.000 | 18,3 | 17,2 | 11,1 | 7 |
| 2 | 2. Bundesliga | 8.000 | 32,3 | 29,0 | 21,6 | 16 |
| 3 | Bundesliga | 8.000 | 35,1 | 62,5 | 52,3 | −1 |
| 15 | Bundesliga | 8.000 | 32,4 | 75,7 | 64,0 | **−289** |

Über fünf Kaderstärken gerechnet, gleiches Verfahren: Stärke 48 endet bei +27,
Stärke 55 bei −10, 62 bei −55, 70 bei −289, 78 bei −556.

Die Ursache steht in der Spalte **Plätze**: sie ändert sich nie. `bauStart` und
`ausbauKaufen` haben noch keinen Aufrufer — das ist WIRT-P0-03. Die Einnahmen
bleiben deshalb auf dem Stand des Gründungsstadions, während die Gehälter der
Liga folgen. Ein Erstligist mit 8.000 Plätzen und 64 Mio Gehältern geht
zugrunde, und das ist sachlich richtig — nur kann der Spieler nichts dagegen
tun, solange er nicht bauen darf.

**Das ist kein Fehler im Anschluss, sondern der Beweis, dass die Ausgabeseite
fehlt.** Ich habe es deshalb NICHT wegkalibriert: die Gehälter so weit zu
senken, dass ein Verein ohne Stadion überlebt, würde genau die Entscheidung
entwerten, die P0-03 erzeugen soll.

**Daraus eine Reihenfolgeregel, die ich zur Abnahme mitvorlege:** P0-02 und
P0-03 gehören in derselben Auslieferung zum Spieler. Wer P0-02 allein
freigibt, liefert eine Wirtschaft, die nur verlieren kann. Nach `main` darf
dieser Zweig trotzdem — sichtbar wird davon nichts, solange der
Vereinsbildschirm die Kasse nicht anzeigt.

**Offen bleibt:**

- **WIRT-P0-03 ist jetzt zwingend**, nicht mehr nur der nächste Punkt.
- **Der Gehaltssprung beim Aufstieg** ist die nächste echte Balance-Frage:
  Stufe 2 → 1 verdreifachte die Gehälter (21,6 → 52,3), die Einnahmen stiegen
  um 2,8. Ob ein Aufsteiger das mit Ausbau auffangen kann, ist erst nach P0-03
  messbar.
- **Folgen einer leeren Kasse** gibt es weiterhin keine (WIRT-P1-04). Die Kasse
  läuft ins Minus, ohne dass etwas passiert — bewusst, aber jetzt sichtbarer.
- **Kein Gerätetest**, keine Oberfläche. Der Spieler sieht von all dem nichts.

## WIRT-P0-03 — Ausbau kostet Geld, VC nur noch vier Extras (Claude, 17.09.2026)

**Basis-Commit:** `9ad335a` (Zweig `claude/wirt-p0-02`, Pull Request #9).
**Branch:** `claude/wirt-p0-03`. **Vorgelegt zur Abnahme, nicht zusammengeführt.**
Die Kette ist `claude/vereinswirtschaft` → `claude/wirt-p0-02` → dieser Zweig.

**Auftrag.** Kevins ursprüngliche Vorgabe, jetzt eingelöst: „Das man keine VC in
etwas versenkt was nach 15 Saison eh verschwindet. Lediglich gewisse extra Bonis
und Ausbauten sollen mit VC möglich sein."

**Was geändert wurde:**

1. **`VEREIN.ausbauen` (VC) ist gelöscht, nicht stillgelegt.** Eine unbenutzte
   Funktion, die noch dasteht, wird in der nächsten Runde wieder aufgerufen.
   Eine eigene Regression hält fest, dass es sie nicht mehr gibt.
2. **Ein Katalog statt zwei.** Der alte `VEREIN_AUSBAU` in `verein.js` ist weg;
   `VEREIN_AUSBAU` zeigt jetzt auf `WIRT.AUSBAU`. Zwei Listen mit denselben
   Kennungen und verschiedenen Preisen wären genau die Doppelung, die dieses
   Projekt schon einmal Geld gekostet hat.
3. **Aus Kaufen wird Planen.** `bauStarten` bezahlt sofort und baut über bis zu
   zwei Saisons. Der Name verschweigt nicht, dass die Stufe erst später wirkt.
4. **Die Oberfläche trennt die Währungen sichtbar.** Oben die Kasse in der
   Landeswährung samt laufender Baustellen, darunter die sechs Abteilungen mit
   Geldpreisen, und erst danach — eigener Abschnitt — die vier VC-Extras. Keine
   Zeile, in der beides nebeneinander steht. Fehlt Geld, nennt der Bildschirm
   die Lücke, statt den Knopf wortlos zu sperren.
5. **`startReiter` am `VereinScreen`**, wie ihn der `Packladen` schon hatte:
   der Prüfstand soll einen Reiter aufschlagen können, ohne einen Klick
   nachzubauen. Im Spiel wird er nicht gesetzt.

**Geprüft:** `npm test` **154/154** (vorher 149), `npm run build` erfolgreich.
Fünf neue Regressionen: die alte VC-Funktion ist nachweislich verschwunden und
der Katalog einer; Bauen prüft vor dem Schreiben, bucht genau einmal ab, sperrt
dieselbe Abteilung und erlaubt eine andere; VC-Extras nur einmal, mit Prüfung
vor der Buchung; die Ausbauwirkungen im Spiel hängen weiter an denselben
Kennungen (sonst hätte ein ausgebautes Trainingszentrum stumm aufgehört zu
wirken); und der Ausbaureiter rendert Geld und VC getrennt, ohne NaN.

**DIE FRAGE AUS P0-02 IST BEANTWORTET — teilweise, und unbequem.**

Gleicher Lauf wie dort, einmal ohne und einmal mit Ausbau:

| Kaderstärke | ohne Bauen | mit Bauen | erreichter Ausbau |
|---:|---:|---:|---:|
| 48 | +27 | −8 | 9/30 |
| 55 | −10 | −19 | 5/30 |
| 62 | **−55** | **+11** | 18/30 |
| 70 | −289 | −183 | 8/30 |
| 78 | −556 | −539 | 1/30 |

**Bauen rettet die Mitte, nicht die Spitze.** Stärke 62 dreht das Minus in ein
Plus und erreicht 18 von 30 Stufen — genau der Verlauf, den das System erzeugen
soll. Stärke 78 erreicht **eine** Stufe: die Gehälter fressen den Ertrag, bevor
gebaut werden kann, und wer einmal hinten liegt, baut sich nicht mehr heraus.

Die Ursache ist der Exponent 4 auf die Spielerstärke. Bei der Kalibrierung
rechnete er gegen eine GESCHÄTZTE Stärke von 74 in der ersten Liga; ein Spieler,
der seine Akademie ausreizt, kommt darüber, und (78/60)^4 ist ein Viertel teurer
als (74/60)^4 — bei jedem Spieler, in jeder Saison.

**Ich habe das nicht geändert.** Es ist eine Balance-Entscheidung, sie gehört
Kevin, und sie ungefragt zu treffen hiesse, seinen ausdrücklichen Auftrag
(„Gehälter steigen bei langanhaltendem Erfolg") nach eigenem Gutdünken wieder
abzuschwächen. Drei Wege, absteigend nach Eingriffstiefe:

1. **Exponent 4 → 3 oder 3,5.** Trifft genau die Spitze, lässt die Mitte fast
   unberührt. Am zielgenauesten, meine Empfehlung.
2. **Obergrenze des Gehaltsniveaus von 2,00 auf etwa 1,6.** Einfach, nimmt aber
   auch dem mittleren Verein Druck.
3. **Einnahmen der ersten Liga anheben.** Löst es auch, macht den Aufstieg aber
   wieder zum Selbstläufer — vermutlich falsch.

**Offen bleibt:**

- **Die Balance-Entscheidung oben.** Bis dahin ist die Spitze unspielbar.
- **WIRT-P0-04** (Sponsorenwahl) und **P1-01** (Saisonabrechnung sichtbar): der
  Spieler sieht bis jetzt nicht, WOHER das Geld kam. Er sieht nur den Stand.
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.** Sie rechnen
  mit den Vorgabewerten mit; einstellen kann man sie nicht.
- **Die Versionsnummer bleibt 35.192.0.** Diese Runde ändert Spielverhalten und
  müsste sie bei einer neuen APK erhöhen — das entscheidet Codex beim Ausliefern,
  nicht ich auf dem Zweig.
- **Kein Gerätetest.**

## WIRT-P0-04 — Sponsorenwahl, und eine Korrektur an mir selbst (Claude, 17.09.2026)

**Basis-Commit:** Stand des Zweigs `claude/wirt-p0-03` (Pull Request #11).
**Branch:** `claude/wirt-p0-04`. **Vorgelegt zur Abnahme.**
Kette: `claude/vereinswirtschaft` → `wirt-p0-02` → `wirt-p0-03` → dieser.

### Zuerst die Korrektur, weil sie das Wichtigere ist

Beim Aufräumen für dieses Paket ist aufgefallen, dass `sponsorAngebote` und
`sponsorAnnehmen` **null Aufrufer** hatten. Kein Verein im Spiel bekam je einen
Werbevertrag; eine ganze Einnahmesäule war nicht verdrahtet.

Das entwertet meine Begründung aus den beiden Vermerken davor. Die Läufe zu
P0-02 und P0-03 gingen durch den echten Spielablauf und hatten deshalb **keine
Sponsoren** — während die isolierte Kalibrierung, gegen die ich sie verglichen
habe, immer zwei Verträge je Saison annahm. Ich habe zwei Prüfstände mit
verschiedenen Einnahmequellen gegeneinandergestellt, als wären sie vergleichbar.
Der Bankrott von −451 Mio, mit dem ich eine Änderung der Gehaltskurve begründet
habe, kam fast vollständig aus der fehlenden Säule.

Nachgerechnet, gleicher Lauf, diesmal **mit** Sponsoren:

| Szenario | Exponent 4 | Exponent 3 |
|---|---:|---:|
| gewöhnlich, Saat 20260917 | +24, 9/30 | +22, 9/30 |
| gewöhnlich, Saat 4711 | +337, 30/30 | +337, 30/30 |
| starker Kader (70/82) | **+161**, 28/30 | +606, 30/30 |
| Liga 1 isoliert | 667 Mio, **167 Punkte** | 854 Mio, 214 Punkte |

Mit Exponent 4 war der starke Verein nie in Gefahr. Kevin hat daraufhin
entschieden: **Exponent bleibt 4, Pull Request #12 geschlossen, stattdessen
dieses Paket.** Die Ursache wird behoben, nicht das Symptom.

**Lehre, die im Arbeitsplan steht und hier wiederholt wird, weil sie Geld
gekostet hat:** eine Zahl aus dem isolierten Kern und eine aus dem Spielablauf
sind erst vergleichbar, wenn beide dieselben Einnahmequellen kennen. Wer eine
Stellschraube anfassen will, prüft zuerst, ob alle Posten einen Aufrufer haben.

### Was gebaut wurde

1. **Die Angebote liegen im Spielstand (`v.angebote`), nicht im Augenblick.**
   Das ist der Kern. Würden sie beim Zeichnen erzeugt, bekäme man bei jedem
   Aufschlagen des Bildschirms neue — und aus der Wahl würde ein Automat, den
   man bis zum besten Angebot drückt. Sie werden einmal je Saison aus der Saat
   des Vereins gewürfelt und bleiben stehen, bis sie angenommen sind oder die
   Saison vorbei ist. `mitAngeboten` legt fehlende nach, damit alte Spielstände
   und der Augenblick nach der Einschreibung ohne Sonderfall auskommen.
2. **`sponsorAnnehmen` prüft vor dem Schreiben:** Platz frei, Angebot liegt
   wirklich vor, Firma nicht schon Partner. Ein abgelehnter Abschluss ändert
   gar nichts.
3. **Drei Partner gleichzeitig** (`SPONSOR_MAX`).
4. **Eigener Reiter im Vereinsbildschirm:** laufende Partner mit Betrag,
   Restlaufzeit und Vorteil; darunter die Angebote mit Betrag, Laufzeit,
   Gesamtwert und Vorteil. Ausgelaufene Verträge werden aus der Chronik
   gemeldet. Sind alle Plätze belegt, sagt der Bildschirm das, statt den Knopf
   wortlos zu sperren.
5. **Nach jeder Saison neue Angebote**, gewürfelt mit dem neuen Jahr in der
   Saat — sonst käme zweimal dieselbe Auswahl.

### Die Obergrenze ist gemessen, nicht gesetzt

Endkasse in Mio, erreichte Ausbaustufen in Klammern:

| Partner | gewöhnl. A | gewöhnl. B | gewöhnl. C | starker Kader | sehr stark |
|---:|---:|---:|---:|---:|---:|
| 2 | +2 (9) | +32 (27) | +54 (27) | −79 (10) | −491 (4) |
| **3** | **+5 (9)** | **+124 (29)** | **+122 (29)** | −194 (10) | −397 (5) |
| 4 | +11 (9) | +223 (30) | +174 (30) | −54 (11) | −349 (6) |
| 5 | +6 (10) | +199 (30) | +154 (30) | −38 (11) | −344 (7) |
| 6 | +17 (10) | +309 (30) | +345 (30) | +135 (27) | −261 (7) |

Drei ist der Vorschlag: der gewöhnliche Weg trägt und streut sichtbar — ein
Durchlauf endet knapp über null, zwei bauen fast alles. Bei sechs ist jede
Entscheidung weg, weil man einfach alles nimmt. Der sehr starke Kader bleibt bei
jeder Obergrenze im Minus; das ist kein Fall für mehr Einnahmen, sondern für
WIRT-P1-04.

**Geprüft:** `npm test` **158/158** (vorher 154), `npm run build` erfolgreich.
Vier neue Regressionen: Angebote überleben ein Neuladen und hängen am Verein,
nicht an einer Konstante; Unterschreiben prüft vor dem Schreiben und sperrt bei
vollen Plätzen; Verträge bringen mehr Einnahmen, laufen ab und werden gemeldet;
der Reiter rendert Angebote und laufende Verträge ohne NaN.
**Gegenprobe:** würfelt man die Angebote bei jedem Blick neu, werden alle vier
rot.

**Nachtrag vom selben Tag, weil der Fehler sich wiederholen kann.** Der
Statuseintrag dieses Pakets im Arbeitsplan („BEREIT" statt „VORGELEGT") ist
beim ersten Anlauf verlorengegangen: Das Änderungsskript hatte vier
Ersetzungen, lief bei der zweiten auf einen Fehlschlag und schreibt die Datei
erst am Ende — die erste, im Speicher bereits erledigte Ersetzung fiel damit
weg. Nachgezogen wurde danach nur der Teil, der aufgefallen war.

Gefunden hat es niemand beim Lesen des Vermerks, sondern erst ein späterer
Blick auf die Paketliste. **Wer mehrere Ersetzungen in einem Skript
zusammenfasst, schreibt nach jeder oder prüft danach das Ergebnis** — ein
Abbruch in der Mitte sieht sonst aus wie „nichts passiert", ist aber
„teilweise passiert und alles verworfen".

**Offen bleibt:**

- **WIRT-P1-01 — Saisonabrechnung sichtbar.** Der Spieler sieht jetzt, wo das
  Geld herkommt, aber noch nicht, wohin es geht.
- **WIRT-P1-05 — Abschluss.** `abschlussWirtschaft` hat weiterhin null
  Aufrufer: die Restkasse wird beim Vereinsende nicht zu Vermächtnispunkten.
- **WIRT-P1-04 — Folgen einer leeren Kasse.** Für den sehr starken Kader die
  einzige Antwort, die bleibt.
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.**
- **Kein Gerätetest.**

## WIRT-P1-01 — Die Saisonabrechnung wird sichtbar (Claude, 17.09.2026)

**Basis-Commit:** Stand des Zweigs `claude/wirt-p0-04` (Pull Request #13).
**Branch:** `claude/wirt-p1-01`. **Vorgelegt zur Abnahme.**
Kette: `claude/vereinswirtschaft` → `wirt-p0-02` → `wirt-p0-03` → `wirt-p0-04`
→ dieser.

**Das Problem.** Seit P0-02 wird jede Saison abgerechnet, seit P0-03 gibt der
Verein Geld aus und seit P0-04 nimmt er welches ein. Der Spieler sah davon
genau eine Zahl: den Kassenstand. Warum er sich verändert hatte, stand
nirgends — und damit war jede wirtschaftliche Entscheidung eine Wette ohne
Rückmeldung.

**Was gebaut wurde.** Der Beleg aus `vereinSaison` wandert in
`p.vereinBericht.wirtschaft` und wird im Abschlussbildschirm unter der
bestehenden Vereinskachel gezeigt:

- jeder Einnahme- und Ausgabeposten einzeln, mit Vorzeichen und Farbe,
- Wirtschaftsereignisse mit Betrag **und Text** — ein Sturmschaden soll erzählt
  werden, nicht nur gebucht,
- die Vorstandsprämie als Posten, ein verfehltes Ziel als eigene Zeile,
- Ergebnis und neuer Kassenstand,
- Zuschauerschnitt und Auslastung, fertig gewordene Bauprojekte, ausgelaufene
  Werbeverträge.

**DIESELBE QUELLE WIE DIE BUCHUNG.** Der Beleg wird gelesen, nicht nachgerechnet
— dieselbe Regel wie beim Coinbeleg am Karriereende. Zwei Rechnungen laufen
früher oder später auseinander, und dann glaubt der Spieler der falschen.

**Mitgenommen wird der Beleg EINER Saison, nicht die Chronik.** Fünfzehn
gehörten nicht in einen Karrierebericht, der ein Jahr zusammenfasst.

**Geprüft:** `npm test` **160/160** (vorher 158), `npm run build` erfolgreich.
Zwei neue Regressionen: der Bericht zeigt **jeden** gebuchten Posten (Einnahmen
wie Ausgaben, namentlich abgeglichen) samt Zuschauerzahl, und ein Bericht ohne
Wirtschaftsteil bleibt unverändert lesbar; dazu verfehltes und erfülltes Ziel,
fertige Bauten, ausgelaufene Verträge und Ereignistexte.
**Gegenprobe:** lässt man die Ausgabenzeilen weg, wird die erste rot
(„Ausgabe fehlt: Spielergehälter · 18 Spieler, Ø 62").

**Eine Fussnote zum Prüfstand.** Zwei Anläufe sind an handgebauten
Spielerständen gescheitert (`p.nat.flag`, dann `p.club.tier`) — der
Abschlussbildschirm liest mehr Felder, als man beim Nachbauen ahnt. Die
Regression benutzt jetzt einen echten, über `runFinish` abgeschlossenen
Spieler. Das ist die Regel, nicht die Ausnahme: ein erfundener Zustand prüft,
was man sich vorstellt, ein erzeugter prüft, was passiert.

**Offen bleibt:**

- **WIRT-P1-05 — Abschluss.** `abschlussWirtschaft` hat weiterhin null
  Aufrufer: die Restkasse wird beim Vereinsende nicht zu Vermächtnispunkten.
  Danach wäre der Gerätetest sinnvoll.
- **WIRT-P1-04 — Folgen einer leeren Kasse.**
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.**
- **WIRT-P1-02 — Stadionausbau spürbar machen.**
- **Kein Gerätetest.**

## WIRT-P1-05 — Die Restkasse zählt beim Abschluss (Claude, 17.09.2026)

**Basis-Commit:** Stand des Zweigs `claude/wirt-p1-01` (Pull Request #15).
**Branch:** `claude/wirt-p1-05`. **Vorgelegt zur Abnahme.**
Kette: `vereinswirtschaft` → `p0-02` → `p0-03` → `p0-04` → `p1-01` → dieser.

**Das Problem.** `abschlussWirtschaft` war seit dem Wirtschaftskern fertig und
geprüft — und hatte **null Aufrufer**. Was am Ende der fünfzehn Jahre in der
Kasse lag, verfiel. Damit war Wirtschaften ab dem Jahr, in dem alles gebaut
war, gleichgültig, und genau das sollte die Umstellung auf Geld abschaffen.

**Was geändert wurde:**

1. **`abschluss` addiert die Kassenpunkte.** Vier Millionen ergeben einen
   Punkt, gedeckelt bei 250 — zum Vergleich wiegt ein Aufstieg 120 und eine
   Meisterschaft 90. Spürbar, aber kein Ersatz für Sport. Schulden zählen nicht
   negativ; der Abschluss soll nicht zweimal bestrafen.
2. **Der Plakettenfaktor wirkt auf beide Teile, jeden genau einmal.** Das
   VC-Extra „Vermächtnisplakette" verspricht „+15 % Abschlusspunkte", nicht
   „+15 % auf den Kassenanteil". `abschlussWirtschaft` rechnet ihn in seinen
   eigenen Punktwert ein; der sportliche Teil wird in `abschluss` einmal damit
   multipliziert. Eine Regression prüft, dass das Verhältnis 1,15 bleibt —
   doppelt angewandt wären es 1,32.
3. **Mehr Punkte heissen auch mehr VC und frühere Boni.** Gewollte Folge, kein
   Nebeneffekt: `vc` und `BONI` hängen an derselben Punktzahl.
4. **Der Abschlussbildschirm zeigt die Aufteilung** („… sportlich · … aus der
   Kasse") und nennt die Plakette, wenn sie gekauft wurde. Ohne diese Zeile
   sähe der Spieler nur eine gewachsene Zahl und würde beim nächsten Verein
   wieder alles bis zur letzten Mark verbauen. War die Kasse leer, sagt der
   Bildschirm auch das.

**Geprüft:** `npm test` **164/164** (vorher 160), `npm run build` erfolgreich.
Vier neue Regressionen: die Kasse zählt mit 4 Mio je Punkt, Schulden nicht
negativ, der Deckel hält; die Plakette wirkt auf beide Teile und genau einmal;
ein Verein ohne Wirtschaftsfelder bleibt abschliessbar und erfindet nichts;
der Abschlussbildschirm nennt Aufteilung, leere Kasse und Plakette.
**Gegenprobe:** lässt man die Kassenpunkte wieder weg, werden zwei davon rot.

Dafür ist der Prüfstand um `renderVereinAbschluss` gewachsen — der
Abschlussbildschirm hatte bis jetzt keinen.

**Damit ist die Wirtschaft vollständig durchgeschaltet:** Geld wird eingenommen
(P0-04), ausgegeben (P0-03), abgerechnet (P0-02), angezeigt (P1-01) und zählt
am Ende (P1-05). **Ab hier ist ein Gerätetest sinnvoll.**

**Offen bleibt:**

- **WIRT-P1-04 — Folgen einer leeren Kasse.** Die Kasse darf weiterhin ins
  Minus laufen, ohne dass etwas passiert. Für den sehr starken Kader, der seiner
  Infrastruktur davongelaufen ist, die einzige verbleibende Antwort.
- **WIRT-P1-02 — Stadionausbau spürbar machen.**
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.** Sie rechnen
  mit den Vorgabewerten mit; einstellen kann man sie nicht.
- **Die Versionsnummer bleibt 35.192.0.** Die Kette ändert Spielverhalten und
  müsste sie bei einer neuen APK erhöhen — das entscheidet Codex beim
  Ausliefern.
- **Kein Gerätetest.** Jetzt wäre er dran.
## Nachbesserung nach Gegenlesen — Wirtschaftskern (Claude, 17.09.2026)

Nach dem Bau der ganzen Kette habe ich den eigenen Diff systematisch
gegengelesen. Drei Befunde betreffen diesen Zweig; keiner davon ist von den
Regressionen gefunden worden, weil sie prüfen, dass die Rechnung **in sich**
stimmt — nicht, ob sie das **Richtige** rechnet.

**1. Die Stimmung fiel jede Saison, ohne dass jemand etwas tat.** Der
Stimmungsschaden mass den Abstand zum ertragreichsten Preis. Der liegt fast
überall UNTER 1 (gemessen: Liga 1 0,22, Liga 3 0,24, selbst ein voll
ausgebauter Drittligist 0,34) — und 1 ist die Voreinstellung, hinter der keine
Entscheidung steht. Gemessen an einem Drittligisten auf Platz 9: 60 → 55 → 54
→ 47 → 42 → 37 → 31 → 23 in acht Saisons, danach gegen null. Da die Stimmung
auf Auslastung und Merchandising wirkt, war es eine Abwärtsspirale — und eine
Preisoberfläche, mit der man hätte gegensteuern können, gibt es nicht.
**Der Normalpreis ist kein Übergriff:** die Grenze ist jetzt nie kleiner als 1.
Derselbe Lauf endet nun bei 67 statt 23. Überteuerung kostet weiterhin.

**2. Die Vermächtnisplakette hob den Punktedeckel an.** Der Faktor wurde NACH
der Deckelung angewandt: aus 250 wurden 288, während drei Stellen „gedeckelt
bei 250" behaupteten. Jetzt wird erst gerechnet, dann gedeckelt.

**3. „Scoutnetz" war ein Placebo für 70 VC.** Das Extra versprach „Bleibt der
Akademie erhalten" über ein Feld `akademieAufnahmen`, das niemand liest. Es ist
**ersatzlos entfernt** statt notdürftig verdrahtet: der naheliegende Anker
`bonus.aufnahmen` aus den Abschluss-BONI wird ebenfalls nur ANGEZEIGT und nie
gelesen (App.jsx:9483, bestehender Code, nicht aus dieser Runde). An etwas
anzudocken, das selbst nichts tut, wäre derselbe Fehler mit mehr Zeilen.

**Dazu zwei Prüfungen, die nichts geprüft haben:**
`assert.equal(e.zuschauer, Math.round(plaetze * auslastung))` war tautologisch —
`auslastung` wird aus `zuschauer` berechnet, die Gleichung gilt für jede
Umsetzung. Und der Grenzfall setzte `baustelle` im Singular, ein Rest des
verworfenen Entwurfs, den kein Code liest; die halbfertige Baustelle, die der
Testname verspricht, kam nie vor.

**Geprüft:** `npm test` 147/147 (vorher 144). Drei neue Regressionen: die
Stimmung fällt bei Voreinstellung in keiner Ligastufe, der Deckel hält auch mit
Plakette, und **jedes VC-Extra muss über einen Schlüssel wirken, den jemand
liest** — die Prüfung, die „Scoutnetz" verhindert hätte.

**Offen für Codex:** `bonus.aufnahmen` in den Abschluss-BONI hat keinen Leser.
Das ist bestehender Code, nicht aus dieser Runde — deshalb nur vermerkt.

## Nachbesserung nach Gegenlesen — Anschluss (Claude, 17.09.2026)

Vier Befunde aus dem Gegenlesen betreffen diesen Zweig. Wie bei der Wurzel gilt:
keiner ist von den Regressionen gefunden worden.

**1. Nach einem Aufstieg war das Vorstandsziel unerreichbar.** Der Kommentar
behauptete „nach einem Aufstieg ist Klassenerhalt die Ansage, nicht der Titel" —
die Rechnung reichte aber nur die neue Ligastufe weiter und weiterhin den
**alten Tabellenplatz**, aus dem `zielSetzen` das Ziel ableitet. Ein Meister,
der aufstieg, bekam „Um den Titel spielen" mit Soll 1 in der Liga darüber, und
die Prämie wurde nie gezahlt. Umgekehrt bekam ein Absteiger „Klassenerhalt" in
einer Liga, die er vermutlich dominiert. Ein Tabellenplatz aus einer anderen
Liga ist keine Aussage über die neue: ein Aufsteiger gilt jetzt als Letzter, ein
Absteiger als Dritter.

**2. Die Gehälter wurden mit dem gealterten Kader gerechnet.** Die
Entwicklungsschleife ändert Alter und Stärke **in place** und reicht dieselben
Objekte weiter; die Abrechnung bekam damit die Stärken der KOMMENDEN Saison.
Schon ein gewöhnlicher Zuwachs von +2 verteuert 18 Erstligaspieler von 30,0 auf
33,6 Mio — jedes Jahr, von der Gehaltsratsche weiter aufgeschlagen. Jetzt wird
der Kader kopiert, bevor irgendetwas altert.

**3. Zwei Sponsorenwirkungen hatten keinen Leser.** `medizin` (Vitalis: „wirkt
wie eine Stufe Medizin") und `jugend` (Almgut: „Nachwuchs entwickelt sich etwas
schneller") wurden von `wirkung` summiert und von niemandem abgeholt — die
Verträge versprachen etwas, das nicht geschah. Beide werden jetzt in der
Entwicklungsschleife gelesen.

**4. Die abgeleitete Ligastufe landete im Spielstand.** `mitWirtschaft` schreibt
sie auf das zurückgegebene Objekt, und mehrere dieser Objekte werden gespeichert
— nach einem Aufstieg stünde dort ein veralteter Wert. Noch liest niemand das
rohe Feld, aber es war eine geladene Waffe. `ohneAbgeleitetes` entfernt sie am
Speicherrand.

**Noch offen aus diesem Befundsatz:** die Wirtschaftszahlen der Chronik haben
weiterhin nur einen Leser (`ausgelaufen`). Die Anzeige braucht `geldText` und
zieht deshalb nach WIRT-P0-03 um.

**Geprüft:** `npm test` 157/157 (vorher 152), `npm run build` erfolgreich. Fünf
neue Regressionen, darunter ein Lauf, der bis zu einem echten Aufstieg spielt
und prüft, dass das neue Ziel kein Soll 1 trägt.

## Nachbesserung nach Gegenlesen — Ausbau (Claude, 17.09.2026)

Zwei Punkte aus dem Befundsatz, die erst hier möglich waren:

**1. Die Chronik zeigt die Wirtschaft des Jahres.** Die Kurzfassung lag seit
WIRT-P0-02 im Spielstand und hatte genau einen Leser (`ausgelaufen`) — acht
weitere Felder wurden in jeden Spielstand geschrieben und von niemandem
gelesen. Das ist der Fehler, den dieses Projekt selbst zweimal anschreibt
(„Ein Feld ohne Leser waere wieder nur eine Zahl"). Jetzt steht im Chronikjahr
Ergebnis, Kassenstand, Zuschauerzahl, Stimmung, Gehaltsniveau, das
Vorstandsziel samt Ausgang, die Ereignisse und ausgelaufene Verträge. Die
Anzeige braucht `geldText` und war deshalb in P0-02 nicht möglich.

**2. Bauen und VC-Extras speichern nichts Abgeleitetes mehr.** `bauStarten`
und `extraKaufen` geben ein `mitWirtschaft`-Ergebnis zurück, das direkt in den
Spielstand wandert — samt der abgeleiteten Ligastufe. `ohneAbgeleitetes`
entfernt sie jetzt an beiden Stellen.

**Dazu nachgezogen:** die Zahl der VC-Extras von vier auf drei. „Scoutnetz" ist
bei der Nachbesserung des Wirtschaftskerns ersatzlos entfernt worden, weil es
für 70 VC über ein Feld wirkte, das niemand liest.

**Geprüft:** `npm test` 164/164, `npm run build` erfolgreich. Zwei neue
Regressionen: die Chronik zeigt Kasse, Zuschauer und Stimmung ohne NaN, und
weder Bau noch Extrakauf legen die Ligastufe in den Spielstand.

## Nachbesserung nach Gegenlesen — Sponsoren (Claude, 17.09.2026)

**1. Der angezeigte Betrag war nicht der, der ankommt.** Die Abrechnung bucht
`betrag × kommerz` der Rechtsform — ein e.V. bekommt 92 Prozent, und da es
keine Oberfläche für die Rechtsform gibt, ist jeder Verein im Spiel ein e.V.
Die Oberfläche zeigte den Bruttobetrag: ein Angebot über 2,97 Mio tauchte im
Beleg als 2,73 Mio auf, und bei einem Vierjahresvertrag lag die genannte
Gesamtsumme rund eine Million daneben. Wer Angebote vergleicht, verglich Zahlen,
die nie eintreffen — und das ist die einzige Entscheidung, die dieses Paket
erzeugt. `werbeErtrag` rechnet es jetzt an einer Stelle, für Buchung wie
Anzeige; ein Satz im Reiter sagt auch, warum weniger ankommt als verhandelt.

**2. Alle Angebote unterschrieben hiess: drei neue.** `mitAngeboten` prüfte
`Array.isArray(angebote) && angebote.length` und legte bei einer LEEREN Liste
nach. Wer alle drei Angebote einer Saison annahm, bekam beim nächsten Blick auf
den Bildschirm sofort drei frische — genau der Automat, den das Paket
verhindern soll, und die Zeile „Für diese Saison liegt nichts mehr vor." war
unerreichbarer toter Code. Jetzt wird nur ein FEHLENDES Feld nachgelegt; alte
Spielstände bekommen weiterhin ihre Auswahl.

**Geprüft:** `npm test` 170/170, `npm run build` erfolgreich. Zwei neue
Regressionen: der angezeigte Betrag stimmt mit dem gebuchten Posten überein,
und eine leergeräumte Angebotsliste bleibt leer.

## Nachbesserung nach Gegenlesen — Saisonabrechnung (Claude, 17.09.2026)

**Stimmung und Gehaltsniveau fehlten im Beleg.** Beide treiben die ganze
Wirtschaft — die Stimmung über Auslastung und Merchandising, das Gehaltsniveau
über die Ratsche — und **keine der beiden Zahlen tauchte irgendwo im Spiel
auf**. Der Spieler sah Zuschauer und Merchandising Jahr für Jahr sinken und die
Gehaltszeile steigen, ohne zu erfahren, dass es diese Werte überhaupt gibt.

Beide stehen jetzt im Karrierebericht, und zwar **mit Richtung**: „Stimmung 64
(+4) · Gehaltsniveau 118 % und steigend". Ein Wert, der sich bewegt, ist erst
als Bewegung eine Auskunft.

**Geprüft:** `npm test` 172/172, `npm run build` erfolgreich. Die bestehende
Belegprüfung verlangt jetzt beide Angaben.
## Nachbesserung, zweiter Durchgang (Claude, 18.09.2026)

Die beiden letzten offenen Punkte aus dem Gegenlesen.

**1. Jede Saisonabrechnung rechnete 153 vollständige Einnahmerechnungen für
einen einzigen Skalar.** `ueberzogen` ruft `bestPreis` für drei Felder, jeder
Aufruf sucht in 51 Schritten und rechnet bei jedem Schritt die vollen
Saisoneinnahmen — Ergebnis bis auf eine Zahl weggeworfen.

Die Abkürzung ergibt sich aus der Korrektur des Vortags. Der Term ist
`max(0, preis − max(1, optimum))`; für `preis ≤ 1` ist er **immer** null, ganz
gleich wo das Optimum liegt. Also braucht es das Optimum dort auch nicht —
keine Näherung, dieselbe Zahl auf kürzerem Weg. Und weil es keine
Preisoberfläche gibt, steht überall die Voreinstellung 1: **50 Abrechnungen
fallen von 51 auf 17 ms**, bei unverändertem Ergebnis (Normalpreis 60,
Wucherpreis 30, vorher wie nachher).

Eine Regression prüft die Grenze von beiden Seiten: unterhalb und bei 1 kostet
der Preis nichts, darüber fällt die Stimmung monoton. Eine falsche Abkürzung
zeigte sich dort als Knick.

**2. `browser.yml` hatte den Zeilenumbruch am Dateiende verloren.** Eine
unveränderte Zeile stand dadurch als `-/+`-Paar im Diff und hätte künftig jeden
Vergleich verrauscht und `git blame` auf diesen Zweig gezeigt. Wiederhergestellt.

**Nicht angefasst:** `tools/spieltest.cjs` und `tools/browser/charakter.spec.js`
fehlt derselbe Umbruch — der fehlt aber schon auf `main` und stammt nicht aus
dieser Runde. Vermerkt statt nebenbei miterledigt.

**Geprüft:** `npm test` 148/148 (vorher 147).

## Nachtrag aus dem Gerätetest: Null ist nicht „0 Tsd" (Claude, 18.09.2026)

**Basis-Commit:** `23a7052` (Kopf dieses Zweigs).

Beim Rundgang durch die fertige Kette im Browser (siehe `BETA-HINWEIS.md` auf
`claude/beta-35.193`) stand die leere Vereinskasse als **„0 Tsd €"** da — im
Partnerkopf sogar in Erfolgsgrün. Das ist keine Aussage, das liest sich wie ein
Messfehler; „Tsd" sagt einem Leser, dass etwas gemessen wurde und klein ausfiel,
und genau das stimmt bei null nicht.

Die Ursache liegt hier und nicht in der Oberfläche: `geldText` fällt für alles
unter einer Million in den `Tsd`-Zweig, und null ist unter einer Million. Der
Sonderfall steht jetzt **vor** der Staffelung, damit er auch in Währungen greift,
deren Kurs die Null streckt (`0 × 160` ist in Yen ebenfalls null, landete vorher
aber genauso im `Tsd`-Zweig).

**Änderung:** eine Zeile in `geldText` — `x === 0` liefert `"0 €"` bzw. `"0"`.

**Geprüft:** `npm test` 148/148, unverändert grün; drei neue Zusicherungen in
der bestehenden Währungsprüfung (`€`, `¥`, ohne Symbol). **Gegenprobe:** nimmt
man die Zeile wieder heraus, wird `not ok 1 — Währung: Anzeige folgt dem Land,
Rechnung bleibt in Euro` rot.

**Warum der Vermerk hier und nicht auf dem Beta-Zweig:** gefunden wurde es dort,
zu Hause ist es hier. Läge die Korrektur nur in der Beta, ginge sie beim
Zusammenführen dieses Pull Requests verloren und der Fehler stünde in `main`.

**Offen, ausdrücklich nicht miterledigt:** die Oberfläche schreibt „Stärke 55.2"
mit Punkt, während Geld „11,6" mit Komma schreibt. Bestehender Code, nicht aus
dieser Runde.

## Nachtrag aus dem Gerätetest: die Lücke, die keine war (Claude, 18.09.2026)

**Basis-Commit:** Kopf dieses Zweigs nach dem Nachziehen von
`claude/wirt-p0-02` (enthält die `geldText`-Korrektur aus #6).

Im Ausbaureiter stand bei leerer Kasse zweimal dieselbe Zahl untereinander:

```
Bauen · 4 Mio €
Dafür fehlen 4 Mio €
```

Das ist logisch richtig und trotzdem unbrauchbar. Die Zeile „Dafür fehlen" wurde
in #11 gerade deshalb eingeführt, damit ein gesperrter Knopf nicht wortlos
dasteht — aber sie sagt nur dann etwas Neues, wenn schon **etwas** in der Kasse
liegt. Bei null ist die Lücke definitionsgemäß der Preis, und die Wiederholung
liest sich wie ein Stottern.

**Änderung:** die Zeile erscheint nur noch bei `VEREIN.kasse(v) > 0`. Der Preis
selbst steht unverändert auf dem Knopf, der Knopf bleibt gesperrt.

**Geprüft:** `npm test` 165/165, `npm run build` erfolgreich. Die bestehende
Prüfung des Ausbaureiters prüft die Grenze jetzt **von beiden Seiten** — bei
Kasse 0 darf die Zeile nicht erscheinen, bei Kasse 2 muss sie es. Nur die erste
Hälfte zu prüfen wäre der bequeme Fehler gewesen: eine Zeile, die nie mehr
erscheint, hätte sie ebenfalls bestanden. **Gegenprobe:** stellt man die alte
Bedingung wieder her, wird `not ok 54 — Der Ausbaureiter zeigt Geld und VC
getrennt, ohne NaN` rot.

**Gefunden beim Rundgang durch die Oberfläche im Browser**, nicht im Prüfstand:
der prüfte, dass die Zeile da ist, nicht ob sie etwas beiträgt.

## Nachtrag aus dem Gerätetest: der Reiter heißt „Partner" (Claude, 18.09.2026)

**Basis-Commit:** Kopf dieses Zweigs nach dem Nachziehen von
`claude/wirt-p0-03` (enthält die beiden Korrekturen aus #6 und #11).

Dieser Zweig hat dem Vereinsbildschirm einen **sechsten** Reiter gegeben. Beim
Rundgang im Browser bei 320 Pixeln stand „Chronik" dadurch außerhalb des Bildes
— erreichbar, weil die Leiste waagerecht scrollt, aber zwei Wischer entfernt und
ohne dass etwas darauf hindeutet, dass dort noch etwas kommt.

**Änderung:** die Beschriftung heißt „Partner" statt „Sponsoren". Die Kennung
`sponsoren` bleibt unverändert — sie steht in `startReiter`, im Prüfstand und
in gespeicherten Zuständen. Geändert wird nur, was der Spieler liest, und
„Partner" ist ohnehin das Wort, mit dem der Reiter sich selbst überschreibt
(„Partner · 0 von 3").

**Geprüft:** `npm test` 171/171, `npm run build` erfolgreich. Die bestehende
Prüfung des Reiters hält die Entscheidung jetzt fest: in der Reiterleiste steht
`Partner`, nicht `Sponsoren`, und `Chronik` steht weiter daneben.
**Gegenprobe:** mit der alten Beschriftung wird `not ok 60 — Der Sponsorenreiter
zeigt Angebote und laufende Verträge, ohne NaN` rot.

**Was diese Prüfung ausdrücklich NICHT tut:** nachweisen, dass die Leiste passt.
Ein Zeichenbudget wäre Scheingenauigkeit — die Schrift ist proportional, und
„Aufstellung" ist mit elf Zeichen länger als „Sponsoren" mit neun, ohne je
gestört zu haben. Gemessen wurde im Browser; festgehalten ist die Messung im
Browserlauf `tools/browser/beta-wirtschaft.spec.js` auf `claude/beta-35.193`.
Der kann hier nicht mitkommen, weil er die Testwerkzeuge der Beta braucht, um
überhaupt bis in den Spielbetrieb zu gelangen — vermerkt statt nachgebaut.

**Offen für Codex:** falls später ein siebter Reiter dazukommt, ist die
Kürzung verbraucht. Dann trägt die Leiste eher ein Überlaufzeichen als noch
kürzere Wörter.

## WIRT-P1-04 — Folgen einer leeren Kasse: Lizenzauflage (Claude, 18.09.2026)

**Basis-Commit:** `060a225` (`claude/wirt-p1-05`). Zur Abnahme durch Codex.

### Warum das Paket nötig war

Bis hierher durfte die Kasse beliebig tief ins Minus laufen, ohne dass etwas
geschah. Gemessen am echten Spielablauf (`VEREIN.vereinSaison`, fünfzehn
Saisons, Kader je Saison aus dem Nachwuchs aufgefüllt, zwei Saaten):

| Kaderstärke | ab Jahr im Minus | tiefster Stand |
|------------:|-----------------:|---------------:|
| 48 | – | 0 |
| 55 | 14 | −10 |
| 62 | 4–5 | −135 |
| 70 | 3–4 | −285 |
| 78 | **1** | **−703** |

Ein Spitzenkader steht **ab der ersten Saison** im Minus und endet bei einer
dreiviertel Milliarde Schulden. Kein Randfall, sondern der Normalfall ab
Stärke 62.

### Die Entscheidung und ein eigener Irrtum

Ich habe drei Mittel vorgelegt und zu einer Staffelung aus Zins und
Zwangsverkauf geraten, mit dem Einwand, Punktabzug allein löse das
wirtschaftliche Problem nicht. **Kevin hat Punktabzug gewählt.**

Der Einwand war **teilweise falsch**, und das gehört in den Vermerk, weil ihn
sonst der Nächste wiederholt: Punktabzug wirkt sehr wohl wirtschaftlich, nur
über den sportlichen Weg. Ein Abzug drückt in der Tabelle, das führt zum
Abstieg — und ein Abstieg **halbiert die Gehälter** (`kaderKosten` teilt durch
die Ligastufe) und senkt die Ratsche gleich dreifach über `ligaTeil`,
`platzTeil` und den Abstiegsmalus in `gehaltsZiel`.

**Er war aber auch nicht ganz falsch, und das ist der wichtigste Befund dieser
Runde.** Siehe „Was gemessen wurde".

### Was gebaut wurde

1. **`lizenzPruefung` im Rechenkern** (`vereinswirtschaft.js`, Leaf-Modul, reine
   Rechnung). Geduldet wird `max(2 Mio, halbe Saisoneinnahme)`. Darunter kostet
   es 3, 6 oder 9 Punkte, gestaffelt nach **Rahmen** unter der Linie.
   - **Der Rahmen hängt an den Einnahmen, nicht an einer festen Zahl.** 20 Mio
     sind für einen Erstligisten nichts und für einen Fünftligisten das Ende —
     dieselbe Falle wie beim Gehaltsteiler, die dieses Projekt schon einmal
     erlebt hat. Eine Regression prüft, dass gleich tief *in Rahmen* in jeder
     Liga gleich teuer ist.
   - **Der Rahmen sorgt dafür, dass Bauen nicht bestraft wird.** Wer sein Geld
     in eine Tribüne steckt, steht kurz im Minus und verdient danach mehr.
   - **3/6/9 ist keine erfundene Zahl**, sondern die Staffel, die DFL und DFB
     bei Lizenzverstössen tatsächlich verhängen.
   - **Die Einnahmen werden durchgereicht, nicht neu gerechnet.** Die Abrechnung
     hat sie ohnehin; sie ein zweites Mal zu holen wäre derselbe Fehler wie in
     `ueberzogen`, wo 153 vollständige Einnahmerechnungen je Saison für einen
     einzigen Skalar anfielen.
2. **`abzugAnwenden` in `verein.js`** zieht die Punkte ab, **sortiert die
   Tabelle neu und vergibt die Plätze neu**. Das ist der Kern: ein Abzug, der
   als Zahl danebensteht, während der Verein seinen erspielten Platz behält,
   wäre Kosmetik — genau die Sorte Feld ohne Leser, von der dieses Projekt
   schon mehrere hatte. Sortiert wird mit **demselben Vergleich** wie
   `ligaSpielen`; zwei Sortierungen für dieselbe Tabelle laufen auseinander,
   sobald jemand eine davon anfasst.
3. **Die Auflage trifft die kommende Saison**, nicht die abgelaufene. So macht
   es der Fussball auch, und anders ginge es gar nicht: die Tabelle steht schon.
4. **Drei Zustände, drei Aussagen in der Oberfläche.** Kasse im Plus: nichts.
   Kasse im Minus, aber im Rahmen: Vorwarnung. Auflage beschlossen: die Zahl,
   stehend im Vereinsbildschirm und im Saisonbeleg, dazu die abgelaufene
   Auflage in der Chronik. **Eine Strafe, die erst auffällt, wenn sie schon
   wirkt, lässt dem Spieler keine Gegenwehr.**

### Was gemessen wurde — auch das Unangenehme

Gegenprobe über acht Läufe, gleiche Saat, gleiche Saisonzahl, einmal mit und
einmal ohne Auflage:

| Stärke | Saat | ohne | mit | Punkte | Abstiege mit |
|---:|---:|---:|---:|---:|---:|
| 55 | beide | 0 / −10 | 0 / −10 | 0 | unverändert |
| 62 | 20260917 | −135 | **−107** | 48 | 3 (vorher 2) |
| 62 | 4711 | −53 | −53 | 12 | 3 |
| 70 | 20260917 | −269 | −323 | 84 | 1 (vorher 0) |
| 70 | 4711 | −285 | −293 | 66 | 1 |
| 78 | 20260917 | −703 | −662 | 84 | **0** |
| 78 | 4711 | −530 | −600 | 72 | **0** |

**Sportlich wirkt die Auflage, wirtschaftlich nicht.** Über eine Laufbahn
werden 48 bis 84 Punkte abgezogen, der 78er-Verein fällt im Schnitt von Platz
~2 auf 5,9 — das kostet Titel, Prämien und Stimmung. Auf die Schulden ist die
Wirkung dagegen **Rauschen in beide Richtungen** (+21 %, 0 %, −20 %, −3 %,
+6 %, −13 %).

**Der Grund ist gemessen, nicht vermutet:** der 78er-Verein steht **52 Punkte**
über dem Abstiegsplatz. Neun Punkte schließen ein Sechstel davon. Ein Kader,
der seiner Liga so weit davongelaufen ist, ist durch Punktabzug **nicht
absteigbar** — das ist keine Kalibrierfrage, sondern eine Grenze des Mittels.
Die Staffel höher zu drehen kauft nichts: auch dreissig Punkte reichten nicht,
und eine Tabelle mit dreissig Minuspunkten liest sich wie ein Anzeigefehler.

**Ich habe die Staffel deshalb nicht nachgeschärft.** Sie ist dort richtig, wo
sie verhältnismässig ist (Stärke 62: drei statt zwei Abstiege, Schulden von
−135 auf −107), und mehr ist mit diesem Mittel nicht zu holen.

### Geprüft

- `npm test` **184/184** (vorher 177), `npm run build` erfolgreich.
- Sieben neue Regressionen: der Rahmen hängt an den Einnahmen und behandelt
  alle Ligen gleich tief gleich teuer; die Staffel 3/6/9 samt Deckel und der
  Warnung innerhalb des Rahmens; die Abrechnung beschliesst aus der Kasse
  **nach** der Saison; der Abzug sortiert die Tabelle **wirklich** um (Platz,
  nicht Punktzahl, samt Tordifferenz-Gleichstand und Klemmung bei null); die
  Auflage der Vorsaison trifft die nächste und steht in der Chronik; alte
  Spielstände starten ohne Auflage und ein negativer Abzug wird nicht zum
  Geschenk; die Oberfläche unterscheidet die drei Zustände.
- **Die Zusicherung, die mir am wichtigsten ist:** die bestehende
  Fünfzehn-Jahres-Kalibrierung prüft jetzt zusätzlich, dass der **gewöhnliche
  Weg nie eine Auflage bekommt** (Liga 1 bis 5). Eine Strafe, die den
  Normalfall trifft, wäre ein Fehler, auch wenn sie richtig rechnet.
- **Drei Gegenproben, alle rot:** wird der Abzug nur durchgereicht statt
  angewandt, wird `not ok 66` rot; wird die Tabelle nicht neu sortiert,
  `not ok 65`; ist der Rahmen eine feste Zahl statt aus den Einnahmen,
  `not ok 152`.

### Zwei eigene Fehler auf dem Weg

Beide lagen in den **Prüfungen**, nicht im Code, und beide sind dieselbe Sorte:
Kopfrechnen an einer Staffel.

1. `kasse: -(rahmen*2)` sind **zwei Rahmen Schulden**, also **einer** unter der
   Linie — 3 Punkte, nicht 6. Die Prüfung erwartete 6.
2. 63 − 6 = 57 stand in der Testtabelle **gleich** mit dem Vierten, und die
   bessere Tordifferenz (+23 gegen +8) hielt den Verein auf Platz 3. Die
   Prüfung erwartete 4.

Beide stehen jetzt als Kommentar an der jeweiligen Prüfung. Der zweite ist
nachträglich der nützlichere Fall: er zeigt, dass **einsortiert** und nicht nur
abgezogen wird.

### Ausdrücklich offen

- **Lizenzentzug — Zwangsabstieg statt Punktabzug**, wenn die Auflage mehrere
  Saisons hintereinander greift. Dasselbe Verfahren, nur seine letzte Stufe,
  und nach der Messung das Einzige, was den extremen Fall schliesst. **Nicht
  gebaut, weil nicht beauftragt** — Entscheidung des Eigentümers.
- **Preise, Rechtsform und Vorstandsziel haben weiterhin keine Oberfläche.**
  Gerade beim Punktabzug fällt das auf: der Preishebel wäre eine der wenigen
  Stellschrauben, mit der ein verschuldeter Verein gegensteuern könnte.
- **WIRT-P1-02 — Stadionausbau spürbar machen.**
- **Kein Gerätetest.** Die Oberflächenteile sind im Prüfstand gerendert, aber
  niemand hat die Auflage im Spiel gesehen.

## WIRT-P1-04b — Lizenzentzug als letzte Stufe (Claude, 18.09.2026)

**Basis-Commit:** `f86ad78` (`claude/wirt-p1-04`). Zur Abnahme durch Astra.

### Warum es das Paket braucht

P1-04 hat seine eigene Grenze gemessen und offengelegt: der Punktabzug wirkt
sportlich, aber ein Kader, der seiner Liga weit davongelaufen ist, steht **52
Punkte** über dem Abstiegsplatz. Neun Punkte schließen ein Sechstel davon. Ein
78er-Verein blieb über fünfzehn Saisons oben und verschuldet, bei **null**
Abstiegen. Die Staffel höher zu drehen kauft nichts — auch dreissig Punkte
reichten nicht, und eine Tabelle mit dreissig Minuspunkten liest sich wie ein
Anzeigefehler.

### Die Regel

**Drei Saisons in Folge auf der höchsten Abzugsstufe** — also mehr als drei
Kreditrahmen unter der Linie — heisst Lizenzentzug: Zwangsabstieg, unabhängig
von der Tabelle. Dasselbe Verfahren wie in P1-04, nur seine letzte Stufe; 1860
München und Rangers sind genau das.

Vier Entscheidungen, die den Unterschied machen:

1. **Nur die höchste Stufe zählt.** Wer knapp unter der Linie steht, hat ein
   Problem; wer mehr als drei Rahmen darunter steht, hat keinen Betrieb mehr,
   den man genehmigen könnte.
2. **Besserung genügt, Gesundung nicht nötig.** Der Zähler springt auf null,
   sobald der Verein die höchste Stufe verlässt. Ein Ausweg, der nur über eine
   volle Kasse führte, wäre kein Ausweg, sondern eine verzögerte
   Unvermeidlichkeit.
3. **Zwei volle Saisons Vorwarnung**, sichtbar im Vereinsbildschirm mit Zähler
   und Ausweg. Ein Zwangsabstieg ohne Ansage wäre Willkür.
4. **Nach dem Entzug beginnt die Zählung von vorn**, und die offene Auflage ist
   abgegolten. Sonst stiege derselbe Verein jede Saison erneut ab, ohne je die
   Gelegenheit zu bekommen, sich unten zu fangen — und genau dort halbieren
   sich die Gehälter (`kaderKosten` teilt durch die Ligastufe). Das ist die
   eigentliche Wirkung dieser Stufe.

**Der Entzug schlägt das sportliche Ergebnis**, aber es bleibt bei **einer**
Liga: zweimal für dasselbe Jahr nach unten wäre Doppelbestrafung.

### Ein Nebenbefund aus dem Prüfstand

Beim Schreiben der Regression fiel auf: **ein Verein in der untersten Liga, dem
die Lizenz fehlt, wurde bei gutem Ergebnis befördert.** Der Entzug greift dort
mangels tieferer Liga nicht, und `neueLiga` zeigte munter nach oben. Wer keine
Lizenz für seine Liga bekommt, bekommt erst recht keine für die darüber — er
bleibt jetzt, wo er ist. Gefunden nicht durch Nachdenken, sondern weil die
Prüfung eine Zahl lieferte, die nicht passte.

### Was gemessen wurde

Gleiche Läufe wie in P1-04, gleiche Saaten, einmal mit und einmal ohne die
letzte Stufe:

| Stärke | Saat | ohne | mit | Entzüge | Endliga |
|---:|---:|---:|---:|---:|---|
| 62 | 20260917 | −107 | −105 | 1 | unverändert |
| 62 | 4711 | −53 | −51 | 0 | unverändert |
| 70 | 20260917 | −323 | **−228** | 2 | unverändert |
| 70 | 4711 | −293 | **−243** | 2 | unverändert |
| 78 | 20260917 | −662 | **−575** | 3 | **2. Bundesliga** statt Bundesliga |
| 78 | 4711 | −600 | **−486** | 2 | unverändert |

**13 bis 29 Prozent weniger Schulden genau dort, wo der Punktabzug allein
nichts ausrichtete** — und der Spitzenverein steht am Ende tatsächlich eine
Liga tiefer, statt fünfzehn Jahre unbehelligt oben zu bleiben.

**Geheilt ist er nicht, und das steht hier, weil es wichtig ist:** er pendelt.
Sportlich ist er zu stark für unten, finanziell zu schwach für oben, also
steigt er ab, kommt zurück, verliert die Lizenz wieder. Jede Runde nach unten
halbiert die Gehälter — deshalb die Besserung. Wer das für falsch hält, hat
einen Punkt; es ist aber eine kohärente Vereinsgeschichte und keine Sackgasse.

### Geprüft

- `npm test` **189/189** (vorher 184), `npm run build` erfolgreich.
- Vier neue Regressionen: der Zähler zählt nur die höchste Stufe und verzeiht
  Besserung (alle drei unteren Stufen setzen zurück); der Entzug steigt ab,
  obwohl der Verein sportlich gehalten hat; in der untersten Liga bleibt es
  beim Punktabzug **und der Verein steigt auch nicht auf**; die Oberfläche
  zählt die Jahre sichtbar mit und wird im letzten Jahr deutlich.
- **Drei Gegenproben, alle rot:** wirkt der Entzug nicht auf die Liga, wird
  `not ok 99` rot; setzt der Zähler bei Besserung nicht zurück, `not ok 159`;
  darf ein Verein ohne Lizenz aufsteigen, `not ok 100`.

### Ein eigener Fehler, der wichtiger ist als das Paket

Die erste Fassung der Entzugs-Regression prüfte nur, **dass sich die Liga
ändert**. Das erfüllt auch ein gewöhnlicher sportlicher Abstieg — und der
Testverein (Kader 60) wurde in der obersten Liga Letzter, stieg also ohnehin
ab. Die Gegenprobe „Entzug wirkt nicht auf die Liga" blieb deshalb **grün**:
die Prüfung mass gar nicht, was sie behauptete.

Behoben durch zweierlei: ein Kader, der sportlich hält (Stärke 84, also genau
das P1-04-Szenario), und eine ausdrückliche Zusicherung `abstieg === false`.
Erst damit isoliert sie den Zwangsabstieg. **Eine Gegenprobe, die grün bleibt,
ist ein Befund über die Prüfung, nicht über den Code** — das ist die Lehre, und
sie steht als Kommentar an der Regression.

### Ausdrücklich offen

- **Der Ausschluss aus dem Spielbetrieb** als Stufe unter dem Entzug. In der
  untersten Liga bleibt es beim Punktabzug; der Beleg sagt das, statt stumm
  nichts zu tun.
- **Kein Schuldenschnitt.** Ein Insolvenzverfahren würde die Schulden kürzen;
  das wäre eine eigene Entscheidung und hier bewusst nicht getroffen.
- **Kein Gerätetest.**

## WIRT-P0-05-UI — Vereinsführung bedienbar machen (Claude, 18.09.2026)

**Basis-Commit:** `2a483b1` (`claude/wirt-p1-04b-lizenzentzug`). Zur Abnahme
durch Astra.

### Drei fertige Systeme, die im Spiel nicht vorkamen

Seit WIRT-P0-05 rechnen Preise, Rechtsform und Vorstandsziel vollständig mit —
Elastizität nach Ansehen, Gastrostufe, Sortiment, Rechtsform und Stimmung; vier
Rechtsformen mit Einlage, Wechselkosten, Vermarktungsfaktor und Zielhärte; ein
Vorstandsziel je Saison mit Prämie. Geprüft war alles.

**Bedienen konnte man nichts davon.** Nachgezählt am Stand vor dieser Runde:

| | Vorkommen in `App.jsx` |
|---|---|
| `preisSetzen` | 0 (existierte nicht) |
| `rechtsformWechseln` | **0 Aufrufer** |
| `zielSetzen` | 0 (nur 4× in `verein.js`) |

Praktische Folge: `preisFaktor` las an jeder Stelle die Voreinstellung 1. Die
51-Werte-Rechnung in `bestPreis`, über die im Vermerk vom 17.09.2026 steht „der
Hinweis ist damit keine Schätzung mehr, sondern ein Versprechen", hatte
niemanden, dem sie etwas versprechen konnte.

### Was gebaut wurde

1. **Preise — drei Regler** mit dem gerechneten Ertragsmaximum als Hinweis. Wer
   darüber geht, sieht es in Rot und zahlt jede Saison Stimmung. **Der Hinweis
   ist kein Zwang:** Überteuern kann eine bewusste Entscheidung sein, und die
   Rechnung dahinter war immer schon darauf ausgelegt.
2. **Rechtsform** — der jeweils nächste Schritt mit Einlage, Kosten und
   Wirkung. Ist er nicht möglich, steht der Grund **auf dem Knopf**
   („Dafür ist der Verein zu klein — nötig ist mindestens Liga 4").
3. **Vorstandsziel** — sichtbar, **bevor** es entschieden ist. Ein Ziel, das
   man erst aus dem Abschlussbericht erfährt, ist keines. Gewählt wird es
   weiterhin nicht; der Vorstand gibt es vor.

**Die Durchreichungen stehen in `verein.js`**, nicht in `App.jsx` — dieselbe
Linie wie bei `bauStarten` und `extraKaufen`: die Oberfläche importiert `WIRT`
nicht selbst.

**Der Reiter heisst jetzt „Führung"** statt „Ausbau". Ein **siebter** Reiter kam
nicht in Frage: bei 320 Pixeln lag schon der sechste zwei Wischer entfernt
(gemessen beim Rundgang am 18.09.2026, Befund aus #13). Der Reiter trägt
stattdessen mehr, und der Ausbau bekommt eine eigene Überschrift darin.

### Geprüft

- `npm test` **194/194** (vorher 189), `npm run build` erfolgreich.
- Fünf neue Regressionen. Die erste ist die wichtige: **sie prüft die
  Einnahme, nicht das Feld.** Ein Regler, der einen Wert speichert, den die
  Rechnung nicht liest, wäre dieselbe Sorte Placebo wie „Scoutnetz" und
  „Bekannte Adresse" — nur mit Schieberegler. Gemessen wird deshalb über zwei
  echte Saisons, dass der billigere Eintritt das Stadion stärker füllt.
  Dazu: Klemmung und Prüfung vor dem Schreiben; der Hinweis liegt in den
  Grenzen; die Rechtsform wechselt nur nach vorn, nur mit Liga und Geld, bucht
  Kosten und Einlage richtig und lässt **kein abgeleitetes `ligastufe` im
  Spielstand**; der Reiter rendert alles ohne NaN und ein alter Stand ohne
  Ziel zeigt keine leere Kachel.
- **Drei Gegenproben, alle rot:** schreibt `preisSetzen` in ein Feld, das
  niemand liest, fallen zwei Prüfungen; fehlt die Klemmung, fällt eine;
  wandert `ligastufe` in den Spielstand, fällt die Rechtsformprüfung.

### Ausdrücklich offen

- **Das Vorstandsziel bleibt eine Vorgabe, keine Wahl.** So ist es entworfen;
  eine Auswahl unter mehreren Zielen wäre ein eigenes Paket.
- **Die Preise wirken erst in der nächsten Abrechnung.** Es gibt keine
  Vorschau, was ein Reglerwert konkret einbringt — nur das Maximum als Marke.
- **Kein Gerätetest.** Die Regler sind im Prüfstand gerendert, aber niemand hat
  sie gezogen.

## WIRT-P1-02 — Stadionausbau spürbar machen (Claude, 18.09.2026)

**Basis-Commit:** `02dade3` (`claude/wirt-vereinsfuehrung-ui`). Zur Abnahme
durch Astra.

### Was gebaut wurde

1. **Stadionkachel im Führungsreiter:** Plätze, letzte Zuschauerzahl mit
   Auslastung, und — der eigentliche Punkt — **was die nächste Ausbaustufe
   brächte** („33.000 Plätze, 11.000 mehr"). Bis hierher war der Stadionausbau
   eine Zahlung ins Ungewisse: man sah danach eine grössere Zahl in der
   Abrechnung, ohne je erfahren zu haben, wie viele Plätze man überhaupt hat.
   Ist alles gebaut, steht das da, statt eine leere Zeile zu zeigen.
2. **Ausverkauftes Haus ab 97 % Auslastung**, im Saisonbeleg und in der Chronik.
3. **Der Beleg nennt die Bezugsgrösse.** „Ø 21.780 Zuschauer" sagt nichts;
   „Ø 21.780 von 22.000 · 99 % ausgelastet" sagt alles.

### Die Schwelle ist gemessen, nicht gesetzt

Vor dem Festlegen durchgerechnet, weil **ein Ereignis, das nie eintritt, wieder
ein Placebo wäre** — davon hatte dieses Projekt genug:

| Verein | höchste Auslastung |
|---|---:|
| Erstligist, Rang 1–3 | **99,0 %** (die Deckelung) |
| Drittligist, Rang 1 | 91,7 % |
| Fünftligist, Rang 1 | 86,6 % |

97 % ist also erreichbar und trotzdem etwas wert.

### Es zahlt in Stimmung, nicht in Geld

+3 Stimmungspunkte, dieselbe Grössenordnung wie ein fertiges Bauprojekt. **Kein
Geldposten**, und das ist Absicht: die Zuschauer stecken bereits in Ticket-,
Gastro- und Merchandisingertrag. Ein Bonus obendrauf wäre dieselbe Einnahme
zweimal — genau der Fehler, den WIRT-P1-03 bei der Personalpauschale schon
einmal hatte. Eine Regression hält fest, dass kein Einnahmeposten dieses Namens
entsteht.

### Eine bestehende Prüfung musste nachgeschärft werden

`Der Stimmungsschaden wächst stetig über dem Normalpreis` wurde rot. **Der Grund
war kein Fehler, sondern richtiges Verhalten:** ein Kampfpreis von 0,6 füllt das
Stadion über die Ausverkaufsmarke und hebt die Stimmung um 3. Billige Karten,
volles Haus, zufriedene Fans.

Die alte Zusicherung lautete „unterhalb und bei 1 sind alle Werte GLEICH" — zu
stark formuliert für das, was sie eigentlich schützt. Sie schützt die Abkürzung
in `ueberzogen` (der Überteuerungsschaden ist bei und unter 1 beweisbar null).
Das wird jetzt genauer getroffen: **0,8 gegen 1,0** — beide unter der
Ausverkaufsmarke, also ohne Bonus, und deshalb exakt gleich. Dazu neu über die
ganze Spanne 0,6 bis 1,6: **teurer darf die Stimmung nie heben.** Das ist eine
stärkere Aussage als vorher, nicht eine schwächere.

### Ein Befund, den ich NICHT geändert habe

**Die Auslastung hängt überhaupt nicht an der Kapazität.** Ein Stadion mit
64.000 Plätzen füllt sich zu denselben 99 % wie eines mit 8.000 — nachgerechnet
über alle sechs Ausbaustufen. Der Ausbau ist damit reines Aufwärts ohne Risiko;
realistisch wäre, dass eine Verdopplung der Plätze die Auslastung drückt.

Das ist eine **Balance-Entscheidung des Eigentümers** und gehörte nicht zu
diesem Auftrag. Vermerkt statt nebenbei miterledigt.

### Geprüft

- `npm test` **198/198** (vorher 194), `npm run build` erfolgreich.
- Vier neue Regressionen: die Ausverkaufsmarke ist erreichbar (Spitze) **und
  nicht geschenkt** (hinten bleibt es darunter); das volle Haus erzeugt keinen
  Geldposten, hebt aber messbar die Stimmung; die Stadionkachel nennt aktuelle
  Plätze, die nächste Stufe und den Unterschied, und sagt „voll ausgebaut",
  wenn nichts mehr kommt; Plätze und Marke wandern aus dem Beleg in die Chronik.
- **Drei Gegenproben, alle rot:** liegt die Schwelle über der Deckelung, fallen
  zwei Prüfungen; zahlt das volle Haus in Geld statt Stimmung, fällt eine;
  nennt die Kachel die nächste Stufe nicht, fällt die Oberflächenprüfung.

### Ausdrücklich offen

- **Die Auslastung ignoriert die Kapazität** (oben, mit Zahlen).
- **Kein Gerätetest.**

## „Bekannte Adresse" bekommt einen Leser (Claude, 18.09.2026)

**Basis-Commit:** `703d377` (`main`). Zur Abnahme durch Astra.

### Der Befund

Das Vermächtnis-Extra **„Bekannte Adresse"** kostet 350 Abschlusspunkte und
verspricht: „Die Akademie nimmt jedes Jahr ein Talent mehr auf."

```
verein.js:1063   { id: "netzwerk2", ab: 350, n: "Bekannte Adresse",
                   fx: { aufnahmen: 1 } }
App.jsx:9565     v.bonus.aufnahmen ? "+" + v.bonus.aufnahmen + " Aufnahme je Jahr" : null
```

Der Wert wanderte über `neuerVerein` brav nach `v.bonus.aufnahmen` und wurde im
Vereinsbildschirm angezeigt. **Gelesen hat ihn niemand.** Die drei Geschwister
hatten längst Leser — `startOvr` in `verein.js:377`, `zuwachs` in `:958`,
`ausbauStart` in `:1354`; dieses eine nicht.

Dieselbe Sorte Fehler wie das entfernte „Scoutnetz", nur teurer: 350 Punkte
sammelt man über mehrere Vereinsleben.

Gefunden beim Nachsehen der offenen Punkte, nicht aus einem Auftrag heraus —
vermerkt war er seit dem 17.09.2026 als „bestehender Code, nicht aus dieser
Runde".

### Die Änderung

`akaJahr` und `akaVerbuchen` nehmen einen vierten Parameter `extraAufnahmen`;
der neue Jahrgang wird um diesen Wert grösser.

**Als Argument, nicht als Feld auf der Akademie.** Die Akademie kennt den
Verein nicht und soll ihn nicht kennen — `machAkademie(H)` bekommt bewusst
keinen Vereinsstand. Den Bonus auf der Akademie zu spiegeln wäre die zweite
Wahrheit, die früher oder später von der ersten abweicht; genau dieser Fehler
steht als Begründung schon über `CLAUDE.md`.

Durchgereicht wird er im Abschluss-Handler (`App.jsx`), der als Einziger beide
Seiten sieht. `verein?.bonus?.aufnahmen` fängt ab, dass die Akademie früher
freigeschaltet ist als der Verein.

### Geprüft

- `npm test` **142/142** (vorher 140), `npm run build` erfolgreich.
- Zwei neue Regressionen, und die zweite ist der Punkt:
  1. **Am Rechenkern:** gleiche Saat, einmal mit und einmal ohne Bonus — die
     Zahl der Aufnahmen unterscheidet sich um genau den Bonus. Dazu die
     kaputten Fälle: `0`, `-3` und `"kaputt"` ändern nichts und werden nicht
     zum Geschenk.
  2. **Über den echten Karriereabschluss.** In `App.jsx` stehen **zwei**
     Bindungen namens `verein`: die Vereinsablage (`useState`, Zeile 17593)
     und eine **Zeichenkette** in einer Renderfunktion (Zeile 14705). Greift
     die falsche, ist der Bonus still wieder wirkungslos — und die Prüfung am
     Rechenkern bliebe grün. Deshalb misst diese Regression durch den Handler.
- **Gegenproben, beide rot:** wird der Bonus im Kern nicht addiert, fallen
  **beide** Prüfungen; wird im Handler `undefined` statt des Vereinsbonus
  durchgereicht, fällt **nur die zweite**. Genau dafür ist sie da.

### Ausdrücklich offen

- **Die Anzeige im Vereinsbildschirm bleibt unverändert.** Sie stimmt jetzt
  einfach — vorher versprach sie etwas, das nicht geschah.
- **Nicht nachkalibriert.** Ein Talent mehr je Jahr ist eine spürbare Wirkung;
  ob 350 Punkte dafür der richtige Preis sind, ist eine Balance-Frage des
  Eigentümers und nicht Teil dieser Runde.

## Prüfstand von Hand startbar (Claude, 17.09.2026)

**Basis-Commit:** `a96660f`. **Branch:** `claude/ci-handstart`.
**Vorgelegt zur Abnahme, nicht zusammengeführt.**

**Auftrag.** Kevin: „Mach das mit workflow_dispatch in regression.yml".

**Das Problem.** `.github/workflows/regression.yml` lief bei `pull_request` und
bei Pushes auf `main` — sonst nie. Ein Branch ohne offenen Pull Request war
damit für die CI unsichtbar: `npm test` und `npm run build` liefen dort nur auf
dem Rechner dessen, der ihn gepusht hat. Bei der Übergabe zwischen drei
Beteiligten ist das die schwächste Stelle, weil der Empfänger einem Prüfbericht
glauben muss, den er nicht nachstellen kann.

**Die Änderung.** Drei Zeilen: `workflow_dispatch:` als dritter Auslöser, mit
einem Kommentar, der den Weg in der Oberfläche nennt (Actions →
„Spielregressionen" → „Run workflow" → Branch wählen). `browser.yml` und
`apk.yml` hatten den Auslöser bereits; damit sind alle drei Arbeitsabläufe
gleich bedienbar. `README.md` nennt die Möglichkeit im Abschnitt „Prüfstände",
weil sie sonst niemand findet.

**Was sich NICHT ändert.** Ein reiner Branch-Push startet weiterhin nichts. Der
Auslöser ist ein Knopf, kein Automatismus — wer prüfen will, drückt ihn.

**Geprüft:** YAML gelesen und die drei Auslöser bestätigt (`pull_request`,
`push`, `workflow_dispatch`), `npm test` und `npm run build` erfolgreich. Der
Knopf selbst ist erst nach der Abnahme zu sehen: GitHub zeigt „Run workflow"
nur für Arbeitsabläufe, die auf dem Standardbranch liegen. Solange das hier
nicht in `main` ist, gibt es den Knopf also noch nicht — das ist kein Fehler,
sondern der Grund, warum diese Änderung überhaupt nötig ist.

**Offen bleibt:** Nach der Zusammenführung einmal tatsächlich drücken und
nachsehen, ob der Lauf auf einem fremden Branch durchgeht. Das kann erst
danach jemand tun.
