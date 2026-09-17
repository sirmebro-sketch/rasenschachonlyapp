# Rasenschach XI – dauerhafte Übergabe für neue Chats und Arbeitsumgebungen

> **Zweck dieser Datei:** Sie ist der stabile Einstiegspunkt für jeden neuen Chat, Codex-/ChatGPT-Lauf oder andere Arbeitsumgebung. Sie enthält bewusst **keinen aktuellen Versionsstand, keine aktuelle Testzahl und keinen aktuellen Commit als Arbeitsgrundlage**. Diese Angaben veralten. Der neue Bearbeiter muss den Live-Stand immer selbst aus dem Repository ermitteln.

Diese Datei kann direkt an einen neuen Chat angehängt oder über das Repository verlinkt werden. Sie ersetzt keine Live-Prüfung des Quellstands, sondern erklärt, **wie** dieser zuverlässig ermittelt, geschützt, geprüft, weiterentwickelt und wieder übergeben wird.

---

## 1. Projektidentität und maßgebliche Quelle

- **Projekt:** Rasenschach XI
- **Repository:** https://github.com/sirmebro-sketch/rasenschachonlyapp
- **Hauptbranch:** `main`
- **Android-App-ID:** `de.rasenschach.xi`
- **Technik:** React/Vite als Web-App, Capacitor für Android, Offline-Betrieb.
- **Produkt:** deutschsprachiger Fußball-Karriere-Simulator mit Spielerkarriere, Ereignissen, Training, Saison- und Vertragslogik, eigenem Verein, Jugendakademie, Sammelkarten/Packs, Wildcards, Ruhmeshalle, Errungenschaften und dauerhaftem Meta-Fortschritt.

### Grundsatz: Das Repository ist die Wahrheit

Der aktuelle Repository-Stand ist die Arbeitsbasis. Frühere Chats, Erinnerungen, ZIP-Dateien, PDFs, Browsertest-Dateien, lokale Arbeitsordner und historische Berichte können wertvoll sein, sind aber **nicht automatisch aktueller**.

Niemals einen älteren Gesamtstand ungeprüft über `main` kopieren.

Für gezielte Änderungen an großen oder konfliktanfälligen Dateien steht die
[`PATCH-BRUECKE.md`](PATCH-BRUECKE.md) zur Verfügung. Neue Arbeitsumgebungen,
die keine sichere partielle Dateibearbeitung anbieten, sollen diesen Weg nutzen,
statt eine komplette ältere `App.jsx` zurückzuschreiben.

Lokale Pfade aus früheren Sitzungen wie `/workspace/scratch/...` sind temporär und dürfen nicht als dauerhafter Zugriffspfad vorausgesetzt werden. Wenn die alte Arbeitsumgebung nicht mehr existiert, Repository neu abrufen.

---

## 2. Reihenfolge der Quellen – was bei Widersprüchen gilt

Wenn Aussagen voneinander abweichen, gilt grundsätzlich diese Reihenfolge:

1. **Aktuelle Anweisung des Eigentümers im laufenden Chat.**
2. **Tatsächlicher Quellstand des aktuellen `main`** einschließlich aktueller Remote-Branches und Pull Requests.
3. **`AGENTS.md` und `README.md`** für verbindliche Arbeits-, Rollen-, Architektur-, Test- und Integrationsregeln.
4. **`ENTWICKLUNG.md` und die neuesten Dateien unter `pruefberichte/`** für die jüngsten Prüfungen, Befunde, Grenzen und offenen Arbeiten.
5. **`CHANGELOG.md`** für spielerrelevante Änderungen und Versionshistorie.
6. **`CLAUDE.md`** für die zusätzliche Rollenregel von Claude Code.
7. Frühere Berichte, ZIPs, PDFs, Browsertest-Dateien und Chat-Verläufe als **historische Evidenz**.

Ein älterer Bericht darf einen neueren belegten Repository-Stand nicht zurücksetzen. Umgekehrt bedeutet „neu“ nicht automatisch „richtig“: Bei kritischen Aussagen Quellcode, Tests und Verlauf prüfen.

`STAND.md` aus älteren Entwicklungsphasen gehört nicht zur heutigen Repository-Wahrheit. Die aktuelle Rolle übernehmen vor allem `CHANGELOG.md`, `ENTWICKLUNG.md`, `README.md` und die Prüfberichte.

