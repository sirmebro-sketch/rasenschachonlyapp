# Lemming-Paket – Startbild / Ladescreen – 18.09.2026

**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486` (`main`, Paketversion 35.194.1)  
**Branch:** `lemming/startbild-ladescreen`  
**Auftrag:** Das von Kevin gelieferte Rasenschach-XI-Motiv direkt beim Appstart kurz als hochwertigen Ladescreen zeigen, mit kleinem Ladekreis unter dem „XI“. Zusätzlich soll der Branch als getrennte Beta-APK testbar sein, ohne main-Merge oder Release.

## Problem und Lösung

Der bisherige Web-Einstieg enthielt nur den React-Root. Dadurch konnte das gewünschte Motiv erst nach zusätzlichem Produktcode erscheinen. Das Paket setzt den Startscreen deshalb bewusst **vor React direkt in `index.html`**. Das Bild ist offline als eingebettetes WebP enthalten; es braucht weder Netzwerk noch einen späteren Asset-Request. Ein kleiner Spinner liegt bei ca. 64 % Bildschirmhöhe unter dem großen „XI“.

`main.jsx` blendet den Screen nach mindestens 2,2 Sekunden weich aus. Braucht der Bundle-Start selbst länger, wird keine weitere künstliche Wartezeit addiert: nach dem ersten Render-Auftrag beginnt die Blende unmittelbar. App-Logik, Speicherformat und Spielinhalte bleiben unverändert.

Der vorhandene native Android-Launchscreen wird in diesem kleinen Paket **nicht ersetzt**. Direkt nach Übergabe an die lokale Capacitor-WebView erscheint der neue Screen. Eine vollständige native Android-12-Splash-Neugestaltung wäre ein eigenes Android-Themenpaket und ist für den beauftragten Web-Ladescreen nicht nötig.

## Getrennte Beta-APK

`.github/workflows/beta-apk.yml` baut bei diesem PR zusätzlich eine **Debug-Beta mit eigener App-ID `de.rasenschach.xi.beta`** und dem Namen „Rasenschach XI Beta“. Sie kann deshalb neben der produktiven App installiert werden und verwendet deren Release-Signatur nicht. Der Workflow enthält keine Signier-Secrets und veröffentlicht keinen Release; er lädt lediglich das kurzlebige Actions-Artefakt `Rasenschach-XI-Beta-APK` hoch.

## Automatische Prüfung

Neu: `tools/startbild.test.cjs` schützt folgende Verträge:

- Startbild steht vor dem React-Root im HTML,
- Bild ist offline eingebettet,
- Ladeindikator ist vorhanden und unter dem XI positioniert,
- Mindestdauer beträgt 2,2 Sekunden,
- Startscreen wird nach der Blende aus dem DOM entfernt.

**Lokal:** In der Lemming-Umgebung war kein Netzwerkzugriff auf GitHub/npm verfügbar; deshalb konnten `npm ci`, `npm test`, `npm run build` und ein lokaler Android-Build nicht glaubwürdig ausgeführt werden. Maßgeblich sind die CI-Läufe am exakten PR-Head. Diese Grenze wird nicht als Erfolg umetikettiert.

## Sichtprüfung

Das vom Nutzer gelieferte Originalmotiv ist 864 × 1536 px. Für die direkte Einbettung wurde eine WebP-Fassung gleicher Auflösung mit hoher Qualität erzeugt. Die zentrale Logo-/XI-Fläche bleibt bei `object-fit: cover` auf typischen Hochformat-Smartphones sichtbar; der Spinner liegt unterhalb des XI. Eine echte Android-Gerätesichtung bleibt bis zur Installation des Beta-Artefakts offen.

## Bewusst nicht geändert

- keine Paketversion / kein Android-versionCode,
- kein `main`-Merge,
- kein Release und keine Release-Signatur,
- keine Spiel-, Balance-, Speicher- oder Charakterlogik,
- keine Übernahme fremder PRs.

## Status

Umgesetzt auf eigenem Branch; **Astra-Abnahme und CI am PR-Head offen**, bis die GitHub-Läufe vollständig vorliegen. Android-Gerätetest der Beta bleibt Nutzer-/Astra-Sichtung.
