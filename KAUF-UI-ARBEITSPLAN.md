# Kaufoberflächen: Astra-Pilot und Lemming-Pakete

24.09.2026 · Basis: main c48b699a5653a6a2c44c86a6c3ba721b5df4500f.
Arbeitsbasis für alle drei Pakete: `astra/kaufkacheln-pilot`; beim Start aktuellen
Head abrufen und im Bericht nennen. Eigener Branch, PR gegen diesen Pilotbranch.
Kein main-Merge, kein Release, keine Versionsänderung durch Lemming.

## Ziel und Zuständigkeit

Astra baut und integriert gemeinsame Kaufkomponenten. Jugendakademie ist der
erste funktionierende Pilot. Vermögen und Profimannschaft folgen nach Abnahme
der gemeinsamen Gestaltung; diese Runde baut ihre Kaufhandler nicht um.
Kacheln zeigen Name, Bild, Stand, Nutzen, Preis und Zustand. Antippen öffnet
Details, ein separater Knopf kauft. Gesperrte und volle Ausbauten bleiben
antippbar. Preise, IDs, Balance, Speicherformat und bestehende Handler bleiben
maßgeblich. Erfolgsanzeige erst nach bestätigter Speicherung.

`kauf-ui.jsx`: KaufKachel und KaufDetail sowie KAUF_CSS; Eigentümer Astra.
`App.jsx`: Akademie-Anbindung; Eigentümer Astra.
`tools/spieltest.cjs`: isolierte App mit Schaltfläche „Akademie-Kacheln“; Astra.
`tools/browser/akademie-kacheln.spec.js`: Astra-Verhaltenstests.

## KAUF-01 · Illustrationen (Lemming 1)

Änderungsbereich: `kauf-icons.jsx`, optional eigenes Vorschauwerkzeug
`tools/kauf-icons-vorschau.cjs`, eigener Bericht `pruefberichte/kauf-01.md`.
Export bleibt `KaufIcon({id})`. Dekoratives SVG, aria-hidden, focusable=false,
viewBox 0 0 48 48, Klasse kauf-icon. Unbekannte IDs brauchen einen neutralen
Fallback. Kein Text, keine externen Dateien/Fonts, keine Animation, keine
Rasterbilder oder externen Bilddienste. Flächige, matte Sportmagazin-Optik,
warme Papierfarbe mit wenigen gedeckten Akzenten. Bei 32/48/64 px erkennbar.
Keine identischen generischen Gebäude für alle Kategorien.

20 Motive, ihre IDs sind verbindlich:
- akademie.plaetze, akademie.scouting, akademie.internat, akademie.medizin,
  akademie.lehre, akademie.buehne, akademie.mental, akademie.analyse,
  akademie.netzwerk
- verein.stadion, verein.gastro, verein.sortiment, verein.reichweite,
  verein.training, verein.medizin
- vermoegen.wohnen, vermoegen.fahrzeug, vermoegen.umfeld,
  vermoegen.geschaeft, vermoegen.vermaechtnis

Die fünf Vermögensmotive dienen zunächst als Kategorien; keine 25 Einzelbilder
auf Vorrat. SVG-Geometrie selbst erstellen, ohne kostenpflichtige Bildgenerierung.
Sichtprüfung auf dunklem Spielhintergrund und allen drei Größen dokumentieren.

## KAUF-02 · Verständliche Texte (Lemming 2)

Änderungsbereich: neue `kauf-texte.js`, eigener Bericht
`pruefberichte/kauf-02.md`. Keine App-Anbindung; das übernimmt Astra.
Export `KAUF_TEXTE`, ein Objekt mit Schlüsseln `<bereich>.<bestehende-id>`.
Bereiche: akademie, verein, vermoegen, investition. Jede Zeile enthält
`{titel, kurz, details, quelle}`. titel möglichst bis 24 Zeichen, kurz möglichst
bis 55 Zeichen, details höchstens zwei kurze Sätze; Verständlichkeit hat Vorrang.
quelle nennt Datei und Funktion/Katalog, damit Aussagen überprüfbar bleiben.
Keine gespeicherten IDs verändern. Preise, Stufen, verfügbare Guthaben und
individuelle Sperrgründe sind dynamisch und gehören nicht als Zahlenkopie in Texte.

Umfang: alle neun ABTEILUNGEN aus akademie.js, sechs AUSBAU-Einträge aus
vereinswirtschaft.js, SHOP und INVEST aus App.jsx. Tatsächliche Kauf- und
Saisonhandler lesen, nicht nur bisherige Beschreibungen abschreiben. Wiederkehrende
Kosten/Risiken/Voraussetzungen dort benennen, wo sie wirklich gelten. Keine
Ertragsgarantie oder erfundene Prozentwerte. Unklare Wirkung im Bericht markieren.

## KAUF-03 · Unabhängige Bedienprüfung (Lemming 3)

Änderungsbereich: `tools/browser/kauf-abnahme.spec.js`,
`pruefberichte/kauf-03.md`; keine Produktdateien ändern.
Pilot selbst prüfen; spätere Icons/Texte erst nach ihrer Integration durch Astra
erneut prüfen. Nicht auf andere offene PRs oder unveröffentlichte Dateien bauen.

Prüfumfang: 320/390 px, Desktop, kurze Bildschirmhöhe, höchste Anzeigegröße,
Ruhemodus, Tastatur/Fokus/Tab/Escape/Zurück, Scrollposition nach Schließen,
knappes/exaktes Guthaben, Maximalstufe, schnelles Doppeltippen, Kauf erst nach
Bestätigung, erneutes Laden, fehlgeschlagene und verzögerte Speicherung.
Fehlerfälle nur im isolierten Prüfstand simulieren. Keine produktiven Daten löschen.
Prüfen, ob Nutzen, Preis, nächste Stufe und gesperrter Zustand verständlich sind.
Screenshots öffnen und bewerten; fehlenden echten Android-Test ausdrücklich nennen.
Befunde mit Schritten, Soll/Ist, Breite, Schwere und betroffener Datei liefern.
Keine bestehenden Tests abschwächen oder ohne Grund duplizieren.

## Arbeitsfolge

Lemming 1 und 2 können parallel starten. Lemming 3 kann den Pilot sofort prüfen;
sein Abschlusscheck erfolgt nach Astra-Integration von 1 und 2. Jeder liefert
einen eigenen Bericht statt parallel ENTWICKLUNG/CHANGELOG zu verändern. Astra
übernimmt die gemeinsamen Vermerke bei Integration. Pro Paket ein PR und danach
anhalten. README/AGENTS/LEMMING bleiben verbindlich; dieser Plan grenzt Dateien ab.
