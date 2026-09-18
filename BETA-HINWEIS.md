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
| #29 | WIRT-P1-04 — Lizenzauflage: eine leere Kasse kostet Punkte |
| #35 | WIRT-P1-04b — Lizenzentzug: drei Saisons ohne Lizenz kosten die Liga |
| #36 | WIRT-P0-05-UI — Preise, Rechtsform und Vorstandsziel bedienbar |
| #37 | WIRT-P1-02 — Stadion sichtbar, ausverkauftes Haus |

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

## Testwerkzeuge (Einstellungen → ganz oben, rot umrandet)

Nur in der Beta vorhanden. Sie rufen **dieselben Funktionen wie der
Karriereabschluss** (`akaVerbuchen`, `VEREIN.vereinSaison`) — eine Abkürzung
mit eigener Rechnung würde genau das nicht mehr prüfen, worum es geht.

| Knopf | Was er tut |
|---|---|
| **5 / 20 Laufbahnen** | Rechnet so viele abgeschlossene Laufbahnen an: die Akademie altert je Laufbahn ein Jahr, der Verein spielt je Laufbahn eine Saison samt Wirtschaft, die Zähler steigen (Akademie ab 2, Verein ab 5 freigeschaltet) |
| **+500 / +2000 VC** | Erhöht den VC-Bestand der Akademie |

**Was sie NICHT tun:** eine Spielerlaufbahn simulieren. Torschützenlisten,
Ruhmeshalle und Spielerstatistiken bleiben leer. Wer die Spielerseite testen
will, spielt sie. Unter den Knöpfen steht nach jedem Lauf, was tatsächlich
passiert ist — etwa „20 Laufbahnen angerechnet · 20 Vereinssaisons gespielt".

**Geprüft ist, dass der Block nur in der Beta erscheint und richtig rendert**
(Regression in `tools/regression.test.cjs`). **Nicht** geprüft ist der
Klickweg in einem echten Browser: mein Prüfaufbau kam nicht am Vorspann
vorbei. Du bist der Erste, der die Knöpfe wirklich drückt — wenn einer nicht
tut, was draufsteht, ist das ein echter Fund.

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

## Nicht in dieser Beta: der Aufnahmebonus (#34)

Die Korrektur an „Bekannte Adresse" (das Vermächtnis-Extra für 350 Punkte, das
nichts tat) sitzt auf dem **neuen `main` 35.194**, diese Beta auf 35.193. Sie
hereinzuholen hiesse, die Beta auf 35.194 zu heben und die Charakter-/Porträt-
arbeit aus 35.194 mitzunehmen — eine Versionsentscheidung, die Kevin und Astra
treffen, nicht ich nebenbei beim Auflösen eines Konflikts. Die Wirkung ist
stattdessen durch eine Regression über den echten Karriereabschluss belegt.

## Neu seit dem letzten Bau: drei weitere Pakete

