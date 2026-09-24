# Lemming-Prüfbericht – Ruhmeshalle / Ewiges Rekordbuch

**Datum:** 24.09.2026  
**Branch:** `lemming/ruhmeshalle-rekordbuch`  
**Ausgangsbasis:** `main@62d3f689085e817169da5a9885fbe573195ef574`  
**App-Version der Basis:** `35.196.0`  
**PR:** #58

## Auftrag

Die ewige Rekordtabelle der Ruhmeshalle auf Kevins Gerätefund prüfen, fachlich falsch oder missverständlich bezeichnete Werte korrigieren und die Darstellung auf mobilen Bildschirmen lesbarer und hochwertiger machen. Kein Main-Merge und kein Release durch den Lemming.

## Codebefund

Die Tabelle hat bisher Bestwerte und über alle abgeschlossenen Laufbahnen aufaddierte Werte sprachlich vermischt.

- `bestPunkte`, `ovrMax`, `toreSaisonMax`, `treueMax` und `altMax` sind Maximalwerte.
- `apps`, `goals`, `assists`, `cs`, `caps`, `titel`, `meister`, `pokale`, `intTitel`, `ntTitel` und `aufstiege` werden in `bilanzErgaenzen` über alle beendeten Laufbahnen summiert.
- `kapitaen` wird höchstens einmal je Laufbahn erhöht, wenn die Vereinsbinde erreicht wurde. Die bisherige Bezeichnung „Saisons als Kapitän“ war daher falsch.
- `altMax` speichert das höchste Karrierealter beim Laufbahnabschluss. „Ältester Einsatz“ war genauer formuliert, als die gespeicherte Kennzahl es erlaubt.
- Länder, Ligen und Vereine bleiben distinct counts über die vorhandenen Zählobjekte; das Speicherformat wird nicht verändert.

## Umsetzung

- Rekordbuch in **Bestwerte**, **Gesamtbilanz** und **Stationen & Rollen** gegliedert.
- Summen heißen nicht mehr „Meiste …“, sondern tragen den Hinweis **alle Laufbahnen**.
- „Saisons als Kapitän“ → **Laufbahnen als Kapitän**.
- „Ältester Einsatz“ → **Ältestes Karriereende**.
- „Länderspiele“ → **A-Länderspiele** und Nationalteam-Titel präziser benannt.
- Kleine monochrome Kennzeichen eingeführt: **↑** für Bestwerte, **Σ** für Gesamtsummen, **#** für Vielfalt und **C** für Kapitänslaufbahnen.
- Starres Zweispaltenraster durch ein responsives `auto-fit`-Raster ersetzt. Auf 320 px und 390 px fällt die Liste sauber auf eine Spalte zurück; lange Bezeichnungen werden nicht mehr per Ellipse abgeschnitten.
- Der isolierte Spieltest enthält einen reproduzierbaren Rekorddatensatz für die Sichtprüfung.
- Regressionstest und eigener Playwright-Test ergänzt.
- Keine Änderung an Speicherformat, Balancing, Karriereberechnung oder Versionsnummer.

## Prüfungen

### Safe Patch Bridge

Run `35986225899` auf dem Lemming-Branch:

- Patchprüfung: erfolgreich
- `git diff --cached --check`: erfolgreich
- `npm test`: **241/241 bestanden**
- `npm run build`: erfolgreich
- geprüfter Code-Commit: `615f87fa3cf0abf779d78fc578a220d847a77295`

### PR-CI auf #58 / Commit `615f87f`

- **Spielregressionen:** erfolgreich
- **Visuelle Browsertests:** erfolgreich
  - 108 geplante Testfälle über die Playwright-Projekte
  - 77 ausgeführt und bestanden, übrige projektbedingt übersprungen
  - neuer Ruhmeshallen-Test ausdrücklich grün auf:
    - `handy`: 390 × 844
    - `schmal`: 320 × 720
    - `desktop`: 1280 × 900
  - geprüft werden korrekte Bezeichnungen, sichtbare Gruppen, fehlende Altbezeichnungen und horizontales Überlaufen
- **Beta-APK für PR:** erfolgreich gebaut

## Übergabe an Astra

PR **#58** ist fachlich und technisch zur Astra-Abnahme vorbereitet. Besonders zu prüfen ist die gewünschte redaktionelle Wirkung der drei Gruppen und der kleinen Kennzeichen. Ein Main-Merge oder Release wurde nicht durchgeführt.
