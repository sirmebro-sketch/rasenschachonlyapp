const {test}=require('node:test');const assert=require('node:assert/strict');
const basis={haut:14,haar:13,frisur:12,bart:10,kopf:10};
test('Porträtoptionen ergänzen Formen ohne gesperrte Altformen freizuschalten',async()=>{
 const {portraetOptionen:f}=await import('../portraet.js');const m=f(basis,'m');
 assert.deepEqual(m.frisur,[...Array.from({length:12},(_,i)=>i),...Array.from({length:15},(_,i)=>16+i)]);assert.equal(new Set(m.frisur).size,m.frisur.length);
 const w=f({...basis,frisur:10,bart:1},'w');assert.deepEqual(w.frisur.slice(-17),Array.from({length:17},(_,i)=>14+i));assert.deepEqual(w.bart,[0]);
});
test('Festgehaltene Merkmale bleiben beim Würfeln und JSON-Wiederladen erhalten',async()=>{
 const {portraetOptionen:f,portraetWuerfeln:w}=await import('../portraet.js');const alt={haut:13,haar:12,frisur:18,kopf:5};const kopie=JSON.parse(JSON.stringify(alt));
 const neu=w(alt,f(basis,'m'),{haut:true,frisur:true},()=>0);assert.equal(neu.haut,13);assert.equal(neu.frisur,18);assert.equal(neu.haar,0);assert.equal(neu.stil,2);assert.deepEqual(alt,kopie);assert.deepEqual(JSON.parse(JSON.stringify(neu)),neu);
});
test('Würfeln erreicht neue Varianten und bleibt innerhalb gültiger Optionen',async()=>{
 const {portraetOptionen:f,portraetWuerfeln:w}=await import('../portraet.js');const a=f(basis,'m');const z=w({},a,{},()=>.99999);
 for(const [k,werte] of Object.entries(a))assert(werte.includes(z[k]));assert.equal(z.frisur,30);assert.equal(z.details,8);assert.equal(z.bart,15);
});

test('Frisurenfreischaltung bewahrt alle alten Bonusformen und neue Kennungen',async()=>{
 const {portraetOptionen:f}=await import('../portraet.js');
 for(const [g,n,ende] of [['m',16,30],['w',14,30]]){
  const opts=f({...basis,frisur:n},g).frisur;
  assert.deepEqual(opts,Array.from({length:ende+1},(_,i)=>i));
 }
});

test('Neue Frisuren hängen geschlechtsspezifisch und mit stabilen Namen hinten an',async()=>{
 const {NEUE_FRISUREN:n,NEUE_FRISUREN_M:m,NEUE_FRISUREN_W:w,frisurName}=await import('../portraet.js');
 assert.deepEqual(n.slice(0,6),['Weiche Wellen','Kurze Naturkrause','Geflochtener Ansatz','Locken mit Seitenscheitel','Mittelscheitel mit Fall','Kurzer Fade']);
 assert.deepEqual(n.slice(6),['Lange Locs','Irokesenschnitt','Schulterlang glatt','Flechtkranz']);
 assert.deepEqual(m.slice(10),['Mittellange Locken','Lange Locken','Box Braids','Zurückgebundene Locs','Asymmetrischer Fringe']);
 assert.deepEqual(w.slice(10),['Vollpony','Curtain Bangs','Asymmetrischer Bob','Half-up','Langer Flechtzopf','Lange Wellen','Twin Buns']);
 assert.equal(frisurName(26,'m'),'Mittellange Locken');
 assert.equal(frisurName(27,'m'),'Lange Locken');
 assert.equal(frisurName(30,'m'),'Asymmetrischer Fringe');
 assert.equal(frisurName(24,'w'),'Vollpony');
 assert.equal(frisurName(30,'w'),'Twin Buns');
});

test('Accessoires bleiben gesperrt, alle Erweiterungen sind eindeutig',async()=>{
 const {portraetOptionen:f,PORTRAET_NAMEN:n}=await import('../portraet.js');
 const base={...basis,brauen:5,augen:5,nase:8,mund:7,ohren:3,wangen:3,schminke:5};
 assert.deepEqual(f({...base,schmuck:2},'m').schmuck,[0,1]);
 const a=f({...base,schmuck:6},'w');assert.deepEqual(a.schmuck,[0,1,2,3,4,5,6,7]);
 for(const [k,werte] of Object.entries(a)){assert.equal(werte.length,new Set(werte).size,k);if(n[k])for(const i of werte)assert(n[k][i],k+':'+i);}
});
