const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function CharFix04Probe(){
 const basis={stil:2,augen:0,augenfarbe:1,brauen:0,nase:0,mund:0,ohren:1,wangen:0,schmuck:0,details:0,schminke:0,bart:0};
 const neu=[10,11,12,13],alt=[3,5,6];
 const mKrit=[0,1,2,3,6,7,12,13,14,15,20,21,23,30];
 const wKrit=[0,3,7,9,19,21,24,25,26];
 const bartKrit=[4,5,8,12,13,14,15];
 const paare=[
  {nase:3,mund:5,label:'N3/M5 · lange Nase / voller Mund'},
  {nase:11,mund:8,label:'N11/M8 · hoher Rücken / offenes Lächeln'},
  {nase:6,mund:3,label:'N6/M3 · kräftige Nase / entspannter Mund'},
 ];
 const z=(kopf,g,frisur,bart=0,paar=paare[0])=>({...basis,kopf,haut:[0,7,13,4][kopf%4],haar:[0,2,6,12][kopf%4],frisur,bart,nase:paar.nase,mund:paar.mund});
 const avatar=(kopf,g,frisur,bart,size,paar,key,kind)=><div className="probe" data-kind={kind} data-kopf={kopf} data-g={g} data-frisur={frisur} data-bart={bart} data-size={size} key={key}>
  <Avatar seed={990000+kopf*10000+frisur*100+bart*3+size} zuege={z(kopf,g,frisur,bart,paar)} size={size} g={g} nat="GER" meta={{mk_haar:true,mk_acc:true}}/>
  <span>{g.toUpperCase()} F{frisur}{bart?(' · B'+bart):''} · {size}</span>
 </div>;
 const diagnose=(kopf,g,frisur,key)=>{
  const k=KOPFFORM[kopf],d=kopfPfad(k);
  return <div className="diag" data-kind="haar-diagnose" data-kopf={kopf} data-g={g} data-frisur={frisur} key={key}>
   <svg viewBox="0 0 100 100" width="145" height="145" aria-label="Haar-Passungsdiagnose">
    <path d={d} fill="#e7b58e" stroke="#fff" strokeWidth=".65"/>
    <Haarform index={frisur} weiblich={g==='w'} breite={k.b} farbe="#211713" hell="#806758" ebene="vorn" kopfprofil={k.profil||''} kopfpfad={d}/>
    <path d={d} fill="none" stroke="#ff3b30" strokeWidth=".55" strokeDasharray="1.4 1.2" opacity=".95"/>
   </svg><span>{g.toUpperCase()} F{frisur}</span>
  </div>;
 };
 return <div className="fl"><style>{CSS+' body{margin:0}.cf4{max-width:1580px;margin:auto;padding:18px}.cf4 h1{margin-top:24px}.kopf{margin:0 0 12px}.kopf h2{font-size:16px;margin:0 0 7px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(78px,1fr));gap:6px;align-items:end}.grid.big{grid-template-columns:repeat(auto-fill,minmax(154px,1fr))}.probe,.diag{text-align:center;min-width:0}.probe svg,.diag svg{margin:auto}.probe span,.diag span{display:block;font-size:8px;color:var(--mu);margin-top:2px}.diag{background:#181a17;padding:4px;border-radius:7px}.paar{border-top:1px solid rgba(255,255,255,.08);padding-top:7px;margin-top:8px}.paar h3{font-size:11px;color:var(--mu);margin:0 0 5px}.note{max-width:1050px;color:var(--mu)}'}</style><main className="cf4">
  <h1>CHAR-FIX-04 · Bart-/Kurzhaar-Restpassung</h1>
  <p className="note">Gezielter Sichtbogen nach Nutzersichtung von CHAR-FIX-03. Rot gestrichelte Diagnosekonturen markieren die echte Kopfmaske; sichtbare Haut darf bei rasiert/fade/licht beabsichtigt sein, nicht als offener Spalt zwischen Haarfläche und Schädelkontur.</p>

  <section data-testid="haar-alle-neue">
   <h1>1 · Alle Frisuren × Kopf 10–13 · 72 px</h1>
   {neu.map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'all'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    <div className="grid">{Array.from({length:31},(_,f)=>avatar(kopf,'m',f,0,72,paare[0],'m'+f,'haar-alle'))}</div>
    <div className="grid" style={{marginTop:7}}>{Array.from({length:31},(_,f)=>avatar(kopf,'w',f,0,72,paare[0],'w'+f,'haar-alle'))}</div>
   </article>)}
  </section>

  <section data-testid="haar-kritisch">
   <h1>2 · Kritische Kurz-/Kompaktformen · 96 / 145 px</h1>
   {neu.map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'krit'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    {[96,145].map(size=><div className="grid big" data-size={size} key={size}>
     {mKrit.map(f=>avatar(kopf,'m',f,0,size,paare[0],'m'+size+'-'+f,'haar-kritisch'))}
     {wKrit.map(f=>avatar(kopf,'w',f,0,size,paare[0],'w'+size+'-'+f,'haar-kritisch'))}
    </div>)}
   </article>)}
  </section>

  <section data-testid="haar-diagnose">
   <h1>3 · Diagnose · echte Kopfkontur gegen Haarfläche</h1>
   {neu.map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'diag'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    <div className="grid big">{mKrit.map(f=>diagnose(kopf,'m',f,'m'+f))}{wKrit.map(f=>diagnose(kopf,'w',f,'w'+f))}</div>
   </article>)}
  </section>

  <section data-testid="bart-neue">
   <h1>4 · Alle Bart-IDs × Kopf 10–13 · 72 / 96 px · drei Gesichter</h1>
   {neu.map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'bn'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    {paare.map((paar,pi)=><div className="paar" data-paar={pi} key={pi}><h3>{paar.label}</h3>
     {[72,96].map(size=><div className="grid" data-size={size} key={size}>{Array.from({length:16},(_,b)=>avatar(kopf,'m',11,b,size,paar,size+'-'+b,'bart-neu'))}</div>)}
    </div>)}
   </article>)}
  </section>

  <section data-testid="bart-altvergleich">
   <h1>5 · Regression · alte schmale/breite/kurze Köpfe</h1>
   {alt.map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'ba'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    {[72,96].map(size=><div className="grid" data-size={size} key={size}>{Array.from({length:16},(_,b)=>avatar(kopf,'m',11,b,size,paare[1],size+'-'+b,'bart-alt'))}</div>)}
   </article>)}
  </section>

  <section data-testid="bart-kritisch-gross">
   <h1>6 · Kritische Bärte groß · tatsächliches Kinnzentrum</h1>
   {[...neu,3,6].map(kopf=><article className="pan pad kopf" data-kopf={kopf} key={'bg'+kopf}><h2>ID {kopf} · {KOPFFORM[kopf].n}</h2>
    <div className="grid big">{bartKrit.map(b=>avatar(kopf,'m',11,b,145,paare[2],b,'bart-kritisch'))}</div>
   </article>)}
  </section>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<CharFix04Probe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'char-fix-04.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>CHAR-FIX-04</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'char-fix-04.html'));
})();
