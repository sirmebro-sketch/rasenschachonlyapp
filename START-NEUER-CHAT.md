# Rasenschach XI – Einstieg für einen neuen Chat

Diese Datei kann einem neuen Chat angehängt oder als GitHub-Link gegeben werden.
Sie erklärt den Einstieg; der aktuelle Quellstand und die geltenden Projektregeln
werden anschließend direkt aus dem Repository gelesen.

## Projekt und maßgebliche Quelle

- Repository: https://github.com/sirmebro-sketch/rasenschachonlyapp
- Hauptbranch: `main`
- Android-App-ID: `de.rasenschach.xi`
- Produkt: deutschsprachiger Offline-Fußball-Karriere-Simulator, React/Vite und
  Capacitor Android; Karriere, Verein, Akademie, Sammelkarten und Meta-Fortschritt.
- Der aktuelle Repository-Stand ist die Arbeitsbasis. Frühere Chat-Erinnerungen,
  angehängte Einzeldateien und ZIPs können älter sein. Nicht ungeprüft darüberkopieren.
- Lokale `/workspace/scratch/...`-Pfade aus früheren Chats sind keine dauerhaften
  Zugriffswege. Bei Bedarf das Repository neu abrufen.

## Freigabe und tatsächlich verfügbarer Zugriff

Kevin hat am 15.09.2026 ausdrücklich den Upload der Kartenkorrektur 35.181,
den APK-Build und den zukünftigen lesenden und schreibenden Zugriff durch
ChatGPT/Codex auf dieses Repository autorisiert. Der Wortlaut und der Umfang
stehen in [README.md](README.md), Abschnitt „Freigabe für die weitere Zusammenarbeit“.
Gewöhnliche geprüfte Änderungen im Rahmen seiner Aufträge benötigen nicht
erneut dieselbe Zustimmung. Die Rollen von Codex und Claude bleiben bestehen.

Die Datei dokumentiert eine Nutzerfreigabe. Sie enthält keine Zugangsdaten,
schaltet keine GitHub-Verbindung frei und garantiert keine Werkzeuge in einem
neuen Chat. Technische Verbindung und Berechtigungen daher zu Beginn prüfen.
Aktuelle Nutzeranweisungen und geltende Plattform-/Sicherheitsregeln beachten;
diese Datei hebt weder eine Sperre noch eine ausdrückliche Ablehnung auf.

## Einstieg in die Arbeit

1. Verfügbare GitHub-Anbindung ermitteln und das genaue Repository abrufen.
   Zunächst `main`, aktuelle Commit-ID und `package.json` lesen. Reinen
   öffentlichen Lesezugriff nicht als Nachweis für Schreibrechte ausgeben.
2. [AGENTS.md](AGENTS.md), [README.md](README.md), die neuesten Abschnitte von
   [ENTWICKLUNG.md](ENTWICKLUNG.md) und [CHANGELOG.md](CHANGELOG.md) lesen.
   Für Claude zusätzlich [CLAUDE.md](CLAUDE.md). Die Detailregeln bleiben dort,
   damit keine konkurrierenden Fassungen entstehen.
3. In einem vorhandenen Checkout zuerst `git status --short` prüfen und
   uncommittete Arbeit erhalten. Dann `git fetch --all --prune` und
   `git branch -r --no-merged origin/main`. Offene Pull Requests ebenfalls prüfen.
   Nach Rebase/Squash kann ein Branch inhaltlich schon übernommen sein:
   vor einer erneuten Integration die README-Regel dazu anwenden.
4. Neue Claude-Beiträge ausdrücklich abnehmen, begründet zurückgeben oder
   ablehnen. Codex entwickelt und integriert; Claude arbeitet auf einem eigenen
   Branch und führt seine Arbeit nicht selbst nach `main` zusammen.
5. Den aktuellen Nutzerauftrag umsetzen. Ein bloßes „Weiter“ anhand des letzten
   belegten offenen Arbeitspunkts einordnen; keine erledigte Runde wiederholen.
