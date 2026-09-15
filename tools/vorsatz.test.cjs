const {test,before}=require('node:test');const assert=require('node:assert/strict');let V;
before(async()=>{V=await import('../vorsatz.js');});
const base=()=>({vorsatz:null,year:2030,age:25,nation:{id:'GER'},seasons:[],tot:{apps:0},flags:{},rep:20,morale:40,trust:30,fitness:50,injuryProne:20,money:0});
const success={welt:p=>p.seasons=['GER','BRA','ENG'].map(land=>({land})),daheim:p=>p.seasons=Array.from({length:10},()=>({land:'GER'})),lange:p=>p.seasons=Array(10).fill({}),glanz:p=>p.seasons=[{note:2}],beruf:p=>p.flags.abschluss=true,einsatz:p=>p.tot.apps=300};
for(const id of Object.keys(success))test('Vorsatz '+id+': Fortschritt, Belohnung und Wiederladen',()=>{
 const p=base();p.vorsatz=id;assert.equal(V.vorsatzStand(p).erreicht,false);assert.equal(V.vorsatzPunkte(p),0);
 success[id](p);assert(V.vorsatzStand(p).erreicht);assert(V.vorsatzBelohnen(p));
 const copy=JSON.parse(JSON.stringify(p));assert.equal(V.vorsatzBelohnen(copy),false);assert.deepEqual(copy,p);
 assert.equal(V.vorsatzPunkte(copy),V.VORSAETZE.find(v=>v.id===id).punkte);
 copy.retired=true;assert(V.vorsatzStand(copy).erfuellt);assert.equal(V.vorsatzBelohnen(copy),false);
});
test('Daheim: neun Saisons reichen nicht, späteres Ausland verwirft Abschlussbonus',()=>{
 const p=base();p.vorsatz='daheim';p.seasons=Array(9).fill({land:'GER'});assert(!V.vorsatzBelohnen(p));
 p.seasons.push({land:'GER'});assert(V.vorsatzBelohnen(p));assert(!V.vorsatzStand(p).erfuellt);
 const lohn=JSON.stringify(p.vorsatzLohn);p.seasons.push({land:'ENG'});
 assert(V.vorsatzStand(p).gebrochen);assert.equal(V.vorsatzPunkte(p),0);assert.equal(JSON.stringify(p.vorsatzLohn),lohn);
});
test('Grenzfälle: zwei Länder, 299 Spiele und Note über zwei bleiben offen',()=>{
 for(const [id,prepare] of [['welt',p=>p.seasons=[{land:'GER'},{land:'BRA'},{land:'GER'}]],['einsatz',p=>p.tot.apps=299],['glanz',p=>p.seasons=[{note:0},{note:2.1}]]]){
  const p=base();p.vorsatz=id;prepare(p);assert(!V.vorsatzBelohnen(p));
 }
});
test('Alte Spieler ohne Vorsatz bleiben unverändert und Boni beachten Wertgrenzen',()=>{
 const p=base(),vor=JSON.stringify(p);assert.equal(V.vorsatzStand(p),null);assert(!V.vorsatzBelohnen(p));assert.equal(JSON.stringify(p),vor);
 p.vorsatz='lange';success.lange(p);p.fitness=99;p.injuryProne=4;V.vorsatzBelohnen(p);assert.equal(p.fitness,100);assert.equal(p.injuryProne,3);
});
test('Saisonziel wird passend gewählt und nur einmal belohnt',()=>{
 const p=base();p.saisonZiel=V.saisonZielStart(p);assert.equal(p.saisonZiel.id,'chance');
 const s={apps:10};V.saisonZielAbschluss(p,s);assert.equal(p.morale,43);assert(s.saisonZiel.geschafft);
 V.saisonZielAbschluss(p,s);assert.equal(p.morale,43);
 p.seasons=[{injury:{},apps:3}];assert.equal(V.saisonZielStart(p).id,'rueckkehr');
 p.seasons=[{apps:30,club:'A'}];p.club={n:'B'};assert.equal(V.saisonZielStart(p).id,'ankommen');
 p.age=35;assert.equal(V.saisonZielStart(p).id,'erfahrung');
});
test('Vorsatzbeleg zeigt tatsächliche Werte statt Wunschbonus',()=>{
 const p=base();p.vorsatz='welt';success.welt(p);p.morale=99;p.rep=100;V.vorsatzBelohnen(p);
 assert.equal(V.vorsatzLohnText(p),'Moral +1');
 p.vorsatzLohn.welt.wirkung={morale:0,rep:0};assert(V.vorsatzLohnText(p).includes('keine zusätzliche'));
});
test('Bildungsfortschritt wartet auf Abschlussentscheidung, alte Abschlüsse bleiben gültig',()=>{
 const p=base();p.seasons=Array(6).fill({});p.straenge={studium:{stufe:1,seit:3,weg:'lernen'}};
 assert(V.bildungsFortschritt(p).includes('3 / 4'));p.seasons.push({});assert(V.bildungsFortschritt(p).includes('steht noch aus'));
 p.flags.abschluss=true;assert.equal(V.bildungsFortschritt(p),null);
});
test('Vollständig gedeckelte Belohnung gibt einmalig Karrieregeld, alte Belege keine Nachzahlung',()=>{
 const p=base();p.vorsatz='glanz';p.seasons=[{note:1.8}];p.rep=100;p.morale=100;
 assert(V.vorsatzBelohnen(p));assert.equal(p.money,.025);assert.equal(V.vorsatzLohnText(p),'Vermögen +25.000 €');
 const q=JSON.parse(JSON.stringify(p));assert(!V.vorsatzBelohnen(q));assert.equal(q.money,.025);
 q.vorsatzLohn.glanz.wirkung={rep:0,morale:0};assert(!V.vorsatzBelohnen(q));assert.equal(q.money,.025);
});
