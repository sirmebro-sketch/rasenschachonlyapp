# Änderungen

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
