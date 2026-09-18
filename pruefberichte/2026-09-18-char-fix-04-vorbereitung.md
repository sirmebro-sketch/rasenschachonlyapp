# CHAR-FIX-04 – Bart-/Kurzhaar-Restpassung

Datum: 18.09.2026
Status: **VORBEREITET – noch keine Produktcode-Korrektur begonnen**
Basiscommit: `904bee4a06d07156963531023798b22747a5c926` (`main`)
Arbeitsbranch: `chatgpt/char-fix-04-bart-kurzhaar-passung`
Vorgänger: CHAR-FIX-03 / PR #21

## Nutzerbefund nach CHAR-FIX-03

Die formale und visuelle CHAR-FIX-03-Abnahme war zu optimistisch. In der echten Nachsicht bestehen weiterhin sichtbare Restfehler:

1. **Ankerbart (Bart-ID 14)** sitzt weiterhin falsch.
2. **Kinnbart (Bart-ID 4)** sitzt weiterhin falsch.
3. Es ist ausdrücklich offen, ob weitere Bartformen denselben oder verwandte Ankerfehler besitzen; deshalb darf CHAR-FIX-04 nicht nur ID 4/14 reparieren.
4. Viele Frisuren, besonders kurze Formen, passen weiterhin schlecht zu den vier neueren Kopfformen:
   - Kopf 10: **Trapez** (`profil:'trapez'`)
   - Kopf 11: **Langkantig** (`profil:'lang'`)
   - Kopf 12: **Diamant** (`profil:'diamant'`)
   - Kopf 13: **Kurzbreit** (`profil:'kurzbreit'`)
5. Sichtbarer Hauptfehler bei Haaren: Frisur/Haarunterlage ist oben oder seitlich zu klein; dadurch scheint Haut an der tatsächlichen Kopfkontur durch.

## Warum eine neue Fix-Runde nötig ist

CHAR-FIX-03 prüft sehr viele Kombinationen auf gültige Geometrie und rendert große Vollmatrizen, erkennt aber nicht zuverlässig, ob eine Haarfläche **semantisch genug Kopf abdeckt** oder ein Bartteil **ästhetisch korrekt auf dem Kinn** sitzt. Ein SVG kann technisch gültig und vollständig geclippt sein und trotzdem sichtbar falsch positioniert oder zu klein sein.

CHAR-FIX-04 muss deshalb neben Strukturtests gezielte **Passungsmetriken und Sichtprüfungen** ergänzen.

## Live-Code – relevante IDs und Einstiegspunkte

### Kopfformen

Die aktuellen neuen Kopfprofile aus `tools/char-fix-03.test.cjs`:
- 10 Trapez: `{b:26,j:23,kinn:72,profil:'trapez'}`
- 11 Langkantig: `{b:24,j:19,kinn:72,profil:'lang'}`
- 12 Diamant: `{b:29,j:17,kinn:73,kv:.72,profil:'diamant'}`
- 13 Kurzbreit: `{b:30,j:27,kinn:64,profil:'kurzbreit'}`

### Bärte

Aktuelle Bart-IDs aus `bartformen.jsx` / `portraet.js`:
- 0 Glatt
- 1 Stoppeln
- 2 Dreitagebart
- 3 Schnurrbart
- 4 **Kinnbart**
- 5 Ziegenbart
- 6 Kurzer Vollbart
- 7 Langer Vollbart
- 8 Kinnriemen
- 9 Koteletten
- 10 Schnurrbart und Stoppeln
- 11 Breiter Schnurrbart
- 12 Konturierter Bart
- 13 Spitzer Vollbart
- 14 **Ankerbart**
- 15 Breiter Vollbart

**Pflicht:** Alle 1–15 ansehen. Nicht annehmen, dass nur 4/14 betroffen sind.

### Frisuren – Fokus kurze/kompakte Formen

Rendererreihenfolge in `haarformen.jsx`:

Männlich:
- 0 rasiert
- 1 kurz
- 2 scheitel
- 3 undercut
- 6 textur
- 7 licht
- 12 slick
- 13 crop
- 14 flach
- 15 seitlich
- 20 vorhang
- 21 fade
- 23 iro

Weiblich:
- 0 kurz
- 3 bob
- 7 pixie
- 9 crop
- 19 fade
- 21 iro

Das ist eine **Fokusliste**, keine Ausschlussliste. Der Vollbogen soll weiterhin alle Frisuren gegen Kopf 10–13 zeigen.

## Vermutete Fehlerklassen – erst prüfen, dann ändern

Diese Punkte sind Hypothesen aus dem Live-Code und dem Nutzerbefund, keine vorweggenommene Diagnose:

