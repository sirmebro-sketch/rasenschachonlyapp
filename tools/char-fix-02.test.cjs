const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const app=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
const avatarStart=app.indexOf('function Avatar(');
const avatarEnd=app.indexOf('function ',avatarStart+20);
const avatar=app.slice(avatarStart,avatarEnd>avatarStart?avatarEnd:undefined);

test('CHAR-FIX-02: Hals liegt hinter Trikot und Kragen',()=>{
  assert(avatarStart>=0,'Avatar-Renderer muss auffindbar sein');
  const hals=avatar.indexOf('CHAR-FIX-02: Hals zuerst');
  const trikot=avatar.indexOf('Schultern und Trikot: feste Lage');
  const kragen=avatar.indexOf('Kragen liegt zuletzt auf dem Hals');
  assert(hals>=0,'CHAR-FIX-02-Layeranker fehlt');
  assert(trikot>hals,'Trikot muss nach dem Hals gerendert werden');
  assert(kragen>trikot,'Kragen muss als vorderste der drei Ebenen gerendert werden');
});

test('CHAR-FIX-02: offener V-Ausschnitt zeigt Kopf-Hautfarbe vor dem Trikot',()=>{
  const trikot=avatar.indexOf('Schultern und Trikot: feste Lage');
  const ausschnitt=avatar.indexOf('Offener V-Ausschnitt: die Innenflaeche zeigt Kopf-Hautfarbe');
  const kragen=avatar.indexOf('Kragen liegt zuletzt auf dem Hals');
  assert(trikot>=0 && ausschnitt>trikot && kragen>ausschnitt,'Layerfolge Trikot -> Hautausschnitt -> Kragen muss eindeutig sein');
  const zwischen=avatar.slice(trikot,kragen);
  assert.equal((zwischen.match(/fill=\{haut\}/g)||[]).length,1,'Genau eine Hautflaeche darf den offenen V-Ausschnitt bilden');
  assert.match(zwischen,/M44,\$\{KRAGEN_Y-1\} L50,\$\{KRAGEN_Y\+8\} L56,\$\{KRAGEN_Y-1\} Z/);
});

test('CHAR-FIX-02: feste Hals- und Kragenanker aus CHAR-FIX-01 bleiben erhalten',()=>{
  assert.match(avatar,/const KRAGEN_Y = 74;/);
  assert.match(avatar,/const HALS_OBEN_Y = 55;/);
  assert.match(avatar,/const HALS_BASIS_Y = 79;/);
  assert.match(avatar,/M43,\$\{HALS_OBEN_Y\} H57 V\$\{HALS_BASIS_Y\}/);
});
