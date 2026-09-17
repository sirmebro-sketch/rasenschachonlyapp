# CHAR-P1-05 – Charaktererstellung als Bedienoberfläche

**Datum:** 17.09.2026  
**Ausgangsstand:** `bb81338` (`CHAR-P1-04`)  
**Arbeitszweig:** `codex/char-p1-05`  
**Version:** 35.192.0 unverändert

## Ziel

Die bereits große Porträtauswahl soll auf Smartphones schnell verständlich und sicher bedienbar sein, ohne gespeicherte Porträt-IDs, Freischaltungen, Karriereablauf oder Währungen zu verändern.

## Umsetzung

- Neue, auf die Charakter-Feineinstellungen begrenzte Styleschicht `charakter-ui.css`.
- Bei geöffneten Feinheiten wird die feststehende Porträtvorschau auf schmalen Bildschirmen kompakter, damit mehr Auswahlfläche sichtbar bleibt.
- Die zahlreichen Merkmalkategorien liegen bis 520 px in einer zweizeiligen horizontalen Touch-/Wischspur statt in einem langen Knopfteppich.
- Kategorien haben mindestens 44 px Höhe; `Festhalten` ist eine vollbreite Aktion mit mindestens 44 px Höhe.
- Aktive Kategorie und aktive Variante bleiben optisch klar markiert.
- Varianten nutzen ein responsives Raster: bei 320 px praktisch zwei, bei 390 px praktisch drei Spalten.
- `Los geht's` und `Zurück` bleiben in der vorhandenen festen Abschlussleiste erreichbar.
- Keine Änderung an `App.jsx`, `portraet.js`, stabilen Porträtkennungen, Freischaltungen, Währungen oder Karrierelogik. Dadurch bleibt diese Runde außerdem konfliktarm gegenüber den parallel offenen Wirtschafts-PRs.

## Neue automatische Abnahme

`tools/browser/charakter-p1-05.spec.js` führt auf den beiden geforderten Smartphone-Breiten einen echten Klickweg aus:

1. Charaktererstellung öffnen und Feinheiten aufklappen.
2. Kein horizontaler Seitenüberlauf; nur die Kategorien besitzen bewusst eine eigene Wischspur.
3. Hautton `Tiefbraun` auswählen und festhalten.
4. Bart `Ankerbart` auswählen und festhalten.
5. Freie Merkmale würfeln und prüfen, dass beide festgehaltenen Merkmale erhalten bleiben.
6. Bis zu `Besondere Merkmale` durch die Kategorien navigieren.
7. `Los geht's` und `Zurück` auf Erreichbarkeit und mindestens 44 px Höhe prüfen.
8. Karriere wirklich starten und den geschriebenen Browser-Spielstand lesen.
9. Gespeicherte IDs müssen unverändert `haut=12` und `bart=14` sein.
10. Keine Browser-Seitenfehler.

Die Namen/IDs wurden gegen `PORTRAET_NAMEN` verifiziert: `Tiefbraun` ist Haut-ID 12, `Ankerbart` Bart-ID 14.

## Ergebnis

### Spielregressionen und Build

GitHub Actions `Spielregressionen`, Run 93:

- `npm test`: **127/127 bestanden**, 0 fehlgeschlagen, 0 übersprungen.
- `npm run build`: **erfolgreich**, Vite 6.4.3, 54 Module transformiert.
- Bekannte, nicht durch CHAR-P1-05 verursachte Hinweise bleiben: React-SSR-`useLayoutEffect`-Warnungen in bestehenden Rendering-Tests und Vite-Hinweis auf den großen Hauptchunk.

### Browser

GitHub Actions `Visuelle Browsertests`, Run 78:

- **38 bestanden**, **13 projektbedingt übersprungen**, 0 fehlgeschlagen.
- Neuer CHAR-P1-05-Weg:
  - 390×844 (`handy`): bestanden in 3,9 s.
  - 320×720 (`schmal`): bestanden in 3,5 s.
  - Desktop wird für diesen gezielt mobilen Test bewusst übersprungen; die vorhandenen Desktop-Charaktertests bleiben grün.
- Vorhandene Charakter-, Identitätsketten-, Kopf-, Gesichts-, Frisur- und Bartprüfungen bleiben erfolgreich.

## Visuelle Sichtprüfung der erzeugten Smartphone-Screenshots

- 320 px: kompakte Spielerpass-Vorschau; Kategorien zweizeilig horizontal; Varianten zweispaltig; Abschlussaktionen frei sichtbar.
- 390 px: kompakte Spielerpass-Vorschau; Kategorien zweizeilig horizontal; Varianten dreispaltig; Abschlussaktionen frei sichtbar.
- Eine rechts angeschnittene weitere Kategorie zeigt auf beiden schmalen Breiten bewusst an, dass die Kategorien horizontal gewischt werden können, ohne die gesamte Seite horizontal zu verbreitern.
- Festgehaltene Kategorien werden sichtbar mit `· fest` bezeichnet; aktive Kategorie und aktuelle Variante sind zusätzlich über den Rahmen erkennbar.

## Fehlversuche während der Testentwicklung

Zwei Zwischenläufe waren rot, ohne dass eine Produktionsregression vorlag:

1. Der erste neue Test verwendete einen verschachtelten Playwright-`:has()`-Locator für die Kategorienleiste und wartete dadurch ins Timeout. Er wurde auf den realen Kategorienbutton `Hautton` und dessen Elterncontainer verankert.
2. Der zweite Lauf erreichte die Bedienung bis nach dem Würfeln; danach erwartete der Test weiterhin exakt `Bartwuchs`/`Hautton`, obwohl die Oberfläche korrekt `Bartwuchs · fest`/`Hautton · fest` anzeigt. Der Locator wurde auf beide echten Zustände erweitert. Die fachlichen Prüfkriterien wurden dabei nicht abgeschwächt.

Der darauffolgende vollständige Browserlauf ist grün.

## Abgrenzung / Rest

- Kein neues Zahlungsmittel, keine zusätzliche Pflichtseite und keine neue Interstitial-Seite.
- Freischaltlogik (`mk_haar`, `mk_acc`) bleibt unverändert und wird weiterhin von den vorhandenen Charaktertests abgedeckt.
- Ein physischer Android-Gerätetest wurde in dieser Runde nicht durchgeführt. Für CHAR-P1-05 ist der geforderte reale Browser-Klickweg auf 320/390 px automatisiert und bestanden; Haptik/Scrollgefühl auf echter Hardware kann beim nächsten APK-Gerätetest zusätzlich geprüft werden.
