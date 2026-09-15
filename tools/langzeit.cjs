/* Optional: node tools/langzeit.cjs. Nutzt echte UI-Handler ohne DOM/Animation.
   Abschlussbuchung wird separat in regression.test.cjs geprüft.

   Die Handler werden textlich aus App.jsx geschnitten, entlang der Marken aus
   tools/anker.cjs. Bis 15.09.2026 dienten dafür beliebige Codezeilen — zuletzt
   die ungenutzte Funktion `quickSim`. Ihr Entfernen hätte diesen Lauf mit
   der irreführenden Meldung „Handler fehlt: const chooseTraining =" beendet,
   und weil er nicht in der CI läuft, erst beim nächsten Lauf von Hand.
   Siehe README.md, Abschnitt „Prüfstände". */
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {buildSync}=require('esbuild');
const {block}=require('./anker.cjs');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
const handlers=block(source,'handler');
const names=[...new Set([...handlers.matchAll(/\b(set[A-Z]\w*)\(/g)].map(m=>m[1]))];
const ext=`
export {POS,TYPES,MODES,zufallSetzen,KARTEN};
export function auditCareer(config, choose) {
 RUHE=true;
 ${names.map(n=>`let ${n[3].toLowerCase()+n.slice(4)};const ${n}=v=>{${n[3].toLowerCase()+n.slice(4)}=v;};`).join('\n')}
 p=createPlayer(config);p.vorsatz=config.vorsatz;step='training';queue=[];ei=0;er=null;offers=[];
 const meta={},askCache={current:{}},logs=[],jahre=[];
 const saveGame=()=>true;
 const finish=q=>{p=q;p.retired=true;step='done';};
 ${block(source,'helfer')}
 ${handlers}
 let turns=0;
 while(step!=='done'&&turns++<400) {
  if(step==='training')chooseTraining(TRAINING[p.seasons.length%TRAINING.length].id);
  else if(step==='event'){
   const e=queue[ei],cs=offeneWahlen(e,p);if(!cs.length)throw Error('Keine Auswahl '+e.id);
   for(const v of [e.title,e.text,...cs.flatMap(c=>[c.label,c.hint])]){const t=evText(v,e._ctx);if(t&&/undefined|NaN/.test(t))throw Error('Text '+e.id+': '+t);}
   const zielWahl=p.vorsatz==='beruf'?cs.find(c=>c.roll?.some(o=>o.fx?.flag==='abschluss')):null;resolve(zielWahl||cs[choose%cs.length]);logs.push(e.id);nextEvent();
  }else if(step==='winter'){winterAccept(offers.find(o=>o.type==='renew')||null);}
  else if(step==='result'){
   const save=JSON.parse(JSON.stringify(laufStand(p,step,{queue,ei,er,season,offers},EVENTS,VERSION)));
   const loaded=laufWeiter(save,EVENTS);if(JSON.stringify(loaded.season)!==JSON.stringify(p.seasons.at(-1)))throw Error('Saison laden');
   jahre.push({saison:p.seasons.length,events:logs.length-(jahre.at(-1)?.summe||0),summe:logs.length});
   const heimisch=p.vorsatz==='daheim'?offers.filter(o=>o.club?.c===p.nation.id):[];
   const best=[...(heimisch.length?heimisch:offers)].sort((a,b)=>{const w=x=>(x.roleKey==='star'||x.roleKey==='start'?30:x.roleKey==='rot'?10:0)+x.club.s;return w(b)-w(a);})[0];accept(best);
  }else if(step==='retire'){if(p.endNow)finish(p);else step='training';}
  else throw Error('Phase '+step);
  for(const k of ['age','ovr','potential','money','wage','fitness','form','morale','contract'])if(!Number.isFinite(p[k]))throw Error(k+' '+p.pos);
  if(p.tot.apps!==p.seasons.reduce((a,s)=>a+s.apps,0))throw Error('Einsatzsumme');
 }
 if(!p.retired)throw Error('Laufbahn endet nicht');
 p.verdict=verdict(p);return {p,vc:vcFuer(p),logs,jahre,vorsatz:vorsatzStand(p)};
}
`;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rs-langzeit-'));
try{
 const outfile=path.join(temp,'engine.cjs');
 buildSync({stdin:{contents:source+'\n'+ext,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent'});
 const E=require(outfile),rows=[];let seed=351720;
 for(const pos of Object.keys(E.POS))for(const gender of ['m','w'])for(const mode of E.MODES)for(let choice=0;choice<4;choice++)for(const ziel of (process.argv.includes('--vorsatzvergleich')?['welt','daheim','lange','glanz','beruf','einsatz']:[null])){
  E.zufallSetzen(seed++);const type=E.TYPES.filter(t=>t.pos.includes(pos))[choice];
  try{
   const r=E.auditCareer({name:'Pruefling',vorsatz:ziel||['welt','daheim','lange','glanz','beruf','einsatz'][(seed-351721)%6],nation:['GER','BRA','JPN','NGA'][choice],pos,gender,mode:mode.id,type:type.id,speed:choice===3,foot:'rechts',number:9},choice);
   rows.push({pos,gender,mode:mode.id,years:r.p.seasons.length,vc:r.vc,events:r.logs.length,ids:r.logs,jahre:r.jahre,vorsatz:r.vorsatz?.id,erreicht:r.vorsatz?.erreicht,lohnSaison:r.p.vorsatzLohn?.[r.vorsatz?.id]?.saisons,lohnWirkung:r.p.vorsatzLohn?.[r.vorsatz?.id]?.wirkung});
  }catch(e){throw Error(JSON.stringify({seed:seed-1,pos,gender,mode:mode.id,choice})+': '+e.message);}
 }
 const stats=a=>{a.sort((a,b)=>a-b);return {min:a[0],median:a[Math.floor(a.length/2)],max:a.at(-1),mean:+(a.reduce((s,x)=>s+x,0)/a.length).toFixed(1)}};
 console.log(JSON.stringify({careers:rows.length,seasons:rows.reduce((s,x)=>s+x.years,0),events:rows.reduce((s,x)=>s+x.events,0),years:stats(rows.map(x=>x.years)),careerVC:stats(rows.map(x=>x.vc)),byMode:E.MODES.map(m=>({mode:m.id,vc:stats(rows.filter(x=>x.mode===m.id).map(x=>x.vc))})),uniqueEvents:new Set(rows.flatMap(x=>x.ids)).size},null,2));
 const goals=['welt','daheim','lange','glanz','beruf','einsatz'].map(id=>{const a=rows.filter(r=>r.vorsatz===id);return {id,n:a.length,erfuellt:a.filter(r=>r.erreicht).length,quoteProzent:+(100*a.filter(r=>r.erreicht).length/a.length).toFixed(1),ohneSpielerwirkung:a.filter(r=>r.lohnWirkung&&Object.values(r.lohnWirkung).every(x=>x===0)).length,belohnungSaison:a.filter(r=>r.lohnSaison!=null).map(r=>r.lohnSaison)};});
 for(const feld of ['pos','gender','mode'])console.log(JSON.stringify({vergleich:feld,gruppen:[...new Set(rows.map(r=>r[feld]))].map(wert=>({wert,ziele:goals.map(g=>{const a=rows.filter(r=>r[feld]===wert&&r.vorsatz===g.id);return {id:g.id,n:a.length,quote:a.length?+(100*a.filter(r=>r.erreicht).length/a.length).toFixed(1):null};})}))}));
 const counts={};rows.flatMap(r=>r.ids).forEach(id=>counts[id]=(counts[id]||0)+1);
 console.log(JSON.stringify({phasen:[1,6,11,16,21].map(von=>{const a=rows.flatMap(r=>r.jahre).filter(j=>j.saison>=von&&j.saison<von+5);return {von,bis:von+4,saisons:a.length,ohneEreignis:a.filter(j=>!j.events).length,ereignisseProSaison:+(a.reduce((s,j)=>s+j.events,0)/a.length).toFixed(2)};}),strategie:"Feste Auswahl je Lauf, Abschlussoption bevorzugt, Daheim bevorzugt heimische Sommerangebote; keine repräsentative Spielerstichprobe",vorsatzStichprobe:goals,haeufigsteEreignisse:Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,12),wiederholungen:rows.reduce((s,r)=>s+r.ids.length-new Set(r.ids).size,0)},null,2));
 // Verkaufserlös ohne Sonderkarten: diese sind nicht verkäuflich.
 E.zufallSetzen(351721);
 for(const pk of E.KARTEN.PACKS){let total=0;for(let i=0;i<2000;i++)total+=E.KARTEN.ziehen(pk.id,E.KARTEN.leererPool(),2026+i).karten.reduce((s,k)=>s+E.KARTEN.erloes(k),0);console.log(JSON.stringify({pack:pk.id,n:2000,price:pk.preis,meanSale:+(total/2000).toFixed(2),returnPercent:+(total/2000/pk.preis*100).toFixed(1)}));}
}finally{fs.rmSync(temp,{recursive:true,force:true});}
