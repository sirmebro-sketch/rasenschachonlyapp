const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const bytes=p=>fs.readFileSync(path.join(root,p));

function assertWebp(buffer,label){
  assert.ok(buffer.length>1000,label+' ist unerwartet klein');
  assert.equal(buffer.subarray(0,4).toString('ascii'),'RIFF',label+' ist kein RIFF');
  assert.equal(buffer.subarray(8,12).toString('ascii'),'WEBP',label+' ist kein WebP');
}

test('APPICON: vollflaechige Quelle ist mit Android-Ressourcen verdrahtet',()=>{
  const source=bytes('artwork/app-icon-source.webp');
  const full=bytes('android/app/src/main/res/drawable-nodpi/app_icon_fullbleed_image.webp');
  const round=bytes('android/app/src/main/res/drawable-nodpi/app_icon_round_image.webp');
  assertWebp(source,'Icon-Quelle');
  assertWebp(full,'Android Fullbleed');
  assertWebp(round,'Android Rund');
  assert.ok(source.equals(full),'Fullbleed-Ressource muss direkt der freigegebenen Quelle entsprechen');

  const adaptive=read('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml');
  const adaptiveRound=read('android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml');
  for(const xml of [adaptive,adaptiveRound]){
    assert.match(xml,/@drawable\/app_icon_fullbleed/);
    assert.match(xml,/@drawable\/ic_launcher_foreground/);
  }
  assert.match(read('android/app/src/main/res/drawable/app_icon_fullbleed.xml'),/@drawable\/app_icon_fullbleed_image/);
  assert.match(read('android/app/src/main/res/drawable-v24/ic_launcher_foreground.xml'),/#00000000/);
  assert.match(read('android/app/src/main/res/mipmap/ic_launcher.xml'),/@drawable\/app_icon_fullbleed_image/);
  assert.match(read('android/app/src/main/res/mipmap/ic_launcher_round.xml'),/@drawable\/app_icon_round_image/);

  const manifest=read('android/app/src/main/AndroidManifest.xml');
  assert.match(manifest,/android:icon="@mipmap\/ic_launcher"/);
  assert.match(manifest,/android:roundIcon="@mipmap\/ic_launcher_round"/);

  for(const density of ['mdpi','hdpi','xhdpi','xxhdpi','xxxhdpi']){
    assert.equal(fs.existsSync(path.join(root,'android/app/src/main/res',`mipmap-${density}`,'ic_launcher.png')),false);
    assert.equal(fs.existsSync(path.join(root,'android/app/src/main/res',`mipmap-${density}`,'ic_launcher_round.png')),false);
  }
});
