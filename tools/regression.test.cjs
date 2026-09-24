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
export {simTable, LEAGUES, karriereZeitraum, verdict, vorsatzBelohnen, vorsatzPunkte, bilanzLaden, bilanzErgaenzen, rekordListe, akaGruenden, akaVerbuchen, SAVE_KEY, AKA_KEY, LIFE_KEY, createPlayer, develop, simulateSeason, vcFuer, vcPosten, vcAusHaeusern, leereAkademie, leereBilanz, KARTEN, VEREIN, zufallSetzen, rerollWildcard, ladenGesperrt, saisonSchlagzeile, saisonIndex, EVENTS, strangDran, strangWeiter, laufStand, laufWeiter};
export const renderCreate=()=>renderToStaticMarkup(<CreateScreen meta={{}} onStart={()=>{}} onBack={()=>{}}/>);
export const renderPortraits=()=>renderToStaticMarkup(<>{['m','w'].flatMap(g=>Array.from({length:4},(_,i)=><Avatar key={g+i} seed={1} g={g} zuege={{...zuegeAusKennung(1,g,'GER',{}),stil:2,haut:10+i,haar:9+i,frisur:(g==='w'?14:16)+i,details:i,bart:g==='w'?0:10+i%3}}/>))}</>);
export const renderEnd=p=>renderToStaticMarkup(<EndScreen p={p} onNew={()=>{}}/>);
export const renderVereinAbschluss=(v,ergebnis,ges)=>renderToStaticMarkup(<VereinAbschluss v={v} ergebnis={ergebnis} ges={ges||{}} onNeu={()=>{}} onZurueck={()=>{}}/>);
export const renderVerein=(v,aka,reiter)=>renderToStaticMarkup(<VereinScreen v={v} aka={aka} startReiter={reiter} onAendern={()=>{}} onZurueck={()=>{}} onAbschluss={()=>{}}/>);
export const renderPacks=(pool,reiter='laden',verein=null)=>renderToStaticMarkup(<Packladen vc={100} pool={pool} verein={verein} gratis={1} startpaket={false} startReiter={reiter} onKauf={()=>{}} onGratis={()=>{}} onStartpaket={()=>{}} onEinsetzen={()=>{}} onEntfernen={()=>{}} onVerkauf={()=>{}} onZurueck={()=>{}}/>);
export const renderPortraitCard=k=>renderToStaticMarkup(<Spielerkarte karte={k}/>);
export const renderPortraitOriginal=h=>renderToStaticMarkup(<Avatar seed={h.avatar} zuege={h.zuege} g={h.g} nat={h.natId} size={54}/>);
export const renderWildcard=card=>renderToStaticMarkup(<WildcardCard card={card} big aufdeckung/>);
export const renderReveal=card=>renderToStaticMarkup(<WildcardEnthuellung card={card} onFertig={()=>{}}/>);
export const renderShop=(spieler,schritt='training')=>renderToStaticMarkup(<VCLadenAnsicht wo="saison" vc={100} laden={{}} onKauf={()=>{}} spieler={spieler} schritt={schritt}/>);
export const renderKarriereRueckblick=p=>renderToStaticMarkup(<KarriereRueckblick p={p} onFertig={()=>{}}/>);
export const renderSaisonRueckblick=(p,s)=>renderToStaticMarkup(<SaisonRueckblick p={p} s={s} onFertig={()=>{}}/>);
export const renderHall=(ges)=>renderToStaticMarkup(<HallScreen hall={[]} ges={ges} aka={null} verein={null} onBack={()=>{}}/>);
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

