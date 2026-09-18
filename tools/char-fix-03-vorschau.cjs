const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function CharFix03Probe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:0,nase:0,mund:0,ohren:1,wangen:0,schmuck:0,details:0,schminke:0,bart:0};
 const bartPaare=[
  {nase:3,mund:5,label:'lange Nase · voller Mund'},
  {nase:10,mund:6,label:'Stupsnase · breiter Mund'},
  {nase:11,mund:8,label:'hoher Nasenrücken · offenes Lächeln'},
  {nase:6,mund:3,label:'kräftige Nase · entspannter Mund'},
 ];
 const haut=(kopf,paar=0)=>[0,7,11,13][(kopf+paar)%4];
 const haar=(kopf,paar=0)=>[0,2,4,6,12][(kopf+paar)%5];
 const renderHair=(kopf,g,frisur)=><div className="sample" data-kind="haar" data-kopf={kopf} data-g={g} data-frisur={frisur} key={g+'-'+frisur}>
  <Avatar seed={970000+kopf*100+(g==='w'?50:0)+frisur} zuege={{...basis,kopf,haut:haut(kopf),haar:haar(kopf),frisur}} size={72} g={g} nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
  <span>{g.toUpperCase()} F{frisur}</span>
 </div>;
 const renderBart=(kopf,pair,pi,bart)=><div className="sample" data-kind="bart" data-kopf={kopf} data-nase={pair.nase} data-mund={pair.mund} data-bart={bart} key={pi+'-'+bart}>
  <Avatar seed={980000+kopf*1000+pi*100+bart} zuege={{...basis,kopf,haut:haut(kopf,pi),haar:haar(kopf,pi),frisur:11,nase:pair.nase,mund:pair.mund,bart}} size={72} g="m" nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
  <span>B{bart}</span>
 </div>;
 return <div className="fl"><style>{CSS+' body{margin:0}.cf3{max-width:1500px;margin:auto;padding:18px}.kopf{margin:0 0 12px}.kopf h2{font-size:16px;margin:0 0 7px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(74px,1fr));gap:5px;align-items:end}.sample{text-align:center;min-width:0}.sample svg{margin:auto}.sample span{display:block;font-size:8px;color:var(--mu);margin-top:2px}.paar{border-top:1px solid rgba(255,255,255,.08);padding-top:6px;margin-top:7px}.paar h3{font-size:11px;font-weight:600;color:var(--mu);margin:0 0 5px}.intro{max-width:1050px;color:var(--mu)}'}</style><main className="cf3">
  <h1>CHAR-FIX-03 · Haar-/Bart-Passung</h1>
  <p className="intro">Sichtkontrolle aller 14 Kopfformen mit sämtlichen modernen Frisuren bei 72 px sowie aller Bart-IDs in vier kritischen Nase/Mund-Paaren. Gespeicherte IDs bleiben unverändert.</p>
  <section data-testid="haar-matrix">
   <h1>Frisuren · 868 Kopf/Frisur-Paarungen</h1>
   {KOPFFORM.map((k,kopf)=><article className="pan pad kopf" data-kopf={kopf} key={'h'+kopf}>
    <h2>ID {kopf} · {k.n}</h2>
    <div className="grid">{Array.from({length:31},(_,f)=>renderHair(kopf,'m',f))}</div>
    <div className="grid" style={{marginTop:6}}>{Array.from({length:31},(_,f)=>renderHair(kopf,'w',f))}</div>
   </article>)}
  </section>
  <section data-testid="bart-matrix">
   <h1>Bärte · 896 kritische Kopf/Nase/Mund/Bart-Paarungen</h1>
   {KOPFFORM.map((k,kopf)=><article className="pan pad kopf" data-kopf={kopf} key={'b'+kopf}>
    <h2>ID {kopf} · {k.n}</h2>
    {bartPaare.map((pair,pi)=><div className="paar" data-paar={pi} key={pi}><h3>N{pair.nase} / M{pair.mund} · {pair.label}</h3><div className="grid">{Array.from({length:16},(_,b)=>renderBart(kopf,pair,pi,b))}</div></div>)}
   </article>)}
  </section>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<CharFix03Probe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'char-fix-03.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHAR-FIX-03</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'char-fix-03.html'));
})();
