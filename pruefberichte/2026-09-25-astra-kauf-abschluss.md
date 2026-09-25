# 35.198.0 · Kaufoberflächen: Integration und Abschlussprüfung

Basis: Kaufpilot d20f78f43365d6942769a0a2f03df9330598ae28 und
main 6e77432bec6eb0a6c9277c2afd34fb366e28ea0e (35.197.0).
Rolle: Astra. Auftrag: Kaufarbeit und relevante offene Repo-Punkte abschließen.

## Entscheidungen

- KAUF-01 (#55, bc71be5): angenommen; 20 eigene SVG-Motive und neutraler Fallback.
- KAUF-02 (#56, e5d88e0): angenommen; alle 45 Texte an ihre Oberflächen angebunden.
- KAUF-03 (#59, 0846eba): unabhängige Pilotprüfung angenommen. Fokusbindung und
  schmaler Titelumbruch bereits in d20f78f behoben. Testdatei unverändert erhalten.
- Pilot-PR #53 wird als reguläre Version integriert, nach erfolgreichen CI-Gates.
- Musik, Goldkarten und Rekordbuch aus Main bleiben erhalten.

## Umsetzung und fachliche Korrekturen

Gemeinsame Kaufkacheln in Akademie, Vermögen/Anlagen sowie Vereinsausbau/VC-Extras.
Antippen erklärt nur; die separate Bestätigung bucht. KaufVorgang sperrt parallele
Betätigungen und Schließen während der Buchung. Erfolg wird nur bei true nach
abgeschlossener Speicherung angezeigt. Vorhandene und gesperrte Angebote bleiben
für ihre Erklärung zugänglich. KaufDetail behält Fokus, Escape/Zurück und Rückkehr
zum auslösenden Element. Optischer Druckzustand und zentrale Haptik bleiben aktiv.

Vermögenshandler prüfen echte Voraussetzungen, Besitz, Guthaben und Speedmodus.
Anlagen prüfen gültige ID, endlichen positiven Betrag, Mindestbetrag und Guthaben.
Käufe, Einzahlungen und Auflösungen verwenden bucheAenderung/datenErsetzen.
Der aktuelle Anteilspreis wird zentral berechnet, auch beim Verwalter/Speedkauf.
Der Verwalter vergleicht jährlichen Unterhalt mit Jahresgehalt, ohne Faktor zwölf.
Anlagen bieten nun ihren Mindestbetrag wirklich an; vorher lag die kleinste
Schaltfläche bei Staatsanleihen über dem angezeigten Minimum.

Unverändert: gespeicherte IDs, bestehendes Speicherformat, Preis- und Wirkungs-
kataloge, Audioverwaltung. Die Behebung der Unterhaltseinheit kann automatische
Käufe früher ermöglichen; dies ist die dokumentierte Korrektur des Einheitenfehlers.

## Prüfung

- 249/249 Regressionen bestanden; Produktionsbuild und Capacitor-Sync erfolgreich.
- Vier neue Logikfälle prüfen echte Kauf-/Anlagehandler: Voraussetzungen,
  ungültige Beträge/IDs, verzögerte/fehlgeschlagene Speicherung und Anteilspreis.
- 320-px-Sichtprüfung: Eigentumswohnung mit verständlichem Preis, 8 Tsd €/Jahr,
  separater Bestätigung; nach Kauf erscheint „Kauf gespeichert“, Besitz und
  Guthaben aktualisieren sich. Keine abgeschnittenen Inhalte im Dialog.
- 320-px-Vereinsprüfung: Stadionbau 50 → 46 Mio, zwei Saisons Bauzeit;
  Gründungskapital 1000 → 955 VC, weiterer Kauf gesperrt. Beide Zustände bleiben
  nach erneutem Laden erhalten.
- Neuer isolierter Vermögensprüfstand und vier Browserfälle: Bestätigung/Laden,
  Mindestanlage/Auflösung, Doppeltippen bei langsamem Speicher, Rollback bei Fehler.
- Bestehender Vereinswirtschaftstest folgt dem neuen Detaildialog und prüft
  weiterhin gespeicherten Stadionbau, Vereinskasse, Preis und Sponsor.
- Vollständige Browser-CI einschließlich unveränderter KAUF-03-Fälle ist Merge-Gate.

Eigene Transferprüfungen sind keine unabhängige Selbstabnahme. Die unabhängige
Lemming-3-Abnahme gilt für den dokumentierten Akademiepilot.

## Offene Übergaben und Grenzen

Die historischen Charakterbranches sind nach dem Gesamtbericht vom 23.09. bereits
übernommen/weiterentwickelt; kein erneutes Einspielen alter App-Gesamtstände.
App-Icon/Ladescreen sind durch #30/#28 ersetzt. claude/beta-35.193 bleibt ein
historischer Testzweig. claude/wirt-gehaltskurve wird weiterhin nicht übernommen:
die integrierte Wirtschaftskette verwendet bewusst Exponent 4 nach Sponsor-Anbindung.
Keine fremden Branches gelöscht.

Issue #3 bleibt der übergreifende Charakter-/Optiktracker. Ein Kaufabschluss
bedeutet keine vollständige Abnahme sämtlicher dortiger Qualitätsziele.
Physischer Android-Test, Haptikgefühl und Musik-/Unterbrechungstest bleiben bei
Kevin; sie werden mit der regulären APK durchgeführt. Keine Beta erforderlich.

## Korrektur nach Kevins Rückmeldung

Die erste Vermögensübertragung war zu lang. Kompakte Variante mit zwei Spalten
auf Smartphones und drei ab 440 px Rasterbreite: 30 kleine Kacheln statt
30 Textkarten untereinander. Sichtbar bleiben Symbol, Name, Preis und kurzer
Zustand; Wirkung und Unterhalt stehen im Detaildialog. Der bestehende Browsertest
prüft nun explizit zwei/drei Spalten und das Fehlen von Nutzen-/Doppeltexten.
249 Regressionen und Produktionsbuild nach dieser Korrektur erfolgreich.
