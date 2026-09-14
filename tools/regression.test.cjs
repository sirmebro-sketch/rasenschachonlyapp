const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { build } = require('esbuild');
const root = path.resolve(__dirname, '..');
let E, B, temp;
const saved = new Map();

before(async () => {
  B = await import('../belohnungen.js');
  const { serialisierterSpeicher } = await import('../sicherung.js');
  globalThis.__rsTestStore = serialisierterSpeicher({
    get: async k => saved.has(k) ? {value:saved.get(k)} : null,
    set: async (k,v) => { saved.set(k,v); }, delete: async k => saved.delete(k),
  });
  const source = fs.readFileSync(path.join(root,'App.jsx'),'utf8');
  const part = (start,end) => {
    const a=source.indexOf(start), b=source.indexOf(end,a);
    assert(a>=0 && b>a, 'Handler für Regression nicht gefunden: '+start);
    return source.slice(a,b);
  };
  // Echte React-Handler aus der Quelle; nur Oberfläche und Speicheradapter ersetzen.
  const finish = [
    part('  const clone =', '  /* F01:'),
    part('  const bereiteHalle =', '  /* Erlebte Ereignisse'),
    part('  const bereiteErlebtes =', '  /* Errungenschaften über'),
    part('  const bereiteErfolge =', '  /* Eine Abteilung ausbauen'),
    part('  const finish =', '  const bucheAenderung ='),
  ].join('\n');
  const purchase = part('  const ladenKauf =', '  const finish =') +
    part('  const bucheAenderung =', '  // Eine Buchung darf');
  const setters = text => [...new Set([...text.matchAll(/\b(set[A-Z]\w*)\(/g)].map(m=>m[1]))]
    .map(n=>`const ${n}=v=>{out[${JSON.stringify(n.slice(3))}]=v;};`).join('\n');
  const extension = `
import {renderToStaticMarkup} from 'react-dom/server';
export {SAVE_KEY, AKA_KEY, LIFE_KEY, createPlayer, develop, simulateSeason, vcFuer, vcPosten, vcAusHaeusern, leereAkademie, leereBilanz, KARTEN, VEREIN, zufallSetzen, rerollWildcard, ladenGesperrt};
export const renderShop=(spieler,schritt='training')=>renderToStaticMarkup(<VCLadenAnsicht wo="saison" vc={100} laden={{}} onKauf={()=>{}} spieler={spieler} schritt={schritt}/>);
export async function runFinish(q,initial={}) {
 const out={};const aka={...leereAkademie(),vc:100,verdient:200,gratisPacks:2,...initial.aka};
 const ges=leereBilanz(), verein=initial.verein||null, meta={}, ach={}, seen={}, wcSeen={}, hall=[], hsvZ=0;
 const karten=KARTEN.leererPool(), kartenRef={current:karten}, abschlussRef={current:null}, buchungAktiv={current:false};
 ${setters(finish)}
 ${finish}
 await finish(q,'Rücktritt aus freien Stücken');
 if(out.LadeFehler)throw Error(out.LadeFehler);
 // Dieselbe Abschlussaktion darf keine zweite Buchung auslösen.
 await finish(q,'Rücktritt aus freien Stücken');
 return out;
}
export async function runPurchase(p,schritt,artikel='reroll') {
 const out={};const aka={...leereAkademie(),vc:100}, step=schritt;
 const queue=[],ei=0,er=null,growth=null,season=null,offers=[],buchungAktiv={current:false};
 ${setters(purchase)}
 ${purchase}
 await ladenKauf(VCLADEN.find(a=>a.id===artikel));
 return out;
}
`;
  temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-regression-'));
  const outfile=path.join(temp,'engine.cjs');
  await build({stdin:{contents:source+'\n'+extension,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent',plugins:[{
    name:'test-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store=globalThis.__rsTestStore;',loader:'js'}));}
  }]});
  E=require(outfile);
});
after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});delete globalThis.__rsTestStore;});
const sample=n=>({seasons:Array.from({length:n},()=>({})),trophies:[],nt:{caps:0},flags:{},wc:null});
const sum=rows=>rows.reduce((s,x)=>s+x.v,0);

for(const n of [0,1,2,3,14,15,16,30]) test(`Abschlussgrenzen bei ${n} Saisons einschließlich Boni`,()=>{
  const house=E.vcAusHaeusern({profis:1},{rang:1,aufstieg:true},null);
  const achievements=E.vcAusHaeusern(null,null,[{n:'Probe',s:'gold'}]);
  const b=B.abschlussBeleg(sample(n),{score:260,ehre:false},house,achievements);
  assert.equal(b.vc,n<3?0:22+4+35+22+2);
  assert.equal(b.gratisPacks,n>=15?1:0);
  assert.equal(sum(b.posten),b.vc);
  assert(b.posten.every(x=>typeof x.k==='string'&&Number.isInteger(x.v)&&x.v>0));
});

