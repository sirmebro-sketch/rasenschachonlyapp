# Mobile QA – Namenseingaben, Bestätigen, Abbruch und Zurück

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Status:** Dokumentationsbefund zur Astra-Abnahme; keine Produktcodeänderung  
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486` · Version `35.194.1`  
**Branch:** `lemming/qa-namenseingaben-wege`  
**Evidenzcommit:** `6ba9fcf8942a71bc8cd66d84c914847a6c72b954`

## Auftrag und Abgrenzung

Geprüft wurden die Namenseingaben und die zugehörigen Bestätigungs-, Abbruch- und Zurückwege in:

- Charaktererstellung,
- Vereinsgründung.

Schwerpunkte waren 320/390 px, Erreichbarkeit der Eingabefelder und wichtigen Aktionen, Scrollen, Fokuswechsel, Enter, explizites Bestätigen und der sichtbare Zurückweg. Der Teststand war der isolierte `.preview/spieltest.html` mit getrennten Sitzungsdaten; produktive Spielstände wurden nicht verwendet.

Vor Beginn wurden `START-NEUER-CHAT.md`, `AGENTS.md`, `README.md`, `LEMMING.md`, offene PRs und vorhandene Befunde geprüft. PR #41 behandelt bereits lange Namen und statische Überläufe; PR #42 Erststart/Leerzustände. Diese Punkte werden hier nicht als neue Befunde dupliziert.

## Testdaten

### Charakter

- Name: `Jean-Pierre Großmüller`
- Rückennummer: `17`

Der Name nutzt Leerzeichen, Bindestrich, Umlaut und ß und entspricht dem bereits in PR #41 verwendeten realistischen Grenzfall.

### Verein

- Vereinsname: `FC Überlänge Süd-West`
- Stadt: `München Süd`

Damit wurden auch hier Leerzeichen, Bindestrich und Umlaute im tatsächlichen Eingabefluss benutzt.

## Testumgebungen sauber getrennt

### A. Normale Browserprüfung

GitHub Actions / Playwright 1.58.2 / Chromium, isolierter Spieltest:

- Projekt `schmal`: **320 × 720 px**, `isMobile: true`, `hasTouch: true`
- Projekt `handy`: **390 × 844 px**, `isMobile: true`, `hasTouch: true`

Geprüft wurden echte Klick-, Fokus-, Enter-, Scroll-, Zurück- und Bestätigungswege.

### B. Simulierte geringe Ansichtshöhe

Innerhalb derselben Browserprüfung wurde die Viewporthöhe gezielt verkleinert:

- **320 × 420 px**
- **390 × 500 px**

Das ist ausschließlich eine Browser-Simulation dafür, wie die Oberfläche bei wenig vertikalem Platz reagiert.

**Sie ist ausdrücklich kein Nachweis dafür, wie Android WebView und eine echte Bildschirmtastatur den sichtbaren Bereich verkleinern, verschieben oder pannen.**

### C. Echte Android-Prüfung mit Bildschirmtastatur

**Nicht durchgeführt.**

In der verfügbaren Arbeitsumgebung sind weder `adb` noch ein Android-Emulator verfügbar; `/dev/kvm` fehlt ebenfalls. Ein physisches Android-Gerät steht diesem Lemming nicht zur Verfügung.

Daher bleiben ausdrücklich ungeprüft:

- Öffnen/Schließen der echten Android-Bildschirmtastatur,
- tatsächliches WebView-Resize/Pan-Verhalten mit IME,
- Verhalten des Android-System-Zurückbuttons bei geöffnetem Eingabefeld beziehungsweise geöffneter Tastatur,
- Zusammenspiel von System-Zurück und den app-internen Zurückwegen.

Aus der verkleinerten Browserhöhe wird **keine** Aussage über diese Android-Punkte abgeleitet.

## Ausgeführte Evidenz

Temporäre Playwright-Evidenzprobe am Commit `6ba9fcf8942a71bc8cd66d84c914847a6c72b954`:

- **Visuelle Browsertests:** Run `35398474458` – **success**
- fokussierte QA-Probe: **4 passed**, Desktop bewusst übersprungen
- **Spielregressionen:** Run `35398474482` – **success** (`npm test` und `npm run build`)
- Browserartefakt: `Rasenschach-Browsertest`, Artefakt-ID `10569916442`

Die temporäre QA-Spezifikation dient nur der Evidenzgewinnung und wird vor dem finalen Dokumentations-Head wieder entfernt.

### Tatsächlich geöffnete und visuell bewertete Bilder

Aus Artefakt `10569916442` wurden unter anderem tatsächlich geöffnet:

- `...schmal/char-low-height.png` – 320 × 420, fokussierter Spielername
- `...handy/char-low-height.png` – 390 × 500, fokussierter Spielername
- `...schmal/verein-name-ort.png` – Vereinsname und Stadt bei 320 px
- `...schmal/verein-low-actions.png` – erreichbare Vereinsaktionen bei geringer Höhe
- zusätzlich wurden die entsprechenden 390-px-Vereinsbilder und die normalen Fokuszustände geprüft.

Die Bildsichtung bestätigt die unten beschriebenen Geometrie-/Erreichbarkeitsbefunde; es wurde nicht nur der Testexitcode verwendet.

## Priorisierte Befunde

### P1 / hoch – Bei 320 × 420 px überdeckt die feste Startleiste das fokussierte Namensfeld

**Umgebung:** Browser, simulierte geringe Ansichtshöhe; **kein Android-Nachweis**.

**Reproduktion**

1. Isolierten Spieltest öffnen.
2. `Neues Spiel` → Einführung überspringen → `Neue Laufbahn`.
3. `Jean-Pierre Großmüller` eingeben.
4. Namensfeld fokussieren.
5. Browserviewport auf **320 × 420 px** setzen.

**Ist**

Die feste untere Aktionsleiste liegt über dem fokussierten Namensfeld. Gemessene Browserrechtecke:

- Namensfeld: `x=20, y=354.23, w=191, h=48`
- `Los geht's`: `x=16, y=360, w=202, h=48`
- `Zurück`: `x=226, y=360, w=78, h=48`