test('Wildcard-Vorderseite hat je Seltenheit genau eine Folie ohne alten Glanzstreifen',()=>{
 for(const [r,folie,stark] of [['normal',false,false],['selten',false,false],['aussen',false,false],['unfass',true,false],['welt',true,true],['goat',true,true]]){
  const html=E.renderWildcard({r,n:'Karte',t:'Wirkung'});
  // Gemeinsame Vorderseite: Spielerpass und Aufdeckung benutzen denselben Renderer.
  assert.equal((html.match(/class="rs-band"/g)||[]).length,0,r);
  assert.equal((html.match(/class="rs-materialkante/g)||[]).length,folie?1:0,r);
  assert.equal(html.includes('rs-folie-stark'),stark,r);
 }
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
test('Ruhmeshallen-Rekordbuch trennt Bestwerte, Gesamtsummen und Kapitänslaufbahnen korrekt',()=>{
 const g={...E.leereBilanz(),karrieren:5,bestPunkte:2726,ovrMax:95,apps:2343,goals:614,
  assists:241,cs:318,toreSaisonMax:39,caps:458,titel:53,meister:21,pokale:6,
  intTitel:24,ntTitel:2,treueMax:18,altMax:40,aufstiege:6,kapitaen:1,
  laender:{GER:2,ENG:1,ESP:1,ITA:1},ligen:{A:1,B:1,C:1},vereine:{A:2,B:1}};
 const r=E.rekordListe(g), by=new Map(r.map(x=>[x.titel,x]));
 assert.equal(by.get('Pflichtspiele').wert,2343);
 assert.equal(by.get('Pflichtspiele').gruppe,'gesamt');
 assert.equal(by.get('Karrierepunkte').gruppe,'best');
 assert.equal(by.get('Bespielte Länder').wert,4);
 assert.equal(by.get('Laufbahnen als Kapitän').wert,1);
 assert.equal(by.get('Laufbahnen als Kapitän').hinweis,'mind. einmal Vereinskapitän');
 assert(!r.some(x=>x.titel.startsWith('Meiste ')));
 assert(!r.some(x=>x.titel==='Saisons als Kapitän'||x.titel==='Ältester Einsatz'));
 const html=E.renderHall(g);
 assert(html.includes('Bestwerte')&&html.includes('Gesamtbilanz')&&html.includes('Stationen &amp; Rollen'));
 assert(html.includes('Bestwerte und Summen getrennt'));
 assert(html.includes('Spiele ohne Gegentor'));
 assert(!html.includes('Meiste Pflichtspiele'));
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
/* Der Langzeitlauf (tools/langzeit.cjs) läuft nicht in der CI — er braucht
   Minuten. Seine Schnittmarken in App.jsx wären damit unbewacht: bis
   15.09.2026 endete sein Handler-Block an der ungenutzten Funktion
   `quickSim`, deren Entfernen ihn mit einer irreführenden Meldung beendet
   hätte, und das erst beim nächsten Lauf von Hand. Diese Prüfung schließt
   die Lücke — sie kostet Millisekunden und meldet ein Versehen sofort.
   Siehe README.md.

   Die Prüfungen in DIESER Datei brauchen das nicht: sie schneiden ebenfalls
   textlich aus App.jsx, laufen aber bei jedem Push, und ihr `part` bricht
   mit Meldung ab, sobald eine Marke fehlt. */
test('Prüfstand-Marken für den Langzeitlauf stehen eindeutig in App.jsx',()=>{
 const {BLOECKE,block,grenzen,anfang,ende}=require('./anker.cjs');
 const quelle=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 for(const b of BLOECKE){
  const inhalt=block(quelle,b.name);
  assert(inhalt.includes(b.pflicht),b.name+' umschließt '+b.zweck+' nicht mehr');
  assert(inhalt.trim().length>0,b.name+' ist leer');
  assert.equal(quelle.split(anfang(b.name)).length-1,1,b.name+': Anfangsmarke nicht eindeutig');
  assert.equal(quelle.split(ende(b.name)).length-1,1,b.name+': Endemarke nicht eindeutig');
 }
 // Eine verschobene, entfernte oder doppelte Marke muss auffallen, nicht stillschweigend etwas anderes liefern.
 for(const b of BLOECKE){
  assert.throws(()=>block(quelle.replace(anfang(b.name),''),b.name),/Prüfstand-Marke/);
  assert.throws(()=>block(quelle.replace(ende(b.name),''),b.name),/Prüfstand-Marke/);
  assert.throws(()=>block(quelle+'\n'+ende(b.name),b.name),/Prüfstand-Marke/);
  /* Der Pflichtinhalt muss IM BLOCK verschwinden, nicht irgendwo in der Datei:
     der Ankerkommentar oberhalb zitiert „const chooseTraining =" im Fließtext,
     und ein naives replace() hätte dieses Zitat erwischt statt des Handlers.
     Deshalb gezielt über die ermittelten Blockgrenzen. */
  const g=grenzen(quelle,b.name);
  const verbogen=quelle.slice(0,g.von)+quelle.slice(g.von,g.bis).replace(b.pflicht,'const irgendwasAnderes =')+quelle.slice(g.bis);
  assert.throws(()=>block(verbogen,b.name),/umschließt nicht mehr/);
 }
 assert.throws(()=>block(quelle,'gibtesnicht'),/Unbekannter Prüfstand-Block/);
});


test('Vorsatz im echten Abschluss: Spielerbonus einmal, Punkte exakt in Gesamtwertung',async()=>{
 const p=player(10);p.vorsatz='lange';const ohne=E.verdict({...p,vorsatz:null}).score;
 const r=await E.runFinish(p);
 assert.equal(r.P.verdict.score-ohne,45);
 assert(r.P.vorsatzLohn.lange);
 assert.equal(r.P.fitness,Math.min(100,p.fitness+10));
 assert.equal(E.verdict(r.P).score,r.P.verdict.score);
});
test('Buch- und Knieabschlüsse folgen dem Weg; historische Auswahlen bleiben ladbar',()=>{
 for(const [strang,stufe,wege,ids] of [['buch',3,['offen','kontrolle','ohne'],['bu_3','bu_3_kontrolle','bu_3_ohne']],['knie',3,['getragen','behandelt','pausiert'],['kn_3','kn_3_behandelt','kn_3_pausiert']]]){
  for(let i=0;i<wege.length;i++){
   const p=player(10);p.straenge={[strang]:{stufe:stufe-1,seit:5,weg:wege[i]}};
   const eligible=E.EVENTS.filter(e=>e.strang===strang&&E.strangDran(e,p)&&e.cond(p));
   assert.deepEqual(eligible.map(e=>e.id),[ids[i]]);
   const saved=E.laufStand(p,'event',{queue:eligible},E.EVENTS,'35.175');
   assert.equal(E.laufWeiter(JSON.parse(JSON.stringify(saved)),E.EVENTS).queue[0].id,ids[i]);
  }
 }
 for(const id of ['bu_3','kn_3']){
  const saved={p:player(10),step:'event',ablauf:{schema:1,ei:0,queue:[{id,wahlen:[0,1],ctx:{}}]}};
  assert.deepEqual(E.laufWeiter(saved,E.EVENTS).queue[0].choices.map(c=>c.id),[id+'.0',id+'.1']);
 }
});

test('Zweiter Bildungsanlauf wartet zwei Saisons und respektiert Abbruch und vorhandenen Abschluss',()=>{
 const e=E.EVENTS.find(e=>e.id==='bildung_spaet_ende'),p=player(10);
 p.flags={};p.straenge={bildung:{stufe:1,seit:9,weg:'lernen'}};
 assert(!E.strangDran(e,p));p.straenge.bildung.seit=8;assert(E.strangDran(e,p));assert(e.cond(p));
 p.straenge.bildung.weg='ohne';assert(!E.strangDran(e,p));
 p.flags.abschluss=true;assert(!e.cond(p));
});
test('Mentor-Abschluss braucht Kontakt und zwei Saisons Abstand',()=>{
 const e=E.EVENTS.find(e=>e.id==='video_abschied'),p=player(10);p.age=35;p.evLog={};
 assert(!e.cond(p));p.videoKontakt={name:'Alex',seit:5};p.evLog.video_kontakt=9;assert(!e.cond(p));
 p.evLog.video_kontakt=8;assert(e.cond(p));assert(e.text({p}).includes('Alex'));
});
/* 15.09.2026: Beide Rückblicke werden hier WIRKLICH gerendert. Der Anlass ist
   ein Fehler aus dem Gerätetest: im KarriereRueckblick stand eine Zeile, die
   `s.saisonZiel` las, obwohl die Komponente nur `{ p, onFertig }` bekommt —
   jedes Karriereende mit mindestens einem Pflichtspiel endete dadurch im
   Fehlerbildschirm („s is not defined").

   Warum das keine der 86 bestehenden Prüfungen gefunden hat: `runFinish`
   prüft den Abschluss-HANDLER, der Langzeitlauf ersetzt die Oberfläche
   vollständig. Den Rückblick hat schlicht nie etwas gezeichnet. Ein
   Renderlauf kostet Millisekunden und hätte den Fehler am Tag seiner
   Entstehung gemeldet. */
test('Karriererückblick einer beendeten Laufbahn lässt sich zeichnen',()=>{
 /* Gezeichnet wird immer nur die erste Seite — die übrigen entstehen beim
    Weitertippen. Das genügt: die Seitenliste wird vollständig aufgebaut,
    bevor die erste erscheint, und genau dabei ist der Fehler entstanden.
    Deshalb prüft der Zähler „1/N", dass mehr als eine Seite gebaut wurde. */
 for(const n of [1,3,5,12]){
  const p=player(n);p.retired=true;p.verdict=E.verdict(p);
  assert(p.tot.apps>0,'Voraussetzung: Laufbahn mit Pflichtspielen ('+n+' Saisons)');
  const html=E.renderKarriereRueckblick(p);
  assert(html.includes('Deine Laufbahn'),n+' Saisons: Kopf fehlt');
  const seiten=html.match(/1\s*\/\s*(\d+)/);
  assert(seiten&&Number(seiten[1])>1,n+' Saisons: keine Seitenfolge aufgebaut');
 }
 // Ohne Pflichtspiele entfällt die Seite „Auf dem Platz"; zeichnen muss es trotzdem.
 const leer=player(1);leer.retired=true;leer.verdict=E.verdict(leer);leer.tot.apps=0;
 assert(E.renderKarriereRueckblick(leer).includes('Deine Laufbahn'));
});
test('Saisonrückblick zeichnet und zeigt das Saisonziel genau dann, wenn es eines gibt',()=>{
 const p=player(3), s=p.seasons.at(-1);
 const ohne=E.renderSaisonRueckblick(p,{...s,saisonZiel:undefined});
 assert(ohne.includes('Pflichtspiele')&&!ohne.includes('Saisonziel'),'ohne Zielfeld darf nichts erfunden werden');
 const mit=E.renderSaisonRueckblick(p,{...s,saisonZiel:{n:'Regelmäßig auf dem Platz',soll:20,ist:24,geschafft:true}});
 assert(mit.includes('Saisonziel')&&mit.includes('24 / 20')&&mit.includes('erreicht'),'erfülltes Ziel fehlt');
 const verfehlt=E.renderSaisonRueckblick(p,{...s,saisonZiel:{n:'Die eigene Chance erarbeiten',soll:10,ist:4,geschafft:false}});
 assert(verfehlt.includes('diesmal nicht erreicht'),'verfehltes Ziel fehlt');
});
test('Fernstudium: Anmeldung gibt keinen Abschluss, Fortsetzung erst nach vier Saisons',()=>{
 const start=E.EVENTS.find(e=>e.id==='ew_ausbildung'),ende=E.EVENTS.find(e=>e.id==='ew_studienabschluss');
 assert.deepEqual(start.choices.map(c=>c.id),['ew_ausbildung.0','ew_ausbildung.1','ew_ausbildung.2']);
 for(const c of start.choices)for(const o of c.roll)assert.notEqual(o.fx.flag,'abschluss');
 const p=player(10);p.flags={};p.straenge={studium:{stufe:1,seit:7,weg:'lernen'}};
 assert(!E.strangDran(ende,p));p.straenge.studium.seit=6;assert(E.strangDran(ende,p));assert(ende.cond(p));
 p.flags.abschluss=true;assert(!ende.cond(p));p.flags={};p.straenge.studium.weg='ohne';assert(!E.strangDran(ende,p));
});

// Echte Komponenten mit produktiv erzeugten Zuständen; kein Komponenten-Mock.
test('Abschlussbildschirm rendert nach echtem Abschluss mit und ohne Vorsatz',async()=>{
 for(const n of [0,3,15]){
  const p=player(n);p.vorsatz=n===15?'lange':null;
  const r=await E.runFinish(p);const html=E.renderEnd(r.P);
  assert(html.includes('Karriereende'));assert(!html.includes('NaN'));
  if(n===15)assert(html.includes('Vorsatz'));
 }
});
test('Vereinsansicht rendert frisch gegründeten Verein ohne erfundene Kaderspieler',()=>{
 const r=E.VEREIN.gruenden(E.VEREIN.leererVerein(),{name:'Testverein',stadt:'Hamburg',land:'GER',weltjahr:2026});assert(!r.fehler);
 const html=E.renderVerein(r.v,E.leereAkademie());assert(html.includes('Testverein'));assert(!html.includes('NaN'));
});
/* ------------------------------------------------ Vereinswirtschaft P0-02
   Der Anschluss des Rechenkerns an den Spielablauf. Geprüft wird hier NICHT
   die Kalibrierung (das tut tools/vereinswirtschaft.test.cjs), sondern dass
   die Abrechnung überhaupt läuft, dass sie den Spielstand fortschreibt und
   dass ein alter Spielstand ohne die neuen Felder nicht stolpert. */
const spielbereiterVerein=(zu={})=>{
 const r=E.VEREIN.gruenden(E.VEREIN.leererVerein(),{name:'Testverein',stadt:'Hamburg',land:'GER',weltjahr:2026});
 assert(!r.fehler,'Gründung: '+r.fehler);
 /* Positionen aus GUETE in verein.js, nicht erfunden: TW IV AV ZDM ZM ZOM AF ST. */
 const pos=['TW','IV','IV','AV','AV','ZDM','ZM','ZM','AF','AF','ST','TW','IV','ZM','ST','AV','ZOM','AF'];
 const kader=pos.map((p,i)=>({id:'t'+i,name:'Spieler '+i,nat:'GER',flag:'🇩🇪',pos:p,
   ovr:60,pot:70,alter:24,form:50,fitness:80,spiele:0,tore:0,jahreImVerein:1}));
 /* autoAufstellen gibt den ganzen Verein zurück, nicht nur die Aufstellung. */
 return E.VEREIN.autoAufstellen({...r.v,kader,...zu});
};

test('Ausbau kostet Geld: die alte VC-Funktion ist weg, ein Katalog statt zwei',()=>{
 /* Kevins Vorgabe: „Das man keine VC in etwas versenkt was nach 15 Saison eh
    verschwindet." Die alte Funktion muss VERSCHWUNDEN sein, nicht nur
    unbenutzt — sonst baut sie jemand in der nächsten Runde wieder ein. */
 assert.equal(typeof E.VEREIN.ausbauen,'undefined','VEREIN.ausbauen (VC) ist ersetzt, nicht ergänzt');
 assert.equal(typeof E.VEREIN.bauStarten,'function');
 /* Ein Katalog: sechs Abteilungen, die drei alten Kennungen unverändert. */
 const ids=E.VEREIN.VEREIN_AUSBAU.map(a=>a.id);
 assert.equal(ids.length,6);
 for(const alt of ['training','stadion','medizin'])assert(ids.includes(alt),alt+' bleibt Vertrag');
 for(const neu of ['gastro','sortiment','reichweite'])assert(ids.includes(neu));
 /* Die Preise sind Geld, nicht VC: eine Stufe kostet Millionen, keine
    dreistellige VC-Summe wie früher (Stadion Stufe 2 kostete 45 VC). */
 assert.equal(E.VEREIN.ausbauKosten({},'stadion'),4);
 assert.equal(E.VEREIN.ausbauKosten({ausbau:{stadion:6}},'stadion'),null,'voll ausgebaut');
});

test('Bauen: prüft vor dem Schreiben, bucht genau einmal ab und dauert an',()=>{
 const arm={land:'GER',kasse:1,ausbau:{},baustellen:{}};
 const r0=E.VEREIN.bauStarten(arm,'stadion');
 assert(r0.fehler,'ohne Geld kein Bau');
 assert.equal(r0.v.kasse,1,'ein abgelehnter Bau ändert gar nichts');
 assert.deepEqual(r0.v.baustellen||{},{});
 const reich={...arm,kasse:20};
 const r1=E.VEREIN.bauStarten(reich,'stadion');
 assert(!r1.fehler,r1.fehler);
 assert.equal(r1.v.kasse,16,'4 Mio sofort abgebucht');
 assert.equal(E.VEREIN.ausbauStufe(r1.v,'stadion'),1,'die Stufe steigt erst, wenn gebaut ist');
 assert(r1.v.baustellen.stadion.rest>=1);
 /* Dieselbe Abteilung nicht zweimal gleichzeitig, eine andere schon. */
 assert(E.VEREIN.bauStarten(r1.v,'stadion').fehler);
 assert(!E.VEREIN.bauStarten(r1.v,'gastro').fehler);
 /* Der laufende Bau steht als Text für die Oberfläche bereit. */
 const txt=E.VEREIN.baustellenText(r1.v);
 assert.equal(txt.length,1);assert(txt[0].includes('Stadion'));assert(txt[0].includes('Saison'));
});

test('VC kaufen nur noch die vier Extras, jedes einmal',()=>{
 const ids=E.VEREIN.VC_EXTRAS.map(x=>x.id);
 /* Drei, nicht vier: „Scoutnetz" versprach für 70 VC eine Wirkung über ein
    Feld, das niemand liest, und ist beim Gegenlesen ersatzlos entfernt worden.
    Lieber drei Posten, die wirken, als vier mit einem Placebo. */
 assert.equal(ids.length,3,'bewusst wenige — und jeder mit Wirkung');
 assert(!ids.includes('scoutnetz'),'das Placebo ist weg und bleibt weg');
 const v={land:'GER',kasse:0,extras:[]};
 assert(E.VEREIN.extraKaufen(v,'startkapital',10).fehler,'zu wenig VC');
 assert.equal(E.VEREIN.extraKaufen(v,'startkapital',10).v.kasse,0,'abgelehnt heisst unverändert');
 const r=E.VEREIN.extraKaufen(v,'startkapital',100);
 assert(!r.fehler);assert.equal(r.kosten,45);
 assert.equal(r.v.kasse,12,'Gründungskapital fliesst in die Kasse');
 assert(r.v.extras.includes('startkapital'));
 assert(E.VEREIN.extraKaufen(r.v,'startkapital',100).fehler,'nur einmal');
 assert(E.VEREIN.extraKaufen(v,'gibtesnicht',100).fehler);
});

test('Die Ausbauwirkungen im Spiel hängen weiter an denselben Kennungen',()=>{
 /* Wäre die Umstellung an dieser Stelle schiefgegangen, hätte ein
    ausgebautes Trainingszentrum stumm aufgehört zu wirken. */
 const bauen=(id,stufe)=>spielbereiterVerein({ausbau:{[id]:stufe}});
 const schwach=E.VEREIN.staerke(bauen('stadion',1)).gesamt;
 const stark=E.VEREIN.staerke(bauen('stadion',6)).gesamt;
 assert(stark>schwach,'das Stadion trägt weiter zur Mannschaftsstärke bei');
 assert.equal(E.VEREIN.ausbauStufe(bauen('training',4),'training'),4);
 assert.equal(E.VEREIN.ausbauStufe({},'training'),1,'ohne Angabe Stufe 1');
});

test('Die Chronik zeigt die Wirtschaft des Jahres',()=>{
 /* Der Leser, der in WIRT-P0-02 noch fehlte: die Kurzfassung lag im
    Spielstand und beantwortete keine Frage. Jetzt steht sie im Jahr. */
 const v0=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const r=E.VEREIN.vereinSaison(v0);
 const html=E.renderVerein(r.v,E.leereAkademie(),'chronik');
 assert(!html.includes('NaN'));
 assert(html.includes('Kasse'),'der Kassenstand des Jahres steht da');
 assert(html.includes('Zuschauer'));
 assert(html.includes('Stimmung'));
});

test('Bauen und VC-Extras speichern nichts Abgeleitetes',()=>{
 /* `mitWirtschaft` schreibt die Ligastufe auf das Ergebnis, und diese
    Objekte gehen in den Spielstand. Nach einem Aufstieg stünde dort ein
    veralteter Wert. */
 const v=spielbereiterVerein({kasse:50,extras:[]});
 const gebaut=E.VEREIN.bauStarten(v,'stadion');
 assert(!gebaut.fehler,gebaut.fehler);
 assert(!('ligastufe' in gebaut.v),'der Bau speichert die Ligastufe nicht');
 const gekauft=E.VEREIN.extraKaufen(v,'startkapital',100);
 assert(!gekauft.fehler,gekauft.fehler);
 assert(!('ligastufe' in gekauft.v),'der Extrakauf speichert sie nicht');
 /* Die Wirkung bleibt trotzdem vollständig. */
 assert.equal(gebaut.v.kasse,46);
 assert(gekauft.v.extras.includes('startkapital'));
});

test('Der Ausbaureiter zeigt Geld und VC getrennt, ohne NaN',()=>{
 const v=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:25.5,extras:[]}));
 const html=E.renderVerein(v,{...E.leereAkademie(),vc:100},'ausbau');
 assert(!html.includes('NaN'),'keine kaputte Zahl');
 assert(html.includes('Vereinskasse'));
 assert(html.includes('Bauen'),'Geldknopf');
 assert(html.includes('Gastronomie'),'die neuen Abteilungen sind da');
 assert(html.includes('Gründungskapital'),'die VC-Extras stehen im eigenen Abschnitt');
 assert(!html.includes('Kann bei dieser Preislage jede Saison Stimmung kosten.'),'Normalpreise erzeugen keinen Stimmungsschaden');
 const teuer=E.renderVerein({...v,preise:{ticket:1.8,gastro:1.8,merch:1.8}},E.leereAkademie(),'ausbau');
 assert(teuer.includes('Kann bei dieser Preislage jede Saison Stimmung kosten.'),'Überhöhte Preise warnen vor Stimmungsschaden');
 /* Kein Ausbau darf mehr mit VC ausgezeichnet sein. */
 assert(!html.includes('Ausbauen ·'),'die alte VC-Beschriftung ist weg');
 /* Bei leerer Kasse spricht der Preis für sich: „Dafür fehlen" würde nur die
    Zahl wiederholen, die direkt darüber steht. Erst wenn etwas da ist, aber
    nicht genug, sagt die Zeile etwas Neues. Beide Seiten der Grenze werden
    geprüft — eine Zeile, die nie erscheint, ist kein Fortschritt. */
 const arm=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:0})),
   {...E.leereAkademie(),vc:0},'ausbau');
 assert(!arm.includes('Dafür fehlen'),'leere Kasse: keine Wiederholung des Preises');
 assert(arm.includes('Bauen ·'),'der Preis selbst steht trotzdem da');
 assert(!arm.includes('NaN'));
 const halb=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:2})),
   {...E.leereAkademie(),vc:0},'ausbau');
 assert(halb.includes('Dafür fehlen'),'angefangene Kasse: die Lücke wird genannt');
 assert(!halb.includes('NaN'));
});

