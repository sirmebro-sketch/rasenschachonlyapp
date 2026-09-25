# KAUF-01 – Illustrationen für Kauf- und Ausbaukacheln

Stand: 24.09.2026  
Rolle: Lemming 1  
Arbeitsbranch: `lemming/kauf-01-illustrationen`  
Basisbranch: `astra/kaufkacheln-pilot`  
Exakter Basiscommit: `6e40ce1a74ccf71ce1ddf9a7397da61fffe6a8d8`  
Paketversion der Basis: `35.195.2`

## Auftrag und Abgrenzung

Ersetzt wurden ausschließlich die provisorischen Motive in `kauf-icons.jsx`. Ergänzt
wurden das paketbezogene Vorschauwerkzeug `tools/kauf-icons-vorschau.cjs` und dieser
Prüfbericht. `App.jsx`, `kauf-ui.jsx`, Preise, Spielregeln, Speicherlogik und Version
wurden nicht verändert.

Die Schnittstelle bleibt `KaufIcon({id})` mit `className="kauf-icon"`,
`viewBox="0 0 48 48"`, `aria-hidden="true"` und `focusable="false"`. Unbekannte IDs
verwenden einen neutralen geometrischen Fallback. Es gibt keine Animationen,
eingebetteten Texte in den Produkt-SVGs, externen Bilder, Fonts oder Bilddienste.

## Motive

Umgesetzt sind alle 20 verbindlichen IDs:

- Akademie: `akademie.plaetze`, `akademie.scouting`, `akademie.internat`,
  `akademie.medizin`, `akademie.lehre`, `akademie.buehne`, `akademie.mental`,
  `akademie.analyse`, `akademie.netzwerk`.
- Verein: `verein.stadion`, `verein.gastro`, `verein.sortiment`,
  `verein.reichweite`, `verein.training`, `verein.medizin`.
- Vermögen: `vermoegen.wohnen`, `vermoegen.fahrzeug`, `vermoegen.umfeld`,
  `vermoegen.geschaeft`, `vermoegen.vermaechtnis`.

Die Silhouetten sind absichtlich nicht als einheitliche Gebäudereihe aufgebaut:
Spielfeld, Fernglas, Etagenbett, Medizinkoffer, Buch, Podium, Kopf/mentale Marker,
Analysetafel und Netzwerk bilden die Akademie; Stadion, Servierhaube, Trikot,
Megafon, Trainingskegel/Ball und Behandlungsliege den Verein; Haus, Fahrzeug,
soziales Umfeld, Laden und Vermächtnis-Monument die Vermögenskategorien.

Die Grundzeichnung übernimmt die warme Papierfarbe über `currentColor` aus der
bestehenden `.kauf-icon`-Gestaltung. Drei matte, gedeckte Flächenakzente
(Salbei, Terrakotta, Ocker) strukturieren Motive sparsam.

## Tatsächlich ausgeführte Prüfungen

- `node --check tools/kauf-icons-vorschau.cjs` – erfolgreich.
- Statischer Vertragscheck – erfolgreich: exakt 20 verbindliche IDs plus Fallback;
  die geforderte `KaufIcon`-Schnittstelle ist vorhanden; keine `<text>`,
  `<image>`- oder `<animate>`-Elemente im Produkt-SVG.
- `node tools/kauf-icons-vorschau.cjs` – erfolgreich; erzeugt aus exakt demselben
  Datenblock wie `KaufIcon` eine HTML- und eine SVG-Vorschau mit
  `20 Motive + Fallback × 3 Groessen`.
- Die erzeugte SVG-Vorschau wurde auf dem dunklen Spielhintergrund `#070D0A`
  rasterisiert und geöffnet. Geprüft wurden für jedes Motiv 32, 48 und 64 px.
- Sichtbefund nach Korrekturrunde: alle 20 Motive und der neutrale Fallback bleiben
  in allen drei Größen voneinander unterscheidbar. Besonders ähnliche Themen wurden
  bewusst getrennt: Akademie-Medizin = Koffer/Kreuz, Vereinsmedizin =
  Behandlungsliege/Herzlinie; Internat = Etagenbett, Wohnen = Haus; Bühne =
  Podium/Stern, Vermächtnis = Monument/Lorbeer.
- Beim ersten Sichtdurchgang wirkte `akademie.mental` in kleiner Größe zu stark wie
  ein Medaillen-/Zielsymbol. Es wurde vor dem Branch-Commit zu einer klaren
  Kopfkontur mit drei mentalen Markern umgebaut und erneut bei 32/48/64 px geöffnet.
- Ein zusätzlicher lokaler Chromium-Screenshot der HTML-Vorschau wurde versucht,
  konnte in der verfügbaren Containerumgebung wegen eines Headless-/D-Bus-Timeouts
  nicht erzeugt werden. Dieser Fehlversuch wird nicht als Browserprüfung gewertet.

## Repository-Prüfungen

Auf dem Produktcode-Head `51166e8016bf3f02b4c26df51f442049319b11fe`
wurden die PR-Workflows tatsächlich ausgeführt:

- **Spielregressionen**, Run `35967734589`: `npm ci --no-audit --no-fund`,
  `npm test` und `npm run build` erfolgreich. Node-Testausgabe:
  **237 Tests, 237 bestanden, 0 fehlgeschlagen**. Vite 6.4.3 erzeugte den
  Produktionsbuild erfolgreich.
- **Visuelle Browsertests**, Run `35967734601`: Chromium-Installation,
  `npm run preview:gallery` und `npm run test:browser` erfolgreich.
  Playwright meldete **80 bestanden, 31 übersprungen, 0 fehlgeschlagen**.
  Die Akademie-Kacheltests liefen dabei in den Projekten `handy`, `schmal`
  und `desktop` erfolgreich.

Dieser Bericht wird danach als reiner Dokumentationscommit ergänzt. Weil dadurch
ein neuer PR-Head entsteht, muss CI auch diesen finalen Head noch bestätigen; das
Ergebnis wird am PR-Status geprüft, ohne für eine reine Statuszeile eine endlose
Folge weiterer Dokumentationscommits zu erzeugen.

## Offene Grenzen

- Keine Android-Geräteprüfung in diesem Paket; Browser-/Build-Erfolg wird nicht als
  Gerätetest bezeichnet.
- Die 32/48/64-Sichtprüfung belegt Lesbarkeit und Unterscheidbarkeit der Motive auf
  dunklem Hintergrund, nicht die abschließende gestalterische Astra-Abnahme.
- Integration in weitere Kaufbereiche bleibt bei Astra; dieses Paket ändert keine
  Kaufhandler oder Kachellogik.

Status: umgesetzt; zur Astra-Abnahme nach grüner CI des finalen PR-Heads, noch nicht integriert.
