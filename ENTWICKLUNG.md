# Weiterentwicklung – 35.172.0

## Aktueller Gerätetest

35.172.0 ergänzt die Wildcard-Korrektur, zwei alternative Abschlüsse des Trainer-Strangs und die vorbereiteten Speicherregressionen. Die neue APK kann über die bestehende App installiert werden; App-ID und Signierung bleiben erhalten. Auf dem Gerät besonders die Enthüllung bei normaler/großer Anzeige sowie mit und ohne Animation testen.

## Regressionen

`npm ci` und anschließend `npm test`. Aktuell 60 Tests einschließlich Untertests:

- Abschlussbelohnungen und Kaufbuchungen: 19 vorhandene Tests.
- Sieben weitere Prüfungen zu verdeckter Wildcard, Trainer-Pfaden, Wartezeit, alten Ereignisspielständen und eindeutigen Kennungen.
- Zusätzlich 34 Prüfungen zu Speicherfehlern, Wiederherstellung, Import/Rücknahme und Fortsetzen.
- Fehler werden an jedem Zugriff des normalen Mehrfachbuchungsablaufs einzeln injiziert; anschließend wird der vollständig wiederhergestellte Stand geprüft.
- Simulierte Prozessabbrüche nach 0–3 Teiländerungen sowie ein anhaltender Fehler während der Rücksetzung.
- Ereignisse überleben Katalogumsortierungen per stabiler ID; historische Auswahlindizes behalten ihre Folgen.
- Bereits feststehende Entscheidungen, Angebote und Saisonergebnisse bleiben beim Fortsetzen erhalten.

GitHub prüft Pull Requests automatisch mit Tests und Web-Build, ohne Signier-Secrets. Der Android-Release-Workflow bleibt unverändert und führt die erweiterte Testsuite ebenfalls aus.

Die Tests verwenden kontrollierte Speicheradapter und Ereignisbeispiele. Sie ersetzen weder den echten Android-Prozessabbruch noch eine vollständige Prüfung aller Ereignisfolgen. Lokal: 60/60 Tests, Produktionsbuild und Capacitor-Synchronisierung erfolgreich. Die Wildcard-Prüfung kontrolliert das initial gerenderte Markup und die Deckfarbe; sie ersetzt keine visuelle Prüfung der Drehung in der Android-WebView. CI-Ergebnisse stehen am jeweiligen Commit.

## Nächste kleine Inhaltsrunde

Umgesetzt: Der vierte Trainer-Schritt unterscheidet gepflegten, lockeren und abgebrochenen Kontakt. Erfolgreiche Annäherung im zweiten Schritt führt weiter zum engen Kontakt. Vier Schritte und bisherige Ereignisfrequenz bleiben erhalten. Bereits gespeicherte Abschiedsereignisse behalten ihre bisherigen Auswahlfolgen. Neue Varianten erhalten eigene stabile Kennungen.

Als mögliche nächste Runde wenige positions-/altersabhängige Varianten und präzisere Magazin-Schlagzeilen prüfen. Jede Inhaltsrunde braucht eindeutige Ereignis- und Auswahlkennungen sowie einen Ladeverträglichkeitstest für gespeicherte Ereignisse. Bekannte Grenzen 3/15 Saisons und Vorsatz unter der Wildcard erhalten.