/* ------------------------------------------------ Lizenzauflage (P1-04) */

test('Der Punktabzug sortiert die Tabelle wirklich um, nicht nur die Anzeige',()=>{
 /* DAS IST DIE EIGENTLICHE ZUSICHERUNG. Ein Abzug, der als Zahl danebensteht,
    waehrend der Verein seinen erspielten Platz behaelt, waere Kosmetik — und
    genau die Sorte Feld ohne Leser, von der dieses Projekt schon mehrere
    hatte. Geprueft wird deshalb der PLATZ, nicht die Punktzahl. */
 const tab=[{name:'A',pos:1,sp:34,w:20,u:6,n:8,gf:60,ga:30,pkt:66,me:false},
            {name:'Ich',pos:2,sp:34,w:19,u:6,n:9,gf:55,ga:32,pkt:63,me:true},
            {name:'C',pos:3,sp:34,w:18,u:6,n:10,gf:50,ga:35,pkt:60,me:false},
            {name:'D',pos:4,sp:34,w:17,u:6,n:11,gf:48,ga:40,pkt:57,me:false}];
 const erg={tabelle:tab,rang:2,punkte:63,N:4};
 const ohne=E.VEREIN.abzugAnwenden(erg,0);
 assert.equal(ohne.rang,2,'ohne Auflage bleibt alles, wie es erspielt wurde');
 assert.equal(ohne.abzug,0);
 /* SECHS Punkte bringen den Verein auf 57 — gleichauf mit D, aber mit der
    besseren Tordifferenz (+23 gegen +8), also Platz 3 und nicht 4. Der erste
    Entwurf dieser Pruefung erwartete 4 und uebersah den Gleichstand; der
    Fehler lag in der Pruefung, nicht im Code. Er steht hier, weil er genau
    das zeigt, worauf es ankommt: der Abzug wird richtig EINSORTIERT, nicht
    stumpf durchgereicht. */
 const mit=E.VEREIN.abzugAnwenden(erg,6);
 assert.equal(mit.punkte,57,'sechs Punkte weg');
 assert.equal(mit.rang,3,'gleichauf mit D, aber bessere Differenz');
 assert.equal(mit.abzug,6);
 /* NEUN Punkte reichen dann wirklich nach unten durch: 54 liegt unter beiden. */
 const tief=E.VEREIN.abzugAnwenden(erg,9);
 assert.equal(tief.punkte,54);
 assert.equal(tief.rang,4,'und damit vom zweiten auf den letzten Platz');
 /* Der Platz steht auch IN der Tabelle neu, sonst zeigt der Rueckblick etwas
    anderes als der Bericht. */
 const meine=mit.tabelle.find(r=>r.me);
 assert.equal(meine.pos,3,'die Tabelle selbst traegt den neuen Platz');
 assert.deepEqual(mit.tabelle.map(r=>r.pos),[1,2,3,4],'die Plaetze bleiben fortlaufend');
 assert.equal(mit.tabelle[0].name,'A','die anderen ruecken nach');
 /* Bei Gleichstand entscheidet die Tordifferenz — derselbe Vergleich wie in
    `ligaSpielen`. Mit 3 Punkten Abzug steht „Ich" bei 60 wie C, hat aber die
    bessere Differenz (+23 gegen +15) und bleibt davor. */
 const gleich=E.VEREIN.abzugAnwenden(erg,3);
 assert.equal(gleich.rang,2,'bei Punktgleichheit entscheidet die Tordifferenz');
 /* Punkte werden bei null geklemmt, nicht negativ. */
 assert.equal(E.VEREIN.abzugAnwenden(erg,99).punkte,0,'keine Minuspunkte in der Tabelle');
});

test('Die Auflage aus der Vorsaison trifft die naechste und wandert in die Chronik',()=>{
 /* Die Auflage kostet das Jahr NACH dem Verstoss — so macht es der Fussball
    auch, und anders ginge es gar nicht: die abgelaufene Tabelle steht schon. */
 E.zufallSetzen(20260918);
 const v0=E.VEREIN.einschreiben(spielbereiterVerein({kasse:-400})).v;
 const r=E.VEREIN.vereinSaison({...v0,abzug:9});
 assert(!r.fehler,'die Saison laeuft: '+r.fehler);
 assert.equal(r.abzug,9,'der mitgebrachte Abzug wurde angewandt');
 assert.equal(r.tabelle.find(z=>z.me).pos,r.rang,'Tabelle und Rang sagen dasselbe');
 const c=r.v.chronik.at(-1).wirtschaft;
 assert.equal(c.abzug,9,'was diese Saison gekostet hat');
 assert(c.auflage>0,'und was die naechste kosten wird — zwei verschiedene Zahlen');
 assert.equal(r.v.abzug,c.auflage,'die neue Auflage haengt am Verein');
 /* Ein Verein mit voller Kasse schleppt keine Auflage mit sich herum. */
 E.zufallSetzen(20260918);
 const reich=E.VEREIN.vereinSaison(E.VEREIN.einschreiben(spielbereiterVerein({kasse:300})).v);
 assert.equal(reich.abzug,0);
 assert.equal(reich.v.abzug,0);
 assert.equal((reich.v.chronik.at(-1).wirtschaft||{}).abzug,0);
});

test('Alte Spielstaende ohne Lizenzfeld starten ohne Auflage',()=>{
 /* Ergaenzt wird beim LESEN, nicht beim Speichern — dieselbe Regel wie fuer
    die uebrigen Wirtschaftsfelder. Und ein negativer Abzug waere ein Geschenk. */
 assert.equal(E.VEREIN.mitWirtschaft({}).abzug,0);
 assert.equal(E.VEREIN.mitWirtschaft({abzug:'kaputt'}).abzug,0);
 assert.equal(E.VEREIN.mitWirtschaft({abzug:-5}).abzug,0,'kein Geschenk aus einem kaputten Stand');
 assert.equal(E.VEREIN.mitWirtschaft({abzug:6}).abzug,6);
});

test('Die Oberflaeche nennt Auflage und Vorwarnung, statt sie stumm zu verrechnen',()=>{
 /* Eine Strafe, die erst auffaellt, wenn sie schon wirkt, laesst dem Spieler
    keine Gegenwehr. Drei Zustaende, drei verschiedene Aussagen. */
 const gesund=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:40})),
   E.leereAkademie(),'ausbau');
 assert(!gesund.includes('Lizenzauflage'),'wer im Plus steht, wird nicht gewarnt');
 assert(!gesund.includes('Kasse ist im Minus'));
 const warnung=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:-3})),
   E.leereAkademie(),'ausbau');
 assert(warnung.includes('Kasse ist im Minus'),'ein Minus wird angesagt');
 assert(!warnung.includes('Lizenzauflage'),'aber noch nicht als Auflage');
 const auflage=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:-400,abzug:9})),
   E.leereAkademie(),'ausbau');
 assert(auflage.includes('Lizenzauflage'),'eine beschlossene Auflage steht da');
 assert(auflage.includes('9 Punkte Abzug'),'mit der Zahl');
 assert(!auflage.includes('NaN'));
});

test('Abschluss: die Restkasse wird zu Vermächtnispunkten',()=>{
 /* WIRT-P1-05. Bis hierher verfiel, was am Ende in der Kasse lag — damit war
    Wirtschaften ab dem Jahr, in dem alles gebaut war, gleichgültig, und genau
    das sollte die Umstellung auf Geld abschaffen. */
 const bilanz={saisons:15,aufstiege:1,abstiege:0,meister:0,tore:600,gegentore:500,
   punkte:700,bestePlatzierung:2};
 const leer=E.VEREIN.abschluss({bilanz,kader:[],kasse:0,extras:[]});
 const voll=E.VEREIN.abschluss({bilanz,kader:[],kasse:100,extras:[]});
 assert(voll.punkte>leer.punkte,'die Kasse zählt');
 assert.equal(voll.punkte-leer.punkte,25,'4 Mio je Punkt');
 assert.equal(voll.wirtschaft.punkte,25);
 assert.equal(voll.sportlich,leer.sportlich,'der sportliche Teil bleibt derselbe');
 /* Schulden zählen nicht negativ — der Abschluss soll nicht zweimal bestrafen. */
 const schulden=E.VEREIN.abschluss({bilanz,kader:[],kasse:-80,extras:[]});
 assert.equal(schulden.punkte,leer.punkte);
 /* Der Deckel verhindert, dass eine nie ausgegebene Kasse den Sport ersetzt. */
 const reich=E.VEREIN.abschluss({bilanz,kader:[],kasse:99999,extras:[]});
 assert.equal(reich.wirtschaft.punkte,250);
 /* Mehr Punkte heissen auch mehr VC — das ist die gewollte Folge, nicht ein
    Nebeneffekt: Wirtschaften lohnt bis zur letzten Saison. */
 assert(voll.vc>=leer.vc);
});