- `haarformen.jsx` verwendet für neue Kopfprofile derzeit feste `passform.breite`-Werte plus eine generische `scalp`-Unterlage. Das kann bei stark unterschiedlichen oberen Kopfkonturen zu klein sein, obwohl die Fläche korrekt an `kopfpfad` geclippt wird.
- Einzelne Kurzhaarpfade (`rasierKappe`, `base`, `swept`, `undercut`, `fade` usw.) können nach der gemeinsamen Skalierung weiterhin nicht weit genug an die reale obere/seitliche Kopfkontur reichen.
- Kinnbart/Ankerbart werden in `bartformen.jsx` noch stark aus `k` (= Kinn-Y) und festen absoluten X/Y-Abständen gebaut. Die gemeinsame Mundmaske verhindert Übermalung, garantiert aber keine korrekte Kinnposition oder Proportion.
- Die bisherige Browsermatrix belegt „rendert“, nicht automatisch „deckt die beabsichtigte Kopfzone ab“ oder „sitzt ästhetisch korrekt am Kinn“.

## Arbeitsauftrag

1. Vor jeder Änderung die vier neuen Köpfe mit allen Frisuren und alle 15 Bärte sichtbar rendern.
2. Problemfälle mit Index, Kopf, Nase/Mund und Screenshot/Ansicht dokumentieren.
3. Erst dann die gemeinsame Geometrie korrigieren.
4. Möglichst geometrische Regeln statt Kopf-ID-/Bart-ID-Sonderfälle verwenden.
5. Bestehende gespeicherte IDs und Reihenfolgen unverändert lassen.
6. Vorherige CHAR-FIX-03-Schutztests erhalten und erweitern, nicht ersetzen.

## Neue Prüfungen, die CHAR-FIX-04 liefern soll

### Haar-Abdeckung

Ein gezielter Test/Prüfbogen soll mindestens Kopf 10–13 × alle Frisuren abdecken und sichtbar markieren:
- obere Kopfkante,
- linke/rechte Kopfkontur,
- Haarunterlage,
- Vorderhaar.

Akzeptanz:
- kein unbeabsichtigter Hautkeil zwischen Haar und Kopfkontur;
- keine „zu kleine Perücke“;
- keine Haarfläche außerhalb der echten Kopfmaske;
- rasiert/fade: sichtbare Haut nur bewusst und symmetrisch/plausibel.

### Bart-Anker

Mindestens alle 15 Bart-IDs × Kopf 10–13 plus repräsentative alte schmale/breite Köpfe, jeweils mit kritischen Mund-/Nasenformen.

Akzeptanz:
- Kinnbart/Ankerbart sitzt am tatsächlichen Kinnzentrum;
- keine Teile auf Nase/Lippen/Zähnen;
- Kinn-/Ankerbreite reagiert plausibel auf Kiefer/Kinn;
- lange/spitze Formen bleiben zentriert und nicht seitlich/vertikal versetzt;
- Mundfreiraum darf keine unnatürlichen Löcher oder abgeschnittenen Bartstücke erzeugen.

### Sichtgrößen

Mindestens:
- 72 px
- 96 px
- große Charaktervorschau

## Pflichtdateien für den nächsten Chat

Vor Arbeitsbeginn vollständig lesen:
- `START-NEUER-CHAT.md`
- `AGENTS.md`
- `README.md`
- `CHARAKTER-OPTIK-ARBEITSPLAN.md`
- `pruefberichte/2026-09-18-char-fix-03-passung.md`
- **diese Datei**
- neueste relevante Dateien unter `pruefberichte/`
- bei Bedarf `ENTWICKLUNG.md` und `CHANGELOG.md`

## Abnahmebedingungen

CHAR-FIX-04 ist **nicht** fertig, nur weil Unit-/Browsertests grün sind.

Fertig erst wenn:
- konkrete Nutzerprobleme ID 4 und 14 sichtbar korrigiert sind;
- alle Bart-IDs 1–15 erneut gesichtet wurden;
- alle Frisuren auf Kopf 10–13 sichtbar geprüft wurden;
- die kritischen Kurzhaarformen keine unbeabsichtigten Hautkeile mehr zeigen;
- neue/verschärfte Regressionen die gefundenen Fehlerklassen schützen;
- große Matrix/Screenshots tatsächlich angesehen und im Bericht bewertet wurden;
- Spielregressionen, Build und visuelle Browsertests grün sind;
- Ergebnis im Meta-Issue #3 dokumentiert ist.

## Noch nicht tun

- keine Bart-/Frisur-IDs umnummerieren;
- keine Varianten löschen, nur weil sie schwer zu korrigieren sind;
- keine pauschale globale Skalierung ohne Vergleich der alten 10 Kopfformen;
- keine Tests lockern, um einen sichtbaren Fehler „grün“ zu bekommen;
- CHAR-FIX-04 nicht als abgeschlossen bezeichnen, bevor der Nutzerbefund sichtbar adressiert ist.
