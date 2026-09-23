const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

function startbildDaten() {
  return fs.readFileSync('public/startbild/startbild.webp');
}

test('Startbild ist vor React vorhanden und hat mittige Ladeanzeige', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const splash = html.indexOf('id="app-startup-splash"');
  const root = html.indexOf('id="root"');
  assert.ok(splash >= 0, 'Startbild fehlt im HTML');
  assert.ok(root > splash, 'Startbild muss vor dem React-Root stehen');
  assert.match(html, /id="startup-splash-image"/);
  assert.match(html, /class="startup-splash-backdrop"/);
  assert.equal((html.match(/src="\.\/startbild\/startbild\.webp"/g) || []).length, 2);
  assert.doesNotMatch(html, /startbild\/part-/);
  assert.match(html, /class="startup-spinner"/);
  assert.match(html, /left:\s*50%;\s*top:\s*50%/);
  assert.match(html, /startup-splash-image[^}]+object-fit:\s*contain/);
  assert.match(html, /startup-splash-backdrop[^}]+object-fit:\s*cover/);
  assert.match(html, /prefers-reduced-motion:[^}]+[\s\S]*?startup-spinner\s*\{\s*animation:\s*none;/);
  assert.doesNotMatch(html, /drawable-port-xhdpi\/splash\.png/);
});

test('Geliefertes Magazinmotiv ist exakt das gepruefte 1080x1920-WebP', () => {
  const data = startbildDaten();
  assert.equal(data.length, 143560);
  assert.equal(data.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(data.subarray(8, 12).toString('ascii'), 'WEBP');
  assert.equal(data.subarray(12, 16).toString('ascii'), 'VP8 ');
  assert.equal(data.readUInt16LE(26) & 0x3fff, 1080);
  assert.equal(data.readUInt16LE(28) & 0x3fff, 1920);
  assert.equal(
    crypto.createHash('sha256').update(data).digest('hex'),
    '2be089a331766cd2508df6997721b112dac3a45794b3f43c2650efabcb695929'
  );
});

test('Startbild bleibt mindestens kurz sichtbar und wird danach entfernt', () => {
  const main = fs.readFileSync('main.jsx', 'utf8');
  assert.match(main, /minimumVisibleMs\s*=\s*2200/);
  assert.match(main, /classList\.add\("is-hiding"\)/);
  assert.match(main, /startupSplash\.remove\(\)/);
});