test('Abschluss: die Vermächtnisplakette wirkt auf beide Teile, jeden genau einmal',()=>{
 /* Das VC-Extra verspricht „+15 % Abschlusspunkte" — nicht „+15 % auf den
    Kassenanteil". Beide Teile werden erhöht, keiner doppelt. */
 const bilanz={saisons:15,aufstiege:1,abstiege:0,meister:1,tore:600,gegentore:500,
   punkte:700,bestePlatzierung:1};
 const ohne=E.VEREIN.abschluss({bilanz,kader:[],kasse:100,extras:[]});
 const mit=E.VEREIN.abschluss({bilanz,kader:[],kasse:100,extras:['ewigkeit']});
 assert.equal(ohne.wirtschaft.faktor,1);
 assert.equal(mit.wirtschaft.faktor,1.15);
 assert.equal(mit.sportlich,Math.round(ohne.sportlich*1.15),'sportlicher Teil einmal erhöht');
 assert.equal(mit.wirtschaft.punkte,Math.round(ohne.wirtschaft.punkte*1.15),'Kassenteil einmal erhöht');
 assert.equal(mit.punkte,mit.sportlich+mit.wirtschaft.punkte,'die Summe ist die Summe');
 /* Nicht mehr als 15 % insgesamt — ein doppelt angewandter Faktor wäre 32 %. */
 const verhaeltnis=mit.punkte/ohne.punkte;
 assert(verhaeltnis>1.14&&verhaeltnis<1.16,'genau einmal angewandt, war '+verhaeltnis.toFixed(3));
});

test('Der Abschlussbildschirm sagt, woraus die Punkte bestehen',()=>{
 /* Ohne diese Zeile sähe der Spieler nur eine gewachsene Zahl und wüsste
    nicht, dass seine Kasse darin steckt — und würde beim nächsten Verein
    wieder alles bis zur letzten Mark verbauen. */
 const v={...spielbereiterVerein({kasse:100,extras:[],jahr:15}),
   bilanz:{saisons:15,aufstiege:1,abstiege:0,meister:1,tore:600,gegentore:480,
     punkte:720,bestePlatzierung:1},chronik:[]};
 const erg=E.VEREIN.abschluss(v);
 const html=E.renderVereinAbschluss(v,erg,{});
 assert(!html.includes('NaN'));
 assert(html.includes('Vermächtnis'));
 assert(html.includes('aus der Kasse'),'der Kassenanteil wird benannt');
 assert(html.includes(String(erg.wirtschaft.punkte)));
 /* Leere Kasse: der Bildschirm sagt es, statt die Zeile wegzulassen. */
 const arm={...v,kasse:0};
 const html2=E.renderVereinAbschluss(arm,E.VEREIN.abschluss(arm),{});
 assert(html2.includes('Kasse war am Ende leer'));
 assert(!html2.includes('NaN'));
 /* Mit Plakette wird sie genannt — sonst weiss niemand, wofür die 120 VC waren. */
 const mit={...v,extras:['ewigkeit']};
 const html3=E.renderVereinAbschluss(mit,E.VEREIN.abschluss(mit),{});
 assert(html3.includes('Vermächtnisplakette'));
 assert(html3.includes('15 %'));
});

test('Abschluss: ein Verein ohne Wirtschaftsfelder bleibt rechenbar',()=>{
 /* Ein Spielstand aus 35.192 hat keine Kasse. Er muss abschliessbar bleiben
    und darf dabei nichts erfinden. */
 const alt={bilanz:{saisons:15,aufstiege:0,abstiege:1,meister:0,tore:400,
   gegentore:520,punkte:480,bestePlatzierung:6},kader:[]};
 const erg=E.VEREIN.abschluss(alt);
 assert(Number.isFinite(erg.punkte)&&erg.punkte>=0);
 assert.equal(erg.wirtschaft.punkte,0,'keine Kasse, keine Punkte daraus');
 assert.equal(erg.wirtschaft.kasse,0);
 assert.equal(erg.punkte,erg.sportlich);
 assert(erg.vc>=60,'die VC-Ausschüttung bleibt unberührt');
});

test('Saisonabrechnung: der Karrierebericht zeigt, woher das Geld kam und wohin es ging',async()=>{
 /* WIRT-P1-01. Vorher sah der Spieler nur einen Kassenstand, der sich
    verändert hatte — ohne Grund. Der Beleg wird gebucht UND angezeigt, aus
    derselben Quelle: zwei Rechnungen laufen auseinander, und dann glaubt der
    Spieler der falschen (dieselbe Regel wie beim Coinbeleg). */
 const v0=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const r=E.VEREIN.vereinSaison(v0);
 assert(!r.fehler,r.fehler);
 const b=r.beleg;
 /* Ein ECHTER abgeschlossener Spieler als Unterlage, kein handgebautes
    Objekt: der Abschlussbildschirm liest mehr Felder, als man beim Nachbauen
    ahnt — zwei Anläufe sind an erfundenen Ständen gescheitert. */
 const fertig=(await E.runFinish(player(3))).P;
 const p={...fertig,
  vereinBericht:{name:'Testverein',jahr:1,liga:v0.liga,rang:r.rang,N:r.N,
   tore:r.tore,gegentore:r.gegentore,punkte:r.punkte,aufstieg:!!r.aufstieg,
   abstieg:!!r.abstieg,meister:r.rang===1,vorbei:false,abgaenge:0,
   wirtschaft:{land:'GER',einnahmen:b.einnahmen,ausgaben:b.ausgaben,
    summeEin:b.summeEin,summeAus:b.summeAus,ergebnis:b.ergebnis,kasse:b.kasse,
    zuschauer:b.zuschauer,auslastung:b.auslastung,
    ereignisse:(b.ereignisse||[]).map(e=>({n:e.n,t:e.t,geld:e.geld})),
    ziel:null,fertig:[],ausgelaufen:[],
    stimmung:b.stimmung,stimmungVorher:b.stimmungVorher,
    gehalt:b.gehalt?{vorher:b.gehalt.vorher,neu:b.gehalt.neu}:null}}};
 const html=E.renderEnd(p);
 assert(!html.includes('NaN'),'keine kaputte Zahl');
 assert(html.includes('Saisonabrechnung'));
 assert(html.includes('Ergebnis'));
 /* Jeder gebuchte Posten steht auch da — sonst zeigt der Bericht eine andere
    Rechnung als die, die stattgefunden hat. */
 for(const x of b.einnahmen)assert(html.includes(x.k.split(' ·')[0]),'Einnahme fehlt: '+x.k);
 for(const x of b.ausgaben)assert(html.includes(x.k.split(' ·')[0]),'Ausgabe fehlt: '+x.k);
 assert(html.includes('Zuschauer'));
 /* Die beiden Werte, die die ganze Wirtschaft treiben, müssen genannt werden —
    sonst sieht der Spieler Zuschauer und Merchandising sinken und die
    Gehaltszeile steigen, ohne dass eine der Zahlen je auftaucht. */
 assert(html.includes('Stimmung'),'die Stimmung wird genannt');
 assert(html.includes('Gehaltsniveau'),'das Gehaltsniveau wird genannt');
 /* Ohne Wirtschaftsteil bleibt der Bericht wie vorher — alte Spielstände
    haben keinen Beleg, und der Bildschirm darf daran nicht zerbrechen. */
 const ohne={...p,vereinBericht:{...p.vereinBericht,wirtschaft:null}};
 const html2=E.renderEnd(ohne);
 assert(!html2.includes('NaN'));
 assert(!html2.includes('Saisonabrechnung'));
 assert(html2.includes('Ein Jahr Profimannschaft'),'der übrige Bericht steht weiter');
});

test('Saisonabrechnung: verfehltes Ziel, fertige Bauten und Ereignisse werden benannt',async()=>{
 const grund=(await E.runFinish(player(3))).P;
 const bericht=(w)=>({...grund,vereinBericht:{name:'Testverein',jahr:3,liga:'3. Liga',
  rang:7,N:18,tore:40,gegentore:44,punkte:48,aufstieg:false,abstieg:false,
  meister:false,vorbei:false,abgaenge:0,wirtschaft:{land:'GER',
   einnahmen:[{k:'Zuschauer',v:8}],ausgaben:[{k:'Spielergehälter',v:6}],
   summeEin:8,summeAus:6,ergebnis:2,kasse:12,zuschauer:6000,auslastung:0.75,...w}}});
 /* Verfehltes Ziel wird gesagt, nicht verschwiegen. */
 const verfehlt=E.renderEnd(bericht({ereignisse:[],fertig:[],ausgelaufen:[],
   ziel:{n:'Gesicherte Mitte',erfuellt:false,praemie:0}}));
 assert(verfehlt.includes('Vorstandsziel verfehlt'));
 assert(verfehlt.includes('Gesicherte Mitte'));
 /* Erfülltes Ziel steht als Posten mit Prämie in der Rechnung. */
 const erfuellt=E.renderEnd(bericht({ereignisse:[],fertig:[],ausgelaufen:[],
   ziel:{n:'Klassenerhalt',erfuellt:true,praemie:1.4}}));
 assert(erfuellt.includes('Vorstandsziel erfüllt'));
 assert(!erfuellt.includes('Vorstandsziel verfehlt'));
 /* Fertige Bauten, ausgelaufene Verträge und Ereignisse mit Text. */
 const rest=E.renderEnd(bericht({ziel:null,fertig:['Stadion Stufe 2'],
   ausgelaufen:['Nordwind Energie'],
   ereignisse:[{n:'Sturmschaden am Dach',t:'Eine Novembernacht kostet die Nordtribüne ihr halbes Dach.',geld:-1.2}]}));
 assert(rest.includes('Stadion Stufe 2'));
 assert(rest.includes('Nordwind Energie'));
 assert(rest.includes('Sturmschaden am Dach'));
 assert(rest.includes('Novembernacht'),'das Ereignis wird erzählt, nicht nur gebucht');
 assert(!rest.includes('NaN'));
});

test('Sponsoren: die Angebote liegen im Spielstand, nicht im Augenblick',()=>{
 /* WIRT-P0-04. Würden die Angebote beim Zeichnen erzeugt, bekäme man bei
    jedem Aufschlagen des Bildschirms neue — und die Auswahl wäre kein
    Entschluss, sondern ein Automat, den man bis zum besten Angebot drückt. */
 const v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 assert(Array.isArray(v.angebote)&&v.angebote.length>0,'die Einschreibung legt die erste Auswahl bereit');
 /* Zweimal nachsehen ergibt dieselben drei. */
 assert.deepEqual(E.VEREIN.mitAngeboten(v).angebote.map(a=>a.id),v.angebote.map(a=>a.id));
 /* Auch nach einem Neuladen, also aus dem rohen gespeicherten Stand heraus. */
 const geladen=JSON.parse(JSON.stringify(v));
 assert.deepEqual(E.VEREIN.mitAngeboten(geladen).angebote.map(a=>a.id),v.angebote.map(a=>a.id));
 /* Ein anderer Verein bekommt andere Angebote — sonst hinge die Saat nicht
    am Verein, sondern wäre eine Konstante. */
 const anders=E.VEREIN.mitAngeboten({...v,name:'Ganz anderer Verein',angebote:null});
 assert.notDeepEqual(anders.angebote.map(a=>a.id),v.angebote.map(a=>a.id));
 /* Jedes Angebot ist vollständig beschrieben: ohne Betrag und Laufzeit kann
    man nicht wählen. */
 for(const a of v.angebote){
  assert(a.id&&a.n&&a.branche);
  assert(a.betrag>0&&Number.isFinite(a.betrag));
  assert(a.laufzeit>=1&&a.laufzeit<=4);
 }
});

test('Sponsoren: unterschreiben prüft vor dem Schreiben und belegt einen Platz',()=>{
 let v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 assert(E.VEREIN.sponsorAnnehmen(v,'gibtesnicht').fehler,'ein Angebot, das nicht vorliegt');
 assert.equal(E.VEREIN.sponsorAnnehmen(v,'gibtesnicht').v,v,'abgelehnt heisst unverändert');
 const erste=v.angebote[0];
 const r=E.VEREIN.sponsorAnnehmen(v,erste.id);
 assert(!r.fehler,r.fehler);
 assert.equal(r.v.sponsoren.length,1);
 assert.equal(r.v.sponsoren[0].id,erste.id);
 assert.equal(r.v.sponsoren[0].rest,erste.laufzeit,'die Laufzeit beginnt vollständig');
 assert(!r.v.angebote.some(a=>a.id===erste.id),'das Angebot ist vom Tisch');
 /* Dieselbe Firma nicht zweimal. */
 assert(E.VEREIN.sponsorAnnehmen({...r.v,angebote:[erste]},erste.id).fehler);
 /* Die Plätze sind begrenzt, sonst wäre Wählen Einsammeln. */
 const voll={...v,sponsoren:Array.from({length:E.VEREIN.SPONSOR_MAX},(_,i)=>({id:'x'+i,rest:2,betrag:1}))};
 const abgelehnt=E.VEREIN.sponsorAnnehmen(voll,erste.id);
 assert(abgelehnt.fehler,'bei vollen Plätzen wird abgelehnt');
 assert(abgelehnt.fehler.includes(String(E.VEREIN.SPONSOR_MAX)));
});

