# Lemming-Paket – Startbild / Ladescreen – 18.09.2026

**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486` (`main`, Paketversion 35.194.1)  
**Branch:** `lemming/startbild-ladescreen`  
**Auftrag:** Das von Kevin gelieferte Rasenschach-XI-Motiv direkt beim Appstart kurz als hochwertigen Ladescreen zeigen, mit kleinem Ladekreis unter dem „XI“. Zusätzlich soll der Branch als getrennte Beta-APK testbar sein, ohne main-Merge oder Release.

## Problem und Lösung

Der native Android-Startscreen verwendet das gelieferte Rasenschach-XI-Motiv bereits in den vorhandenen `splash.png`-Ressourcen. Der bisherige Web-Einstieg enthielt danach jedoch nur den React-Root. Dadurch konnte beim Übergang von Android zur Capacitor-WebView ein leerer/dunkler Zwischenzustand entstehen und es gab keinen sichtbaren Ladeindikator.

Das Paket setzt deshalb denselben vorhandenen 9:16-Bildstand **direkt vor React in `index.html`**. Vite übernimmt die bestehende lokale Ressource `android/app/src/main/res/drawable-port-xhdpi/splash.png` in das Web-Bündel; es gibt keinen Netzabruf und keine zweite Bildkopie im Repository. Ein kleiner rot-weißer Spinner liegt bei ca. 64 % Bildschirmhöhe unter dem großen „XI“.

`main.jsx` blendet den Screen nach mindestens **2,2 Sekunden** weich aus. Braucht der Bundle-Start selbst länger, wird keine zusätzliche volle Wartezeit addiert: nach dem ersten Render-Auftrag beginnt die Blende unmittelbar. App-Logik, Speicherformat und Spielinhalte bleiben unverändert. Bei systemweit reduzierter Bewegung bleibt der Ring sichtbar, rotiert aber nicht.

Damit entsteht auf Android die beabsichtigte Kette: **nativer Start mit Motiv → Web-Ladescreen mit demselben Motiv + Ladekreis → Spiel**. Ein eigener nativer Theme-Umbau ist dafür nicht nötig.

## Getrennte Beta-APK

`.github/workflows/beta-apk.yml` baut bei diesem PR zusätzlich eine **Debug-Beta mit eigener App-ID `de.rasenschach.xi.beta`** und dem Namen „Rasenschach XI Beta“. Sie kann deshalb neben der produktiven App installiert werden und verwendet deren Release-Signatur nicht. Der Workflow enthält keine Signier-Secrets und veröffentlicht keinen Release; er lädt lediglich das kurzlebige Actions-Artefakt `Rasenschach-XI-Beta-APK` hoch.

## Automatische Prüfung

Neu: `tools/startbild.test.cjs` schützt folgende Verträge:

- Startbild steht vor dem React-Root im HTML,
- die lokale 9:16-Splashressource wird verwendet,
- Ladeindikator ist vorhanden und unter dem XI positioniert,
- reduzierte Bewegung stoppt die Rotation,
- Mindestdauer beträgt 2,2 Sekunden,
- Startscreen wird nach der Blende aus dem DOM entfernt.

Die vollständigen Projektprüfungen werden am exakten PR-Head von GitHub Actions ausgeführt: Regressionen, Produktionsbuild und Browserprüfungen; der zusätzliche Beta-Workflow baut die getrennte Debug-APK. Ergebnisse werden nach Vorliegen hier bzw. im PR vermerkt.

## Sichtprüfung

Das gelieferte Originalmotiv ist 864 × 1536 px. Die bereits vorhandene Android-Ressource `drawable-port-xhdpi/splash.png` ist 720 × 1280 px und damit ebenfalls exakt 9:16; Logo, XI, Ball, Spielfeld und Randtexte bleiben im Hochformat erhalten. Der Spinner sitzt unterhalb des XI und oberhalb des unteren Slogans. Eine echte Android-Gerätesichtung bleibt bis zur Installation des Beta-Artefakts offen.

## Bewusst nicht geändert

- keine Paketversion / kein Android-versionCode,
- kein `main`-Merge,
- kein Release und keine Release-Signatur,
- keine Spiel-, Balance-, Speicher- oder Charakterlogik,
- keine Übernahme fremder PRs.

## Status

Umgesetzt auf eigenem Branch; **Astra-Abnahme und CI am PR-Head offen**, bis die GitHub-Läufe vollständig vorliegen. Android-Gerätetest der Beta bleibt Nutzer-/Astra-Sichtung.
