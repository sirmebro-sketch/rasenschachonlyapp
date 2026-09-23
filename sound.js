/* Originale kurze Klangzeichen für die Offline-App. Keine Autoplay-Musik.
   Die Einstellung gehört zum bestehenden Settings-Speicher, nicht zum Spielstand. */
export const SOUND_KEY = "rasenschach:sound";
const FILES = Object.freeze({
  tap: "tap", navigate: "navigate", confirm: "confirm", training: "training",
  event: "event", setback: "setback", whistle: "whistle", season: "season",
  goal: "goal", trophy: "trophy", pack: "pack", reveal: "reveal",
  wildcard: "wildcard", transfer: "transfer", flip: "flip", farewell: "farewell",
});
let level = 1; // 0 = aus, 1 = leise (Vorgabe), 2 = normal.
let active = [];
const last = new Map();

export function getSoundLevel() { return level; }
export function setSoundLevel(value) {
  level = [0, 1, 2].includes(Number(value)) ? Number(value) : 1;
  if (!level) {
    for (const a of active) { try { a.pause(); a.currentTime = 0; } catch (_) {} }
    active = [];
  }
}

export function playSound(name) {
  if (!level || !Object.hasOwn(FILES, name) || typeof Audio === "undefined" ||
      (typeof document !== "undefined" && document.hidden)) return;
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  // Rasche Doppeleingaben nicht zu einer Tonkette anwachsen lassen.
  if (now - (last.get(name) ?? -Infinity) < (name === "tap" ? 90 : 160)) return;
  last.set(name, now);
  try {
    const audio = new Audio((import.meta.env?.BASE_URL || "/") + "sounds/" + FILES[name] + ".mp3");
    audio.volume = level === 1 ? .23 : .43;
    active = active.filter((item) => !item.ended);
    if (active.length >= 4) { const oldest = active.shift(); oldest.pause(); }
    active.push(audio);
    const started = audio.play();
    if (started?.catch) started.catch(() => { active = active.filter((item) => item !== audio); });
  } catch (_) { /* Gesperrte/fehlende Audioausgabe darf das Spiel nicht stören. */ }
}

export function installSoundButtons(root = document) {
  const click = (e) => {
    const el = e.target?.closest?.("button, [role='button']");
    if (!el || el.disabled || el.getAttribute("aria-disabled") === "true") return;
    const cue = el.dataset.sound || (el.classList.contains("pri") ? "confirm" :
      el.classList.contains("zahnrad") ? "navigate" : "tap");
    if (cue !== "none") playSound(cue);
  };
  root.addEventListener("click", click, true); // Auch Tastatur und Portale.
  return () => root.removeEventListener("click", click, true);
}
