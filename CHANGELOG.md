# 35.195.0 · Vereinswirtschaft und gemeinsame Qualitätsrunde

Vereinskasse, Preise, Sponsoren, Ausbau, Saisonabrechnung und Lizenzfolgen sind verbunden.
Neue Spielklänge, Startbild und App-Icon; lange Locken und bessere mobile Bedienung.
Kartentexte, lange Namen, kleine Bildschirmhöhen und mehrere Hilfe-/Leertexte korrigiert.
Android-Geräteprüfung der neuen Audio-/Optikfunktionen bleibt offen.

# Änderungen

## Noch nicht veröffentlicht

- Männerfrisur 27 „Lange Locken“ rahmt das Gesicht mit getrennten Kronen-/Seitenlocken statt einer tiefen geschlossenen Haarfläche; gespeicherte Frisur-ID und übriger Katalog bleiben unverändert.

- Auf schmalen Smartphones zeigt die Charakter-Kategorienleiste jetzt dezent an, dass weitere Kategorien horizontal erreichbar sind; der Hinweis wechselt beim Wischen passend zwischen Anfang, Mitte und Ende.

- Neues Rasenschach-XI-Startmotiv erscheint beim Appstart als kurzer Ladescreen mit dezentem Ladekreis unter dem XI.
- Separater PR-Beta-Build mit eigener App-ID ermöglicht die Installation neben der produktiven Android-App, ohne Release oder main-Merge.

- Neues Rasenschach-XI-Motiv ersetzt das bisherige App-Icon vollflächig; Android liefert nur noch die jeweilige Launcher-Maske, ohne zweiten Innenrand.
- PR-Beta kann als getrennte Debug-App `de.rasenschach.xi.beta` neben der produktiven App installiert werden.
- Launcher-Regression prüft WebP-RIFF-Länge, 432×432-Maße und die tatsächlich verwendeten Android-Icon-Verweise.


## Noch nicht veröffentlicht – Sol: Spielklänge zur Astra-Abnahme

- Eigene, kurze Sounds für Menüs, Entscheidungen, Sonderschuss, Saison, Titel, Wildcards und Sammelkarten. Kein durchgehender Soundtrack.
- Lautstärke in den Einstellungen zwischen Aus, Leise und Normal wählbar; die Auswahl bleibt beim Neustart erhalten.

## 35.194.1 – Kleine Korrekturen nach unabhängiger Qualitätsprüfung

- Neue Mundformen verwenden eigene Abstandsgrenzen für Lippen, Kinn und Bärte.
- Die Versionsanzeige folgt direkt der zentralen Paketversion.
- Mobile Charaktergestaltung auch im isolierten Spieltest und in der Galerie; vollständige Porträtbögen mit allen 31 Frisuren.

## 35.194.0 – Ausdrucksstärkere Gesichter

- Drei neue Mundformen: herzförmig, kompakt und ein breites Grinsen.
- Zwei neue Wangen-/Kinnformen mit markanter Kieferkante und spitzer Kinnkontur; die spitze Kontur wurde nach einer roten 72-px-Sichtprüfung gezielt nachgeschärft.
- Bestehende Gesichts-IDs und historische Seed-Porträts bleiben unverändert; neue Formen werden append-only im Editor und beim Würfeln ergänzt.
- Gesichtszug-Prüfung um 72/96-px-Rastervergleich sowie Bart-/Brillen-Überlagerungscheck erweitert.

## 35.193.0 – Mehr echte Frisurenvielfalt

- Männerfrisuren um mittellange und lange Locken, Box Braids, zurückgebundene Locs und einen deutlich asymmetrischen Fringe erweitert.
- Frauenfrisuren um Vollpony, Curtain Bangs, asymmetrischen Bob, Half-up, langen Flechtzopf, lange Wellen und Twin Buns erweitert.
- Strukturierter Kurzschnitt, Kurzer Ansatz und Naturvolumen stärker von ihren bisherigen Nachbarformen abgegrenzt; bestehende gespeicherte Frisur-IDs bleiben erhalten.
- Frisurenprüfung auf sieben Kopf-/Farbkontexte und 72/96/145 px erweitert; Passungsregressionen für die vergrößerten Kataloge aktualisiert.

## 35.192.0 – Stimmige Bilanzen und freiwillige Vereinsgründung

- Ligatabellen aus gemeinsamen Hin-/Rückspielen: Siege, Niederlagen, Remis und Tore passen ligaweit zusammen. Karriere-Rang und daran gebundene Folgen bleiben erhalten.
- Kalenderjahre in Abschluss, Rückblick und Ruhmeshalle vereinheitlicht, auch beim Rücktritt direkt nach einer Saison.
- Erste Vereinsgründung lässt sich über einen sichtbaren Zurück-Button verlassen.
- Akademie- und Gratispacktexte nennen die tatsächlichen Mindestlaufzeiten.