---

## 3. Eigentümer, Freigabe und Rollen

Der Eigentümer entscheidet, was Rasenschach XI werden soll, und hat das letzte Wort.

Die dauerhafte Freigabe für die beauftragte Projektarbeit – einschließlich Lesen, Schreiben, geprüfter Weiterentwicklung, Aktualisierung von `main` und Auslösen neuer Android-Builds – ist im `README.md` dokumentiert. Ein neuer Chat soll die dortige aktuelle Formulierung lesen und nicht aus einer alten Übergabe rekonstruieren.

Diese Freigabe ist **keine technische Zugangsgarantie**. Jeder neue Chat muss selbst prüfen, welche GitHub-Verbindung und welche Schreibrechte tatsächlich verfügbar sind. Fehlende technische Authentifizierung nicht mit fehlender Nutzerfreigabe verwechseln.

### Rollenverteilung

- **Eigentümer:** Produktentscheidung und letztes Wort.
- **ChatGPT/Codex:** darf eigenständig entwickeln, prüfen, integrieren und im Rahmen des Auftrags nach `main` veröffentlichen. Codex nimmt außerdem Claudes Beiträge ab.
- **Claude Code:** entwickelt auf eigenem Branch, dokumentiert Basis, Änderungen und Prüfungen und integriert die eigene Arbeit nicht selbst nach `main`.

Claude-Beiträge werden von Codex ausdrücklich **übernommen, mit Änderungswünschen zurückgegeben oder begründet abgelehnt**. Nicht kommentarlos liegen lassen.

Spätere konkrete Nutzeranweisungen haben Vorrang vor früheren Freigaben oder Plänen.

---

## 4. Pflichtprogramm beim Start eines neuen Chats

Bevor irgendetwas geändert wird, den Live-Stand feststellen.

### A. Repository und Zugriff prüfen

1. Exaktes Repository öffnen.
2. Aktuellen `main`-Commit ermitteln.
3. Aktuelle Version aus `package.json` lesen.
4. Wenn ein Checkout vorhanden ist: zuerst `git status --short` prüfen.
5. Uncommittete Arbeit niemals verwerfen oder überschreiben.
6. Tatsächliche Schreibberechtigung getrennt von öffentlichem Lesezugriff prüfen.

### B. Pflichtlektüre

In dieser Reihenfolge lesen:

1. `START-NEUER-CHAT.md`
2. `AGENTS.md`
3. `README.md`
4. neueste relevante Abschnitte in `ENTWICKLUNG.md`
5. oberste/neuste Einträge in `CHANGELOG.md`
6. neueste relevante Dateien in `pruefberichte/`
7. für Claude zusätzlich `CLAUDE.md`

Bei visueller Arbeit zusätzlich die README-Abschnitte zu visueller Vorschau, Browserprüfungen und isoliertem Spieltest lesen. Bei Android-/Release-Arbeit die aktuellen Workflow-Dateien unter `.github/workflows/` lesen.

### C. Offene fremde Arbeit suchen

In einem Git-Checkout:

```bash
git fetch --all --prune
git branch -r --no-merged origin/main
```

Außerdem offene Pull Requests prüfen.

Wichtig: `--no-merged` prüft Abstammung, nicht identischen Inhalt. Nach Rebase oder Squash kann ein Branch angezeigt werden, dessen Änderungen inhaltlich bereits in `main` liegen. Deshalb vor erneuter Integration Diff, Commits und Entwicklungsvermerk vergleichen.

### D. Erst dann den Arbeitsauftrag einordnen

Ein Nutzerwort wie **„Weiter“** bedeutet nicht „irgendwo weitermachen“. Es bedeutet:

- letzten belegten Arbeitsstand aus Repository und aktuellem Chat bestimmen,
- bereits erledigte Runden nicht wiederholen,
- offene Befunde nach Aktualität und Nutzerpriorität ordnen,
- dann mit dem logisch nächsten Arbeitsschritt fortfahren.

---

## 5. Was ein neuer Chat zu Beginn zurückmelden soll

Bevor eine größere neue Runde begonnen wird, kurz und konkret festhalten:

