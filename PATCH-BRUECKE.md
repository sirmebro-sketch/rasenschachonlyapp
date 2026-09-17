# Rasenschach XI – sichere Patch-Brücke

Die Patch-Brücke ist der bevorzugte Weg, wenn eine gezielte Änderung an einer großen oder konfliktanfälligen Textdatei (insbesondere `App.jsx`) vorgenommen werden soll, aber die verwendete GitHub-/Connector-Umgebung keine sichere partielle Dateibearbeitung anbietet.

Sie ersetzt **nicht** Git, Review oder visuelle Abnahme. Sie verhindert vor allem, dass für eine kleine Änderung eine komplette alte Großdatei zurückgeschrieben und dabei parallele Arbeit überschrieben wird.

## Bestandteile

- Workflow: `.github/workflows/safe-patch.yml`
- Eingang: genau eine Datei `patches/inbox/*.patch`
- Ziel: derselbe Arbeitsbranch, auf dem der Patch eingecheckt wurde
- `main` und `master` sind als Ausführungsziel ausdrücklich gesperrt.

## Was die Brücke vor einer Änderung prüft

1. Es liegt genau **ein** Patch in `patches/inbox/`.
2. Keine Binärpatches.
3. Keine Symlink-Patches.
4. Keine absoluten Pfade und keine `../`-Pfadflucht.
5. Keine Änderungen an `.github/`, `patches/` oder `.git/` durch den eingereichten Patch.
6. `git apply --check --index --whitespace=error-all` muss erfolgreich sein.

Erst danach wird der Patch angewandt.

## Was nach dem Anwenden passiert

Der Workflow:

1. wendet den Patch mit `git apply --index --whitespace=error-all` an;
2. entfernt die eingereichte Patchdatei wieder aus dem Branch;
3. führt `git diff --cached --check` aus;
4. installiert reproduzierbar mit `npm ci`;
5. führt `npm test` aus;
6. führt `npm run build` aus;
7. committet nur bei vollständig erfolgreichem Lauf als `github-actions[bot]`;
8. pusht den geprüften Commit auf **denselben** Arbeitsbranch.

Schlägt ein Schritt fehl, wird kein geprüfter Spielcode-Commit erzeugt. Die Patchdatei bleibt dann zur Korrektur auf dem Branch liegen.

## Nutzung

### 1. Arbeitsbranch aktualisieren

Nie direkt auf `main` arbeiten. Vorher aktuellen `main` und offene Fremdarbeit prüfen und einen eigenen Branch von der richtigen Basis verwenden.

### 2. Unified Diff erzeugen

In einem normalen Checkout zum Beispiel:

```bash
git diff -- App.jsx tools/mein-test.test.cjs > patches/inbox/mein-paket.patch
```

Bei neu angelegten, noch nicht gestagten Dateien darauf achten, dass sie tatsächlich Bestandteil des Unified Diff sind. Alternativ den Patch bewusst mit `git diff --no-index`/einem geeigneten Patchwerkzeug erzeugen und vor dem Commit lesen.

### 3. Patch kontrollieren

Vor dem Push mindestens prüfen:

```bash
git apply --check --index patches/inbox/mein-paket.patch
```

Der Workflow wiederholt diese Prüfung unabhängig davon.

### 4. Genau eine Patchdatei committen und pushen

```bash
git add patches/inbox/mein-paket.patch
git commit -m "patch: queue mein-paket"
git push
```

Der Push startet `Safe patch bridge`.

### 5. Ergebnis prüfen

- Bei **grünem** Workflow liegt anschließend ein neuer Bot-Commit auf demselben Branch; die Patchdatei ist darin entfernt.
- Bei **rotem** Workflow zuerst den fehlgeschlagenen Schritt lesen. Nicht den Schutzmechanismus umgehen, nur damit ein Patch angewandt wird.

Danach gelten die normalen Projektregeln weiter: PR/Integration, passende Browser-/Sichtprüfung und – wenn erforderlich – Android-Prüfung.

## Wichtige Grenzen

- Die Brücke führt standardmäßig `npm test` und `npm run build` aus. Das ist **keine visuelle Abnahme**.
- Visuelle Änderungen müssen weiterhin mit den vorgesehenen Galerie-/Browserprüfungen und erforderlichen Sichtkontrollen geprüft werden.
- Android-spezifische Änderungen brauchen weiterhin die passenden Android-Gates.
- Pro Lauf ist absichtlich nur ein Patch erlaubt. Mehrere fachlich getrennte Änderungen gehören in getrennte, nachvollziehbare Schritte.
- Die Brücke darf ihre eigene Workflow-/Patch-Infrastruktur nicht über einen eingereichten Patch verändern.
- Wenn `main` seit der Branch-Erstellung weitergelaufen ist, vor Veröffentlichung neu abgleichen und betroffene Prüfungen wiederholen.

## Erster belegter Einsatz

Die Brücke wurde am 17.09.2026 mit `CHAR-FIX-02 – Hals/Kragen sauber maskieren` erstmals real eingesetzt. Ein formal fehlerhafter Patch wurde vor jeder Quelländerung gestoppt; der korrigierte Patch bestand anschließend Patchprüfung, Regressionen und Produktions-Build und wurde automatisiert als geprüfter Bot-Commit übernommen. Damit ist sowohl der Ablehnungs- als auch der Erfolgsweg praktisch belegt.
