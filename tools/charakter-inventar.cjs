const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function CharakterInventar(){
 const [geschlecht,setGeschlecht]=React.useState('m'),[frei,setFrei]=React.useState(true),[merkmal,setMerkmal]=React.useState('kopf');
 const mkMeta=(an)=>({mk_haar:an,mk_acc:an});
 const optionen=(g,an)=>portraetOptionen({...ZUEGE_ANZAHL(mkMeta(an),g==='w'),haut:SKIN_EDIT.length,haar:HAIRC_EDIT.length},g);
 const m0=optionen('m',false),m1=optionen('m',true),w0=optionen('w',false),w1=optionen('w',true);
 const reglerM=PORTRAET_REGLER('m'),reglerW=PORTRAET_REGLER('w');
 const labelMap=new Map([...reglerM,...reglerW].map(([l,k])=>[k,l]));
 const felder=[...new Set([...reglerM,...reglerW].map(([,k])=>k))];
 const aktuell=optionen(geschlecht,frei),regler=PORTRAET_REGLER(geschlecht);
 React.useEffect(()=>{if(!regler.some(([,k])=>k===merkmal))setMerkmal(regler[0][1]);},[geschlecht]);
 const werte=aktuell[merkmal]||[];
 const name=(feld,i,g)=>feld==='kopf'?KOPFFORM[i]?.n:feld==='augenfarbe'?AUGENFARBE[i]?.n:feld==='frisur'&&i>=(g==='w'?14:16)?NEUE_FRISUREN[i-(g==='w'?14:16)]:feld==='frisur'?FRISUR_NAMEN[g]?.[i]:PORTRAET_NAMEN[feld]?.[i]||((labelMap.get(feld)||feld)+' '+(i+1));
 const idText=(arr)=>arr.length&&arr.every((v,i)=>v===i)?'0–'+(arr.length-1):arr.join(', ');
 const refs=[{kopf:0,haut:0,haar:0,t:'hell'},{kopf:3,haut:7,haar:4,t:'mittel'},{kopf:6,haut:13,haar:12,t:'dunkel'}];
 const basis=zuegeAusKennung(7331,geschlecht,'GER',mkMeta(frei));
 return <div className="fl"><style>{CSS}</style><main style={{maxWidth:1180,margin:'auto',padding:18}}>
  <h1>Rasenschach · Charakter-Inventar</h1>
  <p style={{maxWidth:850}}>Prüfstand für CHAR-P0-01. Er verwendet die echten Porträtoptionen und den echten Avatar-Renderer. Gespeicherte IDs werden bewusst angezeigt; Lücken sind kein Fehler, sondern können alte Freischaltungen schützen.</p>
  <div className="pan pad" style={{marginBottom:18}}>
   <div className="eb">Live-Zählung aus dem aktuellen Quellcode</div>
   <div className="sc" style={{marginTop:8}}><table className="led" data-testid="inventar-tabelle"><thead><tr><th>Merkmal</th><th className="r">M Basis</th><th className="r">M frei</th><th className="r">W Basis</th><th className="r">W frei</th></tr></thead><tbody>
    {felder.map(f=>{const hm=reglerM.some(([,k])=>k===f),hw=reglerW.some(([,k])=>k===f);return <tr key={f} data-feld={f}><td>{labelMap.get(f)||f}</td><td className="r">{hm?(m0[f]?.length??'—'):'—'}</td><td className="r">{hm?(m1[f]?.length??'—'):'—'}</td><td className="r">{hw?(w0[f]?.length??'—'):'—'}</td><td className="r">{hw?(w1[f]?.length??'—'):'—'}</td></tr>;})}
   </tbody></table></div>
  </div>
  <div className="pan pad" style={{marginBottom:18}}>
   <div style={{display:'flex',gap:12,flexWrap:'wrap',alignItems:'end'}}>
    <label>Geschlecht <select aria-label="Geschlecht" value={geschlecht} onChange={e=>setGeschlecht(e.target.value)}><option value="m">Mann</option><option value="w">Frau</option></select></label>
    <label>Merkmal <select aria-label="Merkmal" value={merkmal} onChange={e=>setMerkmal(e.target.value)}>{regler.map(([l,k])=><option key={k} value={k}>{l}</option>)}</select></label>
    <label><input aria-label="Freischaltungen" type="checkbox" checked={frei} onChange={e=>setFrei(e.target.checked)}/> Freischaltungen aktiv</label>
   </div>
   <div className="m" style={{fontSize:11,color:'var(--mu)',marginTop:8}} data-testid="id-hinweis">{werte.length} wählbare Varianten · gespeicherte IDs: {idText(werte)}</div>
  </div>
  <section data-testid="varianten">
   <div className="eb" style={{marginBottom:10}}>{labelMap.get(merkmal)||merkmal} · Kreuzprobe</div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(315px,1fr))',gap:12}}>
    {werte.map(i=><article className="pan pad" key={i} data-id={i} style={{minWidth:0}}>
      <div className="d" style={{fontSize:15}}>ID {i} · {name(merkmal,i,geschlecht)}</div>
      <div style={{display:'flex',gap:8,marginTop:8,flexWrap:'wrap'}}>{refs.map((r,ri)=>{const z={...basis,stil:2,kopf:r.kopf,haut:r.haut,haar:r.haar,frisur:1,bart:0,schmuck:0,schminke:0,details:0,[merkmal]:i};return <div key={ri} style={{textAlign:'center'}}><Avatar seed={7331+ri} zuege={z} size={96} g={geschlecht} nat="GER" meta={mkMeta(frei)}/><div className="m" style={{fontSize:9,color:'var(--mu)',marginTop:3}}>{r.t} · Kopf {r.kopf}</div></div>})}</div>
     </article>)}
   </div>
  </section>
  <div className="pan pad" style={{marginTop:18,fontSize:12}}><div className="eb">Abnahmehinweise</div><p>Vergleiche Silhouette, Kontur, kleine Erkennbarkeit und tatsächliche Unterschiede. Varianten nicht wegen ID-Lücken umnummerieren. Sichturteile gehören mit Index und reproduzierbarer Ansicht in den Prüfbericht.</p></div>
 </main></div>;
}
createRoot(document.getElementById('root')).render(<CharakterInventar/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'charakter-inventar.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach Charakter-Inventar</title><body><div id="root"></div><script>'+result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')+'</script></body></html>');
 console.log(path.join(out,'charakter-inventar.html'));
})();
