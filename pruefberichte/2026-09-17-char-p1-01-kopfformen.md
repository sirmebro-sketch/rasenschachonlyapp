# CHAR-P1-01 – Kopfformen stärker differenzieren

**Bearbeitung:** ChatGPT/Codex  
**Astra-Endkontrolle:** ausdrücklich ausstehend  
**Basis:** `main` `28b6c7dcd2b02611e5aa19d82acbe78f5f092dd0`  
**Technischer Prüfstand vor diesem Dokumentationscommit:** `de2a832dbb061c33d5f0be5cc8526a111307a384`

## Ziel der Runde

Die vorhandenen Kopfformen sollten nicht nur zahlenmäßig erweitert werden. Ziel war, die Silhouettenfamilien sichtbar zu verbreitern, ohne gespeicherte Kopf-IDs umzudeuten, historische Seed-Porträts zu verändern oder Haar-/Bartkonturen zu zerreißen.

Der Arbeitsplan verlangt für `CHAR-P1-01`: erkennbare breite, schmale, kantige, runde, längliche und zartere Silhouetten; vorhandene Indizes erhalten; Vergleich über mehrere Haar-/Bartkontexte; keine sichtbaren Kiefer-/Haar-Clippingfehler; kleine/mobile Darstellung mitprüfen.

## Ausgangssichtung

Vor der Produktionsänderung wurde ein reproduzierbarer Vergleich der bisherigen IDs `0–9` aus dem echten Avatar-Renderer erzeugt. Der Sichtbefund war:

- `Rund` / `Vollmond` / `Rundlich` bilden eine relativ enge runde Familie.
- `Oval` / `Weich` liegen ebenfalls näher beieinander.
- `Schmal`, `Herz` und `Zart` unterscheiden sich stärker, vor allem über Kinnbreite und Länge.
- Es fehlten besonders eine deutlich länglich-kantige, eine sehr kurz-breite und eine stärker diamant-/trapezartig gezeichnete Außenkontur.

Bestehende Formen wurden deshalb **nicht** umgezeichnet. Stattdessen wurden neue IDs append-only angehängt.

## Produktionsänderung

In `App.jsx` wurden ausschließlich neue Kopfform-IDs angehängt:

| ID | Name | Zweck der Silhouette |
|---:|---|---|
| 10 | Trapez | breitere, geradere Kieferwirkung statt weiterer Oval-/Rundvariante |
| 11 | Langkantig | klar längeres, geradlinigeres Gesicht |
| 12 | Diamant | breitere Wangen-/Schläfenwirkung mit schmalerem Kinn |
| 13 | Kurzbreit | bewusst kurze und sehr breite Außenkontur |

Die bestehenden IDs `0–9` bleiben in Reihenfolge **und Geometrie** unverändert.

Für die vier neuen Formen nutzt `kopfPfad` eigene Profilpfade. Der historische Standardpfad bleibt für IDs `0–9` unverändert.

### Altstand-/Seed-Schutz

Beim Ausbau wurde ein Kompatibilitätsrisiko gefunden: `zuegeAusKennung(...)` leitete die Kopf-ID aus der jeweils aktuellen Länge der Kopfformliste ab. Ein bloßes Anhängen neuer Köpfe hätte damit historische Porträts verändert, die nur aus ihrer Kennung rekonstruiert werden.

Deshalb wurde die historische Seed-Ableitung für den Kopf explizit auf die bisherigen **10 IDs** eingefroren (`KOPFFORM_HISTORISCH = 10`). Neue Editorformen erweitern `ZUEGE_ANZAHL(...).kopf` trotzdem auf 14; Altporträts ohne gespeicherte `zuege` bleiben jedoch auf ihrer bisherigen Kopf-ID.

`tools/kopfformen.test.cjs` prüft dazu:

- IDs `0–9` behalten exakt Namen und Geometriedaten;
- neue Formen existieren ausschließlich als IDs `10–13`;
- alle 14 Formen erzeugen unterschiedliche Außenpfade;
- für 250 Seeds je Geschlecht bleibt die historische Seed→Kopf-Zuordnung identisch;
- zusätzliche Staturfälle bleiben im historischen Bereich `0–9`.

## Visuelle Prüfung

Neue reproduzierbare Sichtprobe: `tools/kopfformen-vorschau.cjs` + `tools/browser/kopfformen.spec.js`.

Jede der 14 Kopfformen wird mit vier Kontexten gerendert:

1. helle Haut + kurze Frisur, 96 px;
2. dunkle Haut + kurze Frisur, 96 px;
3. Bart + lange Locs, 96 px;
4. weibliche 72-px-Probe + Flechtkranz.

