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

### WIRT-P0-02 – Anschluss an den Spielablauf — VORGELEGT (Claude, 17.09.2026)

`leererVerein` trägt jetzt `kasse`, `sponsoren`, `extras`, `stimmung`,
`rechtsform`, `preise`, `baustellen`, `gehaltsniveau` und `ziel`.
`vereinSaison` ruft die Abrechnung, schreibt den Spielstand fort, setzt das
Vorstandsziel der kommenden Saison in der NEUEN Liga und legt eine Kurzfassung
des Belegs in die Chronik; der volle Beleg kommt als Rückgabewert.

Die **Ligastufe wird abgeleitet, nicht gespeichert** (`ligastufe(land, liga)`
aus `stufenVon`), damit ein Auf- oder Abstieg sie sofort mitführt. Die
**Saat kommt aus dem Verein selbst** (FNV-1a über Name, Land, Liga, Jahr),
damit ein Neuladen keine neuen Sponsorenangebote würfelt.
**Ladeverträglichkeit** über `mitWirtschaft`: ergänzt wird beim Lesen, nicht
beim Speichern; eine gespeicherte 0 gilt nicht als fehlender Wert.

**Wichtig für die Reihenfolge:** siehe Abschnitt 6 — P0-02 allein darf einen
Spieler nicht erreichen.

### WIRT-P0-03 – Ausbau auf Geld umstellen — VORGELEGT (Claude, 17.09.2026)

`VEREIN.ausbauen` (VC) ist **ersetzt**, nicht ergänzt: die Funktion existiert
nicht mehr, damit sie niemand versehentlich wiederbelebt. An ihre Stelle tritt
`bauStarten` (Geld, über `WIRT.bauStart`). Aus Kaufen wird **Planen** — bezahlt
wird sofort, gebaut über bis zu zwei Saisons, und der Name sagt das.

**Ein Katalog statt zwei.** Der alte `VEREIN_AUSBAU` in `verein.js` ist
verschwunden; die Abteilungen stehen nur noch in `vereinswirtschaft.js`. Zwei
Listen mit denselben Kennungen und verschiedenen Preisen wären genau die
Doppelung, an der dieses Projekt schon einmal gelitten hat. `training`,
`stadion` und `medizin` behalten Kennung und Wirkung; `gastro`, `sortiment`
und `reichweite` kommen hinzu.

**Die Oberfläche trennt die Währungen sichtbar:** oben die Kasse in der
Landeswährung mit den laufenden Baustellen, darunter die sechs Abteilungen mit
Geldpreisen, und erst danach — eigener Abschnitt, eigene Überschrift — die vier
VC-Extras. Keine Zeile, in der beides nebeneinander steht.

### WIRT-P0-04 – Sponsorenwahl als Oberfläche — VORGELEGT (Claude, 17.09.2026)

Eigener Reiter im Vereinsbildschirm: laufende Partner mit Betrag, Restlaufzeit
und Vorteil, darunter die Angebote der Saison mit Betrag, Laufzeit, Gesamtwert
und Vorteil. Ausgelaufene Verträge werden aus der Chronik gemeldet.

**Die Angebote liegen im Spielstand (`v.angebote`), nicht im Augenblick.** Das
ist der Kern des Pakets: würden sie beim Zeichnen erzeugt, bekäme man bei jedem
Aufschlagen des Bildschirms neue — und aus der Wahl würde ein Automat, den man
bis zum besten Angebot drückt. Sie werden einmal je Saison aus der Saat des
Vereins gewürfelt und bleiben stehen, bis sie angenommen sind oder die Saison
vorbei ist. `mitAngeboten` legt fehlende nach, damit alte Spielstände und der
Augenblick nach der Einschreibung ohne Sonderfall auskommen.

**Drei Partner gleichzeitig** (`SPONSOR_MAX`), gemessen statt gesetzt — die
Tabelle steht in Abschnitt 6.

**Das war der fehlende Posten, nicht die Gehaltskurve.** Ebenfalls Abschnitt 6.

### WIRT-P1-01 – Saisonabrechnung sichtbar machen — VORGELEGT (Claude, 17.09.2026)

