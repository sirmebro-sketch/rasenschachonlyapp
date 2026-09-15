# Rasenschach XI

Ein deutschsprachiger Fußball-Karriere-Simulator. Eine React-Einzelseite, die
über Capacitor als Android-App ausgeliefert wird (`de.rasenschach.xi`). Die App
läuft vollständig ohne Netz: Schriften und Titelbild sind als Daten eingebettet,
gespeichert wird über Capacitor Preferences, im Browser über dieselbe
Schnittstelle mit localStorage darunter.

Man spielt eine einzelne Laufbahn — Training, Ereignisse, Saisonergebnis,
Vertragsangebote — und trägt über mehrere Laufbahnen hinweg einen
Meta-Fortschritt weiter: Jugendakademie, eigener Verein, Sammelkarten,
Errungenschaften, Ruhmeshalle.

## Schnellstart

```
npm ci            # Abhängigkeiten, genau nach package-lock.json
npm test          # Regressionen (läuft auch in der CI)
npm run build     # Produktionsbündel nach dist/
```

Android (braucht Java 21 und das Android-SDK, siehe `.github/workflows/apk.yml`):

```
npx cap sync android
node tools/android-version.cjs android/app/build.gradle package.json
cd android && ./gradlew assembleRelease
```

Eine Entwicklungsvorschau gibt es bewusst nicht als Skript; `npx vite` genügt,
wenn man sie braucht.

## Aufbau

| Datei | Aufgabe |
|---|---|
| `App.jsx` | Spielkern **und** komplette Oberfläche. Mit Abstand die größte Datei. |
| `ereignisse.js` | Ereigniskatalog: Titel, Text, Auswahlmöglichkeiten, Folgen |
| `namen.js` | Namenskartei, ein Eintrag je Land |
| `verein.js` | eigener Verein: Liga, Kader, Aufstellung, Taktik, Ausbau |
| `akademie.js` | Jugendakademie: Talente, Abteilungen, Jahrgänge |
| `karten.js` | Sammelkarten, Packs, Ziehung, Verkauf |
| `belohnungen.js` | Abschlussbelohnungen — ein Beleg für Buchung und Anzeige |
| `buchungen.js` | Karten-/Coinbuchungen, geprüft **vor** dem Schreiben |
| `spielstand.js` | laufenden Stand serialisieren und wieder laden |
| `sicherung.js` | Speichervertrag, Import mit Journal und Rücknahme |
| `storage.js` | Speicheradapter (Capacitor Preferences) |
| `schriften.js`, `titelbild.js` | eingebettete Schriften und Aufmacherbild |
| `tools/` | Prüfstände und Werkzeuge, siehe unten |

Die ausgelagerten Module sind **Fabriken** (`machEreignisse`, `machVerein`,
`machAkademie`, `machKarten`, `machNamen`): sie bekommen ihre Helfer von
`App.jsx` übergeben, statt von dort zu importieren. Ein Import wäre ein
Ringimport — die Datei liefe vor `App.jsx`, und deren Konstanten wären noch in
der temporalen Totzone. Das ist kein Stilentscheid, sondern verhindert einen
Absturz beim Start. Wer einer Fabrik einen neuen Helfer geben will, muss ihn an
**zwei** Stellen nachtragen: beim Auspacken in der Fabrik und bei der Übergabe
in `App.jsx`.

## Zusammenarbeit und Vermerke

An diesem Projekt arbeiten drei Beteiligte: der Eigentümer, Claude und
ChatGPT/Codex. Keiner sieht, was die anderen gerade getan haben — außer, es
steht im Repository. Deshalb gehört zu jeder Änderung ein Vermerk, und zwar an
der Stelle, an der der nächste ihn sucht:

| Art der Änderung | Wohin der Vermerk gehört |
|---|---|
| Etwas, das Spielende merken: Regel, Inhalt, Oberfläche, Grenzwert | `CHANGELOG.md`, neuer Abschnitt unter der Version |
| **Warum** eine Entscheidung so und nicht anders fiel | Kommentar unmittelbar am Code |
| Prüfergebnisse, Messwerte, offene Punkte, nächste Runde | `ENTWICKLUNG.md` |
| Werkzeuge, Abhängigkeiten, Aufbau des Repositorys, Konventionen | `README.md` (diese Datei) |
| Jede Änderung ohne Ausnahme | Commit-Nachricht: Version und Stichwort |

Dazu fünf Regeln, die sich aus früheren Fehlern ergeben haben:

1. **Messwerte mit Datum und Verfahren nennen.** „Rückfluss 94,3 %" allein ist
   wertlos; „2.000 Ziehungen je Packtyp, `node tools/langzeit.cjs`" ist
   nachprüfbar. Wer eine Zahl nennt, nennt, wie sie entstanden ist.
