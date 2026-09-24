# Astra: Integration KAUF-01 und KAUF-02

24.09.2026. Pilotbasis 6e40ce1, angenommene Köpfe bc71be5 (#55) und e5d88e0
(#56), Mainbasis 62d3f68. Kein Release; unabhängige KAUF-03-Abnahme steht aus.

## Ergebnis

20 eigenständige SVG-Motive plus Fallback und 45 nach Spielquellen beschriebene
Einträge übernommen. Neun Akademietexte sind in Kacheln und Details eingebunden.
Weitere Texte/Motive sind vorbereitet; Vermögen und Profimannschaft werden erst
nach der gemeinsamen Abnahme umgestellt. Keine Kaufmechanik dieser Bereiche geändert.

Kleine Astra-Korrekturen: Reichweitenpfad um 3 Pixel eingerückt, damit der Strich
nicht am SVG-Rand abgeschnitten wird; „Peak“ als „Spitzenstärke“ formuliert.
Testselektoren an Trainingsplätze angepasst, Nutzenzeile mitgeprüft. Der isolierte
Akademie-Prüfstand verwendet ein Kalenderjahr statt true als Gründungsjahr.
Mainkonflikte in App und Entwicklungslog aufgelöst: speichersicherer Pilotdialog
und aktuelle Musikhandler bleiben beide erhalten.

## Prüfungen

- 240/240 Regressionen, Produktionsbuild, Icon- und Spieltest-Vorschau erfolgreich.
- SVG-Blatt auf dunklem Hintergrund bei 32/48/64 px geöffnet und angesehen:
  Motive unterscheidbar, ruhige gemeinsame Farbgebung, Fallback vorhanden.
- Browser mit 390×844 und 320×720: Kacheltext lesbar, Detaildialog vollständig
  erreichbar, Preis und nächste Stufe getrennt benannt.
- Öffnen kostet nichts. Bestätigter Trainingsplatzausbau 1→2: 16→0 VC,
  Speicherbestätigung, nächster Kauf bei 30 VC deaktiviert.
- Akademiewirkungen mit Aufnahme-, Entwicklungs-, Abbruch-, Verletzungs-,
  Profi- und Turnierberechnung verglichen; keine unzutreffenden Garantien gefunden.

Keine behauptete unabhängige Abnahme der eigenen Integration und kein echter
Android-Test. GitHub-CI wird am veröffentlichten Pilotkopf kontrolliert.
Lemming 3 prüft insbesondere Speicherfehler/-verzögerung, Doppelkauf, Fokus,
Zurück, Laden und die übrigen Größen/Zustände nach KAUF-UI-ARBEITSPLAN.md.

## Zurückgestellt

Die von Lemming 2 beschriebenen Altprobleme bei Vermögenskäufen bleiben mit
pruefberichte/kauf-02.md für die spätere Übertragung dokumentiert.
Goldkarten #57 und Rekorde #58 sind ausdrücklich nicht Bestandteil dieser Runde.