Der Beleg wandert in `p.vereinBericht.wirtschaft` und wird im Abschluss-
bildschirm unter der bestehenden Vereinskachel gezeigt: jeder Einnahme- und
Ausgabeposten einzeln, Wirtschaftsereignisse mit Betrag **und Text**, die
Vorstandsprämie als Posten, darunter Ergebnis und neuer Kassenstand. Dazu
Zuschauerschnitt und Auslastung, fertig gewordene Bauprojekte und ausgelaufene
Werbeverträge.

**Dieselbe Quelle wie die Buchung**, nicht eine zweite Rechnung daneben —
dieselbe Regel wie beim Coinbeleg. Eine Regression prüft, dass **jeder**
gebuchte Posten auch angezeigt wird; lässt man die Ausgaben weg, wird sie rot.

Ein Bericht ohne Wirtschaftsteil (alter Spielstand) bleibt unverändert
lesbar — auch das ist geprüft.

### WIRT-P1-02 – Stadionausbau spürbar machen — OFFEN

Plätze, Auslastung und Zuschauerzahl sollen im Spiel sichtbar sein, nicht nur
in der Rechnung. Ausverkauftes Haus als eigenes Ereignis.

### WIRT-P1-03 – Spielergehälter statt Pauschale — VORGELEGT (Claude, 17.09.2026)

Kevin: „Spielergehälter und allgemein laufende Kosten und Mitarbeitergehälter
steigen bei langanhaltendem Erfolg."

Die Pauschale „Personal und Mannschaft" ist **ersetzt**, nicht ergänzt. An
ihrer Stelle stehen zwei Posten: **Spielergehälter** (0,9 Mio × (ovr/60)^4 ÷
Ligastufe je Spieler, aus dem Kader oder je Ligastufe geschätzt) und
**Mitarbeiter und Verwaltung**. Beide werden mit dem **Gehaltsniveau**
multipliziert — einer Ratsche zwischen 0,75 und 2,00, die je Saison den halben
Abstand nach oben und ein Sechstel nach unten geht. Erfolg wird damit dauerhaft
teuer, ein einzelner guter Lauf nicht bestraft.

**Kader anschliessen steht noch aus.** `kaderKosten` liest `v.kader`, wenn es
da ist, und schätzt sonst aus der Ligastufe. Solange `verein.js` keinen Kader
führt, rechnet der Kern mit der Schätzung — richtig, aber nicht individuell.
Echte Verträge je Spieler bleiben ein eigenes Paket.

### WIRT-P1-04 – Folgen einer leeren Kasse — VORGELEGT (Claude, 18.09.2026)

**Lizenzauflage: Punktabzug.** Kevins Entscheidung vom 18.09.2026 aus drei
vorgelegten Mitteln (Transfersperre, Punktabzug, erzwungene Verkäufe).

Geduldet wird eine halbe Saisoneinnahme, mindestens 2 Mio — der Rahmen hängt an
den Einnahmen, damit Bauen nicht bestraft wird und die untere Liga nicht härter
trifft als die obere. Darunter kostet es 3, 6 oder 9 Punkte, gestaffelt nach
**Rahmen** unter der Linie, nicht nach Millionen. Die Auflage trifft die
kommende Saison, nicht die abgelaufene; deren Tabelle steht bereits.

**Gemessen, was sie leistet und was nicht** (fünfzehn Saisons, echter
Spielablauf, zwei Saaten, Kader aus dem Nachwuchs aufgefüllt):

| Stärke | Auflage trifft | Punkte gesamt | Abstiege | Wirkung auf die Schulden |
|---:|---|---:|---:|---|
| 48–55 | nie | 0 | – | – |
| 62 | ab Jahr 4–5 | 12–48 | 3 | −135 → −107 |
| 70 | ab Jahr 3–4 | 66–84 | 1 | uneinheitlich |
| 78 | ab Jahr 1 | 72–84 | **0** | uneinheitlich |

**Sportlich wirkt sie, wirtschaftlich nicht.** Der 78er-Verein steht 52 Punkte
über dem Abstiegsplatz; neun Punkte schließen ein Sechstel davon. Ein Kader,
der seiner Liga so weit davongelaufen ist, ist durch Punktabzug nicht
absteigbar — das ist keine Kalibrierfrage, sondern eine Grenze des Mittels.
Die Gegenprobe über acht Läufe ergibt auf die Schulden Rauschen in beide
Richtungen (+21 %, 0 %, −20 %, −3 %, +6 %, −13 %).

