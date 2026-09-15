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
export {bilanzLaden, bilanzErgaenzen, akaGruenden, SAVE_KEY, AKA_KEY, LIFE_KEY, createPlayer, develop, simulateSeason, vcFuer, vcPosten, vcAusHaeusern, leereAkademie, leereBilanz, KARTEN, VEREIN, zufallSetzen, rerollWildcard, ladenGesperrt, saisonSchlagzeile, saisonIndex, EVENTS, strangDran, strangWeiter, laufStand, laufWeiter};
export const renderReveal=card=>renderToStaticMarkup(<WildcardEnthuellung card={card} onFertig={()=>{}}/>);
export const renderShop=(spieler,schritt='training')=>renderToStaticMarkup(<VCLadenAnsicht wo="saison" vc={100} laden={{}} onKauf={()=>{}} spieler={spieler} schritt={schritt}/>);
export async function runFinish(q,initial={}) {
 const out={};const aka={...leereAkademie(),vc:100,verdient:200,gratisPacks:2,...initial.aka};
 const ges=initial.ges||leereBilanz(), verein=initial.verein||null, meta={}, ach={}, seen={}, wcSeen={}, hall=[], hsvZ=0;
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


test('Wildcard-Rückseite verrät weder Kartennamen noch Wirkung und deckt den Hintergrund',()=>{
 const html=E.renderReveal({r:'unfass',n:'GEHEIMER KARTENNAME',t:'VERBORGENE WIRKUNG'});
 assert(!html.includes('GEHEIMER KARTENNAME'));
 assert(!html.includes('VERBORGENE WIRKUNG'));
 assert.match(html,/background:#04050A/);
 assert.match(html,/backdrop-filter:none/);
 assert.match(html,/aria-hidden="true"/);
 assert.match(html,/wird aufgedeckt/);
});

for(const [weg,id] of [['treu','tr_4'],['hoeflich','tr_4b'],['still','tr_4c']]) {
 test('Trainer-Abschied folgt dem gespeicherten Kontakt: '+weg,()=>{
  const p={...sample(12),age:30,straenge:{trainer:{stufe:3,seit:9,weg}}};
  const eligible=()=>E.EVENTS.filter(e=>e.strang==='trainer' && E.strangDran(e,p) && e.cond(p));
  assert.deepEqual(eligible().map(e=>e.id),[id]);
  p.seasons.pop();assert.equal(eligible().length,0);p.seasons.push({});
  p.age=28;assert.equal(eligible().length,0);p.age=30;
  const e=eligible()[0];
  const save=JSON.parse(JSON.stringify(E.laufStand(p,'event',{queue:[e]},E.EVENTS,'35.172')));
  const loaded=E.laufWeiter(save,[...E.EVENTS].reverse());
  assert.equal(loaded.queue[0].id,id);
  assert.deepEqual(loaded.queue[0].choices.map(c=>c.id),e.choices.map(c=>c.id));
  E.strangWeiter(p,e,e.choices[0].roll[0].fx);
  assert.equal(eligible().length,0);
  assert.equal(p.straenge.trainer.weg,weg);
 });
}
test('Bereits gespeicherter alter Trainer-Abschied behält seine Auswahl und Folgen',()=>{
 for(const schema of [1,2]) {
  const entry={id:'tr_4',ctx:{},...(schema===1?{wahlen:[0,1]}:{auswahlIds:['tr_4.0','tr_4.1']})};
  const loaded=E.laufWeiter({p:sample(12),step:'event',ablauf:{schema,ei:0,queue:[entry]}},E.EVENTS);
  assert.deepEqual(loaded.queue[0].choices.map(c=>c.roll[0].fx.legacy),[34,14]);
 }
});
test('Trainer-Kontakt kann vor dem Abschied wieder aufgenommen werden',()=>{
 for(const id of ['tr_2b','tr_2c']) {
  const e=E.EVENTS.find(e=>e.id===id),p={...sample(5),straenge:{trainer:{stufe:1,seit:2,weg:e.weg}}};
  E.strangWeiter(p,e,e.choices[0].roll[0].fx);
  assert.equal(p.straenge.trainer.weg,'treu');
 }
});
test('Ereigniskatalog und Auswahlkennungen sind eindeutig',()=>{
 assert.equal(new Set(E.EVENTS.map(e=>e.id)).size,E.EVENTS.length);
 for(const e of E.EVENTS)assert.equal(new Set(e.choices.map(c=>c.id)).size,e.choices.length,e.id);
});


test('Turnier-Schlagzeile verwendet die Felder der Saisonbilanz und nennt das Ergebnis',()=>{
 const vor={year:'2026/27',club:'Probe',age:25,role:'Stammspieler',note:3,apps:30};
 const s={...vor,year:'2027/28',ntMajor:{turnier:'EM',res:'Halbfinale',y:2028}};
 const text=E.saisonSchlagzeile(s,vor,{seasons:[vor,s]});
 assert.deepEqual(text,{kopf:'EM',satz:'2028 · Halbfinale'});
 assert.notEqual(E.saisonSchlagzeile(s,vor,{seasons:[vor,s]},'EM').kopf,'EM');
});
test('Vereinsjahre und Saisonzuordnung bleiben nach JSON-Laden identisch',()=>{
 const vor={year:'2026/27',club:'Probe',age:25,role:'Stammspieler',note:3,apps:30};
 const s={...vor,year:'2027/28',age:26}, p={seasons:[vor,s]};
 const geladen=JSON.parse(JSON.stringify(s));
 assert.equal(E.saisonIndex(p.seasons,geladen),1);
 assert.deepEqual(E.saisonSchlagzeile(geladen,vor,p),E.saisonSchlagzeile(s,vor,p));
 assert.equal(E.saisonSchlagzeile(geladen,vor,p).kopf,'Das zweite Jahr');
 assert.equal(E.saisonIndex(p.seasons,{...geladen,year:'2028/29'}),-1);
 assert.equal(E.saisonIndex(p.seasons,{...geladen,club:'Anderer Verein'}),-1);
 assert.equal(E.saisonIndex(p.seasons,JSON.parse(JSON.stringify(vor))),0);
});


for(const n of [0,3,4,5,15]) test('Hausfortschritt beim echten Abschluss nach '+n+' Saisons',async()=>{
 const aka=E.akaGruenden(E.leereAkademie(),'Testakademie',2026);
 const old=E.VEREIN.vereinSaison, oldReady=E.VEREIN.spieltMit;let calls=0;
 E.VEREIN.spieltMit=()=>true;
 E.VEREIN.vereinSaison=()=>{calls++;return {fehler:'Kontrollierter Vereinsadapter'};};
 try{
  const r=await E.runFinish(player(n),{aka,verein:{name:'Testverein'}});
  assert.equal(r.Aka.jahr,2026+(n>=5?1:0));
  assert.equal(r.P.hausFortschritt,n>=5);
  assert.equal(calls,n>=5?1:0);
  assert.equal(r.Ges.hausKarrieren,n>=5?1:0);
 }finally{E.VEREIN.vereinSaison=old;E.VEREIN.spieltMit=oldReady;}
});
test('Nur fünfjährige Karrieren zählen für neue Freischaltungen; Altbestand bleibt offen',()=>{
 let g=E.leereBilanz();
 for(let i=0;i<6;i++)g=E.bilanzErgaenzen(g,player(4));
 assert.equal(g.hausKarrieren,0);assert.equal(E.VEREIN.freigeschaltet(g).akademie,false);
 for(let i=0;i<2;i++)g=E.bilanzErgaenzen(g,player(5));
 assert.equal(E.VEREIN.freigeschaltet(g).akademie,true);assert.equal(E.VEREIN.freigeschaltet(g).verein,false);
 for(let i=0;i<3;i++)g=E.bilanzErgaenzen(g,player(5));
 assert.equal(E.VEREIN.freigeschaltet(g).verein,true);
 for(const n of [0,1,2,4,5,20]){
  let alt=E.bilanzLaden({karrieren:n});
  alt=E.bilanzErgaenzen(alt,player(0));alt=E.bilanzLaden(JSON.parse(JSON.stringify(alt)));
  assert.equal(alt.hausKarrieren,0);
  assert.equal(E.VEREIN.freigeschaltet(alt).akademie,n>=2);
  assert.equal(E.VEREIN.freigeschaltet(alt).verein,n>=5);
 }
});
test('Exakter Verkaufserwartungswert jedes Packs liegt zwischen 80 und 120 Prozent',()=>{
 const ranks=['bronze','silber','gold','legende'];
 for(const pk of E.KARTEN.PACKS){
  let ev=0;const enumerate=(a,prob)=>{
   if(a.length<pk.karten){for(let i=0;i<4;i++)enumerate([...a,i],prob*(pk.chancen[ranks[i]]||0)/100);return;}
   if(pk.mind&&!a.some(i=>i>=ranks.indexOf(pk.mind)))a[a.indexOf(Math.min(...a))]=ranks.indexOf(pk.mind);
   ev+=prob*a.reduce((s,i)=>s+E.KARTEN.erloes({herkunft:'pack',stufe:ranks[i]}),0);
  };enumerate([],1);assert(ev/pk.preis>=.8&&ev/pk.preis<=1.2,pk.id+': '+ev);
 }
});
test('Neue Videoereignisse passen zur Position und ihre Entscheidungen bleiben ladbar',()=>{
 for(const [pos,id] of [['TW','video_tw'],['IV','video_def'],['ST','video_off']]){
  const p=player(2);p.pos=pos;p.age=20;
  const e=E.EVENTS.find(e=>e.id===id);assert(e.pos.includes(pos)&&e.cond(p));
  const late=E.EVENTS.find(e=>e.id==='video_spaeter');assert(!late.cond(p));
  p.flags.videobuch=true;p.age=30;p.seasons=Array(8).fill({});assert(late.cond(p));
  for(const event of [e,late]){
   const save=E.laufStand(p,'event',{queue:[event]},E.EVENTS,'35.174');
   assert.deepEqual(E.laufWeiter(JSON.parse(JSON.stringify(save)),E.EVENTS).queue[0].choices.map(c=>c.id),event.choices.map(c=>c.id));
  }
 }
});
