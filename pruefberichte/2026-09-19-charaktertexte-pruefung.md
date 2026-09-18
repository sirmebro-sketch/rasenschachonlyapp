# Lemming-Prüfbericht – sichtbare Texte der Charaktererstellung

**Datum:** 19.09.2026  
**Rolle:** Lemming  
**Auftrag:** ausschließlich sichtbare Texte der Charaktererstellung einschließlich Hilfetexte, Rückmeldungen und Beschriftungen prüfen  
**Geprüfte Basis:** `main` @ `703d377e8eaa7932b6f5fed62ca313807ad16486`  
**Paketversion:** `35.194.1`  
**Arbeitsbranch:** `lemming/charaktertexte-pruefung`  
**Status:** Dokumentationsvorschlag zur Astra-Abnahme; keine Produkttexte und kein Produktcode geändert

## Abgrenzung und Quellen

Geprüft wurde der aktuelle `CreateScreen` in `App.jsx` einschließlich der sichtbaren
Beschriftungen, Hilfetexte, Such-/Leerzustände und der dynamischen Porträttexte. Aussagen
über Funktion wurden gegen den aktuellen Code abgeglichen, insbesondere:

- Porträt-Würfeln und Festhalten in `portraet.js`;
- Startwertwirkung der Statur in `createPlayer`;
- Namensvorschläge bei Nation/Geschlecht;
- Auswahl und Angebotslogik des Wunschvereins;
- Rückennummernübernahme beim Start;
- Jugendvereinsfilter für Nation und Männer-/Frauenfußball.

Es wurde **kein umfassender Sprachumbau** vorgenommen. Formulierungen, die lediglich
Geschmackssache sind, wurden nicht als Befund aufgenommen. In der Charaktererstellung
gibt es auf der geprüften Basis keine eigenen klassischen Formular-Fehlermeldungen;
relevante Rückmeldungen sind vor allem `Kein Verein gefunden.` und der
Jugendvereins-Leerzustand.

### Parallel offene Arbeit

Vor der Prüfung wurden die offenen PRs kontrolliert. Für diesen Auftrag besonders
relevant:

- **#38 CHAR-P1-05** schlägt einen mobilen Wischhinweis für die Charakter-Kategorien
  vor. Diese noch nicht integrierten neuen Texte wurden nicht als Bestandteil von
  `main` bewertet.
- **#43 QA Namenseingaben/Fokus/Rückwege** dokumentiert unter anderem, dass der
  sichtbare `Zurück`-Button einen unbestätigten Charakterentwurf verwirft. Dieser
  Befund wird unten als Bedeutungsfrage übernommen, nicht eigenmächtig sprachlich
  entschieden.
- **#41** prüft lange Namen mobil; **#27 CHAR-FIX-05** betrifft eine Frisurgeometrie.
  Beide liefern keinen zusätzlichen belegten Produkttextfehler für diesen Auftrag.
- Die übrigen offenen Wirtschafts-, Karten-, Pack-, Wildcard-, Icon- und
  Dokumentations-PRs wurden nicht integriert und nicht verändert.

Als bestehender Befund wurde außerdem die unabhängige Astra-Qualitätsabnahme vom
18.09.2026 berücksichtigt. Sie beschreibt die Charakterseite als grundsätzlich
verständlich, nennt aber mobile Scrollarbeit als verbleibenden Bedienungsrest.

## Priorisierte Textvorschläge

