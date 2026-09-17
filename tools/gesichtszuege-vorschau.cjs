const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function GesichtProbe(){
 const mkMeta=()=>({mk_haar:true,mk_acc:true});
 const [geschlecht,setGeschlecht]=React.useState('m');
 const [merkmal,setMerkmal]=React.useState('augen');
 const [haut,setHaut]=React.useState(7);
 const [groesse,setGroesse]=React.useState(96);
 const [beschriftet,setBeschriftet]=React.useState(true);
 const optionen=portraetOptionen({...ZUEGE_ANZAHL(mkMeta(),geschlecht==='w'),haut:SKIN_EDIT.length,haar:HAIRC_EDIT.length},geschlecht);
 const merkmale=[['Augen','augen'],['Augenbrauen','brauen'],['Nasen','nase'],['Münder','mund'],['Wangen/Kinn','wangen'],['Gesichtsdetails','details']];
 const labelMap=new Map(merkmale.map(([l,k])=>[k,l]));
 const werte=optionen[merkmal]||[];
 const basis={...zuegeAusKennung(7331,geschlecht,'GER',mkMeta()),stil:2,kopf:0,haut,haar:1,frisur:1,bart:0,schmuck:0,schminke:0,details:0,augen:0,augenfarbe:1,brauen:0,nase:0,mund:4,ohren:1,wangen:0};
 const name=(feld,id)=>PORTRAET_NAMEN[feld]?.[id]||((labelMap.get(feld)||feld)+' '+id);
 const kombis=[
  {augen:0,brauen:0,nase:0,mund:1,wangen:0,details:0},
  {augen:1,brauen:4,nase:1,mund:5,wangen:2,details:1},
  {augen:2,brauen:2,nase:6,mund:6,wangen:3,details:3},
  {augen:3,brauen:3,nase:3,mund:3,wangen:1,details:6},
  {augen:7,brauen:1,nase:10,mund:4,wangen:5,details:7},
  {augen:5,brauen:5,nase:8,mund:7,wangen:2,details:2},
  {augen:8,brauen:6,nase:11,mund:8,wangen:6,details:8},
 ];
 return <div className="fl"><style>{CSS}</style><main style={{maxWidth:1240,margin:'auto',padding:18}}>
  <h1>CHAR-P1-02 · Gesichtszüge</h1>
  <p style={{maxWidth:920}}>ChatGPT/Codex-Prüfstand mit dem echten Avatar-Renderer. Kopf, Frisur, Haarfarbe und alle nicht geprüften Gesichtszüge bleiben innerhalb eines Vergleichs identisch. So zählt nur ein Unterschied, der bei echter Spielgröße sichtbar bleibt.</p>
  <div className="pan pad" style={{marginBottom:16}}>
   <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'end'}}>
    <label>Geschlecht <select aria-label="Geschlecht" value={geschlecht} onChange={e=>setGeschlecht(e.target.value)}><option value="m">Mann</option><option value="w">Frau</option></select></label>
    <label>Merkmal <select aria-label="Merkmal" value={merkmal} onChange={e=>setMerkmal(e.target.value)}>{merkmale.map(([l,k])=><option value={k} key={k}>{l}</option>)}</select></label>
    <label>Hautton <select aria-label="Hautton" value={haut} onChange={e=>setHaut(Number(e.target.value))}><option value="0">hell</option><option value="7">mittel</option><option value="13">dunkel</option></select></label>
    <label>Größe <select aria-label="Größe" value={groesse} onChange={e=>setGroesse(Number(e.target.value))}><option value="72">72 px</option><option value="96">96 px</option><option value="145">145 px</option></select></label>
    <label><input aria-label="Beschriftung" type="checkbox" checked={beschriftet} onChange={e=>setBeschriftet(e.target.checked)}/> Beschriftung</label>
   </div>
  </div>
  <section data-testid="varianten">
   <div className="eb" style={{marginBottom:10}}>{labelMap.get(merkmal)} · identische Basis</div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10}}>
    {werte.map(id=>{const z={...basis,[merkmal]:id};return <article className="pan pad" data-id={id} data-feature={merkmal} key={id} style={{textAlign:'center',minWidth:0}}>
      <div style={{display:'flex',justifyContent:'center'}}><Avatar seed={7331} zuege={z} size={groesse} g={geschlecht} nat="GER" meta={mkMeta()}/></div>
      {beschriftet&&<div className="m" style={{fontSize:10,color:'var(--mu)',marginTop:5}}>ID {id} · {name(merkmal,id)}</div>}
     </article>})}
   </div>
  </section>
  <section className="pan pad" data-testid="kombinationen" style={{marginTop:18}}>
   <div className="eb">Unbeschriftete Gesamtprobe</div>
   <p className="m" style={{fontSize:11,color:'var(--mu)',maxWidth:850}}>Sieben Kombinationen mit identischem Kopf, identischer Frisur und identischer Haarfarbe. Ziel: Gesichter sollen ohne Namensschild nicht wie dieselbe Person wirken.</p>
   <div style={{display:'flex',gap:10,flexWrap:'wrap',alignItems:'end'}}>
    {kombis.map((k,i)=><div data-combo={i} key={i} style={{flex:'0 0 auto'}}><Avatar seed={9100+i} zuege={{...basis,...k}} size={groesse} g={geschlecht} nat="GER" meta={mkMeta()}/></div>)}
   </div>
  </section>
  <div className="pan pad" style={{marginTop:18,fontSize:12}}><div className="eb">Prüfregel</div><p>Eine Variante gilt nicht als Qualitätsgewinn, wenn sie nur technisch anders ist, aber bei 72–96 px praktisch gleich gelesen wird. Sichtprüfung deshalb immer ohne Beschriftung gegenprüfen; IDs bleiben append-only.</p></div>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<GesichtProbe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 const bundle=result.outputFiles[0].text.split('</script').join('<\\/script');
 fs.writeFileSync(path.join(out,'gesichtszuege.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach Gesichtszüge</title><body><div id="root"></div><script>'+bundle+'</script></body></html>');
 console.log(path.join(out,'gesichtszuege.html'));
})();
