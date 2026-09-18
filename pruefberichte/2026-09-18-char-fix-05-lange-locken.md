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

## Prüfstatus

Automatische Prüfungen und die Nachher-Sichtprüfung werden am PR-Head ergänzt,
sobald die GitHub-CI den Branch verarbeitet hat.

Status: umgesetzt, Eigenprüfung läuft; unabhängige Astra-Abnahme offen.