2. **Nichts als geprüft behaupten, was nicht gelaufen ist.** Ein Gerätetest,
   den niemand gemacht hat, gehört als offener Punkt vermerkt, nicht als
   Erfolg. `ENTWICKLUNG.md` führt solche Punkte ausdrücklich.
3. **Alte Begründungen nicht überschreiben.** Wenn sich eine frühere
   Entscheidung als falsch erweist, bleibt der alte Kommentar stehen und
   bekommt einen datierten Zusatz, der sagt, was daran nicht stimmte.
   `index.html` ist das Muster dafür. So bleibt nachvollziehbar, *warum*
   jemand damals so entschied.
4. **Ereignis- und Auswahlkennungen sind für immer.** Gespeicherte Spielstände
   verweisen über diese Kennungen zurück in den Katalog (`spielstand.js`).
   Neue Inhalte bekommen neue, eindeutige Kennungen; bestehende werden nie
   umbenannt und nie so umsortiert, dass alte Stände auf andere Folgen zeigen.
   `npm test` prüft die Eindeutigkeit.
5. **`App.jsx` ist der wahrscheinlichste Konfliktpunkt.** 19.000 Zeilen, an
   denen alle drei arbeiten. Wer dort etwas Größeres vorhat, sagt vorher, in
   welchem Bereich — das ist billiger als ein Merge-Konflikt in einer Datei
   dieser Größe.

### Versionsschema

`package.json` führt die Version als `major.minor.patch` (derzeit 35.174.0).
Daraus rechnet `tools/android-version.cjs` den `versionCode`
(`major*100000 + minor*100 + patch`, also 3517400) und schreibt ihn zusammen mit
dem `versionName` nach `android/app/build.gradle`. Beide Felder sollen nie von
Hand auseinanderlaufen. Die Version wird erhöht, wenn eine neue APK entsteht —
reine Werkzeug- oder Dokumentationsänderungen erhöhen sie nicht.

## Prüfstände

**`npm test`** — `node --test tools/*.test.cjs`, derzeit 70 Prüfungen. Läuft in
der CI bei jedem Push und Pull Request (`.github/workflows/regression.yml`).
Schwerpunkt: Abschlussbelohnungen und Kaufbuchungen, Speicherfehler an jedem
einzelnen Schritt, simulierte Prozessabbrüche, Import mit Rücknahme,
Ereignisstände nach Umsortierung des Katalogs.

**`node tools/langzeit.cjs`** — optionaler Langzeitlauf: 192 vollständige
Karrieren über acht Positionen, beide Geschlechter, drei Schwierigkeitsgrade,
dazu 2.000 Packziehungen je Packtyp. Läuft **nicht** in der CI, weil er Minuten
braucht; er ist die Stichprobe für Zahlen in `ENTWICKLUNG.md`.

Der Langzeitlauf hat eine Besonderheit, die man kennen muss: er baut keine
React-Oberfläche auf, sondern **schneidet die echten Handler textlich aus
`App.jsx` heraus** und setzt sie mit Testadaptern neu zusammen. Damit prüft er
den tatsächlich ausgelieferten Code und nicht eine Nachbildung — aber er hängt
an Markierungen im Quelltext:

```
/* PRUEFSTAND-ANFANG: helfer */   …   /* PRUEFSTAND-ENDE: helfer */
/* PRUEFSTAND-ANFANG: handler */  …   /* PRUEFSTAND-ENDE: handler */
```

Diese vier Zeilen in `App.jsx` sind **keine gewöhnlichen Kommentare**. Wer sie
löscht oder verschiebt, bricht den Prüfstand. `npm test` prüft deshalb ihr
Vorhandensein, ihre Eindeutigkeit und ihre Reihenfolge — ein versehentliches
Entfernen wird in der CI rot, nicht erst Wochen später beim nächsten
Langzeitlauf. Neuer Code, der mitgeprüft werden soll, gehört zwischen die
Markierungen.

**`node tools/android-version.cjs`** — schreibt `versionCode` und `versionName`
aus `package.json` nach `android/app/build.gradle`. Läuft im APK-Workflow.

## Was nicht im Repository liegt

`node_modules/`, `dist/`, gebaute APKs und **Signierschlüssel**. Der
Release-Schlüssel liegt ausschließlich als GitHub-Secret vor; im Repository
steht nur der erwartete Zertifikats-Fingerabdruck
(`signing/certificate-sha256.txt`), gegen den der Workflow vor dem Bauen und
nach dem Signieren prüft. Der Schlüssel wird am Ende vom Runner gelöscht.

Ebenfalls nicht hier: **`STAND.md`**. Einzelne Kommentare in `akademie.js` und
`karten.js` verweisen darauf — das Dokument stammt aus der Entwicklung vor
35.169.0, also aus der Zeit vor diesem Repository, und wurde nie mit importiert.
Seine Rolle übernehmen heute `CHANGELOG.md` (was sich geändert hat) und
`ENTWICKLUNG.md` (Stand, Prüfungen, offene Punkte).