## 35.191.0 – Wiedererkennbare Ruhmeshallen-Spieler

- Gesicht, Haut, Frisur, Bart und Geschlecht werden von der Ruhmeshalle auf die Sammelkarte und in den Vereinskader übernommen.
- Vorhandene Karten werden beim Laden anhand noch vorhandener Ruhmeshallen-Einträge abgeglichen; Kartenwerte bleiben erhalten.

## 35.190.0 – Icon-Kopf bis an den Rand

- Rote Kopffläche und weißer Trennstreifen reichen über die Launcher-Schnittkante; dunkler Saum oben und seitlich entfernt. Native Vektor- und Legacy-Icons neu erzeugt.

## 35.189.0 – Seltene Funde und saubere Konturen

- Wildcard-Titel und Beschreibung beim Aufdecken wieder mittig unter dem Kopfstreifen.
- Weltklasse, GOAT und HSV mit längerem Spannungsaufbau, Lichtwellen, einmaligem Funkenausbruch und langsamem Lichtfächer; HSV mit blau-weißen Rauten. Ruhemodus bleibt unbewegt.
- App-Icon ohne inneres Abzeichen und mit randfüllender Grafik; Android bestimmt die äußere Form.
- Rasierte Haare und Halbglatze aus der tatsächlichen Schädelkurve; Haar- und Bartkanten überlappen minimal gegen sichtbare Hautsäume.

## 35.188.0 – Karten, Porträts und Bedienung

- Wildcards beim Aufdecken und im Spielerpass teilen Kopfstreifen, Seltenheitsrahmen und Textur; kein Sprung beim Erscheinen von Weiter.
- Weltklasse, GOAT und Nur der HSV mit eigenen Motiven und Aufdeckakzenten; HSV mit blau-weißer Folie und Rautenmotiv.
- Gold- und Legendenpacks ohne graue Folienausschnitte: Ball und Beschriftung liegen sauber über der durchgehenden Folie.
- Geschlossene Haarsilhouetten und an Kopfformen angepasste Bartkonturen; ähnliche Varianten deutlicher unterscheidbar, Freischaltungen erhalten.
- Dezenter Startpfeil im Hauptmenü; Los geht’s und Zurück in der Charaktererstellung am unteren Bildschirmrand, Start mit ruhigem Puls.
- Einstellungen in fünf verständliche Bereiche gegliedert, auch bei großer Anzeige bedienbar.
- App-Icon als scharfe Vektorgeometrie samt Android-Ressourcen neu aufgebaut.
- Sonderschuss im Spielfeld-Look mit deutlicherem Fußball; Timing und Belohnungen unverändert.

## 35.187.0 – Ruhemodus bei Wildcards

- Rückseitenschimmer läuft im Ruhemodus nicht mehr und endet beim Aufdecken.
- Sicht- und Bedienprüfung der Aufdeckungen für alle Seltenheiten erweitert.

## 35.186.0 – Mehr Gesicht und verlässliche Sichtprüfung

- Moderne Bärte neu gezeichnet, lange Bärte nicht mehr am Kinn abgeschnitten; Ankerbart, spitzer und breiter Vollbart ergänzt.
- Zusätzliche Augen-, Brauen-, Nasen-, Mund-, Ohren- und Wangenformen, Make-up und besondere Merkmale. Iris bleibt innerhalb der Augenform.
- Stirnbänder weicher geformt; Sportbrille und Creolen ergänzen die freischaltbaren Accessoires. Bestehende Kennungen und Freischaltungen bleiben erhalten.
- Aussagekräftige Variantenbezeichnungen; unpassender Wunschverein wird beim Wechsel zwischen Männer- und Frauenfußball zurückgesetzt.
- Spielbare Browserprüfung und vollständige Merkmalgalerie; automatische Bedienprüfungen in drei Bildschirmgrößen.

## 35.185.0 – Aufdeckbühne und sauberere Haarformen

- Größere Wildcards mit besser lesbarer Wirkung; kurze Lichtbühne je Seltenheit statt Vollbildblitz und Dauerpartikeln.
- Gold- und legendäre Spielerkarten mit sanfterem Auftritt und kurzem Lichtakzent; bestehende Holo-Folie bleibt erhalten.
- Haarformen moderner Porträts neu gezeichnet: verbundene Silhouetten, dezente Struktur, kopfbreitenabhängige Konturen; freischaltbare Formen einbezogen.
- Mittelscheitel mit Fall und kurzer Fade zusätzlich für beide Auswahlen. Bestehende Frisurkennungen und Freischaltungen bleiben erhalten.

