# Astra-Abnahme · 23.09.2026 · 35.195.0

Basis: main `703d377e8eaa7932b6f5fed62ca313807ad16486` (35.194.1).
Auftrag: alle wartenden Beiträge prüfen, zusammenführen und nötige Korrekturen vornehmen.

## Entscheidungen zu den offenen PRs

Die folgenden 26 Beiträge sind im gemeinsamen Prüfstand integriert. Die technische
Abnahme bezieht sich auf diesen kombinierten Stand. Android-spezifische Sicht-/Hör-
und Leistungstests bleiben offen; eine vollständige Geräteabnahme wird nicht behauptet.

| PR | übernommener Head | Beitrag | Entscheidung |
|---|---|---|---|
| #6 | `0592d8082699` | Vereinswirtschaft: Geld statt VC, Vereinsführung, Spielergehälter | Übernommen; siehe Prüfung unten |
| #7 | `cb27be623be0` | Prüfstand von Hand startbar: workflow_dispatch in regression.yml | Übernommen; siehe Prüfung unten |
| #9 | `8d09a8a9aa7f` | WIRT-P0-02: Wirtschaft an den Spielablauf angeschlossen | Übernommen; siehe Prüfung unten |
| #11 | `7376a3756a6a` | WIRT-P0-03: Ausbau kostet Geld, VC nur noch vier Extras | Übernommen; siehe Prüfung unten |
| #13 | `34a04c76db5c` | WIRT-P0-04: Sponsorenwahl — und eine Korrektur an der eigenen Messung | Übernommen; siehe Prüfung unten |
| #15 | `6b3dbbab8f36` | WIRT-P1-01: Die Saisonabrechnung wird sichtbar | Übernommen; siehe Prüfung unten |
| #16 | `060a225f8193` | WIRT-P1-05: Die Restkasse zählt beim Abschluss | Übernommen; siehe Prüfung unten |
| #27 | `c23c094f153d` | CHAR-FIX-05: Männerfrisur 27 „Lange Locken“ | Übernommen; siehe Prüfung unten |
| #28 | `74a3a264ff5a` | Magazin-Startbild hochauflösend + zentrierter Ladering + Beta-APK | Übernommen; Geräteprüfung offen |
| #29 | `f86ad78fe51d` | WIRT-P1-04: Lizenzauflage — eine leere Kasse kostet Punkte | Übernommen; siehe Prüfung unten |
| #30 | `4107548e0222` | Neues vollflächiges App-Icon + getrennte Beta | Übernommen; Geräteprüfung offen |
| #31 | `4aa1bf62a0af` | CARD-P0-02: Packkontur bei 320/390 px absichern | Übernommen; Geräteprüfung offen |
| #32 | `40a1510b656d` | OPTIK-P2-01: Lesbarkeitsprüfung der Spielerkarten | Übernommen; siehe Prüfung unten |
| #33 | `9e46e696c930` | OPTIK-P0-01: Pack-Ruhemodi im Browser absichern | Übernommen; Geräteprüfung offen |
| #34 | `f44bbced2bdb` | „Bekannte Adresse" bekommt einen Leser — ein Placebo für 350 Punkte | Übernommen; siehe Prüfung unten |
| #35 | `2a483b178fba` | WIRT-P1-04b: Lizenzentzug — drei Saisons ohne Lizenz kosten die Liga | Übernommen; siehe Prüfung unten |
| #36 | `02dade36109d` | WIRT-P0-05-UI: Preise, Rechtsform und Vorstandsziel bekommen eine Oberfläche | Übernommen; siehe Prüfung unten |
| #37 | `491d52c6824f` | WIRT-P1-02: Stadion sichtbar machen, ausverkauftes Haus als Ereignis | Übernommen; siehe Prüfung unten |
| #38 | `4dbda20b141f` | CHAR-P1-05: Wischhinweis für mobile Charakter-Kategorien | Übernommen; siehe Prüfung unten |
| #39 | `a4ba0aaa4313` | WILD-P0-01: mobile Wildcard-Aufdeckung absichern | Übernommen; Geräteprüfung offen |
| #40 | `11d1669b6300` | docs: Astra-Abnahme-Wegweiser für fünf Lemming-Pakete | Übernommen; siehe Prüfung unten |
| #41 | `376508d3290f` | QA: lange Namen bei 320/390 px dokumentieren | Übernommen; siehe Prüfung unten |
| #42 | `d5bb34193e40` | QA: Erststart und Leerzustände bei 320/390 px | Übernommen; siehe Prüfung unten |
| #43 | `4bef1ef4a3e6` | QA: Namenseingaben, Fokus und Rückwege bei 320/390 px | Übernommen; siehe Prüfung unten |
| #44 | `8ea32da7e734` | docs: sichtbare Charaktertexte prüfen | Übernommen; siehe Prüfung unten |
| #45 | `145ead311c11` | Sol: stimmige Spielklänge für UI, Karriere und Karten | Übernommen; Geräteprüfung offen |

## Eigene Korrekturen

- Gold-/Legendenkarten: Folie überstrahlte kleine Informationen. Dunkler Informationsgrund,
  hellere und größere Sekundärtexte; Folie und Porträt bleiben sichtbar. Im Browser nachgesehen.
- Spielerpass: auf schmalen Displays stehen Porträt und Stärke über den Passdaten.
  Namen und Vereinsangaben bekommen die gesamte Kartenbreite statt einer engen Mittelspalte.
- Charaktererstellung: lange Namen umbrechen; bei niedriger Bildschirmhöhe sind
  Vorschau und Abschlussleiste nicht mehr angeheftet und verdecken keine Namenseingabe.
