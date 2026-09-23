# Klangwelt – Sol, 22.09.2026

**Rolle:** Lemming-Arbeitsweg für einen neuen Chat ohne Astra-Zuordnung.
**Auftrag:** Sounds passend zu Rasenschach XI entwerfen und im Spiel nutzbar machen.
**Basis:** `main` `703d377e8eaa7932b6f5fed62ca313807ad16486`, Version `35.194.1`.
**Branch:** `lemming/sol-sounddesign`. Andere offene PRs und Branches wurden nicht übernommen.

## Befund und Gestaltung

Vorher gab es Haptik für Schaltflächen, jedoch keine Audioausgabe. Der schnelle,
textreiche Saisonablauf und die Magazin-/Sammelkartenoptik verlangen kurze,
leise Zeichen statt ständigem Stadionlärm. Alle Klänge teilen eine E-Moll-
Pentatonik, weiche Glocken-/Papierimpulse und einen tieferen Anstoß. Die Dateien
sind ausschließlich synthetisch aus Code erzeugt: keine gesampelte Musik, keine
Stadion-/Schiedsrichteraufnahme und keine Lizenzdateien von Dritten.

| Moment | Klangdatei(en) | Auslösung |
|---|---|---|
| Menü, Button, Bestätigung | tap, navigate, confirm, whistle | Bedieneingabe; gesperrte Buttons bleiben still |
| Training, Ereignis, verhaltener Rückschlag | training, event, setback | Auswahl, Ereignisfolge, Fehlschuss |
| Spieljahr, Treffer, Transfer | season, goal, transfer | Ergebnis, Sonderschuss, Vereinswechsel |
| Titel und Karriereabschluss | trophy, farewell | Titelanzeige beziehungsweise gebuchter Abschluss |
| Packs, Karten, Wildcards | pack, reveal, wildcard, flip | gebuchte Öffnung, erste Aufdeckung, Enthüllung, Passwende |

16 kurze MP3-Dateien mit zusammen ungefähr 112 KB, fest mit der App gebündelt
und offline verfügbar. `tools/generate-sounds.py` erzeugt sie reproduzierbar.
Der zentrale Abspieler in `sound.js` begrenzt Dopplungen und gleichzeitige Töne,
ignoriert unsichtbare Tabs und fängt fehlendes/gesperrtes Audio ab. Kein Autoplay
beim App-Start. Die separate Lautstärke in den Einstellungen hat die Stufen
Aus/Leise/Normal; Leise ist die Vorgabe. Der neue Speicherschlüssel ist auch in
„Alles löschen“ enthalten. Spielstände und Ereignis-IDs ändern sich nicht.
Beim Anschließen fiel auf, dass `Optionen` schon vorher `schreibe(...)` benutzte,
ohne die Funktion vom übergeordneten Bildschirm zu erhalten. Der bestehende
Speicherweg wird jetzt gezielt als Prop durchgereicht; davon profitieren auch
die vorhandenen Einstellungsregler.

## Eigene Prüfung

- `npm ci`, `npm test`: **142/142** nach zwei neuen Klangregressionen.
- `npm run build` und danach `npx cap sync android`: erfolgreich;
  bestehende Bundling-Größenwarnung unverändert. `trophy.mp3` liegt identisch
  in `public` und `dist` (stichprobenartiger Dateivergleich).
- `node --test tools/sound.test.cjs`: 2/2, Stummschalten, Standardknöpfe und
  blockierte Buttons einschließlich simuliertem Audio geprüft.
- Automatisierter mobiler Browsertest ergänzt. Lokaler Versuch konnte nicht
  starten: Chromium war nicht installiert, `npx playwright install chromium`
  erhielt einen ungültigen 0-MiB-Download. Der GitHub-Push wurde zweimal von
  der automatischen Freigabeprüfung untersagt. Deshalb existiert noch kein PR
  und keine PR-CI. Eine Patch-Übergabe enthält alle Änderungen samt Sounds.

## Grenzen und Übergabe

Die Audioausgabe und Medienlautstärke auf einem echten Android-Gerät wurden hier
noch nicht beurteilt. Version und signierte APK legt Astra nach Abnahme fest;
dieser Branch ist lokal committed, aber nicht auf GitHub veröffentlicht.
