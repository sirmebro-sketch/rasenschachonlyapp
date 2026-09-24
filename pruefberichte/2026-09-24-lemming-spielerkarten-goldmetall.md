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

## Eigenprüfung

Produkt-/Teststand: `36bb83c3211c5997e55994c35e96c6cdcee1db81`.

- GitHub `Spielregressionen`: **240/240 bestanden**, 0 fehlgeschlagen; `npm run build` erfolgreich.
- GitHub `Visuelle Browsertests`: **74 bestanden**, **31 projektbedingt übersprungen**, 0 fehlgeschlagen.
- Der neue Test `Gold wirkt metallisch, Legendaer bleibt irisierend` bestand in `handy`, `schmal` und `desktop`.
- GitHub `Beta-APK fuer PR`: erfolgreich. Das belegt Build/Synchronisierung, nicht die Darstellung auf einem physischen Android-Gerät.
- Die drei Screenshots aus dem Browserartefakt wurden geöffnet und bewertet:
  Gold zeigt eine klar warme, gelb-/bronzegoldene Metallfläche mit hellem Lichtzug;
  die dominanten Magenta-/Cyan-/Grün-Regenbogenbänder sind dort nicht mehr sichtbar.
  Legendär bleibt dagegen deutlich mehrfarbig irisierend. Porträt, Name, OVR,
  Position/Alter und die Ruhmeshallen-Zeile bleiben innerhalb der Kartenkontur
  lesbar; in der schmalen Ansicht greift die bestehende Namenskürzung.

Ein vorheriger Zwischenstand der neuen Unit-Regression war rot, weil beim Schreiben
des Testfiles Regex-Zeichen und eingebettete Template-Backticks falsch maskiert
worden waren. Der Produktcode war davon nicht betroffen; die Testsyntax wurde
korrigiert und erst der oben genannte grüne Stand als Eigenprüfung gewertet.

## Offen

Physischer Android-Gerätetest der optischen Wirkung. Die Browser-Sichtprüfung ersetzt
diesen nicht.

**Status:** umgesetzt / zur Astra-Abnahme / nicht in main integriert.
