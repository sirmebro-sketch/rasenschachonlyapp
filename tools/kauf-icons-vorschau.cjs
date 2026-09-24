const fs = require('node:fs');
const path = require('node:path');

const repo = path.resolve(__dirname, '..');
const quelle = path.join(repo, 'kauf-icons.jsx');
const outArg = process.argv.find(a => a.startsWith('--out='));
const ziel = outArg ? path.resolve(repo, outArg.slice(6)) : path.join(repo, '.preview', 'kauf-icons.html');
const svgZiel = ziel.replace(/\.html$/i, '.svg');

const code = fs.readFileSync(quelle, 'utf8');
const treffer = code.match(/\/\* KAUF_ICON_DATA_START \*\/\s*([\s\S]*?)\s*\/\* KAUF_ICON_DATA_END \*\//);
if (!treffer) throw new Error('Icon-Datenblock in kauf-icons.jsx nicht gefunden.');
const { motive, fallback } = JSON.parse(treffer[1]);

const attrName = name => ({
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
}[name] || name);

const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

function form(shape) {
  const { t, ...props } = shape;
  const attrs = Object.entries(props).map(([k, v]) => `${attrName(k)}="${esc(v)}"`).join(' ');
  return `<${t} ${attrs}/>`;
}

function icon(formen, size) {
  const inhalt = formen.map(form).join('');
  return `<div class="probe"><svg class="kauf-icon" style="width:${size}px;height:${size}px" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${inhalt}</g></svg><span>${size}px</span></div>`;
}

function karte(id, formen) {
  return `<article><strong>${esc(id)}</strong><div class="groessen">${[32,48,64].map(s => icon(formen, s)).join('')}</div></article>`;
}

const eintraege = [
  ...Object.entries(motive),
  ['fallback.unbekannt', fallback],
];

const karten = eintraege.map(([id, formen]) => karte(id, formen)).join('');

const html = `<!doctype html>
<html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>KAUF-01 Icon-Vorschau</title>
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#070D0A;color:#E7DDC8}
*{box-sizing:border-box}body{margin:0;padding:24px;background:#070D0A}
main{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;max-width:1280px;margin:auto}
article{min-height:154px;padding:14px;border:1px solid #2A3730;background:#0F1814;border-radius:12px}
strong{font-size:14px}.groessen{display:flex;align-items:flex-start;gap:22px;margin-top:18px}
.probe{display:grid;justify-items:center;gap:8px;color:#8E9A91;font-size:11px}
.kauf-icon{display:block;box-sizing:border-box;padding:6px;color:#E7DDC8;background:#101915}
</style><body><main>${karten}</main></body></html>`;

function svgIcon(formen, x, y, size) {
  const pad = 6;
  const faktor = (size - 2 * pad) / 48;
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#101915"/>` +
    `<g transform="translate(${x + pad} ${y + pad}) scale(${faktor})" color="#E7DDC8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${formen.map(form).join('')}</g>`;
}

const spalten = 4;
const karteB = 300;
const karteH = 178;
const rand = 24;
const zeilen = Math.ceil(eintraege.length / spalten);
const breite = rand * 2 + spalten * karteB;
const hoehe = rand * 2 + zeilen * karteH;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}" viewBox="0 0 ${breite} ${hoehe}"><rect width="100%" height="100%" fill="#070D0A"/>`;

eintraege.forEach(([id, formen], index) => {
  const x = rand + (index % spalten) * karteB;
  const y = rand + Math.floor(index / spalten) * karteH;
  svg += `<rect x="${x}" y="${y}" width="${karteB - 14}" height="${karteH - 14}" rx="12" fill="#0F1814" stroke="#2A3730"/>`;
  svg += `<text x="${x + 14}" y="${y + 24}" fill="#E7DDC8" font-family="system-ui,sans-serif" font-size="14" font-weight="700">${esc(id)}</text>`;
  let iconX = x + 20;
  for (const size of [32, 48, 64]) {
    svg += svgIcon(formen, iconX, y + 50, size);
    svg += `<text x="${iconX + size / 2}" y="${y + 132}" text-anchor="middle" fill="#8E9A91" font-family="system-ui,sans-serif" font-size="11">${size}px</text>`;
    iconX += size + 34;
  }
});
svg += '</svg>';

fs.mkdirSync(path.dirname(ziel), { recursive: true });
fs.writeFileSync(ziel, html);
fs.writeFileSync(svgZiel, svg);
console.log(`KAUF-01 HTML-Vorschau: ${ziel}`);
console.log(`KAUF-01 SVG-Vorschau: ${svgZiel}`);
console.log(`${Object.keys(motive).length} Motive + Fallback × 3 Groessen`);
