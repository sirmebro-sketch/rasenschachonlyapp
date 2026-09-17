const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function CharFixProbe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:0,nase:0,mund:3,ohren:1,wangen:0,schmuck:0,details:0,schminke:0,bart:0};
 const haut=[{name:'hell',id:0},{name:'mittel',id:7},{name:'dunkel',id:13}];
 const sizes=[72,96,145];
 const geschlechter=['m','w'];
 const frisur=(g,size,hi)=>{
  if(g==='m')return size===72?[0,1,3][hi]:size===96?[13,21,1][hi]:[21,3,0][hi];
  return size===72?[0,7,19][hi]:size===96?[7,19,0][hi]:[19,0,23][hi];
 };
 const matrix=[];
 for(const size of sizes)for(const g of geschlechter)for(let hi=0;hi<haut.length;hi++)matrix.push({size,g,haut:haut[hi],frisur:frisur(g,size,hi)});
 const kritisch=[
  {label:'m · rasiert · hell · 72',g:'m',haut:0,frisur:0,size:72},
  {label:'m · undercut · mittel · 96',g:'m',haut:7,frisur:3,size:96},
  {label:'m · fade · dunkel · 145',g:'m',haut:13,frisur:21,size:145},
  {label:'w · kurz · hell · 72',g:'w',haut:0,frisur:0,size:72},
  {label:'w · pixie · mittel · 96',g:'w',haut:7,frisur:7,size:96},
  {label:'w · fade · dunkel · 145',g:'w',haut:13,frisur:19,size:145},
 ];
 const render=(kopf,r,i,key)=><div className="probe" data-size={r.size} data-g={r.g} data-haut={r.haut?.name||r.haut} data-frisur={r.frisur} key={key}>
  <Avatar seed={93000+kopf*100+i} zuege={{...basis,kopf,haut:r.haut?.id??r.haut,haar:r.haut?.id===13?12:2,frisur:r.frisur}} size={r.size} g={r.g} nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
  <div className="lbl">{r.label||((r.g==='m'?'M':'W')+' · '+r.haut.name+' · '+r.size+' · F'+r.frisur)}</div>
 </div>;
 return <div className="fl"><style>{CSS+' body{margin:0}.charfix{max-width:1540px;margin:auto;padding:18px}.kopfkarte{min-width:0}.kritisch,.matrix{display:flex;gap:8px;align-items:end;flex-wrap:wrap}.probe{text-align:center;min-width:76px}.lbl{font-size:9px;color:var(--mu);margin-top:3px;overflow-wrap:anywhere}.matrix .probe{flex:0 1 150px}.matrix .probe svg{margin:auto}.kopfkarte h2{margin:0 0 8px;font-size:17px}.neu{outline:1px solid rgba(103,210,143,.55)} '}</style><main className="charfix">
  <h1>CHAR-FIX-01 · Kopf / Hals / Frisur</h1>
  <p>Reproduzierbare Sichtmatrix: jede Kopfform in 72 / 96 / 145 px, beide Geschlechter, helle / mittlere / dunkle Haut und wechselnde kritische Kurzhaarformen.</p>
  <section data-testid="kritisch" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,360px),1fr))',gap:12,marginBottom:18}}>
   {KOPFFORM.map((k,id)=><article data-id={id} className={'pan pad kopfkarte '+(id>=10?'neu':'')} key={'k'+id}>
    <h2>ID {id} · {k.n}</h2><div className="kritisch">{kritisch.map((r,i)=>render(id,r,i,'c'+i))}</div>
   </article>)}
  </section>
  <section data-testid="matrix">
   {KOPFFORM.map((k,id)=><article data-id={id} className={'pan pad kopfkarte '+(id>=10?'neu':'')} key={'m'+id} style={{marginBottom:12}}>
    <h2>ID {id} · {k.n} · Vollmatrix</h2><div className="matrix">{matrix.map((r,i)=>render(id,r,i,'m'+i))}</div>
   </article>)}
  </section>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<CharFixProbe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'char-fix-01.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHAR-FIX-01</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'char-fix-01.html'));
})();
