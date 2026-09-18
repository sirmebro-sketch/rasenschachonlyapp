# Lemming – App-Icon vollflächig – 18.09.2026

## Paket / Auftrag

Rolle: **Lemming**

Kevins geliefertes Rasenschach-XI-Stadionmotiv ersetzt das bisherige Launcher-Icon.
Das Motiv soll die vom Smartphone vorgegebene App-Icon-Form ohne eingebauten
Innenrand, zweite Plakette oder sichtbare Naht vollständig füllen.

Arbeitsbranch: `lemming/appicon-fullbleed`  
Basis des Icon-Diffs: `lemming/startbild-ladescreen` / PR #28, Head
`063a1f58c0cd48c45264a1b2e72705180e2e2f23`. Der gestapelte Basisbranch wird
nur verwendet, damit die dort bereits getrennt vorbereitete Beta-APK-Umgebung
weiterverwendet werden kann; die Icon-Änderung selbst bleibt ein eigenes Paket.

## Problem und Ursache

Das vorhandene Icon wird aus einer konstruierten Vektorgeometrie erzeugt.
Adaptive Android-Icons legen diese Geometrie zusätzlich in eine 72-dp-Innenfläche.
Für das neue bereits fertig komponierte Motiv würde das wieder wie ein Icon im
Icon wirken und genau den gewünschten randlosen Eindruck verhindern.

## Lösung

- Geliefertes Motiv als feste Bildquelle unter `artwork/app-icon-source.webp`.
- Dieselbe vollflächige Bildquelle ist die Android-Hintergrundebene.
- Adaptive Launcher erhalten nur noch ein transparentes Foreground; ausschließlich
  Android bestimmt Kreis, Squircle oder die jeweilige Herstellerform.
- Für ältere Android-Versionen existieren generische volle Square-/Round-Bitmap-
  Ressourcen. Alte dichteabhängige Launcher-PNGs werden entfernt, damit sie die
  neue Fassung nicht übersteuern.
- `tools/app-icon.py` bildet den neuen Bildquellen-Workflow reproduzierbar ab.
- Eine Regression hält Verdrahtung, Dateityp und das Fehlen der alten Launcher-
  PNG-Fallbacks fest.
- App-ID, Signierung, Version, Spielcode und Speicherformat bleiben unverändert.

## Sichtprüfung

Vor dem Repository-Upload wurden aus der gelieferten quadratischen Originaldatei
Vorschauen für **Square, Round und Squircle** erzeugt und tatsächlich geöffnet.
Das Stadionmotiv reicht in allen drei Fällen bis an die Außenmaske; kein dunkler
Innenrahmen und keine zweite Badge-Form sind sichtbar. Schriftzug, XI und Ball
bleiben in den geprüften Masken erkennbar.

Dies ist eine Bild-/Maskensichtung, kein physischer Android-Launcher-Test.

## Prüfungen

Die automatische Paketprüfung ist `tools/app-icon.test.cjs` und läuft über
`npm test`. Zusätzlich sind vollständige Regressionen, Produktionsbuild und
die vorhandenen PR-CI-Workflows am exakten PR-Head maßgeblich.

Ein realer Android-Gerätetest bleibt offen: Installation der getrennten Beta,
Launcher-Darstellung auf dem konkreten Gerät sowie Hersteller-Masken/Zoom prüfen.

## Bewusst nicht geändert

- keine Paketversion / kein versionCode
- keine Release-Signatur oder App-ID
- kein main-Merge / kein Release
- keine Spielmechanik oder Speicherung
- keine fremde PR-Integration

Status: **zur Astra-Abnahme, noch nicht integriert**.
