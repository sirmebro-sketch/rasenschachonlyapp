import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const STARTBILD_TOKEN = "__RASENSCHACH_STARTBILD__";
const startbildBase64 = readFileSync(new URL("./startbild.b64", import.meta.url), "utf8").trim();

const startbildInline = {
  name: "rasenschach-startbild-inline",
  transformIndexHtml(html) {
    return html.replace(STARTBILD_TOKEN, `data:image/webp;base64,${startbildBase64}`);
  },
};

export default defineConfig({
  plugins: [startbildInline, react()],
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  base: "./",            // relative Pfade, damit es auch in der App-Hülle läuft
  build: { outDir: "dist", assetsInlineLimit: 0 },
});