- erkannter Repository- und Branch-Stand,
- aktuelle Version laut `package.json`,
- aktueller `main`-Commit,
- vorhandene offene PRs/Remote-Übergaben,
- jüngste relevante Prüf- und Entwicklungsnotiz,
- belegte offene Punkte,
- welcher davon jetzt bearbeitet wird.

Dabei keine allgemeine Fehlerfreiheit behaupten. „CI grün“ bedeutet nur, dass die dort ausgeführten Prüfungen bestanden haben.

---

## 6. Wichtige Architekturregeln und Invarianten

Diese Punkte vor größeren Änderungen berücksichtigen.

### `App.jsx` ist zentral und konfliktanfällig

Spielkern und große Teile der Oberfläche liegen in `App.jsx`. Die Datei ist ein häufiger Konfliktpunkt. Fremde Änderungen nicht durch komplettes Zurückkopieren einer älteren Datei vernichten. Änderungen möglichst gezielt halten.

### Ausgelagerte Module sind Fabriken

Module wie Ereignisse, Verein, Akademie, Karten und Namen erhalten Helfer aus `App.jsx`, statt sie zurückzuimportieren. Das verhindert problematische Ringimporte und Initialisierungsfehler.

Wird einer Fabrik ein neuer Helfer gegeben, beide Seiten prüfen:

- Annahme/Auspacken in der Fabrik,
- Übergabe beim Erzeugen in `App.jsx`.

### Ereignis- und Auswahlkennungen sind dauerhaft

Gespeicherte Spielstände verweisen auf stabile Kennungen. Bestehende Ereignis- und Auswahl-IDs nicht leichtfertig umbenennen, wiederverwenden oder so verschieben, dass alte Spielstände eine andere Bedeutung bekommen. Änderungen an gespeicherten Strukturen brauchen eine bewusste Kompatibilitäts-/Migrationsentscheidung.

### Prüfstand-Markierungen in `App.jsx` erhalten

Die `PRUEFSTAND-ANFANG/ENDE`-Markierungen sind funktionaler Bestandteil der Testwerkzeuge. Nicht als überflüssige Kommentare entfernen oder verschieben, ohne die Prüfwerkzeuge mitzudenken.

### Speichern/Import ist ein Vertrag

Änderungen an Spielständen, Meta-Fortschritt, Karten, Verein oder Akademie müssen immer auch auf folgende Fragen geprüft werden:

- Lädt ein bestehender Stand weiter?
- Bleiben bereits feststehende Entscheidungen stabil?
- Können Teilfehler einen halb geschriebenen Zustand hinterlassen?
- Bleibt Import/Rücknahme konsistent?
- Werden neue Felder sinnvoll mit alten Daten kombiniert?

### Android-App-ID und Signatur erhalten

`de.rasenschach.xi` sowie der bestehende Release-Signaturpfad sind für Updatefähigkeit relevant. Private Signierschlüssel gehören niemals ins Repository oder in Chat-Nachrichten. Die Workflows prüfen den erwarteten Zertifikats-Fingerabdruck.

### Version und Android-versionCode nicht manuell auseinanderziehen

Die Spielversion kommt aus `package.json`. Der Android-`versionCode`/`versionName` wird mit dem vorgesehenen Repository-Werkzeug synchronisiert. Die aktuelle Berechnungsregel im `README.md` bzw. Werkzeug lesen, statt Werte von Hand zu erfinden.

---

## 7. Dauerhafte Produkt- und Qualitätsleitplanken

Diese Punkte gelten als Arbeitsrichtung, solange der Eigentümer nichts Neueres vorgibt:

