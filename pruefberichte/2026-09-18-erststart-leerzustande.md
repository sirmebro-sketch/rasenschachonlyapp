# Mobile QA – Erststart und Leerzustände bei 320/390 px

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Status:** Dokumentationsbefund zur Astra-Abnahme; keine Produktcodeänderung  
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486` · Version `35.194.1`  
**Branch:** `lemming/erststart-leerzustand-qa`

## Auftrag und Grenze

Geprüft wurden der Erststart sowie erreichbare Ansichten ohne laufende Karriere, ohne gesammelte Spielerkarten und ohne Akademiespieler. Für jede betrachtete leere oder gesperrte Ansicht wurde geprüft:

- ist verständlich, warum hier noch nichts vorhanden beziehungsweise gesperrt ist,
- gibt es einen nachvollziehbaren nächsten Schritt,
- gibt es einen erreichbaren sichtbaren beziehungsweise systemischen Zurückweg,
- handelt es sich um eine beabsichtigte Freischaltung oder um eine tatsächliche Sackgasse.

Geprüft wurde bei **320 px** und **390 px** Breite. Produktcode, Spielmechanik, Balance und Speicherschema wurden nicht verändert.

## Vorprüfung: Projektregeln, Live-Stand und parallele Arbeit

Vor der Prüfung wurden die aktuellen `START-NEUER-CHAT.md`, `AGENTS.md`, `README.md` und `LEMMING.md` sowie die offenen Pull Requests und vorhandenen Befunde gelesen.

Der geprüfte Basisstand ist `main` `703d377e8eaa7932b6f5fed62ca313807ad16486` (`35.194.1`).

Die offenen mobilen QA-/Optik-PRs wurden abgeglichen. Insbesondere die in PR #41 bereits dokumentierten Probleme mit langen Spieler-/Vereinsnamen wurden hier nicht erneut als Befund gewertet. Für Erststart/Leerzustände war vor Beginn kein gleichartiger offener Befund vorhanden.

## Getrennter Testspielstand

Verwendet wurde ausschließlich `.preview/spieltest.html`. Dieser Prüfstand schreibt in `sessionStorage` mit dem Präfix `rs-pruefung:` und berührt den normalen Spielstand nicht.

Für den echten Erststart wurde im Prüfstand **„Neues Spiel“** benutzt. Dieser Vorgang löscht nur die isolierten `rs-pruefung:`-Einträge.

Für zwei gezielte Meta-Zustände wurden ebenfalls ausschließlich getrennte Sitzungsdaten gesetzt:

1. **2 qualifizierte abgeschlossene Laufbahnen**, keine laufende Karriere, Verein bereits benannt, Akademie nicht gegründet, 0 Karten.
2. **5 qualifizierte abgeschlossene Laufbahnen**, keine laufende Karriere, Verein bereits benannt, Akademie nicht gegründet, 0 Karten.

Dabei wurde nur der Freischaltzähler `hausKarrieren` auf den zur Prüfung nötigen Stand gesetzt. Es wurde nicht behauptet, diese Laufbahnen im Test vollständig durchgespielt zu haben. Die geprüften Kombinationen selbst sind erreichbar: Akademie und Packs sind freiwillig und können trotz erreichter Freischaltung ungenutzt bleiben.

**Keine bestehenden Nutzerdaten wurden gelöscht oder verändert.**

## Tatsächlich ausgeführte Bedienwege

Alle folgenden Wege liefen in Chromium sowohl im Projekt **`schmal` (320 px)** als auch **`handy` (390 px)**.

### Weg A – echter Erststart ohne Spielstand

1. `.preview/spieltest.html` öffnen.
2. **Neues Spiel**.
3. Willkommen · **Deine Laufbahn** ansehen.
4. **Weiter**.
5. Willkommen · **Die Jugendakademie** ansehen.
6. **Weiter**.
7. Willkommen · **Dein eigener Verein** ansehen.
8. **Los geht's**.
9. Hauptmenü ohne laufende Karriere ansehen.
10. **Ruhmeshalle** öffnen.
11. leere Ruhmeshalle ansehen.
12. **Zurück**.
13. **Vermächtnis-Laden** öffnen.
14. Laden mit 0 VC ansehen.
15. **Zurück**.

### Weg B – Akademie freigeschaltet, aber noch nicht gegründet; 0 Karten

Ausgang: isolierter Zustand mit `hausKarrieren = 2`, keine laufende Karriere, 0 Karten, Akademie nicht gegründet.

1. Hauptmenü → **Dein Verein**.
2. Vereinsdach ansehen.
3. **Fundus, 0 Karten** öffnen.
4. leere **Sammlung** ansehen.
5. **Zum Laden**.
6. **Packs** mit 0 VC ansehen.
7. **Zurück** zum Vereinsdach.
8. **Jugendakademie** öffnen.
9. ungegründete Akademie ansehen.
10. **Zurück**.

### Weg C – Profimannschaft freigeschaltet, Akademie nie gegründet

Ausgang: isolierter Zustand mit `hausKarrieren = 5`, keine laufende Karriere, 0 Karten, Akademie nicht gegründet.

1. Hauptmenü → **Dein Verein**.
2. freigeschaltete **Profimannschaft** antippen.
3. **In welcher Liga?** ansehen.
4. **In den Spielbetrieb**.
5. Profimannschaft mit **0/16** Spielern ansehen.
6. sichtbaren **Zurück**-Weg prüfen und zurückgehen.

## Screenshot-Nachweis

Die Browserprobe lief auf dem temporären Evidenz-Commit
`9dda17f5eecad3abeee282d0ce82b21ca64ed8b9`.

GitHub Actions:

- Workflow **Visuelle Browsertests**, Run `35391844557`: **success**
- Workflow **Spielregressionen**, Run `35391844604`: **success**
- Browsertest-Artefakt: `Rasenschach-Browsertest`, Artefakt-ID `10566164476`

Es wurden **26 erzeugte Screenshots tatsächlich geöffnet und visuell angesehen**: 13 Zustände jeweils bei 320 und 390 px.

1. `01-willkommen-laufbahn.png`
2. `02-willkommen-akademie.png`
3. `03-willkommen-verein.png`
4. `04-erststart-hauptmenue.png`
5. `05-ruhmeshalle-leer.png`
6. `06-vermaechtnis-laden-null-vc.png`
7. `07-vereinsdach-ohne-akademie-karten.png`
8. `08-sammlung-leer.png`
9. `09-packs-null-vc.png`
10. `10-akademie-ungegruendet.png`
11. `11-vereinsdach-fuenf-laeufe-ohne-akademie.png`
12. `12-profimannschaft-ligawahl-ohne-akademie.png`
13. `13-profimannschaft-ohne-spieler.png`

Die temporäre Browserprobe wurde nach der Sichtprüfung wieder aus dem Branch entfernt. Der finale PR enthält nur diesen Bericht.

## Priorisierter Befund

### P3 / niedrig – leere Profimannschaft nennt einen nicht ausführbaren Zwischenschritt, wenn die Akademie nie gegründet wurde

**Reproduktion**

1. Mit fünf qualifizierten abgeschlossenen Laufbahnen die Profimannschaft freischalten.
2. Die Jugendakademie bis dahin **nicht** gründen.
3. `Dein Verein` → `Profimannschaft`.
4. Liga wählen und **In den Spielbetrieb**.
5. Kaderansicht mit 0/16 Spielern ansehen.

**Ist**

Der Bildschirm erklärt korrekt:

- `Noch 16 Spieler nötig`
- `Mannschaft · Noch niemand da.`

Im Bereich **„Aus der Jugend hochziehen“** steht jedoch:

> `Zurzeit ist niemand alt genug. Lass die Akademie ein Jahr laufen.`

In diesem reproduzierten Zustand existiert noch gar keine gegründete Akademie. „Ein Jahr laufen lassen“ ist daher nicht der unmittelbar ausführbare nächste Schritt.

Der Nutzer ist **nicht gefangen**: `Zurück` ist erreichbar, und im Vereinsdach steht bei der Jugendakademie deutlich `nicht gegründet` sowie `gründen kostet nichts`. Es handelt sich deshalb **nicht um eine Sackgasse**, sondern um einen ungenauen Leerzustandstext.

Der Befund ist bei **320 px und 390 px** sichtbar; die Screenshots `13-profimannschaft-ohne-spieler.png` wurden für beide Breiten angesehen.

**Kleine Verbesserungsidee**

Den Text zustandsabhängig formulieren:

- Akademie nicht gegründet: etwa `Gründe zuerst die Jugendakademie. Dabei rücken sofort drei Jahrgänge ein.`
- Akademie gegründet, aber niemand hochziehbar: bisherigen Text `Zurzeit ist niemand alt genug. Lass die Akademie ein Jahr laufen.` beibehalten.

Keine neue Mechanik und kein neues Datenfeld nötig; nur der vorhandene Zustand müsste im Leertext berücksichtigt werden.

## Bewusst als korrekt bewertet – keine erfundenen Mängel

### Erststart und Freischaltungen

Der Willkommensablauf erklärt sichtbar:

- Jugendakademie **nach 2 Laufbahnen mit je mindestens 5 Saisons**,
- eigener Verein **nach 5 Laufbahnen mit je mindestens 5 Saisons**.

Im frischen Hauptmenü ist `Dein Verein` absichtlich nicht anklickbar und trägt `gesperrt` sowie `noch 2 Laufbahnen bis zur Freischaltung`. Das ist eine nachvollziehbare Progressionssperre und **keine Sackgasse**.

Die neue Laufbahn bleibt als primärer nächster Schritt erreichbar.

### Leere Ruhmeshalle

Die Ansicht sagt:

- `Noch leer`
- `Spiel eine Laufbahn zu Ende, dann steht sie hier.`

Ein sichtbarer `Zurück`-Knopf ist vorhanden; zusätzlich ist der System-Zurückweg verdrahtet. Bei 320 und 390 px kein Befund.

### Leere Sammlung

Die Sammlung zeigt:

- `0 Karten`
- `Noch nichts gesammelt. Öffne ein Pack.`

Oben sind sowohl `Zum Laden` als auch `Zurück` erreichbar. Damit sind Ursache, nächster Schritt und Ausgang klar. Bei 320 und 390 px kein Befund.

### Ungegründete Akademie

Nach der Freischaltung ist die Akademie erreichbar und erklärt:

- `0 VC`
- `Akademie gründen`
- `kostenlos · drei Jahrgänge rücken sofort ein`

Der Zurückweg ist sichtbar. Das ist auch der Grund, warum kein künstlicher Zustand „gegründete Akademie mit dauerhaft 0 Talenten direkt nach Gründung“ erzeugt wurde: die echte Gründung legt sofort drei Jahrgänge an.

### Packs beziehungsweise Vermächtnis-Laden mit 0 VC

Die Kaufaktionen sind bei 0 VC korrekt gesperrt und nennen jeweils, wie viele VC fehlen. Die vorherige Einführung erklärt bereits, dass Vermächtnis-Coins am Karriereende entstehen. Ein erreichbarer Zurückweg ist vorhanden. Daher kein zusätzlicher Mangel.

## Ergebnis

Es wurde **ein neuer kleiner Leerzustandsbefund** reproduziert:

1. **P3 / niedrig:** Die Profimannschaft mit 0 Spielern verweist auf „Akademie ein Jahr laufen lassen“, auch wenn die Akademie noch nie gegründet wurde. Der Weg ist trotzdem verlassenbar; es ist keine Sackgasse.

Alle übrigen beauftragten Erststart-/Leerzustände waren in der geprüften Stichprobe nachvollziehbar: Ursache beziehungsweise Freischaltung, nächster Schritt und Rückweg sind vorhanden.

**Keine Produktcodeänderung. Kein Merge. Kein Release. Zur Astra-Abnahme.**
