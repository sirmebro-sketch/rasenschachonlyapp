# Astra-Abnahme: Goldkarten, Rekordbuch, Haptik

24.09.2026 · Basis main 62d3f689085e817169da5a9885fbe573195ef574.
Angenommen: #57 / 797a6f2f10b445f30c6f023aeac9392c4839725c und
#58 / c22a4d5a9ad4cca33bc73a36568d6100965bd426, mit Astra-Korrekturen.
Releasefassung 35.197.0 / Android 3519700. Musik aus 35.196.0 bleibt erhalten.

## Fachliche Abnahme

Gold-/Legendär-Palette geprüft, Pack-/Wildcardpfade unverändert. In der eigenen
Browser-Sichtprüfung waren Gold-Stufenname und OVR auf dem hellen Reflex kaum
lesbar. Deshalb dunkle Druckfarbe und durchgehend heller Goldgrund, auch im
Ruhemodus. Keine Kästen hinter Texten. Bronze/Silber/Legendär bleiben unverändert.

Rekordquellen direkt gegen bilanzErgaenzen verglichen: Summen über abgeschlossene
Karrieren, fünf Maximalwerte, unterschiedliche Stationen und einmal je Laufbahn
gezählte Kapitänsrolle stimmen mit neuen Beschriftungen überein. Keine Migration.
Die feste 210-px-Rasteruntergrenze wird bei wenig Platz auf 100% begrenzt.

## Bedienfeedback

Der getrennte Kaufpilot erhielt bereits sichtbaren Kacheldruckzustand (Innenrahmen
und Flächenfarbe ohne Bewegung) und bestand alle drei CI-Prüfungen auf 3be4a3c.
Die allgemeine Haptikkorrektur wird auch hier übernommen: Android-VIBRATE war
nicht deklariert; im vorhandenen WebView-Vibrationsweg ergänzt. Click statt
pointerdown vermeidet Scrollimpulse und umfasst Tastaturbedienung. Ruhe und
Vibration aus unterdrücken Impulse, gesperrte Aktionen ebenso; Entprellung bleibt.
Vier gezielte Tests führen echte Haptik-/Listenerfunktionen mit Geräteadapter aus.

Technische Referenz: https://developer.chrome.com/docs/webview (Vibration API:
Android-VIBRATE erforderlich). Kein neues natives Plugin und kein zweites System.

## Nachweise und Grenzen

245 Regressionstests, Produktionsbuild und Capacitor-Sync bestanden.
Browser-Sichtprüfung: Desktop und 320 px, Gold/Legendär mit/ohne Bewegung.
Gold gut lesbar, Porträt und Text innerhalb der Karte; kleine Karten kürzen lange
Namen wie bisher. Rekordbuch bei 320 px geöffnet: Gruppen und Langtexte lesbar,
kein horizontaler Überlauf (clientWidth und scrollWidth jeweils 263 px).
GitHub-Prüfungen am Integrations-PR und Main-Release werden vor Abschluss
kontrolliert; ihre Ergebnisse stehen direkt an PR/Actions.
Echte Android-Wirkung und subjektive Vibrationsstärke bleiben für Kevin offen.

Kaufpilot und KAUF-03 bleiben getrennt. Lemming 3 muss seinen geprüften Pilotkopf
nennen; seine unabhängige Abnahme wird erst nach Vorliegen separat ausgewertet.
