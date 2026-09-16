# Rasenschach XI

**Einstieg für neue Chats:** [START-NEUER-CHAT.md](START-NEUER-CHAT.md)
enthält Zugriffshinweise, Lesereihenfolge und eine datierte Übergabe.

Ein deutschsprachiger Fußball-Karriere-Simulator. Eine React-Einzelseite, die
über Capacitor als Android-App ausgeliefert wird (`de.rasenschach.xi`). Die App
läuft vollständig ohne Netz: Schriften und Titelbild sind als Daten eingebettet,
gespeichert wird über Capacitor Preferences, im Browser über dieselbe
Schnittstelle mit localStorage darunter.

Man spielt eine einzelne Laufbahn — Training, Ereignisse, Saisonergebnis,
Vertragsangebote — und trägt über mehrere Laufbahnen hinweg einen
Meta-Fortschritt weiter: Jugendakademie, eigener Verein, Sammelkarten,
Errungenschaften, Ruhmeshalle.

## Schnellstart

```
npm ci            # Abhängigkeiten, genau nach package-lock.json
npm test          # Regressionen (läuft auch in der CI)
npm run build     # Produktionsbündel nach dist/
```

Android (braucht Java 21 und das Android-SDK, siehe `.github/workflows/apk.yml`):

```
npx cap sync android
node tools/android-version.cjs android/app/build.gradle package.json
cd android && ./gradlew assembleRelease
```

Eine Entwicklungsvorschau gibt es bewusst nicht als Skript; `npx vite` genügt,
wenn man sie braucht.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `App.jsx` | Spielkern **und** komplette Oberfläche. Mit Abstand die größte Datei. |
| `ereignisse.js` | Ereigniskatalog: Titel, Text, Auswahlmöglichkeiten, Folgen |
| `namen.js` | Namenskartei, ein Eintrag je Land |
| `verein.js` | eigener Verein: Liga, Kader, Aufstellung, Taktik, Ausbau |
| `akademie.js` | Jugendakademie: Talente, Abteilungen, Jahrgänge |
| `karten.js` | Sammelkarten, Packs, Ziehung, Verkauf |
| `karteneffekte.jsx` | Gemeinsame animierte Materialfolie für Karten und Packs |
| `portraet.js` | Stabile Editoroptionen, Namen und Würfeln mit festgehaltenen Merkmalen |
| `karrieregeschichten.js` | Persönliche Erinnerungen für den Karriereabschluss |
| `vorsatz.js` | Vorsatzfortschritt, einmalige Spielerboni, Abschluss-Punkte und Saisonziele |
| `belohnungen.js` | Abschlussbelohnungen — ein Beleg für Buchung und Anzeige |
| `buchungen.js` | Karten-/Coinbuchungen, geprüft **vor** dem Schreiben |
| `spielstand.js` | laufenden Stand serialisieren und wieder laden |
| `sicherung.js` | Speichervertrag, Import mit Journal und Rücknahme |
| `storage.js` | Speicheradapter (Capacitor Preferences) |
| `schriften.js`, `titelbild.js` | eingebettete Schriften und Aufmacherbild |
| `tools/` | Prüfstände und Werkzeuge, siehe unten |

Die ausgelagerten Module sind **Fabriken** (`machEreignisse`, `machVerein`,
`machAkademie`, `machKarten`, `machNamen`): sie bekommen ihre Helfer von
`App.jsx` übergeben, statt von dort zu importieren. Ein Import wäre ein
Ringimport — die Datei liefe vor `App.jsx`, und deren Konstanten wären noch in
der temporalen Totzone. Das ist kein Stilentscheid, sondern verhindert einen
Absturz beim Start. Wer einer Fabrik einen neuen Helfer geben will, muss ihn an
**zwei** Stellen nachtragen: beim Auspacken in der Fabrik und bei der Übergabe
in `App.jsx`.

## Zusammenarbeit und Vermerke

An diesem Projekt arbeiten drei Beteiligte: der Eigentümer, Claude und
ChatGPT/Codex. Keiner sieht, was die anderen gerade getan haben — außer, es
steht im Repository. Deshalb gehört zu jeder Änderung ein Vermerk, und zwar an
der Stelle, an der der nächste ihn sucht:

| Art der Änderung | Wohin der Vermerk gehört |
|---|---|
| Etwas, das Spielende merken: Regel, Inhalt, Oberfläche, Grenzwert | `CHANGELOG.md`, neuer Abschnitt unter der Version |
| **Warum** eine Entscheidung so und nicht anders fiel | Kommentar unmittelbar am Code |
| Prüfergebnisse, Messwerte, offene Punkte, nächste Runde | `ENTWICKLUNG.md` |
| Werkzeuge, Abhängigkeiten, Aufbau des Repositorys, Konventionen | `README.md` (diese Datei) |
| Jede Änderung ohne Ausnahme | Commit-Nachricht: Version und Stichwort |

Dazu sechs Regeln, die sich aus früheren Fehlern ergeben haben:

1. **Messwerte mit Datum und Verfahren nennen.** „Rückfluss 94,3 %" allein ist
   wertlos; „2.000 Ziehungen je Packtyp, `node tools/langzeit.cjs`" ist
   nachprüfbar. Wer eine Zahl nennt, nennt, wie sie entstanden ist.
2. **Nichts als geprüft behaupten, was nicht gelaufen ist.** Ein Gerätetest,
   den niemand gemacht hat, gehört als offener Punkt vermerkt, nicht als
   Erfolg. `ENTWICKLUNG.md` führt solche Punkte ausdrücklich.
3. **Alte Begründungen nicht überschreiben.** Wenn sich eine frühere
   Entscheidung als falsch erweist, bleibt der alte Kommentar stehen und
   bekommt einen datierten Zusatz, der sagt, was daran nicht stimmte.
   `index.html` ist das Muster dafür. So bleibt nachvollziehbar, *warum*
   jemand damals so entschied.
4. **Ereignis- und Auswahlkennungen sind für immer.** Gespeicherte Spielstände
   verweisen über diese Kennungen zurück in den Katalog (`spielstand.js`).
   Neue Inhalte bekommen neue, eindeutige Kennungen; bestehende werden nie
   umbenannt und nie so umsortiert, dass alte Stände auf andere Folgen zeigen.
   `npm test` prüft die Eindeutigkeit.
5. **`App.jsx` ist der wahrscheinlichste Konfliktpunkt.** 19.000 Zeilen, an
   denen alle drei arbeiten. Wer dort etwas Größeres vorhat, sagt vorher, in
   welchem Bereich — das ist billiger als ein Merge-Konflikt in einer Datei
   dieser Größe.
6. **Nichts Fremdes bleibt stillschweigend liegen.** Arbeit auf einem eigenen
   Branch ist für alle anderen unsichtbar. Wer eine Runde beginnt, sieht nach,
   was offen liegt, und entscheidet ausdrücklich darüber — siehe „Rollen und
   Abnahme". Das verhindert den teuren Fall: dieselbe Datei wird an derselben
   Stelle zweimal geändert, oder ein gerade behobener Fehler wird nach altem
   Muster wieder eingebaut.

### Rollen und Abnahme

Die Rollen sind nicht gleich verteilt, und das ist Absicht:

| Wer | Rolle |
|---|---|
| **Eigentümer** | entscheidet, was gebaut wird, und hat in allem das letzte Wort |
| **ChatGPT/Codex** | entwickelt **und** nimmt Claudes Arbeit ab, bevor sie nach `main` geht |
| **Claude** | entwickelt zu, liefert auf einem eigenen Branch und integriert nicht selbst |

Daraus folgt ein fester Weg für Claudes Beiträge:

1. **Claude arbeitet auf einem eigenen Branch**, nie direkt auf `main`, und
   führt seine Arbeit nicht selbst zusammen — auch dann nicht, wenn es ein
   einfacher Fast-Forward wäre und die Prüfungen grün sind.
2. **Claude legt die Abnahme vor:** je Runde ein Vermerk in `ENTWICKLUNG.md`
   mit Basis-Commit, was geändert wurde, was geprüft wurde und mit welchem
   Ergebnis, und was ausdrücklich offen bleibt. Ein Pull Request ist der
   bevorzugte Weg, weil dort zusätzlich die CI läuft (ein reiner Branch-Push
   löst sie nicht aus); die Übergabe über den Branch allein ist zulässig, wenn
   es schneller gehen soll.
3. **Codex entscheidet.** Drei Ausgänge, alle drei in Ordnung: übernehmen;
   mit Änderungswünschen zurückgeben; ablehnen. Nur einer ist es nicht:
   kommentarlos liegen lassen.
