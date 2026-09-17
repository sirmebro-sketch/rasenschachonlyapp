# CHAR-P1-03 – Frisurenvielfalt, erste Ausbaurunde

Datum: 17.09.2026  
Bearbeiter: **ChatGPT/Codex**  
Basis: `a96660f2a85a1a17c8b786aeeb7889f8e75f676e` (`main`)  
Arbeitsbranch: `codex/char-p1-03-frisurenvielfalt`  
Pull Request: #5  
Paket: `CHAR-P1-03`

> **Wichtig für Astra-Endkontrolle:** Diese Runde ist technisch geprüft und kann integriert werden, gilt aber bewusst **nicht als endgültige visuelle Produktabnahme des gesamten Pakets `CHAR-P1-03`**. Astra soll die vier neuen Formen und ihre Wirkung im Gesamtkatalog später noch einmal unabhängig beurteilen. Der Meta-Tracker bleibt deshalb für `CHAR-P1-03` offen.

## Ziel dieser Teilrunde

Den Frisurenkatalog nicht nur zahlenmäßig, sondern um vier klar andere Kategorien verbreitern, ohne bestehende gespeicherte Frisur-IDs zu verändern oder historische Freischaltungen umzubelegen.

## Änderungen

- `portraet.js`
  - neue Frisuren ausschließlich hinten angehängt;
  - bestehende IDs bleiben unverändert;
  - neue sichtbare Namen ergänzt;
  - Bonusbereich von sechs auf zehn neue Varianten erweitert.
- `haarformen.jsx`
  - vier neue Kategorien im echten modernen Renderer ergänzt:
    - **Lange Locs**,
    - **Irokesenschnitt**,
    - **Schulterlang glatt**,
    - **Flechtkranz**;
  - benötigte Vorder-/Hinterformen ergänzt;
  - keine Alt-ID neu belegt.
- `tools/portraet.test.cjs`
  - append-only-ID-Vertrag, neue End-IDs, Würfeln und Namen erweitert.
- `tools/browser/frisuren.spec.js`
  - eigener sichtbarer Browsercheck für beide Geschlechter;
  - drei Referenzköpfe je Variante;
  - Screenshots der vollständigen Frisurenbögen.

## Neue gespeicherte IDs

| Auswahl | bestehender Bonusbereich | neue IDs dieser Runde |
|---|---:|---:|
| Mann | 16–21 | **22–25** |
| Frau | 14–19 | **20–23** |

Zuordnung in beiden Auswahlen in derselben Reihenfolge:

1. Lange Locs
2. Irokesenschnitt
3. Schulterlang glatt
4. Flechtkranz

Die Lücken zwischen Basis- und Bonusbereich bleiben bewusst erhalten; sie sind Teil des bestehenden Speichervertrags und werden nicht „aufgeräumt“.

## Automatischer Nachweis vor diesem Dokumentationscommit

Geprüfter Code-Head vor dem reinen Dokumentationscommit: `c668f48e41dd3edbbce4ca6f34ffe9d28941aa05`.

### Spielregressionen / Build

GitHub Actions Run `35239255491`: **erfolgreich**.

- `npm test`: **113/113 bestanden**;
- darunter die neuen Frisuren-/ID-Prüfungen;
- `npm run build`: **erfolgreich**.

Nicht blockierende bekannte Hinweise im Lauf:

- React-SSR-Warnungen zu `useLayoutEffect` in vorhandenen Renderregressionen;
- Vite-Hinweis auf einen großen Hauptchunk;
- GitHub-Actions-Hinweis auf die Node-20-Abkündigung einzelner Actions.

Keiner dieser Hinweise wurde durch diese Frisurenrunde eingeführt oder verursachte einen Fehlschlag.

### Browserprüfung

GitHub Actions Run `35239255532`: **erfolgreich**.

- Playwright: **23 bestanden, 4 planmäßig übersprungen**;
- neuer `CHAR-P1-03`-Test auf `desktop` erfolgreich;
- vorhandene responsive Charaktergalerie weiterhin auf `handy`, `schmal` und `desktop` erfolgreich;
- vorhandene `CHAR-P0-02`-Porträtidentitätskette weiterhin in allen drei Projekten erfolgreich;
- Browserartefakt `Rasenschach-Browsertest`, Artifact-ID `10504019513`;
- Artefakt-SHA-256: `be4acb48bd0e5aeac885fdc4812dba3e2f732f30c30e3e47b006ede7785900b2`.

## Manuelle Sichtprüfung durch ChatGPT/Codex

Die beiden erzeugten Vollbögen `frisuren-m.png` und `frisuren-w.png` wurden aus dem CI-Artefakt geöffnet und zusätzlich im Bereich der neuen Varianten vergrößert betrachtet.

Befund:

- **Lange Locs:** neue lange Seiten-/Hinter-Silhouette, klar vom bisherigen Kurzhaar-/Lockenfeld getrennt; bei hellen, mittleren und dunklen Referenzen keine offene Hautspalte erkannt.
- **Irokesenschnitt:** stärkste neue Silhouette dieser Runde; auch in kleiner Darstellung sofort unterscheidbar.
- **Schulterlang glatt:** deutlich längere, glatte Kontur als bestehende Kurz-/Bobvarianten; bewusst weniger extravagant, aber als eigene Längenkategorie erkennbar.
- **Flechtkranz:** zurückgenommene Hoch-/Kranzsilhouette mit sichtbarer Flechtstruktur; subtiler als Irokesenschnitt/Locs, aber im Bogen eigenständig.
- Keine offensichtlich abgeschnittenen Kopf-/Haarbereiche, keine sichtbaren offenen Scheitelkeile und keine Überläufe aus dem Porträtbereich festgestellt.

## Was ausdrücklich **nicht** behauptet wird

- Kein Android-Gerätetest in dieser Runde.
- Keine endgültige Aussage, dass der Frisurenkatalog damit bereits ausreichend vielfältig ist.
- Keine endgültige ästhetische Freigabe durch Kevin oder Astra.
- `CHAR-P1-03` wird im Meta-Issue **noch nicht als erledigt** markiert.

## Astra-Prüfliste

Bei der späteren Endkontrolle bitte insbesondere prüfen:

1. Ob **Lange Locs** in 72–96 px eher wie Locs als nur wie lange gerade Strähnen gelesen werden; falls zu glatt, Textur/Segmentierung nachschärfen.
2. Ob **Flechtkranz** klein genug sichtbar bleibt oder im Gesamtkatalog zu nah an Hochsteck-/Knotenformen liegt.
3. Schulterlang glatt gegen vorhandene weibliche `Lang offen`/`Lang mit Scheitel` und männliche `Mittelscheitel mit Fall` ohne Beschriftung vergleichen.
4. Alle vier neuen Formen auf mehreren Kopfbreiten und mit sehr dunkler sowie sehr heller Haarfarbe prüfen.
5. Falls eine Form nachgeschärft wird: **IDs 22–25 (m) bzw. 20–23 (w) nicht ändern**; nur Geometrie derselben ID korrigieren oder weitere Varianten hinten anhängen.

## Status

**Technischer Teilstand zur Integration bereit.**  
**Astra-Endkontrolle: ausstehend.**  
**Gesamtpaket `CHAR-P1-03`: weiterhin offen.**
