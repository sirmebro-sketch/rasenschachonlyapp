const {test,before,after}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {build}=require('esbuild');

const root=path.resolve(__dirname,'..');
const saved=new Map();
let E,temp;

before(async()=>{
 const {serialisierterSpeicher}=await import('../sicherung.js');
 globalThis.__rsIdentStore=serialisierterSpeicher({
  get:async k=>saved.has(k)?{value:saved.get(k)}:null,
  set:async(k,v)=>{saved.set(k,v);},
  delete:async k=>saved.delete(k),
 });
 const source=fs.readFileSync(path.join(root,'App.jsx'),'utf8');
 const part=(start,end)=>{
  const a=source.indexOf(start),b=source.indexOf(end,a);
  assert(a>=0&&b>a,'Handler für Porträtregression nicht gefunden: '+start);
  return source.slice(a,b);
 };
 const finish=[
  part('  const clone =','  /* F01:'),
  part('  const bereiteHalle =','  /* Erlebte Ereignisse'),
  part('  const bereiteErlebtes =','  /* Errungenschaften über'),
  part('  const bereiteErfolge =','  /* Eine Abteilung ausbauen'),
  part('  const finish =','  const bucheAenderung ='),
 ].join('\n');
 const setters=text=>[...new Set([...text.matchAll(/\b(set[A-Z]\w*)\(/g)].map(m=>m[1]))]
  .map(n=>`const ${n}=v=>{out[${JSON.stringify(n.slice(3))}]=v;};`).join('\n');
 const extension=`
import {renderToStaticMarkup} from 'react-dom/server';
export {createPlayer,KARTEN,VEREIN,leereAkademie,leereBilanz,SAVE_KEY,AKA_KEY,LIFE_KEY,zufallSetzen};
export const renderPortrait=x=>renderToStaticMarkup(<Avatar seed={x.avatar} zuege={x.zuege} g={x.g} nat={x.natId||x.nation?.id||'GER'} club={null} size={54}/>);
export const renderCard=k=>renderToStaticMarkup(<Spielerkarte karte={k}/>);
export const renderRoster=s=>renderToStaticMarkup(<Elfkarte spieler={s} stufe={KARTEN.stufeFuer(s.ovr)} platz={s.pos} eignung={1}/>);
export async function runFinish(q){
 const out={};const aka={...leereAkademie(),vc:100,verdient:200,gratisPacks:2};
 const ges=leereBilanz(),verein=null,meta={},ach={},seen={},wcSeen={},hall=[],hsvZ=0;
 const karten=KARTEN.leererPool(),kartenRef={current:karten},abschlussRef={current:null},buchungAktiv={current:false};
 ${setters(finish)}
 ${finish}
 await finish(q,'Identitätsprüfung');
 if(out.LadeFehler)throw Error(out.LadeFehler);
 return out;
}
`;
 temp=fs.mkdtempSync(path.join(os.tmpdir(),'rasenschach-portraet-id-'));
 const outfile=path.join(temp,'engine.cjs');
 await build({stdin:{contents:source+'\n'+extension,resolveDir:root,loader:'jsx'},outfile,bundle:true,platform:'node',format:'cjs',logLevel:'silent',plugins:[{
  name:'test-storage',setup(b){b.onLoad({filter:/[/\\]storage\.js$/},()=>({contents:'export const store=globalThis.__rsIdentStore;',loader:'js'}));}
 }]});
 E=require(outfile);
});

after(()=>{if(temp)fs.rmSync(temp,{recursive:true,force:true});delete globalThis.__rsIdentStore;});

const merkmale=g=>g==='w'
 ? {stil:2,kopf:9,haut:11,haar:8,frisur:19,bart:0,augen:6,augenfarbe:5,brauen:6,nase:9,mund:8,ohren:4,wangen:4,schmuck:7,details:4,schminke:6}
 : {stil:2,kopf:8,haut:6,haar:4,frisur:21,bart:15,augen:5,augenfarbe:2,brauen:5,nase:8,mund:7,ohren:3,wangen:3,schmuck:6,details:5,schminke:0};

const portrait=x=>({avatar:x.avatar,zuege:x.zuege,g:x.g});
const normalisiere=html=>{
 const m=html.match(/<svg[^>]*aria-label="Spielerporträt"[^>]*>[\s\S]*?<\/svg>/);
 assert(m,'Spielerporträt fehlt im gerenderten Markup');
 let svg=m[0];
 const ids=[...svg.matchAll(/ id="([^"]+)"/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length);
 ids.forEach((id,i)=>{svg=svg.split(id).join('ID'+i);});
 return svg.replace(/<svg[^>]*>/,'<svg>');
};

for(const g of ['m','w'])test('CHAR-P0-02: Karriere → Halle → Karte → Kader behält das Porträt ('+g+')',async()=>{
 saved.clear();E.zufallSetzen(g==='w'?352021:352020);
 const zuege=merkmale(g);
 const p=E.createPlayer({name:g==='w'?'Mara Identität':'Marvin Identität',nation:'GER',pos:g==='w'?'ZM':'IV',foot:'rechts',number:g==='w'?8:4,gender:g,avatar:g==='w'?842021:842020,zuege});
 const erwartet={avatar:p.avatar,zuege:structuredClone(p.zuege),g:p.g};
 const out=await E.runFinish(p);
 const h=out.Hall.find(x=>x.id===p.karriereId)||out.Hall[0];
 assert(h,'Abschluss hat keinen Ruhmeshallen-Eintrag erzeugt');
 assert.deepEqual(portrait(h),erwartet,'Karriere → Ruhmeshalle verändert das Porträt');
 assert.notStrictEqual(h.zuege,p.zuege,'Ruhmeshalle soll keine veränderliche Merkmalsreferenz teilen');

 const card=E.KARTEN.ausHalle(h,h.nr||1);
 assert.deepEqual(card.portraet,erwartet,'Ruhmeshalle → Sammlung verändert das Porträt');
 assert.notStrictEqual(card.portraet.zuege,h.zuege,'Sammelkarte soll Merkmale eigenständig speichern');

 const eingesetzt=E.VEREIN.karteEinsetzen({...E.VEREIN.leererVerein(),gegruendet:true,kader:[]},card);
 assert.equal(eingesetzt.fehler,null);
 const kader=eingesetzt.v.kader[0];
 assert.deepEqual(kader.portraet,erwartet,'Sammlung → Vereinskader verändert das Porträt');
 assert.deepEqual(E.KARTEN.ausKader(kader,'Identitätsprüfung',2031).portraet,erwartet,'Kader → Karte verliert das Porträt');

 const original={...p,natId:p.nation.id};
 assert.equal(normalisiere(E.renderPortrait(original)),normalisiere(E.renderPortrait(h)),'Karriere und Ruhmeshalle zeichnen nicht dasselbe Gesicht');
 assert.equal(normalisiere(E.renderPortrait(h)),normalisiere(E.renderCard(card)),'Ruhmeshalle und Sammelkarte zeichnen nicht dasselbe Gesicht');
 assert.equal(normalisiere(E.renderPortrait(h)),normalisiere(E.renderRoster(kader)),'Ruhmeshalle und Kader zeichnen nicht dasselbe Gesicht');
});

test('CHAR-P0-02: Altstand ergänzt Porträt nur über historische Identität, nicht über gleichen Namen',()=>{
 const h={id:'id-altstand',nr:7,name:'Alex Gleichname',peak:88,age:39,natId:'GER',g:'w',avatar:73007,zuege:merkmale('w')};
 const basis=E.KARTEN.ausHalle(h,7);
 const alt={...basis,ovr:94,sonderkarte:true};delete alt.portraet;
 const fremd={...alt,kid:'h:fremde-id:Alex Gleichname'};
 const pool=E.KARTEN.portraetsAbgleichen({karten:[alt,fremd],stand:2},[h]);
 assert.deepEqual(pool.karten[0].portraet,basis.portraet);
 assert.equal(pool.karten[0].ovr,94);assert.equal(pool.karten[0].sonderkarte,true);
 assert.equal(pool.karten[1].portraet,undefined,'Namensgleichheit darf keine Identität erfinden');
});