- Rasenschach XI soll **kein bloßer Zahlen-Simulator**, sondern ein charaktervoller, langfristig abwechslungsreicher Fußball-Karriere-Simulator sein.
- Die Oberfläche soll auf dem Smartphone klar, schnell erfassbar und eigenständig wirken.
- Optische Spezialeffekte dürfen die Information nicht zerstören: Holo-, Glanz- und Seltenheitseffekte müssen sauber innerhalb ihrer Form wirken und dürfen Porträt, Namen, Werte oder erklärenden Text nicht unleserlich machen.
- Charaktere sollen **wiedererkennbar und dauerhaft identisch** bleiben, wenn sie zwischen Karriere, Ruhmeshalle, Sammelkarte und Vereinskader weitergereicht werden.
- Die Charaktererstellung soll hohe visuelle Qualität, deutlich wahrnehmbare Variation und viele sinnvolle Kombinationen bieten; bloße Varianten, die praktisch gleich aussehen, zählen nicht als echte Individualisierung.
- Mobile Layouts zuerst denken. Schmale Breiten, Touch-Ziele, lange Texte und reduzierte Bewegung mitprüfen.
- Neue Inhalte sollen bestehende Systeme vertiefen, nicht unnötig Parallelwährungen, Pflichtfenster oder komplizierte Sonderwege erzeugen.
- Bestehende Speicherstände und langfristiger Meta-Fortschritt sind wertvoll und dürfen durch Erweiterungen nicht leichtfertig geopfert werden.

Die konkrete aktuelle Priorität **nicht aus dieser Liste ableiten**. Dafür immer letzten Nutzerauftrag und aktuelle Entwicklungsdokumentation lesen.

---

## 8. Standardablauf einer Entwicklungsrunde

### 1. Befund verstehen

- Nutzerproblem präzise lokalisieren.
- Bei gemeldetem Fehler nach Möglichkeit reproduzieren.
- Prüfen, ob derselbe Bereich gerade von einem fremden Branch verändert wurde.
- Ursache von Symptom unterscheiden.

### 2. Änderung klein und nachvollziehbar halten

- Keine fachfremden „Nebenbei-Verbesserungen“ in derselben Runde, wenn sie Risiko erhöhen.
- Bereits vorhandene Korrekturen anderer Beteiligter erhalten.
- Historische Begründungen nicht still löschen; bei widerlegten Annahmen datierten Nachtrag hinterlassen.

### 3. Passende Prüfungen ausführen

Nicht jedes Werkzeug blind starten, sondern passend zur Änderung. Mindestmaß bei normalem App-Code ist typischerweise:

```bash
npm ci
npm test
npm run build
npx cap sync android
```

Vor Ausführung immer `package.json` prüfen; wenn Skripte geändert wurden, gilt der aktuelle Repository-Stand.

### 4. Spezielle Prüfungen ergänzen

- Simulation/Balance/Ergebnislogik: Langzeitlauf und gezielte Regressionen.
- Charaktere/Karten/Wildcards/Layout: visuelle Galerie und Browserprüfungen.
- vollständige Bedienwege: isolierter Spieltest und echte Interaktion.
- Android-native Themen, Touch, Leistung, App-Unterbrechung, Dateiauswahl/Download: echtes Gerät bzw. passende Android-Prüfung.
- Icon/Launcher: aktuelle Icon-Quellen und Generierungswerkzeuge verwenden, nicht gerasterte Altstände manuell verteilen.

### 5. Ergebnis ehrlich dokumentieren

Immer unterscheiden zwischen:

- statischem Codebefund,
- automatischem Regressionstest,
- Langzeitsimulation,
- Browser-Smoke,
- visueller Sichtprüfung,
- echter Android-Geräteprüfung.

Ein Browsererfolg ist kein Android-Gerätetest. Ein bestandener Build ist kein Bedienungstest. Ein Langzeitlauf prüft nicht automatisch React-Interaktion oder Optik.

### 6. Dokumentation aktualisieren

Nach den Repository-Regeln:

- spielerrelevante Änderung → `CHANGELOG.md`,
- Prüfungen/Befunde/offene Punkte/Abnahme → `ENTWICKLUNG.md` bzw. passender Prüfbericht,
- dauerhafte Werkzeug-/Architektur-/Workflowregel → `README.md`,
- Begründung direkt am betroffenen Code, wenn sie dort für künftige Änderungen wichtig ist,
- jede Runde → aussagekräftige Commit-Nachricht.

### 7. Veröffentlichung vorbereiten

Vor dem Schreiben nach `main` Remote erneut abgleichen. Wenn `main` weitergelaufen ist, fremde Änderungen zuerst integrieren und betroffene Prüfungen wiederholen.

Keine Force-Pushes, um Konflikte „wegzuräumen“.

### 8. CI und Auslieferung prüfen

Nach Veröffentlichung nicht beim Commit aufhören:

