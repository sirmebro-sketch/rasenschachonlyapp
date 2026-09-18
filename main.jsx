import React from "react";
import { createRoot } from "react-dom/client";
import Rasenschach from "./App.jsx";
import "./charakter-ui.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Rasenschach />
  </React.StrictMode>
);

// Das Bild bleibt kurz sichtbar, verdeckt aber keinen langsamen Start endlos:
// Laedt das Bundle laenger als die Mindestdauer, beginnt die Blende direkt
// nach dem ersten Render-Auftrag. So ist der Start ruhig statt kuenstlich traege.
const startupSplash = document.getElementById("app-startup-splash");
if (startupSplash) {
  const startedAt = Number(window.__RASENSCHACH_SPLASH_STARTED__) || performance.now();
  const minimumVisibleMs = 2200;
  const elapsedMs = Math.max(0, performance.now() - startedAt);
  window.setTimeout(() => {
    startupSplash.classList.add("is-hiding");
    window.setTimeout(() => startupSplash.remove(), 300);
  }, Math.max(0, minimumVisibleMs - elapsedMs));
}
