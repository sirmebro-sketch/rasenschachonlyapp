# Lemming-Paket – Startbild/Ladescreen – 18.09.2026

**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486`  
**Branch:** `lemming/startbild-ladescreen`  
**Releasezustand:** nicht integriert, kein main-Merge, kein Release.

## Auftrag

Kevins Rasenschach-XI-Stadionmotiv soll beim Appstart kurz als app-eigener Ladescreen erscheinen. Unter dem großen „XI“ sitzt ein kleiner Ladekreis. Der Branch soll als getrennte Beta installierbar sein.

## Erster Beta-Test: Fehler gefunden

Die erste Beta war technisch grün, auf Kevins Android-Gerät erschien jedoch **nicht** das gewünschte Stadionmotiv. Sichtbar war eine weiße Fläche mit blauem Capacitor-Platzhalter; nur der neue Ladekreis war korrekt vorhanden.

Ursache: Die erste Fassung referenzierte `android/app/src/main/res/drawable-port-xhdpi/splash.png`. Die Annahme, diese vorhandene Ressource enthalte bereits Kevins Motiv, war falsch. Der grüne Build bewies lediglich, dass die Datei ausgeliefert wurde, nicht dass sie die richtige Grafik enthielt. Dieser erste Beta-Lauf gilt für die Bilddarstellung ausdrücklich als verworfen.

## Korrigierte Lösung

Das tatsächlich gelieferte Motiv wurde als 720×1280-WebP für den Ladescreen vorbereitet. Die Bilddaten liegen offline in `startbild.b64` (83.704 Base64-Zeichen). `vite.config.js` liest diese Datei beim Build und ersetzt den Platzhalter `__RASENSCHACH_STARTBILD__` direkt durch eine `data:image/webp;base64,...`-URL in `index.html`.

Damit hängt der app-eigene Ladescreen nicht mehr von einer Android-Splashdatei, einem Netzabruf oder einer Laufzeit-Pfadauflösung ab. `index.html` enthält den Ladescreen vor dem React-Root; `main.jsx` hält ihn ab HTML-Start mindestens 2,2 Sekunden sichtbar und blendet ihn anschließend in 300 ms aus. Dauert der eigentliche Start länger, wird keine weitere volle Wartezeit addiert.

Der Ladekreis bleibt mittig unter dem XI. Bei `prefers-reduced-motion` rotiert er nicht.

## Beta

`.github/workflows/beta-apk.yml` baut nur für den Test eine Debug-App mit:
- App-ID `de.rasenschach.xi.beta`,
- Name „Rasenschach XI Beta“,
- Debug-Signatur statt Release-Schlüssel,
- eigenem App-/Speicherbereich, sodass sie neben der produktiven App installiert werden kann.

Kein Release und kein main-Merge.

## Regression

`tools/startbild.test.cjs` prüft:
- Ladescreen vor React,
- Bild-Platzhalter und Spinner,
- Spinnerposition und Reduced Motion,
- exakt vollständige Base64-Daten,
- RIFF/WEBP-Signatur nach dem Dekodieren,
- Vite-Einbettung als Data-URL,
- Mindestdauer und Entfernen des Ladescreens.

## Noch offen

Nach der Korrektur müssen Regression, Produktionsbuild, Browserprüfungen und der Beta-APK-Workflow am **neuen** PR-Head erneut grün sein. Danach bleibt nur der erneute echte Android-Gerätetest durch Kevin/Astra. Browser- oder CI-Erfolg wird nicht als Gerätetest ausgegeben.

## Nicht Teil dieses Pakets

Keine Spiel-, Speicher-, Balance-, Charakter-, Signatur- oder Releaseänderung. Andere offene PRs bleiben unberührt.
