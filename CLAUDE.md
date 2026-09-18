# Hinweise für Claude Code

Die Regeln für die Arbeit an diesem Projekt sind für alle Beteiligten dieselben
und stehen in **`AGENTS.md`** (Rollen, Ablauf vor und nach jeder Runde) sowie in
**`README.md`** (Vermerk-Konvention, Prüfstände, Versionsschema).

Diese Datei wiederholt sie bewusst nicht. Drei Fassungen derselben Regel laufen
auseinander — dieses Projekt hat das schon erlebt, siehe den Abschnitt
„Regressionen" in `ENTWICKLUNG.md`.

**Vor jeder Runde zuerst `AGENTS.md` lesen und den dortigen Ablauf ausführen**,
insbesondere offene Übergaben finden und fremde Arbeit vor dem eigenen Beginn
übernehmen:

```
git fetch --all --prune
git branch -r --no-merged origin/main
```

Bei Arbeit an Charaktererstellung, Porträts, Frisuren/Bärten, Spielerkarten,
Wildcards, Packs oder Spezialeffekten zusätzlich
[`CHARAKTER-OPTIK-ARBEITSPLAN.md`](CHARAKTER-OPTIK-ARBEITSPLAN.md) lesen und die
Runde einer dortigen Paket-ID zuordnen. Neue Varianten nicht durch bloße Menge
als Verbesserung behandeln; visuelle Abnahme und stabile gespeicherte Indizes
sind Teil des Auftrags.

## Die eigene Rolle

Codex nimmt Claudes Arbeit ab, bevor sie nach `main` geht. Daraus folgt für
jede Runde, ohne Ausnahme:

- **Auf einem eigenen Branch arbeiten, nie direkt auf `main`.**
- **Die eigene Arbeit nicht selbst nach `main` zusammenführen** — auch dann
  nicht, wenn es ein sauberer Fast-Forward wäre, die Prüfungen grün sind und
  niemand widerspricht. Die Abnahme ist nicht die Prüfung des Codes, sondern
  die Entscheidung darüber, und die trifft Codex.
- **Die Abnahme vorlegen:** ein Vermerk in `ENTWICKLUNG.md` mit Basis-Commit,
  Änderungen, durchgeführten Prüfungen samt Ergebnis und ausdrücklich offenen
  Punkten. Übergeben wird über den Branch.
- **Den Pull Request eröffnet Claude, entschieden wird er von Codex**
  (Kevin, 17.09.2026). Eröffnen und Zusammenführen sind zwei Handlungen: das
  Eröffnen ändert an `main` nichts, es legt den Vorschlag sichtbar hin und
  lässt die CI daran laufen (`.github/workflows/regression.yml`, `on:
  pull_request` — ein reiner Branch-Push löst sie nicht aus). Abnahme,
  Prüfung, Gegenprobe und der Merge-Knopf liegen bei Codex.
  Daraus folgt, was Claude am Pull Request **nicht** tut: nicht
  zusammenführen, nicht freigeben, kein Auto-Merge einschalten, keinen
  fremden Pull Request schliessen. Der Vermerk in `ENTWICKLUNG.md` gehört
  trotzdem hinein — die CI prüft, ob es baut, nicht ob es stimmt.
- **Eine Entscheidung von Codex wird umgesetzt, nicht neu verhandelt.** Wer
  einen Fehler darin sieht, sagt es einmal mit Begründung; danach gilt die
  Entscheidung. Der Eigentümer kann sie aufheben.
- **Nicht ungefragt Umfang ergänzen.** Was auffällt, aber nicht zur Aufgabe
  gehört, wird als offener Punkt vermerkt statt nebenbei miterledigt.
