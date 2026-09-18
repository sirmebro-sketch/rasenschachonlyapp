// Echte App mit isoliertem Sitzungsspeicher und reproduzierbaren Testständen.
const fs=require('fs'),{build}=require('esbuild');
(async()=>{
const src=fs.readFileSync('App.jsx','utf8');
const demo=`
import {createRoot} from 'react-dom/client';
const root=createRoot(document.getElementById('root'));

function IdentitaetsProbe(){
 const zuege={stil:2,kopf:9,haut:11,haar:8,frisur:19,bart:0,augen:6,augenfarbe:5,brauen:6,nase:9,mund:8,ohren:4,wangen:4,schmuck:7,details:4,schminke:6};
 const karriere={name:'Mara Identität',avatar:842021,zuege,g:'w',natId:'GER'};
 const h={id:'audit-identitaet',nr:7,name:karriere.name,pos:'ZM',peak:91,age:38,natId:'GER',nat:'🇩🇪',g:karriere.g,avatar:karriere.avatar,zuege:structuredClone(karriere.zuege),score:1911,apps:478,goals:81,assists:133,titles:11,caps:102,worth:74,von:2026,bis:2048};
 const card=KARTEN.ausHalle(h,h.nr);
 const gesetzt=VEREIN.karteEinsetzen({...VEREIN.leererVerein(),gegruendet:true,name:'Identitätsverein',kader:[]},card);
 const kader=gesetzt.v.kader[0];
 const daten=p=>JSON.stringify({avatar:p.avatar,zuege:p.zuege,g:p.g});
 const box=(id,titel,inhalt,p)=><article data-testid={id} data-portrait={daten(p)} style={{minWidth:0,border:'1px solid var(--ln)',background:'var(--pa)',padding:12,borderRadius:12}}><div className="d" style={{fontSize:12,letterSpacing:'.08em',marginBottom:8}}>{titel}</div><div style={{display:'grid',placeItems:'center',minHeight:170}}>{inhalt}</div></article>;
 return <><style>{CSS}</style><main className="fl" style={{minHeight:'100vh',padding:16}} data-testid="portraet-kette">
  <div style={{maxWidth:1040,margin:'0 auto'}}>
   <div className="k" style={{marginBottom:12}}>CHAR-P0-02 · SICHTPRÜFUNG</div>
   <h1 className="d" style={{fontSize:24,margin:'0 0 6px'}}>Porträt-Identitätskette</h1>
   <p className="m" style={{fontSize:12,maxWidth:760,margin:'0 0 16px'}}>Dasselbe gespeicherte Gesicht wird über vier reale Darstellungswege gezeigt. Frisur, Kopfform, Haut, Gesichtszüge, Schmuck, Make-up und Geschlecht müssen wiedererkennbar gleich bleiben.</p>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:12,alignItems:'stretch'}}>
    {box('portrait-karriere','1 · Karriere',<Avatar seed={karriere.avatar} zuege={karriere.zuege} g={karriere.g} nat={karriere.natId} club={null} size={112}/>,karriere)}
    {box('portrait-halle','2 · Ruhmeshalle',<Avatar seed={h.avatar} zuege={h.zuege} g={h.g} nat={h.natId} club={null} size={112}/>,h)}
    {box('portrait-sammlung','3 · Sammelkarte',<div style={{width:150}}><Spielerkarte karte={card}/></div>,card.portraet)}
    {box('portrait-kader','4 · Vereinskader',<div style={{width:112}}><Elfkarte spieler={kader} stufe={KARTEN.stufeFuer(kader.ovr)} platz={kader.pos} eignung={1}/></div>,kader.portraet)}
   </section>
   <div className="m" style={{fontSize:11,marginTop:14}}>Quelle: isolierter Prüfstand. Keine produktiven Speicherstände werden verändert. Karten- und Kaderrahmen dürfen den Avatar anders einbetten; die gespeicherte Porträtidentität muss gleich bleiben.</div>
  </div>
 </main></>;
}

async function pruefStart(fort){
 await store.clearTest();
 zufallSetzen(35191);
 await store.set('rasenschach:ruhe','1');
 if(fort){
  const h={id:'audit-hall',nr:1,name:'Marvin Prüfspieler',pos:'IV',peak:90,age:40,g:'m',avatar:1234,natId:'GER',nat:'🇩🇪',score:1829,apps:1005,goals:44,assists:26,titles:28,caps:178,worth:86,von:2027,bis:2051,
    zuege:{...zuegeAusKennung(1234,'m','GER',{}),stil:2,haut:4,frisur:7,bart:3}};
  const k=KARTEN.ausHalle(h,1);delete k.portraet; // Altstand: Migration testen.
  const pool=KARTEN.poolErgaenzen({karten:[k]},['bronze','silber','gold','legende'].map(st=>KARTEN.neueKarte(st,2030)));
  for(const [key,val] of [[HALL_KEY,[h]],[LIFE_KEY,{...leereBilanz(),karrieren:5,hausKarrieren:5}],[AKA_KEY,{...leereAkademie(),vc:1000,gratisPacks:1}],[KARTEN_KEY,pool],[META_KEY,{mk_haar:true,mk_acc:true}],[WILL_KEY,{...leerGesehen(),schirm:true}]])await store.set(key,JSON.stringify(val));
 }
 root.render(<RasenschachXI key={Date.now()}/>);
}
document.getElementById('frisch').onclick=()=>pruefStart(false);
document.getElementById('fort').onclick=()=>pruefStart(true);
document.getElementById('laden').onclick=()=>root.render(<RasenschachXI key={Date.now()}/>);
document.getElementById('ident').onclick=()=>root.render(<IdentitaetsProbe/>);
root.render(<RasenschachXI/>);
`;
const r=await build({stdin:{contents:src+demo,resolveDir:process.cwd(),loader:'jsx'},bundle:true,platform:'browser',format:'iife',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isoliert',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({loader:'js',contents:`import {serialisierterSpeicher} from './sicherung.js';const prefix='rs-pruefung:';export const store=serialisierterSpeicher({get:async k=>{const v=sessionStorage.getItem(prefix+k);return v==null?null:{value:v}},set:async(k,v)=>sessionStorage.setItem(prefix+k,v),delete:async k=>sessionStorage.removeItem(prefix+k)});store.clearTest=async()=>{Object.keys(sessionStorage).filter(k=>k.startsWith(prefix)).forEach(k=>sessionStorage.removeItem(k))};`}))}}]});
fs.mkdirSync('.preview',{recursive:true});fs.writeFileSync('.preview/spieltest.html',`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach isolierter Spieltest</title><style>${fs.readFileSync('charakter-ui.css','utf8')}</style><body><aside style="background:#193b2d;color:white;padding:8px;font:12px system-ui">TESTSTAND · getrennte Daten <button id="frisch">Neues Spiel</button> <button id="fort">Fortgeschritten</button> <button id="laden">Gespeicherten Stand laden</button> <button id="ident">Porträtkette</button></aside><div id="root"></div><script>${r.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')}</script></body></html>`);
})();