test('Rundung, Zuschläge und Mindestbetrag ergeben exakt die frühere Auszahlung ab drei Saisons',()=>{
 for(const score of [0,1,12,13,26,170,260,999,2600]) for(const extra of [false,true]){
  const p={...sample(3),trophies:extra?['Pokal']:[],nt:{caps:extra?52:0},flags:{legende:extra},wc:extra?{r:'hsv'}:null};
  const base=Math.round(score/26)+(extra?11+1+2+7+9:0);
  const expected=Math.max(5,Math.round(Math.round(base*1.18)*1.80));
  const b=B.laufbahnBeleg(p,{score,ehre:extra});assert.equal(b.vc,expected);assert.equal(sum(b.posten),expected);
 }
});

test('Alle Haus- und Errungenschaftsboni besitzen sichtbare Belegfelder',()=>{
 const b=E.vcAusHaeusern({profis:1,weltklasse:1,nationalspieler:1,turniere:1},{rang:1,aufstieg:true},[{n:'Probe',s:'legende'}]);
 assert.equal(b.posten.length,7);assert.equal(sum(b.posten),b.vc);
 assert(b.posten.every(x=>typeof x.k==='string'&&x.k.length>0&&Number.isInteger(x.v)));
});

function player(n){
 E.zufallSetzen(351710+n);
 const p=E.createPlayer({name:'Regression',nation:'GER',pos:'ST',foot:'rechts',number:9});
 for(let j=0;j<n;j++){E.develop(p);E.simulateSeason(p);p.age++;p.year++;p.contract=Math.max(1,p.contract);}
 return p;
}
for(const n of [0,2,3,14,15,16]) test(`Echter Abschluss-Handler bei ${n} Saisons: Beleg, Speicher, einmalige Gutschrift`,async()=>{
 saved.clear();const p=player(n), before=JSON.stringify(p);
 const result=await E.runFinish(p);
 assert.equal(JSON.stringify(p),before,'Eingabespieler unverändert');
 assert(result.P.retired);assert.equal(result.Phase,'end');
 assert.equal(result.Aka.vc-100,result.P.vcGewinn);
 assert.equal(result.Aka.verdient-200,result.P.vcGewinn);
 assert.equal(sum(result.P.vcPosten),result.P.vcGewinn);
 assert.equal(result.Aka.gratisPacks,2+(n>=15?1:0));
 if(n<3)assert.equal(result.Aka.vc,100);else assert(result.Aka.vc>100);
 assert.deepEqual(JSON.parse(saved.get(E.AKA_KEY)),result.Aka);
 assert.equal(JSON.parse(saved.get(E.LIFE_KEY)).karrieren,1);
 assert(!saved.has(E.SAVE_KEY));assert(!saved.has('rasenschach:import-transaktion'));
});

test('Shop zeigt den nutzlosen Tauschkauf gesperrt; Handler bucht keine Coins',async()=>{
 for(const [n,step] of [[1,'training'],[3,'training'],[0,'event'],[0,'result']]){
  saved.clear();const p=player(n);
  const html=E.renderShop(p,step);const button=html.match(/<button\b[^>]*>[\s\S]*?<\/button>/)[0];
  assert(button.includes('Noch eine Karte ziehen'));assert(button.includes('disabled'));
  assert(button.includes('Wildcard-Tausch nur vor dem ersten Training'));
  assert.deepEqual(await E.runPurchase(p,step),{});assert.equal(saved.size,0);
 }
});

test('Gültiger Tauschkauf vor dem ersten Training: genau 45 VC und nutzbarer Bestand',async()=>{
 saved.clear();const p=player(0);const html=E.renderShop(p);
 assert(!html.match(/<button\b[^>]*>[\s\S]*?<\/button>/)[0].includes('disabled'));
 const result=await E.runPurchase(p,'training');assert.equal(result.Aka.vc,55);assert.equal(result.P.laden.reroll,1);
 assert.equal(JSON.parse(saved.get(E.AKA_KEY)).vc,55);
 const count=result.P.wcRerolls||0;E.rerollWildcard(result.P);assert.equal(result.P.wcRerolls,count+1);
});

test('Vorratskauf ohne aktive Karriere bleibt möglich',async()=>{
 saved.clear();const result=await E.runPurchase(null,'training');assert.equal(result.Aka.vc,55);assert.equal(result.Aka.laden.reroll,1);
});