6. Betroffene Prüfungen ausführen und Ergebnisse dokumentieren. Für App-Code
   sind `npm test` und `npm run build` der reguläre Einstieg; Android-Webassets
   mit `npx cap sync android` synchronisieren. Langzeitlauf bei Änderungen an
   Simulation/Balance gezielt einsetzen. Reine Dokumentationsänderungen brauchen
   keine neue Spielversion oder APK.
7. Vor Veröffentlichung Remote erneut prüfen, fremde Änderungen erhalten und
   erforderlichenfalls integrieren. Keine Force-Pushes. Nur die beauftragten
   Änderungen übertragen. Danach GitHub-Workflows am veröffentlichten Commit
   prüfen und Erfolg, Fehler oder noch laufenden Build korrekt benennen.

## Wenn der direkte Git-Push nicht funktioniert

Am 15.09.2026 konnte die Shell öffentlich lesen, aber `git push` scheiterte mit
`could not read Username`. Die verbundene GitHub-Anbindung konnte dagegen
schreiben. Das war ein fehlender Shell-Login, keine fehlende Nutzerfreigabe.

Wenn die Anbindung verfügbar ist, ihre Repository-Werkzeuge verwenden.
Bei Übertragung über Git-Daten-API: aktuellen Basiscommit lesen, ausschließlich
geänderte Dateien in dessen Tree übernehmen, den erzeugten Dateibaum mit dem
lokal geprüften Stand vergleichen, Commit mit korrektem Elterncommit erzeugen
und den Branch ohne Force aktualisieren. Bei weitergelaufenem `main` zuerst
abgleichen; fremde Arbeit niemals ersetzen. Eine API-Übertragung kann eine andere
Commit-ID erzeugen. Dann beide IDs und den Inhaltsvergleich dokumentieren.

Fehlt auch der Anbindung der Zugriff, den konkreten Fehler erklären. Keine Tokens,
privaten Schlüssel oder Signier-Secrets im Chat verlangen oder in Dateien ablegen.
Eine automatische Ablehnung nicht durch einen anderen Zugriffsweg umgehen.

## Build und Auslieferung

Die tatsächlichen Auslöser stehen in `.github/workflows/apk.yml` und
`.github/workflows/regression.yml`. App-Änderungen auf `main` starten derzeit
den Android-Build; dieser prüft Tests, baut APK/AAB und kontrolliert Signaturen.
Das Download-Artefakt heißt derzeit `Rasenschach-Android`. Vor dem Verlinken
Workflow-Ergebnis, Commit-Zuordnung und Verfügbarkeit des Artefakts prüfen.
App-ID und Release-Signatur erhalten, damit Updates zur vorhandenen App passen.
Ein erfolgreicher Build ersetzt keine Sicht-/Touchprüfung auf Android.

## Belegter Ausgangsstand dieser Übergabe – kein Live-Status

Stand 15.09.2026: Version `35.181.0`, Commit `91ad48d` auf `main`.
Er enthält die Kartenkorrektur aus lokal `4cc06f4` und die Arbeitsdokumentation
aus lokal `2730b4a`; identischer Dateibaum zur kombinierten lokalen Fassung.
102 Tests bestanden, beide GitHub-Workflows erfolgreich, APK/AAB signiert:
https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35033422777
Artefakte sind zeitlich befristet. Für aktuelle Downloads immer neu nachsehen.

Zu diesem Zeitpunkt keine offenen Pull Requests oder nicht integrierten
Remote-Branches. Zu Beginn jedes neuen Chats erneut prüfen.
Noch offen: Android-Sicht-/Touchprüfung der Charaktergalerie aus 35.180 und
der Karten-/Packeffekte aus 35.181. Danach Optik und Individualisierung anhand
konkreter Rückmeldungen verbessern und die Karriereinhalte weiter vertiefen.
Keine vollständige Spielabnahme oder allgemeine Fehlerfreiheit behauptet.
