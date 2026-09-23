/* One mixer for short cues and optional, lazy background music. */
export const SOUND_KEY = "rasenschach:sound";
export const MUSIC_KEY = "rasenschach:music";
const FILES = Object.freeze({
  tap:1, tap_2:1, tap_3:1, navigate:1, back:1, confirm:1, denied:1, save:1,
  buy:1, sell:1, unlock:1, progress:1, breakthrough:1, milestone:1, champion:1,
  training:1, event:1, setback:1, injury:1, whistle:1, season:1, goal:1,
  trophy:1, pack:1, pack_open:1, pack_tension:1, card_bronze:1,
  card_silver:1, card_gold:1, card_legendary:1, reveal:1, wildcard:1,
  transfer:1, flip:1, farewell:1,
});
const TRACKS = Object.freeze({menu:"ankommen", career:"karriere", climax:"endspurt"});
const MAJOR = new Set(["champion","trophy","farewell","milestone","card_legendary"]);
const REWARD = new Set(["goal","breakthrough","unlock","card_gold","wildcard"]);
const TRIM = Object.freeze({tap:.43,tap_2:.67,tap_3:.69,navigate:.61,back:.58,
  pack_tension:.65,progress:.73});
const url = (folder,name,ext) => (import.meta.env?.BASE_URL || "/") + folder + "/" + name + ext;
const nowMs = () => typeof performance !== "undefined" ? performance.now() : Date.now();
let soundLevel=1, musicLevel=0, context="menu", gestureReady=false;
let active=[], music=null, outgoing=null, mixTimer=null, duckTimer=null;
let duck=1, variant=0, majorUntil=0;
const last = new Map();
const gain = (name) => (soundLevel === 1 ? .23 : .43) * (TRIM[name] ?? 1);
const stopCue = (item) => { try { item.audio.pause(); item.audio.currentTime=0; } catch (_) {} };

export function stopSounds() {
  active.forEach(stopCue); active=[]; majorUntil=0; last.clear();
  if (duckTimer) clearTimeout(duckTimer);
  duckTimer=null; duck=1; mix();
}
export function getSoundLevel() { return soundLevel; }
export function getMusicLevel() { return musicLevel; }
export function setSoundLevel(value) {
  soundLevel = [0,1,2].includes(Number(value)) ? Number(value) : 1;
  if (!soundLevel) stopSounds();
  else active.forEach((item) => { try { item.audio.volume=gain(item.name); } catch (_) {} });
}
function target() { return (musicLevel === 1 ? .14 : musicLevel === 2 ? .26 : 0) * duck; }
function mix() {
  if (mixTimer) clearTimeout(mixTimer);
  mixTimer=null;
  if (music) music.volume=Math.max(0,Math.min(1,(music.volume||0)+(target()-(music.volume||0))*.19));
  if (outgoing) outgoing.volume=Math.max(0,(outgoing.volume||0)*.82-.0008);
  if (outgoing && outgoing.volume<.003) {
    outgoing.pause(); outgoing.src=""; outgoing=null;
  }
  if (outgoing || (music && Math.abs(music.volume-target())>.003)) mixTimer=setTimeout(mix,45);
}
function pauseMusic() {
  if (mixTimer) clearTimeout(mixTimer);
  mixTimer=null;
  if (music) { try { music.pause(); music.volume=0; } catch (_) {} }
  if (outgoing) { outgoing.pause(); outgoing.src=""; outgoing=null; }
}
function clearMusic() { pauseMusic(); if (music) { music.src=""; music=null; } }
function startMusic() {
  if (!musicLevel || !gestureReady || typeof Audio==="undefined" ||
      (typeof document!=="undefined" && document.hidden)) return;
  const name=TRACKS[context];
  if (music?._track===name) {
    if (music.paused) {
      music.volume=0;
      const started=music.play();
      started?.catch?.(() => pauseMusic());
    }
    mix(); return;
  }
  if (outgoing) { outgoing.pause(); outgoing.src=""; outgoing=null; }
  outgoing=music;
  music=new Audio(url("music",name,".ogg"));
  music._track=name; music.loop=true; music.preload="auto"; music.volume=0;
  const current=music;
  try {
    const started=music.play();
    started?.catch?.(() => { if (music===current) clearMusic(); });
  } catch (_) { clearMusic(); return; }
  mix();
}
export function setMusicLevel(value) {
  musicLevel=[0,1,2].includes(Number(value)) ? Number(value) : 0;
  if (!musicLevel) clearMusic(); else startMusic();
}
export function setMusicContext(value) {
  if (!Object.hasOwn(TRACKS,value) || value===context) return;
  context=value;
  if (musicLevel && gestureReady) startMusic();
}
export function playSound(name) {
  if (!soundLevel || !Object.hasOwn(FILES,name) || typeof Audio==="undefined" ||
      (typeof document!=="undefined" && document.hidden)) return;
  const now=nowMs();
  if (name==="tap") name=["tap","tap_2","tap_3"][variant++%3];
  const priority=MAJOR.has(name)?3:REWARD.has(name)?2:1;
  if (now<majorUntil && priority<3) return;
  const category=name.startsWith("tap")?"tap":name;
  if (now-(last.get(category)??-Infinity)<(category==="tap"?100:175)) return;
  last.set(category,now);
  active=active.filter((item)=>!item.audio.ended && item.audio.paused!==true);
  if (priority===1 && active.some((item)=>item.priority>=2)) return;
  if (priority===3) {
    active.forEach(stopCue);active=[];
    majorUntil=now+950;
  } else if (priority===2) {
    active.filter((item)=>item.priority>=2).forEach(stopCue);
    active=active.filter((item)=>item.priority<2);
  }
  if (active.length>=3) {
    const weakest=active.reduce((a,b)=>a.priority<=b.priority?a:b);
    if (weakest.priority>priority) return;
    stopCue(weakest); active=active.filter((item)=>item!==weakest);
  }
  try {
    const audio=new Audio(url("sounds",name,".mp3"));
    audio.volume=gain(name);
    const item={audio,name,priority}; active.push(item);
    if (priority>=2) {
      duck=.48; mix();
      if (duckTimer) clearTimeout(duckTimer);
      duckTimer=setTimeout(()=>{duck=1;mix();duckTimer=null;},priority===3?1700:900);
    }
    const started=audio.play();
    started?.catch?.(()=>{active=active.filter((entry)=>entry!==item);});
  } catch (_) { /* Missing audio cannot interrupt a decision or save. */ }
}
export function installSoundButtons(root=document) {
  const click=(e)=>{
    gestureReady=true;
    if (musicLevel && (!music || music.paused)) startMusic();
    const el=e.target?.closest?.("button, [role='button']");
    if (!el || el.disabled || el.getAttribute("aria-disabled")==="true") return;
    const label=el.textContent?.trim()||"";
    const cue=el.dataset.sound || (/^(Zurück|Schließen|Doch nicht)$/.test(label)?"back":
      el.classList.contains("pri")?"confirm":
      el.classList.contains("zahnrad")?"navigate":"tap");
    if (cue!=="none") playSound(cue);
  };
  root.addEventListener("click",click,true);
  const hidden=()=>{
    if (root.hidden) {gestureReady=false;stopSounds();pauseMusic();}
    // Resume only after the next in-app touch; never surprise a podcast on return.
  };
  root.addEventListener("visibilitychange",hidden);
  return ()=>{
    root.removeEventListener("click",click,true);
    root.removeEventListener("visibilitychange",hidden);
    stopSounds();clearMusic();if (duckTimer) clearTimeout(duckTimer);
  };
}
