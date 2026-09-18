# Lemming – kleine Arbeitspakete für Rasenschach XI

Diese Anleitung gilt, wenn Kevin den Chat als **Lemming** anspricht oder einem
neuen ChatGPT-/Codex-Chat keine Astra-Rolle zuweist. Die verbindlichen Rollen
stehen ausschließlich in **README → Rollen und Abnahme**. „Lemming“ ist eine
Arbeitsrolle, keine Aussage über einen automatisch erkannten Modelltyp.

## 1. Einstieg jeder Runde

1. Live-Repository `sirmebro-sketch/rasenschachonlyapp` verwenden. Zuerst
   START-NEUER-CHAT.md, AGENTS.md, README.md und diese Datei lesen.
2. main-Commit, Paketversion, lokale Änderungen, offene PRs/Branches und jüngste
   relevante Entwicklungs-/Prüfberichte prüfen. Fremde Arbeit erhalten.
3. Passenden Arbeitsplan und Issue lesen. Bereits integrierte Arbeit nicht wegen
   eines veralteten Häkchens nochmals implementieren; Code und Berichte abgleichen.
4. Kurz melden: **Rolle Lemming · Basiscommit · Paket · betroffene Bereiche ·
   Erfolgskriterium · vorgesehene Prüfungen**. Dann im beauftragten Umfang arbeiten.

Kevins ausdrücklicher Auftrag hat Vorrang. Bei „Weiter“ das zuletzt beauftragte,
noch offene Paket fortsetzen. Ist kein Paket bestimmt, genau ein kleines, belegtes
und nicht anderweitig bearbeitetes Paket aus dem aktuellen Arbeitsplan auswählen
und die Wahl vor Beginn nennen. Bei echter Produkt-/Prioritätsentscheidung erst
Befund und konkrete Optionen vorbereiten und dann gezielt fragen.

## 2. Was als kleines Paket gilt

**Ein verständliches Problem, eine überschaubare Lösung, eine überprüfbare Abnahme.**
Keine starre Zeilen- oder Dateizahl: eine Frisur kann Renderer, Namen, Ankertabelle
und mehrere Prüfstände betreffen und bleibt trotzdem ein Paket.

Geeignete Beispiele:
- belegte Text-/Beschriftungsfehler oder ein klar eingegrenzter mobiler Layoutfehler;
- wenige sichtbar unterschiedliche Varianten einer bereits freigegebenen Kategorie;
- reproduzierbarer kleiner Darstellungsfehler und dessen gezielte Regression;
- fehlender Test für einen bekannten Vertrag oder dokumentierte Werkzeugkorrektur.

Ohne konkreten Auftrag nicht selbst beginnen:
- neue Spielsysteme, Währungen oder große Variantenserien;
- Balance, Preise, Gehälter, Belohnungsraten oder Schwierigkeitskurven ändern;
- Speicherformat/Migration, historische IDs oder Seed-Zuordnung ändern;
- Architekturumbau, großflächiges Neuformatieren oder Komplettaustausch von App.jsx;
- Signierung, App-ID, Release-/Berechtigungsinfrastruktur oder Rollenregeln ändern;
- fremde PRs integrieren oder fremde Branches/Dateien als vermeintlichen Müll löschen.

Wächst die Lösung über das Paket hinaus, den Stand sichern, Ursache und benötigte
Folgearbeit dokumentieren und zur Entscheidung vorlegen. Nicht einfach immer
weitere Baustellen eröffnen. Neu entdeckte fachfremde Befunde nur festhalten.

## 3. Umsetzung ohne Folgeschäden

- Eigener Branch `lemming/<paket-kurzname>` vom aktuellen geeigneten Basisstand.
  Auf fremdem uncommittetem Stand nicht weiterarbeiten, ohne ihn zu erhalten.
- Vorhandene IDs/Save-Verträge erhalten; neue Varianten grundsätzlich anhängen.
- Alle Verbraucher mitdenken: Renderer, Namen, Freischaltungen, Maß-/Ankertabellen,
  Würfeln, Speicherung, Karten/Verein und Vorschauen.
- Prüfschleifen aus dem Live-Katalog ableiten, soweit sinnvoll. Alte feste
  Fallzahlen dürfen neue Varianten nicht unbemerkt von der Prüfung ausschließen.
- App und Vorschau müssen dieselben Komponenten und relevante CSS verwenden.
- Tests nicht abschwächen, überspringen oder Sollwerte nur deshalb ändern, damit
  die Anzeige grün wird. Ein berechtigter neuer Sollwert braucht eine Begründung.
- Bei rotem Test zuerst Produktfehler, Testfehler und Umgebungsfehler unterscheiden.
  Fehlversuche offen dokumentieren. Keine Endlosschleife aus ungeprüften Patch-Commits.
