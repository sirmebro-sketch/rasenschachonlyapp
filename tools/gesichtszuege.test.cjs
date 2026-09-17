const test=require('node:test');const assert=require('node:assert/strict');

const BASIS={frisur:16,bart:10,brauen:5,augen:5,nase:8,mund:7,ohren:3,wangen:3,schmuck:6,schminke:1};
const FEST={
 brauen:['Gerade','Geschwungen','Markant','Fein','Breit geschwungen','Weich auslaufend','Sanfter Bogen'],
 augen:['Mandelförmig','Schmal','Betont','Tief liegend','Offen','Sanft rund','Leicht angehoben'],
 nase:['Ausgeglichen','Breit','Schmal','Lang','Gerade','Rund','Kräftig','Fein','Kurze Nasenspitze','Sanfter Nasenrücken'],
 mund:['Lächelnd','Gerade','Schmal geschwungen','Entspannt','Ausgeglichen','Voll','Breit','Leichtes Lächeln','Offenes Lächeln'],
 wangen:['Weich','Kinngrübchen','Wangenknochen','Dezente Kontur','Wangengrübchen'],
 details:['Ohne','Feine Sommersprossen','Dichte Sommersprossen','Augenbrauennarbe','Wangennarbe','Schönheitsfleck','Leichte Lachfältchen'],
};

test('CHAR-P1-02: bestehende Gesichts-IDs bleiben append-only stabil',async()=>{
 const {PORTRAET_NAMEN}=await import('../portraet.js');
 for(const [feld,namen] of Object.entries(FEST)){
  assert.deepEqual(PORTRAET_NAMEN[feld].slice(0,namen.length),namen,feld+' darf bestehende IDs nicht umnummerieren oder umdeuten');
 }
});

test('CHAR-P1-02: alle sichtbaren Gesichtsoptionen haben eindeutige IDs und Namen',async()=>{
 const {PORTRAET_NAMEN,portraetOptionen}=await import('../portraet.js');
 for(const g of ['m','w']){
  const basis={...BASIS,frisur:g==='w'?14:16,bart:g==='w'?1:10,schminke:g==='w'?5:1};
  const o=portraetOptionen(basis,g);
  for(const feld of Object.keys(FEST)){
   const ids=o[feld];
   assert.equal(new Set(ids).size,ids.length,g+'/'+feld+' enthält doppelte gespeicherte IDs');
   for(const id of ids)assert.equal(typeof PORTRAET_NAMEN[feld]?.[id],'string',g+'/'+feld+' ID '+id+' braucht einen stabilen Namen');
  }
 }
});
