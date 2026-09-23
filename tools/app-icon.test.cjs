const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const RES = path.join(ROOT, 'android/app/src/main/res');

function webpInfo(buffer) {
  assert.ok(buffer.length >= 30, 'WebP darf nicht leer oder abgeschnitten sein');
  assert.equal(buffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(buffer.subarray(8, 12).toString('ascii'), 'WEBP');
  const declaredSize = buffer.readUInt32LE(4) + 8;
  assert.equal(declaredSize, buffer.length, 'RIFF-Laenge muss exakt zur Datei passen');

  const marker = Buffer.from([0x9d, 0x01, 0x2a]);
  const frame = buffer.indexOf(marker);
  assert.ok(frame >= 0 && frame + 7 <= buffer.length, 'VP8-Bildmasse muessen lesbar sein');
  return {
    width: buffer.readUInt16LE(frame + 3) & 0x3fff,
    height: buffer.readUInt16LE(frame + 5) & 0x3fff,
  };
}

test('App-Icon-Quelle ist vollständig, quadratisch und identisch zur Android-Ressource', () => {
  const source = fs.readFileSync(path.join(ROOT, 'artwork/app-icon-source.webp'));
  assert.deepEqual(webpInfo(source), { width: 432, height: 432 });

  const androidSource = fs.readFileSync(path.join(RES, 'drawable-nodpi/app_icon_source.webp'));
  assert.deepEqual(androidSource, source);
});

test('Adaptive Launcher hält das komplette Motiv in der Android-Safe-Area', () => {
  const manifest = fs.readFileSync(path.join(ROOT, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
  assert.match(manifest, /android:icon="@mipmap\/ic_launcher"/);
  assert.match(manifest, /android:roundIcon="@mipmap\/ic_launcher_round"/);

  const foreground = fs.readFileSync(path.join(RES, 'drawable-v24/ic_launcher_foreground.xml'), 'utf8');
  assert.match(foreground, /@drawable\/app_icon_source/);
  for (const side of ['left', 'top', 'right', 'bottom']) {
    assert.match(foreground, new RegExp(`android:${side}="15dp"`));
  }

  const background = fs.readFileSync(path.join(RES, 'drawable/app_icon_background.xml'), 'utf8');
  assert.match(background, /#081018/);

  for (const name of ['ic_launcher.xml', 'ic_launcher_round.xml']) {
    const legacy = fs.readFileSync(path.join(RES, 'mipmap-anydpi', name), 'utf8');
    assert.match(legacy, /@drawable\/app_icon_source/);

    const adaptive = fs.readFileSync(path.join(RES, 'mipmap-anydpi-v26', name), 'utf8');
    assert.match(adaptive, /<background android:drawable="@drawable\/app_icon_background"\/>/);
    assert.match(adaptive, /<foreground android:drawable="@drawable\/ic_launcher_foreground"\/>/);
    assert.doesNotMatch(adaptive, /app_icon_source"\/>\s*<foreground/);
  }

  for (const density of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
    for (const name of ['ic_launcher.png', 'ic_launcher_round.png']) {
      assert.equal(
        fs.existsSync(path.join(RES, `mipmap-${density}`, name)),
        false,
        `veraltete Launcher-PNG darf nicht konkurrieren: ${density}/${name}`,
      );
    }
  }
});
