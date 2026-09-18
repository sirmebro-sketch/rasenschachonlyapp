# Lemming-Paket – Startbild / Ladescreen – 18.09.2026

**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486` (`main`, Paketversion 35.194.1)  
**Branch:** `lemming/startbild-ladescreen`  
**Auftrag:** Das von Kevin gelieferte Rasenschach-XI-Motiv direkt beim Appstart kurz als hochwertigen Ladescreen zeigen, mit kleinem Ladekreis unter dem „XI“. Zusätzlich soll der Branch als getrennte Beta-APK testbar sein, ohne main-Merge oder Release.

## Problem und Lösung

Die erste Beta-Kontrolle hat einen wichtigen Fehler aufgedeckt: Die vorhandenen Android-`splash.png`-Ressourcen zeigen noch das alte Capacitor-Standardmotiv und sind **nicht** Kevins geliefertes Stadionbild. Diese erste Beta wurde deshalb verworfen und nicht als fertiger Teststand ausgegeben.

Das gelieferte Motiv liegt nun in einer auf 720 × 1280 px optimierten WebP-Fassung mit 47.528 Byte vor. Weil der GitHub-Schreibweg in diesem Chat keine Binärdatei direkt annehmen kann, wird es verlustfrei als Base64-Daten in acht lokalen JavaScriptteilen unter `public/startbild/` abgelegt und unmittelbar im HTML zusammengesetzt. Es gibt keinen Netzwerkabruf und keine Abhängigkeit von den falschen Android-Standardgrafiken.

`index.html` setzt das Motiv **direkt vor React** als ersten app-eigenen Bildschirm. Ein kleiner rot-weißer Spinner liegt bei ca. 64 % Bildschirmhöhe unter dem großen „XI“. `main.jsx` blendet den Screen nach mindestens **2,2 Sekunden** weich aus. Braucht der Bundle-Start selbst länger, wird keine zusätzliche volle Wartezeit addiert. Bei systemweit reduzierter Bewegung bleibt der Ring sichtbar, rotiert aber nicht.

Auf Android 12+ (einschließlich Android 16) ist der kurze systemseitige Android-Startscreen vor dem WebView technisch vorgegeben; das frei gestaltbare Vollbildmotiv kann erst direkt danach als erster app-eigener Screen erscheinen. Dieses Paket verändert den systemseitigen Android-Splash nicht, sondern stellt sicher, dass **unmittelbar danach Kevins Motiv** statt der alten Capacitor-Grafik im app-eigenen Ladescreen erscheint.

## Getrennte Beta-APK

`.github/workflows/beta-apk.yml` baut bei diesem PR zusätzlich eine **Debug-Beta mit eigener App-ID `de.rasenschach.xi.beta`** und dem Namen „Rasenschach XI Beta“. Sie kann deshalb neben der produktiven App installiert werden und verwendet deren Release-Signatur nicht. Der Workflow enthält keine Signier-Secrets und veröffentlicht keinen Release; er lädt lediglich das kurzlebige Actions-Artefakt `Rasenschach-XI-Beta-APK` hoch.

## Automatische Prüfung

Neu: `tools/startbild.test.cjs` schützt folgende Verträge:

- Startbild steht vor dem React-Root im HTML,
- das gelieferte 9:16-Motiv wird offline aus acht lokalen Datenblöcken zusammengesetzt,
- Ladeindikator ist vorhanden und unter dem XI positioniert,
- reduzierte Bewegung stoppt die Rotation,
- Mindestdauer beträgt 2,2 Sekunden,
- Startscreen wird nach der Blende aus dem DOM entfernt.

Die vollständigen Projektprüfungen werden am exakten PR-Head von GitHub Actions ausgeführt: Regressionen, Produktionsbuild und Browserprüfungen; der zusätzliche Beta-Workflow baut die getrennte Debug-APK. Ergebnisse werden nach Vorliegen hier bzw. im PR vermerkt.

## Sichtprüfung

Das gelieferte Originalmotiv ist 864 × 1536 px. Die für den Ladescreen verwendete Fassung ist 720 × 1280 px und damit ebenfalls exakt 9:16. Logo, XI, Ball, Spielfeld und Randtexte bleiben im Hochformat erhalten; der Spinner sitzt unterhalb des XI und oberhalb des unteren Slogans. Die erste erzeugte Beta wurde durch direkte APK-Inspektion als falsch erkannt (Capacitor-Standardgrafik). Erst ein neuer CI-Build auf dem korrigierten PR-Head darf als Test-Beta ausgegeben werden.

## Bewusst nicht geändert

- keine Paketversion / kein Android-versionCode,
- kein `main`-Merge,
- kein Release und keine Release-Signatur,
- keine Spiel-, Balance-, Speicher- oder Charakterlogik,
- keine Übernahme fremder PRs.

## Status

Umgesetzt auf eigenem Branch; **Astra-Abnahme und CI am PR-Head offen**, bis die GitHub-Läufe vollständig vorliegen. Android-Gerätetest der Beta bleibt Nutzer-/Astra-Sichtung.


## Korrektur nach dem ersten Android-Gerätetest

Kevins erster Beta-Test hat einen realen Fehler sichtbar gemacht: **Der Ladekreis erschien, das gewünschte Stadionmotiv aber nicht. Stattdessen war eine weiße Fläche mit blauem Capacitor-Platzhalter zu sehen.** Damit war die frühere Annahme falsch, die vorhandene Android-Datei `drawable-port-xhdpi/splash.png` enthalte bereits das gelieferte Motiv. Der grüne Build konnte nur belegen, dass die referenzierte Datei technisch ausgeliefert wurde – nicht, dass es die richtige Grafik war.

Die Korrektur verwendet deshalb nicht länger eine Android-Ressource als indirekte Quelle. Das tatsächlich von Kevin gelieferte 9:16-Motiv wurde als 720×1280-WebP vorbereitet und sein Inhalt in `startbild.b64` hinterlegt. `vite.config.js` setzt diese Daten beim HTML-Build direkt als `data:image/webp;base64,...` in den Startscreen ein. Damit gibt es im APK **keinen Dateipfad, keinen Netzabruf und keine Abhängigkeit vom nativen Capacitor-Platzhalter** für diesen Web-Ladescreen.

Die Regression prüft nun nicht nur einen Dateinamen, sondern:
- dass die Bilddaten vollständig vorhanden sind,
- dass die dekodierten Daten tatsächlich RIFF/WEBP sind,
- und dass Vite genau diese Daten in `index.html` einbettet.

Nach dieser Korrektur sind Regression, Produktionsbuild, Browsertest und Beta-APK am neuen PR-Head erneut Pflicht. Der erste grüne Beta-Lauf gilt für die Bilddarstellung ausdrücklich **nicht** als bestanden.
