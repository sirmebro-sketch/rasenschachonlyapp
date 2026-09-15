# Hinweise für automatisierte Mitarbeit

**Neuer Chat oder neue Arbeitsumgebung:** zuerst [START-NEUER-CHAT.md](START-NEUER-CHAT.md)
lesen. Dort stehen Repository-Adresse, dokumentierte Nutzerfreigabe und der
Einstieg zur Prüfung des tatsächlich verfügbaren Zugriffs. Danach die folgende
Reihenfolge ausführen; die Freigabe ersetzt keine technische Verbindung.

An diesem Projekt arbeiten drei Beteiligte: der Eigentümer, ChatGPT/Codex und
Claude. Keiner sieht, was die anderen gerade getan haben — außer, es steht im
Repository.

Die inhaltlichen Regeln stehen **nicht hier**, sondern in `README.md`. Eine
zweite Fassung würde auseinanderlaufen, und genau das ist diesem Projekt schon
passiert: eine Testzahl stand dreimal hintereinander veraltet in der
Dokumentation, weil sie an mehreren Stellen gepflegt werden musste. Diese Datei
ist deshalb nur ein Wegweiser mit einer verbindlichen Reihenfolge.

## Rollen

Der Eigentümer entscheidet, was gebaut wird, und hat das letzte Wort.
**Codex entwickelt und nimmt Claudes Arbeit ab**, bevor sie nach `main` geht.
Claude entwickelt zu, liefert auf einem eigenen Branch und integriert seine
Arbeit nicht selbst. Die Langfassung steht in `README.md`, Abschnitt
„Rollen und Abnahme".

## Vor jeder Runde

```
git fetch --all --prune
git branch -r --no-merged origin/main
```

Jeder gelistete Branch hat Commits, die nicht Vorfahren von `main` sind.
Nach Rebase/Squash können die Inhalte bereits übernommen sein; zuerst README
„Übergaben nach Rebase oder Squash“ beachten. Was darauf
liegt, zeigt `git log --oneline origin/main..<branch>`; der zugehörige
Abnahmevermerk steht in `ENTWICKLUNG.md` (Basis-Commit, Änderungen, Prüfungen,
offene Punkte). Erledigte Branches verschwinden von selbst aus der Liste, sobald
ihre Commits in `main` stehen — die Liste pflegt also niemand von Hand.

**Für Codex ist das die Abnahmeliste.** Jeder Eintrag ist ein Vorschlag, der auf
eine Entscheidung wartet. Drei Ausgänge sind in Ordnung:

- **übernehmen** — in die eigene Arbeitsbasis zusammenführen, betroffene
  Prüfungen wiederholen, im Entwicklungsvermerk den übernommenen Commit nennen;
- **mit Änderungswünschen zurückgeben** — im Pull Request oder in
  `ENTWICKLUNG.md`, mit Begründung;
- **ablehnen** — ebenfalls mit Begründung.

Nicht in Ordnung ist der vierte Fall: kommentarlos liegen lassen. Die Begründung
ist die eigentliche Information — ohne sie baut Claude denselben Vorschlag in
der nächsten Runde wieder.

Bei fachlicher Uneinigkeit entscheidet Codex. Der Eigentümer kann jede dieser
Entscheidungen aufheben.

## Dann weiterlesen in `README.md`

- **„Zusammenarbeit und Vermerke"** — wohin welcher Vermerk gehört
  (`CHANGELOG.md`, `ENTWICKLUNG.md`, `README.md`, Kommentar am Code,
  Commit-Nachricht) und die sechs Regeln dazu.
- **„Rollen und Abnahme"** — die Langfassung des Abschnitts oben.
- **„Prüfstände"** — `npm test`, der optionale Langzeitlauf und die
  Prüfstand-Marken in `App.jsx`. Die vier Zeilen `PRUEFSTAND-ANFANG/ENDE` sind
  keine gewöhnlichen Kommentare; `tools/langzeit.cjs` schneidet daran.
- **„Gleichzeitige Arbeit"** — Zusammenführen, Konfliktlösung, keine
  Force-Pushes.
- **„Versionsschema"** — wann die Version steigt und wann nicht.

## Vor dem Veröffentlichen

`main` erneut prüfen. Ist er weitergelaufen, zuerst zusammenführen und die
betroffenen Prüfungen wiederholen. Maßgeblich ist immer der Quellstand im
Repository, nicht die Erinnerung an ihn.
