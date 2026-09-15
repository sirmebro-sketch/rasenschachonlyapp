/* Einmalige Vorsatzbelohnungen; Fortschritt aus dem gespeicherten Spieler. */
export const VORSAETZE = [
 {id:'welt',n:'Der Weltenbummler',t:'In drei Ländern eine Saison spielen.',punkte:70,lohn:'Bekanntheit +6, Moral +8',fx:{rep:6,morale:8}},
 {id:'daheim',n:'Daheim bleiben',t:'Mindestens zehn Saisons und bis zum Karriereende keine Auslandssaison.',punkte:90,lohn:'Nach zehn heimischen Saisons: Vertrauen +10, Moral +10',fx:{trust:10,morale:10}},
 {id:'lange',n:'Die lange Laufbahn',t:'Mindestens zehn Saisons abschließen.',punkte:45,lohn:'Fitness +10, Verletzungsanfälligkeit −3',fx:{fitness:10,injuryProne:-3}},
 {id:'glanz',n:'Eine herausragende Saison',t:'Eine Saison mit Note 2,0 oder besser abschließen.',punkte:65,lohn:'Bekanntheit +8, Moral +8',fx:{rep:8,morale:8}},
 {id:'beruf',n:'Ein zweites Standbein',t:'Während dieser Laufbahn einen Abschluss machen.',punkte:35,lohn:'Moral +10 und 50.000 €',fx:{morale:10,money:.05}},
 {id:'einsatz',n:'Auf dem Platz zuhause',t:'300 Pflichtspiele in dieser Laufbahn bestreiten.',punkte:80,lohn:'Vertrauen +8, Fitness +8',fx:{trust:8,fitness:8}},
];
export function vorsatzStand(p) {
 const v=VORSAETZE.find(v=>v.id===p?.vorsatz);if(!v)return null;
 const ss=p.seasons||[],land=p.nation?.id;
 const fremd=ss.some(s=>s.land&&s.land!==land);
 let ist=0,soll=1,text='',gebrochen=false;
 if(v.id==='welt'){ist=new Set(ss.map(s=>s.land).filter(Boolean)).size;soll=3;text=ist+' / 3 Länder';}
 if(v.id==='daheim'){ist=ss.filter(s=>s.land===land).length;soll=10;gebrochen=fremd;text=ist+' / 10 heimische Saisons'+(fremd?' · Auslandssaison gespielt':' · weiterhin daheim');}
 if(v.id==='lange'){ist=ss.length;soll=10;text=ist+' / 10 Saisons';}
 if(v.id==='glanz'){const ns=ss.map(s=>s.note).filter(n=>Number.isFinite(n)&&n>0);const best=ns.length?Math.min(...ns):null;ist=best!==null&&best<=2?1:0;text=best===null?'Noch keine Saisonnote':'Beste Note '+best.toFixed(1).replace('.',',')+' · Ziel 2,0';}
 if(v.id==='beruf'){ist=p.flags?.abschluss?1:0;text=ist?'Abschluss erworben':'Abschluss noch offen';}
 if(v.id==='einsatz'){ist=p.tot?.apps||0;soll=300;text=ist+' / 300 Pflichtspiele';}
 const erreicht=ist>=soll&&!gebrochen;
 const beleg=p.vorsatzLohn?.[v.id];
 return {...v,ist,soll,text,gebrochen,erreicht,erfuellt:erreicht&&(v.id!=='daheim'||!!p.retired),
  anteil:gebrochen?0:Math.min(1,ist/soll),belohnt:!!beleg,
  status:gebrochen?'gebrochen':erreicht?(v.id==='daheim'&&!p.retired?'bislang gehalten':'erfüllt'):'offen'};
}
export function vorsatzBelohnen(p) {
 if(!p||p.retired)return false;
 const v=vorsatzStand(p);if(!v?.erreicht||v.belohnt)return false;
 const grenzen={rep:[0,100],morale:[0,100],trust:[0,100],fitness:[0,100],injuryProne:[3,95]};
 const wirkung={};
 for(const [k,wert] of Object.entries(v.fx)){
  const alt=Number.isFinite(p[k])?p[k]:0;
  const [min,max]=grenzen[k]||[0,Infinity];p[k]=Math.max(min,Math.min(max,alt+wert));wirkung[k]=p[k]-alt;
 }
 // 35.177: Vollständig gedeckelte Boni dürfen keine leere Belohnung sein.
 // Einmalige Ersatzprämie in Karrieregeld, keine VC; alte Belege bleiben gültig.
 if(Object.values(wirkung).every(x=>x===0)){
  const alt=Number.isFinite(p.money)?p.money:0;
  p.money=alt+.025;wirkung.money=p.money-alt;
 }
 p.vorsatzLohn={...(p.vorsatzLohn||{}),[v.id]:{jahr:p.year,saisons:(p.seasons||[]).length,wirkung}};
 return true;
}
export function vorsatzPunkte(p){const v=vorsatzStand(p);return v?.erreicht?v.punkte:0;}