4. **Ablehnung oder Änderung wird begründet** — im Pull Request oder in
   `ENTWICKLUNG.md`. Der Grund ist die eigentliche Information; ohne ihn baut
   Claude denselben Vorschlag in der nächsten Runde wieder.
5. **Bei fachlicher Uneinigkeit entscheidet Codex.** Claude darf widersprechen
   und soll es tun, wenn er einen Fehler sieht — aber einmal, mit Begründung,
   und dann ist gut. Der Eigentümer kann jede dieser Entscheidungen aufheben.

Umgekehrt gilt die Abnahme nicht: Codex' eigene Runden gehen direkt nach `main`.

### Freigabe für die weitere Zusammenarbeit (15.09.2026)

Der Eigentümer hat im Chat Commit `4cc06f4` (35.181.0), dessen Upload nach
`main` und den APK-Build ausdrücklich autorisiert. Außerdem hat er Codex den
künftigen lesenden und schreibenden Zugriff auf
`sirmebro-sketch/rasenschachonlyapp` erlaubt. Diese Freigabe gilt für die
beauftragte Projektarbeit; gewöhnliche geprüfte Änderungen müssen nicht jedes
Mal erneut freigegeben werden. Die oben beschriebenen Rollen und die Regeln
zum Schutz gleichzeitiger Arbeit bleiben bestehen.

Wortlaut des Eigentümers im Chat vom 15.09.2026:

> Ja, ich autorisiere dich, Commit 4cc06f4 (Version 35.181) nach main im GitHub-Repository sirmebro-sketch/rasenschachonlyapp hochzuladen und den APK-Build auszulösen. Und auch zukünftig auf das Repository zuzugreifen, lesen und schreiben zu dürfen.

Diese dokumentierte Freigabe gilt als Arbeitsauftrag im genannten Rahmen,
nicht als technische Zugangsgarantie. Neue Chats prüfen ihre verfügbare
GitHub-Verbindung selbst; Plattformregeln und spätere Nutzeranweisungen gelten
weiter. Einzelheiten zum Einstieg stehen in `START-NEUER-CHAT.md`.

### Offene Übergaben finden

Die Liste führt niemand von Hand — Git kennt sie. Vor jeder Runde:

```
git fetch --all --prune
git branch -r --no-merged origin/main
```

Jeder gelistete Branch trägt Arbeit, die noch nicht in `main` ist. Erledigte
Branches verschwinden von selbst aus der Liste, sobald ihre Commits in `main`
stehen — auch dann, wenn der Branch als solcher liegen bleibt. Was auf einem
Branch liegt, zeigt `git log --oneline origin/main..<branch>`.

Für Codex ist das die Abnahmeliste: jeder Eintrag ist ein Vorschlag, der auf
eine Entscheidung wartet. Für Claude ist es die Kontrolle, ob eigene Arbeit noch
hängt, und die Erinnerung, fremde Arbeit vor dem eigenen Beginn zu übernehmen.

Damit es die automatisierten Beteiligten beim Start erreicht, steht der Ablauf
zusätzlich in `AGENTS.md` (Codex) und `CLAUDE.md` (Claude Code) — beides kurze
Verweise hierher, damit nicht drei Fassungen derselben Regel auseinanderlaufen.

### Übergaben nach Rebase oder Squash

`--no-merged` vergleicht Abstammung, nicht Inhalte. Nach Rebase-/Squash-Merge
kann ein bereits übernommener Quellbranch weiter erscheinen. Vor einer
Bereinigung Remote erneut abrufen und prüfen, ob seit der Abnahme neue Commits
hinzugekommen sind. Gleiche Dateibäume (`git diff origin/main..<branch>` leer)
sind ein hilfreicher Nachweis; bei inzwischen weiterentwickeltem main müssen
übernommene Patches und neue Branch-Arbeit getrennt geprüft werden.

Erst nach dokumentierter Abnahme den erledigten Branch löschen oder auf den
aktuellen main-Stand bringen. Alternativ die geprüfte Branch-Spitze als
zusätzlichen Elterncommit übernehmen, wie in 35.178 geschehen. Keine ungeprüfte
Arbeit überschreiben und keine Force-Pushes zur vermeintlichen Bereinigung.
Im Entwicklungsvermerk Quell- und Zielcommit sowie die Entscheidung nennen.

### Versionsschema

