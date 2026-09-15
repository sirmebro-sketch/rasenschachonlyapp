const {test}=require('node:test');const assert=require('node:assert/strict');
const basis={haut:14,haar:13,frisur:12,bart:10,kopf:10};
test('Porträtoptionen ergänzen Formen ohne gesperrte Altformen freizuschalten',async()=>{
 const {portraetOptionen:f}=await import('../portraet.js');const m=f(basis,'m');
 assert.deepEqual(m.frisur,[0,1,2,3,4,5,6,7,8,9,10,11,16,17,18,19]);assert.equal(new Set(m.frisur).size,m.frisur.length);
 const w=f({...basis,frisur:10,bart:1},'w');assert.deepEqual(w.frisur.slice(-4),[14,15,16,17]);assert.deepEqual(w.bart,[0]);
});
test('Festgehaltene Merkmale bleiben beim Würfeln und JSON-Wiederladen erhalten',async()=>{
 const {portraetOptionen:f,portraetWuerfeln:w}=await import('../portraet.js');const alt={haut:13,haar:12,frisur:18,kopf:5};const kopie=JSON.parse(JSON.stringify(alt));
 const neu=w(alt,f(basis,'m'),{haut:true,frisur:true},()=>0);assert.equal(neu.haut,13);assert.equal(neu.frisur,18);assert.equal(neu.haar,0);assert.equal(neu.stil,2);assert.deepEqual(alt,kopie);assert.deepEqual(JSON.parse(JSON.stringify(neu)),neu);
});
test('Würfeln erreicht neue Varianten und bleibt innerhalb gültiger Optionen',async()=>{
 const {portraetOptionen:f,portraetWuerfeln:w}=await import('../portraet.js');const a=f(basis,'m');const z=w({},a,{},()=>.99999);
 for(const [k,werte] of Object.entries(a))assert(werte.includes(z[k]));assert.equal(z.frisur,19);assert.equal(z.details,4);assert.equal(z.bart,12);
});
