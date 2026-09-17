# Beta 35.193.0 — nicht abgenommen, nicht nach `main`

> **Dieser Zweig ist kein Auslieferungszweig.** Er existiert, damit Kevin die
> Vereinswirtschaft auf dem Gerät ausprobieren kann, **bevor** Codex sie
> abnimmt. Er wird nicht zusammengeführt und bekommt keinen Pull Request.

## Was drin ist

`main` plus die vollständige Wirtschaftskette, die zur Abnahme vorliegt:

| Pull Request | Paket |
|---|---|
| #6 | Wirtschaftskern, Vereinsführung, Spielergehälter |
| #9 | WIRT-P0-02 — Abrechnung am Spielablauf |
| #11 | WIRT-P0-03 — Ausbau kostet Geld |
| #13 | WIRT-P0-04 — Sponsorenwahl |
| #15 | WIRT-P1-01 — Saisonabrechnung sichtbar |
| #16 | WIRT-P1-05 — Restkasse zählt beim Abschluss |

Nicht enthalten: #7 (`workflow_dispatch` in `regression.yml`) — reine
Werkzeugänderung ohne Wirkung auf die App.

## Wie die Kennzeichnung funktioniert

**Die Versionsnummer trägt kein „Beta", und das ist Absicht.**
`tools/android-version.cjs` verlangt strikt `\d+\.\d+\.\d+`; `35.193.0-beta`
würde den Bau abbrechen. Schwerwiegender: `VERSION` in `App.jsx` wandert in
jede Sicherung, und `backupLesen` in `sicherung.js` weist alles ab, was nicht
`\d+\.\d+` ist — ein „Beta" in der Nummer wäre kein Schönheitsfehler, sondern
ein Spielstand, der sich nicht mehr einlesen lässt.

Gekennzeichnet wird deshalb an vier anderen Stellen:

1. **App-Name auf dem Startbildschirm:** „Rasenschach XI (Beta)".
2. **Eigene App-ID** `de.rasenschach.xi.beta` — die Beta installiert sich
   **neben** der echten App und fasst deren Spielstände nicht an.
3. **Im Spiel sichtbar:** neben „Fassung 35.193" steht
   „Beta · von Astra noch nicht abgenommen", im Einstellungsbildschirm und in
   der Fusszeile.
4. **Der Dateiname** der gebauten APK endet auf `-BETA-unabgenommen`.

## Wie man sie baut

Actions → **„Android-App bauen"** → *Run workflow* → Zweig
`claude/beta-35.193` wählen. Der Ablauf lässt vorher `npm test` laufen und
prüft die Signatur; die APK liegt danach als Artefakt „Rasenschach-Android"
am Lauf.

## Was beim Testen zu beachten ist

- **Die Beta startet leer.** Eigene App-ID heisst eigener Speicher. Wer mit
  einem vorhandenen Stand testen will, exportiert ihn in der echten App als
  Sicherung und importiert ihn in der Beta — das geht, weil `backupLesen`
  ältere Sicherungen annimmt.
- **Der umgekehrte Weg geht nicht.** Eine Sicherung aus der Beta (35.193)
  lässt sich **nicht** in die echte App (35.192) zurückspielen; sie wird als
  „aus einer neueren Spielversion" abgewiesen. Was in der Beta entsteht,
  bleibt in der Beta, bis die echte App nachzieht.
- **Beide Apps nebeneinander** sind an Namen und Symbol nur am Zusatz „(Beta)"
  zu unterscheiden.

## Worauf es beim Testen besonders ankommt

Das sind die Punkte, die kein Prüfstand beantworten kann:

1. **Vereinsbildschirm → Ausbau:** Ist verständlich, dass jetzt Geld statt VC
   bezahlt wird? Sind die Beträge in der Landeswährung lesbar?
2. **Vereinsbildschirm → Sponsoren:** Fühlt sich die Auswahl aus drei
   Angeboten nach einer Entscheidung an? Sind drei Partnerplätze zu wenig,
   genau richtig oder zu viel?
3. **Nach einer Spielerlaufbahn:** Sagt die Saisonabrechnung im
   Abschlussbildschirm verständlich, woher das Geld kam und wohin es ging?
4. **Bauzeiten:** Ist es nachvollziehbar, dass eine Stufe erst nach ein bis
   zwei Saisons wirkt?
5. **Nach fünfzehn Jahren:** Ist im Abschluss erkennbar, dass die Restkasse
   mitgezählt hat?

## Ausdrücklich offen

- **Folgen einer leeren Kasse** gibt es nicht (WIRT-P1-04). Die Kasse darf ins
  Minus laufen, ohne dass etwas passiert — wer das im Test sieht, hat keinen
  Fehler gefunden, sondern eine bekannte Lücke.
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.** Sie rechnen
  mit den Vorgabewerten mit; einstellen kann man sie nicht.
- **Die Abnahme durch Codex steht aus.** Was hier drin ist, kann sich noch
  ändern.