`package.json` führt die Version als `major.minor.patch` (derzeit 35.189.0).
Daraus rechnet `tools/android-version.cjs` den `versionCode`
(`major*100000 + minor*100 + patch`, also 3518900) und schreibt ihn zusammen mit
dem `versionName` nach `android/app/build.gradle`. Beide Felder sollen nie von
Hand auseinanderlaufen. Die Version wird erhöht, wenn eine neue APK entsteht —
reine Werkzeug- oder Dokumentationsänderungen erhöhen sie nicht.

## Prüfstände

**`npm test`** — `node --test tools/*.test.cjs`. Wie viele Prüfungen es gerade
sind, sagt die Ausgabe des Laufs (`# pass`); eine Zahl an dieser Stelle wäre nach
der nächsten Runde wieder falsch. Läuft in der CI bei Pushes auf `main` und Pull
Requests (`.github/workflows/regression.yml`).
Schwerpunkt: Abschlussbelohnungen und Kaufbuchungen, Speicherfehler an jedem
einzelnen Schritt, simulierte Prozessabbrüche, Import mit Rücknahme,
Ereignisstände nach Umsortierung des Katalogs.

**`node tools/langzeit.cjs`** — optionaler Langzeitlauf: 192 vollständige
Karrieren über acht Positionen, beide Geschlechter, drei Schwierigkeitsgrade,
dazu 2.000 Packziehungen je Packtyp. Läuft **nicht** in der CI, weil er Minuten
braucht; er ist die Stichprobe für Zahlen in `ENTWICKLUNG.md`.

Der Langzeitlauf hat eine Besonderheit, die man kennen muss: er baut keine
React-Oberfläche auf, sondern **schneidet die echten Handler textlich aus
`App.jsx` heraus** und setzt sie mit Testadaptern neu zusammen. Damit prüft er
den tatsächlich ausgelieferten Code und nicht eine Nachbildung — aber er hängt
an Markierungen im Quelltext:

```
/* PRUEFSTAND-ANFANG: helfer */   …   /* PRUEFSTAND-ENDE: helfer */
/* PRUEFSTAND-ANFANG: handler */  …   /* PRUEFSTAND-ENDE: handler */
```

Diese vier Zeilen in `App.jsx` sind **keine gewöhnlichen Kommentare**. Wer sie
löscht oder verschiebt, bricht den Prüfstand. `npm test` prüft deshalb ihr
Vorhandensein, ihre Eindeutigkeit und ihre Reihenfolge — ein versehentliches
Entfernen wird in der CI rot, nicht erst Wochen später beim nächsten
Langzeitlauf. Neuer Code, der mitgeprüft werden soll, gehört zwischen die
Markierungen.

**`node tools/android-version.cjs`** — schreibt `versionCode` und `versionName`
aus `package.json` nach `android/app/build.gradle`. Läuft im APK-Workflow.

## Was nicht im Repository liegt

`node_modules/`, `dist/`, gebaute APKs und **Signierschlüssel**. Der
Release-Schlüssel liegt ausschließlich als GitHub-Secret vor; im Repository
steht nur der erwartete Zertifikats-Fingerabdruck
(`signing/certificate-sha256.txt`), gegen den der Workflow vor dem Bauen und
nach dem Signieren prüft. Der Schlüssel wird am Ende vom Runner gelöscht.

Ebenfalls nicht hier: **`STAND.md`**. Einzelne Kommentare in `akademie.js` und
`karten.js` verweisen darauf — das Dokument stammt aus der Entwicklung vor
35.169.0, also aus der Zeit vor diesem Repository, und wurde nie mit importiert.
Seine Rolle übernehmen heute `CHANGELOG.md` (was sich geändert hat) und
`ENTWICKLUNG.md` (Stand, Prüfungen, offene Punkte).


### Gleichzeitige Arbeit (Ergänzung Codex, 15.09.2026)

Vor Beginn Remote-Branches aktualisieren, `main` und vorhandene Übergaben lesen.
Eigene uncommittete Arbeit vor einer Zusammenführung sichern. Fremde Änderungen
über ihren Commit übernehmen; keine kompletten Dateien aus einem älteren Stand
zurückkopieren. Unmittelbar vor Veröffentlichung `main` erneut prüfen. Ist er
weitergelaufen, zuerst zusammenführen und betroffene Tests wiederholen. Keine
Force-Pushes. Im Entwicklungsvermerk Basis-/übernommene Commits, Konfliktlösungen,
Tests und verbleibende Geräteprüfungen nennen. Große Arbeiten möglichst auf einem
eigenen Branch vorbereiten. Maßgeblich ist der Quellstand im Repository.

