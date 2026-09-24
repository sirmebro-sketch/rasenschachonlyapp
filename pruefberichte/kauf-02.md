# KAUF-02 – belegte Kauf- und Ausbauinformationen

**Rolle:** Lemming 2  
**Arbeitsbasis:** `astra/kaufkacheln-pilot` @ `6e40ce1a74ccf71ce1ddf9a7397da61fffe6a8d8`  
**Arbeitsbranch:** `lemming/kauf-02-texte`  
**Paketversion der Basis:** `35.195.2`

## Umfang

Neu angelegt wird ausschließlich `kauf-texte.js` mit `KAUF_TEXTE`. Die Datei enthält genau die vom Arbeitsplan verlangten 45 Schlüssel:

- 9 × `akademie.*` aus `akademie.js` / `ABTEILUNGEN`
- 6 × `verein.*` aus `vereinswirtschaft.js` / `AUSBAU`
- 25 × `vermoegen.*` aus `App.jsx` / `SHOP`
- 5 × `investition.*` aus `App.jsx` / `INVEST`

Keine bestehende ID, kein Katalog, keine Spielregel, kein Preis, kein Speicherformat und keine App-Anbindung wurde geändert.

## Quellen- und Wirkungsprüfung

Die Formulierungen wurden nicht aus den bestehenden Beschreibungstexten abgeleitet, sondern gegen die tatsächlichen Verbraucher geprüft.

### Akademie

- Kaufweg: `App.jsx` / `akaKaufen` mit `akaPreis`, VC-Abzug, Stufenerhöhung und `bucheAenderung`.
- Wirkung: `akademie.js` / `talentBauen`, `akaSpanne` und `akaJahr`.
- Belegt sind insbesondere Startstärke und Entwicklung über Trainingsplätze, Neuaufnahmen und Potenzialband über Scouting, Abbruch über Internat/Mentaltraining, Verletzungen über Medizin, Potenzial/Entwicklung über Ausbildung, Profi-/Turnierchancen über Wettbewerbe, Entwicklung über Videoanalyse und Profiangebotschance über das Netzwerk.

### Verein

- Tatsächlicher Kaufweg: `verein.js` / `bauStarten` → `vereinswirtschaft.js` / `bauStart`; bezahlt wird beim Start des Bauprojekts.
- Fertigstellung: `vereinswirtschaft.js` / `bauTicken`; die neue Stufe wirkt erst nach Fertigstellung.
- Wirkung: Stadion über `plaetze`/`saisonEinnahmen` und `verein.js` / `staerke`; Gastronomie, Sortiment und Vertrieb über `saisonEinnahmen`/`elastizitaet`; Training und Medizin über `verein.js` / `vereinSaison`.
- Für die sechs Ausbauarten sind keine eigenen wiederkehrenden Betriebskosten im aktuellen Wirtschaftskern hinterlegt.

### Vermögen und Investitionen

- Kaufdarstellung und Voraussetzungen: `App.jsx` / `MoneyView`.
- Anschaffung: `buy`; Sofortwirkungen: `applyFx`; Dauerwirkungen: `perk`, `develop`, `finance`; Fanshop zusätzlich `socialStats`.
- Vermögensverwalter: `verwalterRunde`.
- Anlagen: `INVEST`, `invest`, jährliche Neubewertung in `finance`, Auflösung in `sell`.
- Keine Investmentbeschreibung behauptet eine garantierte Rendite. Mindestbeträge werden ohne feste Zahl als Voraussetzung beschrieben.

## Gefundene Widersprüche und Grenzen

1. **Investment-Beschreibungen sind teilweise stärker als die Mechanik.**  
   `INVEST.etf` behauptet „Über zehn Jahre fast immer im Plus“, aber `finance` zieht pro Saison lediglich einen Zufallswert aus der hinterlegten Bandbreite; eine Zehnjahresgarantie oder entsprechende Statistik existiert dort nicht. `INVEST.startup` spricht vom „Zehnfachen“, während die einzelne saisonale Rendite im Katalog deutlich darunter gedeckelt ist. Die neuen Texte übernehmen diese Versprechen nicht.

2. **Einige Vermögenstexte sind erzählerisch, nicht mechanisch belegt.**  
   Die Oldtimer-Sammlung wird als „wertstabil“ beschrieben, obwohl keine Wertsteigerungslogik für das Objekt existiert. Das Motorboot „lohnt sich“ laut Beschreibung, liefert im Code aber Moral-/Bekanntheitswirkung bei laufendem Unterhalt, keine eigene Einnahme. Die neuen Texte nennen nur belegte Effekte.