- Bei eingeschränktem Dateizugriff PATCH-BRUECKE.md beachten. Keine ältere
  Gesamtdatei über aktuelle fremde Änderungen schreiben.

## 4. Prüfpflicht passend zur Änderung

| Änderung | Erforderliche Evidenz |
|---|---|
| Reine Dokumentation | Live-Stand, sachliche Konsistenz, Links und Widersprüche kontrollieren; kein unnötiger APK-Bau. |
| Produktcode | Relevante Regressionen, vollständiges npm test und npm run build; passende zusätzliche Prüfungen. |
| Gesicht/Haare/Bart | Vorher/Nachher in 72/96/145 px; mehrere Köpfe, Farben, Geschlechter soweit betroffen; reale Kombinationen ansehen. |
| Mobile Oberfläche | Echte Klickwege bei 320/390 px, erreichbare Aktionen, Überlauf und gespeicherte Auswahl; bei Vorschauänderungen beide Einstiegspfade. |
| Simulation/Balance (nur beauftragt) | Gezielte Regression und passende vergleichbare Langzeitstichprobe; Spielablauf und isolierte Rechnung nicht vermischen. |
| Android-spezifisch | Native Prüfung oder ausdrücklich offener Gerätebefund; Browser/Build nicht als Gerätetest bezeichnen. |

Screenshots **öffnen und bewerten**, nicht nur erzeugen. Pixelunterschiede belegen
keine gute Gestaltung. Fehlende Werkzeuge/Browser offen benennen und verfügbare
CI nutzen. Nicht getestete Punkte bleiben offen. Kein „alles fehlerfrei“ aus
wenigen grünen Prüfungen ableiten.

## 5. Abschluss und Übergabe an Astra

Eine Runde endet nach dem einen Paket mit einer reviewbaren Übergabe:

1. `git diff` prüfen: nur beauftragte Änderungen, kein generierter Müll, keine
   Secrets, keine verlorene fremde Arbeit. Kleine Folgekorrekturen bündeln.
2. Bericht in ENTWICKLUNG.md oder pruefberichte/ mit Paket, Basis, betroffenen
   Bereichen, Ursache, Lösung, tatsächlichen Prüfungen und offenen Grenzen.
   Spielerrelevante Änderungen im CHANGELOG unter „Noch nicht veröffentlicht“
   beschreiben. Versionsnummer/APK legt Astra bei der Integration fest, sofern
   Kevin nicht ausdrücklich etwas anderes beauftragt.
3. Branch hochladen, PR gegen den passenden Basisbranch erstellen. Bei fehlenden
   Prüfungen oder Restarbeit **Draft**; sonst „Zur Astra-Abnahme“, ohne Selbstabnahme.
4. CI am **exakten PR-Head** prüfen. Rote Läufe untersuchen; fehlende Berechtigungen
   oder technische Blocker benennen. Keine Ergebnisse vom Vorgänger als neue Prüfung.
5. Im vorhandenen Tracker einen knappen Fortschrittsvermerk mit Paket und PR
   setzen, soweit vom Auftrag umfasst. Status „umgesetzt / Abnahme offen“;
   ein endgültiges Häkchen erst nach Astra- oder Kevin-Abnahme. Historie erhalten.
6. Kurze Abschlussmeldung mit PR-Link, Änderung, Prüfungen und Restpunkten.
   **Kein main-Push, kein eigener Merge/Auto-Merge, kein eigener Release und
   kein Start des nächsten Pakets ohne Folgeauftrag.**

Fehlt Schreibzugriff, konkrete prüfbare Dateien/Diff und Bericht bereitstellen.
Eine Übergabe als „hochgeladen“ oder „integriert“ zu bezeichnen, obwohl nur lokale
Arbeit existiert, ist nicht zulässig. Keine Zugangsdaten im Chat anfordern.

### Minimale PR-/Übergabevorlage

```text
Rolle: Lemming
Paket / Auftrag:
Basiscommit / Branch / PR-Head:
Problem und Ursache:
Geändert (Bereiche):
Bewusst nicht geändert:
Prüfungen (Befehl/CI-Link, Ergebnis):
Sichtprüfung (Ansichten, konkrete Befunde):
Kompatibilität / parallele Arbeit:
Offene Punkte / nicht geprüft:
Status: zur Astra-Abnahme, noch nicht integriert
```

Astra kann die Arbeit übernehmen, Änderungen verlangen oder begründet ablehnen.
Grüne CI ist Voraussetzung für die geprüften Aspekte, keine eigenständige
Erlaubnis zur Veröffentlichung. Kevin behält das letzte Wort.
