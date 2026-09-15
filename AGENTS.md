# Hinweise für automatisierte Mitarbeit

An diesem Projekt arbeiten drei Beteiligte: der Eigentümer, ChatGPT/Codex und
Claude. Keiner sieht, was die anderen gerade getan haben — außer, es steht im
Repository.

Die inhaltlichen Regeln stehen **nicht hier**, sondern in `README.md`. Eine
zweite Fassung würde auseinanderlaufen, und genau das ist diesem Projekt schon
passiert: eine Testzahl stand dreimal hintereinander veraltet in der
Dokumentation, weil sie an mehreren Stellen gepflegt werden musste. Diese Datei
ist deshalb nur ein Wegweiser mit einer einzigen verbindlichen Reihenfolge.

## Vor jeder Runde

```
git fetch --all --prune
git branch -r --no-merged origin/main
```

Jeder gelistete Branch trägt Arbeit, die noch nicht in `main` ist. Was darauf
liegt, zeigt `git log --oneline origin/main..<branch>`.

**Diese Arbeit wird mitgenommen**, also vor dem eigenen Beginn in die
Arbeitsbasis übernommen — nicht nur gelesen. Erledigte Branches verschwinden
von selbst aus der Liste, sobald ihre Commits in `main` stehen; die Liste
pflegt also niemand von Hand.

Wird ein gefundener Branch bewusst nicht übernommen, gehört der Grund in den
Entwicklungsvermerk in `ENTWICKLUNG.md`. Stillschweigendes Übergehen ist der
eine Fall, den diese Regel verhindern soll.

## Dann weiterlesen in `README.md`

- **„Zusammenarbeit und Vermerke"** — wohin welcher Vermerk gehört
  (`CHANGELOG.md`, `ENTWICKLUNG.md`, `README.md`, Kommentar am Code,
  Commit-Nachricht) und die sechs Regeln dazu.
- **„Offene Übergaben finden"** — die Langfassung des Abschnitts oben.
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