test('Sponsoren: Verträge laufen ab, bringen Geld und werden nachgemeldet',()=>{
 let v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const ohne=E.VEREIN.vereinSaison(v).beleg.summeEin;
 /* Denselben Verein einmal mit zwei Verträgen. */
 let mit=v;
 for(const a of mit.angebote.slice(0,2)){const r=E.VEREIN.sponsorAnnehmen(mit,a.id);if(!r.fehler)mit=r.v;}
 assert.equal(mit.sponsoren.length,2);
 const r=E.VEREIN.vereinSaison(mit);
 assert(r.beleg.summeEin>ohne,'Werbeverträge bringen Geld: '+r.beleg.summeEin+' gegen '+ohne);
 /* Nach der Saison ist jeder Vertrag ein Jahr kürzer, und es liegen neue
    Angebote für die kommende Saison bereit. */
 for(const sp of r.v.sponsoren)assert(sp.rest>=1,'abgelaufene fallen raus statt auf 0 zu stehen');
 const vorher=mit.sponsoren.find(s=>s.laufzeit>1);
 if(vorher)assert.equal(r.v.sponsoren.find(s=>s.id===vorher.id).rest,vorher.laufzeit-1);
 assert(Array.isArray(r.v.angebote)&&r.v.angebote.length>0,'neue Saison, neue Angebote');
 assert.notDeepEqual(r.v.angebote.map(a=>a.id),mit.angebote.map(a=>a.id),'nicht dieselben wie im Vorjahr');
 /* Ein Einjahresvertrag taucht in der Chronik als ausgelaufen auf. */
 const einjahr=mit.sponsoren.find(s=>s.laufzeit===1);
 if(einjahr){
  const c=r.v.chronik[r.v.chronik.length-1];
  assert(c.wirtschaft.ausgelaufen.includes(einjahr.n),'ausgelaufene Verträge werden gemeldet');
 }
});

test('Der angezeigte Werbebetrag ist der, der ankommt',()=>{
 /* Die Abrechnung bucht `betrag * kommerz` der Rechtsform — ein e.V. bekommt
    92 Prozent. Die Oberfläche zeigte brutto: ein Angebot über 2,97 Mio tauchte
    im Beleg als 2,73 Mio auf, bei vier Saisons lag die Gesamtsumme rund eine
    Million daneben. Wer Angebote vergleicht, verglich Zahlen, die nie
    eintreffen. */
 let v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const an=v.angebote[0];
 assert(E.VEREIN.werbeErtrag(v,an.betrag)<an.betrag,'der e.V. bekommt weniger als vereinbart');
 const r=E.VEREIN.sponsorAnnehmen(v,an.id);
 assert(!r.fehler,r.fehler);
 const beleg=E.VEREIN.vereinSaison(r.v).beleg;
 const posten=beleg.einnahmen.find(p=>p.k.includes(an.n));
 assert(posten,'der Vertrag steht als Posten im Beleg');
 assert(Math.abs(posten.v-E.VEREIN.werbeErtrag(v,an.betrag))<0.02,
   'gebucht wurden '+posten.v+', angezeigt würde '+E.VEREIN.werbeErtrag(v,an.betrag));
 /* Und die Oberfläche nennt genau diese Zahl. */
 const html=E.renderVerein(v,E.leereAkademie(),'sponsoren');
 assert(html.includes(E.VEREIN.geldText(E.VEREIN.werbeErtrag(v,an.betrag),v.land)),
   'der Reiter zeigt den Betrag, der ankommt');
});

test('Alle Angebote unterschrieben heisst nicht: drei neue',()=>{
 /* Der erste Entwurf prüfte zusätzlich auf `.length`. Wer alle drei Angebote
    einer Saison unterschrieb, bekam beim nächsten Blick sofort drei neue —
    genau der Automat, den das Paket verhindern soll. */
 let v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 for(const a of [...v.angebote]){const r=E.VEREIN.sponsorAnnehmen(v,a.id);if(!r.fehler)v=r.v;}
 assert.equal(v.sponsoren.length,E.VEREIN.SPONSOR_MAX,'drei Plätze belegt');
 assert.equal(v.angebote.length,0,'nichts liegt mehr vor');
 assert.equal(E.VEREIN.mitAngeboten(v).angebote.length,0,'und es wird auch nichts nachgelegt');
 /* Die Zeile dafür ist damit erreichbar statt toter Code. */
 const html=E.renderVerein(v,E.leereAkademie(),'sponsoren');
 assert(html.includes('liegt nichts mehr vor'));
 /* Ein FEHLENDES Feld wird weiterhin nachgelegt — alte Spielstände. */
 const alt={...v,angebote:undefined};
 assert(E.VEREIN.mitAngeboten(alt).angebote.length>0,'alte Spielstände bekommen eine Auswahl');
});

test('Der Sponsorenreiter zeigt Angebote und laufende Verträge, ohne NaN',()=>{
 const v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const html=E.renderVerein(v,E.leereAkademie(),'sponsoren');
 assert(!html.includes('NaN'));
 assert(html.includes('Partner'));
 assert(html.includes('Angebote für diese Saison'));
 assert(html.includes('Unterschreiben'));
 assert(html.includes(v.angebote[0].n),'die Firma steht mit Namen da');
 /* Mit vollen Plätzen wird der Knopf gesperrt und gesagt, warum. */
 const voll={...v,sponsoren:Array.from({length:E.VEREIN.SPONSOR_MAX},(_,i)=>
   ({id:'x'+i,n:'Partner '+i,branche:'Industrie',betrag:2.5,rest:2,laufzeit:3}))};
 const html2=E.renderVerein(voll,E.leereAkademie(),'sponsoren');
 assert(html2.includes('Kein Platz frei'));
 assert(html2.includes('Alle Plätze belegt'));
 assert(!html2.includes('NaN'));
 /* Der Reiter heißt „Partner", nicht „Sponsoren". Mit dem sechsten Reiter lag
    „Chronik" auf einem 320er-Gerät zwei Wischer entfernt; kürzer holt sie
    zurück, und es ist ohnehin das Wort, das die Kopfzeile des Reiters selbst
    benutzt. Gemessen wurde das im Browser — diese Prüfung hält nur die
    Entscheidung fest, damit sie nicht stillschweigend zurückgedreht wird.
    Ein Zeichenbudget wäre eine Scheingenauigkeit: die Schrift ist proportional. */
 const leiste=html.split('Angebote für diese Saison')[0];
 assert(leiste.includes('>Partner<'),'der Reiter trägt die kurze Beschriftung');
 assert(!leiste.includes('>Sponsoren<'),'die lange Beschriftung ist weg');
 assert(leiste.includes('>Chronik<'),'und „Chronik" steht weiter in der Leiste');
});

test('Nach einem Aufstieg ist Klassenerhalt die Ansage, nicht der Titel',()=>{
 /* DER FEHLER, DEN DIESE PRÜFUNG FESTHÄLT. Der erste Entwurf reichte die neue
    Ligastufe weiter, aber den ALTEN Tabellenplatz — und daraus leitet
    `zielSetzen` das Ziel ab. Ein Meister, der aufstieg, bekam „Um den Titel
    spielen" mit Soll 1 in der Liga darüber: unerreichbar, Prämie nie gezahlt. */
 E.zufallSetzen(4242);
 try{
  /* Ein starker Kader in einer unteren Liga steigt früher oder später auf. */
  const stark=spielbereiterVerein();
  let v=E.VEREIN.einschreiben(E.VEREIN.autoAufstellen(
    {...stark,kader:stark.kader.map(s=>({...s,ovr:82,pot:86}))})).v;
  let gefunden=null;
  for(let i=0;i<8&&!gefunden;i++){
   const r=E.VEREIN.vereinSaison(v);
   if(r.fehler)break;
   if(r.aufstieg)gefunden=r;
   v=r.v;
  }
  if(gefunden){
   assert(gefunden.v.ziel,'nach der Saison steht ein Ziel');
   assert.notEqual(gefunden.v.ziel.soll,1,
     'Aufsteiger bekommt „'+gefunden.v.ziel.n+'" mit Soll 1 in der neuen Liga');
   assert(/halt|Mitte/i.test(gefunden.v.ziel.n),
     'erwartet wurde ein bescheidenes Ziel, bekommen: '+gefunden.v.ziel.n);
  }
 }finally{E.zufallSetzen(null);}
});

test('Gehälter rechnen mit dem Kader, der gespielt hat — nicht mit dem gealterten',()=>{
 /* Die Entwicklungsschleife ändert Alter und Stärke IN PLACE. Wer die
    Gehälter danach rechnet, bezahlt die abgelaufene Saison mit den Stärken
    der kommenden — bei +2 Zuwachs rund 12 % zu viel, jedes Jahr. */
 const v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const schnittVorher=Math.round(v.kader.reduce((a,s)=>a+s.ovr,0)/v.kader.length);
 const r=E.VEREIN.vereinSaison(v);
 assert(!r.fehler,r.fehler);
 assert.equal(r.beleg.gehalt.kader.schnitt,schnittVorher,
   'abgerechnet wurde Ø '+r.beleg.gehalt.kader.schnitt+' statt Ø '+schnittVorher);
 /* Und der Kader IM Spielstand ist danach tatsächlich weiter. */
 const schnittNachher=Math.round(r.v.kader.reduce((a,s)=>a+s.ovr,0)/Math.max(1,r.v.kader.length));
 assert(schnittNachher>=schnittVorher,'die Mannschaft entwickelt sich weiterhin');
});

test('Sponsorenwirkungen medizin und jugend haben einen Leser',()=>{
 /* Beide wurden von `wirkung` summiert und von niemandem abgeholt — die
    Verträge versprachen etwas, das nicht geschah. Geprüft mit festgehaltenem
    Würfel: derselbe Verlauf, einziger Unterschied ist der Vertrag. */
 const fit=(sponsoren)=>{
  E.zufallSetzen(90210);
  try{
   const v={...E.VEREIN.einschreiben(spielbereiterVerein()).v,sponsoren};
   const r=E.VEREIN.vereinSaison(v);
   assert(!r.fehler,r.fehler);
   return Math.round(r.v.kader.reduce((a,s)=>a+(s.fitness||0),0)/Math.max(1,r.v.kader.length));
  }finally{E.zufallSetzen(null);}
 };
 const ohne=fit([]);
 const mit=fit([{id:'vitalis',n:'Vitalis',branche:'Gesundheit',betrag:2,rest:3,laufzeit:3,fx:{medizin:1}}]);
 assert(mit>ohne,'der Vitalis-Vertrag wirkt wie eine Stufe Medizin ('+mit+' gegen '+ohne+')');
});

test('Die abgeleitete Ligastufe landet nicht im Spielstand',()=>{
 /* Sie muss der aktuellen Liga folgen. Gespeichert wäre sie nach einem
    Aufstieg veraltet, und der erste Aufruf, der sie roh liest statt neu
    abzuleiten, rechnete still mit der falschen Liga. */
 const v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 assert(!('ligastufe' in v),'die Einschreibung speichert sie nicht');
 /* Abgeleitet wird sie trotzdem jederzeit richtig. */
 assert(E.VEREIN.mitWirtschaft(v).ligastufe>=1);
 assert(!('ligastufe' in E.VEREIN.ohneAbgeleitetes(E.VEREIN.mitWirtschaft(v))));
});