### WIRT-P0-05-UI – Vereinsführung bedienbar machen — VORGELEGT (Claude, 18.09.2026)

Preise, Rechtsform und Vorstandsziel rechneten seit WIRT-P0-05 mit und hatten
keine Oberfläche. Folge: `preisFaktor` las **immer** die Voreinstellung 1, die
ganze Elastizitätsrechnung lief gegen einen festen Wert, `rechtsformWechseln`
hatte **null Aufrufer**, und das Vorstandsziel tauchte erst NACH der Saison im
Beleg auf.

- **Preise:** drei Regler (0,6 bis 1,6) mit dem gerechneten Ertragsmaximum als
  Hinweis. Darüber zu gehen bleibt erlaubt und kostet Stimmung — eine
  Entscheidung, keine Automatik.
- **Rechtsform:** der nächste Schritt mit Einlage, Kosten und Wirkung; die
  Sperre nennt ihren Grund, statt den Knopf wortlos abzuschalten.
- **Vorstandsziel:** sichtbar, **bevor** es entschieden ist.

Der Reiter heißt deshalb **„Führung"** statt „Ausbau". Ein siebter Reiter kam
nicht in Frage — bei 320 Pixeln lag schon der sechste zwei Wischer entfernt.

### WIRT-P1-04b – Lizenzentzug als letzte Stufe — VORGELEGT (Claude, 18.09.2026)

Die Antwort auf die Grenze oben, auf Kevins Auftrag vom 18.09.2026. **Drei
Saisons in Folge auf der höchsten Abzugsstufe** (mehr als drei Kreditrahmen
unter der Linie) heißt Lizenzentzug: Zwangsabstieg, unabhängig von der
Tabelle. Der Zähler springt auf null, sobald der Verein die höchste Stufe
verlässt — Besserung genügt, gesund werden muss er nicht. Zwei volle Saisons
Vorwarnung, sichtbar im Vereinsbildschirm.

Gemessen, gleiche Läufe wie oben:

| Stärke | ohne Entzug | mit Entzug | Entzüge | Endliga |
|---:|---:|---:|---:|---|
| 62 | −107 / −53 | −105 / −51 | 1 / 0 | unverändert |
| 70 | −323 / −293 | **−228 / −243** | 2 / 2 | unverändert |
| 78 | −662 / −600 | **−575 / −486** | 3 / 2 | **eine Liga tiefer** |

13 bis 29 Prozent weniger Schulden genau dort, wo der Punktabzug allein nichts
ausrichtete. **Geheilt ist der Verein nicht:** er pendelt, weil er sportlich zu
stark für unten und finanziell zu schwach für oben ist. Jede Runde nach unten
halbiert aber die Gehälter, und das ist die Wirkung.

Nebenbefund aus dem Prüfstand: ein Verein in der untersten Liga, dem die Lizenz
fehlt, wurde bei gutem Ergebnis **befördert**. Wer keine Lizenz für seine Liga
bekommt, bekommt erst recht keine für die darüber — er bleibt jetzt, wo er ist.

**Offen bleibt der Ausschluss aus dem Spielbetrieb** als Stufe unter dem
Entzug. In der untersten Liga bleibt es beim Punktabzug; der Beleg sagt das,
statt stumm nichts zu tun.

### WIRT-P1-05 – Abschluss und Vermächtnis nachziehen — VORGELEGT (Claude, 17.09.2026)

`abschluss` ruft jetzt `abschlussWirtschaft` und addiert die Kassenpunkte zu
den sportlichen. Vier Millionen ergeben einen Punkt, gedeckelt bei 250 (ein
Aufstieg wiegt 120, eine Meisterschaft 90). Schulden zählen nicht negativ.

