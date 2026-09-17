# Rasenschach XI – Arbeitsplan Vereinswirtschaft

> **Lebendes Arbeitsdokument.** Keine Versionsnummer, keine feste Testzahl, kein
> statischer „aktueller Stand". Konkrete Ergebnisse einer Runde gehören in
> `ENTWICKLUNG.md`, nicht hierher. Vor einer Runde zuerst `AGENTS.md` und
> `README.md` lesen.

## 1. Der Auftrag

Kevin, 17.09.2026, sinngemäß und in Teilen wörtlich:

> „Ich möchte den Nutzen von VC in der Profimannschaft etwas limitieren. […]
> Ich möchte das man ganz normal mit € (oder der zum Land der Profimannschaft
> passende Währung im passenden Wechselkurs) upgrades und Ausbauten bezahlt.
> Man nimmt Geld durch Werbedeals ein […] oder durch Erfolge auf sportlichem
> Niveau oder aus anderen Quellen wo Vereine halt normalerweise Geld
> herbekommen. Ticketverkäufe (Stadion Ausbau für mehr Plätze und Gastro),
> Merchandising […]. Das man keine VC in etwas versenkt was nach 15 Saison eh
> verschwindet. Lediglich gewisse extra Bonis und Ausbauten sollen mit VC
> möglich sein."

## 2. Das Problem, das dahintersteht

Bis 35.192 kostete jeder Vereinsausbau VC — dieselbe Währung wie Akademie und
Packs. VC sind laufbahnübergreifend und knapp (rund 100 je Laufbahn); der
Verein wird nach fünfzehn Jahren abgeschlossen und verschwindet samt Ausbau.
Wer VC in den Verein steckte, steckte sie in etwas, das planmäßig endet. Das
war keine Entscheidung, sondern eine Falle.

## 3. Nicht verhandelbare Regeln

1. **Geld ist die Vereinswährung, VC die der Akademie.** Alles Normale kostet
   Geld. VC kaufen nur, was den Verein überdauert oder einmalig etwas
   ermöglicht — und davon wenige Posten.
2. **Intern wird in Euro gerechnet**, in Millionen, wie `p.money` beim Spieler.
   Die Landeswährung ist eine reine Anzeigefrage; sonst bricht jeder Vergleich
   zwischen zwei Ligen und die Ausbaukosten müssten je Land gepflegt werden.
3. **Ein Beleg für Buchung und Anzeige.** Wie `belohnungen.js` es für den
   Karriereabschluss tut: dieselbe Quelle, damit keine zwei Rechnungen
   auseinanderlaufen.
4. **Gespeicherte Ausbaukennungen sind Vertrag.** `training`, `stadion`,
   `medizin` behalten Namen und Wirkung; Neues wird angehängt.
5. **Vor dem Schreiben prüfen**, wie `buchungen.js` bei Karten und Coins.
   Ein Kauf, für den das Geld fehlt, ändert gar nichts.
6. **Keine Zahl ohne Verfahren.** Wer eine Balance-Aussage macht, nennt den
   Lauf, mit dem sie entstanden ist.
7. **Kein Automatismus nach oben.** Ein schlecht geführter Verein im Unterhaus
   muss ins Minus geraten dürfen.

## 4. Einstiegspunkte

- `vereinswirtschaft.js` – Währungen, Ausbaukatalog (Geld), VC-Extras,
  Sponsoren, Einnahmen, Kosten, Saisonabrechnung. Reine Rechnung, kein React.
- `verein.js` – Vereinszustand, Saisonablauf (`vereinSaison`), Abschluss nach
  fünfzehn Jahren. Hier hängt die Wirtschaft am Spielablauf.
- `App.jsx`, `VereinScreen` – die Oberfläche: Kasse, Ausbau, Sponsorenwahl,
  Saisonabrechnung. Konfliktanfällig, deshalb gezielt ändern.
- `tools/vereinswirtschaft.test.cjs` – Regressionen des Rechenkerns.

## 5. Arbeitspakete

### WIRT-P0-01 – Wirtschaftskern — VORGELEGT (Claude, 17.09.2026)

Modul `vereinswirtschaft.js` mit Währungstabelle und Anzeige, sechs
Ausbauabteilungen auf Geldbasis, vier VC-Extras, zwölf Sponsoren mit Angeboten
und Laufzeiten, Einnahmen aus Zuschauern, Gastronomie, Merchandising, Prämien
und Sponsoren, laufenden Kosten und einer Saisonabrechnung mit Beleg.
15 Regressionen. **Noch nicht an Spielablauf oder Oberfläche angeschlossen.**

### WIRT-P0-05 – Vereinsführung: Bauzeit, Preise, Ziel, Ereignisse, Rechtsform — VORGELEGT (Claude, 17.09.2026)

Fünf Systeme, vom Eigentümer am 17.09.2026 einzeln bestätigt:

1. **Bauzeit 1–3 Saisons.** Bezahlt wird sofort, gebaut über Saisons; eine
   Baustelle gleichzeitig. Aus Kaufen wird Planen.
2. **Preise für Tickets, Gastronomie und Fanartikel einstellbar** (Faktor 0,6
   bis 1,6), jeweils mit Elastizität: Tickets am Ansehen, Gastro an der
   Gastrostufe, Merch an Sortiment und Vertrieb. Wer nichts zu bieten hat,
   kann nicht erhöhen, ohne draufzuzahlen.
