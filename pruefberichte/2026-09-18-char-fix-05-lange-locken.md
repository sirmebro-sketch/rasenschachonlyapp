# CHAR-FIX-05 – Männerfrisur 27 „Lange Locken“ – Lemming-Übergabe

Datum: 18.09.2026  
Rolle: Lemming  
Basiscommit: `703d377e8eaa7932b6f5fed62ca313807ad16486`  
Arbeitsbranch: `lemming/char-fix-05-lange-locken`  
Paketbezug: gezielte Nacharbeit zu `CHAR-P1-03`, kein neuer Frisurenkatalog.

## Reproduzierter Befund

Astra dokumentierte im unabhängigen Bericht vom 18.09.2026, dass Männerfrisur 27
„Lange Locken“ große Teile der Gesichtszone verdeckt, während Augen/Brauen danach
darüber gezeichnet werden. Der Befund besteht auf dem aktuellen main weiter.

Die aktuelle Geometrie in `haarformen.jsx` führte den vorderen `langlocken`-Pfad
bis in Wangen-/Augenhöhe als weitgehend geschlossene Fläche. Der gemeinsame
`Avatar` rendert die moderne vordere `Haarform` vor Brauen/Augen; dadurch bleiben
die Gesichtszüge zwar technisch sichtbar, wirken aber optisch auf die Haarfläche
gelegt statt von Haar eingerahmt.

Vorherbilder aus dem finalen CHAR-P1-03-Browserartefakt wurden tatsächlich geöffnet:
- 72 px Direktvergleich ID 27 auf den Köpfen 0/3/6/10/11/12/13;
- 96 px vollständiger Männer-Frisurenbogen;
- 145 px Ausschnitt ID 27 auf denselben sieben Kopf-/Farbkontexten.

Der Fehler ist besonders bei Kopf 0, 6, 10, 11 und 13 deutlich: die massive
Lockenfläche reicht bis an bzw. unter die Augen und überdeckt große Stirn-/Schläfen-
und Wangenbereiche. Damit ist der Astra-Befund reproduziert, nicht bereits behoben.

## Gezielte Änderung

Nur die Produktionsgeometrie von `typ==='langlocken'` wurde verändert:
- Krone bleibt als lockige, geschlossene obere Silhouette erhalten;
- linke und rechte lange Locken sind getrennte seitliche Teilpfade;
- die Mitte unterhalb des Haaransatzes bleibt frei und bildet eine plausible
  Gesichtsumrahmung;
- die vorhandene Schädel-Unterlage bleibt unverändert und verhindert offene
  Haaransatzspalten.

Gespeicherte Frisur-ID 27, Name „Lange Locken“, Freischaltungen, Würfeln und alle
anderen Frisurformen bleiben unverändert. Kein gemeinsamer Renderer-Umbau.

## Neue Sichtprüfung

`tools/char-fix-05-vorschau.cjs` erzeugt mit dem echten `Avatar`-Renderer einen
gezielten Bogen:
- alle 14 Kopfformen;
- vier Kontexte: helle Haut/dunkles Haar, helle Haut/helles Haar,
  dunkle Haut/dunkles Haar, dunkle Haut/helles Haar;
- 72, 96 und 145 px.

`tools/browser/char-fix-05.spec.js` erwartet 168 echte Avatar-Renderings und
erzeugt je Größe einen Screenshot. Die Vorschau wird über
`npm run preview:gallery` eingebunden und im Browser-CI-Artefakt mitgeführt.

## Kompatibilität

- Frisur-ID 27 bleibt 27; `frisurName(27,'m') === 'Lange Locken'` ist nun
  ausdrücklich regressionsgesichert.
- Keine Änderung an weiblichen Frisuren, Kopf-IDs, Haut-/Haarpaletten,
  Seed-Ableitung oder Speicherformat.
- Keine Versionserhöhung durch Lemming; Astra entscheidet die Integrationsversion.

## Ausgeführte Eigenprüfung

Erster vollständiger Produkt-Head vor diesem Abschlussvermerk:
`ba96d1e8ffdeaf5819c496e023cda955159111c4`.

- GitHub „Spielregressionen“ Run `35325820048`: **140/140 bestanden,
  0 fehlgeschlagen**; `npm run build` erfolgreich (Vite: 2,30 s).
- GitHub „Visuelle Browsertests“ Run `35325820053`: **46 bestanden,
  26 planmäßig übersprungen, 0 fehlgeschlagen**.
- Browserartefakt `Rasenschach-Browsertest`, ID `10538343710`,
  Digest `sha256:1915d1108d83fa1e4c0cf63db6c90138c39fc257e73ab4d2cb3e902d2ce2155f`.

### Tatsächlich geöffnete Nachherbilder

Die drei von `CHAR-FIX-05` erzeugten Screenshots wurden tatsächlich geöffnet und
visuell bewertet, nicht nur über den Exitcode:
- **72 px:** alle 14 Köpfe × vier Farbkontexte; Augen/Brauen bleiben frei,
  seitliche Locken bleiben auch klein als lange Frisur lesbar.
- **96 px:** gleiche Vollmatrix; keine neue Stirn-/Schläfenspalte, die seitlichen
  Strähnen rahmen breite wie schmale Köpfe plausibel.
- **145 px:** gleiche Vollmatrix; die getrennte Kronen-/Seitengeometrie ist klar
  erkennbar, ohne große Haarfläche über Augen, Nase oder Wangen.

Direkter Vorher/Nachher-Befund: Vorher reichte die geschlossene Vorderform bei
mehreren Köpfen bis unter die Augen und teilweise tief über die Wangen; nachher
liegt die Lockenmasse oben und seitlich. Die Gesichtszüge erscheinen damit nicht
mehr auf eine Haarplatte gezeichnet. Helle/dunkle Haarfarben sowie helle/dunkle
Haut zeigen keinen neuen Kontrast- oder Konturblocker.

Die Matrix enthält sämtliche Kopf-IDs 0–13. Damit sind auch die neueren Formen
Trapez, Langkantig, Diamant und Kurzbreit sowie die älteren schmalen/breiten
Konturen im selben Verfahren geprüft.

## Grenzen

- Kein physischer Android-Gerätetest; für dieses reine SVG-Geometriepaket wurde
  Browser-/Rendererprüfung nach LEMMING.md durchgeführt.
- Keine allgemeine Neubewertung anderer Frisuren, Bärte oder des Porträt-Renderers.
- Dieser Vermerk erzeugt einen neuen, dokumentationsbedingt anderen PR-Head.
  Die CI wird deshalb am finalen Head erneut geprüft; der Produktcode selbst
  bleibt gegenüber dem oben visuell geprüften Head unverändert.

Status: umgesetzt und eigengeprüft; unabhängige Astra-Abnahme offen.