Damit überschneidet `Los geht's` das Namensfeld vertikal um rund **42 px**; vom 48-px-Feld bleibt praktisch nur der obere Rand frei. Das tatsächlich geöffnete `char-low-height.png` zeigt die Überdeckung deutlich.

Bei **390 × 500 px** besteht für das Namensfeld selbst keine Überschneidung:

- Namensfeld endet bei ca. `y=402.23`
- Startleiste beginnt bei `y=440`

Die feste Leiste liegt dort jedoch bereits über den nachfolgenden Formularinhalten. Durch Scrollen bleiben diese Browserinhalte grundsätzlich erreichbar.

**Soll**

Ein fokussiertes Eingabefeld soll bei geringer nutzbarer Höhe nicht von einer festen Aktionsleiste überdeckt werden. Die Aktionsleiste darf scrollbaren Inhalt nicht unbenutzbar machen.

**Einordnung**

Das ist ein reproduzierbarer Browser-/Viewport-Befund. Ob eine echte Android-Tastatur genau auf **420 px** Resthöhe führt und ob WebView dagegen automatisch anders scrollt, ist ungeprüft.

---

### P2 / niedrig bis mittel – Sichtbares „Zurück“ ist in beiden Formularen ein harter Abbruch ohne Entwurfsrückkehr

**Umgebung:** normale Browserprüfung 320/390 px.

**Charaktererstellung**

1. Testnamen eingeben.
2. Ohne `Los geht's` den sichtbaren Button `Zurück` verwenden.
3. `Neue Laufbahn` erneut öffnen.

Der zuvor eingegebene Testname ist nicht mehr als Entwurf vorhanden.

**Vereinsgründung**

1. `FC Überlänge Süd-West` und `München Süd` eingeben.
2. Ohne `Verein anlegen` `Zurück` verwenden.
3. Vereinsgründung erneut öffnen.

Beide Eingabefelder sind wieder leer.

**Einordnung**