3. **Vorstandsziel je Saison** aus der Ausgangslage, Prämie nur bei Erfolg,
   Härte nach Rechtsform.
4. **0–2 Wirtschaftsereignisse je Saison** (30 % / 50 % / 20 %), positiv wie
   negativ, Beträge als Anteil der Vereinsgrösse.
5. **Rechtsform e.V. → GmbH → KGaA → AG**, nur nach vorn und nur ab Grösse.
   Mehr Kapital und Vermarktung gegen weniger Fan-Toleranz und härtere Ziele.

Dazu **Stimmung** (0–100) als einziger neuer sichtbarer Wert: sie wächst mit
Erfolg, sinkt bei Überteuerung, und wirkt auf Auslastung und Merchandising.

### WIRT-P0-02 – Anschluss an den Spielablauf — BEREIT

`leererVerein` um `kasse`, `sponsoren`, `extras`, `ligastufe` erweitern;
`vereinSaison` ruft die Abrechnung und legt den Beleg in die Chronik.
Ligastufe aus `pyramide(land)` ableiten, nicht raten. Alte Spielstände ohne
diese Felder müssen weiterlaufen — Ladeverträglichkeit ist Teil des Pakets.

### WIRT-P0-03 – Ausbau auf Geld umstellen — BEREIT

`VEREIN.ausbauen` (VC) durch `ausbauKaufen` (Geld) ersetzen; der Aufrufer
steht in `App.jsx` im Vereinsbildschirm. VC-Extras als eigener, klar
getrennter Abschnitt. Der alte VC-Ausbau verschwindet damit; bereits
erreichte Stufen bleiben.

### WIRT-P0-04 – Sponsorenwahl als Oberfläche — BEREIT

Zu Saisonbeginn drei Angebote zur Auswahl, mit Betrag, Laufzeit und Vorteil.
Auslaufende Verträge werden gemeldet. Die Angebote sind über die Saat
reproduzierbar; ein Neuladen darf keine neuen Angebote würfeln.

### WIRT-P1-01 – Saisonabrechnung sichtbar machen — OFFEN

Der Beleg existiert bereits. Eine Seite im Saisonrückblick, die zeigt, woher
das Geld kam und wohin es ging — dieselbe Bauart wie der Coinbeleg beim
Karriereabschluss.

### WIRT-P1-02 – Stadionausbau spürbar machen — OFFEN

Plätze, Auslastung und Zuschauerzahl sollen im Spiel sichtbar sein, nicht nur
in der Rechnung. Ausverkauftes Haus als eigenes Ereignis.

### WIRT-P1-03 – Spielergehälter statt Pauschale — OFFEN

Die laufenden Kosten schätzen das Personal derzeit pauschal aus Ligastufe und
Stadiongröße. Echte Verträge je Spieler hängen am Kader und ändern die
Transferlogik. Wer das baut, **ersetzt** den Posten „Personal und Mannschaft",
statt ihn zu ergänzen — sonst wird doppelt gezahlt.

### WIRT-P1-04 – Folgen einer leeren Kasse — OFFEN

Derzeit kann die Kasse ins Minus laufen, ohne dass etwas passiert. Denkbar:
Transfersperre, Punktabzug, erzwungene Verkäufe. Bewusst noch nicht gebaut,
weil es die Schwierigkeit spürbar verschiebt.

### WIRT-P1-05 – Abschluss und Vermächtnis nachziehen — OFFEN

Der Abschluss nach fünfzehn Jahren schüttet VC aus (`abschluss` in
`verein.js`). Zu klären: Was passiert mit der Kasse? Fließt Wirtschaftserfolg
in die Abschlusspunkte? Das VC-Extra „Vermächtnisplakette" setzt bereits einen
`punkteFaktor`, der noch nirgends gelesen wird.

## 6. Offene Balance-Fragen

**Gelöst (17.09.2026): die Bauzeit begrenzt nicht mehr.** Der erste Entwurf
liess eine Baustelle insgesamt zu — damit waren in fünfzehn Jahren höchstens
elf der dreissig Stufen zu schaffen, die Zeit war die Grenze statt des Geldes.
Jetzt baut **jede Abteilung für sich** (Stadion und Gastronomie gleichzeitig
ja, Stadion Stufe 3 und 4 gleichzeitig nein), Höchstdauer zwei Saisons.
Nachgerechnet: Liga 1 und 2 erreichen 30/30, Liga 3 kommt auf 25, Liga 4 auf
14, Liga 5 auf 2. Alles schaffbar, wenn man es sich leisten kann — und weil
man es sich meist nicht leisten kann, bleibt die Spezialisierung.

**Gelöst: die Restkasse verfällt nicht mehr.** Vier Millionen ergeben einen
Abschlusspunkt, gedeckelt bei 250 (ein Aufstieg wiegt 120). Wirtschaften lohnt
damit bis zur letzten Saison. Die Verdrahtung in `verein.js` steht noch aus
(WIRT-P1-05); die Funktion `abschlussWirtschaft` ist fertig und geprüft.

**Weiterhin offen: der Überschuss oben.** Ein Erstligist hat nach Vollausbau
rund 1.250 Mio in der Kasse und reisst den Punktedeckel. Das ist der fehlende
grosse Ausgabenposten, die Spielergehälter (WIRT-P1-03). Bis dahin bekannt und
dokumentiert, nicht übersehen.