3. **Vermögensverwalter automatisiert nicht den gesamten SHOP.**  
   `verwalterRunde` kauft nur aus `VERWALTER_KAUF` und investiert in eine definierte Auswahl. Die bestehende Oberfläche formuliert allgemeiner „Anschaffungen und Anlagen laufen ... von selbst“. `KAUF_TEXTE` sagt deshalb „ausgewählte Käufe und Geldanlagen“.

4. **Unterhaltsprüfung des Vermögensverwalters weicht von der Jahresabrechnung ab.**  
   `SHOP.up` wird in `MoneyView` als Unterhalt pro Jahr gezeigt und in `finance` einmal pro Jahr abgezogen. `verwalterRunde` prüft die Tragbarkeit dagegen mit `it.up * 12`; dadurch bewertet die Automatik Unterhalt strenger als die tatsächliche Abrechnung. Nicht korrigiert, weil KAUF-02 keine Spielregel ändern darf.

5. **`buy` vertraut dem aufrufenden UI stärker als der Katalog.**  
   Der Handler prüft unbekannte/bereits vorhandene IDs und verfügbares Geld, erzwingt aber `req` nicht selbst und berechnet den dynamischen Preis der Vereinsanteile nicht selbst neu. `MoneyView` sperrt die Voraussetzungen und reicht den dort berechneten Preis weiter. Das ist aktuell funktional über den UI-Pfad, bleibt aber eine Validierungslücke für andere Aufrufer.

6. **`invest` validiert weniger als `MoneyView`.**  
   Der Handler prüft nur das verfügbare Geld; Katalog-ID, Mindestbetrag und positive Höhe werden vom aktuellen UI-Pfad vorgegeben, nicht im Handler selbst abgesichert. KAUF-02 ändert diese Logik nicht.

7. **Vereinsmedizin ist im alten Katalog verkürzt beschrieben.**  
   `AUSBAU.medizin` sagt „Spieler halten ein Jahr länger durch“. Tatsächlich verbessert die Stufe in `vereinSaison` auch Fitness; die Laufbahnverlängerung steigt stufenweise und nicht pauschal mit jeder einzelnen Ausbaustufe. Der neue Text beschreibt daher beide belegten Wirkungen ohne feste Zusage pro Stufe.

8. **Akademie-Netzwerk ist eine Chance, kein sicherer Vertrag.**  
   Der bestehende Katalog formuliert „Direkt mehr Profiverträge“. Im Code erhöht `S.netzwerk` die Wahrscheinlichkeit eines Profiangebots innerhalb einer gedeckelten Zufallsprüfung. Der neue Text spricht daher ausdrücklich von einer höheren Chance.

## Prüfungen

- Katalogabgleich gegen die vier Live-Kataloge: **45/45 Schlüssel vorhanden**, keine zusätzlichen Schlüssel.
- Schlüssel-Eindeutigkeit: **45 eindeutig**.
- Präfixe ausschließlich `akademie`, `verein`, `vermoegen`, `investition`.
- Jeder Eintrag enthält genau `titel`, `kurz`, `details`, `quelle`.
- Längenprüfung: alle Titel ≤ 24 Zeichen, alle Kurztexte ≤ 55 Zeichen.
- Detailprüfung: höchstens zwei Sätze je Eintrag.
- Jede Wirkungsbehauptung wurde gegen die oben genannten Kauf-, Wirkungs- bzw. Saisonhandler abgeglichen.
- JavaScript-Syntax: `node --check kauf-texte.js` erfolgreich.
- Ein vollständiger lokaler Checkout für `npm test`/`npm run build` scheiterte in dieser Laufzeit bereits beim `git clone`, weil `github.com` per DNS nicht aufgelöst werden konnte. Der Quellstand selbst wurde über die verbundene GitHub-Schnittstelle gelesen; CI wird am exakten PR-Head geprüft.
- App-Anbindung, Browser-/Android-Sichtprüfung und Balanceprüfung sind bewusst nicht Bestandteil dieses Pakets.

## Offene Punkte für Astra

- Bei der späteren Einbindung sollte Astra entscheiden, ob die oben dokumentierten Handler-Validierungslücken und die `up * 12`-Abweichung als eigene Folgepakete angelegt werden.
- Die neuen Texte nennen absichtlich keine dynamischen Preise, aktuellen Stufen, Guthabenstände oder individuellen Sperrgründe; diese müssen aus dem aktuellen Spielzustand ergänzt werden.
