# Weiterentwicklung nach 35.171.0

## Aktueller Gerätetest

Kevin testet 35.171.0. Dieser Entwicklungsstand ergänzt ausschließlich Tests, deren Ausführung und diese Übergabe. App-Quellen, Spielregeln, App-ID, Version und Signierung bleiben auf dem getesteten Stand.

## Regressionen

`npm ci` und anschließend `npm test`. Aktuell 53 Tests einschließlich Untertests:

- Abschlussbelohnungen und Kaufbuchungen: 19 vorhandene Tests.
- Zusätzlich 34 Prüfungen zu Speicherfehlern, Wiederherstellung, Import/Rücknahme und Fortsetzen.
- Fehler werden an jedem Zugriff des normalen Mehrfachbuchungsablaufs einzeln injiziert; anschließend wird der vollständig wiederhergestellte Stand geprüft.
- Simulierte Prozessabbrüche nach 0–3 Teiländerungen sowie ein anhaltender Fehler während der Rücksetzung.
- Ereignisse überleben Katalogumsortierungen per stabiler ID; historische Auswahlindizes behalten ihre Folgen.
- Bereits feststehende Entscheidungen, Angebote und Saisonergebnisse bleiben beim Fortsetzen erhalten.

GitHub prüft Pull Requests automatisch mit Tests und Web-Build, ohne Signier-Secrets. Der Android-Release-Workflow bleibt unverändert und führt die erweiterte Testsuite ebenfalls aus.

Die Tests verwenden kontrollierte Speicheradapter und Ereignisbeispiele. Sie ersetzen weder den echten Android-Prozessabbruch noch eine vollständige Prüfung aller Ereignisfolgen. Lokal: 53/53 Tests und Produktionsbuild erfolgreich. Das zusätzliche GitHub-Ergebnis steht am Pull Request.

## Nächste kleine Inhaltsrunde

Nach Auswertung des Gerätetests zuerst den vorhandenen Trainer-Storystrang vertiefen: eine spätere passende Konsequenz einer früheren Entscheidung innerhalb der vorhandenen Ereignisfrequenz. Vor Umsetzung die vier bestehenden Schritte und bereits vorhandene Trainerereignisse abgleichen. Keine neuen Pflichtfenster oder zusätzliche Währung.

Danach wenige positions-/altersabhängige Varianten und präzisere Magazin-Schlagzeilen prüfen. Jede Inhaltsrunde braucht eindeutige Ereignis- und Auswahlkennungen sowie einen Ladeverträglichkeitstest für gespeicherte Ereignisse. Bekannte Grenzen 3/15 Saisons und Vorsatz unter der Wildcard erhalten.
