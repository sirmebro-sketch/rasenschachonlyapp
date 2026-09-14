const {test,before}=require('node:test');
const assert=require('node:assert/strict');
let S,L;
before(async()=>{[S,L]=await Promise.all([import('../sicherung.js'),import('../spielstand.js')]);});

function memory(initial={},fault=()=>false){
 const values=new Map(Object.entries(initial)),calls=[];
 const op=(type,key,value)=>{calls.push({type,key,value});if(fault(type,key,value,calls.length))throw Error('Test-Speicherfehler');};
 const adapter={
  get:async k=>{op('get',k);return values.has(k)?{value:values.get(k)}:null;},
  set:async(k,v)=>{op('set',k,v);values.set(k,v);},
  delete:async k=>{op('delete',k);values.delete(k);},
 };
 return {values,calls,adapter,store:S.serialisierterSpeicher(adapter)};
}
const original={a:'alt',b:'bleibt bis Import',fremd:'unberührt'};
const target={a:'neu',b:null,c:'hinzugefügt'};
const keys=['a','b','c'];
const content=m=>Object.fromEntries(m.values);

test('Fehler an jedem Speicherschritt: vollständiger alter Stand bleibt wiederherstellbar',async t=>{
 const baseline=memory(original);
 await S.datenErsetzen(baseline.store,target,keys,null,'35.171');
 assert.deepEqual(content(baseline),{a:'neu',c:'hinzugefügt',fremd:'unberührt'});
 for(let at=1;at<=baseline.calls.length;at++){
  const call=baseline.calls[at-1];
  await t.test(`${at}: ${call.type} ${call.key}`,async()=>{
   const m=memory(original,(_t,_k,_v,n)=>n===at);
   await assert.rejects(()=>S.datenErsetzen(m.store,target,keys,null,'35.171'));
   await S.importWiederherstellen(m.store,keys);
   assert.deepEqual(content(m),original);
  });
 }
});

test('Prozessabbruch nach jedem geschriebenen Teil: Neustart stellt alten Stand wieder her',async t=>{
 for(let written=0;written<=3;written++)await t.test(`${written} Teiländerungen`,async()=>{
  const journal=JSON.stringify({vorher:{a:'alt',b:'bleibt bis Import',c:null}});
  const m=memory({...original,[S.IMPORT_JOURNAL]:journal});
  for(const[k,v]of Object.entries(target).slice(0,written)){
   if(v===null)m.values.delete(k);else m.values.set(k,v);
  }
  assert.equal(await S.importWiederherstellen(m.store,keys),true);
  assert.deepEqual(content(m),original);
  assert.equal(await S.importWiederherstellen(m.store,keys),false);
 });
});

test('Fehlgeschlagene Rücksetzung blockiert weitere Buchungen bis zur Wiederherstellung',async()=>{
 let blocked=false;
 const m=memory(original,(type,key,value)=>{
  if(type==='set'&&key==='c'&&value==='hinzugefügt')blocked=true;
  return blocked&&type==='set';
 });
 await assert.rejects(()=>S.datenErsetzen(m.store,target,keys,null,'35.171'),e=>e.wiederherstellungOffen===true);
 assert(m.values.has(S.IMPORT_JOURNAL));
 await assert.rejects(()=>S.datenErsetzen(m.store,{a:'weiter'},['a'],null,'35.171'),/Wiederherstellung.*offen/);
 blocked=false;
 await S.importWiederherstellen(m.store,keys);
 assert.deepEqual(content(m),original);
});

test('Import und Rücknahme stellen auch gelöschte und neu angelegte Datensätze korrekt her',async()=>{
 const m=memory(original);
 const undo=await S.datenErsetzen(m.store,{c:'neu'},keys,'undo','35.171');
 assert(!m.values.has('a'));assert(!m.values.has('b'));
 await S.datenErsetzen(m.store,undo.daten,keys,'undo','35.171',true);
 assert.deepEqual(content(m),original);
});

test('Gleichzeitige Zugriffe beobachten keinen halbfertigen Transaktionsstand',async()=>{
 const m=memory({a:'0'});let release,entered;
 const barrier=new Promise(r=>release=r),start=new Promise(r=>entered=r);
 const transaction=m.store.transaktion(async s=>{await s.set('a','halb');entered();await barrier;await s.set('a','fertig');});
 await start;let readDone=false;
 const read=m.store.get('a').then(v=>{readDone=true;return v;});
 await Promise.resolve();assert.equal(readDone,false);
 release();await transaction;assert.equal((await read).value,'fertig');
});

test('Fehlerhafter Auftrag lässt spätere Speicherzugriffe weiterlaufen',async()=>{
 const m=memory({},(_t,_k,_v,n)=>n===1);
 await assert.rejects(()=>m.store.get('a'));
 await m.store.set('a','ok');assert.equal((await m.store.get('a')).value,'ok');
});

