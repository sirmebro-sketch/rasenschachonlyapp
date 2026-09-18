const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Startbild ist vor React vorhanden und hat Ladeanzeige', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const splash = html.indexOf('id="app-startup-splash"');
  const root = html.indexOf('id="root"');
  assert.ok(splash >= 0, 'Startbild fehlt im HTML');
  assert.ok(root > splash, 'Startbild muss vor dem React-Root stehen');
  assert.match(html, /id="startup-splash-image"/);
  assert.match(html, /class="startup-spinner"/);
  assert.match(html, /top:\s*64%/);
  assert.match(html, /prefers-reduced-motion:[^}]+[\s\S]*?startup-spinner\s*\{\s*animation:\s*none;/);
});

test('Das gelieferte Motiv wird offline aus acht lokalen Teilen zusammengesetzt', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  for (let i = 1; i <= 8; i++) {
    assert.match(html, new RegExp('startbild/part-0' + i + '\\.js'));
    const part = fs.readFileSync('public/startbild/part-0' + i + '.js', 'utf8');
    assert.ok(part.length > 1000, 'Startbildteil ' + i + ' ist unerwartet klein');
  }
  assert.match(fs.readFileSync('public/startbild/part-01.js', 'utf8'), /data:image\/webp;base64,UklGR/);
  assert.match(html, /startup-splash-image"\)\.src\s*=\s*window\.__RASENSCHACH_STARTBILD__/);
  assert.doesNotMatch(html, /drawable-port-xhdpi\/splash\.png/);
});

test('Startbild bleibt mindestens kurz sichtbar und wird danach entfernt', () => {
  const main = fs.readFileSync('main.jsx', 'utf8');
  assert.match(main, /minimumVisibleMs\s*=\s*2200/);
  assert.match(main, /classList\.add\("is-hiding"\)/);
  assert.match(main, /startupSplash\.remove\(\)/);
});