Zusätzlich rendert das Charakter-Inventar alle 14 IDs für Mann und Frau mit drei bestehenden Referenzkombinationen.

### Sichtbefund ChatGPT/Codex

- `Langkantig` und `Kurzbreit` bilden klar neue Silhouetten und sind auch ohne Beschriftung deutlich von den bisherigen Formen getrennt.
- `Trapez` und `Diamant` sind weniger extrem, aber in den Vergleichsbögen als eigene Kiefer-/Wangenfamilien erkennbar.
- In den geprüften Kurzhaar-, Locs-, Bart- und Flechtkranzkombinationen sind keine offensichtlichen Hautkeile, offenen Konturen oder abgeschnittenen Kiefer sichtbar.
- Die 72-px-Probe bleibt erkennbar.
- Der responsive Test läuft in `handy`, `schmal` und `desktop` und prüft zusätzlich auf horizontalen Seitenüberlauf.

Diese Bewertung ist **keine Astra-Endabnahme**. Insbesondere `Trapez` und `Diamant` sollten von Astra noch einmal unabhängig auf ausreichenden Abstand zu `Kantig`/`Herz` beurteilt werden.

## Während der Runde gefundene Prüffehler

Die ersten beiden Browserläufe waren bewusst nicht grün durchgewunken:

1. Die neue HTML-Fixture enthielt zunächst eine falsch escapte RegExp beim Einbetten des Bundles. Dadurch brach `preview:gallery` vor Playwright ab. Der Produktionscode war davon nicht betroffen. Die Erzeugung wurde auf eine robuste `split(...).join(...)`-Variante umgestellt.
2. Danach fand der neue schmale Browserfall **36 px horizontalen Überlauf** in der Kopfform-Prüfgalerie. Ursache war `minmax(330px,1fr)` in der Fixture. Das Grid und die Probeelemente wurden responsiv gemacht. Der Folgelauf ist auf allen drei Browserprojekten grün.

Diese beiden Fehlversuche gehören zur Prüfhistorie und werden nicht als Produktfehler ausgegeben.

## Erfolgreicher Gate auf dem technischen Prüfstand

Commit: `de2a832dbb061c33d5f0be5cc8526a111307a384`

- **Spielregressionen**, Run `35246519836`: erfolgreich; `npm test` und `npm run build` grün.
- **Visuelle Browsertests**, Run `35246519989`: erfolgreich; alle vorgesehenen Playwright-Wege einschließlich der neuen Kopfformtests grün.
- Browser-Artefakt: `Rasenschach-Browsertest`, Artifact-ID `10507183477`, Digest `sha256:7da4efdcb491124a3b533b0a4502f402896e89367e4177cd3d97a7477f762299`.

Der erfolgreiche Browserlauf enthält unter anderem:

- `koepfe-neu-vergleich.png` – vier Kontexte über alle 14 Formen;
- `koepfe-neu-m.png` – Inventar Mann;
- `koepfe-neu-w.png` – Inventar Frau.

## Geänderte Bereiche

- `App.jsx` – vier append-only Kopfformen, neue Profilpfade, historische Seed-Fixierung;
- `tools/kopfformen.test.cjs` – Kompatibilitäts-/ID-/Pfadregression;
- `tools/kopfformen-vorschau.cjs` – echte Avatar-Sichtprobe;
- `tools/browser/kopfformen.spec.js` – responsive Browser- und Inventarprüfung;
- `package.json` – Sichtprobe in `preview:gallery` eingebunden.

## Astra-Prüfliste

Astra soll vor einer finalen visuellen Abnahme besonders prüfen:

1. Sind `Trapez` und `Diamant` bei 72–96 px ausreichend eigenständig gegenüber `Kantig`, `Herz` und `Zart`?
2. Wirkt `Langkantig` absichtlich markant, aber noch im Stil der übrigen Rasenschach-Porträts?
3. Ist `Kurzbreit` breit genug für neue Vielfalt, ohne karikaturhaft aus dem restlichen Stil zu fallen?
4. Gibt es bei weiteren Frisuren oder Bärten außerhalb der vier Sichtproben unerwartete Kiefer-/Haarüberschneidungen?
5. Historische Save-/Seed-Verträge IDs `0–9` und Seed-Modulo 10 nicht aufheben.

## Status

**Technisch integrierbarer Teilstand; Astra-Endkontrolle offen.**  
`CHAR-P1-01` sollte im Meta-Issue bis zur unabhängigen Astra-Sichtkontrolle nicht vorschnell als endgültig abgenommen markiert werden.
