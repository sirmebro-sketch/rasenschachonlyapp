const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {build}=require('esbuild');

const root=path.resolve(__dirname,'..');
let E,temp;

before(async()=>{
 temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-bart-'));
 const outfile=path.join(temp,'bart.cjs');
 await build({
  stdin:{
   contents:`
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Bartform} from './bartformen.jsx';
export const renderBart=(index,kopf={b:25,j:15,kinn:71},farbe='#38241B')=>renderToStaticMarkup(
 <svg viewBox="0 0 100 100"><defs><clipPath id="kopf"><path d="M20 20H80V82H20Z"/></clipPath></defs><Bartform index={index} kopf={kopf} farbe={farbe} hell="#E7C19F" clipId="kopf"/></svg>
);
`,
   resolveDir:root,
   loader:'jsx'
  },
  outfile,
  bundle:true,
  platform:'node',
  format:'cjs',
  logLevel:'silent'
 });
 E=require(outfile);
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});

const namen=['Glatt','Stoppeln','Dreitagebart','Schnurrbart','Kinnbart','Ziegenbart','Kurzer Vollbart','Langer Vollbart','Kinnriemen','Koteletten','Schnurrbart und Stoppeln','Breiter Schnurrbart','Konturierter Bart','Spitzer Vollbart','Ankerbart','Breiter Vollbart'];

test('CHAR-P1-04: gespeicherte Bart-IDs 0–15 behalten Namen und Reihenfolge',async()=>{
 const {PORTRAET_NAMEN}=await import('../portraet.js');
 assert.deepEqual(PORTRAET_NAMEN.bart,namen);
});

test('CHAR-P1-04: alle 15 sichtbaren Bart-IDs besitzen eine eigene SVG-Silhouette',()=>{
 const bilder=[];
 for(let id=1;id<=15;id++){
  const svg=E.renderBart(id);
  assert.match(svg,new RegExp(`data-bart-id="${id}"`));
  assert.doesNotMatch(svg,/NaN|undefined/);
  bilder.push(svg.replace(/data-bart-id="\d+"/,'data-bart-id="x"'));
 }
 assert.equal(new Set(bilder).size,15,'jede sichtbare Bart-ID muss geometrisch eigenständig sein');
});

test('CHAR-P1-04: Semantik von Stoppeln, Kinnriemen, Koteletten und Ankerbart bleibt eindeutig',()=>{
 const stoppeln=E.renderBart(1),riemen=E.renderBart(8),koteletten=E.renderBart(9),anker=E.renderBart(14);
 assert.match(stoppeln,/data-bart-part="stoppeln-kiefer"/);
 assert.match(stoppeln,/stroke-dasharray/);
 assert.match(riemen,/data-bart-part="kinnriemen"/);
 assert.doesNotMatch(riemen,/data-bart-part="schnurrbart"/);
 assert.match(koteletten,/data-bart-part="kotelette-links"/);
 assert.match(koteletten,/data-bart-part="kotelette-rechts"/);
 assert.doesNotMatch(koteletten,/data-bart-part="schnurrbart"/);
 assert.match(anker,/data-bart-part="anker"/);
 assert.match(anker,/data-bart-part="schnurrbart"/);
});

test('CHAR-P1-04: Bartkonturen reagieren auf Kieferbreite, Kinnhöhe und neue Kopfprofile',()=>{
 const koepfe=[
  {b:23,j:12,kinn:73},
  {b:29,j:22,kinn:69},
  {b:26,j:17,kinn:70,profil:'trapez'},
  {b:25,j:14,kinn:72,profil:'lang'},
  {b:27,j:13,kinn:70,profil:'diamant'},
  {b:29,j:23,kinn:67,profil:'kurzbreit'}
 ];
 for(const id of [2,6,7,8,9,12,13,15]){
  const varianten=koepfe.map(k=>E.renderBart(id,k));
  assert.equal(new Set(varianten).size,koepfe.length,`Bart ${id} muss alle geprüften Kieferformen geometrisch abbilden`);
  for(const svg of varianten)assert.doesNotMatch(svg,/NaN|undefined/);
 }
 assert.match(E.renderBart(7,koepfe[3]),/data-bart-profil="lang"/);
 assert.match(E.renderBart(15,koepfe[5]),/data-bart-profil="kurzbreit"/);
});
