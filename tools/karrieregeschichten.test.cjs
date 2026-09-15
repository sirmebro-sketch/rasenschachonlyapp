const {test}=require('node:test');const assert=require('node:assert/strict');
test('Persönlicher Rückblick erfindet keine Entscheidung aus gezogenen Ereignissen',async()=>{
 const {persoenlicherRueckblick:f}=await import('../karrieregeschichten.js');
 assert.deepEqual(f({evLog:{video_abschied:20}}),[]);
 const p={retired:true,vorsatz:'lange',seasons:Array(10).fill({}),videoKontakt:{name:'Alex'},flags:{mentorSpur:true},straenge:{buch:{stufe:3,weg:'kontrolle'}}};
 const a=f(p);assert.equal(a.length,3);assert(a[0].includes('erfüllt'));assert(a[1].includes('Alex'));assert(a[2].includes('privat'));
 assert.deepEqual(f(JSON.parse(JSON.stringify(p))),a);
});