function eventFixture(){
 let effects=0;
 const a={id:'bleiben',altIndex:0,fx:()=>effects++},b={id:'wechseln',altIndex:1,fx:()=>effects++};
 const event={id:'angebot',choices:[a,b]};
 const p={name:'Test',seasons:[{year:2027,apps:28,note:2.3}]};
 const offers=[{club:{n:'Festes Angebot'},wage:0.3,years:3}];
 const ui={queue:[{...event,choices:[b,a],_ctx:{trainer:'Meyer'}}],ei:0,er:{text:'Bereits entschieden',extra:['Geld gebucht']},growth:{pac:1},offers};
 return {a,b,event,p,offers,ui,effects:()=>effects};
}
const roundtrip=x=>JSON.parse(JSON.stringify(x));

test('Neue Ereignisstände erhalten Auswahl und Ergebnis auch bei umgeordnetem Katalog',()=>{
 const f=eventFixture();const save=roundtrip(L.laufStand(f.p,'event',f.ui,[f.event],'35.171'));
 const r=L.laufWeiter(save,[{...f.event,choices:[f.b,f.a]}]);
 assert.deepEqual(r.queue[0].choices,[f.b,f.a]);assert.deepEqual(r.er,f.ui.er);
 assert.deepEqual(r.queue[0]._ctx,{trainer:'Meyer'});assert.equal(f.effects(),0);
});

test('Historische Auswahlindizes bleiben nach Umsortierung denselben Folgen zugeordnet',()=>{
 const f=eventFixture();const save={p:f.p,step:'event',ablauf:{schema:1,ei:0,queue:[{id:'angebot',wahlen:[0,1]}]}};
 const r=L.laufWeiter(save,[{...f.event,choices:[f.b,f.a]}]);
 assert.deepEqual(r.queue[0].choices,[f.a,f.b]);assert.equal(f.effects(),0);
});

for(const step of ['training','event','winter','result','retire'])test(`Fortsetzen in Phase ${step} erhält Entscheidungen und Saisonstand`,()=>{
 const f=eventFixture();const save=roundtrip(L.laufStand(f.p,step,{...f.ui,season:f.p.seasons[0]},[f.event],'35.171'));
 const r=L.laufWeiter(save,[f.event]);assert.equal(r.step,step);
 assert.deepEqual(r.growth,f.ui.growth);assert.deepEqual(r.er,f.ui.er);
 assert.deepEqual(r.season,f.p.seasons[0]);
 assert.deepEqual(r.offers,['winter','result'].includes(step)?f.offers:null);
 assert.equal(f.effects(),0);
});

test('Aktuelle Saisonbilanz gewinnt gegen einen veralteten UI-Rückblick',()=>{
 const f=eventFixture();const save=L.laufStand(f.p,'result',{season:{year:1999,apps:0}},[f.event],'35.171');
 assert.deepEqual(L.laufWeiter(roundtrip(save),[f.event]).season,f.p.seasons[0]);
});

test('Fehlende oder doppelte Auswahlkennungen verhindern falsche Ereignisfolgen',()=>{
 const f=eventFixture();const make=ids=>({p:f.p,step:'event',ablauf:{schema:2,ei:0,queue:[{id:'angebot',auswahlIds:ids}]}});
 for(const ids of [[],['bleiben','bleiben'],['verschwunden']])assert.throws(()=>L.laufWeiter(make(ids),[f.event]));
 assert.throws(()=>L.laufWeiter(make(['bleiben']),[]));
 assert.equal(f.effects(),0);
});

test('Unbekanntes Ablauf-Format und fehlende Ergebnisse werden nicht still fortgesetzt',()=>{
 assert.throws(()=>L.laufWeiter({p:{seasons:[]},ablauf:{schema:999}},[]));
 assert.throws(()=>L.laufWeiter({p:{seasons:[]},step:'event'},[]));
 assert.throws(()=>L.laufWeiter({p:{seasons:[]},step:'result'},[]));
 assert.equal(L.laufWeiter({p:{seasons:[]}},[]).step,'training');
});

test('Backup-Leser weist kaputte und neuere Pakete zurück und übernimmt nur erlaubte Schlüssel',()=>{
 const pack={spiel:'rasenschach',v:'35.171',daten:{'rasenschach:halle':'[]',fremd:'"nicht übernehmen"'}};
 assert.deepEqual(S.backupLesen(JSON.stringify(pack),['rasenschach:halle'],'35.171'),{'rasenschach:halle':'[]'});
 assert.throws(()=>S.backupLesen(JSON.stringify({...pack,v:'35.172'}),['rasenschach:halle'],'35.171'));
 assert.throws(()=>S.backupLesen(JSON.stringify({...pack,daten:{'rasenschach:halle':'kaputt'}}),['rasenschach:halle'],'35.171'));
});
