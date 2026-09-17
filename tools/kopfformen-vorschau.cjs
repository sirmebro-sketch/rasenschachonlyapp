const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function KopfProbe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:0,nase:0,mund:3,ohren:1,wangen:0,schmuck:0,details:0,schminke:0};
 const proben=[
  {label:'hell · kurz',g:'m',haut:0,haar:0,frisur:1,bart:0,size:96},
  {label:'dunkel · kurz',g:'m',haut:13,haar:12,frisur:1,bart:0,size:96},
  {label:'Bart + Locs',g:'m',haut:7,haar:4,frisur:22,bart:15,size:96},
  {label:'klein · Flechtkranz',g:'w',haut:9,haar:2,frisur:23,bart:0,size:72},
 ];
 return <div className="fl"><style>{CSS}</style><main style={{maxWidth:1180,margin:'auto',padding:18}}>
  <h1>CHAR-P1-01 · Kopfformen</h1>
  <p style={{maxWidth:860}}>ChatGPT/Codex-Sichtprobe: identische Gesichtszüge, mehrere Haut-/Haarkontexte sowie Haar-/Bartprobe. Gespeicherte IDs bleiben sichtbar.</p>
  <section data-testid="koepfe" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))',gap:12}}>
   {KOPFFORM.map((kopf,id)=><article className="pan pad" data-id={id} key={id} style={{minWidth:0}}>
    <div className="d" style={{fontSize:15}}>ID {id} · {kopf.n}</div>
    <div style={{display:'flex',alignItems:'end',gap:8,flexWrap:'wrap',marginTop:8,minWidth:0}}>
     {proben.map((r,ri)=>{const z={...basis,kopf:id,haut:r.haut,haar:r.haar,frisur:r.frisur,bart:r.bart};return <div key={ri} style={{textAlign:'center',flex:'1 1 68px',minWidth:0}}>
      <Avatar seed={8100+id*10+ri} zuege={z} size={r.size} g={r.g} nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
      <div className="m" style={{fontSize:9,color:'var(--mu)',marginTop:3,overflowWrap:'anywhere'}}>{r.label}</div>
     </div>})}
    </div>
   </article>)}
  </section>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<KopfProbe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'kopfformen.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach Kopfformen</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'kopfformen.html'));
})();
