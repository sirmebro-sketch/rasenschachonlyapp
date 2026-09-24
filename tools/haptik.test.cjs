const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const src=fs.readFileSync('App.jsx','utf8');
function pruefstand(){
 const events=new Map(),impulse=[];let now=1000,cleanup;
 const ctx=vm.createContext({RUHE:false,VIBRATION:true,Date:{now:()=>now},navigator:{vibrate:v=>impulse.push(v)},
  document:{addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name)},
  useEffect:fn=>{cleanup=fn();}});
 const constants=src.slice(src.indexOf('const HAP ='),src.indexOf('/* Android gibt die Wachsperre'));
 const fn=src.slice(src.indexOf('function haptik(art)'),src.indexOf('/* Nach einem Reiterwechsel'));
 const start=src.indexOf('  useEffect(() => {',src.indexOf('/* 24.09.2026: Erst eine aktivierte'));
 const effect=src.slice(start,src.indexOf('  useEffect(() => { if (topRef.current)',start));
 vm.runInContext(constants+fn+effect,ctx);
 const button=({disabled=false,aria=false,primary=false}={})=>({disabled,getAttribute:()=>aria?'true':null,classList:{contains:()=>primary}});
 const fire=(event,btn=button())=>events.get(event)?.({target:{closest:()=>btn}});
 return {ctx,impulse,events,button,fire,advance:()=>{now+=200;},cleanup:()=>cleanup()};
}
test('Nur Betätigung meldet Haptik: Scrollbeginn stumm, Kachel kurz, Kauf stärker',()=>{
 const p=pruefstand();p.fire('pointerdown');assert.deepEqual(p.impulse,[]);
 p.fire('click');assert.deepEqual(p.impulse,[8]);p.advance();
 p.fire('click',p.button({primary:true}));assert.deepEqual(p.impulse,[8,14]);
 p.cleanup();assert.equal(p.events.size,0);
});
test('Gesperrte Aktionen sowie Ruhe und Vibration aus bleiben stumm',()=>{
 const p=pruefstand();p.fire('click',p.button({disabled:true}));p.fire('click',p.button({aria:true}));
 p.ctx.RUHE=true;p.fire('click');p.ctx.RUHE=false;p.ctx.VIBRATION=false;p.fire('click');
 assert.deepEqual(p.impulse,[]);p.ctx.VIBRATION=true;p.fire('click');assert.deepEqual(p.impulse,[8]);
});
test('Einzelhandler und zentrale Rückmeldung erzeugen keinen doppelten Impuls',()=>{
 const p=pruefstand();p.fire('click');vm.runInContext('haptik("tipp")',p.ctx);assert.deepEqual(p.impulse,[8]);
});
test('Android deklariert die benötigte Vibrationsberechtigung',()=>{
 assert.match(fs.readFileSync('android/app/src/main/AndroidManifest.xml','utf8'),/<uses-permission android:name="android.permission.VIBRATE"\s*\/>/);
});