**Lizenzentzug (#35).** Drei Saisons in Folge auf der höchsten Abzugsstufe —
also mehr als drei Kreditrahmen unter Wasser — kosten die Liga: Zwangsabstieg,
unabhängig von der Tabelle. Der Zähler steht im Führungsreiter, ab dem ersten
Jahr, mit dem Ausweg dabei (die höchste Stufe verlassen genügt). **Zwei volle
Saisons Vorwarnung.**

**Preise, Rechtsform, Vorstandsziel (#36).** Der Reiter heisst jetzt
**„Führung"** statt „Ausbau" und trägt drei Regler für Eintritt, Gastronomie und
Fanartikel — mit dem gerechneten Ertragsmaximum als Hinweis. Darüber zu gehen
ist erlaubt und kostet Stimmung. Dazu die Umwandlung der Rechtsform (e.V. →
GmbH → KGaA → AG) mit Einlage, Kosten und dem Grund auf dem Knopf, wenn sie
nicht geht. Und das Vorstandsziel steht jetzt da, **bevor** die Saison läuft.

**Stadion (#37).** Eine Kachel nennt Plätze, letzte Zuschauerzahl, Auslastung
und was die nächste Ausbaustufe brächte. Ab 97 % gilt das Haus als
**ausverkauft** — das bringt Stimmung, kein Geld (die Zuschauer stecken schon
im Ticketposten).

## Neu seit dem vorletzten Bau: die Lizenzauflage (WIRT-P1-04)

Bis jetzt durfte die Kasse beliebig tief ins Minus laufen, ohne dass etwas
geschah. Jetzt gilt: geduldet wird eine **halbe Saisoneinnahme** (mindestens
2 Mio). Darunter setzt es **3, 6 oder 9 Punkte Abzug** — gestaffelt danach, wie
viele Kreditrahmen der Verein unter der Linie steht, nicht nach Millionen.

**Wo du es siehst — drei Zustände, drei verschiedene Aussagen:**

| Lage | Was der Vereinsbildschirm sagt |
|---|---|
| Kasse im Plus | nichts |
| Kasse im Minus, aber im Rahmen | „Die Kasse ist im Minus. Ein Überziehen bis zur Hälfte einer Saisoneinnahme ist geduldet — darunter setzt es Punktabzug." |
| Auflage beschlossen | „**Lizenzauflage: 6 Punkte Abzug.** Sie wird am Ende dieser Saison auf die Tabelle angerechnet." |

Dazu im Saisonbeleg (Abschlussbildschirm) getrennt, was die **abgelaufene**
Saison gekostet hat und was die **kommende** kosten wird, und in der Chronik je
Jahr in Rot, wie viele Punkte abgezogen wurden.

**Die Auflage trifft die kommende Saison, nicht die abgelaufene** — deren
Tabelle ist gespielt. So macht es der Fussball auch.

**Wichtig beim Testen:** der Abzug verändert die Tabelle *wirklich* — Punkte
weg, neu sortiert, Platz neu vergeben. Wenn du nach einer Saison mit Auflage
schlechter stehst, als die Ergebnisse vermuten lassen, ist das kein Fehler. Und
**der gewöhnliche Weg bekommt nie eine Auflage**: wer vernünftig wirtschaftet,
merkt von alldem nichts. Sollte dir trotzdem eine begegnen, ohne dass du je im
Minus warst, ist das ein echter Fund.

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

## Nachbesserung vom 17.09.2026 — was seit dem ersten Bau anders ist

Nach dem Bau der Kette habe ich den eigenen Diff systematisch gegengelesen.
**Fünfzehn Befunde, keiner davon von den Regressionen gefunden** — sie prüfen,
dass die Rechnung in sich stimmt, nicht ob sie das Richtige rechnet. Die
wichtigsten sieben sind behoben und stecken in dieser Fassung:

1. **Die Stimmung fiel jede Saison, ohne dass jemand etwas tat.** Der
   Stimmungsschaden mass den Abstand zum ertragreichsten Preis — der liegt fast
   überall unter 1, und 1 ist die Voreinstellung. Gemessen: 60 → 23 in acht
   Saisons, mit Wirkung auf Auslastung und Merchandising, also eine
   Abwärtsspirale ohne Hebel. Jetzt steigt sie im selben Lauf: 65 → 78 → 98.
2. **Der angezeigte Werbebetrag war nicht der, der ankommt** (brutto statt der
   92 Prozent, die ein e.V. bekommt).
3. **Nach einem Aufstieg war das Vorstandsziel unerreichbar** („Um den Titel
   spielen" mit Soll 1 in der neuen Liga), die Prämie wurde nie gezahlt.
4. **Drei bezahlte Wirkungen taten nichts.** „Scoutnetz" (70 VC) ist ersatzlos
   entfernt, weil es über ein Feld wirkte, das niemand liest; die
   Sponsorenwirkungen `medizin` und `jugend` haben jetzt Leser.
5. **Die Vermächtnisplakette hob den Punktedeckel an** (288 statt 250).
6. **Die Gehälter wurden mit dem gealterten Kader gerechnet** — rund 12 Prozent
   zu viel, jedes Jahr.
7. **Stimmung und Gehaltsniveau werden jetzt genannt.** Beide treiben die ganze
   Wirtschaft und tauchten vorher nirgends im Spiel auf. Sie stehen im
   Karrierebericht mit Richtung und im Chronikjahr.

Die Chronik zeigt jetzt außerdem je Jahr Ergebnis, Kassenstand, Zuschauerzahl,
Stimmung, Gehaltsniveau, das Vorstandsziel samt Ausgang und die Ereignisse.

## Ausdrücklich offen

- **Der verschuldete Spitzenverein pendelt.** Mit dem Lizenzentzug (#35) steigt
  er zwar ab, kommt aber sportlich sofort zurück und verliert die Lizenz erneut.
  Gemessen: 13 bis 29 Prozent weniger Schulden, aber geheilt ist er nicht. Wer
  das im Test sieht, hat **keinen Fehler gefunden**.
- **Die Auslastung hängt nicht an der Kapazität.** 64.000 Plätze füllen sich zu
  denselben 99 % wie 8.000 — Ausbauen ist reines Aufwärts ohne Risiko. Bekannt,
  vermerkt, und eine Balance-Entscheidung, die Kevin trifft.
- **Preise, Rechtsform und Vorstandsziel haben keine Oberfläche.** Sie rechnen
  mit den Vorgabewerten mit; einstellen kann man sie nicht.
- **Die Abnahme durch Codex steht aus.** Was hier drin ist, kann sich noch
  ändern.

## Rundgang durch die Oberfläche, 18.09.2026

Ein vollständiger Durchgang im echten Browser — Menü, Vereinsgründung,
Akademie, Profimannschaft, alle Wirtschaftsreiter, fünf gespielte Saisons.
**Keine Abstürze, keine Konsolenfehler, kein NaN.** Gefunden wurden sieben
Dinge, fünf davon behoben:

| Befund | Zustand |
|---|---|
| Leere Kasse stand als „0 Tsd €" da, im Partnerkopf sogar in Erfolgsgrün | behoben: „0 €" |
| „Bauen · 4 Mio €" und darunter „Dafür fehlen 4 Mio €" — dieselbe Zahl zweimal | behoben: die Lücke wird nur genannt, wenn schon Geld da ist |
| Reiter „Sponsoren" schob „Chronik" auf einem 320er-Gerät aus dem Bild | behoben: heißt jetzt „Partner", wie die Kopfzeile des Reiters selbst |
| Sprung vor der Akademiegründung verlor die Jahrgänge, ohne es zu sagen | behoben: die Rückmeldung sagt es, ein Hinweis nennt die Reihenfolge |
| Testwerkzeug erreichte den Spielbetrieb nicht (nach 20 Laufbahnen 8 von 16 Spielern) | behoben: neuer Knopf „Kader mit Probespielern füllen" |
| Ausgefallene Vereinssaisons blieben unerklärt | behoben: die Rückmeldung nennt Zahl und Grund |
| „Stärke 55.2" mit Punkt statt Komma, während Geld „11,6" schreibt | **offen** — bestehender Code, nicht aus dieser Runde |

Zwei Dinge stehen so im Spiel und sind **kein** Fehler: der Reiterstreifen
scrollt waagerecht (mit Verlaufskante als Hinweis), und bei der Ligawahl steht
alphabetisch Ägypten vorn, auch wenn der Verein in Hamburg sitzt.

`tools/browser/beta-wirtschaft.spec.js` hält den Rundgang fest: die
Wirtschaftsreiter müssen ohne NaN und ohne leere Nullen rendern, und die
Reiterleiste muss auf 320 und 390 Pixel bedienbar bleiben.
