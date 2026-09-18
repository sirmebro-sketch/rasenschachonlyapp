# WILD-P0-01 – mobile Wildcard-Aufdeckung (Teilprüfung)

**Datum:** 18.09.2026  
**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486`  
**Paketversion:** 35.194.1  
**Umfang:** ausschließlich Aufdeckung aller sieben Wildcard-Seltenheiten bei 320 × 720 und 390 × 844, jeweils mit normalen Animationen und mit „Animationen aus“.

## Abgleich mit paralleler Effektarbeit

Vor Beginn wurden die offenen Effekt-PRs geprüft:

- #31 / CARD-P0-02 bearbeitet Packkontur und Packfolie.
- #32 / OPTIK-P2-01 prüft Spielerkarten-Lesbarkeit.
- #33 / OPTIK-P0-01 prüft ausschließlich Pack-Ruhemodi und nennt Wildcards ausdrücklich als nicht geprüft.

Keiner dieser Zweige ändert laut Übergabe `App.jsx` oder `karteneffekte.jsx` für Wildcards. Dieser Teil von WILD-P0-01 ändert ebenfalls **keine** Produkt- oder gemeinsame Effektdatei.

## Reproduktion auf unverändertem main

Die bestehende Browserregression war formal grün, benutzte aber für jede Seltenheit denselben kurzen Dummytext und erzeugte nur für GOAT einen Screenshot. Damit war „vollständiger Text bei 320/390 px“ nicht belastbar abgedeckt.

Für die Sichtprüfung wurde das Browserartefakt des exakten main-Commits aus „Visuelle Browsertests“ Run 35324596284 verwendet (Artefakt 10538017870, Digest `sha256:f47b83605f193b2b9a6a7d7d2a89fc8bd5fb510a29f341d6fb0551a4530c839a`). Die darin erzeugte echte `.preview/sichtprobe.html` wurde in Chromium geladen. Da Navigation auf lokale URLs in der Arbeitsumgebung administrativ gesperrt war, wurde dieselbe erzeugte HTML-Datei per Browser-`setContent` geladen; Renderer und CSS stammen unverändert aus dem Artefakt.

Je Seltenheit wurde die aktuell längste reale Kombination aus Titel + Beschreibung aus dem Live-Katalog eingesetzt:

| Seltenheit | Sichtprobe |
|---|---|
| normal | „Riskanter Lebensstil“ |
| selten | „Unermüdlich“ |
| aussen | „Werkbank“ |
| unfass | „Dynastie“ |
| welt | „Der Ziehvater“ |
| goat | „Der Auserwählte“ |
| hsv | „NUR DER HSV“ |

### Tatsächlich angesehene Matrix

Alle **28** Kombinationen wurden als Screenshots erzeugt und anschließend als vier Kontaktbögen tatsächlich geöffnet und visuell beurteilt:

- 320 × 720 · animiert · 7 Seltenheiten
- 320 × 720 · still · 7 Seltenheiten
- 390 × 844 · animiert · 7 Seltenheiten
- 390 × 844 · still · 7 Seltenheiten

Befund:

- Titel und vollständige Beschreibung bleiben in allen Fällen lesbar und innerhalb der Karte.
- Der Weiter-Button bleibt vollständig im Viewport und klickbar.
- Bühne/Karte behalten zwischen verdecktem Zustand und fertiger Aufdeckung dieselbe Y-Position und Höhe; gemessene Abweichung: **0 px**.
- Bei 320 px benötigt der längste geprüfte Beschreibungstext maximal 78 px Höhe; seine Unterkante liegt weiterhin rund 69 px oberhalb der Kartenunterkante.
- Bei 390 px bleibt ebenfalls deutliche Reserve.
- Für Unfassbar/Welt/GOAT/HSV liegt die Materialfolie exakt innerhalb der Karteninnenkante; bei Welt/GOAT/HSV gilt dasselbe für die Prägung.
- Die bewusst außerhalb der Karte liegende Ehrenbühne von Welt/GOAT/HSV überlagert weder Text noch Weiter-Button.
- Keine abgeschnittene Kartenkontur, kein störender Layoutsprung und kein Bedienfehler reproduziert.

**Folge:** Nach Auftragsvorgabe wurde kein Produktcode korrigiert und kein Effekt neu gestaltet.

## Kleine Regressionserweiterung

Geändert werden nur Prüfwerkzeuge:

1. `tools/visuelle-vorschau.cjs`
   - verwendet je Seltenheit automatisch die längste aktuelle reale Titel-/Text-Kombination statt eines festen kurzen Dummytexts.
2. `tools/browser/aufdeckung.spec.js`
   - prüft alle sieben Seltenheiten mit/ohne Bewegung;
   - prüft Karte, Titel, Beschreibung und Weiter-Button gegen Karten-/Viewportgrenzen;
   - prüft vertikale Bühnenstabilität vor/nach der Aufdeckung;
   - prüft Materialfolie und Prägung gegen die Kartenkontur;
   - erzeugt bei 320 und 390 px für jede Seltenheit einen Screenshot;
   - behält die Ruhemodus-Prüfung auf laufende Bewegungsanimationen bei.

## Automatische Prüfung

Der Branch wird über die vorhandenen PR-Workflows geprüft. Maßgeblich sind die Checks am finalen PR-Head; deren Run-IDs und Ergebnis werden in der PR-Übergabe an Astra festgehalten.

## Grenzen

- Kein Android-Gerätetest; der Auftrag bezieht sich auf Browserbreiten 320/390 px.
- Der Vergleich Wildcard im Pass gegen Enthüllung ist nicht Bestandteil dieser begrenzten Teilrunde; WILD-P0-01 als Gesamtpaket bleibt deshalb offen.
- Keine Aussage über Pack- oder Spielerkarteneffekte aus den parallelen PRs.

**Status:** Teilprüfung umgesetzt, Astra-Abnahme offen; nicht integriert.
