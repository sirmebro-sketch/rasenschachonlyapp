// Echte App mit isoliertem Sitzungsspeicher und reproduzierbaren Testständen.
const fs=require('fs'),{build}=require('esbuild');
(async()=>{
const src=fs.readFileSync('App.jsx','utf8');
const demo=`
import {createRoot} from 'react-dom/client';
const root=createRoot(document.getElementById('root'));
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
root.render(<RasenschachXI/>);
`;
const r=await build({stdin:{contents:src+demo,resolveDir:process.cwd(),loader:'jsx'},bundle:true,platform:'browser',format:'iife',write:false,minify:true,define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'isoliert',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({loader:'js',contents:`import {serialisierterSpeicher} from './sicherung.js';const prefix='rs-pruefung:';export const store=serialisierterSpeicher({get:async k=>{const v=sessionStorage.getItem(prefix+k);return v==null?null:{value:v}},set:async(k,v)=>sessionStorage.setItem(prefix+k,v),delete:async k=>sessionStorage.removeItem(prefix+k)});store.clearTest=async()=>{Object.keys(sessionStorage).filter(k=>k.startsWith(prefix)).forEach(k=>sessionStorage.removeItem(k))};`}))}}]});
fs.mkdirSync('.preview',{recursive:true});fs.writeFileSync('.preview/spieltest.html',`<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Rasenschach isolierter Spieltest</title><body><aside style="background:#193b2d;color:white;padding:8px;font:12px system-ui">TESTSTAND · getrennte Daten <button id="frisch">Neues Spiel</button> <button id="fort">Fortgeschritten</button> <button id="laden">Gespeicherten Stand laden</button></aside><div id="root"></div><script>${r.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')}</script></body></html>`);
})();
