const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");

test("Startbild ist vor React vorhanden und hat Ladeanzeige", () => {
  const html = fs.readFileSync("index.html", "utf8");
  const splash = html.indexOf('id="app-startup-splash"');
  const root = html.indexOf('id="root"');
  assert.ok(splash >= 0, "Startbild fehlt im HTML");
  assert.ok(root > splash, "Startbild muss vor dem React-Root stehen");
  assert.match(html, /src="__RASENSCHACH_STARTBILD__"/);
  assert.match(html, /class="startup-spinner"/);
  assert.match(html, /top:\s*64%/);
  assert.match(html, /prefers-reduced-motion:[^}]+[\s\S]*?startup-spinner\s*\{\s*animation:\s*none;/);
});

test("Echtes Startmotiv wird offline als gueltiges WebP eingebettet", () => {
  const data = fs.readFileSync("startbild.b64", "utf8").trim();
  const bild = Buffer.from(data, "base64");
  const vite = fs.readFileSync("vite.config.js", "utf8");
  assert.ok(data.length > 80000, "Startbild-Daten sind unerwartet klein");
  assert.equal(bild.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(bild.subarray(8, 12).toString("ascii"), "WEBP");
  assert.match(vite, /readFileSync\(new URL\("\.\/startbild\.b64"/);
  assert.match(vite, /data:image\/webp;base64/);
  assert.match(vite, /transformIndexHtml/);
});

test("Startbild bleibt mindestens kurz sichtbar und wird danach entfernt", () => {
  const main = fs.readFileSync("main.jsx", "utf8");
  assert.match(main, /minimumVisibleMs\s*=\s*2200/);
  assert.match(main, /classList\.add\("is-hiding"\)/);
  assert.match(main, /startupSplash\.remove\(\)/);
});