Vollständiger Vorsatzvergleich: `node tools/langzeit.cjs --vorsatzvergleich`.
1.152 Karrieren: acht Positionen × zwei Geschlechter × drei Modi × vier
Auswahlstrategien × sechs Vorsätze. Feste Seeds, keine Spielerprognose.

### Visuelle Arbeit (35.185)

`node tools/visuelle-vorschau.cjs` erzeugt `.preview/sichtprobe.html`, eine
lokal im Browser öffnungsfähige Einzeldatei mit den echten React-Komponenten:
Frisuren einschließlich Freischaltungen, Wildcards aller Stufen, Spielerkarten
Packs, Sonderschuss und Charaktererstellung. Testdaten und Speicheradapter sind isoliert; sie
schreiben keine Spielstände. Nicht Teil des Android-Bündels. Bei Codeänderungen
neu erzeugen. Vorschau ist ein Prüfwerkzeug, kein vollständiger Spieltest.

`node tools/portraet-bogen.cjs <Suffix> <Kopfform>` erzeugt PNG-Bögen in
`.preview/` aus dem echten Avatar-Renderer. Benötigt `sharp`, entweder installiert
oder aus `CODEX_PRIMARY_RUNTIME_NODE_MODULES`. Ergebnisse sind temporär und
werden nicht committed. Damit lassen sich Konturen auch ohne Browser prüfen.

Seit 35.186 funktioniert die autorisierte verwaltete Browservorschau:
`npm ci`, `npm run preview:gallery`, dann in ChatGPT Work mit vorhandener
Sites-Vorschau `sites-preview start <absoluter Repositorypfad>`. Browser-Skill
lesen, Cloud-Browser verbinden und die vom Werkzeug gemeldete Vorschauadresse
öffnen. `/` ist das echte Spiel; `/.preview/sichtprobe.html` ist die isolierte
Merkmal- und Effektgalerie. Die interne Vorschauadresse nicht als Download-Link
an Nutzer ausgeben. Nach der Prüfung `sites-preview stop` ausführen.

Ohne diese verwaltete Umgebung: `npm run dev` und einen verfügbaren lokalen
Browser verwenden. Explizite Browser-Sperren nicht umgehen. Diese Vorschau
braucht keine öffentliche Veröffentlichung und keine produktiven Spielstände.
Alle Merkmalkategorien, Haut-/Haarfarben, Kopfformen und Freischaltungen lassen
sich in der Galerie vergleichen. Bei Codeänderungen Galerie neu erzeugen.

`npm run test:browser` führt Playwright-Prüfungen bei 320, 390 und 1280 Pixeln
Breite aus. Einmalig `npx playwright install --with-deps chromium` installieren.
GitHub führt sie bei Push/PR automatisch aus; der Workflow „Visuelle Browsertests“
liefert Screenshots, Fehler-Traces, HTML-Bericht und die isolierte Einzeldatei
als Artefakt `Rasenschach-Browsertest`. Fehlerberichte ansehen, nicht nur den
Exitcode. Browser-Smokes prüfen Bedienung und Rendering, ersetzen keine
ästhetische Sichtprüfung und keine Android-Leistungs-/Touchprüfung.

`/.preview/bildschirm.html` bietet zusätzlich einen umschaltbaren iframe für
320 × 720, 390 × 844, 844 × 390 und 1280 × 900. Dadurch stimmen auch vw/vh und
Media Queries, wenn der Cloud-Browser seine Fenstergröße nicht ändern kann.
Zwischen echtem Spiel und isolierter Galerie umschalten. Der Rahmen ist kein
Android-Emulator. Wildcard-Browsertests decken alle sieben Seltenheiten mit
und ohne Bewegung ab, einschließlich Abschlussbutton und Text im Sichtbereich.

### App-Icon

`artwork/app-icon.svg` ist die scharfe Vektorfassung. `python tools/app-icon.py`
erzeugt daraus beziehungsweise aus derselben Geometrie das native Android-
Foreground und die Legacy-PNGs in allen Dichten. Benötigt Python fonttools
mit WOFF2-Unterstützung und Inkscape. Die Buchstaben stammen aus der bereits
eingebetteten Spielschrift; keine externe Ersatzschrift.
