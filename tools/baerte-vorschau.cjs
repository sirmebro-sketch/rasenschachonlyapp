const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function BartProbe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:0,nase:0,mund:3,ohren:1,wangen:0,schmuck:0,details:0,schminke:0,frisur:11};
 const proben=[
  {label:'72 · oval · dunkel',kopf:0,haut:0,haar:0,size:72},
  {label:'96 · schmal · blond',kopf:3,haut:7,haar:4,size:96},
  {label:'72 · breit · weiß',kopf:6,haut:11,haar:12,size:72},
  {label:'96 · trapez · braun',kopf:10,haut:4,haar:2,size:96},
  {label:'72 · diamant · dunkel',kopf:12,haut:13,haar:0,size:72},
  {label:'96 · kurzbreit · kupfer',kopf:13,haut:8,haar:6,size:96},
 ];
 return <div className="fl"><style>{CSS}</style><main style={{maxWidth:1280,margin:'auto',padding:18}}>
  <h1>CHAR-P1-04 · Bärte</h1>
  <p style={{maxWidth:900}}>Sichtprobe aller gespeicherten Bart-IDs mit unterschiedlichen Kieferformen, Haut-/Bartfarben und 72/96 px. Die Bart-ID bleibt unverändert; geprüft werden Silhouette, Wangenlinie, Kinnlänge, Schnurrbartanteil und saubere Kopfkopplung.</p>
  <section data-testid="baerte" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,390px),1fr))',gap:12}}>
   {PORTRAET_NAMEN.bart.map((name,id)=><article className="pan pad" data-id={id} key={id} style={{minWidth:0}}>
    <div className="d" style={{fontSize:15}}>ID {id} · {name}</div>
    <div style={{display:'flex',alignItems:'end',gap:7,flexWrap:'wrap',marginTop:8,minWidth:0}}>
     {proben.map((r,ri)=>{const z={...basis,kopf:r.kopf,haut:r.haut,haar:r.haar,bart:id};return <div key={ri} style={{textAlign:'center',flex:'1 1 92px',minWidth:0}}>
      <Avatar seed={9400+id*10+ri} zuege={z} size={r.size} g="m" nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
      <div className="m" style={{fontSize:9,color:'var(--mu)',marginTop:3,overflowWrap:'anywhere'}}>{r.label}</div>
     </div>})}
    </div>
   </article>)}
  </section>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<BartProbe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'baerte.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach Bärte</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'baerte.html'));
})();
