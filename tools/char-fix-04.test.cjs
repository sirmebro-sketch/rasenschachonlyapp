const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {build}=require('esbuild');

// Der Safe-Patch-Lauf dient zusätzlich als vollständiges CHAR-FIX-04 Regression-/Build-Gate.
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
const PAARE=[[3,5],[10,6],[11,8],[6,3]];
const M_KRIT=[0,1,2,3,6,12,13,14,15,20,21,23,30];
const W_KRIT=[0,3,7,9,19,21,24,25,26];
let E,temp;

const attr=(svg,name)=>{
 const m=svg.match(new RegExp(name+'="([^"]+)"'));
 assert(m,'Attribut '+name+' fehlt in '+svg.slice(0,180));
 return m[1];
};

before(async()=>{
 const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const extension=`
import {renderToStaticMarkup} from 'react-dom/server';
export const cf4Haar=(index,g,kopfId)=>{
 const kopf=KOPFFORM[kopfId],kopfD=kopfPfad(kopf);
 return renderToStaticMarkup(<svg viewBox="0 0 100 100"><path data-test-kopf d={kopfD}/><Haarform index={index} weiblich={g==='w'} breite={kopf.b} kopfprofil={kopf.profil||''} kopfpfad={kopfD} farbe="#241915" hell="#8f6f5e"/></svg>);
};
export const cf4Bart=(index,kopfId,nase,mund)=>{
 const kopf=KOPFFORM[kopfId],kopfD=kopfPfad(kopf);
 return renderToStaticMarkup(<svg viewBox="0 0 100 110"><defs><clipPath id="cf4kopf"><path d={kopfD}/></clipPath></defs><Bartform index={index} kopf={kopf} nase={nase} mund={mund} farbe="#241915" hell="#8f6f5e" clipId="cf4kopf"/></svg>);
};
`;
 temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-char-fix-04-'));
 const outfile=path.join(temp,'render.cjs');
 await build({stdin:{contents:source+'\n'+extension,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent',plugins:[{
  name:'test-storage',setup(b){b.onLoad({filter:/[/\\]storage\\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}));}
 }]});
 E=require(outfile);
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});

test('CHAR-FIX-04: alle Frisuren auf Kopf 10–13 rendern und die Fokusformen nutzen die reale Kopfpassung',()=>{
 let count=0;
 for(let kopfId=10;kopfId<=13;kopfId++){
  const kopf=KOEPFE[kopfId];
  for(let id=0;id<31;id++){
   const svg=E.cf4Haar(id,'m',kopfId);count++;
   assert.doesNotMatch(svg,/NaN|undefined/);
   if(id!==11)assert.match(svg,/data-haar-typ=/);
  }
  for(let id=0;id<31;id++){
   const svg=E.cf4Haar(id,'w',kopfId);count++;
   assert.doesNotMatch(svg,/NaN|undefined/);
   assert.match(svg,/data-haar-typ=/);
  }
  for(const id of M_KRIT){
   const svg=E.cf4Haar(id,'m',kopfId);
   if(id!==7){
    assert.equal(attr(svg,'data-haar-passung'),'kopfkontur',kopf.n+' M'+id+' braucht Kopfkontur-Passung');
    assert(Number(attr(svg,'data-haar-breite'))>=kopf.b+.79,kopf.n+' M'+id+' ist horizontal zu klein');
   }
  }
  for(const id of W_KRIT){
   const svg=E.cf4Haar(id,'w',kopfId);
   assert.equal(attr(svg,'data-haar-passung'),'kopfkontur',kopf.n+' W'+id+' braucht Kopfkontur-Passung');
   assert(Number(attr(svg,'data-haar-breite'))>=kopf.b+.79,kopf.n+' W'+id+' ist horizontal zu klein');
  }
 }
 assert.equal(count,248);
});

test('CHAR-FIX-04: alte Köpfe behalten bei kopfnahen Kurzformen ihre bisherige Breitenbasis',()=>{
 for(let kopfId=0;kopfId<10;kopfId++){
  const kopf=KOEPFE[kopfId];
  for(const [g,id] of [['m',1],['m',3],['m',13],['m',21],['w',0],['w',7],['w',19]]){
   const svg=E.cf4Haar(id,g,kopfId);
   assert.equal(attr(svg,'data-haar-passung'),'standard');
   assert(Math.abs(Number(attr(svg,'data-haar-breite'))-kopf.b)<.001,kopf.n+' '+g+id+' darf nicht global skaliert werden');
  }
 }
});

test('CHAR-FIX-04: Kinnfamilie startet unter dem echten Mund und bleibt am tatsächlichen Kinn zentriert',()=>{
 let count=0;
 for(let kopfId=0;kopfId<KOEPFE.length;kopfId++)for(const [nase,mund] of PAARE)for(const id of [4,5,14]){
  const kopf=KOEPFE[kopfId],svg=E.cf4Bart(id,kopfId,nase,mund);count++;
  const mundBottom=Number(attr(svg,'data-bart-mundbottom'));
  const kinn=Number(attr(svg,'data-bart-kinn-y'));
  const top=Number(attr(svg,'data-bart-chin-top'));
  const bottom=Number(attr(svg,'data-bart-chin-bottom'));
  const half=Number(attr(svg,'data-bart-chin-half'));
  assert(Math.abs(kinn-kopf.kinn)<.01,kopf.n+' B'+id+': falscher Kinnanker');
  assert(top>=mundBottom+.43,kopf.n+' B'+id+': Bart beginnt auf Mund/Lippe');
  assert(top<=kinn-.28,kopf.n+' B'+id+': Bart beginnt unterhalb des Kinns');
  assert(bottom>kinn+1.5,kopf.n+' B'+id+': Kinnanteil wird wieder am Kopfclip abgeschnitten');
  assert(half>=3&&half<=9.1,kopf.n+' B'+id+': unplausible Kinnbreite');
  assert.doesNotMatch(svg,/NaN|undefined/);
 }
 assert.equal(count,168);
});

test('CHAR-FIX-04: Kinnbart und Anker reagieren auf schmale/breite Kiefer statt fester historischer Breite',()=>{
 for(const id of [4,14]){
  const schmal=E.cf4Bart(id,3,3,5);
  const breit=E.cf4Bart(id,13,3,5);
  assert(Number(attr(breit,'data-bart-chin-half'))>Number(attr(schmal,'data-bart-chin-half'))+.8,'B'+id+' muss mit dem Kiefer breiter werden');
 }
});

test('CHAR-FIX-04: kompletter Bartkatalog bleibt über alle Köpfe und kritischen Gesichter gültig',()=>{
 let count=0;
 for(let kopfId=0;kopfId<KOEPFE.length;kopfId++)for(const [nase,mund] of PAARE)for(let id=1;id<=15;id++){
  const svg=E.cf4Bart(id,kopfId,nase,mund);count++;
  assert.match(svg,new RegExp('data-bart-id="'+id+'"'));
  assert.doesNotMatch(svg,/NaN|undefined/);
  const naseBottom=Number(attr(svg,'data-bart-nasebottom'));
  const mundBottom=Number(attr(svg,'data-bart-mundbottom'));
  assert(mundBottom>naseBottom,kopfId+' B'+id+': Gesichtsanker vertauscht');
 }
 assert.equal(count,840);
});