test('Die Chronik traegt die Wirtschaft des Jahres',()=>{
 /* Die Kurzfassung lag seit ihrer Einführung im Spielstand und wurde von
    niemandem gelesen. Die ANZEIGE folgt in WIRT-P0-03, sobald `geldText`
    zur Verfügung steht; hier wird geprüft, dass die Daten vollständig sind
    und nichts Unbenutztes mitgeschleppt wird. */
 const v0=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 const r=E.VEREIN.vereinSaison(v0);
 const c=r.v.chronik[r.v.chronik.length-1];
 assert(c.wirtschaft,'die Chronik führt die Wirtschaft');
 for(const k of ['ein','aus','ergebnis','kasse','zuschauer','stimmung','gehaltsniveau'])
  assert(Number.isFinite(c.wirtschaft[k]),k+' fehlt oder ist keine Zahl');
 assert(Array.isArray(c.wirtschaft.ereignisse));
 /* `ausgelaufen` kommt erst mit den Sponsoren (WIRT-P0-04) dazu. */
});

test('Vereinswirtschaft: die Saison rechnet ab und schreibt den Spielstand fort',()=>{
 const v0=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 assert(v0.ziel,'mit der Einschreibung steht ein Vorstandsziel');
 assert.equal(v0.kasse,0);assert.equal(v0.gehaltsniveau,1);
 const r=E.VEREIN.vereinSaison(v0);
 assert(!r.fehler,'Saison: '+r.fehler);
 /* Der Beleg ist da, und die Kasse ändert sich um genau das, was er ausweist. */
 assert(r.beleg,'die Saison liefert einen Beleg');
 assert.equal(r.v.kasse,Math.round((v0.kasse+r.beleg.ergebnis)*100)/100);
 assert(Number.isFinite(r.beleg.summeEin)&&r.beleg.summeEin>0);
 assert(Number.isFinite(r.beleg.summeAus)&&r.beleg.summeAus>0);
 assert(r.beleg.ausgaben.some(x=>x.k.startsWith('Spielergehälter')),'Gehälter stehen im Beleg');
 /* Das Ziel der KOMMENDEN Saison ist gesetzt, nicht das verbrauchte. */
 assert(r.v.ziel&&r.v.ziel.soll>=1,'neues Vorstandsziel');
 assert.equal(r.ziel.n,r.v.ziel.n);
 /* Die Kurzfassung liegt in der Chronik, der volle Beleg nicht. */
 const c=r.v.chronik[r.v.chronik.length-1];
 assert(c.wirtschaft,'Chronik führt die Wirtschaft');
 assert.equal(c.wirtschaft.kasse,r.v.kasse);
 assert.equal(c.wirtschaft.ausgaben,undefined,'keine vollen Posten im Spielstand');
});

test('Vereinswirtschaft: die Ligastufe wird abgeleitet und folgt dem Auf- und Abstieg',()=>{
 const v=E.VEREIN.mitWirtschaft(spielbereiterVerein());
 assert(v.ligastufe>=1&&v.ligastufe<=9,'Stufe im sinnvollen Bereich, war '+v.ligastufe);
 /* Von oben gezählt: die höchste Liga des Landes ist Stufe 1. */
 const oben=E.VEREIN.ligastufe('GER','Bundesliga');
 const unten=E.VEREIN.ligastufe('GER','3. Liga');
 assert(oben<unten,'Bundesliga ('+oben+') liegt über der 3. Liga ('+unten+')');
 assert.equal(oben,1);
 /* Kein gespeicherter Wert: eine geänderte Liga ändert die Stufe sofort mit. */
 assert.notEqual(E.VEREIN.mitWirtschaft({...v,liga:'3. Liga'}).ligastufe,
                 E.VEREIN.mitWirtschaft({...v,liga:'Bundesliga'}).ligastufe);
 assert.equal(E.VEREIN.ligastufe('GER','Gibt es nicht'),3,'unbekannte Liga fällt auf die Mitte zurück');
});

test('Vereinswirtschaft: alte Spielstände ohne Wirtschaftsfelder laufen weiter',()=>{
 /* Genau der Fall aus 35.192: gegründet, eingeschrieben, mitten im Durchlauf
    — und ohne jedes der neuen Felder. Er darf weder stolpern noch etwas
    erfinden, was der Spieler nie hatte. */
 const alt=spielbereiterVerein({jahr:7,eingeschrieben:true});
 for(const k of ['kasse','sponsoren','extras','stimmung','rechtsform','preise','baustellen','gehaltsniveau','ziel'])
  delete alt[k];
 const r=E.VEREIN.vereinSaison(alt);
 assert(!r.fehler,'alter Spielstand: '+r.fehler);
 assert(Number.isFinite(r.v.kasse)&&Number.isFinite(r.v.stimmung));
 assert.equal(r.beleg.kasseVorher,0,'eine fehlende Kasse ist leer, nicht NaN');
 assert.equal(r.beleg.ziel.gesetzt,false,'ohne gesetztes Ziel gibt es keine Prämie');
 assert.equal(r.beleg.ziel.praemie,0);
 /* Die alten Ausbaukennungen bleiben unberührt — sie sind Vertrag. */
 assert.equal(r.v.ausbau.training,1);assert.equal(r.v.ausbau.stadion,1);assert.equal(r.v.ausbau.medizin,1);
 /* Eine gespeicherte 0 ist keine fehlende Zahl. */
 assert.equal(E.VEREIN.mitWirtschaft({kasse:0,stimmung:0}).kasse,0);
 assert.equal(E.VEREIN.mitWirtschaft({kasse:0,stimmung:0}).stimmung,0);
 assert.equal(E.VEREIN.mitWirtschaft({}).stimmung,60,'fehlende Stimmung beginnt in der Mitte');
});

test('Vereinswirtschaft: dieselbe Saison zweimal ergibt dasselbe Geld',()=>{
 /* Ein Neuladen darf keine neuen Sponsorenangebote und keine anderen
    Ereignisse würfeln. Die Saat kommt deshalb aus dem Verein selbst, nicht
    aus rnd() — geprüft wird das hier an den Ereignissen, weil sie die
    einzige Stelle mit Zufall in der Abrechnung sind. */
 const v0=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 /* Der SPORTLICHE Teil würfelt weiter — eine Saison wird gespielt, nicht
    festgelegt. Geprüft wird hier der wirtschaftliche Zufall: dieselben
    Ereignisse trotz verschiedener Spielverläufe. */
 const a=E.VEREIN.vereinSaison(v0),b=E.VEREIN.vereinSaison(v0);
 assert.deepEqual(a.beleg.ereignisse.map(e=>e.id),b.beleg.ereignisse.map(e=>e.id),
  'die Ereignisse hängen am Verein, nicht am Spielverlauf');
 /* Mit festgehaltenem Würfel muss dann ALLES gleich sein — sonst steckt
    irgendwo in der Abrechnung doch noch ein rnd(). */
 try{
  E.zufallSetzen(4711);const x=E.VEREIN.vereinSaison(v0);
  E.zufallSetzen(4711);const y=E.VEREIN.vereinSaison(v0);
  assert.equal(x.rang,y.rang,'gleicher Würfel, gleiche Tabelle');
  assert.equal(x.beleg.summeEin,y.beleg.summeEin);
  assert.equal(x.beleg.summeAus,y.beleg.summeAus);
  assert.equal(x.beleg.ergebnis,y.beleg.ergebnis);
 }finally{E.zufallSetzen(null);}
 /* Ein anderer Verein bekommt andere Angebote und Ereignisse. */
 const c=E.VEREIN.vereinSaison({...v0,name:'Ganz anderer Verein'});
 assert(Number.isFinite(c.beleg.ergebnis));
});

test('Vereinswirtschaft: fünfzehn Jahre am Stück bleiben endlich',()=>{
 let v=E.VEREIN.einschreiben(spielbereiterVerein()).v;
 for(let i=0;i<15;i++){
  const r=E.VEREIN.vereinSaison(v);
  if(r.fehler)break;                      /* Kader kann unter das Minimum fallen */
  for(const k of ['kasse','stimmung','gehaltsniveau'])
   assert(Number.isFinite(r.v[k]),k+' ist in Jahr '+(i+1)+' keine Zahl: '+r.v[k]);
  assert(r.v.stimmung>=0&&r.v.stimmung<=100);
  assert(r.v.gehaltsniveau>=0.75&&r.v.gehaltsniveau<=2);
  v=r.v;
 }
 assert(v.chronik.length>=1);
 assert(v.chronik.every(c=>!c.wirtschaft||Number.isFinite(c.wirtschaft.kasse)));
});

test('Packladen und Sammlung rendern leeren sowie gefüllten Fundus',()=>{
 const leer=E.KARTEN.leererPool();
 for(const tab of ['laden','sammlung'])assert(E.renderPacks(leer,tab).length>100);
 const gezogen=E.KARTEN.ziehen('bronze',leer,2026);
 // Produktive Zusammenführung statt eines handgebauten Kartenbestands.
 const pool=E.KARTEN.poolErgaenzen(leer,gezogen.karten);
 assert(pool.karten.length>0);const html=E.renderPacks(pool,'sammlung');assert(html.includes(pool.karten[0].name));
});
test('Späte Karrierefortsetzung folgt der tatsächlichen Wahl und wartet eine Saison',()=>{
 for(const weg of ['einsatz','begleiten','kraefte']){
  const p=player(15);p.straenge={spaet:{stufe:1,seit:15,weg}};
  assert.equal(E.EVENTS.filter(e=>e.strang==='spaet'&&E.strangDran(e,p)).length,0);
  p.straenge.spaet.seit=14;
  const es=E.EVENTS.filter(e=>e.strang==='spaet'&&E.strangDran(e,p));assert.deepEqual(es.map(e=>e.id),['spaet_'+weg]);
  const save=E.laufStand(p,'event',{queue:es},E.EVENTS,'35.179');
  assert.equal(E.laufWeiter(JSON.parse(JSON.stringify(save)),E.EVENTS).queue[0].id,'spaet_'+weg);
 }
 const alt=player(15);alt.evLog.spaete_prioritaet=14;
 assert.equal(E.EVENTS.filter(e=>e.strang==='spaet'&&e.stufe===2&&E.strangDran(e,alt)).length,0,'Historischer evLog darf keine Wahl erfinden');
});

test('Charaktererstellung startet mit eingeklappten Feinheiten und kompaktem Spielerpass',()=>{
 const html=E.renderCreate();assert(!html.includes('Dein Spielerporträt'));assert(html.includes('Freie Merkmale würfeln'));assert(html.includes('aria-expanded="false"'));assert(html.includes('>Würfeln</button>'));assert(html.includes('>Feinheiten</button>'));assert(html.includes(' · Nr. '));assert(!html.includes('NaN'));
});
test('Neue Porträts haben gültige SVG-Werte und eindeutige Clip-/Gradientenkennungen',()=>{
 const html=E.renderPortraits();assert(!html.includes('NaN'));assert(!html.includes('undefined'));
 const ids=[...html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const m of html.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]));
});

test('Ruhmeshallen-Porträt bleibt auf Karte, im Kader und nach Altstand-Abgleich erhalten',()=>{
 const h={id:'portrait-test',nr:3,name:'Marvin Test',peak:90,age:40,natId:'GER',g:'w',avatar:321,zuege:{stil:2,kopf:8,haut:4,haar:2,frisur:7,bart:3}};
 const card=E.KARTEN.ausHalle(h,3);
 assert.deepEqual(card.portraet,{avatar:321,zuege:h.zuege,g:'w'});
 assert.notEqual(card.portraet.zuege,h.zuege);
 const old={...card,ovr:95,sonderkarte:true}; delete old.portraet;
 const unrelated={...old,kid:'h:other:Marvin Test'};
 const pool=E.KARTEN.portraetsAbgleichen({karten:[old,unrelated],stand:2},[h]);
 assert.equal(pool.karten.length,2);assert.equal(pool.karten[0].ovr,95);assert.equal(pool.karten[0].sonderkarte,true);
 assert.deepEqual(pool.karten[0].portraet,card.portraet);assert.equal(pool.karten[1].portraet,undefined);
 assert.equal(old.portraet,undefined);
 const legacy={...h,id:undefined,nr:7};
 const legacyCard=E.KARTEN.ausHalle(legacy,7);delete legacyCard.portraet;
 const sameNameWrongId={...legacyCard,kid:'h:0:Marvin Test'};
 const legacyPool=E.KARTEN.portraetsAbgleichen({karten:[legacyCard,sameNameWrongId]},[legacy]);
 assert.deepEqual(legacyPool.karten[0].portraet,card.portraet);
 assert.equal(legacyPool.karten[1].portraet,undefined);
 assert.deepEqual(E.KARTEN.portraetsAbgleichen({karten:[card]},[]).karten[0].portraet,card.portraet);
 const merged=E.KARTEN.poolErgaenzen({karten:[old]},[card]);assert.deepEqual(merged.karten[0].portraet,card.portraet);assert.equal(merged.karten[0].ovr,95);
 const v=E.VEREIN.karteEinsetzen({...E.VEREIN.leererVerein(),gegruendet:true,kader:[]},card);
 assert.equal(v.fehler,null);assert.deepEqual(v.v.kader[0].portraet,card.portraet);
 assert.deepEqual(E.KARTEN.ausKader(v.v.kader[0],'Test',2030).portraet,card.portraet);
});