// Der gespeicherte Beleg enthält die tatsächlichen, bereits begrenzten Deltas.
export function vorsatzLohnText(p){
 const w=p.vorsatzLohn?.[p.vorsatz]?.wirkung;
 if(!w)return 'Belohnung verbucht; Einzelwerte nicht gespeichert';
 const namen={rep:'Bekanntheit',morale:'Moral',trust:'Vertrauen',fitness:'Fitness',injuryProne:'Verletzungsanfälligkeit',money:'Vermögen'};
 const teile=Object.entries(w).filter(([,v])=>Number.isFinite(v)&&v!==0).map(([k,v])=>`${namen[k]||k} ${v>0?'+':'−'}${k==='money'?Math.round(Math.abs(v)*1000000).toLocaleString('de-DE')+' €':Number(Math.abs(v).toFixed(2))}`);
 return teile.length?teile.join(', '):'keine zusätzliche Steigerung – die Werte lagen bereits an ihren Grenzen';
}
export function bildungsFortschritt(p){
 if(p.flags?.abschluss)return null;
 for(const [id,dauer,name] of [['studium',4,'Fernstudium'],['bildung',2,'Zweiter Bildungsweg']]){
  const s=p.straenge?.[id];
  if(s?.stufe===1&&s.weg==='lernen'){
   const jahre=Math.max(0,(p.seasons?.length||0)-(s.seit||0));
   return jahre>=dauer?`${name}: Lernzeit erfüllt; die Abschlussentscheidung steht noch aus.`:`${name}: ${jahre} / ${dauer} Saisons Lernzeit.`;
  }
 }
 return null;
}

/* Ein freiwilliges, aus der Ausgangslage abgeleitetes Saisonziel. */
export function saisonZielStart(p){
 const vor=p.seasons?.at(-1);let id='platz',n='Regelmäßig auf dem Platz',soll=20;
 if(vor?.injury){id='rueckkehr';n='Zurück in den Spielbetrieb';soll=15;}
 else if(p.age>=34){id='erfahrung';n='Weiter gebraucht werden';soll=15;}
 else if(vor&&vor.club!==p.club?.n){id='ankommen';n='Beim neuen Verein ankommen';soll=15;}
 else if(!vor||vor.apps<15){id='chance';n='Die eigene Chance erarbeiten';soll=10;}
 return {id,n,soll,jahr:p.year,erledigt:false};
}
export function saisonZielAbschluss(p,s){
 const z=p.saisonZiel;if(!z||z.jahr!==p.year||z.erledigt)return;
 const geschafft=s.apps>=z.soll;
 p.saisonZiel={...z,erledigt:true,ist:s.apps,geschafft};
 if(geschafft)p.morale=Math.min(100,p.morale+3);
 s.saisonZiel={...p.saisonZiel};
}
