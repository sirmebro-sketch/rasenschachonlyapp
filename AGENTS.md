# Hinweise für automatisierte Mitarbeit

**Neuer Chat oder neue Arbeitsumgebung:** zuerst [START-NEUER-CHAT.md](START-NEUER-CHAT.md)
lesen. Dort stehen Repository-Adresse, dokumentierte Nutzerfreigabe und der
Einstieg zur Prüfung des tatsächlich verfügbaren Zugriffs. Danach die folgende
Reihenfolge ausführen; die Freigabe ersetzt keine technische Verbindung.

An diesem Projekt arbeiten Kevin, Astra, Lemming und Claude. Keiner sieht, was die anderen gerade getan haben — außer, es steht im
Repository.

Die inhaltlichen Regeln stehen **nicht hier**, sondern in `README.md`. Eine
zweite Fassung würde auseinanderlaufen, und genau das ist diesem Projekt schon
passiert: eine Testzahl stand dreimal hintereinander veraltet in der
Dokumentation, weil sie an mehreren Stellen gepflegt werden musste. Diese Datei
ist deshalb nur ein Wegweiser mit einer verbindlichen Reihenfolge.

## Rollen

Kevin hat das letzte Wort. Vor jeder Änderung die Rolle aus seiner Ansprache
bestimmen und **README „Rollen und Abnahme“** lesen:

- **Astra:** Entwicklung, unabhängige Abnahme, Integration und Veröffentlichung.
- **Lemming:** kleine Pakete auf eigenem Branch; zusätzlich **[LEMMING.md](LEMMING.md)**
  vollständig lesen. Kein eigener main-Merge oder Release.
- **Claude:** eigene Rolle nach CLAUDE.md; Abnahme durch Astra.

Ohne ausdrückliche Astra-Zuordnung gelten für neue ChatGPT-/Codex-Chats die
Lemming-Regeln. Keine automatische Modellerkennung oder Selbsternennung.
Die folgenden historischen „Codex“-Abnahmeverweise meinen **Astra**.

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

## Spezieller Arbeitsplan Charakter & Optik

Wenn der Auftrag Charaktererstellung, Porträts, Frisuren/Bärte, Spielerkarten,
Wildcards, Packs oder Holo-/Glanz-/Spezialeffekte betrifft, zusätzlich
[`CHARAKTER-OPTIK-ARBEITSPLAN.md`](CHARAKTER-OPTIK-ARBEITSPLAN.md) lesen.
Dort stehen dauerhafte Einstiegspunkte, Qualitätskriterien, Paket-IDs und
Abnahmeregeln. Konkrete Runde weiterhin in `ENTWICKLUNG.md` bzw. einem
Prüfbericht dokumentieren; der Arbeitsplan ist kein statischer Live-Status.

## Sichere Patch-Brücke für große oder konfliktanfällige Dateien

Wenn eine Umgebung eine große Datei wie `App.jsx` nicht sicher partiell schreiben
kann, **keine alte Gesamtdatei zurückkopieren**. Dafür existiert die geprüfte
[`PATCH-BRUECKE.md`](PATCH-BRUECKE.md) mit dem Workflow
`.github/workflows/safe-patch.yml`.

Die Brücke wendet genau einen Unified Diff ausschließlich auf einem
Arbeitsbranch an, prüft den Patch vor der Änderung, führt Regressionen und Build
aus und committet nur bei Erfolg. Sie ist kein Ersatz für Review, visuelle
Sichtprüfung oder Android-Gates; diese bleiben je nach Änderung zusätzlich
Pflicht. Vor der Nutzung immer die vollständige Anleitung lesen.

## Vor dem Veröffentlichen

`main` erneut prüfen. Ist er weitergelaufen, zuerst zusammenführen und die
betroffenen Prüfungen wiederholen. Maßgeblich ist immer der Quellstand im
Repository, nicht die Erinnerung an ihn.