| Priorität | Fundstelle | Aktueller Wortlaut | Vorgeschlagener Wortlaut | Begründung |
|---|---|---|---|---|
| P1 | Feinheiten → Porträthilfe unter den Varianten | „Haut- und Haarfarbe sind unabhängig von deiner Nationalität frei wählbar. **Dein Aussehen verändert keine Spielwerte.**“ | „Haut- und Haarfarbe sind unabhängig von deiner Nationalität frei wählbar. **Die Porträtmerkmale verändern keine Spielwerte; die separat gewählte Statur beeinflusst deine Startwerte.**“ | Die pauschale Aussage ist sachlich missverständlich. Die Porträtwahl selbst ändert keine Werte, aber die ebenfalls in der Charaktererstellung sichtbare Statur verändert beim Start tatsächlich Attribute: schlank u. a. Tempo/Körper, kraftvoll Körper/Tempo, hochgewachsen Körper/Schuss/Dribbling. Der Vorschlag ändert keine Regel, sondern grenzt die bestehende Regel korrekt ab. |
| P1 | Wunschverein → Hilfetext | „Musst du nicht. **Der Verein klopft im Lauf der Jahre ein- bis dreimal an** — sofern du sportlich dorthin passt.“ | „Musst du nicht. **Dein Wunschverein kann dir im Lauf der Jahre bis zu dreimal ein Angebot machen** — sofern du sportlich dorthin passt und nicht bereits dort spielst.“ | Der Code begrenzt Wunschvereinsangebote auf höchstens drei, garantiert aber nicht in jedem Karriereverlauf mindestens eines. Zusätzlich wird kein Wunschvereinsangebot erzeugt, wenn der Spieler bereits dort spielt. „kann … bis zu dreimal“ beschreibt das tatsächliche Verhalten ohne neue Garantie. |
| P2 | Name → dynamischer Hilfetext | „Bleibt deiner, auch wenn du die **Herkunft** wechselst.“ / „Vorschlag zur **Herkunft**. Einfach überschreiben.“ | „Bleibt deiner, auch wenn du **Nation oder Geschlecht** wechselst.“ / „Vorschlag passend zu **Nation und Geschlecht**. Einfach überschreiben.“ | Das Formular nennt das Feld `Nation`, nicht „Herkunft“. Außerdem wird der automatische Namensvorschlag im Code von Nation **und** Geschlecht abhängig gemacht. Ein selbst eingegebener Name bleibt bei beiden Wechseln stehen. Der Vorschlag vereinheitlicht die sichtbaren Begriffe und beschreibt die tatsächliche Abhängigkeit. |
| P3 | Rückennummernfeld | „**Nummer**“ | „**Rückennummer**“ | Vorschau-Tooltip und Accessibility-Name verwenden bereits „Rückennummer“, sichtbar steht nur „Nummer“. Im Fußballkontext ist die Bedeutung meist erratbar, aber die ausgeschriebene Bezeichnung beseitigt die interne Uneinheitlichkeit ohne Verhaltensänderung. |
| P3 | Jugendverein → Leerzustand | „**Dazu passt gerade kein Verein.**“ | „**Für diese Auswahl ist kein Jugendverein verfügbar.**“ | „Dazu“ hat keinen eindeutigen Bezug und „gerade“ klingt nach einem vorübergehenden Zustand. Tatsächlich ergibt sich die Liste deterministisch aus Nation, Geschlecht/Fußballbereich und vorhandenen Ligadaten. Der Vorschlag erklärt den Zustand, ohne technische Filterregeln in die UI zu ziehen. |

## Bewusst nicht beanstandet

- **„Würfeln“ / Festhalten:** Der Tooltip „Nur freie Merkmale würfeln;
  festgehaltene Merkmale bleiben erhalten“ stimmt mit `portraetWuerfeln` überein.
- **„Starker Fuß“:** Die sichtbaren Optionen rechts/links/beidfüßig werden so in den
  Spielerzustand übernommen; kein Widerspruch gefunden.
- **„Kein Verein gefunden.“:** Für eine Suche ab zwei Zeichen ist das eine
  verständliche und sachlich richtige Rückmeldung.
- Stilfragen wie Groß-/Kleinschreibung kurzer Optionswerte oder die umgangssprachliche
  Form „klopft an“ wurden nur dann aufgenommen, wenn sie zugleich eine sachliche
  Funktionsaussage verfälschen.

## Ungeklärte Bedeutungsfragen

1. **„Geschlecht“ versus „Männerfußball/Frauenfußball“:** Der Zustand steuert im
   Code sowohl Porträtmerkmale als auch verfügbare Vereine/Ligen und damit den
   Wettbewerbsraum. Ob die Überschrift bewusst die Person bezeichnet oder eigentlich
   den gewählten Fußballbereich benennen soll, ist eine Produktentscheidung. Deshalb
   wurde hier keine Umbenennung vorgeschlagen.
2. **„Zurück“ verwirft den unbestätigten Entwurf:** PR #43 belegt dieses Verhalten
   im Browser. Wenn das harte Verwerfen bewusst bleiben soll, wäre „Abbrechen“ eine
   präzisere Beschriftung. Wenn stattdessen künftig bestätigt oder ein Entwurf
   erhalten werden soll, muss zuerst das Verhalten entschieden werden. Eine reine
   Textänderung wäre sonst voreilig.

## Prüfung und Grenzen

- START-NEUER-CHAT.md, AGENTS.md, README.md, LEMMING.md und
  CHARAKTER-OPTIK-ARBEITSPLAN.md auf dem Live-Stand gelesen.
- Offene PRs sowie bestehende Charakter-/QA-Befunde vor Beginn geprüft.
- Aussagen der fünf Vorschläge gegen den relevanten aktuellen Quellcode abgeglichen.
- Keine Produktdatei, kein sichtbarer Produkttext, keine Spielregel, keine Version,
  keine App-ID und keine Release-Datei geändert.
- Für diesen reinen Dokumentations-PR wurden bewusst kein APK-Build und keine
  Produktregression als neue Evidenz behauptet. Nach dem Commit wird der Branch-Diff
  gegen `main` kontrolliert.

**Status: zur Astra-Abnahme; noch nicht integriert. Kein Merge, kein Release.**
