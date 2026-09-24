# Lemming-Prüfbericht · stabile Spielerpass-Vorschau

**Datum:** 23.09.2026  
**Rolle:** Lemming  
**Auftrag:** Spielerkarriere-Charaktererstellung – Spielerpass/Porträtvorschau soll außerhalb und innerhalb der „Feinheiten“ dieselbe Geometrie und Skalierung behalten; Grundansicht moderat vergrößern.  
**Basis:** `5491fa74657cc2198c6340bc6c438a3fe339e52a` · Paket `35.195.1`  
**Branch:** `lemming/char-vorschau-stabil`  
**PR:** #49 · Astra-Abnahme offen

## Live- und Parallelprüfung

Vor Arbeitsbeginn lagen auf `main` die bereits integrierten Karten-/Effektarbeiten bis 35.195.1. Die geprüften älteren Effektbranches (`lemming/optik-p0-01-packs-ruhemodus`, `lemming/card-p0-02-packkontur`, `lemming/optik-p2-01-spielerkarten-lesbarkeit`, `astra/karten-flaeche-35.195.1`) waren gegenüber `main` nicht voraus. Offen war PR #48 von Sol für Audio; dessen Bereich überschneidet diese Charakter-UI-Korrektur nicht. Karten-, Pack- und Wildcardeffekte wurden nicht verändert.

## Ursache und Lösung

In `CreateScreen` wechselte die Vorschau beim Öffnen der Feinheiten ausdrücklich von 86 auf 164 px; zugleich wechselten `flexWrap` und `minWidth`. Zusätzlich verkleinerte `charakter-ui.css` die Vorschau nur bei vorhandenem Feinheiten-Panel per `:has()` auf 104 px beziehungsweise unter 350 px auf 92 px und änderte dort Padding und Gap.

Die Vorschau verwendet nun in beiden Zuständen dieselbe Geometrie: Porträt 112 px, `nowrap`, identische Innenabstände und kein zustandsabhängiges Mindestmaß. Die mobilen Regeln für Kategorien, Wischhinweis und Variantenraster bleiben erhalten. Porträt-IDs, Seed-Zuordnung, Speicherformat, Balance sowie Karten-/Packeffekte bleiben unverändert.

## Prüfungen

- Spielregressionen am Code-/Teststand `765f65dc73104b1c3de7a70b83c7cfa43b13fab8`: **236/236 bestanden**, 0 fehlgeschlagen; `npm run build` erfolgreich. CI: https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35912757077
- Visuelle Browsertests am selben Stand: **71 bestanden, 31 projektbedingt übersprungen**, 0 fehlgeschlagen. Der neue Test prüft echten Startablauf und isolierte Sichtprobe bei 320×720 und 390×844 px, Öffnen/Schließen der Feinheiten, unveränderte Bounding-Boxen (Toleranz ≤1 px), 112-px-Porträt, `nowrap`, fehlenden horizontalen Seitenüberlauf und Browserfehler. CI: https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35912757078
- PR-Beta-Androidbau am selben Stand erfolgreich: Tests, Web-Build + Capacitor-Synchronisierung, getrennte Beta-App-ID, Debug-Beta und Icon-Prüfung. CI: https://github.com/sirmebro-sketch/rasenschachonlyapp/actions/runs/35912757063
- Der erste Browserlauf wurde bewusst nicht verschwiegen: Er zeigte bei allen vier neuen mobilen Fällen noch 20 px Geometrieunterschied und machte die verbliebenen `:has()`-Altregeln sichtbar. Nach deren Entfernung ist die vollständige Browsermatrix grün.

## Tatsächliche Sichtprüfung

Die vom erfolgreichen Playwright-Lauf erzeugten Screenshots wurden geöffnet und visuell bewertet, nicht nur erzeugt.

- **320×720, echter Startablauf:** Die 112-px-Vorschau wirkt deutlich größer als die frühere 86-px-Kompaktansicht. Vor und nach „Feinheiten“ bleiben Porträt, Rahmen, Name/Verein und die beiden Aktionen sichtbar gleich groß und an derselben Stelle. Auch ein längerer Name kann im verfügbaren Bereich umbrechen, ohne die Vorschau beim Umschalten neu zu skalieren.
- **390×844, echter Startablauf:** Vor und nach „Feinheiten“ bleibt die komplette Vorschau deckungsgleich aufgebaut. Name, Verein sowie „Würfeln“/„Feinheiten“ bleiben lesbar; kein seitliches Abschneiden der Seite.
- **Isolierte Sichtprobe:** derselbe Komponenten-/CSS-Pfad wurde ebenfalls bei 320 und 390 px geprüft; die Geometrie-Regression besteht dort ebenfalls.
- Die Feinheiten-Kategorien bleiben horizontal wischbar; ihre bewusst angeschnittene Folgekategorie ist kein Überlauf der Seite.

Die feste Abschlussleiste und die übrige Charaktererstellung wurden nicht umgestaltet; ihre bestehenden Bedienprüfungen liefen mit durch.

## Offene Grenze

Kein physischer Android-Gerätetest in dieser Lemming-Runde. Der erfolgreiche Beta-APK-Bau belegt Build/Synchronisierung, nicht die Darstellung in einer echten Android-WebView. Eine Geräteprüfung bleibt daher für Astra/Kevin offen.

**Status:** umgesetzt · Astra-Abnahme offen · nicht in `main` integriert · kein Release.