test('Sammlung rendert die tatsächlichen Gesichtsmerkmale der Ruhmeshalle',()=>{
 const h={id:'portrait-render',name:'Test',peak:40,natId:'GER',g:'w',avatar:1234,
 zuege:{stil:2,kopf:8,haut:4,haar:2,frisur:7,bart:3,augen:2,augenfarbe:3,brauen:1,nase:2,mund:1,ohren:0,wangen:0,schmuck:0}};
 const normalize=html=>{
  const svg=html.match(/<svg[^>]*role="img"[^>]*>[\s\S]*?<\/svg>/)[0];
  const ids=[...svg.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);
  let s=svg; ids.sort((a,b)=>b.length-a.length).forEach((id,i)=>{s=s.split(id).join('ID'+i)});
  return s.replace(/<svg[^>]*>/,'<svg>');
 };
 assert.equal(normalize(E.renderPortraitCard(E.KARTEN.ausHalle(h,1))),normalize(E.renderPortraitOriginal(h)));
});


test('Geschlossene Ligatabellen: jeder Rang, Hin/Rückrunde und globale Summen',()=>{
 E.zufallSetzen(351920);
 for(const clubs of Object.values(E.LEAGUES)) {
  const club=clubs[0];
  for(const rank of [1,Math.ceil(clubs.length/2),clubs.length]) {
   const table=E.simTable(club,rank), n=table.length;
   const sum=k=>table.reduce((a,r)=>a+r[k],0);
   assert.equal(table.find(r=>r.me).pos,rank);
   assert.equal(new Set(table.map(r=>r.club)).size,n);
   assert.equal(sum('w'),sum('l'));assert.equal(sum('d')%2,0);
   assert.equal(sum('gf'),sum('ga'));
   assert.equal(sum('pts'),3*n*(n-1)-sum('d')/2);
   table.forEach((r,i)=>{
    assert.equal(r.games,2*(n-1));assert.equal(r.w+r.d+r.l,r.games);
    assert.equal(r.pts,3*r.w+r.d);assert.equal(r.pos,i+1);
    for(const k of ['w','d','l','gf','ga'])assert(Number.isInteger(r[k])&&r[k]>=0);
    if(i){const a=table[i-1];assert(a.pts>r.pts || a.pts===r.pts &&
      (a.gf-a.ga>r.gf-r.ga || a.gf-a.ga===r.gf-r.ga && a.gf>=r.gf));}
   });
  }
 }
});

test('Rücktritt vor/nach Saison und Angebotsannahme hat gleiche Kalendergrenzen in Halle und Abschluss',async()=>{
 for(const stage of ['vorher','ergebnis','folgejahr']) {
  saved.clear();const p=player(0),start=p.year;
  if(stage!=='vorher')E.simulateSeason(p);
  if(stage==='folgejahr'){p.year++;p.age++;}
  const expected={von:start,bis:start+(stage==='vorher'?0:1)};
  assert.deepEqual(E.karriereZeitraum(p),expected);
  const out=await E.runFinish(p);
  assert.equal(out.Hall[0].von,expected.von);assert.equal(out.Hall[0].bis,expected.bis);
  assert(E.renderEnd(out.P).includes('Karriereende '+expected.bis));
 }
});

test('Der Lizenzentzug steigt ab, egal wie gut gespielt wurde',()=>{
 /* DIE ZUSICHERUNG, DIE P1-04 NICHT GEBEN KONNTE. Dort blieb ein Verein mit
    -700 Mio ueber fuenfzehn Saisons in der ersten Liga, weil neun Punkte Abzug
    einen 52-Punkte-Vorsprung nicht schliessen. Hier steigt er ab, auch wenn er
    Meister wird. */
 E.zufallSetzen(20260918);
 /* DER VEREIN MUSS IN EINER LIGA STEHEN, AUS DER ES NACH UNTEN GEHT. Der erste
    Entwurf dieser Pruefung nahm den Testverein, wie `gruenden` ihn anlegt — und
    der startet in der UNTERSTEN Liga der Pyramide. Dort greift der Entzug
    bewusst nicht (`idx > 0`), also war `entzug` zu Recht false und die Pruefung
    mass den falschen Fall. Der Fehler lag in der Pruefung; den Fall der
    untersten Liga deckt jetzt die Pruefung darunter ab. */
 /* GENAU DAS SZENARIO AUS P1-04: ein Kader, der seiner Liga davongelaufen ist,
    mit Schulden, die kein Punktabzug mehr einholt. Der Standardkader (ovr 60)
    wuerde in der obersten Liga Letzter und damit ohnehin absteigen — dann
    pruefte diese Regression wieder den falschen Weg nach unten. */
 const stark=spielbereiterVerein().kader.map(sp=>({...sp,ovr:84,pot:88}));
 const roh=spielbereiterVerein({kasse:-99999,lizenzJahre:2,kader:stark});
 /* `stufenVon` liefert die ganze Leiter, `idx` die Sprosse; hoeher heisst
    hoeherer Index (so liest es auch `aufstieg`). Oberste Sprosse waehlen. */
 const leiter=E.VEREIN.stufenVon(roh.land,roh.liga);
 const tief=E.VEREIN.mitWirtschaft({...roh,liga:leiter[leiter.length-1].liga});
 const v0=E.VEREIN.einschreiben(tief).v;
 const vorher=v0.liga;
 assert(E.VEREIN.stufenVon(v0.land,vorher).findIndex(x=>x.liga===vorher)>0,
   'der Pruefverein steht nicht in der untersten Liga');
 const r=E.VEREIN.vereinSaison(v0);
 assert(!r.fehler,'die Saison laeuft: '+r.fehler);
 assert.equal(r.entzug,true,'die Lizenz ist weg');
 /* DEN SPORTLICHEN ABSTIEG AUSSCHLIESSEN. Der erste Entwurf pruefte nur, dass
    die Liga sich aendert — das erfuellt auch ein gewoehnlicher Abstieg, und die
    Gegenprobe (Entzug wirkt nicht auf die Liga) blieb deshalb gruen. Die
    Pruefung mass also gar nicht, was sie behauptet. Jetzt muss der Verein
    SPORTLICH gehalten haben und trotzdem unten stehen. */
 assert.equal(r.abstieg,false,'sportlich ist er nicht abgestiegen (Rang '+r.rang+' von '+r.N+')');
 assert(r.v.liga!==vorher,'und steht trotzdem eine Liga tiefer');
 /* Eine Liga, nicht zwei. */
 const stufen=E.VEREIN.stufenVon(v0.land,vorher);
 const idx=stufen.findIndex(x=>x.liga===vorher);
 assert.equal(r.v.liga,stufen[idx-1].liga,'genau eine Liga nach unten');
 /* Nach dem Entzug faengt die Zaehlung von vorne an — sonst stiege derselbe
    Verein jede Saison erneut ab, ohne je die Gelegenheit zur Erholung. */
 assert.equal(r.v.lizenzJahre,0,'der Zaehler steht wieder auf null');
 assert.equal(r.v.abzug,0,'und die Auflage ist mit dem Abstieg abgegolten');
 /* Das Vorstandsziel passt zur neuen Lage statt "Um den Titel spielen". */
 assert(r.v.ziel&&r.v.ziel.n,'ein Ziel wird gesetzt: '+JSON.stringify(r.v.ziel));
 const c=r.v.chronik.at(-1).wirtschaft;
 assert.equal(c.entzogen,true,'die Chronik haelt es fest');
});

test('In der untersten Liga bleibt es beim Punktabzug',()=>{
 /* Tiefer geht es nicht. Der Ausschluss aus dem Spielbetrieb waere die naechste
    Stufe und ist nicht gebaut — der Beleg sagt das, statt stumm nichts zu tun. */
 E.zufallSetzen(20260918);
 const unten=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:-99999,lizenzJahre:2}));
 const idx=E.VEREIN.stufenVon(unten.land,unten.liga).findIndex(x=>x.liga===unten.liga);
 assert.equal(idx,0,'der gegruendete Verein startet ganz unten');
 const r=E.VEREIN.vereinSaison(E.VEREIN.einschreiben(unten).v);
 assert(!r.fehler,'die Saison laeuft: '+r.fehler);
 assert.equal(r.entzug,false,'es gibt keinen Zwangsabstieg nach ganz unten');
 assert.equal(r.entzugOhneWirkung,true,'aber der Grund wird benannt');
 /* Und er steigt auch nicht AUF. Ein Verein ohne Lizenz fuer seine Liga
    bekommt erst recht keine fuer die darueber — beim Schreiben dieser Pruefung
    aufgefallen, weil er zunaechst befoerdert wurde. */
 assert.equal(r.v.liga,unten.liga,'die Liga bleibt, in beide Richtungen');
 assert(r.v.abzug>0,'der Punktabzug bleibt die Folge');
});

test('Ohne Lizenzgrund steigt niemand zwangsweise ab',()=>{
 /* Die Gegenrichtung: ein gesunder Verein darf von alldem nichts merken. */
 E.zufallSetzen(20260918);
 const r=E.VEREIN.vereinSaison(E.VEREIN.einschreiben(spielbereiterVerein({kasse:300})).v);
 assert.equal(r.entzug,false);
 assert.equal(r.v.lizenzJahre,0);
 assert.equal((r.v.chronik.at(-1).wirtschaft||{}).entzogen,false);
});

test('Die Oberflaeche zaehlt die Jahre ohne Lizenz sichtbar mit',()=>{
 /* Ein Zwangsabstieg ohne Ansage waere Willkuer. Zwei Saisons Vorwarnung. */
 const erste=E.renderVerein(E.VEREIN.mitWirtschaft(
   spielbereiterVerein({kasse:-9999,abzug:9,lizenzJahre:1})),E.leereAkademie(),'ausbau');
 assert(erste.includes('Ohne Lizenz seit 1'),'der Zaehler steht da');
 assert(erste.includes('Zwangsabstieg'),'und nennt die Folge');
 assert(!erste.includes('NaN'));
 const letzte=E.renderVerein(E.VEREIN.mitWirtschaft(
   spielbereiterVerein({kasse:-9999,abzug:9,lizenzJahre:2})),E.leereAkademie(),'ausbau');
 assert(letzte.includes('Noch eine Saison'),'im letzten Jahr wird es deutlich');
 /* Wer im Rahmen bleibt, sieht den Zaehler gar nicht. */
 const gesund=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:40})),
   E.leereAkademie(),'ausbau');
 assert(!gesund.includes('Ohne Lizenz'));
});

/* ------------------------------------------ Vereinsfuehrung (WIRT-P0-05-UI)
   Preise, Rechtsform und Vorstandsziel rechneten seit dem Wirtschaftskern mit
   und hatten keine Oberflaeche. `preisFaktor` las deshalb immer die
   Voreinstellung 1, `rechtsformWechseln` hatte null Aufrufer. */