- exakt die Workflow-Läufe dieses Commits prüfen,
- Status und Ergebnis jedes relevanten Workflows feststellen,
- bei Fehlern Jobs/Logs lesen,
- bei Android-Build das erzeugte Artefakt und dessen Commit-Zuordnung prüfen,
- Ablaufdatum von Artefakten beachten.

Workflow-Namen, Trigger und Artefaktnamen können sich ändern. Darum die aktuellen Dateien unter `.github/workflows/` und die tatsächlichen Läufe verwenden, statt Werte aus dieser Übergabe zu übernehmen.

---

## 9. Test- und Prüfwerkzeuge

Die genauen aktuellen Befehle stehen in `package.json` und `README.md`. Typische Werkzeuge des Projekts sind:

### Regressionen

`npm test`

Prüft unter anderem Speicher-/Importpfade, stabile Kennungen, Buchungen und konkrete Spiellogik. Die Zahl bestandener Tests nie dauerhaft in diese Übergabe schreiben. Gültig ist immer die Ausgabe des aktuellen Laufs.

### Produktionsbuild

`npm run build`

Belegt, dass das aktuelle Web-Bündel gebaut werden kann. Belegt nicht automatisch korrekte Optik oder Bedienung.

### Capacitor-Synchronisierung

`npx cap sync android`

Nach spielrelevanten Webänderungen vor einem Android-Build aktuell halten.

### Langzeitlauf

`node tools/langzeit.cjs`

Für Simulation, Laufbahnen, Balance und Pack-/Systemstichproben. Die genaue aktuelle Testmenge und Optionen aus `README.md` bzw. dem Skript lesen. Ergebnisse sind Stichproben und müssen als solche bezeichnet werden.

### Visuelle Vorschau

`npm run preview:gallery`

Erzeugt die aktuellen isolierten Vorschau-/Spieltest-Dateien mit echten Komponenten. Die Galerie eignet sich für Porträts, Wildcards, Karten, Packs und weitere visuelle Elemente. Testdaten bleiben vom produktiven Spielstand getrennt.

### Browserprüfungen

`npm run test:browser`

Prüft relevante Bildschirmbreiten und Bedienpfade. Screenshots, Traces und Bericht bei Fehlern tatsächlich ansehen; nur den Exitcode zu nennen reicht bei visuellen Problemen nicht.

### Porträtvergleich

Die im `README.md` dokumentierten Porträtbogen-Werkzeuge verwenden, wenn Kopfformen, Frisuren, Bärte, Haut-/Haarfarben oder Konturen systematisch verglichen werden sollen.

### Isolierter Spieltest

Die generierte isolierte Spieltest-Seite verwendet getrennte Sitzungsdaten und eignet sich für echte Klickpfade ohne produktive Spielstände zu verändern. Sie ersetzt keinen vollständig freigespielten Langzeitweg und keinen Android-Test.

---

## 10. Besondere Regeln für visuelle Arbeit

Bei optischen Änderungen nicht nur CSS/Code lesen, sondern das Ergebnis ansehen.

### Charaktere

- mehrere Geschlechter/Varianten,
- unterschiedliche Kopf- und Gesichtsformen,
- helle und dunkle Haut-/Haarfarben,
- Frisuren/Bärte/Accessoires,
- kleine und große Darstellung,
- Charaktererstellung **und** spätere Verwendung desselben Porträts prüfen.

### Karten, Wildcards und Packs

- Effekte an allen relevanten Seltenheiten prüfen,
- mit und ohne Bewegung/reduzierte Bewegung,
- kleine Karten, große Enthüllung und Shop-/Packdarstellung,
- keine abgeschnittenen Masken oder rechteckigen Fremdkanten,
- Druck, Rahmen, Glanz und Holografie müssen sauber zur tatsächlichen Karten-/Packform passen,
- Text und Porträt müssen lesbar bleiben.

### Responsive Bedienung

Mindestens eine sehr schmale Smartphonebreite, eine typische Smartphonebreite und eine größere Ansicht prüfen. Bei horizontalen Reitern, langen Karriereübersichten, Dialogen und Fußleisten auf Erkennbarkeit und erreichbare Touch-Ziele achten.

### Ruhemodus / reduzierte Bewegung

