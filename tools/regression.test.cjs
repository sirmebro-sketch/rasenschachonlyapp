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
export {verdict, vorsatzBelohnen, vorsatzPunkte, bilanzLaden, bilanzErgaenzen, akaGruenden, SAVE_KEY, AKA_KEY, LIFE_KEY, createPlayer, develop, simulateSeason, vcFuer, vcPosten, vcAusHaeusern, leereAkademie, leereBilanz, KARTEN, VEREIN, zufallSetzen, rerollWildcard, ladenGesperrt, saisonSchlagzeile, saisonIndex, EVENTS, strangDran, strangWeiter, laufStand, laufWeiter};
export const renderCreate=()=>renderToStaticMarkup(<CreateScreen meta={{}} onStart={()=>{}} onBack={()=>{}}/>);
export const renderPortraits=()=>renderToStaticMarkup(<>{['m','w'].flatMap(g=>Array.from({length:4},(_,i)=><Avatar key={g+i} seed={1} g={g} zuege={{...zuegeAusKennung(1,g,'GER',{}),stil:2,haut:10+i,haar:9+i,frisur:(g==='w'?14:16)+i,details:i,bart:g==='w'?0:10+i%3}}/>))}</>);
export const renderEnd=p=>renderToStaticMarkup(<EndScreen p={p} onNew={()=>{}}/>);
export const renderVerein=(v,aka)=>renderToStaticMarkup(<VereinScreen v={v} aka={aka} onAendern={()=>{}} onZurueck={()=>{}} onAbschluss={()=>{}}/>);
export const renderPacks=(pool,reiter='laden',verein=null)=>renderToStaticMarkup(<Packladen vc={100} pool={pool} verein={verein} gratis={1} startpaket={false} startReiter={reiter} onKauf={()=>{}} onGratis={()=>{}} onStartpaket={()=>{}} onEinsetzen={()=>{}} onEntfernen={()=>{}} onVerkauf={()=>{}} onZurueck={()=>{}}/>);
export const renderReveal=card=>renderToStaticMarkup(<WildcardEnthuellung card={card} onFertig={()=>{}}/>);
export const renderShop=(spieler,schritt='training')=>renderToStaticMarkup(<VCLadenAnsicht wo="saison" vc={100} laden={{}} onKauf={()=>{}} spieler={spieler} schritt={schritt}/>);
export const renderKarriereRueckblick=p=>renderToStaticMarkup(<KarriereRueckblick p={p} onFertig={()=>{}}/>);
export const renderSaisonRueckblick=(p,s)=>renderToStaticMarkup(<SaisonRueckblick p={p} s={s} onFertig={()=>{}}/>);
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

test('Charaktererstellung rendert neue Galerie und Festhalte-Bedienung',()=>{
 const html=E.renderCreate();assert(html.includes('Dein Spielerporträt'));assert(html.includes('Freie Merkmale würfeln'));assert(html.includes('Frisur festhalten'));assert(html.includes('Kurze Naturkrause'));assert(!html.includes('NaN'));
});
test('Neue Porträts haben gültige SVG-Werte und eindeutige Clip-/Gradientenkennungen',()=>{
 const html=E.renderPortraits();assert(!html.includes('NaN'));assert(!html.includes('undefined'));
 const ids=[...html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size);
 for(const m of html.matchAll(/url\(#([^)]*)\)/g))assert(ids.includes(m[1]));
});