test('Ein gesetzter Preis kommt in der Abrechnung wirklich an',()=>{
 /* DIE EIGENTLICHE ZUSICHERUNG. Ein Regler, der einen Wert speichert, den die
    Rechnung nicht liest, waere dieselbe Sorte Placebo wie "Scoutnetz" und
    "Bekannte Adresse" — nur mit Schieberegler. Geprueft wird deshalb die
    EINNAHME, nicht das Feld. */
 const v0=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:50,ausbau:{stadion:3,gastro:3}}));
 const teuer=E.VEREIN.preisSetzen(v0,'ticket',1.6);
 assert.equal(teuer.fehler,null);
 assert.equal(teuer.v.preise.ticket,1.6,'der Wert wird gespeichert');
 /* Gespeichert ist nicht gelesen: der Faktor muss aus dem Verein kommen. */
 assert.equal(E.VEREIN.preisFaktor(E.VEREIN.mitWirtschaft(teuer.v),'ticket'),1.6);
 assert.equal(E.VEREIN.preisFaktor(v0,'ticket'),1,'ohne Setzen bleibt es bei 100 %');
 /* Und die Zuschauerzahl muss sich unterscheiden — sonst rechnet niemand damit. */
 const billig=E.VEREIN.preisSetzen(v0,'ticket',0.6).v;
 const a=E.VEREIN.vereinSaison(E.VEREIN.einschreiben(E.VEREIN.mitWirtschaft(billig)).v);
 const b=E.VEREIN.vereinSaison(E.VEREIN.einschreiben(E.VEREIN.mitWirtschaft(teuer.v)).v);
 assert(!a.fehler&&!b.fehler);
 assert(a.beleg.zuschauer>b.beleg.zuschauer,
   'billiger fuellt das Stadion staerker: '+a.beleg.zuschauer+' vs '+b.beleg.zuschauer);
});

test('Preise werden geklemmt und pruefen vor dem Schreiben',()=>{
 const v=spielbereiterVerein();
 assert.equal(E.VEREIN.preisSetzen(v,'ticket',99).v.preise.ticket,E.VEREIN.PREIS_MAX);
 assert.equal(E.VEREIN.preisSetzen(v,'ticket',-5).v.preise.ticket,E.VEREIN.PREIS_MIN);
 assert(E.VEREIN.preisSetzen(v,'erfunden',1).fehler,'unbekanntes Feld wird abgelehnt');
 assert(E.VEREIN.preisSetzen(v,'ticket','abc').fehler,'Unfug wird abgelehnt');
 /* Ein abgelehnter Aufruf aendert gar nichts. */
 assert.deepEqual(E.VEREIN.preisSetzen(v,'erfunden',1).v,v);
});

test('Der Preishinweis nennt das gerechnete Ertragsmaximum',()=>{
 /* `bestPreis` probiert 51 Werte durch — der Hinweis ist ein Versprechen, kein
    Schaetzwert. Hier wird nur geprueft, dass die Oberflaeche ihn ueberhaupt
    bekommt und dass er in den Grenzen liegt; die Richtigkeit haelt
    tools/vereinswirtschaft.test.cjs fest. */
 for(const feld of ['ticket','gastro','merch']){
  const b=E.VEREIN.bestPreis(spielbereiterVerein(),feld);
  assert(Number.isFinite(b),feld+': '+b);
  assert(b>=E.VEREIN.PREIS_MIN&&b<=E.VEREIN.PREIS_MAX,feld+' liegt in den Grenzen: '+b);
 }
});

test('Die Rechtsform wechselt nur nach vorn und nur mit Groesse und Geld',()=>{
 const klein=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:500}));
 /* Ein Verein in der untersten Liga kommt nicht an die Boerse. */
 assert(E.VEREIN.rechtsformWechseln(klein,'ag').fehler,'zu klein fuer die AG');
 /* Rueckwaerts geht gar nicht. */
 assert(E.VEREIN.rechtsformWechseln({...klein,rechtsform:'gmbh'},'ev').fehler,
   'der Weg fuehrt nur nach vorn');
 /* Mit Liga und Geld geht es, und die Einlage kommt an. */
 const gross={...klein,ligastufe:1,kasse:500};
 const r=E.VEREIN.rechtsformWechseln(gross,'gmbh');
 assert.equal(r.fehler,null,'Wechsel moeglich: '+r.fehler);
 assert.equal(r.v.rechtsform,'gmbh');
 const rf=E.VEREIN.RECHTSFORMEN.find(x=>x.id==='gmbh');
 assert.equal(r.v.kasse,Math.round((500-rf.wechselKosten+rf.einlage)*100)/100,
   'Kosten ab, Einlage drauf');
 assert(r.v.stimmung<(gross.stimmung??60),'und es kostet Stimmung');
 /* `ligastufe` ist abgeleitet und darf NICHT im Spielstand landen. */
 assert.equal(r.v.ligastufe,undefined,'kein abgeleitetes Feld im Stand');
 /* Ohne Geld kein Wechsel, und der Stand bleibt unberuehrt. */
 const arm={...gross,kasse:0};
 const nein=E.VEREIN.rechtsformWechseln(arm,'gmbh');
 assert(nein.fehler,'ohne Geld kein Wechsel');
 assert.equal(nein.v.rechtsform,'ev');
});

test('Der Fuehrungsreiter zeigt Ziel, Preise und Rechtsform ohne NaN',()=>{
 const v=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:60,
   ziel:E.VEREIN.zielSetzen({ligastufe:2},8,18)}));
 const html=E.renderVerein(v,{...E.leereAkademie(),vc:100},'ausbau');
 assert(!html.includes('NaN'));
 assert(!html.includes('undefined'));
 assert(html.includes('Vorstandsziel'),'das Ziel steht da, bevor es entschieden ist');
 assert(html.includes('Preise'));
 assert(html.includes('Eintritt')&&html.includes('Gastronomie')&&html.includes('Fanartikel'));
 assert(html.includes('Ertragsmaximum'),'der Hinweis wird genannt');
 assert(html.includes('Rechtsform')&&html.includes('e.V.'));
 assert(html.includes('Umwandeln'),'der naechste Schritt wird angeboten');
 /* Der Reiter heisst jetzt "Fuehrung", weil er mehr traegt als Ausbau — und
    "Chronik" muss weiter daneben stehen (320-Pixel-Befund aus #13). */
 const leiste=html.split('Vereinskasse')[0];
 assert(leiste.includes('>Führung<'),'der Reiter traegt den neuen Namen');
 assert(!leiste.includes('>Ausbau<'),'der alte ist weg');
 assert(leiste.includes('>Chronik<')&&leiste.includes('>Partner<'));
 /* Ein Verein ohne Ziel (alter Stand) rendert trotzdem. */
 const ohne=E.renderVerein(E.VEREIN.mitWirtschaft(spielbereiterVerein()),E.leereAkademie(),'ausbau');
 assert(!ohne.includes('NaN'));
 assert(!ohne.includes('Vorstandsziel'),'ohne Ziel keine leere Kachel');
});

test('Der Fuehrungsreiter macht das Stadion sichtbar (P1-02)',()=>{
 /* Wer eine Ausbaustufe kauft, sah danach eine groessere Zahl in der
    Abrechnung, ohne je erfahren zu haben, wie viele Plaetze er hat. Der Ausbau
    war eine Zahlung ins Ungewisse. */
 const v=E.VEREIN.mitWirtschaft(spielbereiterVerein({kasse:60,ausbau:{stadion:3,training:1,medizin:1}}));
 const html=E.renderVerein(v,E.leereAkademie(),'ausbau');
 assert(!html.includes('NaN'));
 assert(html.includes('Stadion'));
 assert(html.includes('22.000'),'die aktuellen Plaetze stehen da');
 assert(html.includes('33.000'),'und was die naechste Stufe braechte');
 assert(html.includes('11.000'),'samt Unterschied');
 assert(html.includes('Noch keine Saison gespielt'),'ohne Chronik wird das gesagt');
 /* Voll ausgebaut sagt es ebenfalls, statt eine leere Zeile zu zeigen. */
 const max=E.VEREIN.mitWirtschaft(spielbereiterVerein({ausbau:{stadion:6,training:1,medizin:1}}));
 const hmax=E.renderVerein(max,E.leereAkademie(),'ausbau');
 assert(hmax.includes('64.000')&&hmax.includes('Voll ausgebaut'));
 assert(!hmax.includes('NaN'));
});

test('Ausverkauft steht im Bericht und in der Chronik (P1-02)',()=>{
 E.zufallSetzen(20260918);
 const stark=spielbereiterVerein().kader.map(sp=>({...sp,ovr:86,pot:90}));
 const v0=E.VEREIN.einschreiben(E.VEREIN.mitWirtschaft(
   spielbereiterVerein({kader:stark,stimmung:85,kasse:50,
     ausbau:{stadion:2,training:1,medizin:1}}))).v;
 const r=E.VEREIN.vereinSaison(v0);
 assert(!r.fehler,'die Saison laeuft: '+r.fehler);
 /* Der Beleg traegt Plaetze und Marke, ganz gleich wie es ausging. */
 assert(Number.isFinite(r.beleg.plaetze)&&r.beleg.plaetze>0,'Plaetze im Beleg');
 assert.equal(typeof r.beleg.ausverkauft,'boolean');
 const c=r.v.chronik.at(-1).wirtschaft;
 assert.equal(c.plaetze,r.beleg.plaetze,'und wandern in die Chronik');
 assert.equal(c.ausverkauft,r.beleg.ausverkauft);
 assert(Number.isFinite(c.auslastung));
});

/* --------------------------------------- Vermaechtnisbonus "Bekannte Adresse"
   Bis 18.09.2026 war das Extra fuer 350 Abschlusspunkte ein Placebo: `fx:
   { aufnahmen: 1 }` wanderte ueber `neuerVerein` nach `v.bonus.aufnahmen`,
   wurde im Vereinsbildschirm angezeigt — und von niemandem gelesen. Dieselbe
   Sorte Fehler wie das entfernte "Scoutnetz", nur teurer. */

test('Der Aufnahmebonus wirkt im Rechenkern der Akademie',()=>{
 /* Direkt am Modul: gleiche Saat, gleiche Akademie, einmal mit und einmal
    ohne Bonus. Die Zahl der Aufnahmen muss sich um genau den Bonus
    unterscheiden — alles andere waere Zufall statt Wirkung. */
 const messe=(bonus)=>{
  E.zufallSetzen(4242);
  const a0=E.akaGruenden(E.leereAkademie(),'Testakademie',2026);
  const vorher=a0.bilanz.aufgenommen;
  const a1=E.akaVerbuchen(a0,0,undefined,bonus).a;
  return a1.bilanz.aufgenommen-vorher;
 };
 const ohne=messe(undefined);
 assert(ohne>0,'ohne Bonus kommen ueberhaupt Talente: '+ohne);
 assert.equal(messe(1),ohne+1,'ein Bonus, ein Talent mehr');
 assert.equal(messe(2),ohne+2,'zwei Bonus, zwei mehr');
 /* Kaputte Staende duerfen nicht zum Geschenk und nicht zum Schaden werden. */
 assert.equal(messe(0),ohne);
 assert.equal(messe(-3),ohne,'ein negativer Bonus nimmt nichts weg');
 assert.equal(messe('kaputt'),ohne);
});

test('Der Aufnahmebonus kommt ueber den echten Karriereabschluss in der Akademie an',async()=>{
 /* DIE EIGENTLICHE ZUSICHERUNG. Der Bonus liegt am VEREIN und wirkt in der
    AKADEMIE; dazwischen liegt der Abschluss-Handler in App.jsx. Genau dort
    stehen ZWEI Bindungen namens `verein` — die Vereinsablage (useState) und
    eine Zeichenkette in einer Renderfunktion. Greift die falsche, ist der
    Bonus still wieder wirkungslos und der Prueflauf am Modul bliebe gruen.
    Deshalb wird hier durch den echten Handler gemessen, nicht am Modul. */
 const lauf=async(bonus)=>{
  E.zufallSetzen(20260918);
  const aka=E.akaGruenden(E.leereAkademie(),'Testakademie',2026);
  const verein=bonus==null?null:{...E.VEREIN.leererVerein(),gegruendet:true,bonus:{aufnahmen:bonus}};
  const r=await E.runFinish(player(6),{aka,verein});
  return r.Aka.bilanz.aufgenommen-aka.bilanz.aufgenommen;
 };
 const ohne=await lauf(null);
 assert(ohne>0,'ohne Verein nimmt die Akademie trotzdem auf: '+ohne);
 assert.equal(await lauf(0),ohne,'ein Verein ohne Bonus aendert nichts');
 assert.equal(await lauf(1),ohne+1,'der Bonus kommt an');
});
