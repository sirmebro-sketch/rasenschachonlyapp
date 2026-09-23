const { test } = require('node:test');
const assert = require('node:assert/strict');

test('Klangregler verstummt sofort und startet erst nach erneuter Freigabe', async () => {
  const { playSound, setSoundLevel } = await import('../sound.js');
  const oldAudio = global.Audio;
  const oldDocument = global.document;
  const played = [];
  global.document = { hidden: false };
  global.Audio = class {
    constructor(src) { this.src = src; this.paused = false; played.push(this); }
    play() { return Promise.resolve(); }
    pause() { this.paused = true; }
  };
  try {
    setSoundLevel(2);
    playSound('pack');
    assert.match(played[0].src, /sounds\/pack\.mp3$/);
    assert.equal(played[0].volume, .43);
    setSoundLevel(0);
    assert.equal(played[0].paused, true);
    playSound('trophy');
    assert.equal(played.length, 1);
    setSoundLevel(1);
    playSound('trophy');
    assert.equal(played[1].volume, .23);
    global.document.hidden = true;
    playSound('farewell');
    assert.equal(played.length, 2);
  } finally {
    setSoundLevel(0);
    global.Audio = oldAudio;
    global.document = oldDocument;
  }
});

test('Gesperrte Tasten und Stummschalter spielen keinen Standardton', async () => {
  const { installSoundButtons, setSoundLevel } = await import('../sound.js');
  const oldAudio = global.Audio;
  const oldDocument = global.document;
  let count = 0;
  let click;
  const root = {
    addEventListener(type, listener) { if (type === 'click') click = listener; },
    removeEventListener(type) { if (type === 'click') click = null; },
  };
  global.document = { hidden: false };
  global.Audio = class { constructor() { count++; } play() { return Promise.resolve(); } };
  try {
    setSoundLevel(1);
    const uninstall = installSoundButtons(root);
    const target = (disabled, sound) => ({
      closest: () => ({ disabled, dataset: { sound }, classList: { contains: () => false },
        getAttribute: () => null }),
    });
    click({ target: target(true, undefined) });
    click({ target: target(false, 'none') });
    assert.equal(count, 0);
    click({ target: target(false, 'navigate') });
    assert.equal(count, 1);
    uninstall();
    assert.equal(click, null);
  } finally {
    setSoundLevel(0);
    global.Audio = oldAudio;
    global.document = oldDocument;
  }
});

test('Laufende Klänge folgen der Lautstärke und stoppen beim Verbergen', async () => {
  const { playSound, setSoundLevel, installSoundButtons } = await import('../sound.js');
  const oldAudio = global.Audio, oldDocument = global.document;
  const listeners = {}, sounds = [];
  const root = { hidden:false, addEventListener:(k,v)=>{listeners[k]=v;}, removeEventListener:k=>{delete listeners[k];} };
  global.document=root;
  global.Audio=class { constructor(){sounds.push(this);} play(){return Promise.resolve();} pause(){this.paused=true;} };
  try {
    const remove=installSoundButtons(root);
    setSoundLevel(2); playSound('season');
    assert.equal(sounds.length,1);
    setSoundLevel(1); assert.equal(sounds[0].volume,.23);
    root.hidden=true; listeners.visibilitychange();
    assert.equal(sounds[0].paused,true);
    playSound('event'); assert.equal(sounds.length,1);
    root.hidden=false; listeners.visibilitychange(); assert.equal(sounds.length,1,'kein automatisches Fortsetzen');
    remove(); assert.deepEqual(listeners,{});
  } finally {setSoundLevel(0); global.Audio=oldAudio;global.document=oldDocument;}
});

test('Musik startet nur nach Bedienung, wechselt weich und kehrt nicht selbsttätig aus dem Hintergrund zurück', async () => {
  const { installSoundButtons, setSoundLevel, setMusicLevel, setMusicContext } = await import('../sound.js');
  const oldAudio=global.Audio, oldDocument=global.document;
  const handlers={}, started=[];
  const root={hidden:false,addEventListener:(k,v)=>{handlers[k]=v;},removeEventListener:(k)=>{delete handlers[k];}};
  global.document=root;
  global.Audio=class {
    constructor(src){this.src=src;this.volume=0;this.paused=true;this.loop=false;started.push(this);}
    play(){this.paused=false;return Promise.resolve();}
    pause(){this.paused=true;}
  };
  try {
    setSoundLevel(0);setMusicLevel(0);setMusicContext('menu');
    const remove=installSoundButtons(root);
    setMusicLevel(1);
    assert.equal(started.length,0,'keine Wiedergabe allein durch gespeicherte Einstellung');
    const click=()=>handlers.click({target:{closest:()=>null}});
    click();
    assert.match(started[0].src,/music\/ankommen\.ogg$/);
    assert.equal(started[0].loop,true);
    setMusicContext('career');
    assert.match(started[1].src,/music\/karriere\.ogg$/);
    setMusicContext('career');
    assert.equal(started.length,2,'Seitenwechsel innerhalb der Karriere startet keinen neuen Track');
    root.hidden=true;handlers.visibilitychange();
    assert.equal(started[1].paused,true);
    root.hidden=false;handlers.visibilitychange();
    assert.equal(started[1].paused,true,'Hintergrundrückkehr darf Podcast nicht verdrängen');
    click();
    assert.equal(started[1].paused,false);
    setMusicLevel(0);
    assert.equal(started[1].paused,true);
    remove();
  } finally {setMusicLevel(0);setSoundLevel(0);global.Audio=oldAudio;global.document=oldDocument;}
});

test('Ein großer Erfolg blockiert schnelle Klickfolgen und derselbe Klang wird gedrosselt', async () => {
  const {playSound,setSoundLevel,installSoundButtons}=await import('../sound.js');
  const oldAudio=global.Audio,oldDocument=global.document,oldPerformance=global.performance;
  const sounds=[];let clock=10000;
  global.performance={now:()=>clock};
  global.document={hidden:false,addEventListener(){},removeEventListener(){}};
  global.Audio=class {
    constructor(src){this.src=src;this.paused=false;sounds.push(this);}
    play(){return Promise.resolve();}pause(){this.paused=true;}
  };
  try {
    const remove=installSoundButtons(global.document);
    setSoundLevel(1);
    playSound('champion');
    clock+=50;playSound('tap');playSound('progress');playSound('champion');
    assert.equal(sounds.length,1,'kein Klanggemisch in der Erfolgssequenz');
    clock+=200;playSound('champion');
    assert.equal(sounds.length,2,'späterer eigener Erfolg kann ertönen');
    remove();
  } finally {setSoundLevel(0);global.Audio=oldAudio;global.document=oldDocument;global.performance=oldPerformance;}
});