## 35.184.0 – Kompakter Spielerpass

- Feinheiten beim Start der Charaktererstellung eingeklappt.
- Gleich gestaltete Buttons „Würfeln“ und „Feinheiten“ bleiben nebeneinander.
- Position, Fuß und Nummer kompakt in einer Zeile; Name und Verein ohne höhenverändernde Umbrüche.

## 35.183.0 – Einheitlicher Wildcard-Glanz

- Alten zusätzlichen Lichtstreifen auf der Wildcard-Vorderseite entfernt.
- Bei der Aufdeckung läuft nur die neue Materialfolie: sanfter bei unfassbaren, kräftiger bei den höchsten Seltenheiten.

## 35.182.0 – Seltene Karten glänzen wieder

- Wandernder Goldreflex und farbige Holografie statt nur pulsierender Konturen. Legendäre Karten schimmern kräftiger als Goldkarten.
- Störenden Innenrahmen entfernt. Die Folie liegt hinter den Karteninhalten; Pack-Symbol und Beschriftung bleiben ausgespart.
- Packfolie folgt der gezackten Verpackung, Kaderfolie der Schildform. Reduzierte Bewegung wird berücksichtigt.

## 35.181.0 – Glanz ohne verdeckte Inhalte

- Holo- und Glanzeffekte folgen den Konturen von Wildcards, Spielerkarten und Packs. Porträts und Schrift bleiben frei.
- Packs erhalten einen Schimmer entlang ihrer gezackten Verpackung; Kaderkarten entlang ihrer Schildform.
- Breiter Lichtstreifen beim Kartenjubel entfernt. Dezentes Randlicht berücksichtigt reduzierte Bewegung.

## 35.180.0 – Dein eigenes Spielerporträt

- Große Porträtvorschau und anklickbare Variantenbilder statt Pfeilreglern; Farben als benannte Farbfelder.
- 14 Hauttöne und 13 Haarfarben frei von der Nationalität wählbar.
- Vier neue Frisuren je Geschlecht, drei zusätzliche Bärte, Sommersprossen und Narben; Make-up direkt auswählbar.
- Merkmale beim Würfeln einzeln festhalten. Neue Gesichter mit weicherem Licht und zurückhaltenderen Augenproportionen.
- Bisherige gespeicherte Porträts behalten ihre Formen und Darstellung; freischaltbare Extras bleiben erhalten.

## 35.179.0 – Späte Entscheidungen wirken weiter

- Drei Fortsetzungen greifen die gewählte späte Karrierepriorität nach mindestens einer Saison auf; Erinnerung daran im persönlichen Karriereabschluss.
- Rendering-Prüfungen für Abschlussbildschirm, Vereinsansicht, Packladen und Sammlung ergänzt.
- Übergaberegel für bereits übernommene Rebase-/Squash-Branches präzisiert.

## 35.178.0
- Fernstudium: Anmeldung und Abschluss getrennt; vier gespielte Saisons Lernzeit. Bestehende Abschlüsse bleiben erhalten.
- Vorsatz zeigt tatsächlich erhaltene Boni; vollständig gedeckelte neue Belohnungen geben einmalig 25.000 € Karrieregeld als Ersatz.
- Lernfortschritt beim Berufsvorsatz sichtbar. Keine Änderung von VC, Vermächtnispunkten oder Freischaltungsgrenzen.
- Späte Karriereentscheidung zwischen eigener Einsatzchance, Begleitung jüngerer Spieler und Belastungssteuerung mit klar benannten Folgen.
- Vorsatzvergleich über alle Positionen, Geschlechter und Modi ergänzt.


## 35.177.0 – Das Karriereende ist wieder erreichbar

- Behoben: Beim Beenden einer Laufbahn brach der Rückblick mit einer Fehlermeldung ab, statt die Bilanz zu zeigen. Betroffen war jede Laufbahn mit mindestens einem Pflichtspiel — also praktisch jede. Der Fehler kam aus 35.175.0 und betraf auch 35.176.0.
- Das Saisonziel steht jetzt dort, wo es angekündigt war: im Saisonrückblick, bei den Pflichtspielen der jeweiligen Saison. Wortlaut und Wirkung (+3 Moral bei Erfolg) unverändert.
- Gespeicherte Laufbahnen, Sammlung, Akademie und Verein bleiben unberührt; keine Inhalts- oder Belohnungsänderung.
- 88 Regressionen; beide Rückblicke werden dabei erstmals wirklich gezeichnet. VersionCode 3517700.

## 35.176.0 – Persönliche Karrieregeschichten

