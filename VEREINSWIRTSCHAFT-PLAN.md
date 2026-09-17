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

Nachgerechnet am 17.09.2026 über fünfzehn Vereinsjahre (Verfahren im
Entwicklungsvermerk): Ein erfolgreicher Erstligist baut alles aus und hat
danach noch rund 429 Mio übrig. Das ist zu viel, um eine Entscheidung zu
bleiben — es fehlt der größte Ausgabenposten eines echten Vereins, die
Spielergehälter (WIRT-P1-03). Bis dahin ist der Überschuss bekannt und
dokumentiert, nicht übersehen.