**Der Plakettenfaktor wirkt auf beide Teile, jeden genau einmal.** Das VC-Extra
verspricht „+15 % Abschlusspunkte" — nicht „+15 % auf den Kassenanteil".
`abschlussWirtschaft` rechnet ihn in seinen eigenen Punktwert ein, der
sportliche Teil wird in `abschluss` einmal damit multipliziert. Eine Regression
prüft, dass das Verhältnis 1,15 bleibt und nicht 1,32 wird.

**Mehr Punkte heissen auch mehr VC und frühere Boni.** Das ist die gewollte
Folge, kein Nebeneffekt: Wirtschaften lohnt bis zur letzten Saison.

Der Abschlussbildschirm zeigt die Aufteilung („… sportlich · … aus der Kasse")
und nennt die Plakette, wenn sie gekauft wurde — sonst wüsste niemand, wofür
die 120 VC waren. War die Kasse leer, sagt er auch das.

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
damit bis zur letzten Saison. **Seit WIRT-P1-05 ist es auch verdrahtet** und im
Abschlussbildschirm sichtbar.

**Gelöst (17.09.2026): der Überschuss oben ist halbiert.** Mit den
Spielergehältern und der Erfolgsratsche (WIRT-P1-03) endet der Erstligist im
gleichen Lauf bei 667 statt 1.435 Mio, das sind 167 statt 250 Abschlusspunkte
— der Deckel wird nicht mehr gerissen, die letzte Saison bleibt also
wirtschaftlich eine Entscheidung. Der Weg von unten bleibt begehbar: Liga 2
weiterhin 30/30, Liga 5 22/30.

**Erledigt (17.09.2026): der Kader wird gelesen, nicht geschätzt.** Mit P0-02
reicht `vereinSaison` den echten Kader an `kaderKosten` durch. Die Schätzung je
Ligastufe bleibt nur noch für den isoliert laufenden Rechenkern.

**Neu und ernst: P0-02 allein macht jeden Verein zahlungsunfähig.** Gemessen am
echten Spielablauf, fünfzehn Jahre, Kader aus Spielern mit Stärke 70,
festgehaltener Würfel (Verfahren im Vermerk zu P0-02):

| Jahr | Liga | Plätze | Einnahmen | Kosten | davon Gehälter | Kasse |
|---:|---|---:|---:|---:|---:|---:|
| 1 | 3. Liga | 8.000 | 18,3 | 17,2 | 11,1 | 7 |
| 2 | 2. Bundesliga | 8.000 | 32,3 | 29,0 | 21,6 | 16 |
| 3 | Bundesliga | 8.000 | 35,1 | 62,5 | 52,3 | −1 |
| 15 | Bundesliga | 8.000 | 32,4 | 75,7 | 64,0 | **−289** |

Die Ursache steht in der Spalte **Plätze**: sie ändert sich nie. Bauen kann
der Verein nicht, weil `bauStart` und `ausbauKaufen` noch keinen Aufrufer
haben — das ist P0-03. Die Einnahmen bleiben damit auf dem Stand des
Gründungsstadions, während die Gehälter der Liga folgen. Ein Erstligist mit
8.000 Plätzen und 64 Mio Gehältern geht zugrunde, und zwar zu Recht — nur
kann der Spieler nichts dagegen tun.

**Daraus folgt eine Reihenfolgeregel, keine Kalibrierung:** P0-02 und P0-03
gehören in derselben Auslieferung zum Spieler. Die Zahlen oben sind kein
Fehler im Anschluss, sondern der Beweis, dass die Ausgabeseite fehlt. Wer P0-02
allein freigibt, liefert eine Wirtschaft, die nur verlieren kann.

**Beantwortet (17.09.2026) — teilweise, und das Ergebnis ist unbequem.** Mit
P0-03 darf der Verein bauen. Gleicher Lauf, einmal ohne und einmal mit Ausbau:

| Kaderstärke | ohne Bauen | mit Bauen | erreichter Ausbau |
|---:|---:|---:|---:|
| 48 | +27 | −8 | 9/30 |
| 55 | −10 | −19 | 5/30 |
| 62 | **−55** | **+11** | 18/30 |
| 70 | −289 | −183 | 8/30 |
| 78 | −556 | −539 | 1/30 |

**Bauen rettet die Mitte, nicht die Spitze.** Ein Verein mit Stärke 62 dreht
das Minus in ein Plus und erreicht 18 von 30 Stufen. Ein Verein mit Stärke 78
erreicht **eine** Stufe: die Gehälter fressen den Ertrag, bevor gebaut werden
kann, und wer einmal hinten liegt, baut sich nicht mehr heraus.

**AUFGELÖST (17.09.2026) — und zwar nicht so, wie ich es zuerst gedeutet
habe. Die Tabelle oben ist mit einem Fehler entstanden; sie bleibt stehen,
weil der Fehler lehrreicher ist als die Zahlen.**

Ich hatte die Ursache beim Exponenten 4 auf die Spielerstärke vermutet und
Kevin drei Wege vorgelegt; er entschied sich für den Exponenten 3, und das
wurde als Pull Request #12 vorgelegt.

**Die wirkliche Ursache war eine andere:** `sponsorAngebote` und
`sponsorAnnehmen` hatten **null Aufrufer**. Kein Verein im Spiel bekam je einen
Werbevertrag. Die Läufe oben gingen durch den Spielablauf und hatten deshalb
keine Sponsoren — während die isolierte Kalibrierung, gegen die ich sie
verglichen habe, immer zwei Verträge je Saison annahm. Zwei Prüfstände mit
verschiedenen Einnahmequellen, gegeneinandergestellt, als wären sie
vergleichbar.

Nachgerechnet, gleicher Lauf, diesmal **mit** Sponsoren:

| Szenario | Exponent 4 | Exponent 3 |
|---|---:|---:|
| gewöhnlich, Saat 20260917 | +24, 9/30 | +22, 9/30 |
| gewöhnlich, Saat 4711 | +337, 30/30 | +337, 30/30 |
| starker Kader (70/82) | **+161**, 28/30 | +606, 30/30 |
| Liga 1 isoliert | 667 Mio, **167 Punkte** | 854 Mio, 214 Punkte |

Mit Exponent 4 war der starke Verein nie in Gefahr. Exponent 3 schösse über und
gäbe zugleich einen Teil der Überschussreduzierung zurück, um die es bei den
Gehältern überhaupt ging. **Kevin hat entschieden: Exponent bleibt 4, #12 wird
geschlossen, stattdessen P0-04.** Die Ursache wird behoben, nicht das Symptom.

**Lehre für die nächste Balance-Frage:** eine Zahl aus dem isolierten Kern und
eine aus dem Spielablauf sind erst dann vergleichbar, wenn beide dieselben
Einnahmequellen kennen. Vorher misst man den Unterschied der Prüfstände, nicht
den der Kalibrierung. Wer künftig eine Stellschraube anfassen will, prüft
zuerst, ob alle Posten überhaupt einen Aufrufer haben.

### Die Obergrenze für Partner — gemessen, nicht gesetzt

`SPONSOR_MAX` steuert, wie viele Verträge gleichzeitig laufen dürfen. Gleicher
Lauf, Endkasse in Mio und erreichte Ausbaustufen in Klammern:

| Partner | gewöhnl. A | gewöhnl. B | gewöhnl. C | starker Kader | sehr stark |
|---:|---:|---:|---:|---:|---:|
| 2 | +2 (9) | +32 (27) | +54 (27) | −79 (10) | −491 (4) |
| **3** | **+5 (9)** | **+124 (29)** | **+122 (29)** | −194 (10) | −397 (5) |
| 4 | +11 (9) | +223 (30) | +174 (30) | −54 (11) | −349 (6) |
| 5 | +6 (10) | +199 (30) | +154 (30) | −38 (11) | −344 (7) |
| 6 | +17 (10) | +309 (30) | +345 (30) | +135 (27) | −261 (7) |

**Drei ist der Vorschlag.** Der gewöhnliche Weg trägt und streut sichtbar — ein
Durchlauf endet knapp über null, zwei bauen fast alles. Bei sechs ist jede
Entscheidung weg, weil man einfach alles nimmt. Der sehr starke Kader bleibt bei
jeder Obergrenze im Minus; das ist kein Fall für mehr Einnahmen, sondern für
WIRT-P1-04. Eine Konstante, in einer Zeile zu ändern, falls Codex oder Kevin
anders entscheiden.