- Persönlicher Karriereabschluss ergänzt Vorsatz, geteilte Video-Notizen und die gewählte Buchgeschichte anhand gespeicherter Entscheidungen.
- Späte zweite Bildungschance: Kursbeginn ab 27, Abschluss frühestens zwei Saisons später. Vorhandene Bildungsereignisse bleiben erhalten.
- Die Mentor-Geschichte kann im späteren Karriereverlauf zeigen, wie die eigenen Notizen weitergegeben werden.
- Langzeitprüfung erweitert um Vorsatzquoten, Belohnungszeitpunkte, Ereignishäufigkeiten und Karrierephasen; keine Änderung der Belohnungswerte.

## 35.175.0 – Vorsätze werden sichtbar und lohnen sich

- Alle sechs Vorsätze mit Fortschritt direkt unter der Wildcard, Status und einmaliger Spielerbelohnung. Am Karriereende 35–90 zusätzliche Vermächtnispunkte, separat ausgewiesen und im Gesamtergebnis enthalten.
- Daheim: Spielerbonus nach zehn heimischen Saisons; Abschlussbonus nur ohne Auslandssaison bis zum Ende. Ein späterer Bruch wird angezeigt.
- Situationsabhängiges freiwilliges Saisonziel mit +3 Moral bei Erfolg, Ergebnis im bestehenden Saisonrückblick.
- Buch-/Knieabschlüsse reagieren auf den gewählten Weg; ein unterstützter Mitspieler meldet sich später namentlich. Alte Ereignis- und Auswahlkennungen erhalten.
- Claudes Werkzeugrunde übernommen. 83 Regressionen; App-ID, Signierung, Vollbild, 3/5/15-Saisons-Grenzen und Packpreise erhalten. VersionCode 3517500.

## 35.174.0 – Fünf Saisons für den Vereinsfortschritt

- Akademie-/Vereinsjahr und neue Freischaltungsfortschritte nur nach mindestens fünf abgeschlossenen Spielersaisons. Bisherige Freischaltstufen und bereits freigeschaltete Bereiche erhalten.
- Kartenverkaufspreise auf durchschnittlich 80–120 % des Packpreises kalibriert; exakte Werte 81,87–104,83 %.
- Drei positionsgerechte Videoereignisse und eine spätere Rückmeldung auf frühe Notizen ergänzt.
- 70 Regressionen; App-ID, Release-Signierung, Vollbild und 3-/15-Saisons-Belohnungsgrenzen erhalten. VersionCode 3517400.

## 35.173.0 – Verlässlicher Saisonrückblick

- Nationalmannschaftsturniere erscheinen wieder als passende Schlagzeile, mit Ergebnis und Jahr.
- Geladene Saisonkopien werden richtig zugeordnet: Vereinsjahre, Vorsaisonvergleich und Saisonerklärungen bleiben konsistent.
- Zwei Regressionen ergänzt (62 insgesamt), separaten Langzeit-Prüfstand für 192 Karrieren und Packverkäufe aufgenommen. Ergebnisse, Grenzen und nächste Inhaltsrunde in ENTWICKLUNG.md.
- VersionCode 3517300. App-ID, Release-Signierung, Vollbild und Belohnungsgrenzen bleiben erhalten.

Validierung: Regressionen, Langzeitrunde, Produktionsbuild und Capacitor-Synchronisierung. Visuelle Android-Prüfung bleibt Teil des Gerätetests.

## 35.172.0 – Verdeckte Wildcard und Trainer-Abschied

- Wildcard-Enthüllung mit vollständig deckendem Hintergrund, außerhalb transformierter Spielbereiche. Name und Wirkung werden erst beim Umdrehen gerendert.
- Weiter-Knopf reicht Klick und Tastendruck nicht mehr an die umgebende Weiter-Fläche weiter.
- Trainer-Abschied folgt dem zuvor gepflegten Kontakt: zwei alternative Abschlüsse, weiterhin vier Schritte. Alte gespeicherte Ereigniskennungen und Auswahlfolgen bleiben gültig. Zwei widersprüchliche Trainerformulierungen berichtigt.
- Vorbereitete Speicher-/Fortsetzungstests übernommen und um Wildcard- und Trainer-Regressionen ergänzt: 60 Prüfungen insgesamt.
- VersionCode 3517200; App-ID, Signierung, Vollbild und Belohnungsgrenzen 3/15 bleiben erhalten.

Validierung: 60/60 Tests, Produktionsbuild und Capacitor-Synchronisierung lokal erfolgreich. Android-Build und Signaturprüfung im Workflow dieses Commits; visuelle Enthüllung und Langzeitverhalten weiterhin auf dem Gerät prüfen.

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
