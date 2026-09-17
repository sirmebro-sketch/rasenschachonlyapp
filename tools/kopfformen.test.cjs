const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {build}=require('esbuild');

const root=path.resolve(__dirname,'..');
let E,temp;

before(async()=>{
 const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const extension=`
export const kopfTestInfo=()=>({
 formen:KOPFFORM.map(x=>({...x})),
 anzahl:ZUEGE_ANZAHL({},false).kopf,
 alt:(kennung,g='m',statur)=>zuegeAusKennung(kennung,g,'GER',{},statur).kopf,
 pfade:KOPFFORM.map(k=>kopfPfad(k)),
});`;
 temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-kopf-'));
 const outfile=path.join(temp,'engine.cjs');
 await build({stdin:{contents:source+'\n'+extension,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent',plugins:[{
  name:'test-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}));}
 }]});
 E=require(outfile);
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});});

const altFormen=[
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
];
function mische(kennung,i){
 let x=((kennung|0)^((i+1)*0x9E3779B1))>>>0;
 x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return x>>>0;
}
const altKopf=kennung=>mische(Math.abs(kennung|0),12)%10;

test('CHAR-P1-01: gespeicherte Kopf-IDs 0–9 behalten exakt ihre Bedeutung',()=>{
 const info=E.kopfTestInfo();
 assert.deepEqual(info.formen.slice(0,10),altFormen);
});

test('CHAR-P1-01: neue Kopfformen hängen ausschließlich als IDs 10–13 an',()=>{
 const info=E.kopfTestInfo();
 assert.equal(info.anzahl,14);
 assert.deepEqual(info.formen.slice(10).map(x=>x.n),['Trapez','Langkantig','Diamant','Kurzbreit']);
 assert.deepEqual(info.formen.slice(10).map(x=>x.profil),['trapez','lang','diamant','kurzbreit']);
 assert.equal(new Set(info.pfade).size,14,'jede Kopfform braucht eine eigene Außenkontur');
});

test('CHAR-P1-01: historische Seed-Porträts bleiben trotz neuer Editorformen auf derselben Kopf-ID',()=>{
 const info=E.kopfTestInfo();
 for(const g of ['m','w'])for(let seed=1;seed<=250;seed++)assert.equal(info.alt(seed,g),altKopf(seed),g+'/'+seed);
 for(const statur of ['schlank','hochgewachsen','kraftvoll'])for(let seed=1;seed<=100;seed++)assert(info.alt(seed,'m',statur)<10,statur+'/'+seed);
});
