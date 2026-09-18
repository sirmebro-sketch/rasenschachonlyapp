const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Startbild ist vor React vorhanden und hat Ladeanzeige', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const splash = html.indexOf('id="app-startup-splash"');
  const root = html.indexOf('id="root"');
  assert.ok(splash >= 0, 'Startbild fehlt im HTML');
  assert.ok(root > splash, 'Startbild muss vor dem React-Root stehen');
  assert.match(html, /src="__RASENSCHACH_STARTBILD__"/);
  assert.match(html, /class="startup-spinner"/);
  assert.match(html, /top:\s*64%/);
  assert.match(html, /prefers-reduced-motion:[^}]+[\s\S]*?startup-spinner\s*\{\s*animation:\s*none;/);
  assert.doesNotMatch(html, /drawable-port-xhdpi\/splash\.png/);
});

test('Das gelieferte Motiv ist ein vollstaendiges lokales 720x1280-WebP', () => {
  const b64 = fs.readFileSync('startbild.b64', 'utf8').trim();
  assert.ok(b64.length > 80000, 'Startbilddaten sind unerwartet klein');
  const data = Buffer.from(b64, 'base64');
  assert.equal(data.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(data.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.equal(data.subarray(12, 16).toString('ascii'), 'VP8 ');
  const width = data.readUInt16LE(26) & 0x3fff;
  const height = data.readUInt16LE(28) & 0x3fff;
  assert.equal(width, 720);
  assert.equal(height, 1280);
});

test('Vite bettet genau die lokalen Bilddaten in den Startscreen ein', () => {
  const vite = fs.readFileSync('vite.config.js', 'utf8');
  assert.match(vite, /readFileSync\(new URL\("\.\/startbild\.b64"/);
  assert.match(vite, /html\.replace\(STARTBILD_TOKEN,\s*`data:image\/webp;base64,\$\{startbildBase64\}`\)/);
});

test('Startbild bleibt mindestens kurz sichtbar und wird danach entfernt', () => {
  const main = fs.readFileSync('main.jsx', 'utf8');
  assert.match(main, /minimumVisibleMs\s*=\s*2200/);
  assert.match(main, /classList\.add\("is-hiding"\)/);
  assert.match(main, /startupSplash\.remove\(\)/);
});
