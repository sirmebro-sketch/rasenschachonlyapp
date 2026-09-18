# Lemming-Paket – Startbild/Ladescreen – 18.09.2026

**Rolle:** Lemming  
**Basiscommit:** `703d377e8eaa7932b6f5fed62ca313807ad16486`  
**Branch:** `lemming/startbild-ladescreen`  
**Releasezustand:** nicht integriert, kein main-Merge, kein Release.

## Auftrag

Kevins geliefertes Rasenschach-XI-Magazinmotiv soll das bisherige Startmotiv ersetzen und beim Appstart kurz als app-eigener Ladescreen erscheinen. Das Bild soll auf Vollbild-Smartphones scharf bleiben; der Ladekreis sitzt exakt in der Bildschirmmitte. Der Branch soll weiterhin als getrennte Beta installierbar sein.

## Vorgeschichte und erhaltene Fremdarbeit

Das Paket baut bewusst auf der bereits vorhandenen Lemming-Arbeit zu PR #28 auf. Deren app-eigener Splash vor React, Mindestanzeige, Ausblendung, Reduced-Motion-Verhalten und getrennte Beta-App-ID bleiben erhalten.

Eine fruehe Beta dieses Pakets war trotz gruener CI visuell falsch, weil sie versehentlich eine alte Capacitor-Splashgrafik verwendete. Dieser Lauf bleibt als verworfener Befund dokumentiert. Die spaetere Stadionfassung wurde technisch abgesichert; sie wird mit dem aktuellen Auftrag lediglich durch Kevins neues Magazinmotiv ersetzt.

## Aktuelle Bildfassung

Das aktuell gelieferte Magazinmotiv liegt als **1080×1920-WebP** vor:

- Dateigroesse: **143.560 Byte**
- SHA-256: `2be089a331766cd2508df6997721b112dac3a45794b3f43c2650efabcb695929`
- vollständig offline, kein Netzabruf
- wegen des textbasierten GitHub-Schreibwegs in **16** Datenbloeke unter `public/startbild/` geteilt

`tools/startbild.test.cjs` setzt die 16 Teile wieder zusammen und prueft Byte-Laenge, RIFF/WEBP-Signatur, **1080×1920** sowie den exakten SHA-256-Hash. Damit kann nicht unbemerkt wieder eine alte oder falsche Grafik in die Beta geraten.

## Vollbilddarstellung auf Smartphones

Das 9:16-Motiv wird als scharfe Vordergrundebene mit `object-fit: contain` dargestellt, damit Titel, Randtexte und Barcode auch auf hoeheren Displays nicht abgeschnitten werden. Hinter dem Motiv liegt dieselbe Grafik weich vergroessert und abgedunkelt mit `object-fit: cover`; sie fuellt bei 18:9/19.5:9/20:9 nur den zusaetzlichen Randbereich.

Dadurch bleibt auf 9:16 das Motiv randfuellend, waehrend auf laengeren Smartphones keine relevanten Seitenteile des Covers weggecroppt werden. Der Ladekreis liegt unabhaengig vom Seitenverhaeltnis bei **50 % / 50 %** exakt in der Bildschirmmitte.

## Start-/Timing-Verhalten

`index.html` zeigt den Ladescreen weiterhin vor dem React-Root. `main.jsx` haelt ihn ab HTML-Start mindestens 2,2 Sekunden sichtbar und blendet ihn danach aus. Dauert der eigentliche Start laenger, wird keine weitere volle Wartezeit addiert.

Bei `prefers-reduced-motion` rotiert der Ring nicht.

## Getrennte Beta

`.github/workflows/beta-apk.yml` baut weiterhin nur fuer den Test eine Debug-App mit:

- App-ID `de.rasenschach.xi.beta`
- Name „Rasenschach XI Beta“
- Debug-Signatur statt Release-Schluessel
- eigenem App-/Speicherbereich fuer parallele Installation

Kein Release und kein main-Merge.

## Pruefplan fuer den aktuellen PR-Head

Nach Abschluss der Bildumstellung muessen am exakten neuen Head erneut erfolgreich sein:

- `npm test`
- `npm run build`
- visuelle Browsertests des PR
- Workflow **Beta-APK fuer PR**
- APK-Nachkontrolle auf die 16 Bildteile und den exakten Bildhash

Die eigentliche Android-Sichtpruefung des Starttimings und der Vollbildwirkung bleibt anschliessend ein echter Geraetetest durch Kevin/Astra.

## Nicht Teil dieses Pakets

Keine Spiel-, Speicher-, Balance-, Charakter-, Release-Signatur- oder main-Aenderung. Andere offene PRs bleiben unberuehrt.

**Status:** Umsetzung laeuft auf dem PR-Branch; Astra-Abnahme und main-Integration bleiben offen.