- Hinweise präzisiert: Wunschverein maximal drei bedingte Angebote, Porträt versus Statur,
  Namensvorschläge nach Nation/Geschlecht, Rückennummer, fehlende Jugendvereine.
- Nicht gegründete Akademie: Handlungsweg zur Gründung statt sinnlosem Jahres-Wartehinweis.
- Klang: bereits laufende Klänge stoppen beim Wechsel in den Hintergrund;
  Lautstärkeänderungen wirken auch auf laufende Klänge. Kein automatisches Wiederanlaufen.
- Startbild: exakt dieselben WebP-Bilddaten als eine lokale Datei statt 16 blockierenden
  Base64-Skripten. Integrität, Abmessungen und Mindestanzeigedauer bleiben getestet.
- Teststand: eigener isolierter Prüfverein für Ausbau, Preise, Sponsoren und Speicherung.
- Unbelegte Gleichsetzung der Lizenzstrafen mit echten Verbandsregeln durch datierten
  Zusatz klargestellt: vereinfachte Spielregel, keine Rechtsauskunft.

## Prüfungen und Grenzen

- `npm test`: 236/236 erfolgreich auf dem zusammengeführten Stand mit Klangkorrektur.
- `node tools/langzeit.cjs`: 192 Karrieren, 4.527 Saisons, 7.902 Ereignisse ohne Abbruch.
  Feste Strategien/Seeds, keine repräsentative Spieler- oder Vereinswirtschaftsprognose.
- `npm run build` und `npx cap sync android`: erfolgreich. Bestehende Warnung zum großen
  Hauptbundle bleibt; keine pauschale Aussage zur Android-Startleistung.
- Manuelle Browserprüfung: Kartenfolie/-lesbarkeit bei 390 px; Vereinsführung bei 320 px,
  Stadionbau 50 → 46 Mio, doppelte Buchung gesperrt, Preisänderung, Sponsorabschluss.
- Vollständige Browser-CI des Integrationsstands sowie erneutes Laden werden nachgezogen;
  der nachfolgende CI-Nachtrag dokumentiert den tatsächlichen Ausgang.
- Android offen: Launcher-Masken, Startbild/Übergang, Audio-Hörtest mit Unterbrechung,
  Gold-/Legendenpacks, Wildcard-Aufdeckung und reale Touch-/Effektleistung.
- Wirtschaftsbalancing: vorhandene Rechen-/Saison-/Lizenzregressionen bestanden.
  Langfristiges Spielgefühl und alle Länder-/Kaderkombinationen sind damit nicht abgenommen.

## Übrige Remote-Branches

`chatgpt/char-*`, `codex/char-*` und `codex/qualitaetsabnahme-35.194.1` sind historische,
bereits durch spätere Hauptbranch-Stände übernommene/weiterentwickelte Übergaben.
Kein erneutes Einspielen alter Gesamtstände. Die vorhandenen Einzelberichte bleiben gültig
als historische Evidenz, nicht als neue Prüfung dieses Integrationsstands.

`lemming/appicon-fullbleed` ist durch #30, `lemming/startscreen-ladescreen` durch #28 ersetzt.
`claude/beta-35.193` bleibt historischer Testzweig; Produktions-App-ID und Teststeuerungen
werden daraus nicht übernommen. `claude/wirt-gehaltskurve` wird in dieser Runde nicht
übernommen: Die nachfolgende Wirtschaftskette behält bewusst Exponent 4 nach Anbindung
der Sponsoreneinnahmen. Eine erneute Exponentänderung ohne Vergleichslauf wäre eine neue
Balanceentscheidung. Kein kommentarloses Liegenlassen, keine Löschung fremder Branches.

## Zusammenführung

Die Wirtschaftsfolge wurde über den Head von #37 einschließlich ihrer Vorgänger integriert.
Konflikte in Entwicklungsvermerken/Changelog behalten beide Geschichten; README behält die
aktuelle Astra-/Lemming-Rollenteilung. Im Regressionstest wurden angrenzende Testblöcke
korrekt getrennt. Alle Beiträge werden über ihre Head-Commits als Vorfahren erhalten.

## Nachprüfung vor CI-Abschluss

Die manuelle Wiederladeprüfung bestätigt 46 Mio Vereinskasse, laufenden Stadionbau und
102 % Eintrittspreis. Lange Locken wurden im echten Browser bei 72/96/145 px in hellen
und dunklen Kontexten angesehen; Augen und Brauen liegen frei auf der Gesichtsfläche.
Die Preisoberfläche meldete bei normalen Gastro-/Fanartikelpreisen fälschlich einen
Stimmungsschaden, obwohl der Kern Normalpreise schützt. Der Hinweis folgt jetzt dieser
Grenze; eine Regression prüft Normal- und überhöhte Preise. 236/236 Tests erneut grün.

## Abschließende mobile Korrektur

Die ersten beiden kombinierten Browserläufe hatten ausschließlich drei Fehler im neuen
Test für geringe Höhe (je Bildschirmprojekt); 64 Prüfungen bestanden, 29 wurden gemäß
bestehender Projektfilter übersprungen. Das Umbruchwachstum der Namensvorschau schob das
fokussierte Feld unter den unteren Rand. Die Erstellung hält es nun nach einer
Namensänderung im sichtbaren Bereich, solange es fokussiert ist und die Höhe maximal
540 px beträgt. Der Test prüft vollständige Sichtbarkeit und freie Trefffläche nach
dem Render ohne erneutes Antippen. Die erste Testeingabe wurde außerdem auf die echte
22-Zeichen-Grenze begrenzt. Finaler CI-Ausgang folgt im Nachtrag.
