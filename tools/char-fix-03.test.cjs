const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {build}=require('esbuild');

const root=path.resolve(__dirname,'..');
const KOEPFE=[
 {n:'Oval',b:25,j:15,kinn:71},
 {n:'Rund',b:27,j:19,kinn:69},
 {n:'Kantig',b:26,j:21,kinn:70},
 {n:'Schmal',b:23,j:12,kinn:73},
 {n:'Herz',b:26,j:11,kinn:72},
 {n:'Vollmond',b:28,j:24,kinn:66},
 {n:'Breit',b:29,j:22,kinn:69},
 {n:'Weich',b:25.5,j:21,kinn:67},
 {n:'Zart',b:24,j:15,kinn:70,kv:.58},
 {n:'Rundlich',b:27.5,j:21,kinn:68,kv:.58},
 {n:'Trapez',b:26,j:23,kinn:72,profil:'trapez'},
 {n:'Langkantig',b:24,j:19,kinn:72,profil:'lang'},
 {n:'Diamant',b:29,j:17,kinn:73,kv:.72,profil:'diamant'},
 {n:'Kurzbreit',b:30,j:27,kinn:64,profil:'kurzbreit'},
];

let E,temp;
before(async()=>{
 temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-char-fix-03-'));
 const outfile=path.join(temp,'render.cjs');
 await build({
  stdin:{contents:`
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Haarform} from './haarformen.jsx';
import {Bartform} from './bartformen.jsx';
export const haar=(index,weiblich,kopf)=>renderToStaticMarkup(<svg viewBox="0 0 100 100"><Haarform index={index} weiblich={weiblich} breite={kopf.b} kopfprofil={kopf.profil||''} kopfpfad="M18 8H82V76H18Z" farbe="#38241B" hell="#9A715C"/></svg>);
export const bart=(index,kopf,nase,mund)=>renderToStaticMarkup(<svg viewBox="0 0 100 110"><defs><clipPath id="kopf"><rect x="18" y="8" width="64" height="76"/></clipPath></defs><Bartform index={index} kopf={kopf} nase={nase} mund={mund} farbe="#38241B" hell="#9A715C" clipId="kopf"/></svg>);
`,resolveDir:root,loader:'jsx'},
  outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent'
 });
 E=require(outfile);
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});

test('CHAR-FIX-03: alle 14 Kopf × 12 Nase × 9 Mund Kombinationen besitzen kollisionsfreie Gesichtsanker',async()=>{
 const {gesichtsAnker}=await import('../gesichtsanker.js');
 let count=0;
 for(const kopf of KOEPFE)for(let nase=0;nase<12;nase++)for(let mund=0;mund<9;mund++){
  const g=gesichtsAnker(kopf,nase,mund);count++;
  for(const [key,value] of Object.entries(g))assert(Number.isFinite(value),`${kopf.n}/${nase}/${mund}: ${key} ist nicht endlich`);
  assert(g.mundTop>=g.naseBottom+.49,`${kopf.n} N${nase} M${mund}: Mund beginnt bei ${g.mundTop}, Nase endet ${g.naseBottom}`);
  assert(g.mundBottom<=g.kinn-.59,`${kopf.n} N${nase} M${mund}: Mund endet ${g.mundBottom}, Kinn ${g.kinn}`);
  assert(g.schnurrbartY>=g.naseBottom+2.24,`${kopf.n} N${nase} M${mund}: Schnurrbartanker zu hoch`);
  assert(g.schnurrbartY<=g.mundY-1.49,`${kopf.n} N${nase} M${mund}: Schnurrbartanker zu tief`);
  assert(g.mundScale>=.58&&g.mundScale<=1,`${kopf.n} N${nase} M${mund}: unplausible Mundskalierung`);
 }
 assert.equal(count,1512);
});

test('CHAR-FIX-03: alle Frisuren rendern auf allen 14 Kopfformen ohne ungültige Geometrie',()=>{
 let count=0;
 for(const kopf of KOEPFE){
  for(let id=0;id<26;id++){
   const svg=E.haar(id,false,kopf);count++;
   assert.doesNotMatch(svg,/NaN|undefined/);
   if(id!==11){assert.match(svg,/data-haar-typ=/);assert.match(svg,/data-haar-ebene="vorn"/);}
  }
  for(let id=0;id<24;id++){
   const svg=E.haar(id,true,kopf);count++;
   assert.doesNotMatch(svg,/NaN|undefined/);
   assert.match(svg,/data-haar-typ=/);
  }
 }
 assert.equal(count,700);
});

test('CHAR-FIX-03: Bartkatalog rendert auf allen Köpfen mit kritischen Nasen/Mündern ohne Überlaufdaten',()=>{
 const paare=[[3,5],[10,6],[11,8],[6,3]];
 let count=0;
 for(const kopf of KOEPFE)for(const [nase,mund] of paare)for(let id=1;id<=15;id++){
  const svg=E.bart(id,kopf,nase,mund);count++;
  assert.doesNotMatch(svg,/NaN|undefined/);
  assert.match(svg,new RegExp(`data-bart-id="${id}"`));
  assert.match(svg,new RegExp(`data-bart-nase="${nase}"`));
  assert.match(svg,new RegExp(`data-bart-mund="${mund}"`));
  if([3,11].includes(id))assert.match(svg,/data-bart-part="schnurrbart/,'reine Schnurrbärte müssen als eigene Oberlippenform vorliegen');
  else assert.match(svg,/mask=/,'Bartkörper müssen den Mundfreiraum respektieren');
 }
 assert.equal(count,840);
});

test('CHAR-FIX-03: App nutzt dieselben Gesichtsanker und reicht Nase/Mund an den Bart weiter',()=>{
 const app=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 assert.match(app,/import \{ gesichtsAnker \} from "\.\/gesichtsanker\.js";/);
 assert.match(app,/const gesicht = gesichtsAnker\(kopf,z\.nase,z\.mund\);/);
 assert.match(app,/translate\(0 \$\{gesicht\.naseDy\}\)/);
 assert.match(app,/const y = gesicht\.mundY;/);
 assert.match(app,/scale\(1 \$\{gesicht\.mundScale\}\)/);
 assert.match(app,/<Bartform index=\{z\.bart\} kopf=\{kopf\} nase=\{z\.nase\} mund=\{z\.mund\}/);
});

test('CHAR-FIX-03: neue Kopfprofile bekommen keine verkleinernde/hochgezogene Haarpassform',()=>{
 const haar=fs.readFileSync(path.join(root,'haarformen.jsx'),'utf8');
 for(const [profil,breite] of [['trapez','25.2'],['lang','24.2'],['diamant','25.8'],['kurzbreit','28.2']]){
  assert.match(haar,new RegExp(`${profil}:\\{breite:${breite.replace('.','\\.')},dy:0\\}`));
 }
 assert.match(haar,/const rasierKappe='M26 34/);
 assert.match(haar,/Q62 29 50 30 Q38 29 26 34/);
});
