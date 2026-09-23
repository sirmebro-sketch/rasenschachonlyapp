const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function CharFix05Probe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:1,nase:0,mund:3,ohren:1,wangen:0,schmuck:0,details:0,schminke:0,bart:0,frisur:27};
 const farben=[
  {haut:0,haar:0,label:'hell / dunkel'},
  {haut:1,haar:12,label:'hell / hell'},
  {haut:13,haar:0,label:'dunkel / dunkel'},
  {haut:13,haar:12,label:'dunkel / hell'},
 ];
 const avatar=(kopf,size,farbe,key)=><div className="probe" data-kind="langlocken" data-kopf={kopf} data-size={size} data-haut={farbe.haut} data-haar={farbe.haar} key={key}>
   <Avatar seed={270000+kopf*1000+size*10+farbe.haut+farbe.haar} zuege={{...basis,kopf,haut:farbe.haut,haar:farbe.haar}} size={size} g="m" nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
   <span>K{kopf} · {farbe.label}</span>
  </div>;
 return <div className="fl"><style>{CSS+' body{margin:0}.cf5{max-width:1500px;margin:auto;padding:18px}.cf5 h1{margin:0 0 8px}.cf5 h2{font-size:15px;margin:18px 0 7px}.note{max-width:950px;color:var(--mu)}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}.probe{text-align:center;background:#181a17;padding:6px;border-radius:7px}.probe svg{margin:auto}.probe span{display:block;font-size:9px;color:var(--mu);margin-top:3px}'}</style><main className="cf5">
  <h1>CHAR-FIX-05 · Männerfrisur 27 „Lange Locken“</h1>
  <p className="note">Echter Avatar-Renderer. Alle 14 Kopfformen × vier helle/dunkle Haut-/Haarkontexte × 72/96/145 px. Ziel: lange Locken rahmen das Gesicht, ohne Augen/Brauen auf einer massiven Haarfläche erscheinen zu lassen.</p>
  {[72,96,145].map(size=><section data-testid={'langlocken-'+size} data-size={size} key={size}><h2>{size} px</h2><div className="grid">
   {Array.from({length:14},(_,kopf)=>farben.map((farbe,fi)=>avatar(kopf,size,farbe,kopf+'-'+size+'-'+fi)))}
  </div></section>)}
 </main></div>;
}
createRoot(document.getElementById('root')).render(<CharFix05Probe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'char-fix-05.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHAR-FIX-05</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'char-fix-05.html'));
})();
