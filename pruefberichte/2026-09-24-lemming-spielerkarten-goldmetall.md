# Lemming-Prüfbericht: Gold-Spielerkarten als glänzendes Edelmetall

**Datum:** 24.09.2026  
**Rolle:** Lemming  
**Paket:** Spielerkarten – Goldmaterial nach Holo-Verstärkung  
**Basiscommit:** `62d3f689085e817169da5a9885fbe573195ef574`  
**Basisversion:** 35.196.0  
**Branch:** `lemming/spielerkarten-goldmetall`

## Anlass und reproduzierte Ursache

Der aktuelle Gold-/Legendär-Pfad in `karteneffekte.jsx` verwendet für beide
Seltenheiten denselben regenbogenartigen Verlauf mit Magenta, Violett, Cyan, Grün
und Gold. Gold liegt nur bei geringerer Gesamtdeckkraft als Legendär. Dadurch ist
die Seltenheit zwar weniger intensiv, wirkt aber weiterhin primär wie Holografie
und nicht wie Gold.

## Änderung

- Gold wird innerhalb des bestehenden `dezent`-Pfads über `dezent && !stark`
  eindeutig erkannt; keine neue Karten-API und kein zweites Effektsystem.
- Gold erhält eine warme Metallpalette aus dunklem Gold/Bronze, sattem Gold,
  hellem Gelbgold und einem fast weißen Spiegelreflex.
- Ein eigener extrem schwacher Iris-Verlauf setzt nur einen kleinen farbigen
  Lichtakzent. Die Hauptfläche bleibt goldfarben.
- Der vorhandene Lichtzug bleibt erhalten und unterstützt den polierten
  Edelmetalleindruck.
- Legendär behält den kräftigen Regenbogenverlauf.
- Die Materialebene bleibt hinter Porträt und Text; Kontur und Ruhemodus werden
  nicht verändert.

## Bewusst nicht geändert

Bronze, Silber, Packs, Wildcards, Spielwerte, Karten-IDs, Speicherstände,
Versionierung, Audio sowie Release-/Android-Infrastruktur.

## Regressionen

- `tools/karteneffekte.test.cjs`: trennt Gold-Metallpalette und legendäre
  Regenbogenpalette strukturell und schützt gegen die frühere 16-%-Deckkraft.
- `tools/browser/spielerkarten-holo.spec.js`: prüft Gold-/Legendär-Deckkraft,
  die tatsächlich gerenderten Farbstopps, den ausschließlich bei Gold vorhandenen
  feinen Iris-Akzent, fehlende Holografie bei Bronze/Silber sowie den Ruhemodus.

## Noch offen

CI, Produktionsbuild und Browserlauf müssen am exakten PR-Head ausgewertet werden.
Eine echte visuelle Beurteilung des finalen Screenshots und ein physischer
Android-Gerätetest sind bis dahin nicht als erfolgt zu werten.

**Status:** umgesetzt / Astra-Abnahme offen / nicht in main integriert.
