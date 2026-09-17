# CHAR-P0-02 – Porträt-Identitätskette

Datum: 17.09.2026  
Basis: `8e4eeec5c57d86b3cb3805a1a38d75c30509bb06`  
Arbeitsbranch: `codex/char-p0-02-identitaet`  
Paket: `CHAR-P0-02`

## Ziel

Die Porträtidentität muss von der aktiven Karriere über Ruhmeshalle und Sammelkarte bis in den Vereinskader erhalten bleiben. Alte Karten ohne eingebettetes Porträt dürfen nur über belastbare historische Identität ergänzt werden; bloße Namensgleichheit darf kein Gesicht erfinden.

## Umsetzung

- Neuer eigenständiger Regressionstest `tools/portraet-identitaet.test.cjs`.
- Der Test nutzt den echten Abschluss-Handler aus `App.jsx` und prüft für Mann und Frau:
  - Karriere → Ruhmeshalle,
  - Ruhmeshalle → Sammelkarte,
  - Sammelkarte → Vereinskader,
  - Kader → erneut erzeugte Karte.
- Zusätzlich wird der bestehende Altstand-Abgleich geprüft: Hallen-ID bzw. historischer Karrierebezug darf ein fehlendes Porträt ergänzen; ein gleichnamiger fremder Eintrag nicht.
- `tools/spieltest.cjs` besitzt jetzt die isolierte Ansicht **Porträtkette**. Dort wird dasselbe gespeicherte Gesicht über vier echte Renderwege nebeneinander gezeigt: Karriere-Avatar, Ruhmeshalle, `Spielerkarte`, `Elfkarte`.
- `tools/browser/charakter.spec.js` öffnet diese Ansicht in allen drei Playwright-Projekten, prüft vier vorhandene Porträts, keine JS-Fehler und legt einen Screenshot ab.
- Der Browserartefakt-Workflow nimmt nun auch `.preview/spieltest.html` auf.

## Befund aus der Vorabprüfung

Der erste Entwurf war absichtlich strenger als nötig und wurde von CI zurückgewiesen. Zwei Annahmen wurden daraufhin korrigiert, ohne Produktionscode zu verändern:

1. Die Ruhmeshalle muss nicht zwingend eine andere JavaScript-Objektreferenz als das temporäre Karriereobjekt halten. Der fachliche Vertrag ist identischer Inhalt; der Abschluss arbeitet bereits auf einem Klon.
2. Ein bytegleicher SVG-Fingerabdruck aller vier Oberflächen ist kein sinnvoller Identitätsvertrag. `Spielerkarte` und insbesondere `Elfkarte` dürfen größen-/kontextspezifische SVG-Darstellung besitzen. Maßgeblich sind dieselben gespeicherten Gesichtsmerkmale und die sichtbare Wiedererkennbarkeit.

Der fehlgeschlagene Browser-Screenshot wurde manuell angesehen: Kopfform, Haut, Frisur, Augen, Gesichtszüge, Schmuck und Make-up waren über alle vier Stufen sichtbar gleich; die Differenz kam aus dem Darstellungsrahmen des Kader-Avatars.

## Nachweis

Finaler geprüfter Head: `1968bcddf3ec7b3c7258aa53a0080216d352cd5b`

### Spielregressionen

GitHub Actions Run `35225009646`: **erfolgreich**.

- `npm test`: **112/112 bestanden**.
- Darin neu erfolgreich:
  - `CHAR-P0-02: Karriere → Halle → Karte → Kader behält das Porträt (m)`
  - `CHAR-P0-02: Karriere → Halle → Karte → Kader behält das Porträt (w)`
  - `CHAR-P0-02: Altstand ergänzt Porträt nur über historische Identität, nicht über gleichen Namen`
- `npm run build`: **erfolgreich**.

### Visuelle Browsertests

GitHub Actions Run `35225009888`: **erfolgreich**.

- Playwright: **22 bestanden, 2 planmäßig übersprungen**.
- Die Porträtketten-Prüfung bestand auf `handy`, `schmal` und `desktop`.
- Browserartefakt: `Rasenschach-Browsertest`, Artifact-ID `10498878495`.
- SHA-256 des Artefakts: `83b07f05e062fd7fcd949d45a21b513732ee76034d34134205fc1fa67ded2c29`.

## Abnahme

`CHAR-P0-02` erfüllt die vorgesehenen technischen Akzeptanzkriterien:

- automatisierte Regression der relevanten Übergänge vorhanden;
- beide Geschlechter abgedeckt;
- Altstand-Fall bleibt historien-/ID-basiert;
- kein Namens-Fallback eingeführt;
- sichtbarer Vier-Stufen-Vergleich im isolierten Spieltest vorhanden;
- finaler Regression-/Build-/Browserlauf auf demselben Head erfolgreich.

Grenze bleibt wie vorgesehen: Fehlt in einem historischen Stand jede belastbare Quelle für das frühere Porträt, wird kein Gesicht erfunden.

## Nächster sinnvoller Schritt

Auf Basis von `CHAR-P0-01` und der nun geschützten Identitätskette kann die eigentliche sichtbare Erweiterung beginnen. Priorität laut Arbeitsplan: `CHAR-P1-01` Kopfformen stärker differenzieren, anschließend Gesichtszüge/Frisuren/Bärte. Bestehende gespeicherte Indizes bleiben dabei unverändert; neue Formen append-only.