„Animation aus“ heißt nicht nur langsamere Animation. Bewegte, schwebende, bebende oder wandernde Effekte müssen tatsächlich stillstehen, während Information und Gestaltung erhalten bleiben.

---

## 11. Android-Build und Release

Vor einem Build die **aktuellen** Workflow-Dateien lesen. Nicht davon ausgehen, dass Trigger oder Dateinamen unverändert geblieben sind.

Für eine neue App-Fassung gilt grundsätzlich:

1. Spielversion in `package.json` nach Repository-Regel erhöhen.
2. Android-Version mit dem vorgesehenen Werkzeug synchronisieren.
3. Regressionen und Produktionsbuild ausführen.
4. Capacitor synchronisieren.
5. Änderungen veröffentlichen.
6. Android-Workflow am exakten veröffentlichten Commit prüfen.
7. Signaturprüfung und Build-Erfolg kontrollieren.
8. Artefakt nur dann als verfügbar melden, wenn es tatsächlich existiert und dem richtigen Commit zugeordnet ist.

Eine reine Dokumentations- oder Werkzeugänderung, die das ausgelieferte Spiel nicht verändert, benötigt nach den aktuellen Projektregeln **keine neue Spielversion und keine neue APK**.

Private Schlüssel, Tokens und Signier-Secrets nie anfordern, ausgeben oder committen.

---

## 12. Wenn direkter `git push` nicht funktioniert

Technische Shell-Authentifizierung und die dokumentierte Nutzerfreigabe sind zwei verschiedene Dinge.

Wenn die verbundene GitHub-Anbindung Schreibzugriff bietet, darf sie im Rahmen des Auftrags für Repository-Änderungen verwendet werden. Bei API-/Git-Daten-Übertragung:

- aktuelle Basis erneut lesen,
- nur die beabsichtigten Dateien ändern,
- korrekten Elterncommit verwenden,
- fremde Änderungen erhalten,
- keinen Force-Update durchführen,
- bei abweichender Commit-ID durch API-Übertragung den Inhaltsstand statt nur die lokale ID vergleichen und dokumentieren.

Fehlt der technische Zugriff vollständig, den konkreten technischen Blocker benennen. Keine Zugangsdaten oder privaten Schlüssel vom Nutzer im Chat verlangen.

---

## 13. Umgang mit historischen Berichten und alten ZIPs

Historische Berichte sind wichtig, weil sie Ursachen, frühere Fehlversuche und damalige offene Punkte dokumentieren. Sie sind aber **keine automatische To-do-Liste für den aktuellen Stand**.

Bei einem alten Befund:

1. prüfen, ob er laut späterem Changelog/Entwicklungsvermerk bereits bearbeitet wurde,
2. aktuellen Quellcode ansehen,
3. aktuelle Regression oder Reproduktion ausführen,
4. erst dann als weiterhin offen einstufen.

Alte Versionsnummern, Testzahlen oder damalige Abnahmeurteile nicht ohne Prüfung in eine neue Statusmeldung übernehmen.

---

## 14. Wie typische Nutzeraufträge zu verstehen sind

### „Weiter“

Live-Repository abgleichen und den zuletzt belegten, noch offenen Arbeitspunkt fortsetzen. Nicht eine alte Erinnerung fortschreiben.

### „Prüf das Spiel / such Fehler“

Nicht nur statisch lesen. Soweit mit verfügbaren Werkzeugen möglich: Tests, echte Bedienwege, visuelle Prüfung und relevante Langzeitpfade kombinieren. Gefundene Probleme nach Schwere und Beleg trennen.

### „Verbessere die Optik“

Vorher/Nachher tatsächlich ansehen. Lesbarkeit und mobile Darstellung höher gewichten als Effektmenge.

### „Mach die APK / Update“

Nicht nur Quellcode ändern. Versionierung, Android-Sync, Veröffentlichung, Workflow, Signatur und tatsächliches Artefakt bis zum Ende prüfen.

### „Claude hat etwas gemacht“

Branch/PR und Basiscommit ermitteln, Diff und Vermerk lesen, Arbeit fachlich abnehmen und erst danach integrieren oder begründet zurückgeben.

---

## 15. Wann eine Runde wirklich fertig ist

Eine Entwicklungsrunde ist erst abgeschlossen, wenn alle zutreffenden Punkte erfüllt sind:

