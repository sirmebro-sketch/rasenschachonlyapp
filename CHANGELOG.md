# Änderungen

## 35.171.0 – Abschlussbelohnungen und sichere Käufe

- Abschluss-VC erst ab drei tatsächlich abgeschlossenen Saisons, einschließlich Jugend-, Vereins- und Errungenschaftsboni. Unter drei Saisons gibt es keine Abschluss-VC; freigeschaltete Errungenschaften bleiben erhalten.
- Ein Gratis-Bronzepack beim Karriereabschluss ab 15 gespielten Saisons, genau einmal pro Laufbahn. Bestehende Coins, Packs und Spielstände werden nicht rückwirkend geändert.
- Gemeinsamer Coinbeleg für Gutschrift und Anzeige; beide Zuschläge, Rundungen, Mindestbetrag und sämtliche Bonusposten werden vollständig erklärt.
- Wildcard-Tauschkauf in einer laufenden Karriere nach dem ersten Training gesperrt. Ein Vorratskauf ohne aktive Karriere bleibt möglich.
- Anleitung, Packladen und Abschlussanzeige erklären die neuen Grenzen.
- Neue automatisierte Regressionen laufen vor dem Android-Build: Grenzfälle 0/1/2/3/14/15/16/30, echte Abschluss- und Kaufhandler, Doppelabschluss, Belegsummen und gespeicherte Guthaben.
- App-ID, Signierung und Vollbildmodus erhalten; versionCode 3517100.

Validierung: `npm test`, `npm run build`, Capacitor-Synchronisierung; signierter APK-/AAB-Build und Signaturprüfung im GitHub-Workflow dieses Commits. Gerätetest weiterhin erforderlich, besonders Update und Abschluss bei 2/3 bzw. 14/15 Saisons.

Geltungsbereich: Die Grenzen betreffen neue Karriereabschlussbelohnungen. Kartenverkäufe, bestehende Guthaben sowie der bisherige Akademie-/Vereinsjahresfortschritt sind nicht an diese Grenzen gekoppelt. Keine inhaltlichen Erweiterungen in diesem Update.

## 35.170.0 – Android-Vollbild

- Status- und Navigationsleiste beim Start und bei Rückkehr in die App ausblenden.
- Randwischen blendet Systemleisten vorübergehend ein; Android blendet sie automatisch wieder aus.
- Umsetzung in MainActivity mit AndroidX WindowInsetsControllerCompat, ohne zusätzliches Plugin.
- App-ID und vorhandene Signierung unverändert; versionCode von 3516900 auf 3517000 erhöht.
- Android-Build startet jetzt auch bei Änderungen an App-Quellen und Android-Dateien.
- Spielmechanik und Speicherung unverändert. Ausgangsstand: Commit 6c15815.

Prüfung: Versionskonsistenz und Diff lokal prüfen; Web-/Android-Build und Signaturprüfung erfolgen im GitHub-Workflow dieses Commits. Dessen Ergebnis ist maßgeblich.
Offen am Gerät: Update über 35.169.0 ohne Deinstallation, Spielstand erhalten, Start im Vollbild, Randwischen, Rückkehr aus Benachrichtigungen/anderer App, Tastatur und Displayausschnitt.

Android-Referenz: https://developer.android.com/develop/ui/views/layout/immersive