Technisch ist das deterministisch und kein beschädigter Spielstand: `Zurück` verwirft einen noch nicht bestätigten Entwurf. Es gibt aber **keine Rückfrage und keine Entwurfswiederherstellung**. Ob dieser harte Abbruch gewollt ist oder auf Mobilgeräten gegen versehentliche Taps abgesichert werden soll, ist eine UX-Entscheidung für Astra/Kevin.

Dieser Befund darf nicht mit Android-System-Zurück gleichgesetzt werden; geprüft wurde nur der sichtbare app-interne Button.

## Positive Gegenproben – kein zusätzlicher Browserfehler

### Charaktererstellung

Bei 320 und 390 px:

- Wechsel vom Namensfeld zur Rückennummer erhält `Jean-Pierre Großmüller` vollständig.
- Zurückwechseln des Fokus erhält den Wert.
- Enter im Namensfeld startet die Laufbahn **nicht** unbeabsichtigt.
- Scrollen beziehungsweise geringe Höhe verändert den eingegebenen Namen nicht.
- Explizites `Los geht's` übernimmt den Namen; die anschließende Laufbahn enthält `Jean-Pierre Großmüller`.

### Vereinsgründung

Bei 320 und 390 px:

- Wechsel zwischen Vereinsname und Stadt erhält beide Werte.
- Enter im Stadtfeld legt den Verein **nicht** unbeabsichtigt an.
- Bei geringer Höhe sind `Zurück` und `Verein anlegen` durch normales vertikales Scrollen erreichbar.
- Das Scrollen zu den unteren Aktionen erhält `FC Überlänge Süd-West` und `München Süd`.
- Explizites `Verein anlegen` übernimmt den Vereinsnamen.

Gemessene Lage der unteren Vereinsaktionen nach dem Scrollen:

- 320 × 420: `Verein anlegen` bei `y≈254`, `Zurück` bei `y≈254`
- 390 × 500: `Verein anlegen` bei `y≈334`, `Zurück` bei `y≈334`

Die geöffneten `verein-low-actions.png` zeigen beide Aktionen vollständig im sichtbaren Bereich.

## Fehlversuche der Evidenzprobe

Die ersten temporären Browserläufe waren rot, ohne einen zusätzlichen Produktfehler zu belegen:

1. Ein zu strenger Textselektor erwartete `SPIELERPASS ANLEGEN` in einer falschen DOM-Form.
2. Ein falscher Einstieg erwartete die Vereinskachel, bevor alle Teststand-Hinweise geschlossen waren.
3. Der Startbutton wurde zunächst mit falscher Groß-/Kleinschreibung im zugänglichen Namen gesucht.
4. Die Bestätigung wurde zunächst per RegEx gegen `GROSSMÜLLER` geprüft; JavaScript behandelt `ß` dabei nicht als `SS`.

Diese Testfehler wurden korrigiert. Der fokussierte Evidenzlauf `35398474458` ist anschließend grün. Die Produktbefunde oben stammen aus dem korrigierten Lauf beziehungsweise dessen Messungen und Bildern.

## Ergebnis und Astra-Prüfliste

Reproduziert wurden **zwei priorisierte Befunde**:

1. **P1 / hoch:** Bei simulierter geringer Höhe **320 × 420 px** überdeckt die feste Startleiste der Charaktererstellung das fokussierte Namensfeld. Android-Relevanz ist ausdrücklich noch offen.
2. **P2 / niedrig bis mittel:** Der sichtbare app-interne `Zurück`-Button verwirft unbestätigte Charakter-/Vereinsentwürfe ohne Warnung oder Wiederherstellung.

Nicht reproduziert wurden Browser-Datenverluste durch Fokuswechsel, Enter oder Scrollen. Die expliziten Bestätigungen übernehmen die Namen. Die Vereinsaktionen bleiben auch bei geringer Browserhöhe erreichbar.

**Offene Pflichtlücke:** echter Android-Test mit Bildschirmtastatur und System-Zurück. Ein Browser mit kleiner Höhe ist dafür kein Ersatz.

**Keine Produktcodeänderung. Kein Merge. Kein Release. Zur Astra-Abnahme.**