- Nutzerauftrag umgesetzt oder transparent abgegrenzt,
- fremde parallele Arbeit berücksichtigt,
- betroffene Tests bestanden,
- erforderliche visuelle/Browser-/Android-Prüfung entweder durchgeführt **oder ausdrücklich als offen markiert**,
- Speicherung/Altdaten bei relevanten Änderungen bedacht,
- Dokumentation an der richtigen Stelle aktualisiert,
- Version nur dann geändert, wenn die Projektregel es verlangt,
- Commit/Veröffentlichung sauber erfolgt,
- relevante CI am veröffentlichten Commit kontrolliert,
- verbleibende Risiken und nächster sinnvoller Schritt dokumentiert.

„Keine weiteren Fehler gefunden“ ist nicht gleichbedeutend mit „fehlerfrei“.

---

## 16. Vorlage für die Übergabe nach jeder Entwicklungsrunde

Diese Vorlage gehört in den jeweiligen Entwicklungsvermerk oder die Chat-Übergabe; **nicht** als statischer Live-Status in dieses Dokument.

```text
Rasenschach XI – Übergabe

Basis:
- Repository:
- Branch:
- Ausgangscommit:
- Zielcommit:
- Version laut package.json:

Auftrag:
- ...

Geändert:
- ...

Übernommene fremde Arbeit:
- Branch/PR/Commit:
- Entscheidung und Begründung:

Geprüft:
- npm test: ...
- npm run build: ...
- Capacitor-Sync: ...
- Browser/visuell: ...
- Langzeitlauf: ...
- Android-Gerät: ...

CI / Veröffentlichung:
- relevante Workflow-Läufe:
- Ergebnis:
- Android-Artefakt vorhanden: ja/nein/nicht erforderlich

Bewusst offen:
- ...

Nächster sinnvoller Schritt:
- ...
```

Keine Prüfung in die Vorlage als „bestanden“ eintragen, die nicht tatsächlich durchgeführt wurde.

---

## 17. Kompakter Startauftrag für einen völlig neuen Chat

Falls ein neuer Chat nur einen kurzen Arbeitsauftrag bekommen soll, kann zusätzlich zu dieser Datei Folgendes verwendet werden:

> Arbeite am Projekt Rasenschach XI weiter. Verwende ausschließlich den aktuellen Live-Stand von `sirmebro-sketch/rasenschachonlyapp` als Basis. Lies zuerst `START-NEUER-CHAT.md`, danach `AGENTS.md`, `README.md`, die jüngsten relevanten Einträge in `ENTWICKLUNG.md`, `CHANGELOG.md` und `pruefberichte/`; bei Claude zusätzlich `CLAUDE.md`. Ermittle aktuellen `main`-Commit und Version selbst, prüfe offene PRs/Remote-Branches und erhalte fremde bzw. uncommittete Arbeit. Setze den Nutzerauftrag gewissenhaft um, führe die passenden Tests und Sichtprüfungen aus, dokumentiere nur tatsächlich belegte Ergebnisse und prüfe nach Veröffentlichung die CI am exakten Commit. Keine alte Versionsangabe aus Chat-Erinnerungen oder Anhängen als aktuelle Wahrheit übernehmen.

---

## 18. Warum dieses Dokument absichtlich keinen „aktuellen Stand“ enthält

Eine frühere Übergabe enthielt Version, Commit, Testzahl, Workflow-Ergebnis und damals offene Punkte. Schon wenige Entwicklungsrunden später waren mehrere dieser Angaben veraltet, obwohl die Arbeitsregeln weiterhin richtig waren.

Darum gilt jetzt:

- **diese Datei beschreibt das Verfahren**, nicht den Tagesstand;
- **`package.json` beschreibt die aktuelle Version**;
- **Git beschreibt den aktuellen Commit und offene Branches**;
- **`ENTWICKLUNG.md` und `pruefberichte/` beschreiben die jüngste belegte Prüfung und offene Punkte**;
- **GitHub Actions beschreibt die tatsächliche CI des veröffentlichten Commits**.

So kann dieselbe Übergabe auch nach vielen weiteren Versionen noch verwendet werden, ohne einen neuen Chat mit veralteten Zahlen in die falsche Richtung zu schicken.
