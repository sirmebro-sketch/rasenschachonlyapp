# Lemming – App-Icon / Samsung-Safe-Area – 18.09.2026

## Auftrag

Kevins geliefertes Rasenschach-XI-Motiv bleibt die Iconquelle. Nach dem echten
Samsung-Gerätetest muss jedoch der vollständige Schriftzug **RASENSCHACH**
innerhalb der Launcher-Maske lesbar bleiben.

## Basis und Umfang

- Rolle: Lemming
- Basiscommit: `703d377e8eaa7932b6f5fed62ca313807ad16486`
- Branch: `lemming/appicon-fullbleed-clean`
- PR: #30
- Paketversion bleibt `35.194.1`.
- Kein main-Merge, kein Release, keine Spiel-/Speicher-/Balanceänderung.

## Beta 1

Das generische Android-Platzhaltericon wurde auf dem Gerät reproduziert. Ursache:
eine abgeschnittene WebP-Ressource. Die Quelle wurde anschließend bytegenau
repariert und durch Integritätsprüfungen in Tests und Beta-Workflow abgesichert.

## Beta 2 – echter Gerätetest

Das korrekte Motiv erscheint jetzt im Samsung-Launcher. Der Test zeigt aber,
dass One UI die äußere Adaptive-Icon-Fläche stärker maskiert als die statische
Vorschau. Dadurch werden die äußeren Buchstaben von **RASENSCHACH** abgeschnitten.

Das ist kein Defekt der WebP mehr, sondern eine falsche Nutzung des
Adaptive-Icon-Sicherheitsbereichs.

## Korrektur Beta 3

- Das Originalmotiv bleibt unverändert und wird **nicht** neu generiert.
- Adaptive Icons verwenden die Bildquelle einmal als Foreground.
- Auf der 108-dp-Adaptive-Icon-Fläche liegt das Motiv mit **15 dp Inset auf
  allen vier Seiten**, also in einem 78-dp-Quadrat.
- Dadurch wandern Titel, XI, Ball und Taktikzeichen sichtbar nach innen; der
  Schriftzug RASENSCHACH erhält ausreichend Reserve für One-UI-Maskierung.
- Die verbleibende Launcher-Fläche wird mit `#081018` gefüllt, passend zum
  dunklen Stadion-/Himmelrand des Motivs.
- Keine doppelte Bildkopie: Background ist nur eine Vollfarbe, Foreground enthält
  das Motiv genau einmal. Damit gibt es keine Skalierungsnaht.
- Legacy-Launcher bleiben unverändert auf der vollständigen Bildquelle.

## Regression

`tools/app-icon.test.cjs` prüft zusätzlich:
- 15-dp-Inset auf allen vier Seiten,
- korrekten Background,
- Foreground-Verweis auf die echte Iconquelle,
- Adaptive-Icon-Verweise,
- keine konkurrierenden alten Launcher-PNGs.

Der Beta-Workflow prüft weiterhin die echte APK und die Integrität der darin
gepackten WebP-Datei.

## Abnahmegrenze

Ob **RASENSCHACH** auf Kevins Samsung vollständig sichtbar ist, wird mit Beta 3
auf dem realen One-UI-Launcher geprüft. Erst danach Astra-Abnahme.

Status: Beta-2-Gerätebefund umgesetzt; Beta 3 und CI offen.
