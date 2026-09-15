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
 p=createPlayer(config);step='training';queue=[];ei=0;er=null;offers=[];
 const meta={},askCache={current:{}},logs=[];
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
   resolve(cs[choose%cs.length]);logs.push(e.id);nextEvent();
  }else if(step==='winter'){winterAccept(offers.find(o=>o.type==='renew')||null);}
  else if(step==='result'){
   const save=JSON.parse(JSON.stringify(laufStand(p,step,{queue,ei,er,season,offers},EVENTS,VERSION)));
   const loaded=laufWeiter(save,EVENTS);if(JSON.stringify(loaded.season)!==JSON.stringify(p.seasons.at(-1)))throw Error('Saison laden');
   const best=[...offers].sort((a,b)=>{const w=x=>(x.roleKey==='star'||x.roleKey==='start'?30:x.roleKey==='rot'?10:0)+x.club.s;return w(b)-w(a);})[0];accept(best);
  }else if(step==='retire'){if(p.endNow)finish(p);else step='training';}
  else throw Error('Phase '+step);
  for(const k of ['age','ovr','potential','money','wage','fitness','form','morale','contract'])if(!Number.isFinite(p[k]))throw Error(k+' '+p.pos);
  if(p.tot.apps!==p.seasons.reduce((a,s)=>a+s.apps,0))throw Error('Einsatzsumme');
 }
 if(!p.retired)throw Error('Laufbahn endet nicht');
 p.verdict=verdict(p);return {p,vc:vcFuer(p),logs};
}
`;
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'rs-langzeit-'));
try{
 const outfile=path.join(temp,'engine.cjs');
 buildSync({stdin:{contents:source+'\n'+ext,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent'});
 const E=require(outfile),rows=[];let seed=351720;
 for(const pos of Object.keys(E.POS))for(const gender of ['m','w'])for(const mode of E.MODES)for(let choice=0;choice<4;choice++){
  E.zufallSetzen(seed++);const type=E.TYPES.filter(t=>t.pos.includes(pos))[choice];
  try{
   const r=E.auditCareer({name:'Pruefling',nation:['GER','BRA','JPN','NGA'][choice],pos,gender,mode:mode.id,type:type.id,speed:choice===3,foot:'rechts',number:9},choice);
   rows.push({pos,gender,mode:mode.id,years:r.p.seasons.length,vc:r.vc,events:r.logs.length,ids:r.logs});
  }catch(e){throw Error(JSON.stringify({seed:seed-1,pos,gender,mode:mode.id,choice})+': '+e.message);}
 }
 const stats=a=>{a.sort((a,b)=>a-b);return {min:a[0],median:a[Math.floor(a.length/2)],max:a.at(-1),mean:+(a.reduce((s,x)=>s+x,0)/a.length).toFixed(1)}};
 console.log(JSON.stringify({careers:rows.length,seasons:rows.reduce((s,x)=>s+x.years,0),events:rows.reduce((s,x)=>s+x.events,0),years:stats(rows.map(x=>x.years)),careerVC:stats(rows.map(x=>x.vc)),byMode:E.MODES.map(m=>({mode:m.id,vc:stats(rows.filter(x=>x.mode===m.id).map(x=>x.vc))})),uniqueEvents:new Set(rows.flatMap(x=>x.ids)).size},null,2));
 // Verkaufserlös ohne Sonderkarten: diese sind nicht verkäuflich.
 E.zufallSetzen(351721);
 for(const pk of E.KARTEN.PACKS){let total=0;for(let i=0;i<2000;i++)total+=E.KARTEN.ziehen(pk.id,E.KARTEN.leererPool(),2026+i).karten.reduce((s,k)=>s+E.KARTEN.erloes(k),0);console.log(JSON.stringify({pack:pk.id,n:2000,price:pk.preis,meanSale:+(total/2000).toFixed(2),returnPercent:+(total/2000/pk.preis*100).toFixed(1)}));}
}finally{fs.rmSync(temp,{recursive:true,force:true});}
