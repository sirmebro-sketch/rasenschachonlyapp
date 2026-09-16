// Isolierte Vorschau echter Komponenten. Kein Zugriff auf den produktiven Spielstand.
const fs=require('node:fs');const path=require('node:path');const {build}=require('esbuild');
(async()=>{
 const root=path.resolve(__dirname,'..');const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const demo=`
import {createRoot} from 'react-dom/client';
function Sichtprobe(){
 const [modus,setModus]=React.useState('haare'),[r,setR]=React.useState(null),[lauf,setLauf]=React.useState(0);
 const [geschlecht,setGeschlecht]=React.useState('m'),[kopf,setKopf]=React.useState(0),[haar,setHaar]=React.useState(1),[ruhe,setRuhe]=React.useState(false);
 RUHE=ruhe;
 const meta={mk_haar:true,mk_kopf:true,mk_bart:true};
 const opts=portraetOptionen(ZUEGE_ANZAHL(meta,geschlecht==='w'),geschlecht).frisur;
 return <><style>{CSS}</style><main style={{maxWidth:1000,margin:'auto',padding:18}}>
 <h1>Rasenschach · Sichtprobe</h1><p>Isolierte Testdaten, keine Spielstandbuchung.</p>
 <nav style={{display:'flex',gap:8,flexWrap:'wrap'}}>{['haare','wildcards','spielerkarten','erstellung'].map(m=><button className="btn" key={m} onClick={()=>{setModus(m);setR(null)}}>{m}</button>)}</nav>
 <label><input type="checkbox" checked={ruhe} onChange={e=>setRuhe(e.target.checked)}/> Animationen aus</label>
 {modus==='haare'&&<><div style={{display:'flex',gap:12,margin:'20px 0'}}><label>Geschlecht <select value={geschlecht} onChange={e=>setGeschlecht(e.target.value)}><option value="m">Mann</option><option value="w">Frau</option></select></label><label>Kopfform <select value={kopf} onChange={e=>setKopf(+e.target.value)}>{KOPFFORM.map((k,i)=><option key={i} value={i}>{k.n}</option>)}</select></label><label>Haarfarbe <select value={haar} onChange={e=>setHaar(+e.target.value)}>{HAIRC_EDIT.map((k,i)=><option key={i} value={i}>{PORTRAET_NAMEN.haar[i]}</option>)}</select></label></div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(145px,1fr))',gap:16}}>{opts.map(f=><div key={f}><Avatar size={145} g={geschlecht} meta={meta} zuege={{...zuegeAusKennung(1,geschlecht,'GER',meta),stil:2,kopf,haar,haut:1,frisur:f,bart:0,schmuck:0}}/><p style={{fontSize:12}}>{f}: {f>=(geschlecht==='w'?14:16)?NEUE_FRISUREN[f-(geschlecht==='w'?14:16)]:FRISUR_NAMEN[geschlecht][f]}{f>=(geschlecht==='w'?10:12)&&f<(geschlecht==='w'?14:16)?' · freischaltbar':''}</p></div>)}</div></>}
 {modus==='wildcards'&&<><p>Aufdeckung starten:</p>{Object.keys(RARITY).map(k=><button className="btn" key={k} onClick={()=>{setR(k);setLauf(v=>v+1)}}>{k}</button>)}{r&&<WildcardEnthuellung key={lauf} card={{r,n:'Der letzte Spielmacher',t:'Du erkennst den freien Raum, bevor alle anderen ihn sehen.'}} onFertig={()=>setR(null)}/>}</>}
 {modus==='spielerkarten'&&<><button className="btn" onClick={()=>setLauf(v=>v+1)}>Neu aufdecken</button><div style={{maxWidth:400,margin:'20px auto',display:'grid',gap:24}}>{['bronze','silber','gold','legende'].map((st,i)=><Spielerkarte key={st+lauf} karte={{kid:'probe'+i,stufe:st,name:'Mika Hartmann',nat:'GER',flag:'🇩🇪',pos:'ZM',ovr:55+i*12,alter:22,herkunft:'pack'}} gross jubel/>)}</div></>}
 {modus==='erstellung'&&<div style={{maxWidth:390,margin:'auto'}}><CreateScreen meta={meta} onStart={()=>{}} onBack={()=>{}}/></div>}
 </main></>;
}
createRoot(document.getElementById('root')).render(<Sichtprobe/>);
`;
 const result=await build({stdin:{contents:source+demo,resolveDir:root,loader:'jsx'},bundle:true,format:'iife',platform:'browser',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isolated-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store={get:async()=>null,set:async()=>{},delete:async()=>{}};',loader:'js'}))}}]});
 const out=path.join(root,'.preview');fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'sichtprobe.html'),'<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach Sichtprobe</title><body><div id="root"></div><script>'+result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')+'</script></body></html>');console.log(path.join(out,'sichtprobe.html'));
})();
