# CHAR-P1-02 – Gesichtszüge stärker differenzieren

**Bearbeiter:** ChatGPT/Codex  
**Astra-Endkontrolle:** ausdrücklich ausstehend  
**Basiscommit:** `18eb59a02d1f428c028688bccb8b8e264c7c5f78`  
**Technischer End-Head vor diesem Dokumentationscommit:** `ebbdb3de75641a107b888f7aef62dc3def945110`

## Ziel

Die Gesichtsauswahl sollte nicht einfach mehr Einträge bekommen, sondern bei echter Spielgröße mehr erkennbare Identität liefern. Bewertet wurden Augen, Augenbrauen, Nase, Mund, Wangen/Kinn und Gesichtsdetails mit identischem Kopf, identischer Frisur und identischer Haarfarbe.

Wichtig waren dabei:

- vorhandene gespeicherte IDs nicht umnummerieren oder umdeuten;
- alte Seed-/Fallback-Porträts nicht durch neue Auswahlgrößen verändern;
- Unterschiede bei 72–145 px sichtbar machen;
- Mann/Frau und helle, mittlere und dunkle Haut prüfen;
- keine Karikaturen, kein Clipping und keine Gesichtselemente außerhalb der Kopfkontur.

## Ausgangsanalyse

Der vorhandene Renderer hatte zahlenmäßig bereits viele Formen. Deshalb wurde vor Produktionsänderungen ein reproduzierbarer Prüfstand aufgebaut statt blind weitere IDs anzuhängen.

Der Prüfstand rendert den echten `Avatar`-Renderer in 72, 96 und 145 px und hält für den jeweiligen Vergleich Kopf, Frisur, Haarfarbe und alle anderen Gesichtszüge konstant. Zusätzlich erzeugt Playwright Rastervergleiche bei 72/96 px sowie unbeschriftete Gesamtproben.

Die Ausgangssichtung zeigte insbesondere:

- **Nase 0/4** war bei 72 px praktisch identisch;
- **Nase 2/7** war bei 72 px praktisch identisch;
- **Wange 4** unterschied sich bei 72/96 px nur in sehr wenigen relevanten Pixeln;
- Augen, Brauen und Mund hatten bereits tragfähigere Grundfamilien.

Deshalb wurden nicht alle Gruppen künstlich vergrößert.

## Produktionsänderung

### Augen

Neue append-only IDs:

- **7 – Angehobene Außenkante**
- **8 – Abgesenkte Außenkante**

Die beiden Varianten verändern nicht nur die Lidspalthöhe, sondern besitzen eigene äußere Lidkanten. Dadurch bleiben sie auch bei 72 px als unterschiedliche Blick-/Augenform lesbar.

Aktiv neu auswählbar sind damit Augen-IDs `0–8`.

### Nase

Neue append-only IDs:

- **10 – Breite Stupsnase**
- **11 – Hoher Nasenrücken**

Beide verwenden eigene SVG-Geometrien und keine weitere Parameterabwandlung der bisherigen Standardnase.

Die gemessenen Alt-Dubletten **4** und **7** bleiben für bestehende Spielstände vollständig renderbar, werden aber bei neuer Charakterauswahl und beim Würfeln nicht mehr angeboten. Es werden dadurch keine gespeicherten IDs umgedeutet.

Aktive Neuauswahl: `0,1,2,3,5,6,8,9,10,11`.

### Wangen/Kinn

Neue append-only IDs:

- **5 – Hohe Wangenkontur**
- **6 – Weiche Wangenfülle**

Die sehr schwache Altvariante **4** bleibt renderbar, wird aber bei neuen Charakteren nicht mehr angeboten.

Aktive Neuauswahl: `0,1,2,3,5,6`.

### Gesichtsdetails

Neue append-only IDs:

- **7 – Leichte Augenringe**
- **8 – Kleine Kinnnarbe**

Damit stehen Details `0–8` zur Verfügung. Diese Merkmale sollen ergänzen, nicht allein die Identität tragen; entsprechend bleiben sie dezenter als Augen/Nase/Wangen.

### Brauen und Mund

Keine neue Produktionsgeometrie in dieser Runde. Die vorhandenen sieben Brauen- und neun Mundformen waren in der Sichtprüfung ausreichend eigenständig; eine erzwungene Erweiterung hätte nur Variantenmenge statt Qualität erzeugt.

## Kompatibilität

Bestehende IDs werden nicht renummeriert. Alte Nasen-/Wangen-IDs bleiben im Renderer erhalten und können aus Spielständen weiterhin dargestellt werden.

Die deterministische `zuegeAusKennung(...)`-Ableitung nutzt weiterhin die historischen Basiszahlen aus `ZUEGE_ANZAHL(...)`. Die neuen CHAR-P1-02-Formen werden ausschließlich über `portraetOptionen(...)` für Editor/Würfeln ergänzt. Damit verändern die neuen append-only IDs keine alten Seed→Gesicht-Zuordnungen.

`tools/gesichtszuege.test.cjs` prüft zusätzlich, dass die bisherigen Namen/IDs als Präfix stabil bleiben und alle angebotenen Optionen eindeutige IDs mit Namen besitzen.

## Reproduzierbarer Prüfstand

Neu bzw. erweitert:

- `tools/gesichtszuege-vorschau.cjs`
- `tools/browser/gesichtszuege.spec.js`
- `tools/gesichtszuege.test.cjs`
- `package.json` (`preview:gallery`)
- `.github/workflows/browser.yml` für das erzeugte Prüf-Artefakt

Der Browserprüfstand enthält:

- identische Kopf-/Haarbasis pro Vergleich;
- Mann und Frau;
- helle, mittlere und dunkle Haut;
- 72 / 96 / 145 px;
- Varianten ohne Beschriftung;
- unbeschriftete Gesichtskombinationen;
- Rastermetrik für 72/96 px über alle geprüften Merkmale.

## Erfolgreiche End-Gates

Technischer End-Head: `ebbdb3de75641a107b888f7aef62dc3def945110`

- **Spielregressionen**, Run `35252703105`: erfolgreich.
- **Visuelle Browsertests**, Run `35252703252`: erfolgreich.
- Browser-Artefakt: `Rasenschach-Browsertest`, Artifact-ID `10511366546`.
- Artifact-Digest: `sha256:b9cb3cb291de8ec148ab32da6bcdde8eac60ab127ea34466b4f23bef2e46ee59`.

Der Rastertest ist für alle Kombinationen aus Geschlecht, drei Hauttonstufen, 72/96 px und den Merkmalen Augen/Brauen/Nase/Mund/Wangen/Details ohne pixelidentische aktive Varianten durchgelaufen.

## Visuelle Befunde ChatGPT/Codex

Die erzeugten Screenshots wurden nach dem erfolgreichen CI-Lauf zusätzlich visuell geöffnet und geprüft.

- **Augen:** IDs 7/8 zeigen bei 72 px erkennbare gegensätzliche Außenwinkel und bleiben auch auf dunkler Haut bei 96 px lesbar.
- **Nasen:** IDs 10/11 erzeugen klar unterschiedliche Silhouetten. Die breite kurze Form und der höhere/längere Rücken sind bei 72 px unterscheidbar und bei 145 px deutlich, ohne Mund oder Augen zu überlagern.
- **Wangen:** IDs 5/6 bilden unterschiedliche obere bzw. untere Wangenkonturen. Sie liegen vollständig innerhalb der Gesichtskontur und bleiben bei 72/96 px erkennbar.
- **Details:** Augenringe und Kinnnarbe bleiben bewusst subtil. Bei kleinen Größen ergänzen sie das Gesicht, ohne Augen/Nase/Mund zu überzeichnen.
- **Hauttöne:** Auf heller und dunkler Haut wurden keine verschwindenden Konturen oder ungewollt grellen Striche gesehen.
- **Ausrichtung/Clipping:** In den geprüften 72-, 96- und 145-px-Bögen keine abgeschnittenen Gesichtselemente, keine Elemente außerhalb des Gesichts und keine offensichtlichen Fehlpositionierungen.
- **Unbeschriftete Gesamtprobe:** Die sieben Referenzkombinationen lesen sich bereits ohne Namen als unterschiedliche Gesichter bei identischem Kopf/Haar-Grundgerüst.

## Geänderte Dateien

- `App.jsx` – neue append-only Augen-, Nasen-, Wangen- und Detailgeometrien.
- `portraet.js` – neue Namen/IDs; schwache Alt-Dubletten aus der Neuauswahl entfernt, aber kompatibel erhalten.
- `tools/gesichtszuege-vorschau.cjs` – reproduzierbarer Gesichtszug-Prüfstand.
- `tools/browser/gesichtszuege.spec.js` – Raster- und Sichtprüfung in echten Spielgrößen.
- `tools/gesichtszuege.test.cjs` – ID-/Namensstabilität.
- `tools/portraet.test.cjs` – bestehende Porträtregressionen weitergeführt.
- `package.json` – Gesichtsvorschau in die Galerieerzeugung aufgenommen.
- `.github/workflows/browser.yml` – Gesichtsvorschau im visuellen CI-Artefakt gesichert.

## Bekannte Grenzen

- Eine Pixelmetrik kann Wahrnehmung nicht vollständig ersetzen; deshalb wurde sie nur zusammen mit visueller Sichtung verwendet.
- Die neuen Gesichtsdetails sind absichtlich kein starker Identitätstreiber.
- Der erfolgreiche Browserlauf ersetzt keine reale Android-Geräteprüfung.
- Nicht jede mögliche Kombination mit allen Frisuren, Bärten, Accessoires und Kopfformen wurde manuell einzeln betrachtet.

## Astra-Prüfliste

Astra soll insbesondere unabhängig prüfen:

1. Sind Augen 7/8 bei realer Android-Darstellung auf 72–96 px klar genug verschieden, ohne überzeichnet zu wirken?
2. Sind Nase 10/11 stilistisch passend zu den übrigen Rasenschach-Porträts und auch mit extremen Kopfformen sauber positioniert?
3. Sind Wangen 5/6 auf allen Hauttönen sichtbar genug und nicht zu dekorativ?
4. Ist das Entfernen von Nase 4/7 und Wange 4 aus der **Neuauswahl** sinnvoll, während alte Spielstände diese IDs weiterhin korrekt darstellen?
5. Gibt es in Kombination mit Bärten, Brillen oder starkem Make-up unerwartete Überlagerungen?
6. Realen Android-Sichtcheck bei typischer Spielkartengröße durchführen.

**Astra-Endkontrolle ausstehend.**
