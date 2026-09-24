// KAUF-02: belegte Kurztexte fuer Kauf- und Ausbauoberflaechen.
// Reine Datenquelle; Einbindung und Darstellung uebernimmt Astra.
export const KAUF_TEXTE = {
  "akademie.plaetze": {
    titel: "Trainingsplätze",
    kurz: "Erhöht Startstärke und jährliche Entwicklung.",
    details: "Bessere Plätze erhöhen die Grundstärke neuer Talente und ihren jährlichen Zuwachs. Der Ausbau wird einmalig mit VC bezahlt.",
    quelle: "akademie.js: ABTEILUNGEN, talentBauen, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.scouting": {
    titel: "Scouting",
    kurz: "Mehr Talente und genauere Potenzialeinschätzung.",
    details: "Scouting erhöht die Zahl der Neuaufnahmen und macht die Potenzialeinschätzung genauer. Es verändert außerdem die Streuung der Potenziale neuer Talente.",
    quelle: "akademie.js: ABTEILUNGEN, talentBauen, akaSpanne, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.internat": {
    titel: "Internat",
    kurz: "Senkt das Abbruchrisiko deiner Talente.",
    details: "Das Internat senkt in jedem Akademiejahr die Abbruchwahrscheinlichkeit vorhandener Talente. Nach dem Ausbau entstehen dafür keine eigenen laufenden Kosten.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.medizin": {
    titel: "Medizin",
    kurz: "Senkt das Verletzungsrisiko der Talente.",
    details: "Die Medizin senkt die jährliche Verletzungswahrscheinlichkeit. Verletzte Talente entwickeln sich in diesem Jahr deutlich langsamer.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.lehre": {
    titel: "Ausbildung",
    kurz: "Erhöht Potenzial und Entwicklung der Talente.",
    details: "Die Ausbildung erhöht das Potenzial neuer Talente und den jährlichen Zuwachs bestehender Talente. Der Ausbau kostet einmalig VC.",
    quelle: "akademie.js: ABTEILUNGEN, talentBauen, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.buehne": {
    titel: "Wettbewerbe",
    kurz: "Steigert Profi- und Turnierchancen.",
    details: "Wettbewerbe erhöhen die Chance auf ein Profiangebot und verbessern den späteren Peak. Sie erhöhen außerdem Teilnahme- und Siegchancen bei Jugendturnieren.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.mental": {
    titel: "Mentaltraining",
    kurz: "Weniger Abbrüche, bessere Profichancen.",
    details: "Mentaltraining senkt die Abbruchwahrscheinlichkeit und erhöht die Chance auf ein Profiangebot. Die Wirkung greift jedes Akademiejahr.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.analyse": {
    titel: "Videoanalyse",
    kurz: "Beschleunigt die jährliche Talententwicklung.",
    details: "Videoanalyse erhöht den jährlichen Stärke-Zuwachs der Talente. Sie wirkt zusätzlich zu Trainingsplätzen und Ausbildung.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "akademie.netzwerk": {
    titel: "Profi-Netzwerk",
    kurz: "Erhöht die Chance auf Profiverträge.",
    details: "Das Netzwerk erhöht bei geeigneten Talenten die Chance auf ein Profiangebot. Es verändert nicht direkt ihre Entwicklung.",
    quelle: "akademie.js: ABTEILUNGEN, akaJahr; App.jsx: akaKaufen"
  },
  "verein.stadion": {
    titel: "Stadion",
    kurz: "Mehr Kapazität und stärkerer Heimvorteil.",
    details: "Mehr Plätze können höhere Ticketeinnahmen ermöglichen; der Ausbau erhöht außerdem die berechnete Mannschaftsstärke. Baukosten werden sofort abgezogen, die neue Stufe wirkt erst nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart, plaetze, saisonEinnahmen; verein.js: staerke"
  },
  "verein.gastro": {
    titel: "Gastronomie",
    kurz: "Mehr Umsatz je Besucher im Stadion.",
    details: "Eine höhere Gastrostufe steigert den Umsatz je Besucher und macht die Nachfrage weniger preissensibel. Bezahlt wird beim Baustart; die Wirkung beginnt nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart, elastizitaet, saisonEinnahmen"
  },
  "verein.sortiment": {
    titel: "Fanartikel",
    kurz: "Stärkt die Merchandising-Einnahmen.",
    details: "Das Sortiment erhöht gemeinsam mit Vertrieb, Bekanntheit, Stimmung und Preis die Merchandising-Einnahmen. Bezahlt wird beim Baustart; die Wirkung beginnt nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart, elastizitaet, saisonEinnahmen"
  },
  "verein.reichweite": {
    titel: "Vertrieb",
    kurz: "Vergrößert die Reichweite des Merchandisings.",
    details: "Vertrieb wirkt gemeinsam mit dem Sortiment auf Merchandising und Preisempfindlichkeit. Bezahlt wird beim Baustart; die Wirkung beginnt nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart, elastizitaet, saisonEinnahmen"
  },
  "verein.training": {
    titel: "Trainingszentrum",
    kurz: "Beschleunigt die Entwicklung junger Spieler.",
    details: "Das Trainingszentrum erhöht den jährlichen Stärke-Zuwachs junger Kaderspieler. Baukosten werden sofort abgezogen, die neue Stufe wirkt erst nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart; verein.js: vereinSaison"
  },
  "verein.medizin": {
    titel: "Medizin",
    kurz: "Verbessert Fitness und kann Karrieren verlängern.",
    details: "Die medizinische Abteilung verbessert die saisonale Fitness und kann das Karriereende älterer Kaderspieler hinausschieben. Baukosten werden sofort abgezogen, die neue Stufe wirkt erst nach Fertigstellung.",
    quelle: "vereinswirtschaft.js: AUSBAU, bauStart; verein.js: vereinSaison"
  },
  "vermoegen.wohnung": {
    titel: "Eigentumswohnung",
    kurz: "Mehr Moral, dauerhaft mit kleinem Unterhalt.",
    details: "Der Kauf erhöht sofort die Moral und bringt danach weiteren Moralbonus pro Saison. Dafür fällt jedes Jahr Unterhalt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.haus": {
    titel: "Haus im Grünen",
    kurz: "Mehr Moral und Fitness im Alltag.",
    details: "Setzt die Eigentumswohnung voraus und stärkt Moral sowie Fitness über die Saisons. Jährlicher Unterhalt fällt weiter an.",
    quelle: "App.jsx: SHOP, buy, perk, develop, finance"
  },
  "vermoegen.villa": {
    titel: "Villa mit Trainingsraum",
    kurz: "Breiter Bonus für Training, Fitness und Moral.",
    details: "Setzt das Haus voraus und verbessert Entwicklung, Fitness, Moral sowie Altersabbau. Zusätzlich fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, buy, perk, develop, finance"
  },
  "vermoegen.ferienhaus": {
    titel: "Ferienhaus am Meer",
    kurz: "Stärkt Moral und Fitness über die Saison.",
    details: "Der Kauf erhöht sofort die Moral und liefert danach Moral- und Fitnessbonus pro Saison. Dafür fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.platz": {
    titel: "Kunstrasen im Garten",
    kurz: "Extra-Entwicklung und kleiner Notenbonus.",
    details: "Setzt das Haus voraus und verbessert Entwicklung sowie Leistungsnote über die Saisons. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, perk, develop, finance"
  },
  "vermoegen.auto1": {
    titel: "Solider Kombi",
    kurz: "Kleiner Moralbonus ohne dauerhaften Leistungseffekt.",
    details: "Der Kauf erhöht sofort die Moral. Danach bleibt vor allem der jährliche Unterhalt; weitere Saisonboni sind nicht hinterlegt.",
    quelle: "App.jsx: SHOP, buy, applyFx, finance"
  },
  "vermoegen.auto2": {
    titel: "Sportwagen",
    kurz: "Mehr Moral und Bekanntheit, aber laufende Kosten.",
    details: "Der Kauf erhöht sofort Moral und Bekanntheit; Bekanntheit steigt danach weiter pro Saison. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.auto3": {
    titel: "Oldtimer-Sammlung",
    kurz: "Moral plus kleine variable Einnahmen.",
    details: "Setzt den Sportwagen voraus und bringt Moral sowie eine kleine variable Einnahme pro Saison. Jährlicher Unterhalt kann einen Teil davon aufzehren.",
    quelle: "App.jsx: SHOP, buy, perk, finance"
  },
  "vermoegen.boot": {
    titel: "Motorboot",
    kurz: "Moralbonus mit laufendem Unterhalt.",
    details: "Der Kauf erhöht sofort Moral und Bekanntheit und bringt danach weiteren Moralbonus. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.verwalter": {
    titel: "Vermögensverwalter",
    kurz: "Automatisiert ausgewählte Käufe und Geldanlagen.",
    details: "Nach jeder Saison hält der Verwalter eine Rücklage, kauft aus einer festen Auswahl und legt einen Teil freien Geldes an. Zusätzlich bringt er Moralbonus, kostet aber jährlichen Unterhalt.",
    quelle: "App.jsx: SHOP, verwalterRunde, perk, finance"
  },
  "vermoegen.berater": {
    titel: "Finanzberater",
    kurz: "Mehr Nettogehalt und ruhigere Depotentwicklung.",
    details: "Der Berater erhöht den Nettoanteil des Gehalts und verändert Depot-Renditen in Richtung einer geringeren Schwankung. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, perk, finance"
  },
  "vermoegen.physio": {
    titel: "Privatphysio",
    kurz: "Weniger Verletzungsanfälligkeit, mehr Fitness.",
    details: "Der Physio senkt Verletzungsanfälligkeit, stärkt Fitness und bremst altersbedingten Abbau. Dafür fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.koch2": {
    titel: "Privatkoch",
    kurz: "Mehr Fitness und weniger Verletzungsrisiko.",
    details: "Der Privatkoch verbessert Fitness, senkt Verletzungsanfälligkeit und bremst den Altersabbau leicht. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.mental": {
    titel: "Sportpsychologe",
    kurz: "Mehr Moral und bessere Leistungsnoten.",
    details: "Der Sportpsychologe erhöht sofort die Moral und verbessert danach Moral sowie Leistungsnote pro Saison. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.analyst": {
    titel: "Videoanalyst",
    kurz: "Bessere Noten und schnellere Entwicklung.",
    details: "Der Videoanalyst verbessert Leistungsnote und Entwicklung über die Saisons. Dafür fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, perk, develop, finance"
  },
  "vermoegen.athletik": {
    titel: "Athletiktrainer",
    kurz: "Mehr Fitness und Entwicklung, weniger Verletzungen.",
    details: "Der Athletiktrainer verbessert Fitness und Entwicklung und senkt die Verletzungsanfälligkeit. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.kaelte": {
    titel: "Kältekammer",
    kurz: "Bremst Alterung und unterstützt Regeneration.",
    details: "Setzt das Haus voraus und bremst Altersabbau, senkt Verletzungsanfälligkeit und stärkt Fitness. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, perk, develop, finance"
  },
  "vermoegen.jet": {
    titel: "Flugzeuganteil",
    kurz: "Mehr Fitness und Moral, dazu Bekanntheit.",
    details: "Der Kauf erhöht sofort die Bekanntheit und bringt danach Fitness- und Moralbonus pro Saison. Der hohe jährliche Unterhalt bleibt bestehen.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.restaurant": {
    titel: "Restaurantbeteiligung",
    kurz: "Variable Einnahmen mit echtem Verlustrisiko.",
    details: "Die Beteiligung bringt variable Einnahmen; zusätzlich kann das Restaurant pro Saison Gewinn oder Verlust erzeugen. Ein positiver Ertrag ist nicht garantiert.",
    quelle: "App.jsx: SHOP, buy, perk, finance"
  },
  "vermoegen.immo": {
    titel: "Mietshaus",
    kurz: "Variable Mieteinnahmen mit laufendem Unterhalt.",
    details: "Das Mietshaus speist variable Beteiligungs- und Mieteinnahmen in die Jahresabrechnung ein. Dafür fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, perk, finance"
  },
  "vermoegen.weinberg": {
    titel: "Weinberg",
    kurz: "Einnahmen und Moral mit laufendem Unterhalt.",
    details: "Der Weinberg bringt variable Einnahmen und Moralbonus pro Saison sowie sofort etwas Bekanntheit. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.fanshop": {
    titel: "Fanshop-Beteiligung",
    kurz: "Einnahmen, Bekanntheit und mehr Reichweite.",
    details: "Die Beteiligung bringt variable Einnahmen und Bekanntheit pro Saison und erhöht die berechnete Followerzahl. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, perk, finance, socialStats"
  },
  "vermoegen.akademie": {
    titel: "Eigene Jugendakademie",
    kurz: "Bekanntheit, Moral und variable Einnahmen.",
    details: "Die Akademie stärkt Bekanntheit und Moral und kann jährlich Geld beitragen oder kosten. Zusätzlich fällt jährlicher Unterhalt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, finance"
  },
  "vermoegen.amateur": {
    titel: "Anteile Heimatverein",
    kurz: "Dauerhafte Moral und Bekanntheit.",
    details: "Die Anteile erhöhen sofort Moral und Bekanntheit und verstärken beides danach pro Saison. Jährlicher Unterhalt fällt an.",
    quelle: "App.jsx: SHOP, buy, applyFx, perk, develop, finance"
  },
  "vermoegen.anteile": {
    titel: "Anteile eigener Verein",
    kurz: "Bekanntheit, Moral und jährliche Dividende.",
    details: "Der Kaufpreis hängt vom aktuellen Verein ab. Die Anteile bringen Moral und Bekanntheit sowie eine saisonale Dividende; eigener Unterhalt ist nicht hinterlegt.",
    quelle: "App.jsx: SHOP, MoneyView, buy, perk, finance"
  },
  "investition.anleihe": {
    titel: "Staatsanleihen",
    kurz: "Niedrige Schwankung; Wert wird jährlich angepasst.",
    details: "Die Oberfläche bietet neue Einzahlungen erst ab dem Mindestbetrag an. Der Depotwert schwankt jährlich in kleiner Bandbreite; Auflösen zahlt den aktuellen Wert aus.",
    quelle: "App.jsx: INVEST, invest, finance, sell"
  },
  "investition.immo": {
    titel: "Immobilienfonds",
    kurz: "Niedriges Risiko mit möglichen Wertverlusten.",
    details: "Die Oberfläche bietet neue Einzahlungen erst ab dem Mindestbetrag an. Der Depotwert kann pro Saison fallen oder steigen.",
    quelle: "App.jsx: INVEST, invest, finance, sell"
  },
  "investition.etf": {
    titel: "ETF-Depot",
    kurz: "Mittleres Risiko mit spürbaren Schwankungen.",
    details: "Die Oberfläche bietet neue Einzahlungen erst ab dem Mindestbetrag an. Der Depotwert kann pro Saison deutlich fallen oder steigen.",
    quelle: "App.jsx: INVEST, invest, finance, sell"
  },
  "investition.startup": {
    titel: "Start-up",
    kurz: "Hohes Risiko mit sehr großer Schwankung.",
    details: "Die Oberfläche bietet neue Einzahlungen erst ab dem Mindestbetrag an. Der Depotwert kann stark fallen oder steigen; Verluste enden bei null.",
    quelle: "App.jsx: INVEST, invest, finance, sell"
  },
  "investition.krypto": {
    titel: "Kryptowährungen",
    kurz: "Sehr hohes Risiko mit extremer Schwankung.",
    details: "Die Oberfläche bietet neue Einzahlungen erst ab dem Mindestbetrag an. Der Depotwert kann stark fallen oder steigen; Verluste enden bei null.",
    quelle: "App.jsx: INVEST, invest, finance, sell"
  },
};
