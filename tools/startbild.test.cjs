const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Startbild ist vor React vorhanden und hat Ladeanzeige', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  const splash = html.indexOf('id="app-startup-splash"');
  const root = html.indexOf('id="root"');
  assert.ok(splash >= 0, 'Startbild fehlt im HTML');
  assert.ok(root > splash, 'Startbild muss vor dem React-Root stehen');
  assert.match(html, /data:image\/webp;base64,[A-Za-z0-9+/=]+/);
  assert.match(html, /class="startup-spinner"/);
  assert.match(html, /top:\s*64%/);
});

test('Startbild bleibt mindestens kurz sichtbar und wird danach entfernt', () => {
  const main = fs.readFileSync('main.jsx', 'utf8');
  assert.match(main, /minimumVisibleMs\s*=\s*2200/);
  assert.match(main, /classList\.add\("is-hiding"\)/);
  assert.match(main, /startupSplash\.remove\(\)/);
});
